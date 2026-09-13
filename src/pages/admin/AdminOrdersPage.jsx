import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminLayout from '../../components/AdminLayout';
import { TableRowSkeleton } from '../../components/Skeletons';
import { showSuccessToast, showErrorToast } from '../../redux/slices/toastSlice';
import { adminGetAllOrders, adminUpdateOrderStatus } from '../../services/api';

const STATUS_CONFIG = {
  PENDING: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  PROCESSING: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
  SHIPPED: { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' },
  DELIVERED: { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
  CANCELLED: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
};
const STATUS_OPTIONS = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = async (p = 0) => {
    try {
      setLoading(true);
      const r = await adminGetAllOrders({ page: p, size: 15, sortBy: 'createdAt', sortDirection: 'desc' });
      setOrders(r.data?.data || []);
      setTotalPages(r.data?.pagination?.totalPages || 1);
    } catch {
      dispatch(showErrorToast('Failed to load customer orders.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await adminUpdateOrderStatus(id, status);
      dispatch(showSuccessToast(`Order updated to status: ${status}`));
      load(page);
    } catch (err) {
      dispatch(showErrorToast(err.response?.data?.message || 'Failed to update order status.'));
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = selectedStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === selectedStatus);

  const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Customer Orders</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Monitor fulfillment, order lifecycle, and update shipment status.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {STATUS_OPTIONS.map((status) => {
          const active = selectedStatus === status;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                padding: '8px 16px', border: '1px solid #cbd5e1', cursor: 'pointer',
                fontSize: 12, fontWeight: 700,
                background: active ? '#2563eb' : '#fff',
                color: active ? '#fff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              {['Order Reference', 'Customer', 'Items Summary', 'Total Amount', 'Created Date', 'Current Status', 'Action'].map((h) => (
                <th key={h} style={{ padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRowSkeleton key={idx} cols={7} />
              ))
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#94a3b8' }}>No orders found for this status.</td></tr>
            ) : (
              filteredOrders.map((o) => {
                const conf = STATUS_CONFIG[o.status] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
                const itemsCount = o.orderDetails ? o.orderDetails.reduce((acc, curr) => acc + curr.quantity, 0) : null;
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '14px 20px', fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
                      #{o.id?.slice(0, 8)}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{o.username || o.user?.name || 'Customer'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{o.userEmail || o.user?.email || 'Registered User'}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>
                      {itemsCount !== null ? `${itemsCount} item(s)` : (o.items ? `${o.items.length} items` : '—')}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                      {fmt(o.totalAmount || o.total || 0)}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#64748b' }}>
                      {fmtDate(o.createdAt)}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px', fontSize: 11, fontWeight: 700,
                        background: conf.bg, color: conf.text, border: `1px solid ${conf.border}`,
                        display: 'inline-block',
                      }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <select
                        value={o.status}
                        disabled={updating === o.id}
                        onChange={(e) => handleStatus(o.id, e.target.value)}
                        style={{
                          padding: '6px 12px', border: '1px solid #cbd5e1',
                          fontSize: 12, fontWeight: 600, background: '#f8fafc', color: '#0f172a',
                          cursor: 'pointer', outline: 'none',
                        }}
                      >
                        {STATUS_OPTIONS.filter((s) => s !== 'ALL').map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 600, fontSize: 12, background: '#fff', color: '#475569' }}>&larr; Prev</button>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 600, fontSize: 12, background: '#fff', color: '#475569' }}>Next &rarr;</button>
        </div>
      )}
    </AdminLayout>
  );
}
