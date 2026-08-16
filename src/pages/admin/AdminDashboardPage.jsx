import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminGetAllProducts, adminGetAllOrders, adminGetAllUsers, adminGetAllCategories } from '../../services/api';

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '24px', display: 'flex', alignItems: 'center',
      gap: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', flex: 1, minWidth: 160,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12, background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>{value ?? '—'}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, categories: 0 });

  useEffect(() => {
    Promise.allSettled([
      adminGetAllProducts({ size: 1 }),
      adminGetAllOrders({ size: 1 }),
      adminGetAllUsers({ size: 1 }),
      adminGetAllCategories(),
    ]).then(([p, o, u, c]) => {
      setStats({
        products: p.status === 'fulfilled' ? (p.value.data?.pagination?.totalItems ?? 0) : 0,
        orders:   o.status === 'fulfilled' ? (o.value.data?.pagination?.totalItems ?? 0) : 0,
        users:    u.status === 'fulfilled' ? (u.value.data?.pagination?.totalItems ?? 0) : 0,
        categories: c.status === 'fulfilled' ? (c.value.data?.data?.length ?? 0) : 0,
      });
    });
  }, []);

  return (
    <AdminLayout>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Dashboard Overview</h2>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <StatCard label="Total Products" value={stats.products} icon="📦" color="#6366f1" />
        <StatCard label="Total Orders" value={stats.orders} icon="🛒" color="#f59e0b" />
        <StatCard label="Registered Users" value={stats.users} icon="👥" color="#10b981" />
        <StatCard label="Categories" value={stats.categories} icon="🏷️" color="#3b82f6" />
      </div>
    </AdminLayout>
  );
}
