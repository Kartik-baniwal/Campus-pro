import { useState } from 'react';
import {
  HiOutlineReceiptPercent,
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineCalendarDays,
  HiOutlinePaperAirplane,
  HiOutlineArrowDownTray,
  HiOutlineXMark
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function FeeInvoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // New Invoice Generator Form
  const [genGrade, setGenGrade] = useState('Grade 10');
  const [genTitle, setGenTitle] = useState('Term 2 Tuition & Activity Fee');
  const [genAmount, setGenAmount] = useState('1250');
  const [genDueDate, setGenDueDate] = useState('2026-11-30');

  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-001', student: 'Liam Vance', roll: 'STU-1001', grade: 'Grade 10 - A', title: 'Term 1 Tuition & Lab', dueDate: '2026-09-15', total: 1250, paid: 1250, balance: 0, status: 'Paid' },
    { id: 'INV-2026-002', student: 'Sophia Martinez', roll: 'STU-1002', grade: 'Grade 10 - A', title: 'Term 1 Tuition & Lab', dueDate: '2026-09-15', total: 1250, paid: 1250, balance: 0, status: 'Paid' },
    { id: 'INV-2026-003', student: 'Ethan Taylor', roll: 'STU-1003', grade: 'Grade 11 - B', title: 'Term 1 Tuition', dueDate: '2026-09-15', total: 1250, paid: 625, balance: 625, status: 'Partially Paid' },
    { id: 'INV-2026-004', student: 'James Rodriguez', roll: 'STU-1044', grade: 'Grade 11 - A', title: 'Term 1 Tuition & Transport', dueDate: '2026-09-15', total: 1400, paid: 0, balance: 1400, status: 'Overdue' },
    { id: 'INV-2026-005', student: 'Emma Watson', roll: 'STU-1006', grade: 'Grade 9 - A', title: 'Term 1 Tuition & Technology', dueDate: '2026-09-15', total: 1400, paid: 1400, balance: 0, status: 'Paid' },
    { id: 'INV-2026-006', student: 'Mia Tanaka', roll: 'STU-1052', grade: 'Grade 10 - B', title: 'Term 1 Tuition', dueDate: '2026-09-15', total: 1250, paid: 0, balance: 1250, status: 'Overdue' },
  ]);

  const handleGenerate = (e) => {
    e.preventDefault();
    const newInv = {
      id: `INV-2026-00${invoices.length + 1}`,
      student: 'Bulk Batch (' + genGrade + ')',
      roll: 'ROSTER',
      grade: genGrade,
      title: genTitle,
      dueDate: genDueDate,
      total: parseFloat(genAmount),
      paid: 0,
      balance: parseFloat(genAmount),
      status: 'Unpaid'
    };
    setInvoices([newInv, ...invoices]);
    setShowGenerateModal(false);
    toast.success(`Batch invoices generated for ${genGrade}!`);
  };

  const filtered = invoices.filter(inv => {
    const matchSearch =
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.roll.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Invoices & Billing Ledger</h1>
          <p className="page-subtitle">Generate bulk invoices, manage receivables, and dispatch reminders</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowGenerateModal(true)}>
          <HiOutlinePlus /> Generate Batch Invoices
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <HiOutlineMagnifyingGlass style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by invoice #, student name, or roll ID..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Paid', 'Partially Paid', 'Overdue'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Total Billed</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td>
                    <span className="badge badge-secondary">{inv.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inv.student}</div>
                    <div className="text-xs text-muted">{inv.roll} • {inv.grade}</div>
                  </td>
                  <td>{inv.title}</td>
                  <td>{inv.dueDate}</td>
                  <td>${inv.total}</td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>${inv.paid}</td>
                  <td style={{ color: inv.balance > 0 ? '#f87171' : '#94a3b8', fontWeight: 700 }}>
                    ${inv.balance}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        inv.status === 'Paid'
                          ? 'badge-success'
                          : inv.status === 'Partially Paid'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {inv.balance > 0 && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => toast.success(`Reminder sent to guardian of ${inv.student}`)}
                          title="Dispatch Reminder"
                        >
                          <HiOutlinePaperAirplane /> Remind
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toast.success(`Printing PDF for ${inv.id}`)}
                        title="Download Invoice"
                      >
                        <HiOutlineArrowDownTray />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoices Modal */}
      {showGenerateModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Generate Invoices by Grade Level</h2>
              <button className="modal-close-btn" onClick={() => setShowGenerateModal(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleGenerate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Target Grade Level</label>
                  <select
                    className="form-input"
                    value={genGrade}
                    onChange={(e) => setGenGrade(e.target.value)}
                  >
                    <option value="Grade 10">Grade 10 (All Sections)</option>
                    <option value="Grade 11">Grade 11 (All Sections)</option>
                    <option value="Grade 9">Grade 9 (All Sections)</option>
                    <option value="Grade 12">Grade 12 (All Sections)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Invoice Description / Fee Plan</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={genTitle}
                    onChange={(e) => setGenTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Amount per Student ($)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={genAmount}
                      onChange={(e) => setGenAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Payment Due Date</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={genDueDate}
                      onChange={(e) => setGenDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowGenerateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate Invoices
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
