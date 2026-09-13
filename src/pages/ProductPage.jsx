import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeletons';
import { showErrorToast } from '../redux/slices/toastSlice';
import { getAllProducts, getAllCategories } from '../services/api';

const ProductPage = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 12,
        sortBy,
        sortDirection,
      };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await getAllProducts(params);
      setProducts(response.data.data || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
      dispatch(showErrorToast(error.response?.data?.message || "Failed to load products. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortDirection, selectedCategory, searchQuery, dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(0);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'price_asc') {
      setSortBy('price');
      setSortDirection('asc');
    } else if (value === 'price_desc') {
      setSortBy('price');
      setSortDirection('desc');
    } else if (value === 'name_desc') {
      setSortBy('name');
      setSortDirection('desc');
    } else {
      setSortBy('name');
      setSortDirection('asc');
    }
    setPage(0);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
          Product Catalog
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Discover our exclusive collection of quality goods
        </p>
      </div>

      <div className="border-t border-gray-200 mb-6"></div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors uppercase tracking-wider"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
              Sort By:
            </span>
            <select
              value={sortBy === 'price' ? `price_${sortDirection}` : sortBy === 'name' && sortDirection === 'desc' ? 'name_desc' : 'name_asc'}
              onChange={handleSortChange}
              className="text-xs font-semibold border border-gray-300 px-2 py-1.5 bg-white text-gray-700 focus:outline-none"
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
              selectedCategory === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm my-8">
          <p className="text-lg font-bold text-gray-800 mb-2">No Products Found</p>
          <p className="text-gray-500 text-sm mb-4">
            Try adjusting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('');
              setSearchQuery('');
              setPage(0);
            }}
            className="text-xs font-semibold text-blue-600 hover:underline uppercase"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12 pt-6 border-t border-gray-200">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &larr; Previous
              </button>
              <span className="text-xs font-semibold text-gray-700">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              <button
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;