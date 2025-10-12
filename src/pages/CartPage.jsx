import React, { useEffect, useState } from 'react';
import ProductCartCard from '../components/ProductCartCard';
import { getMyCart, getProductById } from '../services/api';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartResponse = await getMyCart();
        const fetchedCart = cartResponse.data.data;
        setCart(fetchedCart);

        const fetchedItem = fetchedCart.items;
        setItems(fetchedItem);

        const productIds = [
          ...new Set(fetchedItem.map((i) => i.productId)),
        ];

        const productList = [];
        for (const productId of productIds) {
          const productResponse = await getProductById(productId);
          productList.push(productResponse.data.data);
        }
        setProducts(productList);
      } catch (error) {
        console.log("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3 text-gray-800 uppercase">My Cart</h1>
      <div className="border-t-2 border-primary mb-5 w-full"></div>
      {items.map((item, index) => (
        <ProductCartCard key={item.id} item={item} product={products[index]}/>
      ))}
    </div>
  )
}

export default CartPage