import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineAcademicCap,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();

  const [studentStats] = useState({
    attendanceRate: 96,
    currentGPA: '3.92',
    pendingAssignments: 2,
    feeStatus: 'Paid',
    rank: '3rd of 32',
  });

  const [todaysClasses] = useState([
    { period: 'Period 1 (08:30 - 09:15)', subject: 'Advanced Mathematics', teacher: 'Dr. Arthur Pendelton', room: 'Room 302', status: 'Completed' },
    { period: 'Period 2 (09:20 - 10:05)', subject: 'English Literature', teacher: 'Mrs. Clara Oswald', room: 'Room 204', status: 'Completed' },
    { period: 'Period 3 (10:10 - 10:55)', subject: 'Physics & Kinetics', teacher: 'Mr. David Vance', room: 'Lab 2', status: 'In Progress' },
    { period: 'Period 4 (11:00 - 11:45)', subject: 'Computer Science', teacher: 'Ms. Ada Lovelace', room: 'Lab 1', status: 'Upcoming' },
  ]);

  const [upcomingDeadlines] = useState([
    { id: 1, title: 'Quadratic Equations Practice Set', subject: 'Mathematics', due: 'Tomorrow, 11:59 PM', points: '100 pts' },
    { id: 2, title: 'Newtonian Laws Lab Report', subject: 'Physics', due: 'In 3 days', points: '50 pts' },
  ]);

  const [recentGrades] = useState([
    { id: 1, assessment: 'Mid-Term Exam', subject: 'Computer Science', score: '96 / 100', grade: 'A+' },
    { id: 2, assessment: 'Essay: Shakespearean Drama', subject: 'English Literature', score: '91 / 100', grade: 'A' },
    { id: 3, assessment: 'Vector Algebra Quiz', subject: 'Mathematics', score: '88 / 100', grade: 'A-' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.firstName || 'Student'} 🎓</h1>
          <p className="page-subtitle">Grade 10 • Section A • Academic Year 2026–2027</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/student/assignments" className="btn btn-primary">
            View Assignments
          </Link>
          <Link to="/student/timetable" className="btn btn-secondary">
            Timetable
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Overall Attendance</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
              <HiOutlineClipboardDocumentCheck />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#34d399' }}>{studentStats.attendanceRate}%</div>
          <div className="stat-footer text-muted">Eligible for honors (Min 85%)</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Cumulative GPA</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              <HiOutlineAcademicCap />
            </div>
          </div>
          <div className="stat-value">{studentStats.currentGPA}</div>
          <div className="stat-footer text-emerald">Class Rank: {studentStats.rank}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Due Assignments</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
              <HiOutlineClock />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>{studentStats.pendingAssignments}</div>
          <div className="stat-footer text-amber">1 due within 24 hours</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Fee Account</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              <HiOutlineChartBar />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '1.5rem', color: '#34d399' }}>Clear</div>
          <div className="stat-footer text-muted">Term 1 settled in full</div>
        </div>
      </div>

      {/* Main Grid: Today's Classes & Side Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Classes Today */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HiOutlineCalendarDays className="text-primary" /> Today's Classes
            </h2>
            <Link to="/student/timetable" className="text-sm text-primary hover-underline">
              View Schedule →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todaysClasses.map((cls, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '1rem' }}>{cls.subject}</span>
                    <span className="badge badge-secondary">{cls.room}</span>
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                    {cls.teacher} • {cls.period}
                  </div>
                </div>
                <span
                  className={`badge ${
                    cls.status === 'Completed'
                      ? 'badge-success'
                      : cls.status === 'In Progress'
                      ? 'badge-warning'
                      : 'badge-secondary'
                  }`}
                >
                  {cls.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Deadlines + Recent Grades */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Deadlines */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineClock className="text-amber" /> Urgent Homework
              </h2>
              <Link to="/student/assignments" className="text-sm text-primary hover-underline">
                All →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingDeadlines.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.04)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{item.title}</div>
                    <div className="text-xs text-muted">{item.subject} • Due: {item.due}</div>
                  </div>
                  <span className="badge badge-warning">{item.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineChartBar className="text-emerald" /> Recent Performance
              </h2>
              <Link to="/student/results" className="text-sm text-primary hover-underline">
                Grade Card →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentGrades.map((g) => (
                <div
                  key={g.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f1f5f9' }}>{g.assessment}</div>
                    <div className="text-xs text-muted">{g.subject}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#34d399' }}>{g.score}</div>
                    <span className="badge badge-primary">{g.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
