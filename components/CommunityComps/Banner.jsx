import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

const Banner = ({ onImageClick }) => {
  const { currentCommunity, loading } = useSelector(
    (state) => state.communities
  );
  const { isLoggedIn, currentUser } = useSelector((state) => state.auth);

  const isAdmin =
    currentCommunity &&
    currentUser &&
    (currentCommunity.creator?.id === currentUser.id ||
      currentCommunity.is_admin);

  if (loading || !currentCommunity) {
    return (
      <div className="h-48 bg-gray-300 animate-pulse relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>
    );
  }

  return (
    <div className="h-52 md:h-64 relative overflow-hidden">
      <img
        src={
          currentCommunity.cover_image_url || "https://picsum.photos/1920/400"
        }
        alt={`${currentCommunity.name} kapak görseli`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

      {isAdmin && onImageClick && (
        <motion.button
          className="absolute bottom-4 right-4 bg-white/90 text-gray-800 p-3 rounded-full shadow-md z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onImageClick}
        >
          <FaCamera size={18} />
        </motion.button>
      )}

      <div className="absolute bottom-4 left-4 md:left-8 z-10">
        <h1 className="text-white text-2xl md:text-3xl font-bold drop-shadow-md">
          r/{currentCommunity.name}
        </h1>
        {currentCommunity.is_verified && (
          <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
            Doğrulanmış
          </span>
        )}
        <p className="text-white/90 text-sm md:text-base mt-1 drop-shadow-md max-w-xl line-clamp-1">
          {currentCommunity.description}
        </p>
      </div>
    </div>
  );
};

export default Banner;
