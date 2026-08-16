import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return null; // still loading profile

  const role = user.role || (Array.isArray(user.roles) ? user.roles[0] : null);
  const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
