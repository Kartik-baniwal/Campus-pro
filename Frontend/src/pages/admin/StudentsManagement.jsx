import { useState, useEffect } from 'react';
import { studentsAPI, adminAPI } from '../../services/api';
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlinePencilSquare } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function StudentsManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    admissionNumber: '', firstName: '', lastName: '', dateOfBirth: '', gender: '',
    bloodGroup: '', address: '', phone: '', email: '', schoolId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    sectionId: '', academicYearId: '', rollNumber: '', createAccount: true, accountPassword: 'Student@123'
  });
  const [sections, setSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    loadStudents();
    loadSections();
    loadAcademicYears();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await studentsAPI.list({ search });
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async () => {
    try {
      const res = await adminAPI.getSections({});
      setSections(res.data);
    } catch (err) { console.error(err); }
  };

  const loadAcademicYears = async () => {
    try {
      const res = await adminAPI.getAcademicYears();
      setAcademicYears(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadStudents(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentsAPI.create(form);
      toast.success('Student created successfully');
      setShowModal(false);
      loadStudents();
      setForm({
        admissionNumber: '', firstName: '', lastName: '', dateOfBirth: '', gender: '',
        bloodGroup: '', address: '', phone: '', email: '', schoolId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        sectionId: '', academicYearId: '', rollNumber: '', createAccount: true, accountPassword: 'Student@123'
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create student');
    }
  };

  return (
    <>
      <div className="content-header">
        <div>
          <h2>Students</h2>
          <p className="text-sm text-muted">Manage student records and enrolments</p>
        </div>
        <div className="content-header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <HiOutlinePlus /> Add Student
          </button>
        </div>
      </div>

      <div className="content-body">
        <div className="flex items-center justify-between mb-4">
          <div className="search-box">
            <HiOutlineMagnifyingGlass className="search-box-icon" />
            <input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-sm text-muted">{students.length} students</span>
        </div>

        {loading ? <div className="loader"><div className="spinner" /></div> : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Admission #</th>
                    <th>Name</th>
                    <th>Grade / Section</th>
                    <th>Roll #</th>
                    <th>Status</th>
                    <th>Account</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 && (
                    <tr><td colSpan="6" className="text-center text-muted" style={{ padding: 60 }}>No students found</td></tr>
                  )}
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td className="font-medium">{s.admission_number}</td>
                      <td>{s.first_name} {s.last_name}</td>
                      <td>{s.grade_name ? `${s.grade_name} - ${s.section_name}` : '—'}</td>
                      <td>{s.roll_number || '—'}</td>
                      <td>
                        <span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${s.account_active ? 'badge-info' : 'badge-warning'}`}>
                          {s.account_email ? (s.account_active ? 'Active' : 'Inactive') : 'No Account'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3>Add New Student</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Admission Number *</label>
                    <input className="form-input" required value={form.admissionNumber}
                      onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Roll Number</label>
                    <input className="form-input" value={form.rollNumber}
                      onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input className="form-input" required value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input className="form-input" required value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-input" value={form.dateOfBirth}
                      onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Academic Year</label>
                    <select className="form-select" value={form.academicYearId}
                      onChange={(e) => setForm({ ...form, academicYearId: e.target.value })}>
                      <option value="">Select Year</option>
                      {academicYears.map((ay) => (
                        <option key={ay.id} value={ay.id}>{ay.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Section</label>
                    <select className="form-select" value={form.sectionId}
                      onChange={(e) => setForm({ ...form, sectionId: e.target.value })}>
                      <option value="">Select Section</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>{s.grade_name} - {s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea className="form-textarea" rows="2" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
