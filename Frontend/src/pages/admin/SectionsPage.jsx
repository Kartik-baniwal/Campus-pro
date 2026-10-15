import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { HiOutlinePlus } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function SectionsPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [form, setForm] = useState({ academicYearId: '', gradeLevelId: '', name: '', capacity: 40, room: '' });

  useEffect(() => { loadAll(); }, []);
  const loadAll = async () => {
    try {
      const [secRes, glRes, ayRes] = await Promise.all([
        adminAPI.getSections({}), adminAPI.getGradeLevels(), adminAPI.getAcademicYears()
      ]);
      setSections(secRes.data); setGradeLevels(glRes.data); setAcademicYears(ayRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await adminAPI.createSection(form); toast.success('Section created'); setShowModal(false); loadAll(); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <>
      <div className="content-header">
        <div><h2>Sections</h2><p className="text-sm text-muted">Manage class sections</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiOutlinePlus /> Add Section</button>
      </div>
      <div className="content-body">
        {loading ? <div className="loader"><div className="spinner" /></div> : (
          <div className="card" style={{padding:0}}>
            <div className="table-container" style={{border:'none'}}>
              <table className="table">
                <thead><tr><th>Grade</th><th>Section</th><th>Year</th><th>Room</th><th>Capacity</th><th>Students</th></tr></thead>
                <tbody>
                  {sections.length === 0 && <tr><td colSpan="6" className="text-center text-muted" style={{padding:60}}>No sections</td></tr>}
                  {sections.map((s) => (
                    <tr key={s.id}>
                      <td className="font-medium">{s.grade_name}</td>
                      <td>{s.name}</td>
                      <td>{s.academic_year_name}</td>
                      <td>{s.room || '—'}</td>
                      <td>{s.capacity}</td>
                      <td><span className="badge badge-primary">{s.student_count}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header"><h3>Create Section</h3><button className="modal-close" onClick={()=>setShowModal(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Academic Year *</label>
                  <select className="form-select" required value={form.academicYearId} onChange={(e)=>setForm({...form,academicYearId:e.target.value})}>
                    <option value="">Select</option>
                    {academicYears.map(ay=><option key={ay.id} value={ay.id}>{ay.name}</option>)}
                  </select></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Grade Level *</label>
                    <select className="form-select" required value={form.gradeLevelId} onChange={(e)=>setForm({...form,gradeLevelId:e.target.value})}>
                      <option value="">Select</option>
                      {gradeLevels.map(gl=><option key={gl.id} value={gl.id}>{gl.name}</option>)}
                    </select></div>
                  <div className="form-group"><label className="form-label">Section Name *</label>
                    <input className="form-input" required placeholder="e.g., A" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Room</label>
                    <input className="form-input" value={form.room} onChange={(e)=>setForm({...form,room:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Capacity</label>
                    <input type="number" className="form-input" value={form.capacity} onChange={(e)=>setForm({...form,capacity:parseInt(e.target.value)})} /></div>
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
