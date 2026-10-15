import { useState } from 'react';
import {
  HiOutlineShieldCheck,
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineKey,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
  HiOutlineXMark
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function UserAccountsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, email: 'admin@school.edu', name: 'Dr. Sarah Jenkins', role: 'admin', status: 'Active', lastLogin: '10 mins ago' },
    { id: 2, email: 'teacher@school.edu', name: 'Dr. Arthur Pendelton', role: 'teacher', status: 'Active', lastLogin: '25 mins ago' },
    { id: 3, email: 'student@school.edu', name: 'Liam Vance', role: 'student', status: 'Active', lastLogin: '1 hour ago' },
    { id: 4, email: 'finance@school.edu', name: 'Jane Doe', role: 'fee_department', status: 'Active', lastLogin: '3 hours ago' },
    { id: 5, email: 'vance.teacher@school.edu', name: 'David Vance', role: 'teacher', status: 'Active', lastLogin: 'Yesterday' },
  ]);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('teacher');
  const [password, setPassword] = useState('Password123!');

  const handleCreate = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      email,
      name,
      role,
      status: 'Active',
      lastLogin: 'Never'
    };
    setUsers([...users, newUser]);
    setShowCreateModal(false);
    toast.success('User account provisioned successfully!');
    setEmail('');
    setName('');
  };

  const toggleLock = (userId) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
    toast.success('User status updated');
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Accounts & Access Control</h1>
          <p className="page-subtitle">Provision logins, manage role-based RBAC permissions, and reset credentials</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <HiOutlinePlus /> Create Account
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <HiOutlineMagnifyingGlass style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
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
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{u.name}</div>
                    <div className="text-xs text-muted">{u.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="text-sm text-muted">{u.lastLogin}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toast.success(`Password reset link dispatched to ${u.email}`)}
                        title="Send Reset Password Link"
                      >
                        <HiOutlineKey />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toggleLock(u.id)}
                        title={u.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                      >
                        {u.status === 'Active' ? <HiOutlineLockClosed /> : <HiOutlineLockOpen />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Provision User Login</h2>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Assigned Role</label>
                    <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
                      <option value="fee_department">Fee Department</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Temporary Password</label>
                    <input
                      type="text"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
