import { useState } from 'react';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineMagnifyingGlass,
  HiOutlineCalendarDays
} from 'react-icons/hi2';

export default function AdminAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [assignments] = useState([
    { id: 1, title: 'Quadratic Equations & Polynomial Graphing', teacher: 'Dr. Arthur Pendelton', subject: 'Mathematics', grade: 'Grade 10 - A', dueDate: '2026-10-20', submissions: '24 / 28', status: 'Active' },
    { id: 2, title: 'Newtonian Laws & Kinematics Lab Analysis', teacher: 'Mr. David Vance', subject: 'Physics', grade: 'Grade 11 - B', dueDate: '2026-10-18', submissions: '22 / 25', status: 'Active' },
    { id: 3, title: 'Python Algorithmic Complexity Problem Set', teacher: 'Ms. Ada Lovelace', subject: 'Computer Science', grade: 'Grade 9 - A', dueDate: '2026-10-12', submissions: '30 / 30', status: 'Closed' },
    { id: 4, title: 'Shakespearean Dramatic Monologue Analysis', teacher: 'Mrs. Clara Oswald', subject: 'English', grade: 'Grade 10 - A', dueDate: '2026-10-25', submissions: '12 / 28', status: 'Active' },
  ]);

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">School-wide Assignments Oversight</h1>
          <p className="page-subtitle">Monitor academic workload, submission compliance, and faculty grading velocity</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <HiOutlineMagnifyingGlass style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by assignment title, teacher name, or subject..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Instructor</th>
                <th>Subject & Section</th>
                <th>Due Date</th>
                <th>Turn-in Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{a.title}</div>
                  </td>
                  <td>{a.teacher}</td>
                  <td>
                    <div>{a.subject}</div>
                    <div className="text-xs text-muted">{a.grade}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <HiOutlineCalendarDays /> {a.dueDate}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#38bdf8' }}>{a.submissions}</span>
                  </td>
                  <td>
                    <span className={`badge ${a.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
                      {a.status}
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
