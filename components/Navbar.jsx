"use client";

import React, { useState, useEffect } from "react";
import {
  FaReddit,
  FaSearch,
  FaPlus,
  FaComments,
  FaBell,
  FaTrophy,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaInfoCircle,
  FaTshirt,
  FaMedal,
  FaMoon,
  FaAd,
  FaCrown,
  FaArrowLeft,
  FaHome,
  FaFire,
  FaChartLine,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Auth from "./Auth";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import ChatModal from "./Chat/ChatModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/features/authSlice";
import Image from "next/image";

const mockNotifications = [
  {
    id: 1,
    type: "reply",
    text: "Gönderinize yeni bir yanıt geldi",
    time: "2d önce",
    isRead: false,
  },
  {
    id: 2,
    type: "upvote",
    text: "Gönderiniz 100 beğeni aldı!",
    time: "1s önce",
    isRead: true,
  },
  {
    id: 3,
    type: "message",
    text: "user123'den yeni mesaj",
    time: "3s önce",
    isRead: false,
  },
];

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState(mockNotifications);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isLoggedIn, currentUser } = useSelector((state) => state.auth);

  const navLinks = [
    {
      icon: FaHome,
      label: "Ana Sayfa",
      href: "/",
    },
    {
      icon: FaFire,
      label: "Popüler",
      href: "/popular",
    },
    {
      icon: FaChartLine,
      label: "Trendler",
      href: "/trending",
      disabled: true
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Dark mode mantığı burada implement edilecek
  };

  const handleNotificationClick = (notification) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
  };

  useEffect(() => {
    // Click dışında menüleri kapat
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest(".profile-menu")) {
        setShowProfileMenu(false);
      }
      if (showNotifications && !event.target.closest(".notifications-menu")) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu, showNotifications]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2 text-[#D20103]">
                <img src="/logo.png" alt="RedKit Logo" className="w-8" />
                <span className="text-xl font-bold hidden sm:block">
                  RedKit
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 text-[#D20103]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/logo.png" alt="RedKit Logo" className="w-8" />
              <span className="text-xl font-bold hidden sm:block">RedKit</span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.disabled ? "#" : link.href}>
                <motion.div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                    pathname === link.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${link.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={link.disabled ? {} : { scale: 1.05 }}
                  whileTap={link.disabled ? {} : { scale: 0.95 }}
                >
                  <link.icon size={18} />
                  <span className="text-sm font-medium">{link.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className={`flex-1 max-w-xl mx-4 relative ${
            searchFocused ? "z-20" : ""
          }`}
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Topluluk, kullanıcı veya gönderi ara..."
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all text-black"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <FaSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/createPost")}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
            aria-label="Gönderi Oluştur"
          >
            <FaPlus size={20} />
          </motion.button>

          {isLoggedIn ? (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push("/achievements")}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full hidden md:flex"
                aria-label="Başarılar"
              >
                <FaTrophy size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowChat(true)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                aria-label="Mesajlar"
              >
                <FaComments size={20} />
              </motion.button>

              <div className="relative notifications-menu">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                  aria-label="Bildirimler"
                >
                  <div className="relative">
                    <FaBell size={20} />
                    {notifications.some((n) => !n.isRead) && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 text-sm"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">
                          Bildirimler
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <motion.button
                            key={notification.id}
                            whileHover={{ backgroundColor: "#f9fafb" }}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className={`w-full px-4 py-3 flex items-start gap-3 ${
                              !notification.isRead ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <span
                              className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                                !notification.isRead
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1 text-left">
                              <p className="text-gray-800">
                                {notification.text}
                              </p>
                              <span className="text-xs text-gray-500">
                                {notification.time}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative profile-menu">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-full flex items-center gap-2"
                  aria-label="Profil"
                >
                  {currentUser?.profile_picture_url ? (
                    <img
                      src={currentUser.profile_picture_url}
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={20} />
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {currentUser?.username}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2"
                    >
                      <Link href="/profile">
                        <motion.div
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="px-4 py-2 flex items-center gap-3"
                        >
                          <FaUserCircle size={20} className="text-gray-500" />
                          <span className="text-gray-700">Profil</span>
                        </motion.div>
                      </Link>

                      <Link href="/achievements">
                        <motion.div
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="px-4 py-2 flex items-center gap-3"
                        >
                          <FaTrophy size={20} className="text-gray-500" />
                          <span className="text-gray-700">Başarılar</span>
                        </motion.div>
                      </Link>

                      <div className="w-full px-4 py-2 flex items-center gap-3 cursor-not-allowed opacity-50">
                        <FaMoon size={20} className="text-gray-500" />
                        <span className="text-gray-700">Karanlık Mod</span>
                      </div>

                      <Link href="/settings">
                        <motion.div
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="px-4 py-2 flex items-center gap-3"
                        >
                          <FaCog size={20} className="text-gray-500" />
                          <span className="text-gray-700">Ayarlar</span>
                        </motion.div>
                      </Link>

                      <div className="px-4 py-2 flex items-center gap-3 cursor-not-allowed opacity-50">
                        <FaCrown size={20} className="text-gray-500" />
                        <span className="text-gray-700">Premium</span>
                      </div>

                      <div className="border-t border-gray-100 my-1" />

                      <motion.button
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        onClick={() => {
                          dispatch(logoutUser());
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2 flex items-center gap-3 text-red-600"
                      >
                        <FaSignOutAlt size={20} />
                        <span>Çıkış Yap</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <motion.button
                className="px-6 py-1.5 text-[#D20103] hover:bg-gray-100 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthMode("login");
                  setShowAuth(true);
                }}
              >
                Giriş Yap
              </motion.button>
              <motion.button
                className="px-6 py-1.5 bg-[#D20103] text-white rounded-full hover:bg-[#D20103]/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthMode("register");
                  setShowAuth(true);
                }}
              >
                Kayıt Ol
              </motion.button>
            </>
          )}
        </div>
      </div>

      {mounted && (
        <>
          <Auth
            isOpen={showAuth}
            onClose={() => setShowAuth(false)}
            initialMode={authMode}
          />
          <ChatModal show={showChat} onClose={() => setShowChat(false)} />
        </>
      )}
    </nav>
  );
};

export default Navbar;
