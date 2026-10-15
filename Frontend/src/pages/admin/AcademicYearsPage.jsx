import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { HiOutlinePlus } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function AcademicYearsPage() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ schoolId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: '', startDate: '', endDate: '', status: 'planning' });

  useEffect(() => { loadYears(); }, []);
  const loadYears = async () => {
    try { const res = await adminAPI.getAcademicYears(); setYears(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createAcademicYear(form);
      toast.success('Academic year created');
      setShowModal(false); loadYears();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <>
      <div className="content-header">
        <div><h2>Academic Years</h2><p className="text-sm text-muted">Manage school academic years and terms</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiOutlinePlus /> Add Year</button>
      </div>
      <div className="content-body">
        {loading ? <div className="loader"><div className="spinner" /></div> : (
          <div className="stats-grid">
            {years.map((y) => (
              <div key={y.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="card-title">{y.name}</h3>
                  <span className={`badge ${y.status === 'active' ? 'badge-success' : y.status === 'closed' ? 'badge-danger' : 'badge-warning'}`}>{y.status}</span>
                </div>
                <div className="text-sm text-muted mb-2">
                  {new Date(y.start_date).toLocaleDateString()} — {new Date(y.end_date).toLocaleDateString()}
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="text-center" style={{flex:1}}>
                    <div className="font-bold">{y.section_count || 0}</div>
                    <div className="text-xs text-muted">Sections</div>
                  </div>
                  <div className="text-center" style={{flex:1}}>
                    <div className="font-bold">{y.enrolment_count || 0}</div>
                    <div className="text-xs text-muted">Enrolments</div>
                  </div>
                </div>
                {y.is_current && <div className="badge badge-primary mt-2" style={{marginTop:12}}>Current Year</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header"><h3>Create Academic Year</h3><button className="modal-close" onClick={()=>setShowModal(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Name *</label>
                  <input className="form-input" required placeholder="e.g., 2026-2027" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Start Date *</label>
                    <input type="date" className="form-input" required value={form.startDate} onChange={(e)=>setForm({...form,startDate:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">End Date *</label>
                    <input type="date" className="form-input" required value={form.endDate} onChange={(e)=>setForm({...form,endDate:e.target.value})} /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
