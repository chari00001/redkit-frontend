"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  FaArrowUp,
  FaArrowDown,
  FaComment,
  FaShare,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import ShareComp from "@/components/PostComponents/PostButtons/ShareComp";
import { getPostById } from "@/store/features/postsSlice";
import { getPostComments } from "@/store/features/commentsSlice";
import { useParams } from "next/navigation";

export default function PostDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const {
    currentPost: postData,
    loading: postLoading,
    error: postError,
  } = useSelector((state) => state.posts);
  const {
    postComments: commentsData,
    loading: commentsLoading,
    error: commentsError,
  } = useSelector((state) => state.comments);

  const [showShare, setShowShare] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [voted, setVoted] = useState(null);
  const [votes, setVotes] = useState(postData?.likes_count || 0);

  useEffect(() => {
    const postId = params?.id;
    if (postId) {
      const id = parseInt(postId);
      dispatch(getPostById(id));
      dispatch(getPostComments(id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (postData) {
      setVotes(postData.likes_count);
    }
  }, [postData]);

  const handleVote = (direction) => {
    if (voted === direction) {
      setVoted(null);
      setVotes(direction === "up" ? votes - 1 : votes + 1);
    } else {
      if (voted) {
        setVotes(direction === "up" ? votes + 2 : votes - 2);
      } else {
        setVotes(direction === "up" ? votes + 1 : votes - 1);
      }
      setVoted(direction);
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen p-4 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (postError) {
    return (
      <div className="min-h-screen p-4 pt-20 flex items-center justify-center">
        <div className="text-red-500">Gönderi yüklenirken bir hata oluştu.</div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="min-h-screen p-4 pt-20 flex items-center justify-center">
        <div className="text-gray-500">Gönderi bulunamadı.</div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(postData.created_at), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <main className="min-h-screen p-4 pt-20 bg-background">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6"
      >
        <header className="flex items-start gap-4">
          {/* Vote Section */}
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
              <FaArrowUp size={20} />
            </motion.button>
            <span className="font-semibold text-gray-700 min-w-[40px] text-center">
              {votes}
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
              <FaArrowDown size={20} />
            </motion.button>
          </div>

          {/* Content Section */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={postData.author?.profile_picture_url}
                alt={postData.author?.username}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <span className="font-medium text-gray-800">
                  u/{postData.author?.username}
                </span>
                <span className="text-sm text-gray-500 ml-2">• {timeAgo}</span>
              </div>
            </div>

            <motion.h1
              className="text-2xl font-bold mb-4 text-gray-900"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
            >
              {postData.title}
            </motion.h1>

            <div className="prose text-gray-700 max-w-none mb-6">
              <p className="text-base leading-relaxed">{postData.content}</p>
              {postData.media_url && (
                <motion.div
                  className="mt-4 rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={postData.media_url}
                    alt={postData.title}
                    className="w-full max-h-[600px] object-cover"
                  />
                </motion.div>
              )}
            </div>

            {/* Tags */}
            {postData.tags && postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {postData.tags.map((tag, index) => (
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

            {/* Actions */}
            <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-full px-4 py-2"
              >
                <FaComment size={18} />
                <span className="font-medium">
                  {postData.comments_count} Yorum
                </span>
              </motion.button>

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
                    ? "text-yellow-500 hover:bg-yellow-50"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {isBookmarked ? (
                  <FaBookmark size={18} />
                ) : (
                  <FaRegBookmark size={18} />
                )}
                <span className="font-medium">Kaydet</span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Comments Section */}
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Yorumlar</h2>
          {commentsData.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={comment.author?.profile_picture_url}
                  alt={comment.author?.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-sm">
                  u/{comment.author?.username}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-gray-500">
                  <button className="hover:text-accent">
                    <FaArrowUp size={14} />
                  </button>
                  <span className="text-xs font-medium">
                    {comment.likes_count}
                  </span>
                  <button className="hover:text-red-500">
                    <FaArrowDown size={14} />
                  </button>
                </div>
                <button className="text-xs text-gray-500 hover:text-accent font-medium">
                  Yanıtla
                </button>
              </div>
            </motion.div>
          ))}
        </section>
      </motion.article>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ShareComp show={showShare} onClose={() => setShowShare(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
