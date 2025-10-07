import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, addProductToCart } from '../services/api';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addProductToCart({ productId: id, quantity });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            className="w-full h-auto object-cover object-center rounded-lg shadow-md"
            src={'https://res.cloudinary.com/dpqk0grzl/image/upload/v1751614337/default-photo-profile_pqodkq.png' || product.photoUrl}
            alt={product.name}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800 uppercase">{product.name}</h1>
          <p className="text-gray-800 font-semibold text-xl mb-4">${product.price}</p>
          <h1 className="text-2xl font-bold mb-4 text-gray-800 uppercase">Product Description</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-4 text-gray-700 font-bold uppercase">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-accent hover:bg-red-700 text-white font-bold uppercase py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
