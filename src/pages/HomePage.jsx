import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllProducts({ size: 8 });
        setProducts(response.data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen pb-16">
      {/* Retro Poster Hero Section */}
      <section className="border-b-2 border-black bg-retro-amber py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="border-2 border-black bg-white p-6 sm:p-12 retro-shadow-lg relative">
            {/* Corner Badge */}
            <div className="absolute -top-3 -left-3 bg-retro-coral text-white font-mono text-xs font-bold px-3 py-1 border-2 border-black transform -rotate-2 retro-shadow-sm">
              VOL. 2026 // EDITION 01
            </div>

            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest bg-gray-100 border border-black px-2.5 py-1">
                ★ AUTHENTIC SINGLE-VENDOR GOODS ★
              </span>

              <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-black leading-none">
                CURATED FOR <span className="bg-retro-amber px-2 border-b-4 border-black">LIFESTYLE</span>
              </h1>

              <p className="font-mono text-xs sm:text-sm text-gray-700 max-w-lg mx-auto leading-relaxed">
                Direct-from-studio personal archive. Handpicked streetwear, curated artifacts, and high-quality accessories delivered straight to your door.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link
                  to="/product"
                  className="retro-btn bg-black text-white hover:bg-retro-blue px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-widest"
                >
                  Explore Catalog &rarr;
                </Link>
                <Link
                  to="/about"
                  className="retro-btn bg-white text-black hover:bg-gray-100 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-widest"
                >
                  Read Manifesto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-wrap items-end justify-between border-b-2 border-black pb-4 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-retro-coral border border-black"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-600">
                LATEST RELEASES
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
              FEATURED ARCHIVE
            </h2>
          </div>
          <Link
            to="/product"
            className="retro-btn bg-white text-black hover:bg-retro-amber px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <span>View All Stock</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="border-t border-gray-200 mb-8"></div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-500 font-medium">Loading featured items...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

