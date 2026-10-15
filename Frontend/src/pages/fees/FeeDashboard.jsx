import { useState } from 'react';
import {
  HiOutlineBanknotes,
  HiOutlineReceiptPercent,
  HiOutlineCreditCard,
  HiOutlineClock,
  HiOutlineArrowTrendingUp,
  HiOutlinePlus,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';

export default function FeeDashboard() {
  const [metrics] = useState({
    totalBilled: 384000,
    totalCollected: 312500,
    pendingReceivables: 71500,
    collectionRate: 81.4,
    overdueInvoicesCount: 18,
  });

  const [recentTransactions] = useState([
    { id: 'PAY-4091', student: 'kartik', roll: 'STU-1001', amount: 1250, method: 'Credit Card', date: 'Today, 02:15 PM', status: 'Completed' },
    { id: 'PAY-4090', student: 'Sophia Martinez', roll: 'STU-1002', amount: 1250, method: 'Direct Debit', date: 'Today, 11:30 AM', status: 'Completed' },
    { id: 'PAY-4089', student: 'Ethan Taylor', roll: 'STU-1003', amount: 625, method: 'Cheque / Draft', date: 'Yesterday', status: 'Cleared' },
    { id: 'PAY-4088', student: 'Emma Watson', roll: 'STU-1006', amount: 1400, method: 'Bank Transfer', date: 'Yesterday', status: 'Completed' },
    { id: 'PAY-4087', student: 'Lucas Scott', roll: 'STU-1005', amount: 1250, method: 'Cash Deposit', date: '2 days ago', status: 'Completed' },
  ]);

  const [topOverdue] = useState([
    { student: 'James Rodriguez', roll: 'STU-1044', grade: 'Grade 11 - A', amount: 1400, daysPastDue: 24, phone: '+1 555-401-2299' },
    { student: 'Mia Tanaka', roll: 'STU-1052', grade: 'Grade 10 - B', amount: 1250, daysPastDue: 18, phone: '+1 555-602-3311' },
    { student: 'Oliver Wright', roll: 'STU-1029', grade: 'Grade 12 - A', amount: 950, daysPastDue: 12, phone: '+1 555-883-9901' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Department Overview</h1>
          <p className="page-subtitle">Revenue tracking, fee ledger collections, and student billing pipeline</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/fees/payments" className="btn btn-primary">
            <HiOutlineCreditCard /> Record Payment
          </Link>
          <Link to="/fees/invoices" className="btn btn-secondary">
            <HiOutlineReceiptPercent /> Generate Invoices
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Total Collected</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
              <HiOutlineCreditCard />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#34d399' }}>${metrics.totalCollected.toLocaleString()}</div>
          <div className="stat-footer text-emerald">
            <HiOutlineArrowTrendingUp /> +14.2% higher vs last semester
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Collection Rate</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              <HiOutlineCheckCircle />
            </div>
          </div>
          <div className="stat-value">{metrics.collectionRate}%</div>
          <div className="stat-footer text-muted">Goal for Q4: 92%</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Outstanding Receivables</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
              <HiOutlineBanknotes />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#f87171' }}>${metrics.pendingReceivables.toLocaleString()}</div>
          <div className="stat-footer text-muted">Across 3 grade levels</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Overdue Invoices</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
              <HiOutlineClock />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>{metrics.overdueInvoicesCount}</div>
          <div className="stat-footer text-amber">Reminders dispatched</div>
        </div>
      </div>

      {/* Grid: Recent Transactions & Overdue Ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Recent Collections */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">Recent Fee Receipts</h2>
            <Link to="/fees/payments" className="text-sm text-primary hover-underline">
              All Transactions →
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Student</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className="badge badge-secondary">{tx.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{tx.student}</div>
                      <div className="text-xs text-muted">{tx.roll} • {tx.date}</div>
                    </td>
                    <td className="text-sm text-muted">{tx.method}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>${tx.amount}</td>
                    <td>
                      <span className="badge badge-success">{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Priority Overdue List */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Priority Overdue Follow-ups</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topOverdue.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.04)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.student}</div>
                  <div className="text-xs text-muted">
                    {item.grade} • Overdue {item.daysPastDue} days
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    Tel: {item.phone}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#f87171' }}>${item.amount}</div>
                  <span className="badge badge-danger">Unsettled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
