"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaFire,
  FaChartLine,
  FaStar,
  FaGamepad,
  FaMusic,
  FaFilm,
  FaTv,
  FaBook,
  FaArrowUp,
  FaReddit,
  FaCoins,
  FaShieldAlt,
  FaBroadcastTower,
  FaUserFriends,
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
  FaTrophy,
  FaHeart,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { topics } from "@/mockData/topics";
import { useSelector } from "react-redux";
import { communityService } from "@/services/apiService";

const LeftComp = () => {
  const pathname = usePathname();
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [userCommunities, setUserCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Safely load user communities if user is logged in
  useEffect(() => {
    const fetchCommunities = async () => {
      if (!isLoggedIn) {
        setUserCommunities([]);
        return;
      }

      setLoadingCommunities(true);
      setError(null);

      try {
        // 3 saniye timeout ile API isteği yapılıyor
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(new Error("Topluluklar için istek zaman aşımına uğradı")),
            3000
          )
        );

        const responsePromise = communityService.getUserCommunities();

        // Race condition ile zaman aşımı kontrolü
        const response = await Promise.race([responsePromise, timeoutPromise]);

        // Response her zaman bir obje içinde communities array'i içerir
        // Eğer bu yapı yoksa boş bir array kullan
        const communities = response?.communities || [];

        setUserCommunities(communities);
      } catch (err) {
        console.error("Failed to load communities:", err);
        setError("Topluluklar yüklenemedi.");
        // We set an empty array to prevent UI errors
        setUserCommunities([]);
      } finally {
        setLoadingCommunities(false);
      }
    };

    fetchCommunities();
  }, [isLoggedIn]);

  const feeds = [
    { icon: <FaHome />, text: "Ana Sayfa", link: "/" },
    { icon: <FaFire />, text: "Popüler", link: "/popular" },
    {
      icon: <FaArrowUp />,
      text: "En İyi Topluluklar",
      link: "/topCommunities",
    },
    {
      icon: <FaHeart />,
      text: "Favoriler",
      disabled: true,
      disabledText: "Yakında aktif olacak",
    },
    {
      icon: <FaChartLine />,
      text: "Trendler",
      disabled: true,
      disabledText: "Yakında aktif olacak",
    },
    {
      icon: <FaGlobe />,
      text: "Keşfet",
      disabled: true,
      disabledText: "Yakında aktif olacak",
    },
  ];

  const resources = [
    {
      icon: <FaShieldAlt className="text-gray-400" />,
      text: "Premium",
      description: "Yakında aktif olacak",
      disabled: true,
    },
    {
      icon: <FaUserFriends className="text-gray-400" />,
      text: "Topluluklar",
      description: "Yakında aktif olacak",
      disabled: true,
    },
    {
      icon: <FaTrophy className="text-purple-500" />,
      text: "Başarılar",
      description: "Rozetler ve ödüller",
      link: "/achievements",
    },
  ];

  const displayedTopics = showAllTopics ? topics : topics.slice(0, 5);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white p-4 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
          <div className="flex items-center gap-2 text-red-500">
            <FaExclamationTriangle />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Feeds Section */}
      <div className="mb-6">
        <div className="space-y-1">
          {feeds.map((feed, index) =>
            feed.disabled ? (
              <motion.div
                key={index}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 cursor-not-allowed rounded-lg group relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-xl">{feed.icon}</span>
                <span className="text-sm font-medium">{feed.text}</span>
                <FaLock className="ml-auto text-xs" />
                <div className="absolute left-0 -top-8 w-full bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {feed.disabledText}
                </div>
              </motion.div>
            ) : (
              <Link href={feed.link} key={index}>
                <motion.div
                  className={`w-full flex items-center gap-3 px-4 py-2.5 ${
                    pathname === feed.link
                      ? "bg-accent/10 text-accent"
                      : "text-gray-700 hover:bg-gray-100"
                  } rounded-lg transition-all cursor-pointer`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-xl">{feed.icon}</span>
                  <span className="text-sm font-medium">{feed.text}</span>
                </motion.div>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Topics Section */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 px-4 mb-2 uppercase tracking-wider">
          Popüler Konular
        </h3>
        <div className="space-y-1">
          <AnimatePresence>
            {displayedTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/topic/${topic.name}`}>
                  <motion.div
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl" style={{ color: topic.color }}>
                      {topic.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{topic.name}</span>
                      <span className="text-xs text-gray-500 line-clamp-1">
                        {topic.description}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.button
            onClick={() => setShowAllTopics(!showAllTopics)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/5 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showAllTopics ? (
              <>
                Daha Az Göster <FaChevronUp />
              </>
            ) : (
              <>
                Tümünü Göster <FaChevronDown />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* User Communities Section - Only shown if logged in */}
      {isLoggedIn && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-500 px-4 mb-2 uppercase tracking-wider">
            Toplulukların
          </h3>
          <div className="space-y-1">
            {loadingCommunities ? (
              <div className="text-center py-2 text-sm text-gray-500">
                Yükleniyor...
              </div>
            ) : userCommunities.length > 0 ? (
              userCommunities.map((community) => (
                <Link href={`/community/${community.id}`} key={community.id}>
                  <motion.div
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs">
                      {community.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium truncate">
                        {community.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {community.member_count || 0} üye
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="text-center py-2 text-sm text-gray-500">
                Henüz bir topluluğa üye değilsin
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resources Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 px-4 mb-2 uppercase tracking-wider">
          Kaynaklar
        </h3>
        <div className="space-y-1">
          {resources.map((resource, index) =>
            resource.disabled ? (
              <motion.div
                key={index}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 cursor-not-allowed rounded-lg group relative"
                whileHover={{ x: 0 }}
              >
                <span className="text-xl">{resource.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{resource.text}</span>
                  <span className="text-xs">{resource.description}</span>
                </div>
                <FaLock className="ml-auto text-xs" />
              </motion.div>
            ) : (
              <Link href={resource.link} key={index}>
                <motion.div
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{resource.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{resource.text}</span>
                    <span className="text-xs text-gray-500">
                      {resource.description}
                    </span>
                  </div>
                </motion.div>
              </Link>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LeftComp;
