import { useState } from 'react';
import {
  HiOutlineCreditCard,
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineArrowDownTray,
  HiOutlineXMark
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function FeePayments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Record payment form
  const [studentRoll, setStudentRoll] = useState('STU-1001');
  const [amount, setAmount] = useState('1250');
  const [method, setMethod] = useState('Credit Card');
  const [reference, setReference] = useState('TXN-88391');
  const [notes, setNotes] = useState('Paid at bursar desk');

  const [payments, setPayments] = useState([
    { id: 'PAY-4091', receiptNo: 'REC-89211', student: 'Liam Vance', roll: 'STU-1001', amount: 1250, method: 'Credit Card', date: '2026-10-14 14:15', collectedBy: 'Bursar Jane Doe', reference: 'AUTH_89123' },
    { id: 'PAY-4090', receiptNo: 'REC-89210', student: 'Sophia Martinez', roll: 'STU-1002', amount: 1250, method: 'Direct Debit', date: '2026-10-14 11:30', collectedBy: 'Online Portal', reference: 'STRIPE_99412' },
    { id: 'PAY-4089', receiptNo: 'REC-89209', student: 'Ethan Taylor', roll: 'STU-1003', amount: 625, method: 'Cheque / Draft', date: '2026-10-13 16:40', collectedBy: 'Bursar Jane Doe', reference: 'CHQ-552109' },
    { id: 'PAY-4088', receiptNo: 'REC-89208', student: 'Emma Watson', roll: 'STU-1006', amount: 1400, method: 'Bank Wire', date: '2026-10-13 09:10', collectedBy: 'Finance Dept', reference: 'WIRE-00129' },
    { id: 'PAY-4087', receiptNo: 'REC-89207', student: 'Lucas Scott', roll: 'STU-1005', amount: 1250, method: 'Cash Deposit', date: '2026-10-12 12:20', collectedBy: 'Bursar Jane Doe', reference: 'CASH-REC-01' },
  ]);

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const newPay = {
      id: `PAY-${4092 + payments.length}`,
      receiptNo: `REC-${90000 + payments.length}`,
      student: studentRoll === 'STU-1001' ? 'Liam Vance' : 'Enrolled Student',
      roll: studentRoll,
      amount: parseFloat(amount),
      method,
      date: 'Just now',
      collectedBy: 'Finance Staff',
      reference
    };

    setPayments([newPay, ...payments]);
    setShowRecordModal(false);
    toast.success(`Payment recorded! Generated ${newPay.receiptNo}`);
  };

  const filtered = payments.filter(p =>
    p.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment Collections & Receipts</h1>
          <p className="page-subtitle">Record walk-in payments, generate instant receipts, and audit collections</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowRecordModal(true)}>
          <HiOutlinePlus /> Record Payment
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <HiOutlineMagnifyingGlass style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by student name, roll number, receipt # or bank reference..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      {/* Payment Ledger Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Student</th>
                <th>Payment Method</th>
                <th>Reference #</th>
                <th>Timestamp</th>
                <th>Collected By</th>
                <th>Amount Paid</th>
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <span className="badge badge-success">{p.receiptNo}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.student}</div>
                    <div className="text-xs text-muted">{p.roll}</div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{p.method}</span>
                  </td>
                  <td className="text-sm text-muted">{p.reference}</td>
                  <td className="text-sm text-muted">{p.date}</td>
                  <td className="text-sm text-muted">{p.collectedBy}</td>
                  <td style={{ fontWeight: 700, color: '#34d399', fontSize: '1rem' }}>
                    ${p.amount}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => toast.success(`Receipt ${p.receiptNo} sent to printer`)}
                    >
                      <HiOutlineArrowDownTray /> Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Record Fee Collection</h2>
              <button className="modal-close-btn" onClick={() => setShowRecordModal(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleRecordPayment}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Student Roll Number *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={studentRoll}
                      onChange={(e) => setStudentRoll(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Amount Received ($) *</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Payment Channel</label>
                    <select
                      className="form-input"
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                    >
                      <option value="Cash Deposit">Cash Deposit</option>
                      <option value="Credit Card">Credit Card / POS</option>
                      <option value="Cheque / Draft">Cheque / Demand Draft</option>
                      <option value="Bank Wire">Bank Wire Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Transaction / Cheque #</label>
                    <input
                      type="text"
                      className="form-input"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Cashier Remarks</label>
                  <input
                    type="text"
                    className="form-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRecordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
