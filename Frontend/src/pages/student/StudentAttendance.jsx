import { useState } from 'react';
import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock
} from 'react-icons/hi2';

export default function StudentAttendance() {
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  const [attendanceRecords] = useState([
    { id: 1, date: '2026-10-14', subject: 'Mathematics', status: 'Present', remarks: 'On time' },
    { id: 2, date: '2026-10-14', subject: 'Physics', status: 'Present', remarks: 'Active participation' },
    { id: 3, date: '2026-10-13', subject: 'Computer Science', status: 'Present', remarks: 'Completed lab exercise' },
    { id: 4, date: '2026-10-12', subject: 'Chemistry', status: 'Late', remarks: 'Arrived 10 mins late' },
    { id: 5, date: '2026-10-11', subject: 'English', status: 'Present', remarks: '' },
    { id: 6, date: '2026-10-10', subject: 'Mathematics', status: 'Present', remarks: '' },
    { id: 7, date: '2026-10-09', subject: 'Physical Ed.', status: 'Excused', remarks: 'Inter-school badminton' },
    { id: 8, date: '2026-10-08', subject: 'Physics', status: 'Absent', remarks: 'Sick leave (Medical note submitted)' },
  ]);

  const summary = {
    totalDays: 45,
    presentDays: 42,
    absentDays: 1,
    lateDays: 1,
    excusedDays: 1,
    rate: 95.5,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Attendance Record</h1>
          <p className="page-subtitle">Track your daily presence, absences, and school compliance</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Overall Percentage</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
              <HiOutlineCheckCircle />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#34d399' }}>{summary.rate}%</div>
          <div className="stat-footer text-emerald">Compliant with school requirements (&gt; 85%)</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Present Days</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              <HiOutlineClipboardDocumentCheck />
            </div>
          </div>
          <div className="stat-value">{summary.presentDays} / {summary.totalDays}</div>
          <div className="stat-footer text-muted">Academic sessions attended</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Absences & Leaves</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
              <HiOutlineXCircle />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#f87171' }}>{summary.absentDays}</div>
          <div className="stat-footer text-muted">1 Excused medical leave</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Late Arrivals</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
              <HiOutlineClock />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>{summary.lateDays}</div>
          <div className="stat-footer text-amber">Late roll-calls</div>
        </div>
      </div>

      {/* Daily Records Log */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Session History</h2>
          <span className="badge badge-secondary">Current Term: Fall 2026</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject Session</th>
                <th>Status</th>
                <th>Remarks / Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: 500 }}>
                      <HiOutlineCalendarDays className="text-muted" />
                      {r.date}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.subject}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === 'Present'
                          ? 'badge-success'
                          : r.status === 'Late'
                          ? 'badge-warning'
                          : r.status === 'Excused'
                          ? 'badge-primary'
                          : 'badge-danger'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="text-sm text-muted">{r.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
