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
      dispatch(showErrorToast('Please fill in all required fields.'));
      return;
    }

    try {
      setSubmitting(true);
      await register({ username, email, password });
      dispatch(showSuccessToast('Account created successfully! Please sign in.'));
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      const msg = error.response?.data?.message || 'Registration failed. Username or email may already be taken.';
      dispatch(showErrorToast(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-black retro-shadow-lg">

        {/* Left Panel — Form */}
        <div className="bg-white p-8">
          <div className="mb-7">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              FORM_ID: REG-001
            </div>
            <h2 className="font-extrabold text-2xl uppercase tracking-tight text-black">
              NEW MEMBER APPLICATION
            </h2>
            <div className="border-t-2 border-black mt-2 w-16"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block font-mono text-[11px] font-bold uppercase tracking-widest text-black mb-2"
              >
                Username <span className="text-retro-coral">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                placeholder="choose a unique username"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-black px-4 py-3 font-mono text-sm text-black bg-white focus:outline-none focus:bg-retro-amber/10 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[11px] font-bold uppercase tracking-widest text-black mb-2"
              >
                Email Address <span className="text-retro-coral">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="your@email.com"
                onChange={(e) => setEmail(e.target.value)}
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

            {/* Terms notice */}
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wide leading-relaxed">
              By registering you agree to our store policies. Your data is stored securely.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="retro-btn w-full bg-black text-white font-mono font-bold text-sm uppercase tracking-widest py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
            </button>
          </form>

          <div className="mt-6 border-t-2 border-dashed border-gray-200 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 text-center">
              Already a member?{' '}
              <Link to="/login" className="text-retro-blue font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel — Branding */}
        <div className="bg-retro-coral border-l-2 border-black p-8 flex flex-col justify-between">
          <div>
            {/* Tag */}
            <div className="inline-block bg-black text-retro-amber font-mono text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-6">
              // JOIN THE ARCHIVE
            </div>

            <h1 className="font-extrabold text-4xl uppercase tracking-tight text-white leading-none mb-4">
              BECOME A<br />MEMBER<br />TODAY
            </h1>

            <p className="font-mono text-xs text-white/80 uppercase tracking-wide leading-relaxed">
              Track your orders,<br />
              save delivery addresses,<br />
              and shop with ease.
            </p>

            {/* Feature List */}
            <ul className="mt-6 space-y-2">
              {[
                'Order history & tracking',
                'Multiple delivery addresses',
                'Exclusive member access',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white bg-retro-amber inline-block shrink-0"></span>
                  <span className="font-mono text-[11px] text-white uppercase tracking-wide">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t-2 border-white/30 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-3">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="retro-btn inline-block bg-black text-retro-amber font-mono font-bold text-xs uppercase tracking-widest px-5 py-2.5"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
