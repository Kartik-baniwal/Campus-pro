import { useState } from 'react';
import {
  HiOutlineBookOpen,
  HiOutlinePlus,
  HiOutlineXMark,
  HiOutlineAcademicCap
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function SubjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState([
    { id: 1, code: 'MATH-101', name: 'Advanced Mathematics', credits: 4, department: 'Mathematics & Computing', gradeLevel: 'Grade 10, 11' },
    { id: 2, code: 'PHYS-201', name: 'Physics & Kinetics', credits: 4, department: 'Natural Sciences', gradeLevel: 'Grade 11, 12' },
    { id: 3, code: 'CS-301', name: 'Computer Science & Algorithms', credits: 3, department: 'Technology', gradeLevel: 'Grade 9, 10, 11' },
    { id: 4, code: 'ENG-102', name: 'English Literature & Composition', credits: 3, department: 'Humanities', gradeLevel: 'Grade 9, 10' },
    { id: 5, code: 'CHEM-202', name: 'General & Organic Chemistry', credits: 4, department: 'Natural Sciences', gradeLevel: 'Grade 11, 12' },
  ]);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('4');
  const [department, setDepartment] = useState('Natural Sciences');
  const [gradeLevel, setGradeLevel] = useState('Grade 10');

  const handleCreate = (e) => {
    e.preventDefault();
    const newSub = {
      id: Date.now(),
      name,
      code: code.toUpperCase(),
      credits: parseInt(credits, 10),
      department,
      gradeLevel
    };
    setSubjects([...subjects, newSub]);
    setShowModal(false);
    toast.success('Subject added to curriculum!');
    setName('');
    setCode('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Curriculum Subjects</h1>
          <p className="page-subtitle">Configure academic subjects, course codes, departments, and credit weights</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <HiOutlinePlus /> Add Subject
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Subject Name</th>
                <th>Department</th>
                <th>Applicable Grades</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id}>
                  <td>
                    <span className="badge badge-primary">{s.code}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>{s.name}</td>
                  <td className="text-sm text-muted">{s.department}</td>
                  <td>
                    <span className="badge badge-secondary">{s.gradeLevel}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#38bdf8' }}>{s.credits} Credits</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Add Curriculum Subject</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Subject Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Environmental Science"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Course Code *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. ENV-101"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Credits</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={credits}
                      onChange={(e) => setCredits(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Department</label>
                    <select className="form-input" value={department} onChange={(e) => setDepartment(e.target.value)}>
                      <option value="Natural Sciences">Natural Sciences</option>
                      <option value="Mathematics & Computing">Mathematics & Computing</option>
                      <option value="Humanities">Humanities</option>
                      <option value="Languages">Languages</option>
                      <option value="Arts & Physical Ed">Arts & Physical Ed</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Grade Levels</label>
                    <input
                      type="text"
                      className="form-input"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
