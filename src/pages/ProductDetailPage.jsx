import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getCategoryById, addProductToCart } from '../services/api';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getProductById(id);
        const fetchedProduct = productResponse.data.data;
        setProduct(fetchedProduct);

        const categoryResponse = await getCategoryById(fetchedProduct.categoryId);
        setCategory(categoryResponse.data.data.name);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={'https://res.cloudinary.com/dpqk0grzl/image/upload/v1751614337/default-photo-profile_pqodkq.png' || product.photoUrl}
            className="w-full h-auto object-cover object-center shadow-md"
            alt={product.name}
          />
        </div>
        <div className="flex flex-col space-y-5">
          <div>
            <h1 className="text-3xl font-bold mb-4 uppercase">{product.name}</h1>
            <p className="text-gray-800 font-semibold text-2xl">${product.price}</p>
          </div>
          <div className="border-t-2 border-primary mb-2 w-full"/>
          <div>
            <div className="flex justify-between">
              <h3 className="text-xl font-bold mb-2 uppercase">Product Description</h3>
              <button
                  onClick={() => setDesc(!desc)}
                  className="px-4 py-2 text-xl font-bold hover:bg-gray-100"
                >
                  -
                </button>
            </div>
            { desc ? ( <p className="text-gray-700">{product.description}</p> ) : ( <></> )}
          </div>
          <div className="border-t-2 border-primary mb-2 w-full"/>
          <div>
            <h3 className="text-xl font-bold mb-2 uppercase">Color</h3>
            <div className="flex flex-wrap gap-2">
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
              <div className="h-24 w-24 bg-primary"/>
            </div>
          </div>
          { category === "Clothing" ? (
            <>
              <div className="border-t-2 border-primary mb-2 w-full"/>
              <div>
                <h3 className="text-xl font-bold mb-2 uppercase">Size</h3>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-50 border-2 border-primary py-2 px-3 text-gray-700"
                >
                  <option value="">Choose an option</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                </select>
              </div>
            </>
            ) : category === "Books" ? (
              <></>
            ) : ( <></> )
          }
          <div className="border-t-2 border-primary mb-2 w-full"/>
          <div>
            <h3 className="text-xl font-bold mb-2 uppercase">Quantity</h3>
            <div className="flex items-center w-fit h-12 space-x-1">
              <div className="h-full border-2 border-primary">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={`w-12 px-4 py-2 text-xl font-bold transition 
                  ${
                    quantity === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  -
                </button>
              </div>
              <div className="flex items-center justify-center h-full w-20 border-2 border-primary">
                <p className="px-5 text-gray-700">{quantity}</p>
              </div>
              <div className="h-full border-2 border-primary">
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-12 px-4 py-2 text-xl font-bold text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-4 font-bold uppercase bg-accent hover:bg-red-700 text-secondary focus:outline-none focus:shadow-outline"
            >
              Add to Cart
            </button>
          </div>
          <div className="flex justify-between text-gray-700">
            <button className="hover:underline">Add to Wishlist</button>
            <button className="hover:underline">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
