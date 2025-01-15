"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostById } from "@/store/features/postsSlice";
import { getPostComments } from "@/store/features/commentsSlice";
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
} from "react-icons/fa";
import CommentSection from "@/components/PostComponents/Comments/CommentSection";
import ShareComp from "@/components/PostComponents/PostButtons/ShareComp";
import Link from "next/link";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4";

export default function PostPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;

  const post = useSelector((state) => state.posts.currentPost);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(parseInt(postId)));
      dispatch(getPostComments(parseInt(postId)));
    }
  }, [dispatch, postId]);

  useEffect(() => {
    if (post?.likes_count) {
      setVotes(parseInt(post.likes_count));
    }
  }, [post?.likes_count]);

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

  const formatVoteCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleAuthorClick = (username) => {
    router.push(`/user/${username}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Gönderi yüklenirken bir hata oluştu.</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Gönderi bulunamadı.</div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-3xl">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        {/* Yazar Bilgisi */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100"
            onClick={() => handleAuthorClick(post.author?.username || "anonim")}
          >
            <img
              src={post.author?.profile_picture_url || DEFAULT_AVATAR}
              alt={post.author?.username || "Kullanıcı"}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <h3
              onClick={() =>
                handleAuthorClick(post.author?.username || "anonim")
              }
              className="font-medium text-gray-900 hover:text-accent cursor-pointer"
            >
              u/{post.author?.username || "anonim"}
            </h3>
            <span className="text-sm text-gray-500">{timeAgo}</span>
          </div>
        </div>

        {/* Post İçeriği */}
        <div className="flex gap-6">
          {/* Sol Oylama Çubuğu */}
          <div className="flex flex-col items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleVote("up")}
              className={`p-2 rounded-full ${
                voted === "up"
                  ? "bg-accent text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaArrowUp size={24} />
            </motion.button>
            <span className="font-semibold text-gray-700 text-lg">
              {formatVoteCount(votes)}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleVote("down")}
              className={`p-2 rounded-full ${
                voted === "down"
                  ? "bg-red-500 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaArrowDown size={24} />
            </motion.button>
          </div>

          {/* Ana İçerik */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">
              {post.title}
            </h1>
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {post.content}
              </p>
              {post.media_url && (
                <img
                  src={post.media_url}
                  alt={post.title}
                  className="mt-4 rounded-lg max-h-[600px] w-full object-cover"
                />
              )}
            </div>

            {/* Etiketler */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Alt Butonlar */}
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShare(true)}
                className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-full px-4 py-2"
              >
                <FaShare size={18} />
                <span className="font-medium">Paylaş</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                  isBookmarked
                    ? "text-yellow-500"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {isBookmarked ? (
                  <FaBookmark size={18} />
                ) : (
                  <FaRegBookmark size={18} />
                )}
                <span className="font-medium">
                  {isBookmarked ? "Kaydedildi" : "Kaydet"}
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Yorumlar */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Yorumlar</h2>
          <CommentSection postId={parseInt(postId)} />
        </div>
      </motion.article>

      {/* Paylaşım Modalı */}
      <AnimatePresence>
        {showShare && (
          <ShareComp show={showShare} onClose={() => setShowShare(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
