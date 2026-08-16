import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCartCard from '../components/ProductCartCard';
import { getMyCart, updateCartItem, deleteCartItem, clearCart, createOrder } from '../services/api';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await getMyCart();
      setCart(response.data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setErrorMessage(error.response?.data?.message || "Failed to load your cart. Please ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (detailId, newQuantity) => {
    try {
      setUpdatingId(detailId);
      await updateCartItem(detailId, newQuantity);
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error.response?.data?.message || "Failed to update item quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = async (detailId) => {
    if (!window.confirm("Are you sure you want to remove this item from your cart?")) return;
    try {
      setUpdatingId(detailId);
      await deleteCartItem(detailId);
      await fetchCart();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(error.response?.data?.message || "Failed to remove item.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?")) return;
    try {
      setLoading(true);
      await clearCart();
      await fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert(error.response?.data?.message || "Failed to clear cart.");
      setLoading(false);
    }
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
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error("Error during checkout:", error);
      setErrorMessage(error.response?.data?.message || "Checkout failed. Please try again.");
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your shopping cart...</p>
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
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center max-w-lg mx-auto shadow-sm my-8">
          <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-6">
            Looks like you haven't added any products to your shopping cart yet.
          </p>
          <Link
            to="/product"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors uppercase tracking-wider"
          >
            Start Shopping
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

          {/* Order Summary Sidebar */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-semibold text-gray-900">${grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="text-gray-500">Included</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 text-base font-extrabold text-gray-900">
              <span>Total Amount</span>
              <span className="text-2xl">${grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              disabled={isCheckingOut || checkoutSuccess}
              onClick={handleCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-lg uppercase tracking-wider text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Order...
                </>
              ) : (
                "Proceed to Checkout"
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
    </div>
  );
};

export default CartPage;