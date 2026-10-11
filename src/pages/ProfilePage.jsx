import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { getMyOrders, cancelOrder, getMyAddresses, createAddress, updateAddress, setPrimaryAddress, deleteAddress } from '../services/api';
import { logout, fetchProfile } from '../redux/slices/authSlice';
import { showSuccessToast, showErrorToast } from '../redux/slices/toastSlice';
import AddressModal from '../components/AddressModal';

const ProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

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

  const fetchAddressesData = async () => {
    try {
      setLoadingAddresses(true);
      const response = await getMyAddresses();
      setAddresses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
      fetchOrdersData();
      fetchAddressesData();
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
      dispatch(showSuccessToast("Order cancelled successfully."));
      await fetchOrdersData();
    } catch (error) {
      console.error("Error cancelling order:", error);
      dispatch(showErrorToast(error.response?.data?.message || "Failed to cancel order."));
    } finally {
      setCancellingId(null);
    }
  };

  const handleSaveAddress = async (payload) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, payload);
        dispatch(showSuccessToast("Shipping address updated successfully."));
      } else {
        await createAddress(payload);
        dispatch(showSuccessToast("Shipping address added successfully."));
      }
      fetchAddressesData();
    } catch (error) {
      dispatch(showErrorToast(error.response?.data?.message || "Failed to save address."));
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await setPrimaryAddress(id);
      dispatch(showSuccessToast("Primary address updated."));
      fetchAddressesData();
    } catch (error) {
      dispatch(showErrorToast("Failed to update primary address."));
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      dispatch(showSuccessToast("Address deleted."));
      fetchAddressesData();
    } catch (error) {
      dispatch(showErrorToast("Failed to delete address."));
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
        return 'bg-blue-100 text-blue-800 border-blue-400 font-bold';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Profile & Addresses Card */}
        <div className="md:col-span-1 space-y-6">
          {/* User Info Retro Card */}
          <div className="bg-white border-2 border-black retro-shadow p-6">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <h2 className="text-base font-extrabold text-black uppercase tracking-wider">
                ID BADGE // PROFILE
              </h2>
              <span className="font-mono text-[10px] font-bold bg-retro-amber border border-black px-1.5 py-0.5">
                PASS
              </span>
            </div>
            {user ? (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">IDENTIFIER:</span>
                  <p className="text-black font-extrabold text-sm">{user.username}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ELECTRONIC_MAIL:</span>
                  <p className="text-gray-800 font-medium truncate">{user.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SECURITY_ROLE:</span>
                  <p className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold bg-black text-white uppercase tracking-wider">
                    {user.role || 'ROLE_USER'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="retro-btn w-full mt-6 bg-black hover:bg-retro-coral text-white font-mono font-bold uppercase text-xs py-2.5 px-4 tracking-wider transition-colors"
                >
                  DISCONNECT SESSION
                </button>
              </div>
            ) : (
              <div className="py-4 text-center font-mono text-gray-500 text-xs">Loading user data...</div>
            )}
          </div>

          {/* Shipping Addresses Section Retro Card */}
          <div className="bg-white border-2 border-black retro-shadow p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
              <h3 className="text-base font-extrabold uppercase tracking-tight text-black">
                DESTINATIONS
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null);
                  setAddressModalOpen(true);
                }}
                className="retro-btn bg-retro-blue text-white hover:bg-blue-700 font-mono text-[11px] font-bold px-2 py-1 uppercase tracking-wider"
              >
                + NEW
              </button>
            </div>

            {loadingAddresses ? (
              <div className="py-4 text-center text-xs text-gray-500">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500 border border-dashed border-gray-200 p-4">
                <p className="mb-2">No addresses saved yet.</p>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressModalOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline uppercase"
                >
                  Add your first shipping address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3 border-2 border-black text-xs font-mono transition-all ${
                      addr.isPrimary ? 'bg-retro-amber/20 retro-shadow-sm' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-black uppercase tracking-wider text-[11px] bg-gray-100 border border-black px-1">
                          {addr.label}
                        </span>
                        {addr.isPrimary && (
                          <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.2 uppercase tracking-wider">
                            ★ PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(addr);
                            setAddressModalOpen(true);
                          }}
                          className="text-black hover:text-retro-blue underline text-[11px] font-bold"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-retro-coral hover:underline text-[11px] font-bold"
                        >
                          DEL
                        </button>
                      </div>
                    </div>

                    <p className="font-bold text-black mt-1">
                      {addr.recipientName} // {addr.phoneNumber}
                    </p>
                    <p className="text-gray-700 mt-0.5 leading-relaxed text-[11px]">
                      {addr.streetAddress}, {addr.city} {addr.postalCode ? `[${addr.postalCode}]` : ''}
                    </p>

                    {!addr.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(addr.id)}
                        className="mt-2 text-[10px] font-bold text-black hover:bg-black hover:text-white border border-black px-1.5 py-0.5 uppercase"
                      >
                        MAKE PRIMARY &rarr;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders Table - Retro Ledger Box */}
        <div className="md:col-span-2">
          <div className="bg-white border-2 border-black retro-shadow overflow-hidden">
            <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  TRANSACTION RECORDS // ARCHIVE LOG
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-black uppercase tracking-tight">
                  ORDER HISTORY
                </h2>
              </div>
              <span className="font-mono text-xs font-bold bg-retro-amber border border-black px-2 py-0.5">
                {orders.length} ENTRIES
              </span>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent mb-2"></div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center max-w-sm mx-auto px-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-tight mb-1">No Orders Yet</h3>
                <p className="text-xs text-gray-500 mb-6">You haven't placed any orders yet. Discover our collection and make your first order.</p>
                <Link to="/product" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 transition-colors shadow-sm">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                  const isCancelled = order.status === 'CANCELLED';
                  const currentIdx = steps.indexOf(order.status);

                  return (
                    <div key={order.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-gray-900">
                              #{order.id?.substring(0, 8)}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                          </p>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <div>
                            <span className="text-[11px] text-gray-500 font-semibold uppercase block">Total</span>
                            <span className="text-base font-extrabold text-gray-900">
                              ${Number(order.total || order.totalPrice || 0).toFixed(2)}
                            </span>
                          </div>
                          {order.status === 'PENDING' && (
                            <button
                              disabled={cancellingId === order.id}
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold uppercase text-[11px] tracking-wider transition-colors disabled:opacity-50"
                            >
                              {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Visual Order Progress Stepper */}
                      {!isCancelled ? (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase tracking-wider">
                            {steps.map((st, sIdx) => {
                              const isCompleted = currentIdx >= sIdx;
                              const isCurrent = currentIdx === sIdx;
                              return (
                                <div key={st} className="flex flex-col items-center">
                                  <div className={`w-full h-1.5 mb-1.5 transition-colors ${
                                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                                  }`} />
                                  <span className={isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}>
                                    {st}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 py-2 px-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium">
                          Pesanan ini telah dibatalkan dan stok produk telah dikembalikan.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Edit/Create Modal */}
      <AddressModal
        isOpen={addressModalOpen}
        initialData={editingAddress}
        onClose={() => {
          setAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
      />
    </div>
  );
};

export default ProfilePage;