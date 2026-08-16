import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dpqk0grzl/image/upload/v1751614337/default-photo-profile_pqodkq.png';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col group">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
        <img
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          src={product.photoUrl || DEFAULT_IMAGE}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        {product.categoryName && (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded backdrop-blur-sm">
            {product.categoryName}
          </span>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.description || "No description available."}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-gray-900 font-bold text-lg">
            ${Number(product.price).toFixed(2)}
          </span>
          <Link
            to={`/product/${product.id}`}
            className="text-xs font-semibold uppercase tracking-wider text-blue-600 hover:text-blue-800"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
