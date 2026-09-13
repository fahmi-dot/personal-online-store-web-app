import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminLayout from '../../components/AdminLayout';
import ConfirmModal from '../../components/ConfirmModal';
import { TableRowSkeleton } from '../../components/Skeletons';
import { showSuccessToast, showErrorToast } from '../../redux/slices/toastSlice';
import { adminGetAllUsers, adminDeleteUser } from '../../services/api';

const btn = (color, textColor = '#fff') => ({
  padding: '7px 14px', border: 'none', cursor: 'pointer',
  fontWeight: 600, fontSize: 13, background: color, color: textColor,
});

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const load = async (p = 0) => {
    try {
      setLoading(true);
      const r = await adminGetAllUsers({ page: p, size: 15 });
      setUsers(r.data?.data || []);
      setTotalPages(r.data?.pagination?.totalPages || 1);
    } catch {
      dispatch(showErrorToast('Failed to load users.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminDeleteUser(deleteTargetId);
      dispatch(showSuccessToast('User deleted successfully!'));
      setDeleteTargetId(null);
      load(page);
    } catch (err) {
      dispatch(showErrorToast(err.response?.data?.message || 'Failed to delete user.'));
    }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <AdminLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Registered Users</h2>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Username', 'Email', 'Role', 'Joined Date', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRowSkeleton key={idx} cols={5} />
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{u.username}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{u.email || '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: u.role === 'ROLE_ADMIN' ? '#2563eb18' : '#05966918',
                      color: u.role === 'ROLE_ADMIN' ? '#2563eb' : '#059669',
                      padding: '4px 10px', fontSize: 11, fontWeight: 700,
                    }}>{u.role || 'USER'}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{fmtDate(u.createdAt)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {u.role !== 'ROLE_ADMIN' && (
                      <button onClick={() => setDeleteTargetId(u.id)} style={btn('#dc2626')}>Delete</button>
                    )}
                  </td>
                </tr>
              ))
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

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete User"
        message="Are you sure you want to delete this user? This account will permanently lose access."
        isDanger={true}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AdminLayout>
  );
}
