import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <img
          className="w-full h-56 object-cover object-center"
          src={product.photoUrl || 'https://res.cloudinary.com/dpqk0grzl/image/upload/default-photo-profile_pqodkq.png'}
          alt={product.name}
        />
      </Link>
      <div className="p-4">
        <h3 className="text-gray-800 font-semibold text-lg mb-2">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-gray-600 text-sm">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-800 font-bold text-xl">${product.price}</span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
