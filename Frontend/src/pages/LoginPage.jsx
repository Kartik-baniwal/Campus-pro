import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineExclamationCircle } from 'react-icons/hi2';

const demoAccounts = [
  { role: 'Admin', email: 'admin@school.com', password: 'Admin@123' },
  { role: 'Teacher', email: 'teacher@school.com', password: 'Admin@123' },
  { role: 'Student', email: 'student@school.com', password: 'Admin@123' },
  { role: 'Fee Dept', email: 'fee@school.com', password: 'Admin@123' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const routes = {
        admin: '/admin',
        teacher: '/teacher',
        student: '/student',
        fee_department: '/fees',
      };
      navigate(routes[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">
            <HiOutlineAcademicCap />
          </div>
          <h1>SchoolSync</h1>
        </div>

        <div className="login-form-container">
          <h2>Welcome back</h2>
          <p>Sign in to access your school management dashboard</p>

          {error && (
            <div className="login-error">
              <HiOutlineExclamationCircle size={18} /> {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="demo-credentials">
            <h4>Demo Accounts (click to fill)</h4>
            {demoAccounts.map((acc) => (
              <div key={acc.role} className="demo-item" onClick={() => fillCredentials(acc)} style={{ cursor: 'pointer' }}>
                <span>{acc.role}</span>
                <code>{acc.email}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-illustration">
          <span className="emoji">🏫</span>
          <h3>School Management</h3>
          <p>A complete platform for students, teachers, administrators, and fee management.</p>
        </div>
      </div>
    </div>
  );
}
