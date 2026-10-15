const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { logAuditEvent } = require('../utils/audit');

const router = express.Router();

// GET /api/academics/assignments
router.get('/assignments', authenticate, async (req, res, next) => {
  try {
    const { courseOfferingId, status, type } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (req.user.role === 'student') {
      // Students see published assignments from their enrolled sections
      conditions.push(`a.status = 'published'`);
      const studentRes = await query(
        `SELECT e.section_id FROM students s
         JOIN enrolments e ON e.student_id = s.id AND e.status = 'active'
         WHERE s.user_account_id = $1`,
        [req.user.id]
      );
      if (studentRes.rows.length > 0) {
        conditions.push(`co.section_id = $${paramIdx++}`);
        params.push(studentRes.rows[0].section_id);
      }
    } else if (req.user.role === 'teacher') {
      const staffRes = await query('SELECT id FROM staff WHERE user_account_id = $1', [req.user.id]);
      if (staffRes.rows.length > 0) {
        conditions.push(`a.course_offering_id IN (SELECT course_offering_id FROM teacher_assignments WHERE staff_id = $${paramIdx++} AND status = 'active')`);
        params.push(staffRes.rows[0].id);
      }
    }

    if (courseOfferingId) { conditions.push(`a.course_offering_id = $${paramIdx++}`); params.push(courseOfferingId); }
    if (status && req.user.role !== 'student') { conditions.push(`a.status = $${paramIdx++}`); params.push(status); }
    if (type) { conditions.push(`a.type = $${paramIdx++}`); params.push(type); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT a.*, sub.name as subject_name, sec.name as section_name, gl.name as grade_name,
              u.first_name || ' ' || u.last_name as created_by_name,
              (SELECT COUNT(*) FROM submissions sub2 WHERE sub2.assignment_id = a.id) as submission_count
       FROM assignments a
       JOIN course_offerings co ON co.id = a.course_offering_id
       JOIN subjects sub ON sub.id = co.subject_id
       JOIN sections sec ON sec.id = co.section_id
       JOIN grade_levels gl ON gl.id = sec.grade_level_id
       LEFT JOIN user_accounts u ON u.id = a.created_by
       ${where}
       ORDER BY a.due_date DESC NULLS LAST, a.created_at DESC`,
      params
    );

    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/academics/assignments
router.post('/assignments', authenticate, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const { courseOfferingId, title, description, type, dueDate, totalMarks, status } = req.body;
    const { rows } = await query(
      `INSERT INTO assignments (course_offering_id, title, description, type, due_date, total_marks, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [courseOfferingId, title, description, type || 'homework', dueDate, totalMarks, status || 'draft', req.user.id]
    );
    await logAuditEvent(req.user.id, 'create_assignment', 'assignment', rows[0].id, { title }, req.ip);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// PUT /api/academics/assignments/:id
router.put('/assignments/:id', authenticate, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const { title, description, type, dueDate, totalMarks, status } = req.body;
    const { rows } = await query(
      `UPDATE assignments SET title = COALESCE($1, title), description = COALESCE($2, description),
       type = COALESCE($3, type), due_date = COALESCE($4, due_date), total_marks = COALESCE($5, total_marks),
       status = COALESCE($6, status), updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [title, description, type, dueDate, totalMarks, status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Assignment not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/academics/submissions
router.post('/submissions', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const { assignmentId, content } = req.body;
    const studentRes = await query('SELECT id FROM students WHERE user_account_id = $1', [req.user.id]);
    if (studentRes.rows.length === 0) return res.status(404).json({ error: 'Student record not found' });

    const { rows } = await query(
      `INSERT INTO submissions (assignment_id, student_id, content, status)
       VALUES ($1, $2, $3, 'submitted')
       ON CONFLICT (assignment_id, student_id) DO UPDATE SET content = $3, submitted_at = NOW(), updated_at = NOW()
       RETURNING *`,
      [assignmentId, studentRes.rows[0].id, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// GET /api/academics/submissions/:assignmentId
router.get('/submissions/:assignmentId', authenticate, async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      const studentRes = await query('SELECT id FROM students WHERE user_account_id = $1', [req.user.id]);
      if (studentRes.rows.length > 0) {
        const { rows } = await query(
          `SELECT * FROM submissions WHERE assignment_id = $1 AND student_id = $2`,
          [req.params.assignmentId, studentRes.rows[0].id]
        );
        return res.json(rows);
      }
    }

    const { rows } = await query(
      `SELECT sub.*, s.first_name || ' ' || s.last_name as student_name, s.admission_number
       FROM submissions sub
       JOIN students s ON s.id = sub.student_id
       WHERE sub.assignment_id = $1
       ORDER BY sub.submitted_at`,
      [req.params.assignmentId]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// PUT /api/academics/submissions/:id/grade - Grade a submission
router.put('/submissions/:id/grade', authenticate, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const { marksObtained, feedback } = req.body;
    const { rows } = await query(
      `UPDATE submissions SET marks_obtained = $1, feedback = $2, graded_by = $3, graded_at = NOW(),
       status = 'graded', updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [marksObtained, feedback, req.user.id, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// GET /api/academics/assessments
router.get('/assessments', authenticate, async (req, res, next) => {
  try {
    const { courseOfferingId, termId, status } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (req.user.role === 'student') {
      conditions.push(`as2.status = 'published'`);
      const studentRes = await query(
        `SELECT e.section_id FROM students s
         JOIN enrolments e ON e.student_id = s.id AND e.status = 'active'
         WHERE s.user_account_id = $1`, [req.user.id]
      );
      if (studentRes.rows.length > 0) {
        conditions.push(`co.section_id = $${paramIdx++}`);
        params.push(studentRes.rows[0].section_id);
      }
    }

    if (courseOfferingId) { conditions.push(`as2.course_offering_id = $${paramIdx++}`); params.push(courseOfferingId); }
    if (termId) { conditions.push(`as2.term_id = $${paramIdx++}`); params.push(termId); }
    if (status && req.user.role !== 'student') { conditions.push(`as2.status = $${paramIdx++}`); params.push(status); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT as2.*, sub.name as subject_name, sec.name as section_name, gl.name as grade_name,
              t.name as term_name
       FROM assessments as2
       JOIN course_offerings co ON co.id = as2.course_offering_id
       JOIN subjects sub ON sub.id = co.subject_id
       JOIN sections sec ON sec.id = co.section_id
       JOIN grade_levels gl ON gl.id = sec.grade_level_id
       LEFT JOIN terms t ON t.id = as2.term_id
       ${where}
       ORDER BY as2.exam_date DESC NULLS LAST`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/academics/assessments
router.post('/assessments', authenticate, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const { courseOfferingId, termId, name, type, totalMarks, weightage, examDate } = req.body;
    const { rows } = await query(
      `INSERT INTO assessments (course_offering_id, term_id, name, type, total_marks, weightage, exam_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [courseOfferingId, termId, name, type || 'exam', totalMarks, weightage || 100, examDate, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/academics/grades/bulk - Bulk record grades
router.post('/grades/bulk', authenticate, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const { assessmentId, grades } = req.body;
    const results = [];

    for (const g of grades) {
      const { rows } = await query(
        `INSERT INTO grade_records (assessment_id, student_id, marks_obtained, grade, remarks, recorded_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (assessment_id, student_id) DO UPDATE SET
           marks_obtained = $3, grade = $4, remarks = $5, recorded_by = $6,
           version = grade_records.version + 1, updated_at = NOW()
         RETURNING *`,
        [assessmentId, g.studentId, g.marksObtained, g.grade, g.remarks, req.user.id]
      );
      results.push(rows[0]);
    }

    await logAuditEvent(req.user.id, 'record_grades', 'assessment', assessmentId,
      { count: grades.length }, req.ip);
    res.json(results);
  } catch (err) { next(err); }
});

// POST /api/academics/assessments/:id/publish
router.post('/assessments/:id/publish', authenticate, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    await query(
      `UPDATE assessments SET status = 'published', updated_at = NOW() WHERE id = $1`,
      [req.params.id]
    );
    await query(
      `UPDATE grade_records SET status = 'published', published_by = $1, published_at = NOW(), updated_at = NOW()
       WHERE assessment_id = $2`,
      [req.user.id, req.params.id]
    );
    await logAuditEvent(req.user.id, 'publish_results', 'assessment', req.params.id, {}, req.ip);
    res.json({ message: 'Results published successfully' });
  } catch (err) { next(err); }
});

// GET /api/academics/grades/student/:studentId
router.get('/grades/student/:studentId', authenticate, async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      const studentCheck = await query('SELECT id FROM students WHERE user_account_id = $1', [req.user.id]);
      if (studentCheck.rows.length === 0 || studentCheck.rows[0].id !== req.params.studentId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    let statusFilter = '';
    if (req.user.role === 'student') {
      statusFilter = "AND gr.status = 'published'";
    }

    const { rows } = await query(
      `SELECT gr.*, as2.name as assessment_name, as2.type as assessment_type,
              as2.total_marks, as2.exam_date, sub.name as subject_name, t.name as term_name
       FROM grade_records gr
       JOIN assessments as2 ON as2.id = gr.assessment_id
       JOIN course_offerings co ON co.id = as2.course_offering_id
       JOIN subjects sub ON sub.id = co.subject_id
       LEFT JOIN terms t ON t.id = as2.term_id
       WHERE gr.student_id = $1 ${statusFilter}
       ORDER BY as2.exam_date DESC NULLS LAST`,
      [req.params.studentId]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/academics/timetable - Get schedule slots
router.get('/timetable', authenticate, async (req, res, next) => {
  try {
    const { sectionId } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (req.user.role === 'student') {
      const studentRes = await query(
        `SELECT e.section_id FROM students s
         JOIN enrolments e ON e.student_id = s.id AND e.status = 'active'
         WHERE s.user_account_id = $1`, [req.user.id]
      );
      if (studentRes.rows.length > 0) {
        conditions.push(`co.section_id = $${paramIdx++}`);
        params.push(studentRes.rows[0].section_id);
      }
    } else if (sectionId) {
      conditions.push(`co.section_id = $${paramIdx++}`);
      params.push(sectionId);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT ss.*, sub.name as subject_name, sec.name as section_name,
              gl.name as grade_name, st.first_name || ' ' || st.last_name as teacher_name
       FROM schedule_slots ss
       JOIN course_offerings co ON co.id = ss.course_offering_id
       JOIN subjects sub ON sub.id = co.subject_id
       JOIN sections sec ON sec.id = co.section_id
       JOIN grade_levels gl ON gl.id = sec.grade_level_id
       LEFT JOIN teacher_assignments ta ON ta.course_offering_id = co.id AND ta.status = 'active'
       LEFT JOIN staff st ON st.id = ta.staff_id
       ${where}
       ORDER BY ss.day_of_week, ss.start_time`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
