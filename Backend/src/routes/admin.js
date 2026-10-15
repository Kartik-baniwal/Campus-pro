const express = require('express');
const { query, getClient } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { logAuditEvent } = require('../utils/audit');
const bcrypt = require('bcryptjs');

const router = express.Router();

// ============ SCHOOL CONFIGURATION ============

// GET /api/admin/schools
router.get('/schools', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM schools ORDER BY name');
    res.json(rows);
  } catch (err) { next(err); }
});

// PUT /api/admin/schools/:id
router.put('/schools/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { name, address, phone, email, timezone, currency } = req.body;
    const { rows } = await query(
      `UPDATE schools SET name = COALESCE($1, name), address = COALESCE($2, address),
       phone = COALESCE($3, phone), email = COALESCE($4, email),
       timezone = COALESCE($5, timezone), currency = COALESCE($6, currency), updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [name, address, phone, email, timezone, currency, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'School not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// ============ ACADEMIC YEARS ============

// GET /api/admin/academic-years
router.get('/academic-years', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT ay.*, s.name as school_name,
              (SELECT COUNT(*) FROM enrolments e WHERE e.academic_year_id = ay.id) as enrolment_count,
              (SELECT COUNT(*) FROM sections sec WHERE sec.academic_year_id = ay.id) as section_count
       FROM academic_years ay
       JOIN schools s ON s.id = ay.school_id
       ORDER BY ay.start_date DESC`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/admin/academic-years
router.post('/academic-years', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { schoolId, name, startDate, endDate, status } = req.body;
    const { rows } = await query(
      `INSERT INTO academic_years (school_id, name, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [schoolId, name, startDate, endDate, status || 'planning']
    );
    await logAuditEvent(req.user.id, 'create_academic_year', 'academic_year', rows[0].id, { name }, req.ip);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// ============ GRADE LEVELS ============

// GET /api/admin/grade-levels
router.get('/grade-levels', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM grade_levels ORDER BY sequence_order');
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/admin/grade-levels
router.post('/grade-levels', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { schoolId, name, sequenceOrder, description } = req.body;
    const { rows } = await query(
      `INSERT INTO grade_levels (school_id, name, sequence_order, description) VALUES ($1, $2, $3, $4) RETURNING *`,
      [schoolId, name, sequenceOrder, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// ============ SECTIONS ============

// GET /api/admin/sections
router.get('/sections', authenticate, async (req, res, next) => {
  try {
    const { academicYearId, gradeLevelId } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (academicYearId) { conditions.push(`s.academic_year_id = $${paramIdx++}`); params.push(academicYearId); }
    if (gradeLevelId) { conditions.push(`s.grade_level_id = $${paramIdx++}`); params.push(gradeLevelId); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT s.*, gl.name as grade_name, ay.name as academic_year_name,
              (SELECT COUNT(*) FROM enrolments e WHERE e.section_id = s.id AND e.status = 'active') as student_count
       FROM sections s
       JOIN grade_levels gl ON gl.id = s.grade_level_id
       JOIN academic_years ay ON ay.id = s.academic_year_id
       ${where}
       ORDER BY gl.sequence_order, s.name`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/admin/sections
router.post('/sections', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { academicYearId, gradeLevelId, name, capacity, room } = req.body;
    const { rows } = await query(
      `INSERT INTO sections (academic_year_id, grade_level_id, name, capacity, room) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [academicYearId, gradeLevelId, name, capacity || 40, room]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// ============ SUBJECTS ============

// GET /api/admin/subjects
router.get('/subjects', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM subjects ORDER BY name');
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/admin/subjects
router.post('/subjects', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { schoolId, name, code, description, isElective } = req.body;
    const { rows } = await query(
      `INSERT INTO subjects (school_id, name, code, description, is_elective) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [schoolId, name, code, description, isElective || false]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// ============ STAFF ============

// GET /api/admin/staff
router.get('/staff', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT st.*, u.email as account_email, u.is_active as account_active, u.role as account_role
       FROM staff st
       LEFT JOIN user_accounts u ON u.id = st.user_account_id
       ORDER BY st.first_name, st.last_name`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/admin/staff
router.post('/staff', authenticate, authorize('admin'), async (req, res, next) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const { schoolId, employeeId, firstName, lastName, department, designation,
            qualification, phone, email, role, createAccount, accountPassword } = req.body;

    let userAccountId = null;
    if (createAccount && email) {
      const passwordHash = await bcrypt.hash(accountPassword || 'Staff@123', 10);
      const accountResult = await client.query(
        `INSERT INTO user_accounts (email, password_hash, first_name, last_name, phone, role)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [email.toLowerCase(), passwordHash, firstName, lastName, phone, role || 'teacher']
      );
      userAccountId = accountResult.rows[0].id;
    }

    const { rows } = await client.query(
      `INSERT INTO staff (user_account_id, school_id, employee_id, first_name, last_name, department, designation, qualification, phone, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [userAccountId, schoolId, employeeId, firstName, lastName, department, designation, qualification, phone, email]
    );

    await client.query('COMMIT');
    await logAuditEvent(req.user.id, 'create_staff', 'staff', rows[0].id, { employeeId }, req.ip);
    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// ============ ENROLMENTS ============

// POST /api/admin/enrolments
router.post('/enrolments', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { studentId, academicYearId, sectionId, rollNumber } = req.body;
    const { rows } = await query(
      `INSERT INTO enrolments (student_id, academic_year_id, section_id, roll_number)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [studentId, academicYearId, sectionId, rollNumber]
    );
    await logAuditEvent(req.user.id, 'create_enrolment', 'enrolment', rows[0].id, { studentId, sectionId }, req.ip);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// ============ TEACHER ASSIGNMENTS ============

// GET /api/admin/teacher-assignments
router.get('/teacher-assignments', authenticate, async (req, res, next) => {
  try {
    const { staffId } = req.query;
    let where = '';
    let params = [];
    if (staffId) { where = 'WHERE ta.staff_id = $1'; params.push(staffId); }

    const { rows } = await query(
      `SELECT ta.*, st.first_name || ' ' || st.last_name as teacher_name,
              sub.name as subject_name, sec.name as section_name, gl.name as grade_name
       FROM teacher_assignments ta
       JOIN staff st ON st.id = ta.staff_id
       JOIN course_offerings co ON co.id = ta.course_offering_id
       JOIN subjects sub ON sub.id = co.subject_id
       JOIN sections sec ON sec.id = co.section_id
       JOIN grade_levels gl ON gl.id = sec.grade_level_id
       ${where}
       ORDER BY ta.start_date DESC`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/admin/teacher-assignments
router.post('/teacher-assignments', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { staffId, courseOfferingId, isClassTeacher, startDate } = req.body;
    const { rows } = await query(
      `INSERT INTO teacher_assignments (staff_id, course_offering_id, is_class_teacher, start_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [staffId, courseOfferingId, isClassTeacher || false, startDate || new Date()]
    );
    await logAuditEvent(req.user.id, 'create_assignment', 'teacher_assignment', rows[0].id, { staffId }, req.ip);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// ============ COURSE OFFERINGS ============

// GET /api/admin/course-offerings
router.get('/course-offerings', authenticate, async (req, res, next) => {
  try {
    const { sectionId, academicYearId } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (sectionId) { conditions.push(`co.section_id = $${paramIdx++}`); params.push(sectionId); }
    if (academicYearId) { conditions.push(`co.academic_year_id = $${paramIdx++}`); params.push(academicYearId); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT co.*, sub.name as subject_name, sub.code as subject_code, 
              sec.name as section_name, gl.name as grade_name
       FROM course_offerings co
       JOIN subjects sub ON sub.id = co.subject_id
       JOIN sections sec ON sec.id = co.section_id
       JOIN grade_levels gl ON gl.id = sec.grade_level_id
       ${where}
       ORDER BY gl.sequence_order, sec.name, sub.name`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/admin/course-offerings
router.post('/course-offerings', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { sectionId, subjectId, academicYearId } = req.body;
    const { rows } = await query(
      `INSERT INTO course_offerings (section_id, subject_id, academic_year_id) VALUES ($1, $2, $3) RETURNING *`,
      [sectionId, subjectId, academicYearId]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// ============ USER MANAGEMENT ============

// GET /api/admin/users
router.get('/users', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { role, search, isActive } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (role) { conditions.push(`role = $${paramIdx++}`); params.push(role); }
    if (search) {
      conditions.push(`(first_name ILIKE $${paramIdx} OR last_name ILIKE $${paramIdx} OR email ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (isActive !== undefined) { conditions.push(`is_active = $${paramIdx++}`); params.push(isActive === 'true'); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT id, email, first_name, last_name, phone, role, is_active, last_login, created_at FROM user_accounts
       ${where} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// PUT /api/admin/users/:id/toggle-active
router.put('/users/:id/toggle-active', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE user_accounts SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1 
       RETURNING id, email, first_name, last_name, role, is_active`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    await logAuditEvent(req.user.id, 'toggle_account', 'user_account', req.params.id,
      { is_active: rows[0].is_active }, req.ip);
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// ============ DASHBOARD STATS ============

// GET /api/admin/dashboard
router.get('/dashboard', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const totalStudents = await query(`SELECT COUNT(*) FROM students WHERE status = 'active'`);
    const totalStaff = await query(`SELECT COUNT(*) FROM staff WHERE status = 'active'`);
    const totalUsers = await query(`SELECT COUNT(*) FROM user_accounts WHERE is_active = true`);
    const totalSections = await query(
      `SELECT COUNT(*) FROM sections s JOIN academic_years ay ON ay.id = s.academic_year_id WHERE ay.is_current = true`
    );

    const roleDistribution = await query(
      `SELECT role, COUNT(*) as count FROM user_accounts WHERE is_active = true GROUP BY role`
    );

    const recentActivity = await query(
      `SELECT ae.*, u.first_name || ' ' || u.last_name as actor_name
       FROM audit_events ae
       LEFT JOIN user_accounts u ON u.id = ae.actor_id
       ORDER BY ae.created_at DESC LIMIT 15`
    );

    const attendanceToday = await query(
      `SELECT 
        COUNT(CASE WHEN ar.status = 'present' THEN 1 END) as present,
        COUNT(CASE WHEN ar.status = 'absent' THEN 1 END) as absent,
        COUNT(CASE WHEN ar.status = 'late' THEN 1 END) as late,
        COUNT(*) as total
       FROM attendance_records ar
       JOIN attendance_sessions ass ON ass.id = ar.attendance_session_id
       WHERE ass.session_date = CURRENT_DATE`
    );

    res.json({
      totalStudents: parseInt(totalStudents.rows[0].count),
      totalStaff: parseInt(totalStaff.rows[0].count),
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalSections: parseInt(totalSections.rows[0].count),
      roleDistribution: roleDistribution.rows,
      recentActivity: recentActivity.rows,
      attendanceToday: attendanceToday.rows[0]
    });
  } catch (err) { next(err); }
});

// ============ NOTIFICATIONS ============

// GET /api/admin/notifications (also used by all roles)
router.get('/notifications', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// PUT /api/admin/notifications/:id/read
router.put('/notifications/:id/read', authenticate, async (req, res, next) => {
  try {
    await query(
      `UPDATE notifications SET is_read = true, read_at = NOW() WHERE id = $1 AND recipient_id = $2`,
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) { next(err); }
});

// POST /api/admin/notifications - Send notification
router.post('/notifications', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { recipientId, title, message, type, category } = req.body;
    const { rows } = await query(
      `INSERT INTO notifications (recipient_id, title, message, type, category) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [recipientId, title, message, type || 'info', category]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// ============ AUDIT LOG ============

// GET /api/admin/audit-log
router.get('/audit-log', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { actorId, action, targetType, startDate, endDate, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (actorId) { conditions.push(`ae.actor_id = $${paramIdx++}`); params.push(actorId); }
    if (action) { conditions.push(`ae.action = $${paramIdx++}`); params.push(action); }
    if (targetType) { conditions.push(`ae.target_type = $${paramIdx++}`); params.push(targetType); }
    if (startDate) { conditions.push(`ae.created_at >= $${paramIdx++}`); params.push(startDate); }
    if (endDate) { conditions.push(`ae.created_at <= $${paramIdx++}`); params.push(endDate); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT ae.*, u.first_name || ' ' || u.last_name as actor_name, u.role as actor_role
       FROM audit_events ae
       LEFT JOIN user_accounts u ON u.id = ae.actor_id
       ${where}
       ORDER BY ae.created_at DESC
       LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const countResult = await query(`SELECT COUNT(*) FROM audit_events ae ${where}`, params);

    res.json({
      events: rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) { next(err); }
});

module.exports = router;
