"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaFire,
  FaChartLine,
  FaClock,
  FaFilter,
  FaEye,
  FaSearch,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import PostCard from "@/components/PostComponents/PostCard";
import PopularSlider from "@/components/PopularSlider/PopularSlider";
import { postService } from "@/services/apiService";
import { communities } from "@/mockData/communities";

const SORT_OPTIONS = [
  {
    id: "views",
    name: "En Çok Görüntülenen",
    icon: <FaEye className="text-purple-500" />,
  },
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
  { id: "all", name: "Tüm Zamanlar" },
  { id: "today", name: "Bugün" },
  { id: "week", name: "Bu Hafta" },
  { id: "month", name: "Bu Ay" },
  { id: "year", name: "Bu Yıl" },
];

const Popular = () => {
  const [sortBy, setSortBy] = useState("views");
  const [timeFilter, setTimeFilter] = useState("week");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [popularPosts, setPopularPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Server'dan postları çek
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await postService.getAllPosts();


        if (response && response.success) {
          const posts = response.data?.posts || response.data || [];
          setAllPosts(posts);
        } else {
          console.warn("Server yanıtı başarılı değil:", response);
          setError("Postlar yüklenirken bir hata oluştu");
          setAllPosts([]);
        }
      } catch (err) {
        console.error("Post çekme hatası:", err);
        setError(`Postlar yüklenirken hata: ${err.message}`);
        setAllPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtreleme ve sıralama
  useEffect(() => {
    if (!allPosts.length) {
      setPopularPosts([]);
      return;
    }

    let filteredPosts = [...allPosts];

    // Arama filtresi
    if (searchTerm) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Topluluk filtresi
    if (selectedCommunity) {
      filteredPosts = filteredPosts.filter(
        (post) => post.community_id === parseInt(selectedCommunity)
      );
    }

    // Zaman filtresi
    if (timeFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (timeFilter) {
        case "today":
          filterDate.setDate(now.getDate() - 1);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filteredPosts = filteredPosts.filter(
        (post) => new Date(post.created_at) >= filterDate
      );
    }

    // Sıralama
    const sorted = filteredPosts.sort((a, b) => {
      switch (sortBy) {
        case "views":
          return (b.views_count || 0) - (a.views_count || 0);
        case "upvotes":
          return (
            (b.likes_count || b.upvotes || 0) -
            (a.likes_count || a.upvotes || 0)
          );
        case "comments":
          return (b.comments_count || 0) - (a.comments_count || 0);
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    setPopularPosts(sorted);
  }, [allPosts, sortBy, timeFilter, selectedCommunity, searchTerm]);

  const clearFilters = () => {
    setSelectedCommunity("");
    setSearchTerm("");
    setTimeFilter("week");
    setSortBy("views");
  };

  const activeFiltersCount =
    [selectedCommunity, searchTerm].filter(Boolean).length +
    (timeFilter !== "week" ? 1 : 0) +
    (sortBy !== "views" ? 1 : 0);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Popüler Gönderiler
            </h1>
            <p className="text-gray-600">
              Redit'in en popüler ve trend olan gönderileri
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="w-8 h-8 text-accent mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Postlar yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Popüler Gönderiler
            </h1>
            <p className="text-gray-600">
              Redit'in en popüler ve trend olan gönderileri
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTimes className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Bir hata oluştu
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
              >
                Tekrar Dene
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Popüler Gönderiler
              </h1>
              <p className="text-gray-600">
                Redit'in en popüler ve trend olan gönderileri
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                showFilters || activeFiltersCount > 0
                  ? "bg-accent text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } shadow-sm border`}
            >
              <FaFilter />
              <span>Filtreler</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-accent rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Arama Çubuğu */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Gönderilerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={false}
          animate={{
            height: showFilters ? "auto" : 0,
            opacity: showFilters ? 1 : 0,
          }}
          className="overflow-hidden"
        >
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col gap-6">
              {/* Sıralama Seçenekleri */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Sıralama
                </h3>
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
              </div>

              {/* Zaman ve Topluluk Filtreleri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Zaman Filtresi */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Zaman Aralığı
                  </h3>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border border-gray-200"
                  >
                    {TIME_FILTERS.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Topluluk Filtresi */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Topluluk
                  </h3>
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent border border-gray-200"
                  >
                    <option value="">Tüm Topluluklar</option>
                    {communities.map((community) => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filtreleri Temizle */}
              {activeFiltersCount > 0 && (
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    <FaTimes />
                    <span>Filtreleri Temizle</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Hızlı Sıralama Butonları (Mobil için) */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 md:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {SORT_OPTIONS.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy(option.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
                  sortBy === option.id
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {option.icon}
                <span className="text-sm">{option.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sonuç Bilgisi */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">{popularPosts.length}</span> gönderi
            bulundu
            {searchTerm && (
              <span>
                {" "}
                • "<span className="font-semibold">{searchTerm}</span>" için
                arama sonuçları
              </span>
            )}
            {selectedCommunity && (
              <span>
                {" "}
                •{" "}
                <span className="font-semibold">
                  {
                    communities.find(
                      (c) => c.id === parseInt(selectedCommunity)
                    )?.name
                  }
                </span>{" "}
                topluluğunda
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {popularPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <FaFire className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Gönderi bulunamadı
                </h3>
                <p className="text-gray-500 mb-4">
                  Seçilen kriterlere uygun gönderi bulunamadı.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
                >
                  Filtreleri Temizle
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard
                      id={post.id}
                      title={post.title}
                      content={post.content}
                      media_url={post.media_url}
                      author={{
                        username: post.author?.username || post.user?.username,
                        profile_picture_url:
                          post.author?.profile_picture_url ||
                          post.user?.profile_picture_url,
                      }}
                      likes_count={post.likes_count || post.upvotes || 0}
                      comments_count={post.comments_count || 0}
                      views_count={post.views_count || 0}
                      created_at={post.created_at}
                      tags={post.tags}
                      community={post.community}
                    />
                  </motion.div>
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
