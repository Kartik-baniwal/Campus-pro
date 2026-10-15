import { useState } from 'react';
import { HiOutlineClock, HiOutlineCalendarDays } from 'react-icons/hi2';

export default function TeacherTimetable() {
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

  const scheduleGrid = {
    Monday: [
      { subject: 'Advanced Math', grade: 'Grade 10-A', room: '302', color: '#6366f1' },
      { subject: 'Free Period', isFree: true },
      { subject: 'Physics Lab', grade: 'Grade 11-B', room: 'Lab 2', color: '#0ea5e9' },
      { subject: 'Computer Sci', grade: 'Grade 9-A', room: 'Lab 1', color: '#10b981' },
      null, // Lunch
      { subject: 'Advanced Math', grade: 'Grade 10-B', room: '304', color: '#6366f1' },
      { subject: 'Faculty Meeting', isFree: false, grade: 'Conf Room', room: 'Staff Room', color: '#8b5cf6' },
    ],
    Tuesday: [
      { subject: 'Physics', grade: 'Grade 11-B', room: 'Lab 2', color: '#0ea5e9' },
      { subject: 'Advanced Math', grade: 'Grade 10-A', room: '302', color: '#6366f1' },
      { subject: 'Computer Sci', grade: 'Grade 9-A', room: 'Lab 1', color: '#10b981' },
      { subject: 'Free Period', isFree: true },
      null,
      { subject: 'Calculus I', grade: 'Grade 12-A', room: '405', color: '#f59e0b' },
      { subject: 'Office Hours', isFree: true },
    ],
    Wednesday: [
      { subject: 'Advanced Math', grade: 'Grade 10-A', room: '302', color: '#6366f1' },
      { subject: 'Physics Lab', grade: 'Grade 11-B', room: 'Lab 2', color: '#0ea5e9' },
      { subject: 'Free Period', isFree: true },
      { subject: 'Computer Sci', grade: 'Grade 9-A', room: 'Lab 1', color: '#10b981' },
      null,
      { subject: 'Calculus I', grade: 'Grade 12-A', room: '405', color: '#f59e0b' },
      { subject: 'Class Counseling', grade: 'Grade 10-A', room: '302', color: '#ec4899' },
    ],
    Thursday: [
      { subject: 'Free Period', isFree: true },
      { subject: 'Advanced Math', grade: 'Grade 10-B', room: '304', color: '#6366f1' },
      { subject: 'Physics', grade: 'Grade 11-B', room: 'Lab 2', color: '#0ea5e9' },
      { subject: 'Advanced Math', grade: 'Grade 10-A', room: '302', color: '#6366f1' },
      null,
      { subject: 'Computer Sci', grade: 'Grade 9-A', room: 'Lab 1', color: '#10b981' },
      { subject: 'Free Period', isFree: true },
    ],
    Friday: [
      { subject: 'Calculus I', grade: 'Grade 12-A', room: '405', color: '#f59e0b' },
      { subject: 'Computer Sci', grade: 'Grade 9-A', room: 'Lab 1', color: '#10b981' },
      { subject: 'Advanced Math', grade: 'Grade 10-A', room: '302', color: '#6366f1' },
      { subject: 'Physics', grade: 'Grade 11-B', room: 'Lab 2', color: '#0ea5e9' },
      null,
      { subject: 'Weekly Assembly', grade: 'All School', room: 'Main Hall', color: '#8b5cf6' },
      { subject: 'Lesson Planning', isFree: true },
    ]
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Weekly Teaching Schedule</h1>
          <p className="page-subtitle">Academic timetable and room assignments for current term</p>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table" style={{ textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Period & Time</th>
                {days.map(d => (
                  <th key={d} style={{ textAlign: 'center' }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, pIndex) => {
                if (period.isBreak) {
                  return (
                    <tr key={pIndex} style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ fontWeight: 600, color: '#f59e0b' }}>
                        <div>{period.label}</div>
                        <div className="text-xs text-muted">{period.time}</div>
                      </td>
                      <td colSpan={5} style={{ color: '#94a3b8', fontStyle: 'italic', letterSpacing: '2px' }}>
                        —— RECESS / LUNCH BREAK ——
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={pIndex}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ color: '#f8fafc' }}>{period.label}</div>
                      <div className="text-xs text-muted">{period.time}</div>
                    </td>
                    {days.map(d => {
                      const slot = scheduleGrid[d][pIndex];
                      if (!slot) return <td key={d}>—</td>;
                      if (slot.isFree) {
                        return (
                          <td key={d}>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Free Period</span>
                          </td>
                        );
                      }
                      return (
                        <td key={d} style={{ padding: '8px' }}>
                          <div
                            style={{
                              background: `${slot.color}15`,
                              border: `1px solid ${slot.color}40`,
                              borderLeft: `4px solid ${slot.color}`,
                              padding: '10px',
                              borderRadius: '8px',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                              {slot.subject}
                            </div>
                            <div className="text-xs" style={{ color: slot.color, marginTop: '2px', fontWeight: 500 }}>
                              {slot.grade} • {slot.room}
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
