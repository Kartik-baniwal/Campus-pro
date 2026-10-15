import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  HiOutlineUsers, HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineTableCells,
  HiOutlineClipboardDocumentCheck, HiOutlineClock
} from 'react-icons/hi2';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await adminAPI.getDashboard();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <>
      <div className="content-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="text-sm text-muted">School overview and management</p>
        </div>
      </div>

      <div className="content-body">
        <div className="stats-grid animate-in">
          <div className="stat-card primary">
            <div className="stat-icon primary"><HiOutlineUsers /></div>
            <div className="stat-info">
              <h3>{stats?.totalStudents || 0}</h3>
              <p>Active Students</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon success"><HiOutlineUserGroup /></div>
            <div className="stat-info">
              <h3>{stats?.totalStaff || 0}</h3>
              <p>Active Staff</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon warning"><HiOutlineTableCells /></div>
            <div className="stat-info">
              <h3>{stats?.totalSections || 0}</h3>
              <p>Sections</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon info"><HiOutlineAcademicCap /></div>
            <div className="stat-info">
              <h3>{stats?.totalUsers || 0}</h3>
              <p>User Accounts</p>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card animate-in">
            <div className="card-header">
              <div>
                <div className="card-title">Today's Attendance</div>
                <div className="card-subtitle">Overview for {new Date().toLocaleDateString()}</div>
              </div>
              <HiOutlineClipboardDocumentCheck className="text-muted" size={20} />
            </div>
            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary-400)' }}>
                  {stats?.attendanceToday?.present || 0}
                </div>
                <div className="text-xs text-muted">Present</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--error)' }}>
                  {stats?.attendanceToday?.absent || 0}
                </div>
                <div className="text-xs text-muted">Absent</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-400)' }}>
                  {stats?.attendanceToday?.late || 0}
                </div>
                <div className="text-xs text-muted">Late</div>
              </div>
            </div>
          </div>

          <div className="card animate-in">
            <div className="card-header">
              <div>
                <div className="card-title">Role Distribution</div>
                <div className="card-subtitle">Active user accounts</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats?.roleDistribution?.map((r) => (
                <div key={r.role} className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                  <span className="text-sm font-medium" style={{ textTransform: 'capitalize' }}>
                    {r.role === 'fee_department' ? 'Fee Department' : r.role}
                  </span>
                  <span className="badge badge-primary">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card animate-in" style={{ marginTop: 20 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Recent Activity</div>
              <div className="card-subtitle">Latest system events</div>
            </div>
            <HiOutlineClock className="text-muted" size={20} />
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentActivity?.length === 0 && (
                  <tr><td colSpan="4" className="text-center text-muted" style={{ padding: 40 }}>No recent activity</td></tr>
                )}
                {stats?.recentActivity?.map((event) => (
                  <tr key={event.id}>
                    <td className="font-medium">{event.actor_name || 'System'}</td>
                    <td>
                      <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                        {event.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{event.target_type}</td>
                    <td className="text-muted text-sm">{new Date(event.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
