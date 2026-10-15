import { useState } from 'react';
import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamationTriangle
} from 'react-icons/hi2';

export default function AdminAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [sectionBreakdown] = useState([
    { id: 1, section: 'Grade 10 - Section A', enrolled: 28, present: 27, absent: 1, late: 0, teacher: 'Dr. Arthur Pendelton', rate: 96.4 },
    { id: 2, section: 'Grade 10 - Section B', enrolled: 26, present: 24, absent: 2, late: 1, teacher: 'Mrs. Clara Oswald', rate: 92.3 },
    { id: 3, section: 'Grade 11 - Section A', enrolled: 30, present: 29, absent: 1, late: 0, teacher: 'Mr. David Vance', rate: 96.7 },
    { id: 4, section: 'Grade 11 - Section B', enrolled: 25, present: 22, absent: 3, late: 2, teacher: 'Ms. Ada Lovelace', rate: 88.0 },
    { id: 5, section: 'Grade 12 - Section A', enrolled: 32, present: 31, absent: 1, late: 0, teacher: 'Dr. Bruce Banner', rate: 96.9 },
    { id: 6, section: 'Grade 9 - Section A', enrolled: 30, present: 28, absent: 2, late: 1, teacher: 'Coach Stone', rate: 93.3 },
  ]);

  const totalEnrolled = sectionBreakdown.reduce((acc, s) => acc + s.enrolled, 0);
  const totalPresent = sectionBreakdown.reduce((acc, s) => acc + s.present, 0);
  const totalAbsent = sectionBreakdown.reduce((acc, s) => acc + s.absent, 0);
  const schoolAverage = Math.round((totalPresent / totalEnrolled) * 1000) / 10;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Institution-Wide Daily Attendance</h1>
          <p className="page-subtitle">Real-time attendance rolls across all sections and grades</p>
        </div>
        <div>
          <input
            type="date"
            className="form-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Overall Campus Rate</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
              <HiOutlineCheckCircle />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#34d399' }}>{schoolAverage}%</div>
          <div className="stat-footer text-emerald">Higher than term benchmark (92%)</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Students Present</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              <HiOutlineClipboardDocumentCheck />
            </div>
          </div>
          <div className="stat-value">{totalPresent} / {totalEnrolled}</div>
          <div className="stat-footer text-muted">Across 6 active classrooms</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Absences Today</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
              <HiOutlineXCircle />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#f87171' }}>{totalAbsent}</div>
          <div className="stat-footer text-muted">Guardian notifications sent</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Attention Flag</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
              <HiOutlineExclamationTriangle />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>1 Section</div>
          <div className="stat-footer text-amber">Grade 11-B below 90%</div>
        </div>
      </div>

      {/* Classroom Table */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Classroom / Section</th>
                <th>Class Homeroom Advisor</th>
                <th>Enrolled</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
                <th>Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {sectionBreakdown.map(sec => (
                <tr key={sec.id}>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>{sec.section}</td>
                  <td>{sec.teacher}</td>
                  <td>{sec.enrolled}</td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>{sec.present}</td>
                  <td style={{ color: sec.absent > 0 ? '#f87171' : '#94a3b8' }}>{sec.absent}</td>
                  <td>{sec.late}</td>
                  <td>
                    <span
                      className={`badge ${
                        sec.rate >= 95
                          ? 'badge-success'
                          : sec.rate >= 90
                          ? 'badge-primary'
                          : 'badge-warning'
                      }`}
                    >
                      {sec.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
