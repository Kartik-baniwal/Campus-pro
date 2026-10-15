import { useState } from 'react';
import {
  HiOutlineChartBar,
  HiOutlineAcademicCap,
  HiOutlineArrowDownTray,
  HiOutlineTrophy
} from 'react-icons/hi2';

export default function StudentResults() {
  const [selectedTerm, setSelectedTerm] = useState('Term 1 - Fall 2026');

  const reportCard = {
    studentName: 'Liam Vance',
    rollNumber: 'STU-1001',
    gradeLevel: 'Grade 10 - Section A',
    gpa: '3.92',
    rank: '3 of 32',
    subjects: [
      { id: 1, name: 'Advanced Mathematics', credits: 4, internal: 28, midterm: 48, finalExam: 19, total: 95, grade: 'A+', remarks: 'Exceptional analytical insight' },
      { id: 2, name: 'Physics & Kinetics', credits: 4, internal: 26, midterm: 44, finalExam: 18, total: 88, grade: 'A', remarks: 'Consistent experimental skills' },
      { id: 3, name: 'Computer Science', credits: 3, internal: 29, midterm: 49, finalExam: 20, total: 98, grade: 'A+', remarks: 'Outstanding algorithmic code' },
      { id: 4, name: 'English Literature', credits: 3, internal: 27, midterm: 43, finalExam: 17, total: 87, grade: 'A', remarks: 'Thoughtful essay structure' },
      { id: 5, name: 'World History', credits: 3, internal: 25, midterm: 40, finalExam: 17, total: 82, grade: 'A-', remarks: 'Good grasp of historical timelines' },
    ]
  };

  const totalCredits = reportCard.subjects.reduce((acc, s) => acc + s.credits, 0);
  const avgTotal = Math.round(reportCard.subjects.reduce((acc, s) => acc + s.total, 0) / reportCard.subjects.length);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Academic Results & Report Card</h1>
          <p className="page-subtitle">Official transcripts, semester assessment scores, and teacher evaluations</p>
        </div>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          <HiOutlineArrowDownTray /> Print Report Card
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Term GPA</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              <HiOutlineAcademicCap />
            </div>
          </div>
          <div className="stat-value">{reportCard.gpa} / 4.0</div>
          <div className="stat-footer text-emerald">Distinction Honor Roll</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Average Percentage</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
              <HiOutlineChartBar />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#34d399' }}>{avgTotal}%</div>
          <div className="stat-footer text-muted">Across all subjects</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Class Rank</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
              <HiOutlineTrophy />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>{reportCard.rank}</div>
          <div className="stat-footer text-muted">Top 10 percentile</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Earned Credits</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              <HiOutlineAcademicCap />
            </div>
          </div>
          <div className="stat-value">{totalCredits} pts</div>
          <div className="stat-footer text-muted">Full credit load completed</div>
        </div>
      </div>

      {/* Report Card Table */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title">Term 1 Official Grade Breakdown</h2>
            <div className="text-sm text-muted">{reportCard.gradeLevel} • Academic Year 2026–2027</div>
          </div>
          <span className="badge badge-success">Verified by Registrar</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Credits</th>
                <th>Assignments (30)</th>
                <th>Mid-Term (50)</th>
                <th>Practicals (20)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>Teacher Remarks</th>
              </tr>
            </thead>
            <tbody>
              {reportCard.subjects.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>{s.name}</td>
                  <td>{s.credits}</td>
                  <td>{s.internal}</td>
                  <td>{s.midterm}</td>
                  <td>{s.finalExam}</td>
                  <td style={{ fontWeight: 700, color: '#38bdf8' }}>{s.total}</td>
                  <td>
                    <span className={`badge ${s.grade.startsWith('A') ? 'badge-success' : 'badge-primary'}`}>
                      {s.grade}
                    </span>
                  </td>
                  <td className="text-sm text-muted">{s.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
