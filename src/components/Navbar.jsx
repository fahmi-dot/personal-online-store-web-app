import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { user, token } = useSelector((state) => ( state.auth ));
  const isAuthenticated = !!token;
  const role = user?.role || (Array.isArray(user?.roles) ? user?.roles[0] : null);
  const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40">
      {/* Vintage Announcement Strip */}
      <div className="bg-retro-amber border-b-2 border-black text-black text-[11px] font-mono font-bold py-1 px-4 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
          <span>★ OFFICIAL VINTAGE ARCHIVE</span>
          <span>•</span>
          <span>FREE DOMESTIC SHIPPING ON ALL ORDERS</span>
          <span>•</span>
          <span>AUTHENTIC GOODS ONLY</span>
          <span>•</span>
          <span>EST. 2026</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest pl-4">
          <span className="w-2 h-2 rounded-full bg-retro-blue animate-ping"></span>
          <span>STORE STATUS: ONLINE</span>
        </div>
      </div>

      <nav className="bg-white border-b-2 border-black px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
          {/* Retro Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tighter text-black flex items-center gap-1 group"
            >
              <span className="bg-black text-white px-2 py-0.5 group-hover:bg-retro-blue transition-colors">
                PAHMI
              </span>
              <span className="text-black">.CO</span>
            </Link>
            <span className="hidden md:inline-block text-[10px] font-mono font-bold bg-retro-amber border border-black px-1.5 py-0.5 transform -rotate-3">
              ARCHIVE
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 font-mono text-xs font-bold uppercase">
            <Link
              to="/"
              className="px-3 py-1.5 text-black hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
            >
              Home
            </Link>
            <Link
              to="/product"
              className="px-3 py-1.5 text-black hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
            >
              Catalog
            </Link>
            <Link
              to="/gallery"
              className="px-3 py-1.5 text-black hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
            >
              Gallery
            </Link>
            <Link
              to="/about"
              className="px-3 py-1.5 text-black hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
            >
              About
            </Link>
            <Link
              to="/cart"
              className="px-3 py-1.5 text-black hover:bg-retro-amber transition-all border border-black retro-shadow-sm flex items-center gap-1.5"
            >
              <span>Cart</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l-2 border-black">
                <Link
                  to="/profile"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black border border-black retro-shadow-sm"
                >
                  {user ? `User: ${user.username}` : 'Profile'}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 bg-retro-blue text-white hover:bg-blue-700 border border-black retro-shadow-sm transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 bg-black text-white hover:bg-retro-coral transition-colors border border-black retro-shadow-sm ml-2"
              >
                Sign In &rarr;
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
