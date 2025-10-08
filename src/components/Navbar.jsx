import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary shadow-md">
      <div className="py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-4xl font-bold text-secondary uppercase">
              Pahmi.co
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-5">
              <Link
                to="/"
                className="text-secondary hover:text-accent px-3 py-2 text-sm font-medium uppercase"
              >
                Home
              </Link>
              <Link
                to="/product"
                className="text-secondary hover:text-accent px-3 py-2 text-sm font-medium uppercase"
              >
                Product
              </Link>
              <Link
                to="/gallery"
                className="text-secondary hover:text-accent px-3 py-2 text-sm font-medium uppercase"
              >
                Gallery
              </Link>
              <Link
                to="/about"
                className="text-secondary hover:text-accent px-3 py-2 text-sm font-medium uppercase"
              >
                About
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="text-secondary hover:text-accent px-3 py-2 text-sm font-medium uppercase"
                >
                  {user ? `Hi, ${user.username}` : 'Profile'}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-secondary hover:text-accent px-3 py-2 text-sm font-medium uppercase"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
