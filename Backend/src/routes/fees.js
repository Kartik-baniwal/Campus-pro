const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { logAuditEvent } = require('../utils/audit');

const router = express.Router();

// GET /api/fees/categories
router.get('/categories', authenticate, authorize('admin', 'fee_department'), async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT fc.*, s.name as school_name FROM fee_categories fc
       JOIN schools s ON s.id = fc.school_id ORDER BY fc.name`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/fees/categories
router.post('/categories', authenticate, authorize('admin', 'fee_department'), async (req, res, next) => {
  try {
    const { schoolId, name, description, isRecurring } = req.body;
    const { rows } = await query(
      `INSERT INTO fee_categories (school_id, name, description, is_recurring) VALUES ($1, $2, $3, $4) RETURNING *`,
      [schoolId, name, description, isRecurring || false]
    );
    await logAuditEvent(req.user.id, 'create_fee_category', 'fee_category', rows[0].id, { name }, req.ip);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// GET /api/fees/plans
router.get('/plans', authenticate, authorize('admin', 'fee_department'), async (req, res, next) => {
  try {
    const { academicYearId } = req.query;
    let where = '';
    let params = [];
    if (academicYearId) { where = 'WHERE fp.academic_year_id = $1'; params.push(academicYearId); }

    const { rows } = await query(
      `SELECT fp.*, ay.name as academic_year_name, gl.name as grade_level_name,
              u.first_name || ' ' || u.last_name as approved_by_name,
              (SELECT COUNT(*) FROM fee_plan_items fpi WHERE fpi.fee_plan_id = fp.id) as item_count,
              (SELECT SUM(fpi.amount) FROM fee_plan_items fpi WHERE fpi.fee_plan_id = fp.id) as total_amount
       FROM fee_plans fp
       JOIN academic_years ay ON ay.id = fp.academic_year_id
       LEFT JOIN grade_levels gl ON gl.id = fp.grade_level_id
       LEFT JOIN user_accounts u ON u.id = fp.approved_by
       ${where}
       ORDER BY fp.created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/fees/plans
router.post('/plans', authenticate, authorize('admin', 'fee_department'), async (req, res, next) => {
  try {
    const { academicYearId, gradeLevelId, name, description, items } = req.body;

    const { rows } = await query(
      `INSERT INTO fee_plans (academic_year_id, grade_level_id, name, description) VALUES ($1, $2, $3, $4) RETURNING *`,
      [academicYearId, gradeLevelId, name, description]
    );

    const plan = rows[0];

    if (items && items.length > 0) {
      for (const item of items) {
        await query(
          `INSERT INTO fee_plan_items (fee_plan_id, fee_category_id, amount, due_date, installment_number)
           VALUES ($1, $2, $3, $4, $5)`,
          [plan.id, item.feeCategoryId, item.amount, item.dueDate, item.installmentNumber || 1]
        );
      }
    }

    await logAuditEvent(req.user.id, 'create_fee_plan', 'fee_plan', plan.id, { name }, req.ip);
    res.status(201).json(plan);
  } catch (err) { next(err); }
});

// POST /api/fees/plans/:id/approve
router.post('/plans/:id/approve', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE fee_plans SET status = 'approved', approved_by = $1, approved_at = NOW(), updated_at = NOW()
       WHERE id = $2 AND status = 'draft' RETURNING *`,
      [req.user.id, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Fee plan not found or already approved' });
    await logAuditEvent(req.user.id, 'approve_fee_plan', 'fee_plan', req.params.id, {}, req.ip);
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// GET /api/fees/invoices
router.get('/invoices', authenticate, async (req, res, next) => {
  try {
    const { studentId, status, academicYearId } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (req.user.role === 'student') {
      const studentRes = await query('SELECT id FROM students WHERE user_account_id = $1', [req.user.id]);
      if (studentRes.rows.length > 0) {
        conditions.push(`i.student_id = $${paramIdx++}`);
        params.push(studentRes.rows[0].id);
      }
    } else if (studentId) {
      conditions.push(`i.student_id = $${paramIdx++}`);
      params.push(studentId);
    }

    if (status) { conditions.push(`i.status = $${paramIdx++}`); params.push(status); }
    if (academicYearId) { conditions.push(`i.academic_year_id = $${paramIdx++}`); params.push(academicYearId); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT i.*, s.first_name || ' ' || s.last_name as student_name, s.admission_number,
              ay.name as academic_year_name
       FROM invoices i
       JOIN students s ON s.id = i.student_id
       JOIN academic_years ay ON ay.id = i.academic_year_id
       ${where}
       ORDER BY i.issued_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/fees/invoices - Generate invoice
router.post('/invoices', authenticate, authorize('admin', 'fee_department'), async (req, res, next) => {
  try {
    const { studentId, academicYearId, feePlanId, dueDate, items } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const invoiceResult = await query(
      `INSERT INTO invoices (invoice_number, student_id, academic_year_id, fee_plan_id, total_amount, balance, due_date)
       VALUES ($1, $2, $3, $4, $5, $5, $6) RETURNING *`,
      [invoiceNumber, studentId, academicYearId, feePlanId, totalAmount, dueDate]
    );

    const invoice = invoiceResult.rows[0];

    for (const item of items) {
      await query(
        `INSERT INTO invoice_lines (invoice_id, fee_category_id, description, amount) VALUES ($1, $2, $3, $4)`,
        [invoice.id, item.feeCategoryId, item.description, item.amount]
      );
    }

    await logAuditEvent(req.user.id, 'create_invoice', 'invoice', invoice.id,
      { studentId, totalAmount, invoiceNumber }, req.ip);

    res.status(201).json(invoice);
  } catch (err) { next(err); }
});

// POST /api/fees/payments - Record payment
router.post('/payments', authenticate, authorize('admin', 'fee_department'), async (req, res, next) => {
  try {
    const { studentId, invoiceId, amount, paymentMethod, transactionReference, remarks } = req.body;

    const paymentRef = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const receiptNum = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const paymentResult = await query(
      `INSERT INTO payments (payment_reference, student_id, amount, payment_method, transaction_reference, received_by, remarks, receipt_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [paymentRef, studentId, amount, paymentMethod || 'cash', transactionReference, req.user.id, remarks, receiptNum]
    );

    const payment = paymentResult.rows[0];

    // Allocate to invoice
    if (invoiceId) {
      await query(
        `INSERT INTO payment_allocations (payment_id, invoice_id, amount) VALUES ($1, $2, $3)`,
        [payment.id, invoiceId, amount]
      );

      // Update invoice
      await query(
        `UPDATE invoices SET 
          paid_amount = paid_amount + $1,
          balance = balance - $1,
          status = CASE 
            WHEN balance - $1 <= 0 THEN 'paid'
            ELSE 'partial'
          END,
          updated_at = NOW()
         WHERE id = $2`,
        [amount, invoiceId]
      );
    }

    await logAuditEvent(req.user.id, 'record_payment', 'payment', payment.id,
      { studentId, amount, paymentMethod, invoiceId }, req.ip);

    res.status(201).json(payment);
  } catch (err) { next(err); }
});

// GET /api/fees/payments
router.get('/payments', authenticate, async (req, res, next) => {
  try {
    const { studentId } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (req.user.role === 'student') {
      const studentRes = await query('SELECT id FROM students WHERE user_account_id = $1', [req.user.id]);
      if (studentRes.rows.length > 0) {
        conditions.push(`p.student_id = $${paramIdx++}`);
        params.push(studentRes.rows[0].id);
      }
    } else if (studentId) {
      conditions.push(`p.student_id = $${paramIdx++}`);
      params.push(studentId);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await query(
      `SELECT p.*, s.first_name || ' ' || s.last_name as student_name, s.admission_number,
              u.first_name || ' ' || u.last_name as received_by_name
       FROM payments p
       JOIN students s ON s.id = p.student_id
       LEFT JOIN user_accounts u ON u.id = p.received_by
       ${where}
       ORDER BY p.created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/fees/adjustments
router.post('/adjustments', authenticate, authorize('admin', 'fee_department'), async (req, res, next) => {
  try {
    const { invoiceId, type, amount, reason, evidenceUrl } = req.body;
    const { rows } = await query(
      `INSERT INTO fee_adjustments (invoice_id, type, amount, reason, evidence_url, requested_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [invoiceId, type, amount, reason, evidenceUrl, req.user.id]
    );
    await logAuditEvent(req.user.id, 'request_adjustment', 'fee_adjustment', rows[0].id,
      { invoiceId, type, amount }, req.ip);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/fees/adjustments/:id/approve
router.post('/adjustments/:id/approve', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE fee_adjustments SET status = 'approved', approved_by = $1, approved_at = NOW(), updated_at = NOW()
       WHERE id = $2 AND status = 'pending' RETURNING *`,
      [req.user.id, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Adjustment not found or already processed' });

    // Apply adjustment to invoice
    const adj = rows[0];
    if (adj.type === 'waiver' || adj.type === 'discount') {
      await query(
        `UPDATE invoices SET balance = balance - $1, updated_at = NOW() WHERE id = $2`,
        [adj.amount, adj.invoice_id]
      );
    }

    await logAuditEvent(req.user.id, 'approve_adjustment', 'fee_adjustment', req.params.id, {}, req.ip);
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// GET /api/fees/dashboard - Fee department dashboard stats
router.get('/dashboard', authenticate, authorize('admin', 'fee_department'), async (req, res, next) => {
  try {
    const totalCollected = await query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'`
    );
    const totalPending = await query(
      `SELECT COALESCE(SUM(balance), 0) as total FROM invoices WHERE status IN ('pending', 'partial', 'overdue')`
    );
    const totalStudents = await query(
      `SELECT COUNT(DISTINCT student_id) as count FROM invoices`
    );
    const recentPayments = await query(
      `SELECT p.*, s.first_name || ' ' || s.last_name as student_name
       FROM payments p JOIN students s ON s.id = p.student_id
       ORDER BY p.created_at DESC LIMIT 10`
    );
    const overdueInvoices = await query(
      `SELECT i.*, s.first_name || ' ' || s.last_name as student_name
       FROM invoices i JOIN students s ON s.id = i.student_id
       WHERE i.status IN ('pending', 'partial') AND i.due_date < CURRENT_DATE
       ORDER BY i.due_date LIMIT 10`
    );

    res.json({
      totalCollected: parseFloat(totalCollected.rows[0].total),
      totalPending: parseFloat(totalPending.rows[0].total),
      totalStudents: parseInt(totalStudents.rows[0].count),
      recentPayments: recentPayments.rows,
      overdueInvoices: overdueInvoices.rows
    });
  } catch (err) { next(err); }
});

module.exports = router;
