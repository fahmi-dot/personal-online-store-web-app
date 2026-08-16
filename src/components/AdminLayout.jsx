import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { to: '/admin/orders', label: 'Orders', icon: '🛒' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: '#1e293b', color: '#e2e8f0',
        display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #334155' }}>
          <Link to="/" style={{ color: '#f8fafc', textDecoration: 'none', fontSize: 14, opacity: 0.6 }}>← Store</Link>
          <h1 style={{ margin: '8px 0 0', fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>Admin Panel</h1>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 24px', textDecoration: 'none',
                color: active ? '#fff' : '#94a3b8',
                background: active ? '#334155' : 'transparent',
                fontWeight: active ? 600 : 400,
                fontSize: 14, borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
                transition: 'all 0.15s',
              }}>
                <span>{link.icon}</span>{link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>{children}</main>
    </div>
  );
}
