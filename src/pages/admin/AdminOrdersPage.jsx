import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminGetAllOrders, adminUpdateOrderStatus } from '../../services/api';

const STATUS_COLORS = {
  PENDING: '#f59e0b', PROCESSING: '#3b82f6',
  SHIPPED: '#8b5cf6', DELIVERED: '#10b981', CANCELLED: '#ef4444',
};
const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const btn = (color) => ({ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, background: color, color: '#fff' });

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState('');
  const [updating, setUpdating] = useState(null);

  const load = (p = 0) =>
    adminGetAllOrders({ page: p, size: 15, sortBy: 'createdAt', sortDirection: 'desc' }).then((r) => {
      setOrders(r.data?.data || []);
      setTotalPages(r.data?.pagination?.totalPages || 1);
    });

  useEffect(() => { load(page); }, [page]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await adminUpdateOrderStatus(id, status);
      showToast('Status updated!');
      load(page);
    } catch { showToast('Failed to update status.'); }
    finally { setUpdating(null); }
  };

  const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <AdminLayout>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, background: '#1e293b', color: '#fff', padding: '12px 20px', borderRadius: 10, zIndex: 200, fontSize: 14 }}>{toast}</div>}
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>All Orders</h2>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Order ID', 'User', 'Total', 'Date', 'Status', 'Update Status'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#475569' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{o.id?.slice(0, 8)}…</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#1e293b' }}>{o.username || o.userId || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{fmt(o.total)}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{fmtDate(o.createdAt)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: STATUS_COLORS[o.status] + '20', color: STATUS_COLORS[o.status], borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{o.status}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={o.status}
                    disabled={updating === o.id || o.status === 'CANCELLED' || o.status === 'DELIVERED'}
                    onChange={(e) => handleStatus(o.id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, cursor: 'pointer' }}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No orders yet.</td></tr>
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
