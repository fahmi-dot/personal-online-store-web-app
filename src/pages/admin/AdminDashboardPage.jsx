import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { CardSkeleton } from '../../components/Skeletons';
import { adminGetAllProducts, adminGetAllOrders, adminGetAllUsers, adminGetAllCategories } from '../../services/api';

function StatCard({ label, value, icon, color, subtext, linkTo }) {
  return (
    <Link to={linkTo || '#'} style={{ textDecoration: 'none', flex: 1, minWidth: 220 }}>
      <div style={{
        background: '#fff', padding: '24px', display: 'flex', alignItems: 'center',
        gap: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0',
        transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
      }}>
        <div style={{
          width: 52, height: 52, background: color + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{value ?? '—'}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginTop: 2 }}>{label}</div>
          {subtext && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{subtext}</div>}
        </div>
      </div>
    </Link>
  );
}

const STATUS_COLORS = {
  PENDING: '#d97706', PROCESSING: '#2563eb',
  SHIPPED: '#7c3aed', DELIVERED: '#059669', CANCELLED: '#dc2626',
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Dashboard Overview</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Summary and performance of your personal online store.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/products" style={{
            background: '#2563eb', color: '#fff', textDecoration: 'none', padding: '10px 18px',
            fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span>+</span> Add Product
          </Link>
          <Link to="/admin/categories" style={{
            background: '#f1f5f9', color: '#334155', textDecoration: 'none', padding: '10px 18px',
            fontSize: 13, fontWeight: 600, border: '1px solid #cbd5e1',
          }}>
            Categories
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          <StatCard label="Total Products" value={stats.products} icon="📦" color="#2563eb" linkTo="/admin/products" subtext="Live in store" />
          <StatCard label="Total Orders" value={stats.orders} icon="🛒" color="#d97706" linkTo="/admin/orders" subtext="All customer orders" />
          <StatCard label="Recent Revenue" value={fmt(stats.revenue)} icon="💰" color="#059669" linkTo="/admin/orders" subtext="From current orders" />
          <StatCard label="Registered Customers" value={stats.users} icon="👥" color="#0284c7" linkTo="/admin/users" subtext="Active user accounts" />
        </div>
      )}

      {/* Quick Actions & Recent Orders Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Recent Orders Card */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Orders</h3>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Latest customer transactions</p>
            </div>
            <Link to="/admin/orders" style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              View All &rarr;
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              No recent orders found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Order ID</th>
                    <th style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Customer</th>
                    <th style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total</th>
                    <th style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontSize: 12, fontFamily: 'monospace', color: '#64748b' }}>{o.id?.slice(0, 8)}…</td>
                      <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{o.username || o.userId || '—'}</td>
                      <td style={{ padding: '12px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{fmt(o.totalAmount || o.total || 0)}</td>
                      <td style={{ padding: '12px', fontSize: 12, color: '#64748b' }}>{fmtDate(o.createdAt)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '3px 8px', fontSize: 11, fontWeight: 700,
                          background: (STATUS_COLORS[o.status] || '#94a3b8') + '18',
                          color: STATUS_COLORS[o.status] || '#94a3b8',
                        }}>{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links & Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Quick Navigation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/admin/products" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
                background: '#f8fafc', textDecoration: 'none', color: '#1e293b', fontSize: 13, fontWeight: 600,
                border: '1px solid #e2e8f0',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>📦 Products Management</span>
                <span style={{ color: '#2563eb' }}>&rarr;</span>
              </Link>
              <Link to="/admin/categories" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
                background: '#f8fafc', textDecoration: 'none', color: '#1e293b', fontSize: 13, fontWeight: 600,
                border: '1px solid #e2e8f0',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>🏷️ Categories Catalog</span>
                <span style={{ color: '#2563eb' }}>&rarr;</span>
              </Link>
              <Link to="/admin/orders" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
                background: '#f8fafc', textDecoration: 'none', color: '#1e293b', fontSize: 13, fontWeight: 600,
                border: '1px solid #e2e8f0',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>🛒 Customer Orders</span>
                <span style={{ color: '#2563eb' }}>&rarr;</span>
              </Link>
              <Link to="/admin/users" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
                background: '#f8fafc', textDecoration: 'none', color: '#1e293b', fontSize: 13, fontWeight: 600,
                border: '1px solid #e2e8f0',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>👥 Registered Users</span>
                <span style={{ color: '#2563eb' }}>&rarr;</span>
              </Link>
            </div>
          </div>

          <div style={{ background: '#2563eb', padding: '24px', color: '#fff' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>💡</div>
            <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700 }}>Single-Vendor Store Tip</h4>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.9, lineHeight: 1.5 }}>
              Pastikan stok produk selalu terisi dan pantau status pesanan pelanggan secara berkala untuk menjaga kepuasan pembeli Anda.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
