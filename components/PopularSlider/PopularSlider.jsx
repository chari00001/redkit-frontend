"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaComment } from 'react-icons/fa';

const PopularSlider = () => {
  const popularPosts = [
    {
      id: 1,
      title: "The Future of AI",
      upvotes: 15234,
      comments: 1245,
    },
    {
      id: 2,
      title: "Web Development Trends 2024", 
      upvotes: 12567,
      comments: 834,
    },
    {
      id: 3,
      title: "Beginner's Guide to Crypto",
      upvotes: 10892,
      comments: 756,
    }
  ];

  return (
    <div className="w-72 bg-white rounded-lg shadow-sm p-4 h-screen sticky top-14">
      <h3 className="text-lg font-semibold mb-4">Trending Posts</h3>
      <div className="space-y-4">
        {popularPosts.map((post) => (
          <motion.div
            key={post.id}
            className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h4 className="text-sm font-medium text-gray-800 mb-2">{post.title}</h4>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FaArrowUp />
                <span>{post.upvotes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaComment />
                <span>{post.comments.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PopularSlider;