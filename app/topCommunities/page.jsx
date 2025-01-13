"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaGlobe,
  FaGamepad,
  FaCode,
  FaMusic,
  FaFilm,
  FaBook,
  FaPalette,
  FaFootballBall,
  FaGraduationCap,
} from "react-icons/fa";
import Link from "next/link";
import { communities } from "@/mockData/communities";

const categories = [
  { id: "all", name: "Tümü", icon: <FaGlobe /> },
  { id: "Technology", name: "Teknoloji", icon: <FaCode /> },
  { id: "Gaming", name: "Oyun", icon: <FaGamepad /> },
  { id: "Arts", name: "Sanat", icon: <FaPalette /> },
  { id: "Entertainment", name: "Eğlence", icon: <FaFilm /> },
  { id: "Sports", name: "Spor", icon: <FaFootballBall /> },
  { id: "Education", name: "Eğitim", icon: <FaGraduationCap /> },
];

const TopCommunitiesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("members"); // members, growth

  const filteredCommunities = communities
    .filter((community) => {
      const matchesCategory =
        selectedCategory === "all" || community.category === selectedCategory;
      const matchesSearch =
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "members") {
        return b.member_count - a.member_count;
      }
      return (
        parseFloat(b.growth_rate?.replace("%", "") || 0) -
        parseFloat(a.growth_rate?.replace("%", "") || 0)
      );
    });

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            En İyi Topluluklar
          </h1>
          <p className="text-gray-600">
            Redit'in en popüler ve aktif topluluklarını keşfedin
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Topluluk ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="members">Üye Sayısı</option>
                <option value="growth">Büyüme Oranı</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommunities.map((community) => (
            <Link
              href={`/community/${community.name.toLowerCase()}`}
              key={community.id}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {community.icon || (
                      <span className="text-2xl font-bold text-accent">
                        {community.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {community.name}
                      </h3>
                      {community.is_featured && (
                        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                          Popüler
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {community.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaUsers className="text-gray-400" />
                        <span>{community.member_count?.toLocaleString()}</span>
                      </div>
                      {community.growth_rate && (
                        <div className="flex items-center gap-1 text-green-600">
                          <FaChartLine className="text-green-500" />
                          <span>+{community.growth_rate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCommunitiesPage;
