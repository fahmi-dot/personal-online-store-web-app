import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t-4 border-black mt-16 bg-black text-white">
      {/* Amber accent strip */}
      <div className="bg-retro-amber border-b-2 border-black px-6 py-2 flex items-center gap-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black">
          PAHMI.CO // VINTAGE ARCHIVE // EST. 2025
        </span>
        <span className="flex-1 border-t border-black border-dashed"></span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black">
          QUALITY GUARANTEED
        </span>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand Column */}
          <div>
            <div className="inline-block border-2 border-retro-amber px-3 py-1 mb-4" style={{ boxShadow: '3px 3px 0px #ffde59' }}>
              <span className="font-extrabold text-2xl uppercase tracking-tight text-white">PAHMI.CO</span>
            </div>
            <p className="font-mono text-xs text-gray-400 leading-relaxed uppercase tracking-wide">
              Single-vendor online store.<br />
              Curated goods, honest prices.<br />
              Direct from the source.
            </p>
            <div className="flex gap-3 mt-5">
              {['FB', 'TW', 'IG'].map((s) => (
                <a
                  key={s}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] font-bold border-2 border-gray-600 text-gray-400 px-2.5 py-1 hover:border-retro-amber hover:text-retro-amber transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service Column */}
          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-retro-amber mb-4 border-b border-gray-700 pb-2">
              // CUSTOMER SERVICE
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Refund Policy', to: '/refund-policy' },
                { label: 'How To Order', to: '/how-to-order' },
                { label: 'FAQ', to: '/faq' },
                { label: 'Contact Us', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-mono text-xs text-gray-400 hover:text-retro-amber uppercase tracking-wide transition-colors flex items-center gap-2"
                  >
                    <span className="text-gray-600">→</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-retro-amber mb-4 border-b border-gray-700 pb-2">
              // QUICK NAVIGATION
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Store Home', to: '/' },
                { label: 'Product Catalog', to: '/products' },
                { label: 'My Cart', to: '/cart' },
                { label: 'My Profile', to: '/profile' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-mono text-xs text-gray-400 hover:text-retro-amber uppercase tracking-wide transition-colors flex items-center gap-2"
                  >
                    <span className="text-gray-600">→</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
            © 2025–{new Date().getFullYear()} PAHMI.CO // VINTAGE ARCHIVE // ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-retro-amber border border-gray-600 inline-block"></span>
            <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">Secure & Trusted Store</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
