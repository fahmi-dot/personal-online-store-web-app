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

const btn = (color, textColor = '#fff') => ({
  padding: '8px 16px', border: 'none', cursor: 'pointer',
  fontWeight: 600, fontSize: 13, background: color, color: textColor,
  display: 'inline-flex', alignItems: 'center', gap: 6,
});

const inputStyle = {
  width: '100%', padding: '10px 14px',
  border: '1px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box',
  outline: 'none',
};

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
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20,
    }}>
      <div style={{ background: '#fff', padding: 32, width: 540, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{isEdit ? 'Edit Product' : 'Add New Product'}</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>Provide full details for your catalog item.</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
        </div>

        {/* Image upload preview */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
            Product Image {!isEdit && <span style={{ color: '#dc2626' }}>*</span>}
          </label>
          <div
            onClick={() => fileRef.current.click()}
            style={{
              border: '2px dashed #cbd5e1', padding: '24px',
              textAlign: 'center', cursor: 'pointer', background: '#f8fafc',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {preview ? (
              <div>
                <img src={preview} alt="preview" style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain' }} />
                <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, marginTop: 8 }}>Click to change photo</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 36, marginBottom: 4 }}>📷</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Click or drag image to upload</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Supports JPG, PNG up to 5MB</div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleFile} />
          {isEdit && <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Keep blank if you don't want to change the image.</p>}
        </div>

        {/* Product Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Product Name <span style={{ color: '#dc2626' }}>*</span></label>
          <input value={form.name} onChange={set('name')} placeholder="e.g. Classic Cotton T-Shirt" style={inputStyle} />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Provide details about material, size guide, or benefits..."
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        {/* Price & Stock */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Price (IDR) <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="number" min="0" value={form.price} onChange={set('price')} placeholder="150000" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Inventory Stock <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="number" min="0" value={form.stock} onChange={set('stock')} placeholder="25" style={inputStyle} />
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Product Category</label>
          <select value={form.categoryId} onChange={set('categoryId')} style={inputStyle}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
          <button onClick={onClose} disabled={loading} style={btn('#f1f5f9', '#475569')}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ ...btn('#2563eb'), opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Product')}
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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Products</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Manage, add, and monitor stock for your store catalog.</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} style={{ ...btn('#2563eb'), padding: '10px 20px' }}>
          <span>+</span> New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#fff', padding: '16px 20px', border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)', marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 260 }}>
          <input
            type="text"
            placeholder="Search product by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, padding: '8px 14px' }}
          />
          <button type="submit" style={btn('#0f172a')}>Search</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
            style={{ ...inputStyle, width: 'auto', padding: '8px 14px' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              {['Item', 'Name & Info', 'Category', 'Price', 'Inventory', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRowSkeleton key={idx} cols={6} />
              ))
            ) : products.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>No products matching current filter.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 20px', width: 64 }}>
                    {p.photoUrl
                      ? <img src={p.photoUrl} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                      : <div style={{ width: 48, height: 48, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
                    }
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.description || 'No description provided'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
                      {p.categoryName || 'General'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{fmt(p.price)}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{
                      background: p.stock > 10 ? '#10b98115' : p.stock > 0 ? '#f59e0b15' : '#ef444415',
                      color: p.stock > 10 ? '#059669' : p.stock > 0 ? '#d97706' : '#dc2626',
                      padding: '4px 10px', fontSize: 12, fontWeight: 700,
                    }}>
                      {p.stock > 0 ? `${p.stock} units` : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setModal({ mode: 'edit', data: p })} style={btn('#2563eb')}>Edit</button>
                      <button onClick={() => setDeleteTargetId(p.id)} style={btn('#dc2626')}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={{ ...btn('#fff', '#475569'), border: '1px solid #cbd5e1' }}>&larr; Prev</button>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{ ...btn('#fff', '#475569'), border: '1px solid #cbd5e1' }}>Next &rarr;</button>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Product"
        message="Are you sure you want to delete this product? It will be immediately removed from the customer catalog."
        isDanger={true}
        confirmText="Delete Product"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AdminLayout>
  );
}
