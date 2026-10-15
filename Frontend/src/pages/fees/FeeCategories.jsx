import { useState } from 'react';
import {
  HiOutlineBanknotes,
  HiOutlinePlus,
  HiOutlineXMark,
  HiOutlineTag
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function FeeCategories() {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Tuition Fee', code: 'TUI', type: 'Mandatory', isRecurring: 'Termly', defaultAmount: 1000 },
    { id: 2, name: 'Science Laboratory Fee', code: 'LAB', type: 'Course Specific', isRecurring: 'Termly', defaultAmount: 150 },
    { id: 3, name: 'Library & Digital Resources', code: 'LIB', type: 'Mandatory', isRecurring: 'Annually', defaultAmount: 100 },
    { id: 4, name: 'Sports & Athletic Facilities', code: 'SPT', type: 'Mandatory', isRecurring: 'Termly', defaultAmount: 100 },
    { id: 5, name: 'Bus Transportation', code: 'TRN', type: 'Optional Service', isRecurring: 'Monthly', defaultAmount: 120 },
    { id: 6, name: 'Technology & Cloud Lab', code: 'TEC', type: 'Mandatory', isRecurring: 'Annually', defaultAmount: 50 },
  ]);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('Mandatory');
  const [isRecurring, setIsRecurring] = useState('Termly');
  const [defaultAmount, setDefaultAmount] = useState('100');

  const handleCreate = (e) => {
    e.preventDefault();
    const newCat = {
      id: Date.now(),
      name,
      code: code.toUpperCase(),
      type,
      isRecurring,
      defaultAmount: parseFloat(defaultAmount)
    };
    setCategories([...categories, newCat]);
    setShowModal(false);
    toast.success('Fee category created!');
    setName('');
    setCode('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Categories & Heads</h1>
          <p className="page-subtitle">Configure billing categories, service rates, and frequency schedules</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <HiOutlinePlus /> Add Category
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Category Name</th>
                <th>Fee Classification</th>
                <th>Frequency</th>
                <th>Standard Rate</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td>
                    <span className="badge badge-primary">{c.code}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>{c.name}</td>
                  <td>
                    <span className="badge badge-secondary">{c.type}</span>
                  </td>
                  <td className="text-sm text-muted">{c.isRecurring}</td>
                  <td style={{ fontWeight: 700, color: '#34d399' }}>${c.defaultAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Create Fee Category</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                <HiOutlineXMark />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Science Lab Consumables"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Category Code (3-4 chars) *</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      className="form-input"
                      placeholder="e.g. LAB"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Default Amount ($)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={defaultAmount}
                      onChange={(e) => setDefaultAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Classification</label>
                    <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="Mandatory">Mandatory</option>
                      <option value="Course Specific">Course Specific</option>
                      <option value="Optional Service">Optional Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Frequency</label>
                    <select className="form-input" value={isRecurring} onChange={(e) => setIsRecurring(e.target.value)}>
                      <option value="Termly">Termly</option>
                      <option value="Annually">Annually</option>
                      <option value="Monthly">Monthly</option>
                      <option value="One-time">One-time</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
