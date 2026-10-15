import { useState } from 'react';
import {
  HiOutlineDocumentText,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineArrowDownTray
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function TeacherAssessments() {
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      title: 'Mid-Term Examination 2026',
      subject: 'Mathematics',
      section: 'Grade 10 - Section A',
      date: '2026-10-05',
      maxMarks: 100,
      weightage: '30%',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Thermodynamics Unit Quiz',
      subject: 'Physics',
      section: 'Grade 11 - Section B',
      date: '2026-10-10',
      maxMarks: 25,
      weightage: '10%',
      status: 'Graded (Draft)'
    },
    {
      id: 3,
      title: 'Quarter 1 Practical Assessment',
      subject: 'Computer Science',
      section: 'Grade 9 - Section A',
      date: '2026-10-22',
      maxMarks: 50,
      weightage: '20%',
      status: 'Scheduled'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [gradebookModal, setGradebookModal] = useState(null);

  // Gradebook roster for the active assessment
  const [gradebookRows, setGradebookRows] = useState([
    { studentId: 1, name: 'Liam Vance', roll: 'STU-1001', marks: '88', grade: 'A' },
    { studentId: 2, name: 'Sophia Martinez', roll: 'STU-1002', marks: '94', grade: 'A+' },
    { studentId: 3, name: 'Ethan Taylor', roll: 'STU-1003', marks: '76', grade: 'B+' },
    { studentId: 4, name: 'Olivia Chen', roll: 'STU-1004', marks: '82', grade: 'A-' },
    { studentId: 5, name: 'Lucas Scott', roll: 'STU-1005', marks: '65', grade: 'C+' },
  ]);

  // New assessment form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [section, setSection] = useState('Grade 10 - Section A');
  const [date, setDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [weightage, setWeightage] = useState('20%');

  const handleCreate = (e) => {
    e.preventDefault();
    const newAss = {
      id: Date.now(),
      title,
      subject,
      section,
      date,
      maxMarks: parseInt(maxMarks, 10),
      weightage,
      status: 'Scheduled'
    };
    setAssessments([newAss, ...assessments]);
    setShowCreateModal(false);
    toast.success('Assessment scheduled successfully!');
    setTitle('');
  };

  const handleMarksChange = (studentId, val) => {
    setGradebookRows(prev =>
      prev.map(r => {
        if (r.studentId === studentId) {
          const num = parseFloat(val) || 0;
          let letter = 'F';
          if (num >= 90) letter = 'A+';
          else if (num >= 80) letter = 'A';
          else if (num >= 70) letter = 'B';
          else if (num >= 60) letter = 'C';
          else if (num >= 50) letter = 'D';
          return { ...r, marks: val, grade: letter };
        }
        return r;
      })
    );
  };

  const saveGradebook = () => {
    toast.success('Gradebook saved in draft state.');
  };

  const publishGradebook = () => {
    if (gradebookModal) {
      setAssessments(prev =>
        prev.map(a => (a.id === gradebookModal.id ? { ...a, status: 'Published' } : a))
      );
    }
    setGradebookModal(null);
    toast.success('Results published to student and guardian portals!');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gradebook & Official Assessments</h1>
          <p className="page-subtitle">Standardized exams, unit evaluations, and grade entry</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <HiOutlinePlus /> Create Assessment
        </button>
      </div>

      {/* Assessment Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Assessment Name</th>
                <th>Subject & Section</th>
                <th>Exam Date</th>
                <th>Max Marks</th>
                <th>Weightage</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.title}</div>
                  </td>
                  <td>
                    <div>{item.subject}</div>
                    <div className="text-xs text-muted">{item.section}</div>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.maxMarks} marks</td>
                  <td>{item.weightage}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === 'Published'
                          ? 'badge-success'
                          : item.status.includes('Draft')
                          ? 'badge-warning'
                          : 'badge-secondary'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setGradebookModal(item)}
                    >
                      Enter Marks & Grades
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gradebook Entry Modal */}
      {gradebookModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Enter Grades: {gradebookModal.title}</h2>
                <div className="text-sm text-muted">
                  {gradebookModal.subject} • {gradebookModal.section} • Max Marks: {gradebookModal.maxMarks}
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setGradebookModal(null)}>
                <HiOutlineXMark />
              </button>
            </div>

            <div className="modal-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Roll No.</th>
                      <th>Student</th>
                      <th style={{ width: '150px' }}>Marks Obtained</th>
                      <th>Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradebookRows.map((r) => (
                      <tr key={r.studentId}>
                        <td>
                          <span className="badge badge-secondary">{r.roll}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{r.name}</td>
                        <td>
                          <input
                            type="number"
                            step="0.5"
                            max={gradebookModal.maxMarks}
                            className="form-input"
                            value={r.marks}
                            onChange={(e) => handleMarksChange(r.studentId, e.target.value)}
                            style={{ padding: '6px 12px' }}
                          />
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              r.grade.startsWith('A')
                                ? 'badge-success'
                                : r.grade.startsWith('B')
                                ? 'badge-primary'
                                : 'badge-warning'
                            }`}
                          >
                            {r.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setGradebookModal(null)}>
                Cancel
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={saveGradebook}>
                  Save Draft
                </button>
                <button className="btn btn-primary" onClick={publishGradebook}>
                  <HiOutlinePaperAirplane /> Publish to Students
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Create Formal Assessment</h2>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Assessment Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Mid-Term Examination 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Subject</label>
                    <select
                      className="form-input"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Section</label>
                    <select
                      className="form-input"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                    >
                      <option value="Grade 10 - Section A">Grade 10 - Section A</option>
                      <option value="Grade 11 - Section B">Grade 11 - Section B</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Max Marks</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Weightage</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 20%"
                      value={weightage}
                      onChange={(e) => setWeightage(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
