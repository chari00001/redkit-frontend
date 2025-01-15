"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp, FaComment, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { posts } from "@/mockData/posts";

const PopularSlider = () => {
  const router = useRouter();

  // En çok oy alan 5 postu al ve sırala
  const popularPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
  }, []);

  console.log(popularPosts);

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="w-72 bg-white rounded-xl shadow-lg p-4 h-screen sticky top-14"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h3
        className="text-xl font-bold mb-6 text-gray-800 border-b pb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        🔥 Popüler Gönderiler
      </motion.h3>

      <div className="space-y-4">
        <AnimatePresence>
          {popularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(243, 244, 246, 0.8)",
              }}
              whileTap={{ scale: 0.98 }}
              className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-100 transition-all duration-200"
              onClick={() => router.push(`/post/${post.id}`)}
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { delay: index * 0.1 },
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    {post.author?.profile_picture_url ? (
                      <img
                        src={post.author.profile_picture_url}
                        alt={post.author.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-accent" />
                    )}
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 mb-1 truncate">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaArrowUp className="text-accent" />
                      <span>{post.upvotes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaComment className="text-gray-400" />
                      <span>{post.comments.toLocaleString()}</span>
                    </div>
                    {post.community && (
                      <span className="text-xs text-accent font-medium truncate">
                        {post.community.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PopularSlider;
