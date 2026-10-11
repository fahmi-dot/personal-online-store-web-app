import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import AdminLayout from '../../components/AdminLayout';
import ConfirmModal from '../../components/ConfirmModal';
import { TableRowSkeleton } from '../../components/Skeletons';
import { showSuccessToast, showErrorToast } from '../../redux/slices/toastSlice';
import {
  adminGetAllCategories, adminGetAllProducts,
  adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
} from '../../services/api';

function ProductModal({ initial, categories, onSave, onClose }) {
  const dispatch = useDispatch();
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price || '',
    stock: initial?.stock ?? '',
    categoryId: initial?.categoryId || (categories[0]?.id || ''),
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.photoUrl || null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price || form.stock === '') {
      dispatch(showErrorToast('Name, price, and stock are required.'));
      return;
    }
    if (!isEdit && !file) {
      dispatch(showErrorToast('Please upload a product photo.'));
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        const payload = {
          name: form.name.trim(),
          description: form.description.trim(),
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          categoryId: form.categoryId,
        };
        await adminUpdateProduct(initial.id, payload);
        dispatch(showSuccessToast('Product updated successfully!'));
      } else {
        const fd = new FormData();
        fd.append('name', form.name.trim());
        fd.append('description', form.description.trim());
        fd.append('price', parseFloat(form.price));
        fd.append('stock', parseInt(form.stock));
        fd.append('categoryId', form.categoryId);
        fd.append('file', file);
        await adminCreateProduct(fd);
        dispatch(showSuccessToast('Product created successfully!'));
      }
      onSave();
    } catch (e) {
      dispatch(showErrorToast(e.response?.data?.message || 'Error saving product.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-black p-6 md:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto retro-shadow-lg">
        <div className="flex justify-between items-center pb-4 mb-6 border-b-2 border-black">
          <div>
            <div className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              RECORD_ENTRY // {isEdit ? 'UPDATE' : 'CREATE'}
            </div>
            <h3 className="font-extrabold text-2xl uppercase tracking-tight text-black m-0">
              {isEdit ? 'EDIT PRODUCT' : 'NEW PRODUCT ENTRY'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-black bg-white hover:bg-black hover:text-white font-mono font-bold text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Image Upload Area */}
        <div className="mb-6">
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black mb-2">
            PRODUCT VISUAL {!isEdit && <span className="text-retro-coral">*</span>}
          </label>
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-black bg-retro-cream p-6 text-center cursor-pointer hover:bg-retro-amber/20 transition-colors"
          >
            {preview ? (
              <div>
                <img src={preview} alt="preview" className="max-h-40 mx-auto object-contain border-2 border-black" />
                <div className="font-mono text-[11px] font-bold text-retro-blue uppercase tracking-wider mt-3">
                  Click to replace image
                </div>
              </div>
            ) : (
              <div>
                <div className="text-3xl mb-2">📷</div>
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                  UPLOAD SPECIMEN IMAGE
                </div>
                <div className="font-mono text-[10px] text-gray-500 uppercase mt-1">
                  JPG, PNG, WEBP (MAX 5MB)
                </div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFile} />
        </div>

        {/* Form Fields */}
        <div className="space-y-4 font-mono text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-black mb-1">
              TITLE / NAME <span className="text-retro-coral">*</span>
            </label>
            <input
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. VINTAGE OVERSIZED HOODIE"
              className="w-full border-2 border-black p-3 bg-white text-black outline-none focus:bg-retro-cream"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-black mb-1">
              SPECIFICATION / DETAILS
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={3}
              placeholder="Material, dimensions, provenance..."
              className="w-full border-2 border-black p-3 bg-white text-black outline-none focus:bg-retro-cream resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-black mb-1">
                PRICE (IDR) <span className="text-retro-coral">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={set('price')}
                placeholder="250000"
                className="w-full border-2 border-black p-3 bg-white text-black outline-none focus:bg-retro-cream"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-black mb-1">
                INVENTORY STOCK <span className="text-retro-coral">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={set('stock')}
                placeholder="50"
                className="w-full border-2 border-black p-3 bg-white text-black outline-none focus:bg-retro-cream"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-black mb-1">
              CATEGORY CLASSIFICATION
            </label>
            <select
              value={form.categoryId}
              onChange={set('categoryId')}
              className="w-full border-2 border-black p-3 bg-white text-black outline-none focus:bg-retro-cream"
            >
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t-2 border-black">
          <button
            onClick={onClose}
            disabled={loading}
            className="retro-btn bg-white text-black font-mono font-bold text-xs uppercase tracking-widest px-5 py-2.5"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="retro-btn bg-black text-white font-mono font-bold text-xs uppercase tracking-widest px-5 py-2.5 disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : (isEdit ? 'SAVE MODIFICATIONS' : 'REGISTER ITEM')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const load = async (p = 0) => {
    try {
      setLoading(true);
      const params = { page: p, size: 12 };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const r = await adminGetAllProducts(params);
      setProducts(r.data?.data || []);
      setTotalPages(r.data?.pagination?.totalPages || 1);
    } catch {
      dispatch(showErrorToast('Failed to load products list.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
    adminGetAllCategories().then((r) => setCategories(r.data?.data || []));
  }, [page, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    load(0);
  };

  const handleSave = () => {
    setModal(null);
    load(page);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminDeleteProduct(deleteTargetId);
      dispatch(showSuccessToast('Product deleted from store.'));
      setDeleteTargetId(null);
      load(page);
    } catch (err) {
      dispatch(showErrorToast(err.response?.data?.message || 'Failed to delete product.'));
    }
  };

  const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <AdminLayout>
      {modal && (
        <ProductModal
          initial={modal.mode === 'edit' ? modal.data : null}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Page Title */}
      <div className="border-2 border-black bg-white p-6 retro-shadow mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-retro-amber font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest mb-2">
            CATALOG // INVENTORY_CONTROL
          </div>
          <h2 className="font-extrabold text-3xl uppercase tracking-tight text-black m-0">
            PRODUCT ARCHIVE
          </h2>
          <p className="font-mono text-xs text-gray-600 uppercase tracking-wide mt-1">
            Manage merchandise, edit pricing, and control stock availability
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="retro-btn bg-black text-white font-mono font-bold text-xs uppercase tracking-widest px-5 py-3 cursor-pointer"
        >
          + NEW INVENTORY ITEM
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="border-2 border-black bg-white p-4 retro-shadow mb-6 flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="SEARCH BY PRODUCT TITLE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-2 border-black p-2.5 font-mono text-xs uppercase bg-retro-cream outline-none focus:bg-white"
          />
          <button type="submit" className="retro-btn bg-black text-white font-mono font-bold text-xs uppercase tracking-widest px-4 py-2.5">
            FIND
          </button>
        </form>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">CATEGORY:</span>
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
            className="border-2 border-black p-2.5 font-mono text-xs uppercase bg-white outline-none cursor-pointer"
          >
            <option value="">ALL CLASSIFICATIONS</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border-2 border-black bg-white retro-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-retro-cream text-left">
                {['SPECIMEN', 'PRODUCT SPECIFICATION', 'CATEGORY', 'UNIT PRICE', 'STOCK_QTY', 'COMMANDS'].map((h) => (
                  <th key={h} className="p-3.5 font-bold uppercase tracking-wider text-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRowSkeleton key={idx} cols={6} />
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 uppercase tracking-widest">
                    NO MATCHING PRODUCT RECORDS IN SYSTEM
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3.5 w-16">
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt={p.name} className="w-12 h-12 object-cover border-2 border-black" />
                      ) : (
                        <div className="w-12 h-12 border-2 border-black bg-retro-cream flex items-center justify-center text-xl">
                          📦
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-black uppercase">{p.name}</div>
                      <div className="text-[10px] text-gray-500 truncate max-w-xs mt-0.5">
                        {p.description || '// NO SPECIFICATION'}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="border border-black bg-white px-2 py-0.5 text-[10px] font-bold uppercase">
                        {p.categoryName || 'GENERAL'}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-black">{fmt(p.price)}</td>
                    <td className="p-3.5">
                      <span className={`border border-black px-2 py-0.5 text-[10px] font-bold uppercase ${
                        p.stock > 10 ? 'bg-blue-100 text-retro-blue' : p.stock > 0 ? 'bg-retro-amber text-black' : 'bg-retro-coral text-white'
                      }`}>
                        {p.stock > 0 ? `${p.stock} UNITS` : 'DEPLETED'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setModal({ mode: 'edit', data: p })}
                          className="retro-btn bg-retro-blue text-white font-bold text-[10px] uppercase px-2.5 py-1"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(p.id)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6 font-mono text-xs">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="retro-btn bg-white text-black font-bold uppercase px-3 py-1.5 disabled:opacity-40"
          >
            &larr; PREV
          </button>
          <span className="font-bold text-black uppercase tracking-wider">
            PAGE {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="retro-btn bg-white text-black font-bold uppercase px-3 py-1.5 disabled:opacity-40"
          >
            NEXT &rarr;
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="CONFIRM DELETION"
        message="Are you certain you want to purge this product? It will be permanently removed from public catalog access."
        isDanger={true}
        confirmText="CONFIRM PURGE"
        cancelText="ABORT"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AdminLayout>
  );
}
