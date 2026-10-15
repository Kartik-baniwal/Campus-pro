const express = require('express');
const { query, getClient } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { logAuditEvent } = require('../utils/audit');

const router = express.Router();

// GET /api/students - List students (role-scoped)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { search, grade, section, status, academicYearId, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    let params = [];
    let conditions = [];
    let paramIdx = 1;

    if (req.user.role === 'student') {
      // Students can only see themselves
      conditions.push(`s.user_account_id = $${paramIdx++}`);
      params.push(req.user.id);
    }

    if (search) {
      conditions.push(`(s.first_name ILIKE $${paramIdx} OR s.last_name ILIKE $${paramIdx} OR s.admission_number ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (status) {
      conditions.push(`s.status = $${paramIdx++}`);
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = await query(
      `SELECT COUNT(*) FROM students s ${whereClause}`,
      params
    );

    const { rows } = await query(
      `SELECT s.*, 
              u.email as account_email, u.is_active as account_active,
              e.section_id, e.roll_number, e.status as enrolment_status,
              sec.name as section_name, gl.name as grade_name
       FROM students s
       LEFT JOIN user_accounts u ON u.id = s.user_account_id
       LEFT JOIN enrolments e ON e.student_id = s.id AND e.status = 'active'
       LEFT JOIN sections sec ON sec.id = e.section_id
       LEFT JOIN grade_levels gl ON gl.id = sec.grade_level_id
       ${whereClause}
       ORDER BY s.first_name, s.last_name
       LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      students: rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/students/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    // Students can only see their own record
    if (req.user.role === 'student') {
      const studentCheck = await query('SELECT id FROM students WHERE user_account_id = $1', [req.user.id]);
      if (studentCheck.rows.length === 0 || studentCheck.rows[0].id !== req.params.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const { rows } = await query(
      `SELECT s.*, u.email as account_email, u.is_active as account_active,
              e.section_id, e.roll_number, e.status as enrolment_status,
              sec.name as section_name, gl.name as grade_name, ay.name as academic_year_name
       FROM students s
       LEFT JOIN user_accounts u ON u.id = s.user_account_id
       LEFT JOIN enrolments e ON e.student_id = s.id AND e.status = 'active'
       LEFT JOIN sections sec ON sec.id = e.section_id
       LEFT JOIN grade_levels gl ON gl.id = sec.grade_level_id
       LEFT JOIN academic_years ay ON ay.id = e.academic_year_id
       WHERE s.id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get guardian contacts
    const guardians = await query(
      'SELECT * FROM guardian_contacts WHERE student_id = $1 ORDER BY is_primary DESC',
      [req.params.id]
    );

    res.json({ ...rows[0], guardians: guardians.rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/students - Create student (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    const {
      admissionNumber, firstName, lastName, dateOfBirth, gender, bloodGroup,
      address, phone, email, admissionDate, schoolId,
      sectionId, academicYearId, rollNumber,
      createAccount, accountPassword,
      guardians
    } = req.body;

    if (!admissionNumber || !firstName || !lastName || !schoolId) {
      return res.status(400).json({ error: 'Admission number, name, and school are required' });
    }

    let userAccountId = null;

    // Optionally create user account for the student
    if (createAccount && email) {
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash(accountPassword || 'Student@123', 10);
      const accountResult = await client.query(
        `INSERT INTO user_accounts (email, password_hash, first_name, last_name, phone, role)
         VALUES ($1, $2, $3, $4, $5, 'student') RETURNING id`,
        [email.toLowerCase(), passwordHash, firstName, lastName, phone]
      );
      userAccountId = accountResult.rows[0].id;
    }

    const studentResult = await client.query(
      `INSERT INTO students (user_account_id, school_id, admission_number, first_name, last_name, 
       date_of_birth, gender, blood_group, address, phone, email, admission_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [userAccountId, schoolId, admissionNumber, firstName, lastName, dateOfBirth, gender,
       bloodGroup, address, phone, email, admissionDate || new Date()]
    );

    const student = studentResult.rows[0];

    // Create enrolment if section and year provided
    if (sectionId && academicYearId) {
      await client.query(
        `INSERT INTO enrolments (student_id, academic_year_id, section_id, roll_number)
         VALUES ($1, $2, $3, $4)`,
        [student.id, academicYearId, sectionId, rollNumber]
      );
    }

    // Add guardians
    if (guardians && guardians.length > 0) {
      for (const g of guardians) {
        await client.query(
          `INSERT INTO guardian_contacts (student_id, name, relationship, phone, email, address, is_primary, is_emergency)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [student.id, g.name, g.relationship, g.phone, g.email, g.address, g.isPrimary || false, g.isEmergency || false]
        );
      }
    }

    await client.query('COMMIT');
    await logAuditEvent(req.user.id, 'create_student', 'student', student.id, { admissionNumber }, req.ip);

    res.status(201).json(student);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// PUT /api/students/:id - Update student (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const {
      firstName, lastName, dateOfBirth, gender, bloodGroup,
      address, phone, email, status
    } = req.body;

    const { rows } = await query(
      `UPDATE students SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        date_of_birth = COALESCE($3, date_of_birth),
        gender = COALESCE($4, gender),
        blood_group = COALESCE($5, blood_group),
        address = COALESCE($6, address),
        phone = COALESCE($7, phone),
        email = COALESCE($8, email),
        status = COALESCE($9, status),
        updated_at = NOW()
       WHERE id = $10 RETURNING *`,
      [firstName, lastName, dateOfBirth, gender, bloodGroup, address, phone, email, status, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await logAuditEvent(req.user.id, 'update_student', 'student', req.params.id, req.body, req.ip);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
