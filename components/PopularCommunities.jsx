"use client";

import React from "react";
import {
  FaUsers,
  FaGamepad,
  FaMusic,
  FaFilm,
  FaCode,
  FaBook,
  FaFootballBall,
  FaFlask,
  FaUtensils,
  FaCamera,
  FaBitcoin,
  FaDumbbell,
  FaTshirt,
} from "react-icons/fa";
import { communities } from "@/mockData/communities";
import Link from "next/link";
import { useRouter } from "next/navigation";

const getCategoryIcon = (category) => {
  const icons = {
    Technology: <FaCode className="text-blue-500" />,
    Gaming: <FaGamepad className="text-purple-500" />,
    Entertainment: <FaFilm className="text-red-500" />,
    Arts: <FaMusic className="text-yellow-500" />,
    Sports: <FaFootballBall className="text-green-500" />,
    Education: <FaFlask className="text-indigo-500" />,
    Lifestyle: <FaUtensils className="text-pink-500" />,
  };
  return icons[category] || <FaUsers className="text-gray-500" />;
};

const formatMemberCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M üye`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K üye`;
  }
  return `${count} üye`;
};

const PopularCommunities = () => {
  const router = useRouter();
  const topCommunities = [...communities]
    .sort((a, b) => b.member_count - a.member_count)
    .slice(0, 6);

  const handleCommunityClick = (communityName) => {
    router.push(`/community/${communityName.toLowerCase()}`);
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-sm p-4 sticky top-0 h-min text-black">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Popüler Topluluklar</h2>
        <Link
          href="/communities"
          className="text-xs text-blue-500 hover:underline cursor-pointer"
        >
          Tümünü Gör
        </Link>
      </div>

      <div className="space-y-4">
        {topCommunities.map((community) => (
          <div
            key={community.id}
            onClick={() => handleCommunityClick(community.name)}
            className="flex items-start gap-3 hover:bg-gray-50 p-3 rounded-lg cursor-pointer transition-colors duration-200"
          >
            <div className="text-2xl mt-1">
              {getCategoryIcon(community.category)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">{community.name}</h3>
                {community.is_verified && (
                  <span className="text-blue-500 text-xs">✓</span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {formatMemberCount(community.member_count)}
              </p>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {community.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCommunities;
