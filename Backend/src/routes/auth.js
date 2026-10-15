const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { logAuditEvent } = require('../utils/audit');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { rows } = await query(
      'SELECT id, email, password_hash, first_name, last_name, role, is_active, avatar_url FROM user_accounts WHERE email = $1',
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated. Contact administrator.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await query('UPDATE user_accounts SET last_login = NOW() WHERE id = $1', [user.id]);

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Log the login
    await logAuditEvent(user.id, 'login', 'user_account', user.id, {}, req.ip);

    // Get additional info based on role
    let additionalInfo = {};
    if (user.role === 'student') {
      const studentRes = await query(
        `SELECT s.id as student_id, s.admission_number, e.section_id, sec.name as section_name,
                gl.name as grade_name, ay.id as academic_year_id, ay.name as academic_year_name
         FROM students s
         LEFT JOIN enrolments e ON e.student_id = s.id AND e.status = 'active'
         LEFT JOIN sections sec ON sec.id = e.section_id
         LEFT JOIN grade_levels gl ON gl.id = sec.grade_level_id
         LEFT JOIN academic_years ay ON ay.id = e.academic_year_id AND ay.is_current = true
         WHERE s.user_account_id = $1`,
        [user.id]
      );
      if (studentRes.rows.length > 0) {
        additionalInfo = studentRes.rows[0];
      }
    } else if (user.role === 'teacher') {
      const staffRes = await query(
        'SELECT id as staff_id, employee_id, department, designation FROM staff WHERE user_account_id = $1',
        [user.id]
      );
      if (staffRes.rows.length > 0) {
        additionalInfo = staffRes.rows[0];
      }
    }

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatarUrl: user.avatar_url,
        ...additionalInfo
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, email, first_name, last_name, phone, role, avatar_url, is_active, last_login, created_at FROM user_accounts WHERE id = $1',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    let additionalInfo = {};

    if (user.role === 'student') {
      const studentRes = await query(
        `SELECT s.id as student_id, s.admission_number, s.date_of_birth, s.gender, s.address, s.photo_url,
                e.section_id, sec.name as section_name, gl.name as grade_name,
                ay.id as academic_year_id, ay.name as academic_year_name
         FROM students s
         LEFT JOIN enrolments e ON e.student_id = s.id AND e.status = 'active'
         LEFT JOIN sections sec ON sec.id = e.section_id
         LEFT JOIN grade_levels gl ON gl.id = sec.grade_level_id
         LEFT JOIN academic_years ay ON ay.id = e.academic_year_id AND ay.is_current = true
         WHERE s.user_account_id = $1`,
        [user.id]
      );
      if (studentRes.rows.length > 0) additionalInfo = studentRes.rows[0];
    } else if (user.role === 'teacher') {
      const staffRes = await query(
        'SELECT id as staff_id, employee_id, department, designation, qualification FROM staff WHERE user_account_id = $1',
        [user.id]
      );
      if (staffRes.rows.length > 0) additionalInfo = staffRes.rows[0];
    }

    res.json({
      ...user,
      ...additionalInfo
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/register (Admin only creates users)
router.post('/register', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can create accounts' });
    }

    const { email, password, firstName, lastName, phone, role } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const validRoles = ['admin', 'teacher', 'student', 'fee_department'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if email exists
    const existing = await query('SELECT id FROM user_accounts WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { rows } = await query(
      `INSERT INTO user_accounts (email, password_hash, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, role, created_at`,
      [email.toLowerCase(), passwordHash, firstName, lastName, phone, role]
    );

    await logAuditEvent(req.user.id, 'create_account', 'user_account', rows[0].id, { role }, req.ip);

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const { rows } = await query('SELECT password_hash FROM user_accounts WHERE id = $1', [req.user.id]);
    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query('UPDATE user_accounts SET password_hash = $1, updated_at = NOW() WHERE id = $2', [passwordHash, req.user.id]);

    await logAuditEvent(req.user.id, 'change_password', 'user_account', req.user.id, {}, req.ip);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
