import { useState } from 'react';
import {
  HiOutlineClipboardDocumentList,
  HiOutlinePlus,
  HiOutlineCalendarDays,
  HiOutlineDocumentCheck,
  HiOutlineXMark,
  HiOutlineChatBubbleBottomCenterText
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function TeacherAssignments() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradingModalOpen, setGradingModalOpen] = useState(false);

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Quadratic Equations & Polynomial Graphing',
      subject: 'Mathematics',
      section: 'Grade 10 - Section A',
      dueDate: '2026-10-20',
      maxScore: 100,
      submissionsCount: 24,
      totalStudents: 28,
      status: 'Active',
      description: 'Solve exercises 4.1 to 4.5 including graph plots of quadratic parabolas.'
    },
    {
      id: 2,
      title: 'Newtonian Laws & Kinematics Lab Analysis',
      subject: 'Physics',
      section: 'Grade 11 - Section B',
      dueDate: '2026-10-18',
      maxScore: 50,
      submissionsCount: 22,
      totalStudents: 25,
      status: 'Active',
      description: 'Submit lab observations, calculation errors and graphical displacement vs time.'
    },
    {
      id: 3,
      title: 'Python Algorithmic Complexity Problem Set',
      subject: 'Computer Science',
      section: 'Grade 9 - Section A',
      dueDate: '2026-10-12',
      maxScore: 100,
      submissionsCount: 30,
      totalStudents: 30,
      status: 'Closed',
      description: 'Implement Big-O runtime benchmarks for sorting algorithms.'
    }
  ]);

  const [submissions, setSubmissions] = useState([
    { id: 1, studentName: 'Liam Vance', rollNumber: 'STU-1001', submittedAt: '2026-10-14 14:20', score: 92, feedback: 'Excellent reasoning and neat graphs.', status: 'Graded' },
    { id: 2, studentName: 'Sophia Martinez', rollNumber: 'STU-1002', submittedAt: '2026-10-14 15:45', score: null, feedback: '', status: 'Pending' },
    { id: 3, studentName: 'Ethan Taylor', rollNumber: 'STU-1003', submittedAt: '2026-10-14 16:10', score: null, feedback: '', status: 'Pending' },
    { id: 4, studentName: 'Olivia Chen', rollNumber: 'STU-1004', submittedAt: '2026-10-14 11:30', score: 88, feedback: 'Good effort, check question 3 derivation.', status: 'Graded' },
  ]);

  const [activeSubmission, setActiveSubmission] = useState(null);
  const [scoreInput, setScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newSection, setNewSection] = useState('Grade 10 - Section A');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMaxScore, setNewMaxScore] = useState('100');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) {
      toast.error('Please fill in required fields');
      return;
    }

    const created = {
      id: Date.now(),
      title: newTitle,
      subject: newSubject,
      section: newSection,
      dueDate: newDueDate,
      maxScore: parseInt(newMaxScore, 10),
      submissionsCount: 0,
      totalStudents: 28,
      status: 'Active',
      description: newDesc
    };

    setAssignments([created, ...assignments]);
    setShowCreateModal(false);
    toast.success('Assignment published to students!');
    // Reset form
    setNewTitle('');
    setNewDueDate('');
    setNewDesc('');
  };

  const openGrading = (sub) => {
    setActiveSubmission(sub);
    setScoreInput(sub.score !== null ? sub.score.toString() : '');
    setFeedbackInput(sub.feedback || '');
  };

  const saveGrade = (e) => {
    e.preventDefault();
    if (!activeSubmission) return;

    setSubmissions(prev =>
      prev.map(s =>
        s.id === activeSubmission.id
          ? { ...s, score: parseFloat(scoreInput), feedback: feedbackInput, status: 'Graded' }
          : s
      )
    );
    setActiveSubmission(null);
    toast.success('Grade and feedback saved!');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Class Assignments & Homework</h1>
          <p className="page-subtitle">Create, distribute coursework and grade student submissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <HiOutlinePlus /> Create Assignment
        </button>
      </div>

      {/* Assignment List */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Subject & Section</th>
                <th>Due Date</th>
                <th>Submissions</th>
                <th>Max Score</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.title}</div>
                    <div className="text-xs text-muted" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.description}
                    </div>
                  </td>
                  <td>
                    <div>{item.subject}</div>
                    <div className="text-xs text-muted">{item.section}</div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <HiOutlineCalendarDays /> {item.dueDate}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#38bdf8' }}>
                      {item.submissionsCount} / {item.totalStudents}
                    </span>
                  </td>
                  <td>{item.maxScore} pts</td>
                  <td>
                    <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedAssignment(item);
                        setGradingModalOpen(true);
                      }}
                    >
                      <HiOutlineDocumentCheck /> Review Submissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Create New Assignment</h2>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleCreateAssignment}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Assignment Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Chapter 4 Calculus Problem Set"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Subject</label>
                    <select
                      className="form-input"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
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
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                    >
                      <option value="Grade 10 - Section A">Grade 10 - Section A</option>
                      <option value="Grade 11 - Section B">Grade 11 - Section B</option>
                      <option value="Grade 9 - Section A">Grade 9 - Section A</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Due Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Total Points / Score</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newMaxScore}
                      onChange={(e) => setNewMaxScore(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Instructions & Description</label>
                  <textarea
                    rows={4}
                    className="form-input"
                    placeholder="Enter instructions, resource links or criteria for grading..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Submissions Modal */}
      {gradingModalOpen && selectedAssignment && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ maxWidth: '850px' }}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Submissions: {selectedAssignment.title}</h2>
                <div className="text-sm text-muted">
                  {selectedAssignment.subject} • Max Score: {selectedAssignment.maxScore} pts
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setGradingModalOpen(false)}>
                <HiOutlineXMark />
              </button>
            </div>

            <div className="modal-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Submitted At</th>
                      <th>Score</th>
                      <th>Feedback</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr key={sub.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{sub.studentName}</div>
                          <span className="text-xs text-muted">{sub.rollNumber}</span>
                        </td>
                        <td className="text-sm text-muted">{sub.submittedAt}</td>
                        <td style={{ fontWeight: 700, color: sub.score !== null ? '#34d399' : '#94a3b8' }}>
                          {sub.score !== null ? `${sub.score} / ${selectedAssignment.maxScore}` : '—'}
                        </td>
                        <td className="text-sm text-muted" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.feedback || 'None'}
                        </td>
                        <td>
                          <span className={`badge ${sub.status === 'Graded' ? 'badge-success' : 'badge-warning'}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openGrading(sub)}
                          >
                            Grade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Inline Grading Form when a submission is selected */}
              {activeSubmission && (
                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#c7d2fe' }}>
                    Grading: {activeSubmission.studentName} ({activeSubmission.rollNumber})
                  </h4>
                  <form onSubmit={saveGrade} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
                    <div>
                      <label className="form-label">Score (Max {selectedAssignment.maxScore})</label>
                      <input
                        type="number"
                        step="0.5"
                        max={selectedAssignment.maxScore}
                        className="form-input"
                        required
                        value={scoreInput}
                        onChange={(e) => setScoreInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Teacher Feedback</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Constructive feedback for student..."
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setGradingModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
