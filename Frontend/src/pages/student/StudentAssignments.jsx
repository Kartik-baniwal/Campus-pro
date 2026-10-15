import { useState } from 'react';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlinePaperAirplane,
  HiOutlineXMark,
  HiOutlineArrowUpTray
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function StudentAssignments() {
  const [filter, setFilter] = useState('all'); // all | pending | submitted | graded
  const [submitModal, setSubmitModal] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Quadratic Equations & Polynomial Graphing',
      subject: 'Mathematics',
      teacher: 'Dr. Arthur Pendelton',
      dueDate: '2026-10-20',
      maxScore: 100,
      status: 'pending',
      description: 'Solve exercises 4.1 to 4.5 including graph plots of quadratic parabolas.',
      score: null,
      feedback: null,
    },
    {
      id: 2,
      title: 'Newtonian Laws & Kinematics Lab Analysis',
      subject: 'Physics',
      teacher: 'Mr. David Vance',
      dueDate: '2026-10-18',
      maxScore: 50,
      status: 'submitted',
      description: 'Submit lab observations, calculation errors and graphical displacement vs time.',
      submittedAt: '2026-10-14 10:15 AM',
      score: null,
      feedback: null,
    },
    {
      id: 3,
      title: 'Python Algorithmic Complexity Problem Set',
      subject: 'Computer Science',
      teacher: 'Ms. Ada Lovelace',
      dueDate: '2026-10-12',
      maxScore: 100,
      status: 'graded',
      description: 'Implement Big-O runtime benchmarks for sorting algorithms.',
      submittedAt: '2026-10-11 04:30 PM',
      score: 95,
      feedback: 'Outstanding algorithmic implementation and clean docstrings!',
    },
  ]);

  const handleSubmitWork = (e) => {
    e.preventDefault();
    if (!submissionText && !attachmentName) {
      toast.error('Please enter your response or attach your work');
      return;
    }

    setAssignments(prev =>
      prev.map(a =>
        a.id === submitModal.id
          ? {
              ...a,
              status: 'submitted',
              submittedAt: 'Just now',
            }
          : a
      )
    );

    toast.success('Assignment submitted successfully!');
    setSubmitModal(null);
    setSubmissionText('');
    setAttachmentName('');
  };

  const filtered = assignments.filter(a => {
    if (filter === 'pending') return a.status === 'pending';
    if (filter === 'submitted') return a.status === 'submitted';
    if (filter === 'graded') return a.status === 'graded';
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments & Coursework</h1>
          <p className="page-subtitle">Track homework, turn in coursework, and review teacher feedback</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'pending', label: 'To Do (Pending)' },
            { id: 'submitted', label: 'Turned In' },
            { id: 'graded', label: 'Graded & Returned' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`btn btn-sm ${filter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filtered.map(item => (
          <div
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: item.status === 'pending'
                ? '4px solid #f59e0b'
                : item.status === 'submitted'
                ? '4px solid #38bdf8'
                : '4px solid #10b981'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="badge badge-secondary">{item.subject}</span>
                <span
                  className={`badge ${
                    item.status === 'pending'
                      ? 'badge-warning'
                      : item.status === 'submitted'
                      ? 'badge-primary'
                      : 'badge-success'
                  }`}
                >
                  {item.status === 'pending' ? 'To Do' : item.status === 'submitted' ? 'Under Review' : 'Graded'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p className="text-sm text-muted" style={{ marginBottom: '16px', lineHeight: 1.5 }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                  <HiOutlineCalendarDays /> Due: <span style={{ color: '#f1f5f9' }}>{item.dueDate}</span>
                </div>
                <div className="text-muted">Instructor: {item.teacher}</div>
                <div className="text-muted">Max Score: {item.maxScore} points</div>
              </div>

              {/* Feedback box if graded */}
              {item.status === 'graded' && (
                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#34d399', fontSize: '0.9rem' }}>Result: {item.score} / {item.maxScore}</span>
                    <span className="badge badge-success">Passed</span>
                  </div>
                  <div className="text-xs text-muted" style={{ fontStyle: 'italic' }}>
                    "{item.feedback}"
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              {item.status === 'pending' ? (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setSubmitModal(item)}
                >
                  <HiOutlinePaperAirplane /> Turn In Work
                </button>
              ) : item.status === 'submitted' ? (
                <div style={{ textAlign: 'center', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 500 }}>
                  ✓ Submitted ({item.submittedAt})
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ Graded & Recorded
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Assignment Modal */}
      {submitModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Submit: {submitModal.title}</h2>
                <div className="text-sm text-muted">{submitModal.subject} • Due {submitModal.dueDate}</div>
              </div>
              <button className="modal-close-btn" onClick={() => setSubmitModal(null)}>
                <HiOutlineXMark />
              </button>
            </div>

            <form onSubmit={handleSubmitWork}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Written Response / Solution Text</label>
                  <textarea
                    rows={5}
                    className="form-input"
                    placeholder="Type or paste your answer, equations, or submission notes here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Attach File / Document Link</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. https://drive.google.com/homework-submission.pdf or filename"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSubmitModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <HiOutlinePaperAirplane /> Submit to Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
