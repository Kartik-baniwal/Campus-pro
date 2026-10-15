import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { HiOutlinePlus } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    schoolId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', employeeId: '', firstName: '', lastName: '',
    department: '', designation: '', qualification: '', phone: '', email: '',
    role: 'teacher', createAccount: true, accountPassword: 'Staff@123'
  });

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    try { const res = await adminAPI.getStaff(); setStaff(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createStaff(form);
      toast.success('Staff member created');
      setShowModal(false);
      loadStaff();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to create staff'); }
  };

  return (
    <>
      <div className="content-header">
        <div><h2>Staff Management</h2><p className="text-sm text-muted">Manage teachers and staff</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiOutlinePlus /> Add Staff</button>
      </div>
      <div className="content-body">
        {loading ? <div className="loader"><div className="spinner" /></div> : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <thead>
                  <tr><th>Employee ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Status</th><th>Account</th></tr>
                </thead>
                <tbody>
                  {staff.length === 0 && <tr><td colSpan="6" className="text-center text-muted" style={{padding:60}}>No staff</td></tr>}
                  {staff.map((s) => (
                    <tr key={s.id}>
                      <td className="font-medium">{s.employee_id}</td>
                      <td>{s.first_name} {s.last_name}</td>
                      <td>{s.department || '—'}</td>
                      <td>{s.designation || '—'}</td>
                      <td><span className={`badge ${s.status==='active'?'badge-success':'badge-danger'}`}>{s.status}</span></td>
                      <td><span className={`badge ${s.account_active?'badge-info':'badge-warning'}`}>{s.account_email ? (s.account_active ? 'Active' : 'Inactive') : 'No Account'}</span></td>
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
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{maxWidth:600}}>
            <div className="modal-header"><h3>Add Staff Member</h3><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Employee ID *</label>
                    <input className="form-input" required value={form.employeeId} onChange={(e)=>setForm({...form,employeeId:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Role</label>
                    <select className="form-select" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
                      <option value="teacher">Teacher</option><option value="admin">Admin</option><option value="fee_department">Fee Dept</option>
                    </select></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">First Name *</label>
                    <input className="form-input" required value={form.firstName} onChange={(e)=>setForm({...form,firstName:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Last Name *</label>
                    <input className="form-input" required value={form.lastName} onChange={(e)=>setForm({...form,lastName:e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Email</label>
                    <input type="email" className="form-input" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Department</label>
                    <input className="form-input" value={form.department} onChange={(e)=>setForm({...form,department:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Designation</label>
                    <input className="form-input" value={form.designation} onChange={(e)=>setForm({...form,designation:e.target.value})} /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
