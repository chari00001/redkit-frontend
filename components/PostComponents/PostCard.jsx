"use client";

import React, { useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaComment,
  FaShare,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ShareComp from "./PostButtons/ShareComp";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import CommentSection from "./Comments/CommentSection";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4";

const PostCard = ({
  id,
  title,
  content,
  media_url,
  author,
  likes_count = 0,
  comments_count = 0,
  created_at,
  tags,
}) => {
  const router = useRouter();
  const [votes, setVotes] = useState(likes_count ? parseInt(likes_count) : 0);
  const [voted, setVoted] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const postImageUrl = React.useMemo(() => {
    if (!media_url) return null;
    if (media_url.startsWith("http")) return media_url;
    return `https://picsum.photos/800/600?random=${encodeURIComponent(
      title || ""
    )}`;
  }, [media_url, title]);

  const avatarUrl = React.useMemo(() => {
    const profilePic = author?.profile_picture_url;
    if (!profilePic) return DEFAULT_AVATAR;
    if (profilePic.startsWith("http")) return profilePic;
    return DEFAULT_AVATAR;
  }, [author?.profile_picture_url]);

  const handleVote = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();

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

  const formatVoteCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const timeAgo = React.useMemo(() => {
    try {
      // Eğer created_at undefined, null, geçersiz tarih ise güvenli bir varsayılan değer döndür
      if (!created_at || isNaN(new Date(created_at).getTime())) {
        return "bilinmeyen zaman";
      }

      return formatDistanceToNow(new Date(created_at), {
        addSuffix: true,
        locale: tr,
      });
    } catch (error) {
      console.error("Tarih biçimlendirme hatası:", error);
      return "bilinmeyen zaman";
    }
  }, [created_at]);

  const handleImageError = (e) => {
    console.error("Resim yüklenemedi:", e.target.src);
    setImageError(true);
  };

  const handleNavigateToDetail = (e) => {
    e.stopPropagation();
    window.location.href = `/post/${id}`;
  };

  const handleAuthorClick = (e, username) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/user/${username}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-4">
        {/* Yazar Bilgisi */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100"
            onClick={(e) => handleAuthorClick(e, author?.username || "anonim")}
          >
            <img
              src={avatarUrl}
              alt={author?.username || "Kullanıcı"}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </motion.div>
          <div className="flex items-center">
            <span
              onClick={(e) =>
                handleAuthorClick(e, author?.username || "anonim")
              }
              className="font-medium text-gray-800 hover:text-accent cursor-pointer"
            >
              u/{author?.username || "anonim"}
            </span>
            <span className="text-sm text-gray-500 ml-2">• {timeAgo}</span>
          </div>
        </div>

        {/* İçerik Alanı */}
        <div className="content-area">
          {/* Başlık - Tıklanabilir */}
          <motion.h2
            onClick={handleNavigateToDetail}
            className="text-xl font-bold mb-2 text-gray-900 hover:text-accent cursor-pointer"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }}
          >
            {title}
          </motion.h2>

          {/* İçerik - Tıklanamaz */}
          <p className="text-gray-700 mb-4 line-clamp-3">{content}</p>

          {/* Medya - Tıklanabilir */}
          {postImageUrl && !imageError && (
            <motion.div
              onClick={handleNavigateToDetail}
              className="relative rounded-lg overflow-hidden mb-4 bg-gray-100 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <img
                  src={postImageUrl}
                  alt={title || "Post görseli"}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Etiketler */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Aksiyon Çubuğu */}
        <div className="action-buttons flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
          {/* Oylama Butonları */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleVote(e, "up")}
              className={`p-2 rounded-full transition-colors ${
                voted === "up"
                  ? "bg-accent text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaArrowUp size={16} />
            </motion.button>
            <span className="font-semibold text-gray-700 min-w-[40px] text-center">
              {formatVoteCount(votes)}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleVote(e, "down")}
              className={`p-2 rounded-full transition-colors ${
                voted === "down"
                  ? "bg-red-500 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaArrowDown size={16} />
            </motion.button>
          </div>

          {/* Diğer Aksiyonlar */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-full px-3 py-1.5"
            >
              <FaComment size={16} />
              <span className="text-sm font-medium">{comments_count || 0}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowShare(true);
              }}
              className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-full px-3 py-1.5"
            >
              <FaShare size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? "text-yellow-500"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {isBookmarked ? (
                <FaBookmark size={16} />
              ) : (
                <FaRegBookmark size={16} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Yorum Bölümü */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 mt-4 comment-section"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <CommentSection postId={id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paylaşım Modalı */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="share-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <ShareComp show={showShare} onClose={() => setShowShare(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
