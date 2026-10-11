import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { CardSkeleton } from '../../components/Skeletons';
import { adminGetAllProducts, adminGetAllOrders, adminGetAllUsers, adminGetAllCategories } from '../../services/api';

function StatCard({ label, value, icon, color, subtext, linkTo }) {
  return (
    <Link to={linkTo || '#'} className="block text-black no-underline">
      <div className="bg-white border-2 border-black p-5 retro-shadow transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              {label}
            </div>
            <div className="font-mono text-3xl font-extrabold text-black">
              {value ?? '—'}
            </div>
            {subtext && (
              <div className="font-mono text-[10px] text-gray-600 uppercase tracking-wide mt-2">
                // {subtext}
              </div>
            )}
          </div>
          <div className="w-12 h-12 border-2 border-black flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: color }}>
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );
}

const STATUS_BADGES = {
  PENDING: 'bg-retro-amber text-black',
  PROCESSING: 'bg-retro-blue text-white',
  SHIPPED: 'bg-purple-600 text-white',
  DELIVERED: 'bg-blue-600 text-white',
  CANCELLED: 'bg-retro-coral text-white',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, categories: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      adminGetAllProducts({ size: 1 }),
      adminGetAllOrders({ size: 10, sortBy: 'createdAt', sortDirection: 'desc' }),
      adminGetAllUsers({ size: 1 }),
      adminGetAllCategories(),
    ]).then(([p, o, u, c]) => {
      const ordersData = o.status === 'fulfilled' ? (o.value.data?.data || []) : [];
      const totalRevenue = ordersData.reduce((acc, curr) => {
        if (curr.status !== 'CANCELLED') {
          return acc + Number(curr.totalAmount || curr.total || 0);
        }
        return acc;
      }, 0);

      setStats({
        products: p.status === 'fulfilled' ? (p.value.data?.pagination?.totalItems ?? 0) : 0,
        orders:   o.status === 'fulfilled' ? (o.value.data?.pagination?.totalItems ?? 0) : 0,
        users:    u.status === 'fulfilled' ? (u.value.data?.pagination?.totalItems ?? 0) : 0,
        categories: c.status === 'fulfilled' ? (c.value.data?.data?.length ?? 0) : 0,
        revenue: totalRevenue,
      });

      setRecentOrders(ordersData.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="border-2 border-black bg-white p-6 retro-shadow mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-retro-amber font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest mb-2">
            CONTROL_PANEL // SYS_STATUS: ONLINE
          </div>
          <h2 className="font-extrabold text-3xl uppercase tracking-tight text-black m-0">
            DASHBOARD OVERVIEW
          </h2>
          <p className="font-mono text-xs text-gray-600 uppercase tracking-wide mt-1">
            Real-time analytics and inventory performance
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="retro-btn bg-black text-white font-mono font-bold text-xs uppercase tracking-widest px-4 py-2.5"
          >
            + ADD PRODUCT
          </Link>
          <Link
            to="/admin/categories"
            className="retro-btn bg-white text-black font-mono font-bold text-xs uppercase tracking-widest px-4 py-2.5"
          >
            CATEGORIES
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Products" value={stats.products} icon="📦" color="#ffde59" linkTo="/admin/products" subtext="Live in catalog" />
          <StatCard label="Total Orders" value={stats.orders} icon="🛒" color="#67e8f9" linkTo="/admin/orders" subtext="Customer checkouts" />
          <StatCard label="Recent Revenue" value={fmt(stats.revenue)} icon="💰" color="#93c5fd" linkTo="/admin/orders" subtext="Completed cycles" />
          <StatCard label="Registered Users" value={stats.users} icon="👥" color="#fca5a5" linkTo="/admin/users" subtext="Active accounts" />
        </div>
      )}

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 border-2 border-black bg-white p-6 retro-shadow">
          <div className="flex justify-between items-center pb-4 mb-4 border-b-2 border-black">
            <div>
              <h3 className="font-extrabold text-xl uppercase tracking-tight text-black m-0">
                RECENT TRANSACTIONS
              </h3>
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                // LATEST ACTIVITY LOG
              </span>
            </div>
            <Link
              to="/admin/orders"
              className="font-mono text-xs font-bold text-retro-blue hover:underline uppercase tracking-wider"
            >
              VIEW ALL &rarr;
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs uppercase tracking-widest text-gray-500">
              NO TRANSACTION RECORDS FOUND
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-black bg-retro-cream text-left">
                    <th className="p-3 uppercase tracking-wider font-bold">ORDER_ID</th>
                    <th className="p-3 uppercase tracking-wider font-bold">CUSTOMER</th>
                    <th className="p-3 uppercase tracking-wider font-bold">AMOUNT</th>
                    <th className="p-3 uppercase tracking-wider font-bold">DATE</th>
                    <th className="p-3 uppercase tracking-wider font-bold">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-bold text-retro-blue">#{o.id?.slice(0, 8)}</td>
                      <td className="p-3 font-bold text-black">{o.username || o.userId || '—'}</td>
                      <td className="p-3 font-bold text-black">{fmt(o.totalAmount || o.total || 0)}</td>
                      <td className="p-3 text-gray-600">{fmtDate(o.createdAt)}</td>
                      <td className="p-3">
                        <span className={`inline-block border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_BADGES[o.status] || 'bg-gray-200 text-black'}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links / Status Panel */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-black bg-white p-6 retro-shadow">
            <h3 className="font-extrabold text-lg uppercase tracking-tight text-black mb-4 pb-2 border-b-2 border-black">
              QUICK COMMANDS
            </h3>
            <div className="flex flex-col gap-3 font-mono text-xs">
              {[
                { to: '/admin/products', label: '📦 PRODUCT CATALOG' },
                { to: '/admin/categories', label: '🏷️ CATEGORY TAXONOMY' },
                { to: '/admin/orders', label: '🛒 ORDER DISPATCH' },
                { to: '/admin/users', label: '👥 USER DIRECTORY' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between p-3 border-2 border-black bg-retro-cream hover:bg-retro-amber font-bold text-black no-underline transition-colors shadow-[2px_2px_0px_#000]"
                >
                  <span>{item.label}</span>
                  <span>&rarr;</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-2 border-black bg-retro-amber p-6 retro-shadow">
            <div className="inline-block bg-black text-retro-amber font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest mb-3">
              SYSTEM MEMO
            </div>
            <h4 className="font-extrabold text-base uppercase tracking-tight text-black mb-2">
              OPERATIONAL PROTOCOL
            </h4>
            <p className="font-mono text-xs text-black/80 uppercase leading-relaxed m-0">
              Pastikan stok barang selalu sinkron dengan status inventaris fisik untuk mencegah pesanan tertunda.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
