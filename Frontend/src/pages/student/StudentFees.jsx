import { useState } from 'react';
import {
  HiOutlineBanknotes,
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineArrowDownTray,
  HiOutlineXMark
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function StudentFees() {
  const [payModal, setPayModal] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-001',
      title: 'Term 1 Tuition & Laboratory Fee',
      dueDate: '2026-09-15',
      amount: 1250,
      paidAmount: 1250,
      balance: 0,
      status: 'Paid',
      paidOn: '2026-09-10',
      receiptNumber: 'REC-89211'
    },
    {
      id: 'INV-2026-002',
      title: 'Term 2 Tuition & Sports Facility Fee',
      dueDate: '2026-11-30',
      amount: 1250,
      paidAmount: 0,
      balance: 1250,
      status: 'Unpaid',
      paidOn: null,
      receiptNumber: null
    },
    {
      id: 'INV-2026-003',
      title: 'Annual Library & Digital Portal Subscription',
      dueDate: '2026-10-31',
      amount: 150,
      paidAmount: 0,
      balance: 150,
      status: 'Unpaid',
      paidOn: null,
      receiptNumber: null
    }
  ]);

  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.balance, 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setInvoices(prev =>
        prev.map(inv =>
          inv.id === payModal.id
            ? {
                ...inv,
                status: 'Paid',
                paidAmount: inv.amount,
                balance: 0,
                paidOn: new Date().toISOString().split('T')[0],
                receiptNumber: `REC-${Math.floor(10000 + Math.random() * 90000)}`
              }
            : inv
        )
      );
      setProcessing(false);
      setPayModal(null);
      toast.success('Payment successfully processed! Receipt generated.');
    }, 1200);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Statements & Online Payments</h1>
          <p className="page-subtitle">View term billing, payment history, and download official fee receipts</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Current Outstanding</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
              <HiOutlineBanknotes />
            </div>
          </div>
          <div className="stat-value" style={{ color: totalOutstanding > 0 ? '#f87171' : '#34d399' }}>
            ${totalOutstanding.toLocaleString()}
          </div>
          <div className="stat-footer text-muted">Next due date: Nov 30, 2026</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Total Paid to Date</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
              <HiOutlineCheckCircle />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#34d399' }}>${totalPaid.toLocaleString()}</div>
          <div className="stat-footer text-emerald">Verified receipts available</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Scholarship / Aid</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              <HiOutlineDocumentText />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '1.5rem', color: '#818cf8' }}>Merit 15%</div>
          <div className="stat-footer text-muted">Applied directly to tuition invoices</div>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2 className="card-title">Billing Ledger & Invoices</h2>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Fee Description</th>
                <th>Due Date</th>
                <th>Total Billed</th>
                <th>Paid Amount</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <span className="badge badge-secondary">{inv.id}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>{inv.title}</td>
                  <td>{inv.dueDate}</td>
                  <td>${inv.amount}</td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>${inv.paidAmount}</td>
                  <td style={{ color: inv.balance > 0 ? '#f87171' : '#94a3b8', fontWeight: 700 }}>
                    ${inv.balance}
                  </td>
                  <td>
                    <span className={`badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {inv.status === 'Paid' ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toast.success(`Downloaded Receipt ${inv.receiptNumber}`)}
                      >
                        <HiOutlineArrowDownTray /> Receipt
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setPayModal(inv)}
                      >
                        <HiOutlineCreditCard /> Pay Online
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Online Modal */}
      {payModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Settle Invoice: {payModal.id}</h2>
                <div className="text-sm text-muted">{payModal.title}</div>
              </div>
              <button className="modal-close-btn" onClick={() => setPayModal(null)}>
                <HiOutlineXMark />
              </button>
            </div>

            <form onSubmit={handlePay}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#c7d2fe', fontWeight: 500 }}>Total Due Now:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>${payModal.balance}</span>
                </div>

                <div>
                  <label className="form-label">Payment Gateway</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ justifyContent: 'center' }}
                    >
                      Credit / Debit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`btn ${paymentMethod === 'bank' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ justifyContent: 'center' }}
                    >
                      Bank Transfer
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">Cardholder Name</label>
                  <input type="text" className="form-input" defaultValue="David Vance" required />
                </div>

                <div>
                  <label className="form-label">Card Number</label>
                  <input type="text" className="form-input" defaultValue="•••• •••• •••• 4242" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Expires</label>
                    <input type="text" className="form-input" defaultValue="12/28" required />
                  </div>
                  <div>
                    <label className="form-label">CVC</label>
                    <input type="password" className="form-input" defaultValue="•••" required />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPayModal(null)}>
                  Cancel
                </button>
                <button type="submit" disabled={processing} className="btn btn-primary">
                  {processing ? 'Processing Payment...' : `Confirm Pay $${payModal.balance}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
