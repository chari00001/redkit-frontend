"use client";

import React from 'react';
import PostCard from '@/components/PostComponents/PostCard';
import PopularSlider from '@/components/PopularSlider/PopularSlider';

const mockPopularPosts = [
  {
    id: 1,
    title: "The Future of AI",
    content: "Artificial Intelligence is revolutionizing every industry...",
    upvotes: 15234,
    comments: 1245,
    created_at: "2023-10-18",
    author: {
      username: "AIEnthusiast",
      profile_picture_url: "https://i.pravatar.cc/302"
    }
  },
  {
    id: 2, 
    title: "Web Development Trends 2024",
    content: "Here are the top web development trends to watch out for...",
    upvotes: 12567,
    comments: 834,
    created_at: "2023-10-17",
    author: {
      username: "WebDev_Pro",
      profile_picture_url: "https://i.pravatar.cc/303"
    }
  },
  {
    id: 3,
    title: "Beginner's Guide to Crypto",
    content: "Everything you need to know about cryptocurrency as a beginner...", 
    upvotes: 10892,
    comments: 756,
    created_at: "2023-10-16",
    author: {
      username: "CryptoGuru",
      profile_picture_url: "https://i.pravatar.cc/304"
    }
  }
];

const Popular = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      <div className="max-w-5xl mx-auto px-4">
        <div className="py-6 flex gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Popular Posts</h1>
            <div className="space-y-4">
              {mockPopularPosts.map(post => (
                <PostCard
                  key={post.id}
                  text={post.content}
                />
              ))}
            </div>
          </div>
          <PopularSlider />
        </div>
      </div>
    </div>
  );
};

export default Popular;