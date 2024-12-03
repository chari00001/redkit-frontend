"use client";

import React from "react";
import { useParams } from "next/navigation";
import PostCard from "@/components/PostComponents/PostCard";
import { FaUsers, FaInfoCircle } from "react-icons/fa";
import topics from "@/mockData/topics";

const TopicPage = () => {
  const params = useParams();
  const topicName = params.topicName;
  const topic = topics.find((topic) => topic.name === topicName);

  console.log(topicName);

  if (!topic) {
    return <div className="text-center mt-20">Topic not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      {/* Topic Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2 text-black">t/{topic.name}</h1>
          <p className="text-gray-600 mb-4">{topic.description}</p>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaUsers />
              <span>{topic.memberCount} members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{topic.onlineCount} online</span>
            </div>
            <div className="flex items-center gap-2">
              <FaInfoCircle />
              <span>
                Created {new Date(topic.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        {/* Posts Feed */}
        <div className="flex-1 space-y-4">
          {topic.posts.map((post) => (
            <PostCard
              key={post.id}
              text={post.text}
              image={post.image}
              author={post.author}
              timePosted={post.timePosted}
              commentCount={post.commentCount}
            />
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-bold mb-4 text-black">
              t/{topic.name} Rules
            </h2>
            <ol className="space-y-3">
              {topic.rules.map((rule, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {index + 1}. {rule}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
