import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { login, fetchProfile } from '../redux/slices/authSlice';
import { showSuccessToast, showErrorToast } from '../redux/slices/toastSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      dispatch(showErrorToast('Please enter both email/username and password.'));
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiLogin({ emailOrUsername, password });
      const { accessToken, refreshToken } = response.data.data;

      dispatch(login({ accessToken, refreshToken }));
      dispatch(fetchProfile());
      dispatch(showSuccessToast('Login successful! Welcome back.'));

      navigate('/profile');
    } catch (error) {
      console.error('Error logging in:', error);
      const msg = error.response?.data?.message || 'Invalid email/username or password.';
      dispatch(showErrorToast(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-black retro-shadow-lg">

        {/* Left Panel — Branding */}
        <div className="bg-retro-amber border-r-2 border-black p-8 flex flex-col justify-between">
          <div>
            {/* Tag */}
            <div className="inline-block bg-black text-retro-amber font-mono text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-6">
              // MEMBER ACCESS
            </div>

            <h1 className="font-extrabold text-4xl uppercase tracking-tight text-black leading-none mb-4">
              SIGN IN<br />TO YOUR<br />ACCOUNT
            </h1>

            <p className="font-mono text-xs text-black/70 uppercase tracking-wide leading-relaxed">
              Access your order history,<br />
              saved addresses, and<br />
              manage your profile.
            </p>
          </div>

          <div className="mt-8 border-t-2 border-black pt-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-3">
              No account yet?
            </p>
            <Link
              to="/register"
              className="retro-btn inline-block bg-black text-retro-amber font-mono font-bold text-xs uppercase tracking-widest px-5 py-2.5"
            >
              Register Now →
            </Link>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="bg-white p-8">
          <div className="mb-7">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              FORM_ID: AUTH-001
            </div>
            <h2 className="font-extrabold text-2xl uppercase tracking-tight text-black">
              SIGN IN // CREDENTIALS
            </h2>
            <div className="border-t-2 border-black mt-2 w-16"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or Username */}
            <div>
              <label
                htmlFor="emailOrUsername"
                className="block font-mono text-[11px] font-bold uppercase tracking-widest text-black mb-2"
              >
                Email or Username <span className="text-retro-coral">*</span>
              </label>
              <input
                id="emailOrUsername"
                type="text"
                value={emailOrUsername}
                placeholder="your@email.com or username"
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full border-2 border-black px-4 py-3 font-mono text-sm text-black bg-white focus:outline-none focus:bg-retro-amber/10 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block font-mono text-[11px] font-bold uppercase tracking-widest text-black mb-2"
              >
                Password <span className="text-retro-coral">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black px-4 py-3 font-mono text-sm text-black bg-white focus:outline-none focus:bg-retro-amber/10 transition-colors"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="font-mono text-[11px] font-bold uppercase tracking-widest text-retro-blue hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="retro-btn w-full bg-black text-white font-mono font-bold text-sm uppercase tracking-widest py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'SIGNING IN...' : 'SIGN IN →'}
            </button>
          </form>

          <div className="mt-6 border-t-2 border-dashed border-gray-200 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-retro-blue font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
