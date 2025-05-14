"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCommunities } from "@/store/features/communitiesSlice";
import PostCard from "@/components/PostComponents/PostCard";
import Link from "next/link";
import { FaUsers, FaClipboard, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Community = () => {
  const dispatch = useDispatch();
  const {
    items: communities,
    loading,
    error,
  } = useSelector((state) => state.communities);

  useEffect(() => {
    dispatch(fetchAllCommunities());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Topluluklar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-2xl text-red-500 mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Topluluklar yüklenemedi
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-accent text-white rounded-lg shadow hover:bg-accent/90"
            onClick={() => dispatch(fetchAllCommunities())}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!communities || communities.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-2xl mb-4">🏙️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Henüz topluluk bulunmuyor
          </h2>
          <p className="text-gray-600 mb-4">
            İlk topluluğu oluşturan siz olabilirsiniz!
          </p>
          <Link href="/create-community">
            <button className="px-4 py-2 bg-accent text-white rounded-lg shadow hover:bg-accent/90">
              Topluluk Oluştur
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Topluluklar</h1>
          <Link href="/create-community">
            <motion.button
              className="px-4 py-2 bg-accent text-white rounded-lg shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Yeni Topluluk Oluştur
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Link href={`/community/${community.name}`} key={community.id}>
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="h-32 relative">
                  <img
                    src={
                      community.cover_image_url ||
                      "https://picsum.photos/600/200"
                    }
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      r/{community.name}
                    </h2>
                    {community.is_verified && (
                      <span className="text-blue-500 bg-blue-50 p-1 rounded-full">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {community.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaUsers />
                      <span>{community.member_count} üye</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClipboard />
                      <span>{community.post_count} gönderi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt />
                      <span>
                        {new Date(community.created_at).toLocaleDateString(
                          "tr-TR",
                          {
                            year: "numeric",
                            month: "short",
                          }
                        )}
                      </span>
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

export default Community;
