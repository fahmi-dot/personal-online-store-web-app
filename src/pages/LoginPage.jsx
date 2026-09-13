import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { login, fetchProfile } from '../redux/slices/authSlice';
import { showSuccessToast, showErrorToast } from '../redux/slices/toastSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      dispatch(showErrorToast("Please enter both email/username and password."));
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiLogin({ emailOrUsername, password });
      const { accessToken, refreshToken } = response.data.data;

      dispatch(login({ accessToken, refreshToken }));
      dispatch(fetchProfile());
      dispatch(showSuccessToast("Login successful! Welcome back."));

      navigate("/profile");
    } catch (error) {
      console.error("Error logging in:", error);
      const msg = error.response?.data?.message || "Invalid email/username or password.";
      dispatch(showErrorToast(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800 uppercase">Login</h2>
          <div className="border-t-2 border-primary mb-3 w-full"></div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="flex text-gray-700 text-lg font-bold mb-2" htmlFor="emailOrUsername">
                Email or username
                <p className="text-red-700">*</p>
              </label>
              <input
                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="emailOrUsername"
                type="text"
                value={emailOrUsername}
                placeholder="Enter your email or username"
                onChange={(e) => setEmailOrUsername(e.target.value)}
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
            <div className="text-gray-700 text-end mb-5">
              <Link to="/forgot-password"  className="text-blue-600 font-semibold hover:text-blue-800">
                Forgot password?
              </Link>
            </div>
            <div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase py-2.5 px-4 focus:outline-none transition-colors"
                type="submit"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800 uppercase">Register</h2>
          <div className="border-t-2 border-primary mb-3 w-full"></div>
          <p className="text-gray-700 text-lg mb-5">
            Registering for this site allows you to access your order status and history.
          </p>
          <Link to="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase py-2.5 px-6 focus:outline-none transition-colors">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
