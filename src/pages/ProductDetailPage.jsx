import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Option from '../components/Option';
import { ProductDetailSkeleton } from '../components/Skeletons';
import ConfirmModal from '../components/ConfirmModal';
import { showSuccessToast, showErrorToast } from '../redux/slices/toastSlice';
import { getProductById, addProductToCart } from '../services/api';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dpqk0grzl/image/upload/v1751614337/default-photo-profile_pqodkq.png';

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showDesc, setShowDesc] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
        dispatch(showErrorToast("Could not load product details."));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!token) {
      setLoginModalOpen(true);
      return;
    }

    try {
      setIsAdding(true);
      setErrorMessage("");

      await addProductToCart({
        productId: id,
        variant: selectedVariant || null,
        size: selectedSize || null,
        quantity,
      });

      dispatch(showSuccessToast(`Added ${quantity} item(s) to your cart!`));
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errMsg = error.response?.data?.message || "Failed to add product to cart.";
      setErrorMessage(errMsg);
      dispatch(showErrorToast(errMsg));
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
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

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Retro Spec Product Image */}
        <div className="bg-white border-2 border-black retro-shadow-lg p-3 relative">
          <div className="absolute top-0 right-6 bg-retro-coral text-white font-mono text-[10px] font-bold px-2.5 py-1 border-x-2 border-b-2 border-black uppercase tracking-wider z-10">
            ITEM_ID: #{product.id?.substring(0, 6)}
          </div>
          <div className="bg-gray-100 border-2 border-black overflow-hidden aspect-square flex items-center justify-center relative">
            <img
              src={product.photoUrl || DEFAULT_IMAGE}
              className="w-full h-full object-cover object-center contrast-105"
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE;
              }}
            />
            {product.categoryName && (
              <span className="absolute bottom-3 left-3 bg-black text-white font-mono text-xs font-bold uppercase px-3 py-1 border border-white">
                CLASSIFICATION: {product.categoryName}
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Purchase Form Box */}
        <div className="bg-white border-2 border-black retro-shadow-lg p-6 sm:p-8 flex flex-col space-y-6">
          <div>
            <div className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              AUTHENTIC RECORD // STUDIO PIECE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black uppercase tracking-tight mb-3">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t-2 border-black pb-3">
              <span className="font-mono text-3xl font-extrabold text-black">
                Rp{Number(product.price).toLocaleString('id-ID')}
              </span>
              <span className={`font-mono text-xs font-bold uppercase tracking-wider px-3 py-1 border-2 border-black ${
                isOutOfStock 
                  ? 'bg-retro-coral text-white' 
                  : product.stock <= 5 
                  ? 'bg-retro-amber text-black animate-pulse'
                  : 'bg-blue-100 text-retro-blue font-bold'
              }`}>
                {isOutOfStock 
                  ? 'STATUS: OUT OF STOCK' 
                  : product.stock <= 5 
                  ? `ALERT: ONLY ${product.stock} LEFT` 
                  : `IN STOCK // ${product.stock} UNITS`}
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
              <div className="flex items-center border-2 border-black overflow-hidden bg-white retro-shadow-sm">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-retro-amber text-black font-mono font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base"
                >
                  -
                </button>
                <span className="px-5 py-2 font-mono font-bold text-black bg-white min-w-[3rem] text-center text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stock || isOutOfStock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-retro-amber text-black font-mono font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base"
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
              className="retro-btn w-full py-4 px-6 text-sm font-mono font-bold uppercase tracking-widest bg-retro-blue hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                  ADDING RECORD...
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

      {/* Login Required Modal */}
      <ConfirmModal
        isOpen={loginModalOpen}
        title="Login Required"
        message="You need to sign in to your account first before adding items to your cart."
        confirmText="Go to Login"
        cancelText="Cancel"
        onConfirm={() => {
          setLoginModalOpen(false);
          navigate("/login");
        }}
        onCancel={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetailPage;

