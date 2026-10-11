import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminLayout from '../../components/AdminLayout';
import { TableRowSkeleton } from '../../components/Skeletons';
import { showSuccessToast, showErrorToast } from '../../redux/slices/toastSlice';
import { adminGetAllOrders, adminUpdateOrderStatus } from '../../services/api';

const STATUS_CONFIG = {
  PENDING: 'bg-retro-amber text-black border-black',
  PROCESSING: 'bg-retro-blue text-white border-black',
  SHIPPED: 'bg-purple-600 text-white border-black',
  DELIVERED: 'bg-blue-600 text-white border-black',
  CANCELLED: 'bg-retro-coral text-white border-black',
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
      dispatch(showSuccessToast(`Order status updated to: ${status}`));
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
      <div className="border-2 border-black bg-white p-6 retro-shadow mb-8">
        <div className="inline-block bg-black text-retro-amber font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest mb-2">
          FULFILLMENT // DISPATCH_REGISTRY
        </div>
        <h2 className="font-extrabold text-3xl uppercase tracking-tight text-black m-0">
          CUSTOMER ORDERS
        </h2>
        <p className="font-mono text-xs text-gray-600 uppercase tracking-wide mt-1">
          Monitor transaction statuses, delivery dispatching, and order fulfillment lifecycle
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 font-mono text-xs">
        {STATUS_OPTIONS.map((status) => {
          const active = selectedStatus === status;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`border-2 border-black px-4 py-2 font-bold uppercase tracking-wider cursor-pointer transition-all ${
                active
                  ? 'bg-black text-white shadow-[2px_2px_0px_#ffde59]'
                  : 'bg-white text-black hover:bg-retro-cream'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="border-2 border-black bg-white retro-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-retro-cream text-left">
                {['ORDER_ID', 'BUYER PROFILE', 'MANIFEST ITEMS', 'TOTAL VALUE', 'TIMESTAMP', 'STATUS', 'DISPATCH ACTION'].map((h) => (
                  <th key={h} className="p-3.5 font-bold uppercase tracking-wider text-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRowSkeleton key={idx} cols={7} />
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500 uppercase tracking-widest">
                    NO ORDERS UNDER THIS FILTER CLASSIFICATION
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const itemsCount = o.orderDetails ? o.orderDetails.reduce((acc, curr) => acc + curr.quantity, 0) : null;
                  return (
                    <tr key={o.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3.5 font-bold text-retro-blue">#{o.id?.slice(0, 8)}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-black uppercase">{o.username || o.user?.name || 'CUSTOMER'}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{o.userEmail || o.user?.email || '// REGISTERED_BUYER'}</div>
                      </td>
                      <td className="p-3.5 text-black">
                        {itemsCount !== null ? `${itemsCount} UNIT(S)` : (o.items ? `${o.items.length} ITEMS` : '—')}
                      </td>
                      <td className="p-3.5 font-bold text-black">{fmt(o.totalAmount || o.total || 0)}</td>
                      <td className="p-3.5 text-gray-600">{fmtDate(o.createdAt)}</td>
                      <td className="p-3.5">
                        <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_CONFIG[o.status] || 'bg-gray-200 text-black border-black'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={o.status}
                          disabled={updating === o.id}
                          onChange={(e) => handleStatus(o.id, e.target.value)}
                          className="border-2 border-black p-1.5 font-mono text-[11px] font-bold uppercase bg-white text-black outline-none cursor-pointer"
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
    </AdminLayout>
  );
}
