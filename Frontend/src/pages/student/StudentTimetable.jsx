import { useState } from 'react';
import { HiOutlineClock, HiOutlineCalendarDays } from 'react-icons/hi2';

export default function StudentTimetable() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { time: '08:30 - 09:15', label: 'Period 1' },
    { time: '09:20 - 10:05', label: 'Period 2' },
    { time: '10:10 - 10:55', label: 'Period 3' },
    { time: '11:00 - 11:45', label: 'Period 4' },
    { time: '11:45 - 12:30', label: 'Lunch Break', isBreak: true },
    { time: '12:30 - 01:15', label: 'Period 5' },
    { time: '01:20 - 02:05', label: 'Period 6' },
  ];

  const studentSchedule = {
    Monday: [
      { subject: 'Advanced Math', room: 'Room 302', teacher: 'Dr. Pendelton', color: '#6366f1' },
      { subject: 'English Literature', room: 'Room 204', teacher: 'Mrs. Oswald', color: '#ec4899' },
      { subject: 'Physics Lab', room: 'Lab 2', teacher: 'Mr. Vance', color: '#0ea5e9' },
      { subject: 'Computer Sci', room: 'Lab 1', teacher: 'Ms. Lovelace', color: '#10b981' },
      null,
      { subject: 'World History', room: 'Room 105', teacher: 'Mr. Croft', color: '#f59e0b' },
      { subject: 'Physical Ed.', room: 'Gymnasium', teacher: 'Coach Stone', color: '#8b5cf6' },
    ],
    Tuesday: [
      { subject: 'Physics', room: 'Room 301', teacher: 'Mr. Vance', color: '#0ea5e9' },
      { subject: 'Advanced Math', room: 'Room 302', teacher: 'Dr. Pendelton', color: '#6366f1' },
      { subject: 'Computer Sci', room: 'Lab 1', teacher: 'Ms. Lovelace', color: '#10b981' },
      { subject: 'English Literature', room: 'Room 204', teacher: 'Mrs. Oswald', color: '#ec4899' },
      null,
      { subject: 'World History', room: 'Room 105', teacher: 'Mr. Croft', color: '#f59e0b' },
      { subject: 'Library Study', room: 'Library', teacher: 'Self-study', color: '#64748b' },
    ],
    Wednesday: [
      { subject: 'Advanced Math', room: 'Room 302', teacher: 'Dr. Pendelton', color: '#6366f1' },
      { subject: 'Physics Lab', room: 'Lab 2', teacher: 'Mr. Vance', color: '#0ea5e9' },
      { subject: 'Chemistry', room: 'Lab 3', teacher: 'Dr. Banner', color: '#14b8a6' },
      { subject: 'Computer Sci', room: 'Lab 1', teacher: 'Ms. Lovelace', color: '#10b981' },
      null,
      { subject: 'World History', room: 'Room 105', teacher: 'Mr. Croft', color: '#f59e0b' },
      { subject: 'Class Counseling', room: 'Room 302', teacher: 'Counselor Grey', color: '#ec4899' },
    ],
    Thursday: [
      { subject: 'Chemistry Lab', room: 'Lab 3', teacher: 'Dr. Banner', color: '#14b8a6' },
      { subject: 'Advanced Math', room: 'Room 302', teacher: 'Dr. Pendelton', color: '#6366f1' },
      { subject: 'Physics', room: 'Room 301', teacher: 'Mr. Vance', color: '#0ea5e9' },
      { subject: 'English Literature', room: 'Room 204', teacher: 'Mrs. Oswald', color: '#ec4899' },
      null,
      { subject: 'Computer Sci', room: 'Lab 1', teacher: 'Ms. Lovelace', color: '#10b981' },
      { subject: 'Art & Design', room: 'Studio 1', teacher: 'Ms. Rivera', color: '#f43f5e' },
    ],
    Friday: [
      { subject: 'World History', room: 'Room 105', teacher: 'Mr. Croft', color: '#f59e0b' },
      { subject: 'Computer Sci', room: 'Lab 1', teacher: 'Ms. Lovelace', color: '#10b981' },
      { subject: 'Advanced Math', room: 'Room 302', teacher: 'Dr. Pendelton', color: '#6366f1' },
      { subject: 'Physics', room: 'Room 301', teacher: 'Mr. Vance', color: '#0ea5e9' },
      null,
      { subject: 'Weekly Assembly', room: 'Main Hall', teacher: 'Administration', color: '#8b5cf6' },
      { subject: 'Club Activities', room: 'Various', teacher: 'Mentors', color: '#10b981' },
    ]
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Class Schedule & Timetable</h1>
          <p className="page-subtitle">Grade 10 • Section A • Current Semester Weekly Roster</p>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table" style={{ textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Period</th>
                {days.map(d => (
                  <th key={d} style={{ textAlign: 'center' }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, pIdx) => {
                if (period.isBreak) {
                  return (
                    <tr key={pIdx} style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ fontWeight: 600, color: '#f59e0b' }}>
                        <div>{period.label}</div>
                        <div className="text-xs text-muted">{period.time}</div>
                      </td>
                      <td colSpan={5} style={{ color: '#94a3b8', fontStyle: 'italic', letterSpacing: '2px' }}>
                        —— LUNCH BREAK ——
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={pIdx}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ color: '#f8fafc' }}>{period.label}</div>
                      <div className="text-xs text-muted">{period.time}</div>
                    </td>
                    {days.map(d => {
                      const item = studentSchedule[d][pIdx];
                      if (!item) return <td key={d}>—</td>;
                      return (
                        <td key={d} style={{ padding: '8px' }}>
                          <div
                            style={{
                              background: `${item.color}15`,
                              border: `1px solid ${item.color}40`,
                              borderLeft: `4px solid ${item.color}`,
                              padding: '10px',
                              borderRadius: '8px',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                              {item.subject}
                            </div>
                            <div className="text-xs" style={{ color: item.color, marginTop: '2px', fontWeight: 500 }}>
                              {item.room} • {item.teacher}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
