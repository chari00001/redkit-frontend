"use client";

import React, { useState } from "react";
import { FaImage, FaLink, FaFont, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setPosts } from "@/store/features/postsSlice";
import { posts } from "@/mockData/posts";

const CreatePost = () => {
  const [postType, setPostType] = useState("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newPost = {
        id: Date.now().toString(),
        title,
        content:
          postType === "text"
            ? content
            : postType === "image"
            ? imageUrl
            : link,
        type: postType,
        author: {
          id: "1",
          username: "currentUser",
          avatar: "/avatars/default.png",
        },
        createdAt: new Date().toISOString(),
        votes: 0,
        commentCount: 0,
      };

      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedPosts = [newPost, ...posts];
      dispatch(setPosts(updatedPosts));

      // Başarılı animasyonu göster ve sonra yönlendir
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err) {
      setError(
        "Gönderi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 mt-10"
    >
      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        variants={formVariants}
      >
        <div className="p-6 sm:p-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800 mb-8"
          >
            Gönderi Oluştur
          </motion.h1>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between"
              >
                <span>{error}</span>
                <button
                  onClick={() => setError("")}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  postType === "text"
                    ? "bg-accent text-white shadow-lg"
                    : "bg-white text-gray-700 shadow-md hover:shadow-lg"
                }`}
                onClick={() => setPostType("text")}
              >
                <FaFont /> Metin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  postType === "image"
                    ? "bg-accent text-white shadow-lg"
                    : "bg-white text-gray-700 shadow-md hover:shadow-lg"
                }`}
                onClick={() => setPostType("image")}
              >
                <FaImage /> Görsel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  postType === "link"
                    ? "bg-accent text-white shadow-lg"
                    : "bg-white text-gray-700 shadow-md hover:shadow-lg"
                }`}
                onClick={() => setPostType("link")}
              >
                <FaLink /> Bağlantı
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="Başlık"
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-gray-50 text-gray-700 text-lg transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                maxLength={300}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {postType === "text" && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <textarea
                    placeholder="Düşüncelerini paylaş..."
                    className="w-full p-4 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-gray-50 text-gray-700 transition-all duration-200"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={40000}
                  />
                </motion.div>
              )}

              {postType === "image" && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <input
                    type="url"
                    placeholder="Görsel URL'si"
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-gray-50 text-gray-700 transition-all duration-200"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                  <AnimatePresence>
                    {imageUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative rounded-lg overflow-hidden bg-gray-100 p-2"
                      >
                        <img
                          src={imageUrl}
                          alt="Önizleme"
                          className="w-full max-h-80 object-contain rounded-lg"
                          onError={() => setError("Geçersiz görsel URL'si")}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {postType === "link" && (
                <motion.div
                  key="link"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="url"
                    placeholder="Bağlantı URL'si"
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-gray-50 text-gray-700 transition-all duration-200"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="flex justify-end gap-4 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200"
                onClick={() => router.push("/")}
                disabled={loading}
              >
                İptal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-accent hover:bg-accent/90 shadow-lg hover:shadow-xl"
                } text-white flex items-center gap-2`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block"
                    >
                      ⏳
                    </motion.span>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  "Paylaş"
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreatePost;
