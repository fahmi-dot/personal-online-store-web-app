import React, { useState, useEffect, useContext } from 'react';
import { getMyOrders } from '../services/api';
import AuthContext from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (isAuthenticated) {
        try {
          const response = await getMyOrders();
          setOrders(response.data.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white shadow-md p-6">
            {user ? (
              <div>
                <p className="text-gray-700"><strong>Name: </strong> {user.username}</p>
                <p className="text-gray-700"><strong>Email: </strong> {user.email}</p>
                <button
                  onClick={handleLogout}
                  className="bg-accent hover:bg-red-700 mt-5 text-white font-bold uppercase py-2 px-4 focus:outline-none focus:shadow-outline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-3 text-gray-800 uppercase">My Orders</h1>
          <div className="border-t-2 border-primary mb-5 w-full"></div>
          <div className="bg-white shadow-md overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{order.id}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">${order.totalPrice}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-green-200 opacity-50"
                          ></span>
                          <span className="relative">{order.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;