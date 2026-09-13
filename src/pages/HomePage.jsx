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
    <div>
      {/* Hero Banner */}
      <section className="bg-gray-900 text-white py-16 sm:py-24 mb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 block">
            Exclusive Single-Vendor Collection
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Curated Quality for Your Lifestyle
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Discover our handpicked catalog of authentic products crafted and delivered directly to your doorstep.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/product"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 text-xs uppercase tracking-wider transition-colors"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Our latest and most popular items</p>
          </div>
          <Link
            to="/product"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
          >
            View All &rarr;
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

