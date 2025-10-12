import React from 'react'
import { Link } from 'react-router-dom';

const ProductCartCard = ({ item, product }) => {
  return (
    <Link to={`/product/${item?.productId}`}>
      <div className="mb-5 px-6 py-4 bg-secondary shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex">
          <img
            className="w-24 h-24 object-cover object-center"
            src={'https://res.cloudinary.com/dpqk0grzl/image/upload/v1751614337/default-photo-profile_pqodkq.png'}
          />
          <div className="p-4">
            <h3 className="text-primary font-bold text-xl mb-2 uppercase">{product?.name}</h3>
            <h3 className="flex items-center justify-between mt-4 space-x-5">
              <span className="text-primary font-semibold text-lg">${item?.subtotal}</span>
              <span className="text-primary font-semibold text-lg">{item?.variant}</span>
              <span className="text-primary font-semibold text-lg">{item?.size}</span>
              <span className="text-primary font-semibold text-lg">{item?.quantity}</span>
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCartCard;