"use client";

import React from 'react';
import { motion } from 'framer-motion';
import PostCard from '@/components/PostComponents/PostCard';

const mockCommunity = { 
  id: 1,
  creator_id: 123,
  name: "Programming",
  description: "A community for programming enthusiasts",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-10-20T00:00:00Z", 
  visibility: "public",
  member_count: 1500,
  is_verified: true,
  rules: "1. Be respectful\n2. No spam\n3. Stay on topic",
  post_count: 450,
  tags: ["programming", "coding", "tech"],
  is_featured: true,
  cover_image_url: "https://picsum.photos/1920/400"
};

const mockPosts = [
  {
    id: 1,
    title: "Best Programming Languages in 2023",
    content: "Here's my take on the most in-demand programming languages this year...",
    upvotes: 234,
    comments: 45,
    created_at: "2023-10-15",
    author: {
      username: "CodeMaster",
      profile_picture_url: "https://i.pravatar.cc/300"
    }
  },
  {
    id: 2,
    title: "Tips for Clean Code",
    content: "Let's discuss some essential principles for writing maintainable code...",
    upvotes: 567,
    comments: 89,
    created_at: "2023-10-14",
    author: {
      username: "CleanCoder",
      profile_picture_url: "https://i.pravatar.cc/301"
    }
  }
];

const Community = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      {/* Cover Image */}
      <div className="h-48 relative">
        <img
          src={mockCommunity.cover_image_url}
          alt={mockCommunity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative -mt-32">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2 text-black">
                r/{mockCommunity.name}
                {mockCommunity.is_verified && (
                  <span className="text-blue-600 text-xl">✓</span>
                )}
              </h1>
              <p className="text-gray-700 mt-2">{mockCommunity.description}</p>
            </div>
            
            <motion.button
              className="px-6 py-2 bg-orange-500 text-white rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Community
            </motion.button>
          </div>

          <div className="flex gap-4 mt-4 text-sm text-gray-700">
            <span>{mockCommunity.member_count.toLocaleString()} members</span>
            <span>{mockCommunity.post_count} posts</span>
            <span>Created {new Date(mockCommunity.created_at).toLocaleDateString()}</span>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-black">Tags:</h3>
            <div className="flex gap-2">
              {mockCommunity.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-black">Rules:</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {mockCommunity.rules}
            </pre>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Posts</h2>
          {mockPosts.map(post => (
            <PostCard 
              key={post.id}
              text={post.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;