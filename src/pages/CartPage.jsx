import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyCart } from '../services/api';

const CartPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-3 text-gray-800 uppercase">My Cart</h1>
      <div className="border-t-2 border-primary mb-5 w-full"></div>
      <div className="bg-white shadow-md overflow-x-auto">
        
      </div>
    </div>
  )
}

export default CartPage