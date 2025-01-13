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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Auth from "./Auth";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import ChatModal from "./Chat/ChatModal";

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

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
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Dark mode mantığı burada implement edilecek
  };

  const handleNotificationClick = (notification) => {
    // Bildirim tıklama mantığı
    console.log("Clicked notification:", notification);
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
              <Link key={link.href} href={link.href}>
                <motion.div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                    pathname === link.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Redit'te Ara..."
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <FaSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/submit")}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
            title="Gönderi Oluştur"
          >
            <FaPlus size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowChat(true)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
            title="Mesajlar"
          >
            <FaComments size={20} />
          </motion.button>

          <div className="relative notifications-menu">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
              title="Bildirimler"
            >
              <div className="relative">
                <FaBell size={20} />
                {mockNotifications.some((n) => !n.isRead) && (
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
                    <h3 className="font-semibold text-gray-900">Bildirimler</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <motion.button
                        key={notification.id}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full px-4 py-3 flex items-start gap-3 ${
                          !notification.isRead ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            !notification.isRead ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1 text-left">
                          <p className="text-gray-800">{notification.text}</p>
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
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
              title="Profil"
            >
              <FaUserCircle size={20} />
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

                  <motion.button
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    onClick={toggleDarkMode}
                    className="w-full px-4 py-2 flex items-center gap-3"
                  >
                    <FaMoon size={20} className="text-gray-500" />
                    <span className="text-gray-700">Karanlık Mod</span>
                  </motion.button>

                  <Link href="/settings">
                    <motion.div
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className="px-4 py-2 flex items-center gap-3"
                    >
                      <FaCog size={20} className="text-gray-500" />
                      <span className="text-gray-700">Ayarlar</span>
                    </motion.div>
                  </Link>

                  <Link href="/premium">
                    <motion.div
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className="px-4 py-2 flex items-center gap-3"
                    >
                      <FaCrown size={20} className="text-gray-500" />
                      <span className="text-gray-700">Premium</span>
                    </motion.div>
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  <motion.button
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    onClick={() => {
                      // Çıkış yapma mantığı
                      console.log("Logging out...");
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
        </div>
      </div>

      <Auth
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode={authMode}
      />

      <ChatModal show={showChat} onClose={() => setShowChat(false)} />
    </nav>
  );
};

export default Navbar;
