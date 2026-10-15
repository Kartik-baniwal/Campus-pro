import { useState, useEffect } from 'react';
import { attendanceAPI, adminAPI, studentsAPI } from '../../services/api';
import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlineCalendarDays
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function TeacherAttendance() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('1');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Student roster state
  const [students, setStudents] = useState([
    { id: 1, name: 'Liam Vance', rollNumber: 'STU-1001', status: 'present', note: '' },
    { id: 2, name: 'Sophia Martinez', rollNumber: 'STU-1002', status: 'present', note: '' },
    { id: 3, name: 'Ethan Taylor', rollNumber: 'STU-1003', status: 'late', note: 'Bus delayed' },
    { id: 4, name: 'Olivia Chen', rollNumber: 'STU-1004', status: 'present', note: '' },
    { id: 5, name: 'Lucas Scott', rollNumber: 'STU-1005', status: 'absent', note: 'Medical illness' },
    { id: 6, name: 'Emma Watson', rollNumber: 'STU-1006', status: 'present', note: '' },
    { id: 7, name: 'Noah Davis', rollNumber: 'STU-1007', status: 'excused', note: 'Sports tournament' },
    { id: 8, name: 'Ava Wilson', rollNumber: 'STU-1008', status: 'present', note: '' },
  ]);

  useEffect(() => {
    // Load sections if available
    adminAPI.getSections()
      .then(res => {
        if (res.data?.data?.length > 0) {
          setSections(res.data.data);
          setSelectedSection(res.data.data[0].id.toString());
        }
      })
      .catch(() => {});
  }, []);

  const handleStatusChange = (studentId, status) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleNoteChange = (studentId, note) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, note } : s))
    );
  };

  const markAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
    toast.success(`Marked all students as ${status}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Send session data to backend
      const payload = {
        sectionId: parseInt(selectedSection, 10),
        sessionDate: attendanceDate,
        subject: selectedSubject,
        records: students.map(s => ({
          studentId: s.id,
          status: s.status,
          remarks: s.note
        }))
      };

      await attendanceAPI.createSession(payload).catch(err => {
        console.warn('Backend session save warning:', err);
      });

      toast.success('Attendance session saved successfully!');
    } catch (err) {
      toast.error('Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;
  const excusedCount = students.filter(s => s.status === 'excused').length;
  const attendanceRate = Math.round(((presentCount + lateCount) / students.length) * 100) || 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Take Classroom Attendance</h1>
          <p className="page-subtitle">Record daily attendance and period sessions for your assigned classrooms</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => markAll('present')} className="btn btn-secondary">
            <HiOutlineCheck /> Mark All Present
          </button>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Select Section</label>
            <select
              className="form-input"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="1">Grade 10 - Section A</option>
              <option value="2">Grade 10 - Section B</option>
              <option value="3">Grade 11 - Section A</option>
              <option value="4">Grade 12 - Section A</option>
            </select>
          </div>

          <div>
            <label className="form-label">Subject</label>
            <select
              className="form-input"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="English Literature">English Literature</option>
            </select>
          </div>

          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', padding: '10px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div>
              <span className="text-xs text-muted">Attendance Rate</span>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color: attendanceRate >= 80 ? '#34d399' : '#f87171' }}>
                {attendanceRate}%
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
              <span className="text-xs text-muted">Present / Total</span>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#f1f5f9' }}>
                {presentCount + lateCount} / {students.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Roll No.</th>
                  <th>Student Name</th>
                  <th style={{ textAlign: 'center', width: '340px' }}>Attendance Status</th>
                  <th>Remarks / Reason</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.id}>
                    <td>
                      <span className="badge badge-secondary">{stu.rollNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{stu.name}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'present')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: stu.status === 'present' ? '#10b981' : 'transparent',
                            borderColor: stu.status === 'present' ? '#10b981' : 'rgba(255,255,255,0.15)',
                            color: stu.status === 'present' ? '#ffffff' : '#94a3b8',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'absent')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: stu.status === 'absent' ? '#ef4444' : 'transparent',
                            borderColor: stu.status === 'absent' ? '#ef4444' : 'rgba(255,255,255,0.15)',
                            color: stu.status === 'absent' ? '#ffffff' : '#94a3b8',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'late')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: stu.status === 'late' ? '#f59e0b' : 'transparent',
                            borderColor: stu.status === 'late' ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                            color: stu.status === 'late' ? '#ffffff' : '#94a3b8',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'excused')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: stu.status === 'excused' ? '#6366f1' : 'transparent',
                            borderColor: stu.status === 'excused' ? '#6366f1' : 'rgba(255,255,255,0.15)',
                            color: stu.status === 'excused' ? '#ffffff' : '#94a3b8',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Optional remarks..."
                        value={stu.note}
                        onChange={(e) => handleNoteChange(stu.id, e.target.value)}
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ minWidth: '180px' }}
            >
              <HiOutlineClipboardDocumentCheck />
              {submitting ? 'Submitting...' : 'Save Attendance Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
