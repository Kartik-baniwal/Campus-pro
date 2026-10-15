const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { logAuditEvent } = require('../utils/audit');

const router = express.Router();

// GET /api/attendance/sessions - List attendance sessions
router.get('/sessions', authenticate, async (req, res, next) => {
  try {
    const { sectionId, date, courseOfferingId, status } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    // Teachers see only their assigned classes
    if (req.user.role === 'teacher') {
      const staffRes = await query('SELECT id FROM staff WHERE user_account_id = $1', [req.user.id]);
      if (staffRes.rows.length > 0) {
        conditions.push(`(ass.course_offering_id IN (
          SELECT course_offering_id FROM teacher_assignments WHERE staff_id = $${paramIdx++} AND status = 'active'
        ) OR ass.section_id IN (
          SELECT co.section_id FROM teacher_assignments ta 
          JOIN course_offerings co ON co.id = ta.course_offering_id 
          WHERE ta.staff_id = $${paramIdx - 1} AND ta.status = 'active'
        ))`);
        params.push(staffRes.rows[0].id);
      }
    }

    if (sectionId) { conditions.push(`ass.section_id = $${paramIdx++}`); params.push(sectionId); }
    if (date) { conditions.push(`ass.session_date = $${paramIdx++}`); params.push(date); }
    if (courseOfferingId) { conditions.push(`ass.course_offering_id = $${paramIdx++}`); params.push(courseOfferingId); }
    if (status) { conditions.push(`ass.status = $${paramIdx++}`); params.push(status); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT ass.*, sec.name as section_name, gl.name as grade_name,
              sub.name as subject_name, u.first_name || ' ' || u.last_name as marked_by_name,
              (SELECT COUNT(*) FROM attendance_records ar WHERE ar.attendance_session_id = ass.id) as total_records
       FROM attendance_sessions ass
       LEFT JOIN sections sec ON sec.id = ass.section_id
       LEFT JOIN grade_levels gl ON gl.id = sec.grade_level_id
       LEFT JOIN course_offerings co ON co.id = ass.course_offering_id
       LEFT JOIN subjects sub ON sub.id = co.subject_id
       LEFT JOIN user_accounts u ON u.id = ass.marked_by
       ${where}
       ORDER BY ass.session_date DESC, ass.period`,
      params
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/attendance/sessions - Create and mark attendance
router.post('/sessions', authenticate, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const { sectionId, courseOfferingId, sessionDate, period, sessionType, records } = req.body;

    if (!sectionId || !sessionDate) {
      return res.status(400).json({ error: 'Section and date are required' });
    }

    // Create session
    const sessionResult = await query(
      `INSERT INTO attendance_sessions (section_id, course_offering_id, session_date, period, session_type, marked_by, marked_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'submitted') RETURNING *`,
      [sectionId, courseOfferingId, sessionDate, period || '1', sessionType || 'class', req.user.id]
    );

    const session = sessionResult.rows[0];

    // Insert attendance records
    if (records && records.length > 0) {
      for (const record of records) {
        await query(
          `INSERT INTO attendance_records (attendance_session_id, student_id, status, remarks)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (attendance_session_id, student_id) DO UPDATE SET status = $3, remarks = $4, updated_at = NOW()`,
          [session.id, record.studentId, record.status, record.remarks]
        );
      }
    }

    await logAuditEvent(req.user.id, 'mark_attendance', 'attendance_session', session.id,
      { sectionId, date: sessionDate, recordCount: records?.length || 0 }, req.ip);

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/student/:studentId - Get student attendance
router.get('/student/:studentId', authenticate, async (req, res, next) => {
  try {
    // Students can only see their own
    if (req.user.role === 'student') {
      const studentCheck = await query('SELECT id FROM students WHERE user_account_id = $1', [req.user.id]);
      if (studentCheck.rows.length === 0 || studentCheck.rows[0].id !== req.params.studentId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const { rows } = await query(
      `SELECT ar.*, ass.session_date, ass.period, ass.session_type,
              sub.name as subject_name, sec.name as section_name
       FROM attendance_records ar
       JOIN attendance_sessions ass ON ass.id = ar.attendance_session_id
       LEFT JOIN course_offerings co ON co.id = ass.course_offering_id
       LEFT JOIN subjects sub ON sub.id = co.subject_id
       LEFT JOIN sections sec ON sec.id = ass.section_id
       WHERE ar.student_id = $1
       ORDER BY ass.session_date DESC`,
      [req.params.studentId]
    );

    // Calculate summary
    const total = rows.length;
    const present = rows.filter(r => r.status === 'present').length;
    const absent = rows.filter(r => r.status === 'absent').length;
    const late = rows.filter(r => r.status === 'late').length;
    const excused = rows.filter(r => r.status === 'excused').length;

    res.json({
      records: rows,
      summary: {
        total, present, absent, late, excused,
        percentage: total > 0 ? Math.round((present + late) / total * 100) : 0
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/section/:sectionId - Get section attendance for a date
router.get('/section/:sectionId', authenticate, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const { date } = req.query;
    const sessionDate = date || new Date().toISOString().split('T')[0];

    // Get all students in section
    const students = await query(
      `SELECT s.id, s.first_name, s.last_name, s.admission_number, e.roll_number
       FROM students s
       JOIN enrolments e ON e.student_id = s.id AND e.status = 'active'
       WHERE e.section_id = $1
       ORDER BY e.roll_number, s.first_name`,
      [req.params.sectionId]
    );

    // Get attendance records for date
    const records = await query(
      `SELECT ar.student_id, ar.status, ar.remarks
       FROM attendance_records ar
       JOIN attendance_sessions ass ON ass.id = ar.attendance_session_id
       WHERE ass.section_id = $1 AND ass.session_date = $2`,
      [req.params.sectionId, sessionDate]
    );

    const recordMap = {};
    records.rows.forEach(r => { recordMap[r.student_id] = r; });

    const result = students.rows.map(s => ({
      ...s,
      attendanceStatus: recordMap[s.id]?.status || null,
      remarks: recordMap[s.id]?.remarks || null
    }));

    res.json({ date: sessionDate, students: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
