"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUsers,
  FaRegClock,
  FaHashtag,
  FaRegBookmark,
  FaBell,
  FaShare,
  FaEllipsisH,
} from "react-icons/fa";
import PostCard from "@/components/PostComponents/PostCard";
import {
  fetchCommunityById,
  joinCommunity,
  leaveCommunity,
} from "@/store/features/communitiesSlice";
import { getCommunityPosts } from "@/store/features/postsSlice";
import { toast } from "react-hot-toast";

const CommunityPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const communityName = decodeURIComponent(params.communityName);
  const [isJoined, setIsJoined] = useState(false);

  const {
    currentCommunity,
    loading: communityLoading,
    error: communityError,
  } = useSelector((state) => state.communities);
  const {
    communityPosts,
    loading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.posts);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (communityName) {
      dispatch(fetchCommunityById(communityName));
      dispatch(getCommunityPosts(communityName));
    }
  }, [dispatch, communityName]);

  useEffect(() => {
    if (currentCommunity) {
      setIsJoined(currentCommunity.is_member || false);
    }
  }, [currentCommunity]);

  const handleJoinCommunity = () => {
    if (!isLoggedIn) {
      toast.error("Topluluğa katılmak için giriş yapmalısınız");
      return;
    }

    if (isJoined) {
      dispatch(leaveCommunity(currentCommunity.id))
        .unwrap()
        .then(() => {
          setIsJoined(false);
          toast.success("Topluluktan başarıyla ayrıldınız");
        })
        .catch((error) => {
          toast.error(`Hata: ${error}`);
        });
    } else {
      dispatch(joinCommunity(currentCommunity.id))
        .unwrap()
        .then(() => {
          setIsJoined(true);
          toast.success("Topluluğa başarıyla katıldınız");
        })
        .catch((error) => {
          toast.error(`Hata: ${error}`);
        });
    }
  };

  if (communityLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Topluluk yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (communityError || !currentCommunity) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Topluluk Bulunamadı
          </h1>
          <p className="text-gray-600">
            Aradığınız topluluk mevcut değil veya silinmiş olabilir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      {/* Cover Image */}
      <div className="h-64 relative">
        <img
          src={
            currentCommunity.cover_image_url || "https://picsum.photos/1920/400"
          }
          alt={currentCommunity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative -mt-32">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-center">
                {currentCommunity.icon || (
                  <span className="text-4xl">
                    {currentCommunity.name[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    r/{currentCommunity.name}
                  </h1>
                  {currentCommunity.is_verified && (
                    <span className="text-blue-500 bg-blue-50 p-1 rounded-full">
                      <svg
                        className="w-5 h-5"
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
                <p className="text-gray-600 mt-1">
                  {currentCommunity.description}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinCommunity}
                className={`px-6 py-2.5 ${
                  isJoined
                    ? "bg-gray-200 text-gray-800"
                    : "bg-accent text-white"
                } rounded-xl font-medium flex items-center gap-2`}
              >
                <FaBell />
                {isJoined ? "Ayrıl" : "Takip Et"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                <FaShare />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                <FaEllipsisH />
              </motion.button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaUsers className="text-gray-400" />
              <span>{currentCommunity.member_count?.toLocaleString()} üye</span>
            </div>
            <div className="flex items-center gap-2">
              <FaRegClock className="text-gray-400" />
              <span>
                {new Date(currentCommunity.created_at).toLocaleDateString(
                  "tr-TR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}{" "}
                tarihinde oluşturuldu
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaHashtag className="text-gray-400" />
              <span>{currentCommunity.post_count} gönderi</span>
            </div>
          </div>

          {currentCommunity.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {currentCommunity.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Create Post Card */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex gap-4">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <input
                  type="text"
                  placeholder="Bir gönderi oluştur..."
                  className="flex-1 bg-gray-100 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Posts */}
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : postsError ? (
              <div className="text-center py-8 text-gray-600">
                Gönderiler yüklenirken bir hata oluştu.
              </div>
            ) : communityPosts?.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                Bu toplulukta henüz gönderi yok.
              </div>
            ) : (
              communityPosts?.map((post) => (
                <PostCard key={post.id} {...post} />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 space-y-4">
            {/* About Community */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Topluluk Hakkında
              </h3>
              <div className="space-y-4 text-sm">
                <p className="text-gray-600">{currentCommunity.description}</p>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Kurallar</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    {(currentCommunity.rules || "")
                      .split("\n")
                      .filter(Boolean)
                      .map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                İstatistikler
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Üyeler</span>
                  <span className="font-medium">
                    {currentCommunity.member_count?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gönderiler</span>
                  <span className="font-medium">
                    {currentCommunity.post_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Oluşturulma Tarihi</span>
                  <span className="font-medium">
                    {new Date(currentCommunity.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
