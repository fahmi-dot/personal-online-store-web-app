import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dpqk0grzl/image/upload/v1751614337/default-photo-profile_pqodkq.png';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border-2 border-black retro-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:retro-shadow-lg transition-all duration-150 flex flex-col group relative">
      {/* Retro Tape / Badge Accent */}
      <div className="absolute -top-2 -right-2 z-10 bg-retro-amber text-black border border-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider transform rotate-3 retro-shadow-sm">
        STOCK: {product.stock > 0 ? product.stock : 'NONE'}
      </div>

      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100 block border-b-2 border-black">
        <img
          className="w-full h-full object-cover object-center grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
          src={product.photoUrl || DEFAULT_IMAGE}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        {product.categoryName && (
          <span className="absolute bottom-2 left-2 bg-black text-white font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-white">
            CAT//{product.categoryName}
          </span>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-4">
            <span className="bg-retro-coral text-white font-mono font-bold text-xs uppercase px-3 py-1 border-2 border-white transform -rotate-6">
              SOLD OUT / ARCHIVED
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between bg-retro-card">
        <div>
          <h3 className="font-extrabold uppercase text-gray-900 text-sm sm:text-base tracking-tight mb-1 line-clamp-1 group-hover:text-retro-blue transition-colors">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="text-xs font-mono text-gray-600 line-clamp-2 mb-3">
            {product.description || "Authentic catalog archive item."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-gray-300 mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase text-gray-500">Price</span>
            <span className="font-mono font-extrabold text-base sm:text-lg text-black">
              Rp{Number(product.price).toLocaleString('id-ID')}
            </span>
          </div>
          <Link
            to={`/product/${product.id}`}
            className="retro-btn bg-retro-blue text-white hover:bg-blue-700 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1"
          >
            Inspect &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
