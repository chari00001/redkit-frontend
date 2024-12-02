"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaFire,
  FaChartLine,
  FaStar,
  FaGamepad,
  FaMusic,
  FaFilm,
  FaTv,
  FaBook,
  FaArrowUp,
  FaReddit,
  FaCoins,
  FaShieldAlt,
  FaBroadcastTower,
  FaUserFriends,
  FaEnvelope,
  FaUserPlus,
} from "react-icons/fa";
import Link from "next/link";

const LeftComp = () => {
  const feeds = [
    { icon: <FaHome />, text: "Home", link: "/" },
    { icon: <FaFire />, text: "Popular", link: "/popular" },
    { icon: <FaArrowUp />, text: "Top Communities", link: "/top" },
    { icon: <FaEnvelope />, text: "Messages", link: "/messages" },
    { icon: <FaUserPlus />, text: "Sign Up", link: "/signup" },
  ];

  const topics = [
    { icon: <FaGamepad />, text: "Gaming", members: "120.5M", link: "/topic/gaming" },
    { icon: <FaReddit />, text: "r/AskReddit", members: "42.1M", link: "/r/askreddit" },
    { icon: <FaMusic />, text: "r/Music", members: "31.2M", link: "/r/music" },
    { icon: <FaFilm />, text: "r/Movies", members: "29.8M", link: "/r/movies" },
    { icon: <FaTv />, text: "r/Television", members: "22.4M", link: "/r/television" },
  ];

  const resources = [
    { icon: <FaCoins />, text: "Reddit Coins", link: "/coins" },
    { icon: <FaShieldAlt />, text: "Reddit Premium", link: "/premium" },
    { icon: <FaBroadcastTower />, text: "Reddit Talk", link: "/talk" },
    { icon: <FaUserFriends />, text: "Communities", link: "/communities" },
  ];

  return (
    <div className="w-64 bg-white rounded-lg p-2 h-screen overflow-y-auto">
      {/* Feeds Section */}
      <div className="mb-4">
        <div className="space-y-0.5">
          {feeds.map((feed, index) => (
            <Link href={feed.link} key={index}>
              <motion.div
                className={`w-full flex items-center gap-3 px-3 py-2 ${
                  feed.text === "Messages" || feed.text === "Sign Up" 
                    ? "text-[#D20103] hover:bg-[#D20103]/10"
                    : "text-gray-700 hover:bg-gray-100"
                } rounded-md transition-colors cursor-pointer`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-xl">{feed.icon}</span>
                <span className="text-sm font-medium">{feed.text}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Topics Section */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-gray-500 px-3 mb-1">POPULAR COMMUNITIES</h3>
        <div className="space-y-0.5">
          {topics.map((topic, index) => (
            <Link href={topic.link} key={index}>
              <motion.div
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-xl">{topic.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{topic.text}</span>
                  <span className="text-xs text-gray-500">{topic.members} members</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 px-3 mb-1">RESOURCES</h3>
        <div className="space-y-0.5">
          {resources.map((resource, index) => (
            <Link href={resource.link} key={index}>
              <motion.div
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-xl">{resource.icon}</span>
                <span className="text-sm font-medium">{resource.text}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftComp;
