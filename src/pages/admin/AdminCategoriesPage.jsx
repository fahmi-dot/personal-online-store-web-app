import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminLayout from '../../components/AdminLayout';
import ConfirmModal from '../../components/ConfirmModal';
import { TableRowSkeleton } from '../../components/Skeletons';
import { showSuccessToast, showErrorToast } from '../../redux/slices/toastSlice';
import {
  adminGetAllCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory
} from '../../services/api';

const btn = (color, textColor = '#fff') => ({
  padding: '8px 16px', border: 'none', cursor: 'pointer',
  fontWeight: 600, fontSize: 13, background: color, color: textColor,
});

function Modal({ title, initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '');
  const [desc, setDesc] = useState(initial?.description || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    await onSave({ name: name.trim(), description: desc.trim() });
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{ background: '#fff', padding: 32, width: 420, boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>{title}</h3>
        <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 4 }}>Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name"
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', fontSize: 14, marginBottom: 14, boxSizing: 'border-box' }} />
        <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 4 }}>Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Optional description"
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', fontSize: 14, marginBottom: 20, resize: 'vertical', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} disabled={submitting} style={btn('#f1f5f9', '#475569')}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting || !name.trim()} style={{ ...btn('#2563eb'), opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const r = await adminGetAllCategories();
      setCategories(r.data?.data || []);
    } catch {
      dispatch(showErrorToast('Failed to load categories.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (payload) => {
    try {
      if (modal.mode === 'create') {
        await adminCreateCategory(payload);
        dispatch(showSuccessToast('Category created successfully!'));
      } else {
        await adminUpdateCategory(modal.data.id, payload);
        dispatch(showSuccessToast('Category updated successfully!'));
      }
      setModal(null);
      load();
    } catch (err) {
      dispatch(showErrorToast(err.response?.data?.message || 'Error saving category.'));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminDeleteCategory(deleteTargetId);
      dispatch(showSuccessToast('Category deleted successfully!'));
      setDeleteTargetId(null);
      load();
    } catch (err) {
      dispatch(showErrorToast(err.response?.data?.message || 'Error deleting category.'));
    }
  };

  return (
    <AdminLayout>
      {modal && <Modal title={modal.mode === 'create' ? 'New Category' : 'Edit Category'} initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Categories</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Organize products into distinct shop categories.</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} style={{ ...btn('#2563eb'), padding: '10px 20px' }}>
          <span>+</span> New Category
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Name', 'Description', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRowSkeleton key={idx} cols={3} />
              ))
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No categories yet.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{cat.name}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{cat.description || '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setModal({ mode: 'edit', data: cat })} style={btn('#2563eb')}>Edit</button>
                      <button onClick={() => setDeleteTargetId(cat.id)} style={btn('#dc2626')}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products assigned to it might be affected."
        isDanger={true}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AdminLayout>
  );
}
