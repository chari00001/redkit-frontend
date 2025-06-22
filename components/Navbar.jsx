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
  FaEnvelope,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Auth from "./Auth";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import ChatModal from "./Chat/ChatModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/features/authSlice";
import { searchService } from "@/services/apiService";
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

  // Yeni state'ler
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
      disabled: true,
    },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchResults(false);
    }
  };

  // Arama sonuçlarını getir
  const fetchSearchResults = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults(null);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchService.search(query);
      setSearchResults(results);
      setShowSearchResults(true);
      setIsSearching(false);
    } catch (error) {
      console.error("Arama hatası:", error);
      setIsSearching(false);
    }
  };

  // Arama terimi değiştiğinde arama sonuçlarını getir
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        fetchSearchResults(searchTerm);
      } else {
        setSearchResults(null);
        setShowSearchResults(false);
      }
    }, 300); // 300ms gecikme

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

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
      if (showSearchResults && !event.target.closest(".search-container")) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu, showNotifications, showSearchResults]);

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
          className={`flex-1 max-w-xl mx-4 relative search-container ${
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
              onFocus={() => {
                setSearchFocused(true);
                if (searchTerm.trim().length >= 2) {
                  setShowSearchResults(true);
                }
              }}
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

          {/* Arama Sonuçları Dropdown */}
          <AnimatePresence>
            {showSearchResults && searchResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 max-h-96 overflow-y-auto z-50"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    Aranıyor...
                  </div>
                ) : (
                  <div className="p-2">
                    {/* Kullanıcı Sonuçları */}
                    {searchResults.users && searchResults.users.length > 0 && (
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 px-3 py-1">
                          Kullanıcılar
                        </h3>
                        <div className="divide-y divide-gray-100">
                          {searchResults.users.slice(0, 3).map((user) => (
                            <Link
                              key={user.id}
                              href={`/user/${user.username}`}
                              onClick={() => setShowSearchResults(false)}
                            >
                              <div className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <FaUserCircle className="text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  {user.username}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Topluluk Sonuçları */}
                    {searchResults.communities &&
                      searchResults.communities.length > 0 && (
                        <div className="mb-3">
                          <h3 className="text-sm font-semibold text-gray-500 px-3 py-1">
                            Topluluklar
                          </h3>
                          <div className="divide-y divide-gray-100">
                            {searchResults.communities
                              .slice(0, 3)
                              .map((community) => (
                                <Link
                                  key={community.id}
                                  href={`/community/${community.name}`}
                                  onClick={() => setShowSearchResults(false)}
                                >
                                  <div className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                      <FaUsers className="text-gray-500" />
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium block text-gray-700">
                                        {community.name}
                                      </span>
                                      {community.description && (
                                        <span className="text-xs text-gray-500 truncate block max-w-xs">
                                          {community.description}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Gönderi Sonuçları */}
                    {searchResults.posts && searchResults.posts.length > 0 && (
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 px-3 py-1">
                          Gönderiler
                        </h3>
                        <div className="divide-y divide-gray-100">
                          {searchResults.posts.slice(0, 3).map((post) => (
                            <Link
                              key={post.id}
                              href={`/post/${post.id}`}
                              onClick={() => setShowSearchResults(false)}
                            >
                              <div className="px-3 py-2 hover:bg-gray-50">
                                <span className="text-sm font-medium line-clamp-1 text-gray-700">
                                  {post.title}
                                </span>
                                {post.content && (
                                  <span className="text-xs text-gray-500 line-clamp-1">
                                    {post.content}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hiç sonuç yoksa */}
                    {(!searchResults.users ||
                      searchResults.users.length === 0) &&
                      (!searchResults.communities ||
                        searchResults.communities.length === 0) &&
                      (!searchResults.posts ||
                        searchResults.posts.length === 0) && (
                        <div className="p-4 text-center text-gray-500">
                          Sonuç bulunamadı
                        </div>
                      )}

                    {/* Tüm Sonuçları Göster butonu */}
                    <div className="p-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          router.push(
                            `/search?q=${encodeURIComponent(searchTerm.trim())}`
                          );
                          setShowSearchResults(false);
                        }}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-900"
                      >
                        Tüm sonuçları göster
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
                aria-label="Sohbet"
              >
                <FaComments size={20} />
              </motion.button>

              <div className="relative notifications-menu">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-full relative"
                  aria-label="Bildirimler"
                >
                  <FaBell size={20} />
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs flex items-center justify-center h-4 w-4">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto"
                      style={{ maxHeight: "400px" }}
                    >
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-bold text-gray-800">Bildirimler</h3>
                        <p className="text-xs text-gray-500">
                          Okunmamış:{" "}
                          {notifications.filter((n) => !n.isRead).length}
                        </p>
                      </div>

                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Hiç bildiriminiz yok
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              whileHover={{ backgroundColor: "#f9fafb" }}
                              className={`p-3 cursor-pointer ${
                                !notification.isRead ? "bg-blue-50" : ""
                              }`}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                    notification.type === "reply"
                                      ? "bg-green-100 text-green-500"
                                      : notification.type === "upvote"
                                      ? "bg-orange-100 text-orange-500"
                                      : "bg-blue-100 text-blue-500"
                                  }`}
                                >
                                  {notification.type === "reply" ? (
                                    <FaComments size={16} />
                                  ) : notification.type === "upvote" ? (
                                    <FaFire size={16} />
                                  ) : (
                                    <FaEnvelope size={16} />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700">
                                    {notification.text}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      <div className="p-2 border-t border-gray-200">
                        <button className="text-xs text-center text-accent w-full py-1 hover:underline">
                          Tümünü Gör
                        </button>
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
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full"
                >
                  {currentUser?.profile_picture_url ? (
                    <img
                      src={currentUser.profile_picture_url}
                      alt={currentUser.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <FaUserCircle size={20} className="text-gray-600" />
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-60 bg-white rounded-lg shadow-lg z-10"
                    >
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          {currentUser?.profile_picture_url ? (
                            <img
                              src={currentUser.profile_picture_url}
                              alt={currentUser.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <FaUserCircle
                                size={24}
                                className="text-gray-600"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {currentUser?.username || "Kullanıcı"}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {currentUser?.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <motion.div
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="px-3 py-2 flex items-center gap-3 cursor-pointer"
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/profile");
                          }}
                        >
                          <FaUserCircle size={16} className="text-gray-600" />
                          <span className="text-sm text-gray-700">Profil</span>
                        </motion.div>

                        <motion.div
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="px-3 py-2 flex items-center gap-3 cursor-pointer"
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/settings");
                          }}
                        >
                          <FaCog size={16} className="text-gray-600" />
                          <span className="text-sm text-gray-700">Ayarlar</span>
                        </motion.div>

                        <motion.div
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="px-3 py-2 flex items-center gap-3 cursor-pointer"
                          onClick={() => {
                            setShowProfileMenu(false);
                            router.push("/premium");
                          }}
                        >
                          <FaCrown size={16} className="text-yellow-500" />
                          <span className="text-sm text-gray-700">
                            RedKit Premium
                          </span>
                        </motion.div>

                        <div className="my-1 border-t border-gray-200"></div>

                        <motion.div
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          className="px-3 py-2 flex items-center gap-3 cursor-pointer"
                          onClick={() => {
                            dispatch(logoutUser());
                            setShowProfileMenu(false);
                            router.push("/");
                          }}
                        >
                          <FaSignOutAlt size={16} className="text-red-500" />
                          <span className="text-sm text-red-500">
                            Çıkış Yap
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setAuthMode("login");
                  setShowAuth(true);
                }}
                className="px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium hidden sm:block"
              >
                Giriş Yap
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setAuthMode("register");
                  setShowAuth(true);
                }}
                className="px-4 py-1.5 rounded-full bg-accent text-white font-medium hidden sm:block"
              >
                Kaydol
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setAuthMode("login");
                  setShowAuth(true);
                }}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full sm:hidden"
              >
                <FaUserCircle size={20} />
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
