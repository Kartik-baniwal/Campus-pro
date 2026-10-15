import { useState } from 'react';
import {
  HiOutlineCalculator,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineTag
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function FeePlans() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Standard High School Tuition 2026-27',
      gradeLevel: 'Grade 10 & 11',
      totalAnnualFee: 5000,
      installments: 4,
      perInstallment: 1250,
      status: 'Approved',
      approvedBy: 'School Principal'
    },
    {
      id: 2,
      name: 'Senior Secondary STEM Program Plan',
      gradeLevel: 'Grade 12',
      totalAnnualFee: 5600,
      installments: 4,
      perInstallment: 1400,
      status: 'Approved',
      approvedBy: 'School Principal'
    },
    {
      id: 3,
      name: 'Middle School Standard Fee Schedule',
      gradeLevel: 'Grade 9',
      totalAnnualFee: 4600,
      installments: 4,
      perInstallment: 1150,
      status: 'Draft',
      approvedBy: 'Pending Admin Review'
    }
  ]);

  // Form state
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 10');
  const [totalAnnualFee, setTotalAnnualFee] = useState('5000');
  const [installments, setInstallments] = useState('4');

  const handleCreate = (e) => {
    e.preventDefault();
    const annual = parseFloat(totalAnnualFee);
    const inst = parseInt(installments, 10);
    const newPlan = {
      id: Date.now(),
      name,
      gradeLevel,
      totalAnnualFee: annual,
      installments: inst,
      perInstallment: Math.round(annual / inst),
      status: 'Draft',
      approvedBy: 'Pending Review'
    };
    setPlans([newPlan, ...plans]);
    setShowCreateModal(false);
    toast.success('Fee Plan created in Draft status!');
    setName('');
  };

  const approvePlan = (planId) => {
    setPlans(prev =>
      prev.map(p =>
        p.id === planId
          ? { ...p, status: 'Approved', approvedBy: 'Finance Director' }
          : p
      )
    );
    toast.success('Fee Plan approved for student billing!');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Grade-Level Fee Plans</h1>
          <p className="page-subtitle">Configure structured tuition plans, installments, and approval controls</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <HiOutlinePlus /> Create Fee Plan
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Target Grade Level</th>
                <th>Total Annual</th>
                <th>Installments</th>
                <th>Per Term Fee</th>
                <th>Status</th>
                <th>Sign-off</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{p.name}</div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{p.gradeLevel}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#38bdf8' }}>${p.totalAnnualFee}</td>
                  <td>{p.installments} terms</td>
                  <td style={{ fontWeight: 600, color: '#34d399' }}>${p.perInstallment}</td>
                  <td>
                    <span className={`badge ${p.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="text-sm text-muted">{p.approvedBy}</td>
                  <td style={{ textAlign: 'right' }}>
                    {p.status === 'Draft' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => approvePlan(p.id)}
                      >
                        <HiOutlineCheckCircle /> Approve
                      </button>
                    ) : (
                      <span className="text-xs text-muted">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Define New Fee Plan</h2>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Plan Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Grade 10 Standard Schedule 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Applicable Grade Level</label>
                  <input
                    type="text"
                    className="form-input"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Total Annual Amount ($)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={totalAnnualFee}
                      onChange={(e) => setTotalAnnualFee(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Number of Installments</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
