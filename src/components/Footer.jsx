import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Find Us On</h3>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/refund-policy" className="hover:text-accent">Refund Policy</Link></li>
              <li><Link to="/how-to-order" className="hover:text-accent">How To Order</Link></li>
              <li><Link to="/faq" className="hover:text-accent">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Pahmi.co</h3>
            <p className="text-gray-400">
              Copyright © 2025 - {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
