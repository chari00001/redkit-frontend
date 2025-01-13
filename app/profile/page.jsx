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

const mockUser = {
  username: "JohnDoe",
  email: "john@example.com",
  role: "user",
  profile_picture_url: "https://i.pravatar.cc/300",
  bio: "Reddit enthusiast | Gamer | Developer",
  location: "San Francisco, CA",
  date_of_birth: "1990-05-15",
  created_at: "2021-01-01",
  verified: true,
  post_count: 142,
  account_status: "active",
  subscription_level: "premium",
};

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
    author: mockUser,
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
    author: mockUser,
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

const Profile = () => {
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
                src={mockUser.profile_picture_url}
                alt={mockUser.username}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              {mockUser.verified && (
                <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                  ✓
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{mockUser.username}</h1>
                <motion.button
                  className="px-4 py-2 bg-orange-500 text-white rounded-full flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEdit /> Edit Profile
                </motion.button>
              </div>

              <p className="text-gray-600 mt-2">{mockUser.bio}</p>

              <div className="flex items-center gap-6 mt-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt /> {mockUser.location}
                </span>
                <span className="flex items-center gap-2">
                  <FaBirthdayCake /> Joined{" "}
                  {new Date(mockUser.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <FaRegCalendarAlt /> {mockUser.post_count} posts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Posts</h2>
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
