import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminGetAllUsers, adminDeleteUser } from '../../services/api';

const btn = (color) => ({ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: color, color: '#fff' });

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState('');

  const load = (p = 0) =>
    adminGetAllUsers({ page: p, size: 15 }).then((r) => {
      setUsers(r.data?.data || []);
      setTotalPages(r.data?.pagination?.totalPages || 1);
    });

  useEffect(() => { load(page); }, [page]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try { await adminDeleteUser(id); showToast('User deleted.'); load(page); }
    catch { showToast('Failed to delete user.'); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <AdminLayout>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, background: '#1e293b', color: '#fff', padding: '12px 20px', borderRadius: 10, zIndex: 200, fontSize: 14 }}>{toast}</div>}
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Users</h2>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Username', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#475569' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{u.username}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{u.email || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: u.role === 'ROLE_ADMIN' ? '#6366f120' : '#10b98120',
                    color: u.role === 'ROLE_ADMIN' ? '#6366f1' : '#10b981',
                    borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700,
                  }}>{u.role || 'USER'}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{fmtDate(u.createdAt)}</td>
                <td style={{ padding: '12px 16px' }}>
                  {u.role !== 'ROLE_ADMIN' && (
                    <button onClick={() => handleDelete(u.id)} style={{ ...btn('#ef4444') }}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No users found.</td></tr>
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
