import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dpqk0grzl/image/upload/v1751614337/default-photo-profile_pqodkq.png';

const ProductCartCard = ({ item, onUpdateQuantity, onDeleteItem, updatingId }) => {
  const isUpdating = updatingId === item.id;
  const photo = item.photoUrl || DEFAULT_IMAGE;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      {/* Product Image */}
      <Link to={`/product/${item.productId}`} className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden block">
        <img
          className="w-full h-full object-cover object-center"
          src={photo}
          alt={item.productName || "Product image"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_IMAGE;
          }}
        />
      </Link>

      {/* Info & Options */}
      <div className="flex-1 w-full flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <Link
              to={`/product/${item.productId}`}
              className="text-base sm:text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors uppercase line-clamp-1"
            >
              {item.productName || "Product"}
            </Link>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500">
              {item.variant && (
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                  Var: {item.variant}
                </span>
              )}
              {item.size && (
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                  Size: {item.size}
                </span>
              )}
              {item.price && (
                <span className="text-gray-500">
                  @ ${Number(item.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-extrabold text-gray-900">
              ${Number(item.subtotal || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Quantity Controls & Delete Button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium mr-1">Qty:</span>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                type="button"
                disabled={item.quantity <= 1 || isUpdating}
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                -
              </button>
              <span className="px-3 py-1 font-semibold text-sm text-gray-800 min-w-[2.5rem] text-center bg-white">
                {item.quantity}
              </span>
              <button
                type="button"
                disabled={(item.stock && item.quantity >= item.stock) || isUpdating}
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onDeleteItem(item.id)}
            className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCartCard;