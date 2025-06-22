import React from "react";
import { FaArrowUp, FaArrowDown, FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";

const VoteComp = ({
  likesCount = 0,
  userVote = null, // 'up', 'down', null
  onVote,
  disabled = false,
  variant = "updown", // 'updown' veya 'heart'
}) => {
  const formatVoteCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleVote = (direction) => {
    if (disabled || !onVote) return;
    onVote(direction);
  };

  if (variant === "heart") {
    return (
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        onClick={() => handleVote("heart")}
        disabled={disabled}
        className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${
          userVote === "heart"
            ? "text-red-500"
            : "text-gray-500 hover:text-red-500"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {userVote === "heart" ? (
          <FaHeart size={16} />
        ) : (
          <FaRegHeart size={16} />
        )}
        <span className="text-sm font-medium">
          {formatVoteCount(likesCount)}
        </span>
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        onClick={() => handleVote("up")}
        disabled={disabled}
        className={`p-2 rounded-full transition-colors ${
          userVote === "up"
            ? "bg-accent text-white"
            : "text-gray-500 hover:bg-gray-100"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <FaArrowUp size={16} />
      </motion.button>

      <span className="font-semibold text-gray-700 min-w-[40px] text-center">
        {formatVoteCount(likesCount)}
      </span>

      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        onClick={() => handleVote("down")}
        disabled={disabled}
        className={`p-2 rounded-full transition-colors ${
          userVote === "down"
            ? "bg-red-500 text-white"
            : "text-gray-500 hover:bg-gray-100"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <FaArrowDown size={16} />
      </motion.button>
    </div>
  );
};

export default VoteComp;
