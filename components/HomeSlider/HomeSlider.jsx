"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaArrowUp,
  FaComment,
} from "react-icons/fa";
import styles from "./HomeSlider.module.css";
import { posts } from "@/mockData/posts";

const HomeSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // En çok etkileşim alan (upvotes + comments) 4 postu seç
  const featuredPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.upvotes + b.comments - (a.upvotes + a.comments))
      .slice(0, 4)
      .map((post) => ({
        id: post.id,
        title: post.title,
        subtitle: post.content.slice(0, 100) + "...",
        image: post.media_url || "https://picsum.photos/1200/400",
        community: post.community?.name || "Genel",
        author: post.author,
        upvotes: post.upvotes,
        comments: post.comments,
      }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === featuredPosts.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setCurrentSlide((prev) => {
      if (newDirection === 1) {
        return prev === featuredPosts.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? featuredPosts.length - 1 : prev - 1;
    });
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl bg-gray-100">
      <AnimatePresence initial={false} custom={currentSlide}>
        <motion.div
          key={currentSlide}
          custom={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full h-full cursor-grab active:cursor-grabbing"
          onClick={() => router.push(`/post/${featuredPosts[currentSlide].id}`)}
        >
          <div className="relative w-full h-full">
            <img
              src={featuredPosts[currentSlide].image}
              alt={featuredPosts[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                    {featuredPosts[currentSlide].author?.profile_picture_url ? (
                      <img
                        src={
                          featuredPosts[currentSlide].author.profile_picture_url
                        }
                        alt={featuredPosts[currentSlide].author.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-white/80" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium opacity-90">
                      {featuredPosts[currentSlide].author?.username || "Anonim"}
                    </h3>
                    <p className="text-xs opacity-70">
                      {featuredPosts[currentSlide].community}
                    </p>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {featuredPosts[currentSlide].title}
                </h2>
                <p className="text-sm opacity-90 mb-3">
                  {featuredPosts[currentSlide].subtitle}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaArrowUp />
                    <span>
                      {featuredPosts[currentSlide].upvotes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaComment />
                    <span>
                      {featuredPosts[currentSlide].comments.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          paginate(-1);
        }}
      >
        <FaArrowLeft />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          paginate(1);
        }}
      >
        <FaArrowRight />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredPosts.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlider;
