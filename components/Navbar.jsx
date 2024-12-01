"use client"

import React, { useState } from 'react';
import { FaReddit, FaSearch, FaPlus, FaComments, FaBell, FaTrophy, FaUserCircle, FaCog, FaSignOutAlt, FaUsers, FaInfoCircle, FaTshirt, FaMedal, FaMoon, FaAd, FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Auth from './Auth';
import Link from 'next/link';

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const mockNotifications = [
    { id: 1, text: "Someone replied to your post", time: "2m ago" },
    { id: 2, text: "Your post received 100 upvotes!", time: "1h ago" },
    { id: 3, text: "New message from user123", time: "3h ago" }
  ];

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

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          <motion.button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Create Post"
          >
            <FaPlus size={20} />
          </motion.button>

          <motion.button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChat(!showChat)}
            title="Chat"
          >
            <FaComments size={20} />
          </motion.button>

          <div className="relative">
            <motion.button
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <FaBell size={20} />
            </motion.button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2">
                {mockNotifications.map(notification => (
                  <div key={notification.id} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <motion.button
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title="Profile"
            >
              <FaUserCircle size={20} />
            </motion.button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-black">
                  <FaUserCircle size={16} />
                  <span>View Profile</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-black">
                  <FaTshirt size={16} />
                  <span>Edit Avatar</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-black">
                  <FaTrophy size={16} />
                  <span>Achievements</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-black">
                  <FaMedal size={16} />
                  <span>Contributor Program</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-black">
                  <FaMoon size={16} />
                  <span>Dark Mode</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-black">
                  <FaSignOutAlt size={16} />
                  <span>Log Out</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-black">
                  <FaAd size={16} />
                  <span>Advertise on Reddit</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-black">
                  <FaCog size={16} />
                  <span>Settings</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-black">
                  <FaCrown size={16} />
                  <span>Premium</span>
                </button>
              </div>
            )}
          </div>

          <motion.button
            className="px-6 py-1.5 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setAuthMode('login');
              setShowAuth(true);
            }}
          >
            Log In
          </motion.button>
          <motion.button
            className="px-6 py-1.5 bg-accent text-white rounded-full hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setAuthMode('register');
              setShowAuth(true);
            }}
          >
            Sign Up
          </motion.button>
        </div>
      </div>

      <Auth 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode={authMode}
      />

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Messages</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-500 text-center">No messages yet</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;