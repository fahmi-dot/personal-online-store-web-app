import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  adminGetAllCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory
} from '../../services/api';

const btn = (color) => ({
  padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
  fontWeight: 600, fontSize: 13, background: color, color: '#fff',
});

function Modal({ title, initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const [desc, setDesc] = useState(initial?.description || '');
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>{title}</h3>
        <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 4 }}>Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 14, boxSizing: 'border-box' }} />
        <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 4 }}>Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Optional description"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, marginBottom: 20, resize: 'vertical', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ ...btn('#94a3b8') }}>Cancel</button>
          <button onClick={() => onSave({ name, description: desc })} style={{ ...btn('#6366f1') }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data?: {} }
  const [toast, setToast] = useState('');

  const load = () => adminGetAllCategories().then((r) => setCategories(r.data?.data || []));
  useEffect(() => { load(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = async (payload) => {
    try {
      if (modal.mode === 'create') await adminCreateCategory(payload);
      else await adminUpdateCategory(modal.data.id, payload);
      showToast('Saved successfully!');
      setModal(null);
      load();
    } catch { showToast('Error saving category.'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await adminDeleteCategory(id); showToast('Deleted.'); load(); }
    catch { showToast('Error deleting.'); }
  };

  return (
    <AdminLayout>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#1e293b', color: '#fff', padding: '12px 20px', borderRadius: 10, zIndex: 200, fontSize: 14 }}>{toast}</div>
      )}
      {modal && <Modal title={modal.mode === 'create' ? 'New Category' : 'Edit Category'} initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>Categories</h2>
        <button onClick={() => setModal({ mode: 'create' })} style={{ ...btn('#6366f1'), padding: '10px 20px' }}>+ New Category</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Name', 'Description', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#475569' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{cat.name}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{cat.description || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setModal({ mode: 'edit', data: cat })} style={{ ...btn('#f59e0b') }}>Edit</button>
                    <button onClick={() => handleDelete(cat.id)} style={{ ...btn('#ef4444') }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={3} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
