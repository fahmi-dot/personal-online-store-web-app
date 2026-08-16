import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Option from '../components/Option';
import { getProductById, addProductToCart } from '../services/api';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dpqk0grzl/image/upload/v1751614337/default-photo-profile_pqodkq.png';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showDesc, setShowDesc] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const variants = ["Standard", "Variant A", "Variant B"];
  const sizes = ["S", "M", "L", "XL", "All Size"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        const data = response.data.data;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      if (window.confirm("You need to login first to add items to your cart. Go to login page?")) {
        navigate("/login");
      }
      return;
    }

    try {
      setIsAdding(true);
      setErrorMessage("");
      setAddSuccess(false);

      await addProductToCart({
        productId: id,
        variant: selectedVariant || null,
        size: selectedSize || null,
        quantity,
      });

      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 4000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setErrorMessage(error.response?.data?.message || "Failed to add product to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl font-bold text-gray-800 mb-4">Product Not Found</p>
        <Link to="/product" className="text-sm font-semibold text-blue-600 hover:underline uppercase">
          &larr; Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link to="/product" className="hover:text-gray-900">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Success Notification */}
      {addSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-sm">Product successfully added to your cart!</span>
          </div>
          <Link
            to="/cart"
            className="text-xs font-bold bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
          >
            View Cart
          </Link>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden aspect-square flex items-center justify-center relative">
          <img
            src={product.photoUrl || DEFAULT_IMAGE}
            className="w-full h-full object-cover object-center"
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_IMAGE;
            }}
          />
          {product.categoryName && (
            <span className="absolute top-4 left-4 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded backdrop-blur-sm">
              {product.categoryName}
            </span>
          )}
        </div>

        {/* Product Details & Purchase Form */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 w-full" />

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
                Product Description
              </h2>
              <button
                onClick={() => setShowDesc(!showDesc)}
                className="text-xs text-gray-500 hover:text-gray-900 font-semibold"
              >
                {showDesc ? 'Hide' : 'Show'}
              </button>
            </div>
            {showDesc && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || "No description provided for this product."}
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 w-full" />

          {/* Variants */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-2">
              Select Variant (Optional)
            </h2>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <Option
                  key={v}
                  option={v}
                  selected={selectedVariant === v}
                  onSelect={() => setSelectedVariant(selectedVariant === v ? "" : v)}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-2">
              Select Size (Optional)
            </h2>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <Option
                  key={s}
                  option={s}
                  selected={selectedSize === s}
                  onSelect={() => setSelectedSize(selectedSize === s ? "" : s)}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 w-full" />

          {/* Quantity Selector */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-2">
              Quantity
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="px-5 py-2 font-bold text-gray-900 bg-white min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stock || isOutOfStock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div>
            <button
              type="button"
              disabled={isOutOfStock || isAdding}
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 text-sm font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding to Cart...
                </>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

