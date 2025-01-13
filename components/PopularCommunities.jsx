import React from "react";
import { FaUsers, FaGamepad, FaMusic, FaFilm, FaCode } from "react-icons/fa";
import { communities } from "@/mockData/communities";

const PopularCommunities = () => {
  return (
    <div className="w-80 bg-white rounded-lg shadow-sm p-4 sticky top-0 h-min text-black">
      <h2 className="text-base font-medium mb-4">Popular Communities</h2>

      <div className="space-y-4">
        {communities.map((community, index) => (
          <div
            key={index}
            className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
          >
            <div className="text-gray-500 mt-1">{community.icon}</div>
            <div>
              <h3 className="text-sm font-medium">{community.name}</h3>
              <p className="text-xs text-gray-500">{community.members}</p>
              <p className="text-xs text-gray-600 mt-1">
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
