import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminLayout from '../../components/AdminLayout';
import ConfirmModal from '../../components/ConfirmModal';
import { TableRowSkeleton } from '../../components/Skeletons';
import { showSuccessToast, showErrorToast } from '../../redux/slices/toastSlice';
import { adminGetAllUsers, adminDeleteUser } from '../../services/api';

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
      dispatch(showSuccessToast('User account purged successfully!'));
      setDeleteTargetId(null);
      load(page);
    } catch (err) {
      dispatch(showErrorToast(err.response?.data?.message || 'Failed to delete user.'));
    }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <AdminLayout>
      {/* Header */}
      <div className="border-2 border-black bg-white p-6 retro-shadow mb-8">
        <div className="inline-block bg-black text-retro-amber font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest mb-2">
          ACCOUNTS // IDENTITY_REGISTRY
        </div>
        <h2 className="font-extrabold text-3xl uppercase tracking-tight text-black m-0">
          REGISTERED USERS
        </h2>
        <p className="font-mono text-xs text-gray-600 uppercase tracking-wide mt-1">
          Directory of registered customer and administrative credentials
        </p>
      </div>

      {/* Users Table */}
      <div className="border-2 border-black bg-white retro-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-retro-cream text-left">
                {['USERNAME', 'EMAIL ADDRESS', 'ACCESS ROLE', 'ONBOARDING DATE', 'SECURITY COMMANDS'].map((h) => (
                  <th key={h} className="p-3.5 font-bold uppercase tracking-wider text-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRowSkeleton key={idx} cols={5} />
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 uppercase tracking-widest">
                    NO REGISTERED USER ACCOUNTS FOUND
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3.5 font-bold text-black uppercase">{u.username}</td>
                    <td className="p-3.5 text-gray-600">{u.email || '// NO_EMAIL'}</td>
                    <td className="p-3.5">
                      <span className={`inline-block border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                        u.role === 'ROLE_ADMIN' ? 'bg-black text-retro-amber' : 'bg-retro-cream text-black'
                      }`}>
                        {u.role || 'ROLE_USER'}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-600">{fmtDate(u.createdAt)}</td>
                    <td className="p-3.5 w-32">
                      {u.role !== 'ROLE_ADMIN' && (
                        <button
                          onClick={() => setDeleteTargetId(u.id)}
                          className="retro-btn bg-retro-coral text-white font-bold text-[10px] uppercase px-2.5 py-1"
                        >
                          PURGE
                        </button>
                      )}
                    </td>
                  </tr>
                ))
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

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="PURGE USER ACCOUNT"
        message="Are you certain you want to purge this user? Their account and access credentials will be irreversibly erased."
        isDanger={true}
        confirmText="CONFIRM PURGE"
        cancelText="ABORT"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AdminLayout>
  );
}
