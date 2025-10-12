import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Option from '../components/Option';
import { getProductById, getCategoryById, addProductToCart } from '../services/api';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showDesc, setShowDesc] = useState(true);
  const { id } = useParams();

  const variants = ["Var 1", "Var 2", "Var 3", "Var 4", "Var 5"];
  const sizes = ["S", "M", "L", "XL", "XXL", "All Size"];

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
      await addProductToCart({ productId: id, variant: selectedVariant, size: selectedSize || null, quantity });
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
            <h2 className="text-2xl font-bold mb-4 uppercase">{product.name}</h2>
            <p className="text-primary font-medium text-xl">${product.price}</p>
          </div>
          <div className="border-t-2 border-gray-700 w-full"/>
          <div>
            <div className="flex justify-between">
              <h3 className="text-xl font-bold mb-2 uppercase">Product Description</h3>
              <button
                onClick={() => setShowDesc(!showDesc)}
                className="h-5 text-xl font-bold"
              >
                -
              </button>
            </div>
            { showDesc ? ( <p className="text-sm text-gray-700">{product.description}</p> ) : ( <></> )}
          </div>
          <div className="border-t-2 border-gray-700 w-full"/>
          <div>
            <h3 className="text-xl font-bold mb-2 uppercase">Variant</h3>
            <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <Option
                key={v}
                option={v}
                selected={selectedVariant === v}
                onSelect={() => setSelectedVariant(v)}
              />
            ))}
            </div>
          </div>
          { category === "Clothing" ? (
            <>
              <div className="border-t-2 border-gray-700 w-full"/>
              <div>
                <h3 className="text-xl font-bold mb-2 uppercase">Size</h3>
                <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <Option
                    key={s}
                    option={s}
                    selected={selectedSize === s}
                    onSelect={() => setSelectedSize(s)}
                  />
                ))}
                </div>
              </div>
            </>
            ) : category === "Books" ? (
              <></>
            ) : ( <></> )
          }
          <div className="border-t-2 border-gray-700 w-full"/>
          <div>
            <h3 className="text-xl font-bold mb-2 uppercase">Quantity</h3>
            <div className="flex items-center w-fit space-x-1">
              <div className="border border-primary">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={`px-4 py-2 font-bold text-sm transition 
                  ${
                    quantity === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  -
                </button>
              </div>
              <div className="flex items-center justify-center w-20 border border-primary">
                <p className="px-4 py-2 font-bold text-sm text-gray-700">{quantity}</p>
              </div>
              <div className="border border-primary">
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-4 text-lg font-bold uppercase bg-accent hover:bg-red-700 text-secondary focus:outline-none focus:shadow-outline"
            >
              Add to Cart
            </button>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <button className="hover:underline">Add to Wishlist</button>
            <button className="hover:underline">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
