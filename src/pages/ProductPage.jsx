import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/api';
import { getCategoryById } from '../services/api';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
  const fetchData = async () => {
    try {
      const productResponse = await getAllProducts();
      const fecthedProduct = productResponse.data.data;
      setProducts(fecthedProduct);

      const categoryIds = [
        ...new Set(fecthedProduct.map((p) => p.categoryId)),
      ];

      const categoryList = {};
      for (const categoryId of categoryIds) {
        const categoryResponse = await getCategoryById(categoryId);
        categoryList[categoryId] = categoryResponse.data.data.name;
      }
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchData();
}, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {Object.entries(categories).map(([id, name]) => (
      <div key={id} className="mb-12">
        <h2 className="text-3xl font-bold mb-3 uppercase">{name}</h2>
        <div className="border-t-2 border-primary mb-5 w-full"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products
            .filter((product) => product.categoryId === id)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    ))}
  </div>
  );
}

export default ProductPage