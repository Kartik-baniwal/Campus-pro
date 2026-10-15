import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { academicsAPI, attendanceAPI } from '../../services/api';
import {
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myClassesCount: 4,
    studentsCount: 128,
    pendingSubmissions: 14,
    attendanceDoneToday: true,
  });

  const [upcomingSchedule] = useState([
    { id: 1, time: '09:00 - 09:45 AM', subject: 'Advanced Mathematics', grade: 'Grade 10 - Section A', room: 'Room 302', status: 'Completed' },
    { id: 2, time: '10:00 - 10:45 AM', subject: 'Physics & Kinetics', grade: 'Grade 11 - Section B', room: 'Lab 2', status: 'In Progress' },
    { id: 3, time: '11:30 - 12:15 PM', subject: 'Intro to Computer Science', grade: 'Grade 9 - Section A', room: 'Computer Lab 1', status: 'Upcoming' },
    { id: 4, time: '02:00 - 02:45 PM', subject: 'Calculus I', grade: 'Grade 12 - Section A', room: 'Room 405', status: 'Upcoming' },
  ]);

  const [recentSubmissions] = useState([
    { id: 1, student: 'Liam Vance', assignment: 'Quadratic Equations Practice Set', submittedAt: '10 mins ago', status: 'Pending Review' },
    { id: 2, student: 'Sophia Martinez', assignment: 'Newtonian Dynamics Report', submittedAt: '45 mins ago', status: 'Pending Review' },
    { id: 3, student: 'Ethan Taylor', assignment: 'Python Control Flow Mini-Project', submittedAt: '2 hours ago', status: 'Graded (95/100)' },
    { id: 4, student: 'Olivia Chen', assignment: 'Quadratic Equations Practice Set', submittedAt: '3 hours ago', status: 'Graded (88/100)' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.firstName || 'Teacher'} 👋</h1>
          <p className="page-subtitle">Here is your classroom overview and teaching schedule for today</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/teacher/attendance" className="btn btn-primary">
            <HiOutlineClipboardDocumentCheck /> Take Attendance
          </Link>
          <Link to="/teacher/assignments" className="btn btn-secondary">
            <HiOutlineDocumentText /> New Assignment
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Active Classes</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              <HiOutlineUserGroup />
            </div>
          </div>
          <div className="stat-value">{stats.myClassesCount}</div>
          <div className="stat-footer text-muted">Across 3 academic grade levels</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Enrolled Students</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              <HiOutlineUserGroup />
            </div>
          </div>
          <div className="stat-value">{stats.studentsCount}</div>
          <div className="stat-footer text-emerald">94% average attendance this month</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Pending Submissions</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
              <HiOutlineClock />
            </div>
          </div>
          <div className="stat-value">{stats.pendingSubmissions}</div>
          <div className="stat-footer text-amber">Needs grading before Friday</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Daily Attendance</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
              <HiOutlineCheckCircle />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#34d399', fontSize: '1.5rem' }}>Synchronized</div>
          <div className="stat-footer text-muted">Morning roll-call recorded</div>
        </div>
      </div>

      {/* Two Column Layout: Schedule & Recent Submissions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HiOutlineClock className="text-primary" /> Today's Lecture Schedule
            </h2>
            <Link to="/teacher/timetable" className="text-sm text-primary hover-underline">
              Full Timetable →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingSchedule.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#f8fafc' }}>{item.subject}</span>
                    <span className="badge badge-primary">{item.room}</span>
                  </div>
                  <div className="text-sm text-muted" style={{ marginTop: '4px' }}>
                    {item.grade} • <span style={{ color: '#94a3b8' }}>{item.time}</span>
                  </div>
                </div>
                <div>
                  <span
                    className={`badge ${
                      item.status === 'Completed'
                        ? 'badge-success'
                        : item.status === 'In Progress'
                        ? 'badge-warning'
                        : 'badge-secondary'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Submissions to Review */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HiOutlineDocumentText className="text-primary" /> Recent Student Submissions
            </h2>
            <Link to="/teacher/assignments" className="text-sm text-primary hover-underline">
              View All →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{sub.student}</div>
                  <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    {sub.assignment} • {sub.submittedAt}
                  </div>
                </div>
                <span className={`badge ${sub.status.includes('Graded') ? 'badge-success' : 'badge-warning'}`}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
