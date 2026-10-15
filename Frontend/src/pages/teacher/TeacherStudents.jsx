import { useState } from 'react';
import {
  HiOutlineUsers,
  HiOutlineMagnifyingGlass,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineCheckCircle
} from 'react-icons/hi2';

export default function TeacherStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');

  const [students] = useState([
    { id: 1, name: 'Liam Vance', rollNumber: 'STU-1001', section: 'Grade 10 - A', email: 'liam.v@example.com', guardianName: 'David Vance', guardianPhone: '+1 (555) 234-5678', attendanceRate: 96, gpa: '3.9' },
    { id: 2, name: 'Sophia Martinez', rollNumber: 'STU-1002', section: 'Grade 10 - A', email: 'sophia.m@example.com', guardianName: 'Elena Martinez', guardianPhone: '+1 (555) 345-6789', attendanceRate: 98, gpa: '4.0' },
    { id: 3, name: 'Ethan Taylor', rollNumber: 'STU-1003', section: 'Grade 11 - B', email: 'ethan.t@example.com', guardianName: 'Mark Taylor', guardianPhone: '+1 (555) 456-7890', attendanceRate: 88, gpa: '3.4' },
    { id: 4, name: 'Olivia Chen', rollNumber: 'STU-1004', section: 'Grade 10 - A', email: 'olivia.c@example.com', guardianName: 'Wei Chen', guardianPhone: '+1 (555) 567-8901', attendanceRate: 94, gpa: '3.8' },
    { id: 5, name: 'Lucas Scott', rollNumber: 'STU-1005', section: 'Grade 11 - B', email: 'lucas.s@example.com', guardianName: 'Sarah Scott', guardianPhone: '+1 (555) 678-9012', attendanceRate: 82, gpa: '3.1' },
    { id: 6, name: 'Emma Watson', rollNumber: 'STU-1006', section: 'Grade 9 - A', email: 'emma.w@example.com', guardianName: 'Robert Watson', guardianPhone: '+1 (555) 789-0123', attendanceRate: 97, gpa: '3.95' },
  ]);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSection = selectedSection === 'All' || s.section.includes(selectedSection);
    return matchSearch && matchSection;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assigned Students Roster</h1>
          <p className="page-subtitle">Directory of students across your active sections and subjects</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <HiOutlineMagnifyingGlass style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Grade 10', 'Grade 11', 'Grade 9'].map(sec => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSection(sec)}
                className={`btn btn-sm ${selectedSection === sec ? 'btn-primary' : 'btn-secondary'}`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Section</th>
                <th>Guardian Contact</th>
                <th>Attendance</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{s.name}</div>
                    <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <HiOutlineEnvelope /> {s.email}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{s.rollNumber}</span>
                  </td>
                  <td>{s.section}</td>
                  <td>
                    <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{s.guardianName}</div>
                    <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <HiOutlinePhone /> {s.guardianPhone}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: s.attendanceRate >= 90 ? '#34d399' : '#fbbf24' }}>
                        {s.attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{s.gpa}</span>
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
