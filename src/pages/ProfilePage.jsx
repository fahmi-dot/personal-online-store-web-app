import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../services/api';
import { logout, fetchProfile } from '../redux/slices/authSlice';

const ProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;

  const fetchOrdersData = async () => {
    try {
      setLoadingOrders(true);
      const response = await getMyOrders({ sortBy: 'createdAt', sortDirection: 'desc' });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
      fetchOrdersData();
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      await fetchOrdersData();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-4 pb-2 border-b border-gray-100">
              User Profile
            </h2>
            {user ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase">Username</span>
                  <p className="text-gray-900 font-bold text-base">{user.username}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase">Email</span>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase">Role</span>
                  <p className="inline-block mt-0.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800 uppercase">
                    {user.role || 'ROLE_USER'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase text-xs py-2.5 px-4 rounded-lg tracking-wider transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500 text-sm">Loading user data...</div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                  My Orders
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Track and manage your order history
                </p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                <p className="text-xs text-gray-500">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                You haven't placed any orders yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 font-bold text-gray-600 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-5 py-3 font-bold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-5 py-3 font-bold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-5 py-3 font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3 font-bold text-gray-600 uppercase tracking-wider text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 font-mono font-medium text-gray-900">
                          {order.id?.substring(0, 8)}...
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : order.date
                            ? new Date(order.date).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="px-5 py-4 font-bold text-gray-900">
                          ${Number(order.total || order.totalPrice || 0).toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {order.status === 'PENDING' && (
                            <button
                              disabled={cancellingId === order.id}
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-red-600 hover:text-red-800 font-semibold hover:underline text-xs disabled:opacity-50"
                            >
                              {cancellingId === order.id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;