import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { to: '/admin/orders', label: 'Orders', icon: '🛒' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 250, background: '#0f172a', color: '#e2e8f0',
        display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh', borderRight: '1px solid #1e293b',
        boxSizing: 'border-box',
      }}>
        {/* Logo / Brand Header */}
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid #1e293b' }}>
          <Link to="/" style={{
            color: '#94a3b8', textDecoration: 'none', fontSize: 12, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
            <span>&larr;</span> Back to Store
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, background: '#4f46e5',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16,
            }}>
              P
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>Pahmi.co</h1>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Console</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', textDecoration: 'none',
                color: active ? '#fff' : '#94a3b8',
                background: active ? '#1e293b' : 'transparent',
                fontWeight: active ? 600 : 500,
                fontSize: 13, borderRadius: 8,
                borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}>
                <span style={{ fontSize: 16 }}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Badge */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b', background: '#0b1120' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#334155',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#e2e8f0',
            }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.username || 'Admin'}
              </div>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', maxWidth: 1400 }}>
        {children}
      </main>
    </div>
  );
}
