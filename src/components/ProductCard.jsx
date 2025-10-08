import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-secondary shadow-lg overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <img
          className="w-full object-cover object-center"
          src={'https://res.cloudinary.com/dpqk0grzl/image/upload/v1751614337/default-photo-profile_pqodkq.png' || product.photoUrl}
          alt={product.name}
        />
      </Link>
      <div className="p-4">
        <h3 className="text-primary font-bold text-xl mb-2 uppercase">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <h3 className="flex items-center justify-between mt-4">
          <span className="text-primary font-semibold text-lg">${product.price}</span>
        </h3>
      </div>
    </div>
  );
};

export default ProductCard;
