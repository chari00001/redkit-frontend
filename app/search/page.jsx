"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { communities } from "@/mockData/communities";
import { users } from "@/mockData/users";
import { posts } from "@/mockData/posts";
import {
  FaUsers,
  FaUser,
  FaNewspaper,
  FaSearch,
  FaHashtag,
} from "react-icons/fa";
import PostCard from "@/components/PostComponents/PostCard";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

const SearchResults = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const [activeTab, setActiveTab] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredCommunities = communities.filter(
    (community) =>
      community.name?.toLowerCase().includes(searchQuery) ||
      community.description?.toLowerCase().includes(searchQuery) ||
      community.tags?.some((tag) => tag.toLowerCase().includes(searchQuery))
  );

  const filteredUsers = users.filter((user) => {
    const username = user.username?.toLowerCase() || "";
    const displayName = user.display_name?.toLowerCase() || "";
    const fullName = user.full_name?.toLowerCase() || "";

    return (
      username.includes(searchQuery) ||
      displayName.includes(searchQuery) ||
      fullName.includes(searchQuery)
    );
  });

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery) ||
      post.content?.toLowerCase().includes(searchQuery) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery))
  );

  const resultContent = (
    <div className="space-y-6">
      {activeTab === "all" && (
        <>
          {filteredCommunities.length > 0 && (
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaUsers className="text-accent" />
                Topluluklar
              </h2>
              <div className="space-y-4">
                {filteredCommunities.slice(0, 3).map((community) => (
                  <motion.div
                    key={community.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Link
                      href={`/community/${encodeURIComponent(
                        community.name.toLowerCase()
                      )}`}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="text-2xl text-accent bg-accent/10 p-3 rounded-xl">
                        <FaUsers />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {community.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          {community.member_count?.toLocaleString() || 0} üye
                        </p>
                        <p className="text-sm text-gray-600">
                          {community.description}
                        </p>
                        {community.tags && community.tags.length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {community.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1"
                              >
                                <FaHashtag
                                  className="text-gray-400"
                                  size={10}
                                />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {filteredCommunities.length > 3 && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setActiveTab("communities")}
                    className="w-full text-center text-accent hover:text-accent-dark py-2"
                  >
                    {filteredCommunities.length - 3} topluluk daha göster
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {filteredUsers.length > 0 && (
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaUser className="text-accent" />
                Kullanıcılar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.slice(0, 4).map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={`/user/${user.username}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <img
                        src={
                          user.profile_picture_url ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4"
                        }
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {user.display_name || user.username}
                        </h3>
                        <p className="text-sm text-gray-500">
                          u/{user.username}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {filteredUsers.length > 4 && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveTab("users")}
                  className="w-full text-center text-accent hover:text-accent-dark py-2 mt-4"
                >
                  {filteredUsers.length - 4} kullanıcı daha göster
                </motion.button>
              )}
            </motion.div>
          )}

          {filteredPosts.length > 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaNewspaper className="text-accent" />
                Gönderiler
              </h2>
              {filteredPosts.slice(0, 3).map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <PostCard {...post} />
                </motion.div>
              ))}
              {filteredPosts.length > 3 && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveTab("posts")}
                  className="w-full text-center text-accent hover:text-accent-dark py-2"
                >
                  {filteredPosts.length - 3} gönderi daha göster
                </motion.button>
              )}
            </motion.div>
          )}
        </>
      )}

      {activeTab === "communities" && filteredCommunities.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FaUsers className="text-accent" />
            Topluluklar
          </h2>
          <div className="space-y-4">
            {filteredCommunities.map((community) => (
              <motion.div
                key={community.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link
                  href={`/community/${encodeURIComponent(
                    community.name.toLowerCase()
                  )}`}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="text-2xl text-accent bg-accent/10 p-3 rounded-xl">
                    <FaUsers />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {community.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {community.member_count?.toLocaleString() || 0} üye
                    </p>
                    <p className="text-sm text-gray-600">
                      {community.description}
                    </p>
                    {community.tags && community.tags.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {community.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            <FaHashtag className="text-gray-400" size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "users" && filteredUsers.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FaUser className="text-accent" />
            Kullanıcılar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/user/${user.username}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <img
                    src={
                      user.profile_picture_url ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4"
                    }
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user.display_name || user.username}
                    </h3>
                    <p className="text-sm text-gray-500">u/{user.username}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "posts" && filteredPosts.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FaNewspaper className="text-accent" />
            Gönderiler
          </h2>
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <PostCard {...post} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {((activeTab === "all" &&
        filteredCommunities.length === 0 &&
        filteredUsers.length === 0 &&
        filteredPosts.length === 0) ||
        (activeTab === "communities" && filteredCommunities.length === 0) ||
        (activeTab === "users" && filteredUsers.length === 0) ||
        (activeTab === "posts" && filteredPosts.length === 0)) && (
        <motion.div
          className="text-center py-16 bg-white rounded-2xl shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaSearch className="mx-auto text-gray-400 mb-6" size={64} />
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Sonuç bulunamadı
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            "{searchQuery}" için{" "}
            {activeTab === "all"
              ? "herhangi bir"
              : activeTab === "communities"
              ? "topluluk"
              : activeTab === "users"
              ? "kullanıcı"
              : "gönderi"}{" "}
            sonucu bulunamadı.
          </p>
        </motion.div>
      )}
    </div>
  );

  if (!mounted) return null;

  if (!searchQuery) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          className="text-center py-20 bg-white rounded-2xl shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaSearch className="mx-auto text-gray-400 mb-6" size={64} />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Arama yapmak için bir terim girin
          </h1>
          <p className="text-gray-600 text-lg max-w-lg mx-auto">
            Toplulukları, kullanıcıları ve gönderileri aramak için yukarıdaki
            arama çubuğunu kullanın
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 mt-10">
      <motion.div
        className="max-w-4xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Arama Özeti */}
        <motion.div
          className="mb-8 bg-white p-6 rounded-2xl shadow-sm"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            "{searchQuery}" için arama sonuçları
          </h1>
          <div className="flex gap-4 text-gray-600">
            <span className="flex items-center gap-2">
              <FaUsers className="text-accent" />
              {filteredCommunities.length} topluluk
            </span>
            <span className="flex items-center gap-2">
              <FaUser className="text-accent" />
              {filteredUsers.length} kullanıcı
            </span>
            <span className="flex items-center gap-2">
              <FaNewspaper className="text-accent" />
              {filteredPosts.length} gönderi
            </span>
          </div>
        </motion.div>

        {/* Sekmeler */}
        <motion.div
          className="flex gap-2 mb-6 border-b"
          variants={itemVariants}
        >
          {["all", "communities", "users", "posts"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                activeTab === tab
                  ? "text-accent border-b-2 border-accent bg-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {tab === "all" && "Tümü"}
              {tab === "communities" && "Topluluklar"}
              {tab === "users" && "Kullanıcılar"}
              {tab === "posts" && "Gönderiler"}
            </motion.button>
          ))}
        </motion.div>

        {/* Sonuçlar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {resultContent}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SearchResults;
