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

const PostCard = ({
  title,
  content,
  media_url,
  author,
  likes_count,
  comments_count,
  created_at,
  tags,
}) => {
  const [votes, setVotes] = useState(likes_count);
  const [voted, setVoted] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Main Content Container */}
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-3">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={author?.profile_picture_url}
            alt={author?.username}
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <span className="font-medium text-gray-800">
              u/{author?.username}
            </span>
            <span className="text-sm text-gray-500 ml-2">• {timeAgo}</span>
          </div>
        </div>

        {/* Title & Content */}
        <motion.h2
          className="text-xl font-bold mb-2 text-gray-900"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.01 }}
        >
          {title}
        </motion.h2>
        <p className="text-gray-700 mb-4 line-clamp-3">{content}</p>

        {/* Media */}
        {media_url && (
          <motion.div
            className="relative rounded-lg overflow-hidden mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={media_url || "https://picsum.photos/800/600"}
              alt="Post content"
              className="w-full max-h-[500px] object-cover"
            />
          </motion.div>
        )}

        {/* Tags */}
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

        {/* Actions Bar */}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
          {/* Vote Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleVote("up")}
              className={`p-1.5 rounded-full ${
                voted === "up"
                  ? "bg-accent text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaArrowUp size={18} />
            </motion.button>
            <span className="font-semibold text-gray-700 min-w-[40px] text-center">
              {votes}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleVote("down")}
              className={`p-1.5 rounded-full ${
                voted === "down"
                  ? "bg-red-500 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaArrowDown size={18} />
            </motion.button>
          </div>

          {/* Other Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-full px-3 py-1.5"
            >
              <FaComment size={18} />
              <span className="text-sm font-medium">{comments_count}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowShare(true)}
              className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 rounded-full px-3 py-1.5"
            >
              <FaShare size={18} />
              <span className="text-sm font-medium">Share</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded-full ${
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
            </motion.button>
          </div>
        </div>
      </div>

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
    </motion.div>
  );
};

export default PostCard;
