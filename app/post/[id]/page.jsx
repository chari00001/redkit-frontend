"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "@/store/features/postsSlice";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  FaArrowUp,
  FaArrowDown,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaEye,
  FaComment,
  FaGlobe,
  FaLock,
  FaUserFriends,
  FaClock,
  FaCalendarAlt,
  FaHeart,
  FaRegHeart,
  FaTags,
  FaExternalLinkAlt,
} from "react-icons/fa";
import CommentSection from "@/components/PostComponents/Comments/CommentSection";
import ShareComp from "@/components/PostComponents/PostButtons/ShareComp";
import { interactionService } from "@/services/apiService";
import { recommenderService } from "@/services/apiService";
import Link from "next/link";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4";

// Backend base URL'ini environment'tan al
const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_POST_API_URL || "http://localhost:3002";

export default function PostPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;

  const post = useSelector((state) => state.posts.currentPost);
  const { currentUser } = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(parseInt(postId)));
    }
  }, [dispatch, postId]);

  useEffect(() => {
    if (post?.likes_count) {
      setVotes(parseInt(post.likes_count));
    }
  }, [post?.likes_count]);

  // Etkileşimin 'view' olarak kaydedilmesi
  useEffect(() => {
    if (post && post.tags && currentUser?.id) {
      post.tags.forEach((t) =>
        interactionService
          .viewTag(currentUser.id, t)
          .catch((err) => console.error("View interaction error", err))
      );

      // Recommender API'ye de view kaydı
      recommenderService
        .trackInteraction(currentUser.id, post.id, "view")
        .catch((err) => console.error("Recommender view tracking error", err));
    }
  }, [post, currentUser]);

  // Post media URL'ini güvenli bir şekilde oluştur - Hook kuralları için early return'den önce
  const postImageUrl = React.useMemo(() => {
    if (!post?.media_url) return null;

    try {
      let cleanUrl = post.media_url;

      // Eğer URL encode edilmişse decode et
      if (cleanUrl.includes("%")) {
        try {
          cleanUrl = decodeURIComponent(cleanUrl);
        } catch (decodeError) {
          console.warn("URL decode edilemedi:", decodeError);
        }
      }

      // Eğer URL absolute ise doğrudan döndür
      if (cleanUrl.startsWith("http")) {
        return cleanUrl;
      }

      // Relative URL ise backend base URL'i ile birleştir
      if (cleanUrl.startsWith("/uploads/")) {
        const finalUrl = `${BACKEND_BASE_URL}${cleanUrl}`;
        return finalUrl;
      }

      // Son çare olarak null döndür
      return null;
    } catch (error) {
      console.error("PostImageUrl oluşturma hatası:", error);
      return null;
    }
  }, [post?.media_url]);

  // Time ago - Hook kuralları için early return'den önce
  const timeAgo = React.useMemo(() => {
    try {
      if (!post?.created_at || isNaN(new Date(post.created_at).getTime())) {
        return "bilinmeyen zaman";
      }
      return formatDistanceToNow(new Date(post.created_at), {
        addSuffix: true,
        locale: tr,
      });
    } catch (error) {
      console.error("Tarih biçimlendirme hatası:", error);
      return "bilinmeyen zaman";
    }
  }, [post?.created_at]);

  // Updated time ago
  const updatedTimeAgo = React.useMemo(() => {
    try {
      if (!post?.updated_at || isNaN(new Date(post.updated_at).getTime())) {
        return null;
      }
      // Eğer created_at ve updated_at aynıysa güncelleme olmamış
      if (post.created_at === post.updated_at) {
        return null;
      }
      return formatDistanceToNow(new Date(post.updated_at), {
        addSuffix: true,
        locale: tr,
      });
    } catch (error) {
      console.error("Updated tarih biçimlendirme hatası:", error);
      return null;
    }
  }, [post?.updated_at, post?.created_at]);

  const handleVote = (direction) => {
    if (voted === direction) {
      setVoted(null);
      setVotes(votes + (direction === "up" ? -1 : 1));
    } else {
      const voteChange = direction === "up" ? 1 : -1;
      const previousVoteChange = voted ? (voted === "up" ? -1 : 1) : 0;
      setVotes(votes + voteChange + previousVoteChange);
      setVoted(direction);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count?.toString() || "0";
  };

  const handleAuthorClick = (username) => {
    router.push(`/user/${username}`);
  };

  const handleImageError = (e) => {
    const failedUrl = e.target.src;
    console.error("Post detay resmi yüklenemedi:", failedUrl);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleAvatarError = (e) => {
    console.error("Avatar yüklenemedi:", e.target.src);
    e.target.src = DEFAULT_AVATAR;
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "public":
        return <FaGlobe className="text-green-500" />;
      case "private":
        return <FaLock className="text-red-500" />;
      case "followers":
        return <FaUserFriends className="text-blue-500" />;
      default:
        return <FaGlobe className="text-green-500" />;
    }
  };

  const getVisibilityText = (visibility) => {
    switch (visibility) {
      case "public":
        return "Herkese açık";
      case "private":
        return "Özel";
      case "followers":
        return "Takipçiler";
      default:
        return "Herkese açık";
    }
  };

  // Early returns - tüm hooklar yukarıda çağrıldı
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
          <p className="text-gray-600 font-medium">Post yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col justify-center items-center space-y-6 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center space-y-6 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1zm7-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Post Bulunamadı
          </h2>
          <p className="text-gray-600 mb-4">
            Bu gönderi mevcut değil veya silinmiş olabilir.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {/* Sol Sidebar - Voting */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-4 sticky top-20"
            >
              {/* Voting Section */}
              <div className="flex flex-col items-center space-y-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVote("up")}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    voted === "up"
                      ? "bg-orange-500 text-white shadow-lg scale-110"
                      : "text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  <FaArrowUp size={20} />
                </motion.button>

                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      voted === "up"
                        ? "text-orange-500"
                        : voted === "down"
                        ? "text-red-500"
                        : "text-gray-700"
                    }`}
                  >
                    {formatCount(votes)}
                  </div>
                  <div className="text-xs text-gray-500">oylar</div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVote("down")}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    voted === "down"
                      ? "bg-red-500 text-white shadow-lg scale-110"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <FaArrowDown size={20} />
                </motion.button>
              </div>

              {/* Post Stats */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaEye />
                    <span>{formatCount(post.views_count)} görüntüleme</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaComment />
                    <span>{formatCount(post.comments_count)} yorum</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaShare />
                    <span>{formatCount(post.shares_count)} paylaşım</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Ana İçerik */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative w-12 h-12 rounded-full overflow-hidden border-3 border-white shadow-lg bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handleAuthorClick(post.author?.username || "anonim")
                      }
                    >
                      <img
                        src={post.author?.profile_picture_url || DEFAULT_AVATAR}
                        alt={post.author?.username || "Kullanıcı"}
                        className="w-full h-full object-cover"
                        onError={handleAvatarError}
                      />
                    </motion.div>
                    <div>
                      <h3
                        onClick={() =>
                          handleAuthorClick(post.author?.username || "anonim")
                        }
                        className="font-semibold text-gray-900 hover:text-orange-500 cursor-pointer transition-colors"
                      >
                        u/{post.author?.username || "anonim"}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{timeAgo}</span>
                        {updatedTimeAgo && (
                          <>
                            <span>•</span>
                            <FaClock className="w-3 h-3" />
                            <span>düzenlendi {updatedTimeAgo}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post Meta */}
                  <div className="flex items-center space-x-2">
                    {post.is_pinned && (
                      <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        <span>Sabitlenmiş</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {getVisibilityIcon(post.visibility)}
                      <span>{getVisibilityText(post.visibility)}</span>
                    </div>
                  </div>
                </div>

                {/* Post Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <FaTags className="text-gray-400 mt-1" />
                    {post.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium hover:from-orange-200 hover:to-orange-300 transition-all cursor-pointer"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Text Content */}
                {post.content && (
                  <div className="prose prose-lg max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* Media Content */}
                {postImageUrl && !imageError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imageLoaded ? 1 : 0.5 }}
                    className="relative rounded-xl overflow-hidden mb-6 bg-gray-100 shadow-lg"
                  >
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                      </div>
                    )}
                    <img
                      src={postImageUrl}
                      alt={post.title}
                      className="w-full max-h-[600px] object-contain rounded-xl"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      loading="lazy"
                      crossOrigin="anonymous"
                    />
                  </motion.div>
                )}
              </div>

              {/* Action Bar */}
              <div className="border-t border-gray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                        isLiked
                          ? "bg-red-100 text-red-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {isLiked ? <FaHeart /> : <FaRegHeart />}
                      <span className="font-medium">Beğen</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowShare(true)}
                      className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-full transition-all"
                    >
                      <FaShare />
                      <span className="font-medium">Paylaş</span>
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                      isBookmarked
                        ? "bg-yellow-100 text-yellow-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                    <span className="font-medium">
                      {isBookmarked ? "Kaydedildi" : "Kaydet"}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Comments Section */}
              {post.allow_comments ? (
                <div className="border-t border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <FaComment />
                    <span>Yorumlar ({formatCount(post.comments_count)})</span>
                  </h2>
                  <CommentSection
                    postId={parseInt(postId)}
                    tags={post.tags || []}
                  />
                </div>
              ) : (
                <div className="border-t border-gray-100 p-6 text-center">
                  <div className="text-gray-500">
                    <FaLock className="mx-auto mb-2 text-2xl" />
                    <p>Bu gönderi için yorumlar kapatılmış.</p>
                  </div>
                </div>
              )}
            </motion.article>
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <ShareComp
            show={showShare}
            onClose={() => setShowShare(false)}
            userId={currentUser?.id}
            tags={post.tags || []}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
