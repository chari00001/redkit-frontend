import React from "react";
import { FaComment } from "react-icons/fa";
import { motion } from "framer-motion";

const CommentComp = ({
  commentsCount = 0,
  isActive = false,
  onClick,
  disabled = false,
}) => {
  const formatCommentCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors ${
        isActive ? "bg-accent text-white" : "text-gray-500 hover:bg-gray-100"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <FaComment size={16} />
      <span className="text-sm font-medium">
        {formatCommentCount(commentsCount)}
      </span>
    </motion.button>
  );
};

export default CommentComp;
