import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  adminGetAllCategories, adminGetAllProducts,
  adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
} from '../../services/api';

const btn = (color) => ({
  padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
  fontWeight: 600, fontSize: 13, background: color, color: '#fff',
});

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid #e2e8f0', fontSize: 14, boxSizing: 'border-box',
};

function ProductModal({ initial, categories, onSave, onClose }) {
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
    if (!form.name || !form.price || form.stock === '') return alert('Name, price, and stock are required.');
    if (!isEdit && !file) return alert('Please select an image for the product.');
    setLoading(true);
    try {
      if (isEdit) {
        const payload = {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          categoryId: form.categoryId,
        };
        await adminUpdateProduct(initial.id, payload);
      } else {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('description', form.description);
        fd.append('price', parseFloat(form.price));
        fd.append('stock', parseInt(form.stock));
        fd.append('categoryId', form.categoryId);
        fd.append('file', file);
        await adminCreateProduct(fd);
      }
      onSave();
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <h3 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Edit Product' : 'New Product'}</h3>

        {/* Image upload */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 6 }}>
            Product Image {!isEdit && '*'}
          </label>
          <div
            onClick={() => fileRef.current.click()}
            style={{
              border: '2px dashed #e2e8f0', borderRadius: 12, padding: '20px',
              textAlign: 'center', cursor: 'pointer', background: '#f8fafc',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {preview ? (
              <img src={preview} alt="preview" style={{ maxHeight: 140, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <div>
                <div style={{ fontSize: 32 }}>📷</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>Click to upload JPG / PNG</div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFile} />
          {isEdit && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Leave empty to keep current image.</p>}
        </div>

        {/* Name */}
        <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 4 }}>Product Name *</label>
        <input value={form.name} onChange={set('name')} placeholder="e.g. Kaos Polos Hitam" style={{ ...inputStyle, marginBottom: 14 }} />

        {/* Description */}
        <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 4 }}>Description</label>
        <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Product description..."
          style={{ ...inputStyle, resize: 'vertical', marginBottom: 14 }} />

        {/* Price & Stock */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 4 }}>Price (IDR) *</label>
            <input type="number" value={form.price} onChange={set('price')} placeholder="e.g. 150000" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 4 }}>Stock *</label>
            <input type="number" value={form.stock} onChange={set('stock')} placeholder="e.g. 50" style={inputStyle} />
          </div>
        </div>

        {/* Category */}
        <label style={{ display: 'block', fontSize: 13, color: '#475569', marginBottom: 4 }}>Category</label>
        <select value={form.categoryId} onChange={set('categoryId')} style={{ ...inputStyle, marginBottom: 24 }}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ ...btn('#94a3b8') }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ ...btn('#6366f1'), opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');

  const load = (p = 0) =>
    adminGetAllProducts({ page: p, size: 12 }).then((r) => {
      setProducts(r.data?.data || []);
      setTotalPages(r.data?.pagination?.totalPages || 1);
    });

  useEffect(() => {
    load(page);
    adminGetAllCategories().then((r) => setCategories(r.data?.data || []));
  }, [page]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = () => { showToast('Product saved!'); setModal(null); load(page); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try { await adminDeleteProduct(id); showToast('Deleted.'); load(page); }
    catch { showToast('Error deleting product.'); }
  };

  const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <AdminLayout>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, background: '#1e293b', color: '#fff', padding: '12px 20px', borderRadius: 10, zIndex: 200, fontSize: 14 }}>{toast}</div>}
      {modal && (
        <ProductModal
          initial={modal.mode === 'edit' ? modal.data : null}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>Products</h2>
        <button onClick={() => setModal({ mode: 'create' })} style={{ ...btn('#6366f1'), padding: '10px 20px' }}>+ New Product</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#475569' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 16px', width: 52 }}>
                  {p.photoUrl
                    ? <img src={p.photoUrl} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} />
                    : <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
                  }
                </td>
                <td style={{ padding: '10px 16px', fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{p.name}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#64748b' }}>{p.categoryName || '—'}</td>
                <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{fmt(p.price)}</td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    background: p.stock > 0 ? '#10b98118' : '#ef444418',
                    color: p.stock > 0 ? '#10b981' : '#ef4444',
                    borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700,
                  }}>{p.stock}</span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setModal({ mode: 'edit', data: p })} style={{ ...btn('#f59e0b') }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ ...btn('#ef4444') }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No products yet. Create your first product!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={{ ...btn('#e2e8f0'), color: '#475569' }}>Prev</button>
          <span style={{ lineHeight: '32px', fontSize: 14 }}>Page {page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{ ...btn('#e2e8f0'), color: '#475569' }}>Next</button>
        </div>
      )}
    </AdminLayout>
  );
}
