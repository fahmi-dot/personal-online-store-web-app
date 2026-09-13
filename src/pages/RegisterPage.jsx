import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../redux/slices/toastSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      dispatch(showErrorToast("Please fill in all required fields."));
      return;
    }

    try {
      setSubmitting(true);
      await register({ username, email, password });
      dispatch(showSuccessToast("Account created successfully! Please sign in."));
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      const msg = error.response?.data?.message || "Registration failed. Username or email may already be taken.";
      dispatch(showErrorToast(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800 uppercase">Welcome to Pahmi.co</h2>
          <div className="border-t-2 border-primary mb-3 w-full"></div>
          
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800 uppercase">Register</h2>
          <div className="border-t-2 border-primary mb-3 w-full"></div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="flex text-gray-700 text-lg font-bold mb-2" htmlFor="username">
                Username
                <p className="text-red-700">*</p>
              </label>
              <input
                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUserame(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="flex text-gray-700 text-lg font-bold mb-2" htmlFor="email">
                Email
                <p className="text-red-700">*</p>
              </label>
              <input
                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="flex text-gray-700 text-lg font-bold mb-2" htmlFor="password">
                Password
                <p className="text-red-700">*</p>
              </label>
              <input
                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                placeholder="******************"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-gray-700 text-center mb-5">
              Have an account?
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800 px-2">
                Log in
              </Link>
            </div>
            <div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 uppercase focus:outline-none transition-colors"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
