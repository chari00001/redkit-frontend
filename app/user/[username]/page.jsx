"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLink,
  FaRegFileAlt,
  FaRegCommentAlt,
  FaRegHeart,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4";

const mockUserData = {
  username: "johndoe",
  display_name: "John Doe",
  profile_picture_url: "",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  location: "İstanbul, Türkiye",
  website: "https://example.com",
  joined_date: "2023-01-01",
  followers_count: 1234,
  following_count: 567,
  post_count: 89,
  comment_count: 456,
  total_likes: 7890,
};

const mockPosts = [
  {
    id: 1,
    title: "İlk Gönderim",
    content: "Bu benim ilk gönderim!",
    likes_count: 42,
    comments_count: 5,
    created_at: "2024-01-15",
  },
  // Daha fazla gönderi eklenebilir
];

export default function UserDetailPage() {
  const params = useParams();
  const username = params?.username;
  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState(mockUserData);
  const [userPosts, setUserPosts] = useState(mockPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Burada API'den kullanıcı verilerini çekebilirsiniz
    setLoading(false);
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const tabs = [
    {
      id: "posts",
      label: "Gönderiler",
      icon: FaRegFileAlt,
      count: userData.post_count,
    },
    {
      id: "comments",
      label: "Yorumlar",
      icon: FaRegCommentAlt,
      count: userData.comment_count,
    },
    {
      id: "likes",
      label: "Beğeniler",
      icon: FaRegHeart,
      count: userData.total_likes,
    },
  ];

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-3xl">
      {/* Profil Kartı */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Kapak Fotoğrafı */}
        <div className="h-48 bg-gradient-to-r from-accent to-accent/60" />

        {/* Profil Bilgileri */}
        <div className="relative px-6 pb-6">
          {/* Profil Fotoğrafı */}
          <div className="absolute -top-16 left-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white"
            >
              <img
                src={userData.profile_picture_url || DEFAULT_AVATAR}
                alt={userData.display_name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Kullanıcı Bilgileri */}
          <div className="pt-20">
            <h1 className="text-2xl font-bold text-gray-900">
              {userData.display_name}
            </h1>
            <p className="text-gray-600">u/{userData.username}</p>

            {userData.bio && (
              <p className="mt-4 text-gray-700 leading-relaxed">
                {userData.bio}
              </p>
            )}

            {/* İstatistikler */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {formatCount(userData.followers_count)}
                </span>
                <span className="text-gray-600">takipçi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {formatCount(userData.following_count)}
                </span>
                <span className="text-gray-600">takip edilen</span>
              </div>
            </div>

            {/* Meta Bilgiler */}
            <div className="flex flex-wrap gap-4 mt-4 text-gray-600">
              {userData.location && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{userData.location}</span>
                </div>
              )}
              {userData.website && (
                <div className="flex items-center gap-2">
                  <FaLink className="text-gray-400" />
                  <a
                    href={userData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {userData.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <span>
                  {formatDistanceToNow(new Date(userData.joined_date), {
                    addSuffix: true,
                    locale: tr,
                  })}{" "}
                  katıldı
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sekmeler */}
      <div className="mt-6 bg-white rounded-xl shadow-lg">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
              <span className="text-gray-500">({formatCount(tab.count)})</span>
            </button>
          ))}
        </div>

        {/* Gönderi Listesi */}
        {activeTab === "posts" && (
          <div className="divide-y divide-gray-100">
            {userPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{post.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaRegHeart size={14} />
                    {formatCount(post.likes_count)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaRegCommentAlt size={14} />
                    {formatCount(post.comments_count)}
                  </span>
                  <span className="text-gray-400">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
