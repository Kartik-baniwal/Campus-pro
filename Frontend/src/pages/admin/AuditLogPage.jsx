import { useState } from 'react';
import {
  HiOutlineDocumentChartBar,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiOutlineClock
} from 'react-icons/hi2';

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('All');

  const [auditLogs] = useState([
    {
      id: 'LOG-8819',
      actor: 'Jane Doe',
      role: 'fee_department',
      action: 'FEE_PAYMENT_RECORDED',
      module: 'Finance',
      details: 'Recorded counter payment $1,250 for student STU-1001 (Liam Vance) Receipt: REC-89211',
      ip: '192.168.1.45',
      timestamp: '2026-10-14 14:15:32'
    },
    {
      id: 'LOG-8818',
      actor: 'Dr. Arthur Pendelton',
      role: 'teacher',
      action: 'GRADE_MODIFIED',
      module: 'Academics',
      details: 'Updated Mid-Term Math score for STU-1004 from 78 to 82. Reason: "Re-evaluation of Q4 calculation step"',
      ip: '192.168.1.82',
      timestamp: '2026-10-14 11:22:10'
    },
    {
      id: 'LOG-8817',
      actor: 'Dr. Sarah Jenkins',
      role: 'admin',
      action: 'USER_ROLE_UPDATED',
      module: 'Security',
      details: 'Assigned role "teacher" to staff David Vance (vance.teacher@school.edu)',
      ip: '192.168.1.10',
      timestamp: '2026-10-14 09:40:18'
    },
    {
      id: 'LOG-8816',
      actor: 'Dr. Arthur Pendelton',
      role: 'teacher',
      action: 'ATTENDANCE_SESSION_SAVED',
      module: 'Attendance',
      details: 'Submitted morning attendance roll for Grade 10-A (27 Present, 1 Absent)',
      ip: '192.168.1.82',
      timestamp: '2026-10-14 08:45:00'
    },
    {
      id: 'LOG-8815',
      actor: 'Jane Doe',
      role: 'fee_department',
      action: 'FEE_PLAN_CREATED',
      module: 'Finance',
      details: 'Created fee schedule "Standard High School Tuition 2026-27" amount $5,000 in 4 installments',
      ip: '192.168.1.45',
      timestamp: '2026-10-13 16:30:22'
    },
    {
      id: 'LOG-8814',
      actor: 'Dr. Sarah Jenkins',
      role: 'admin',
      action: 'ACADEMIC_YEAR_ACTIVATED',
      module: 'Core System',
      details: 'Set 2026–2027 as the active institutional academic year',
      ip: '192.168.1.10',
      timestamp: '2026-10-13 09:00:11'
    }
  ]);

  const filtered = auditLogs.filter(log => {
    const matchSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMod = filterModule === 'All' || log.module === filterModule;
    return matchSearch && matchMod;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Audit Ledger</h1>
          <p className="page-subtitle">Immutable chronological record of administrative, academic, and financial actions</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <HiOutlineMagnifyingGlass style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search audit trail by actor, action keyword, or details..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Finance', 'Academics', 'Security', 'Attendance'].map(mod => (
              <button
                key={mod}
                type="button"
                onClick={() => setFilterModule(mod)}
                className={`btn btn-sm ${filterModule === mod ? 'btn-primary' : 'btn-secondary'}`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>Actor & Role</th>
                <th>Action & Module</th>
                <th>Operation Details</th>
                <th>Client IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td>
                    <span className="badge badge-secondary">{l.id}</span>
                  </td>
                  <td className="text-xs text-muted" style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <HiOutlineClock /> {l.timestamp}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{l.actor}</div>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{l.role}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#38bdf8' }}>{l.action}</div>
                    <span className="text-xs text-muted">{l.module}</span>
                  </td>
                  <td className="text-sm" style={{ color: '#cbd5e1', maxWidth: '380px' }}>
                    {l.details}
                  </td>
                  <td className="text-xs text-muted font-mono">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
