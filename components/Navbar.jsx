"use client"

import React, { useState } from 'react';
import { FaReddit, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Logo Section */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/logo.png" alt="RedKit Logo" className='w-8' />
          <span className="text-xl font-bold text-gray-800">RedKit</span>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          className={`relative max-w-xl w-full mx-4 ${searchFocused ? 'flex-grow' : ''}`}
          animate={{ width: searchFocused ? '100%' : '40%' }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </motion.div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          <motion.button
            className="px-6 py-1.5 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </motion.button>
          <motion.button
            className="px-6 py-1.5 bg-accent text-white rounded-full hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;