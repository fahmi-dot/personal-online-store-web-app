import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminLayout from '../../components/AdminLayout';
import ConfirmModal from '../../components/ConfirmModal';
import { TableRowSkeleton } from '../../components/Skeletons';
import { showSuccessToast, showErrorToast } from '../../redux/slices/toastSlice';
import {
  adminGetAllCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory
} from '../../services/api';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-black p-6 md:p-8 w-full max-w-md retro-shadow-lg font-mono text-xs">
        <div className="flex justify-between items-center pb-3 mb-5 border-b-2 border-black">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              TAXONOMY_ENTRY
            </div>
            <h3 className="font-extrabold text-xl uppercase tracking-tight text-black m-0 font-sans">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-black bg-white hover:bg-black hover:text-white font-mono font-bold text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-bold uppercase tracking-wider text-black mb-1">
              CATEGORY IDENTIFIER <span className="text-retro-coral">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. OUTERWEAR"
              className="w-full border-2 border-black p-2.5 bg-white text-black outline-none focus:bg-retro-cream uppercase"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-black mb-1">
              SCOPE / DESCRIPTION
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Classification details..."
              className="w-full border-2 border-black p-2.5 bg-white text-black outline-none focus:bg-retro-cream resize-y"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 mt-6 border-t-2 border-black">
          <button
            onClick={onClose}
            disabled={submitting}
            className="retro-btn bg-white text-black font-bold uppercase px-4 py-2"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !name.trim()}
            className="retro-btn bg-black text-white font-bold uppercase px-4 py-2 disabled:opacity-50"
          >
            {submitting ? 'RECORDING...' : 'COMMIT ENTRY'}
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
      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'NEW CATEGORY' : 'EDIT CATEGORY'}
          initial={modal.data}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="border-2 border-black bg-white p-6 retro-shadow mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-retro-amber font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest mb-2">
            TAXONOMY // SYSTEM_INDEX
          </div>
          <h2 className="font-extrabold text-3xl uppercase tracking-tight text-black m-0">
            PRODUCT CATEGORIES
          </h2>
          <p className="font-mono text-xs text-gray-600 uppercase tracking-wide mt-1">
            Organize catalog structures and taxonomy tags
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="retro-btn bg-black text-white font-mono font-bold text-xs uppercase tracking-widest px-5 py-3 cursor-pointer"
        >
          + NEW CATEGORY
        </button>
      </div>

      {/* Categories Table */}
      <div className="border-2 border-black bg-white retro-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-retro-cream text-left">
                {['CLASSIFICATION NAME', 'SCOPE DESCRIPTION', 'COMMANDS'].map((h) => (
                  <th key={h} className="p-3.5 font-bold uppercase tracking-wider text-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRowSkeleton key={idx} cols={3} />
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-gray-500 uppercase tracking-widest">
                    NO CATEGORY TAXONOMIES CONFIGURED
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3.5 font-bold text-black uppercase tracking-wide">{cat.name}</td>
                    <td className="p-3.5 text-gray-600">{cat.description || '// NO SPECIFICATION'}</td>
                    <td className="p-3.5 w-44">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setModal({ mode: 'edit', data: cat })}
                          className="retro-btn bg-retro-blue text-white font-bold text-[10px] uppercase px-2.5 py-1"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(cat.id)}
                          className="retro-btn bg-retro-coral text-white font-bold text-[10px] uppercase px-2.5 py-1"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="PURGE CATEGORY"
        message="Are you certain you want to purge this category? Assigned products may lose their classification tags."
        isDanger={true}
        confirmText="CONFIRM PURGE"
        cancelText="ABORT"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AdminLayout>
  );
}
