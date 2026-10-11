import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ProductCartCard from '../components/ProductCartCard';
import ConfirmModal from '../components/ConfirmModal';
import { showSuccessToast, showErrorToast } from '../redux/slices/toastSlice';
import { getMyCart, updateCartItem, deleteCartItem, clearCart, createOrder, getMyAddresses } from '../services/api';

const CartPage = () => {
  const dispatch = useDispatch();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDanger: false,
  });
  const navigate = useNavigate();

  const fetchCartAndAddresses = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const [cartRes, addrRes] = await Promise.all([
        getMyCart(),
        getMyAddresses().catch(() => ({ data: { data: [] } })),
      ]);
      setCart(cartRes.data.data);
      const addrList = addrRes.data.data || [];
      setAddresses(addrList);
      if (addrList.length > 0) {
        const primary = addrList.find((a) => a.isPrimary) || addrList[0];
        setSelectedAddressId(primary.id);
      }
    } catch (error) {
      console.error("Error fetching cart/addresses:", error);
      const msg = error.response?.data?.message || "Failed to load your cart. Please ensure you are logged in.";
      setErrorMessage(msg);
      dispatch(showErrorToast(msg));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAndAddresses();
  }, []);

  const handleUpdateQuantity = async (detailId, newQuantity) => {
    try {
      setUpdatingId(detailId);
      await updateCartItem(detailId, newQuantity);
      await fetchCart();
      dispatch(showSuccessToast("Item quantity updated."));
    } catch (error) {
      console.error("Error updating quantity:", error);
      dispatch(showErrorToast(error.response?.data?.message || "Failed to update item quantity."));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = (detailId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from your shopping cart?',
      isDanger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          setUpdatingId(detailId);
          await deleteCartItem(detailId);
          await fetchCart();
          dispatch(showSuccessToast("Item removed from cart."));
        } catch (error) {
          console.error("Error deleting item:", error);
          dispatch(showErrorToast(error.response?.data?.message || "Failed to remove item."));
        } finally {
          setUpdatingId(null);
        }
      },
    });
  };

  const handleClearCart = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Shopping Cart',
      message: 'Are you sure you want to empty your entire shopping cart? This cannot be undone.',
      isDanger: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          setLoading(true);
          await clearCart();
          await fetchCart();
          dispatch(showSuccessToast("Shopping cart cleared."));
        } catch (error) {
          console.error("Error clearing cart:", error);
          dispatch(showErrorToast(error.response?.data?.message || "Failed to clear cart."));
          setLoading(false);
        }
      },
    });
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) return;
    try {
      setIsCheckingOut(true);
      setErrorMessage('');

      const orderPayload = {
        item: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderPayload);
      setCheckoutSuccess(true);
      dispatch(showSuccessToast("Order placed successfully! Redirecting to orders..."));
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error("Error during checkout:", error);
      const msg = error.response?.data?.message || "Checkout failed. Please try again.";
      setErrorMessage(msg);
      dispatch(showErrorToast(msg));
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const grandTotal = Number(cart?.total || 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline"
          >
            Clear Cart
          </button>
        )}
      </div>

      <div className="border-t border-gray-200 mb-8"></div>

      {/* Success Alert */}
      {checkoutSuccess && (
        <div className="mb-6 p-4 bg-blue-50 border-2 border-black text-blue-900 flex items-center gap-3 retro-shadow-sm">
          <svg className="w-6 h-6 text-retro-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <h4 className="font-bold">Order Placed Successfully!</h4>
            <p className="text-sm">Redirecting to your orders history...</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="bg-white border-2 border-black retro-shadow-lg p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-20 h-20 bg-retro-amber border-2 border-black text-black flex items-center justify-center mx-auto mb-5 retro-shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">
            CART STATUS // ZERO ITEMS
          </span>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-black mb-3">YOUR BAG IS EMPTY</h2>
          <p className="font-mono text-xs text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">
            There are no recorded items in your session bag. Explore our archive to add vintage goods.
          </p>
          <Link
            to="/product"
            className="retro-btn inline-block bg-black hover:bg-retro-blue text-white px-8 py-3.5 font-mono font-bold text-xs uppercase tracking-wider"
          >
            Browse Products &rarr;
          </Link>
        </div>
      ) : (
        /* Cart Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <ProductCartCard
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onDeleteItem={handleDeleteItem}
                updatingId={updatingId}
              />
            ))}
          </div>

          {/* Order Summary Sidebar - Cashier Bill Style */}
          <div className="bg-white border-2 border-black retro-shadow-lg p-6 sticky top-6">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <h2 className="text-base font-extrabold text-black uppercase tracking-wider">
                INVOICE SUMMARY
              </h2>
              <span className="font-mono text-[10px] font-bold bg-retro-amber border border-black px-1.5 py-0.5">
                BILLING
              </span>
            </div>

            {/* Shipping Address Selector */}
            <div className="mb-4 pb-4 border-b border-gray-100 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase tracking-wider text-gray-700">Shipping Address</span>
                <Link to="/profile" className="text-blue-600 hover:underline font-semibold uppercase text-[11px]">
                  Manage
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800">
                  <p className="font-semibold mb-1">No shipping address found.</p>
                  <Link to="/profile" className="text-blue-600 font-bold hover:underline">
                    Add address in Profile &rarr;
                  </Link>
                </div>
              ) : (
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="w-full p-2 border border-gray-300 bg-white font-medium text-gray-800 focus:outline-none focus:border-blue-600 text-xs"
                >
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{a.label}] {a.recipientName} - {a.city} {a.isPrimary ? '(Primary)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-3 text-xs text-gray-600 border-b border-gray-100 pb-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-semibold text-gray-900">${grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-retro-blue font-bold uppercase tracking-wider">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="text-gray-500">Included</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 text-base font-extrabold text-gray-900">
              <span className="uppercase tracking-tight">Total Amount</span>
              <span className="text-2xl">${grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              disabled={isCheckingOut || checkoutSuccess || addresses.length === 0}
              onClick={handleCheckout}
              className="retro-btn w-full bg-retro-blue hover:bg-blue-700 text-white font-mono font-bold py-4 px-4 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                  SUBMITTING RECORD...
                </>
              ) : addresses.length === 0 ? (
                "SELECT ADDRESS TO CONTINUE"
              ) : (
                "CONFIRM & CHECKOUT &rarr;"
              )}
            </button>

            <div className="mt-4 text-center">
              <Link to="/product" className="text-xs text-gray-500 hover:text-gray-900 underline">
                &larr; Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isDanger={confirmModal.isDanger}
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default CartPage;
