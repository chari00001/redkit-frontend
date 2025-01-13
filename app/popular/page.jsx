"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFire, FaChartLine, FaClock, FaFilter } from "react-icons/fa";
import PostCard from "@/components/PostComponents/PostCard";
import PopularSlider from "@/components/PopularSlider/PopularSlider";
import { posts } from "@/mockData/posts";

const SORT_OPTIONS = [
  {
    id: "upvotes",
    name: "En Çok Beğenilen",
    icon: <FaFire className="text-orange-500" />,
  },
  {
    id: "comments",
    name: "En Çok Yorumlanan",
    icon: <FaChartLine className="text-blue-500" />,
  },
  {
    id: "newest",
    name: "En Yeni",
    icon: <FaClock className="text-green-500" />,
  },
];

const TIME_FILTERS = [
  { id: "today", name: "Bugün" },
  { id: "week", name: "Bu Hafta" },
  { id: "month", name: "Bu Ay" },
  { id: "year", name: "Bu Yıl" },
];

const Popular = () => {
  const [sortBy, setSortBy] = useState("upvotes");
  const [timeFilter, setTimeFilter] = useState("week");
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    // Gönderileri sırala
    const sorted = [...posts].sort((a, b) => {
      switch (sortBy) {
        case "upvotes":
          return b.upvotes - a.upvotes;
        case "comments":
          return b.comments - a.comments;
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    setPopularPosts(sorted);
  }, [sortBy, timeFilter]);

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Popüler Gönderiler
          </h1>
          <p className="text-gray-600">
            Redit'in en popüler ve trend olan gönderileri
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Sort Options */}
            <div className="flex gap-2 flex-wrap">
              {SORT_OPTIONS.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    sortBy === option.id
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.icon}
                  <span>{option.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Time Filter */}
            <div className="flex items-center gap-2 ml-auto">
              <FaFilter className="text-gray-400" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {TIME_FILTERS.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {popularPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <FaFire className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Henüz gönderi yok
                </h3>
                <p className="text-gray-500">
                  Seçilen zaman aralığında popüler gönderi bulunamadı.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    content={post.content}
                    media_url={post.media_url}
                    author={post.author}
                    likes_count={post.upvotes}
                    comments_count={post.comments}
                    created_at={post.created_at}
                    tags={post.tags}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">
                Trend Topluluklar
              </h3>
              <PopularSlider />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popular;
