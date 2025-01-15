"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaRegCalendarAlt,
} from "react-icons/fa";
import PostCard from "@/components/PostComponents/PostCard";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const { currentUser, isLoggedIn } = useSelector((state) => state.auth);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  // Kullanıcı yüklenene kadar loading göster
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  const mockPosts = [
    {
      id: 1,
      title: "My thoughts on the latest gaming trends",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      upvotes: 1234,
      comments_count: 89,
      created_at: new Date("2023-10-15").toISOString(),
      media_url: null,
      tags: ["gaming", "technology"],
      author: currentUser,
      community: {
        id: 1,
        name: "Gaming",
        icon: "🎮",
      },
      is_saved: false,
      is_upvoted: false,
      allow_comments: true,
      visibility: "public",
    },
    {
      id: 2,
      title: "Check out my new setup!",
      content: "Just upgraded my battlestation...",
      upvotes: 2456,
      comments_count: 156,
      created_at: new Date("2023-10-10").toISOString(),
      media_url: "https://picsum.photos/800/400",
      tags: ["setup", "gaming", "technology"],
      author: currentUser,
      community: {
        id: 2,
        name: "Battlestations",
        icon: "💻",
      },
      is_saved: false,
      is_upvoted: true,
      allow_comments: true,
      visibility: "public",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-orange-400 to-orange-600 relative">
        <img
          src="https://picsum.photos/1920/400"
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="bg-white rounded-lg shadow-md -mt-20 p-6">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={currentUser.profile_picture_url}
                alt={currentUser.username}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              {currentUser.verified && (
                <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                  ✓
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{currentUser.username}</h1>
                <motion.button
                  className="px-4 py-2 bg-orange-500 text-white rounded-full flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEdit /> Profili Düzenle
                </motion.button>
              </div>

              <p className="text-gray-600 mt-2">
                {currentUser.bio || "Henüz bir bio eklenmemiş."}
              </p>

              <div className="flex items-center gap-6 mt-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt />{" "}
                  {currentUser.location || "Konum belirtilmemiş"}
                </span>
                <span className="flex items-center gap-2">
                  <FaBirthdayCake /> Katılma:{" "}
                  {new Date(currentUser.createdAt).toLocaleDateString("tr-TR")}
                </span>
                <span className="flex items-center gap-2">
                  <FaRegCalendarAlt /> {currentUser.post_count || 0} gönderi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Gönderiler</h2>
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
