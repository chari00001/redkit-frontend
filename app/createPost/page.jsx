"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaImage,
  FaLink,
  FaFont,
  FaTimes,
  FaEye,
  FaUsers,
  FaTags,
  FaGlobe,
  FaLock,
  FaUserFriends,
  FaUpload,
  FaCloudUploadAlt,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  postService,
  communityService,
  interactionService,
  userService,
} from "@/services/apiService";

const CreatePost = () => {
  const router = useRouter();
  const { currentUser, isLoggedIn } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  // Form state
  const [postType, setPostType] = useState("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [allowComments, setAllowComments] = useState(true);

  // Upload approach selection
  const [uploadApproach, setUploadApproach] = useState("direct"); // 'direct' veya 'separate'

  // Data state
  const [userCommunities, setUserCommunities] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Loading states
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  // Authentication debug
  const [authDebug, setAuthDebug] = useState(null);

  // File validation
  const validateFile = (file) => {
    if (!file) return false;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Desteklenmeyen dosya formatı. JPEG, PNG, GIF veya WebP dosyası seçin."
      );
      return false;
    }

    if (file.size > maxSize) {
      setError("Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.");
      return false;
    }

    return true;
  };

  // File selection handler
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setError("");

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setMediaUrl(previewUrl);
    }
  };

  // Separate image upload
  const handleSeparateImageUpload = async () => {
    if (!selectedFile) {
      setError("Lütfen önce bir resim seçin.");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const response = await postService.uploadImage(selectedFile);

      if (response && response.data && response.data.url) {
        setUploadedImageUrl(response.data.url);
        setMediaUrl(response.data.url);
        setSuccess("Resim başarıyla yüklendi!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error("Resim yükleme başarısız oldu");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setError(
        "Resim yüklenirken hata oluştu: " + (err.message || "Bilinmeyen hata")
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setMediaUrl("");
    setUploadedImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Kullanıcının topluluklarını ve popüler etiketleri yükle
  useEffect(() => {
    // Authentication durumunu kontrol et
    const authStatus = userService.checkAuthStatus();
    setAuthDebug(authStatus);

    if (!isLoggedIn || !currentUser) {
      console.warn("Kullanıcı giriş yapmamış, ana sayfaya yönlendiriliyor");
      router.push("/");
      return;
    }

    const loadData = async () => {
      try {
        // Kullanıcının topluluklarını çek
        setCommunitiesLoading(true);
        try {
          const communitiesResponse =
            await communityService.getUserCommunities();
          if (communitiesResponse && communitiesResponse.communities) {
            setUserCommunities(communitiesResponse.communities);
          }
        } catch (err) {
          console.error("Communities loading error:", err);
          setError("Topluluklar yüklenirken hata oluştu: " + err.message);
        } finally {
          setCommunitiesLoading(false);
        }

        // Popüler etiketleri çek
        setTagsLoading(true);
        try {
          const tagsResponse = await interactionService.getPopularTags(20);
          if (tagsResponse && Array.isArray(tagsResponse)) {
            setPopularTags(tagsResponse);
          }
        } catch (err) {
          console.error("Tags loading error:", err);
          // Tags yüklenemese bile sayfayı kullanılabilir tut
        } finally {
          setTagsLoading(false);
        }
      } catch (err) {
        console.error("Data loading error:", err);
        setError("Veriler yüklenirken hata oluştu: " + err.message);
      }
    };

    loadData();
  }, [isLoggedIn, currentUser, router]);

  // Tag ekleme
  const addTag = () => {
    if (
      currentTag.trim() &&
      !tags.includes(currentTag.trim()) &&
      tags.length < 10
    ) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  // Tag kaldırma
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Popüler tag'dan ekleme
  const addPopularTag = (tag) => {
    if (!tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
    }
  };

  // Form submit - Handle both approaches
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Authentication durumunu kontrol et
      let authStatus = userService.checkAuthStatus();

      // Eğer localStorage'da token yoksa ama Redux'da currentUser varsa, fallback yap
      if (!authStatus && currentUser) {
        authStatus = userService.createFallbackAuth(currentUser);
      }

      // Son kontrol - ne authStatus ne de currentUser varsa hata ver
      if (!authStatus && !currentUser) {
        throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      }

      // Form validation
      if (!title.trim()) {
        throw new Error("Başlık gereklidir");
      }

      if (postType === "text" && !content.trim()) {
        throw new Error("İçerik gereklidir");
      }

      if (postType === "image") {
        if (uploadApproach === "direct" && !selectedFile) {
          throw new Error("Resim dosyası seçmeniz gerekiyor");
        }
        if (
          uploadApproach === "separate" &&
          !uploadedImageUrl &&
          !mediaUrl.trim()
        ) {
          throw new Error("Önce resmi yükleyin veya resim URL'si girin");
        }
      }

      if (postType === "link" && !mediaUrl.trim()) {
        throw new Error("Bağlantı URL'si gereklidir");
      }

      let response;

      // Handle different post creation approaches
      if (postType === "image" && uploadApproach === "direct" && selectedFile) {
        // Approach 1: Direct upload with post creation using /with-image
        const formData = new FormData();

        // API dokümentasyonuna göre zorunlu alanlar
        formData.append("title", title.trim());
        formData.append("content", content.trim() || title.trim()); // Content zorunlu, yoksa title kullan
        formData.append("image", selectedFile);

        // Opsiyonel alanlar - API dokümentasyonuna göre
        formData.append("visibility", visibility);
        formData.append("allow_comments", allowComments ? "true" : "false"); // String olarak gönder

        // Tags JSON string olarak gönderilmeli
        if (tags.length > 0) {
          formData.append("tags", JSON.stringify(tags));
        }

        // Community ID string olarak gönder (FormData için)
        if (selectedCommunity) {
          formData.append("community_id", selectedCommunity);
        }

        response = await postService.createPostWithImage(formData);
      } else {
        // Approach 2: Regular JSON post creation
        const postData = {
          title: title.trim(),
          content:
            postType === "text"
              ? content.trim()
              : content.trim() || title.trim(),
          type: postType,
          visibility,
          tags: tags.length > 0 ? tags : [],
          allow_comments: allowComments,
        };

        // Add media URL if available
        if (postType === "image" && (uploadedImageUrl || mediaUrl)) {
          postData.media_url = uploadedImageUrl || mediaUrl;
        } else if (postType === "link" && mediaUrl.trim()) {
          postData.media_url = mediaUrl.trim();
        }

        // Add community ID if selected
        if (selectedCommunity) {
          postData.community_id = parseInt(selectedCommunity);
        }

        // Add author ID
        postData.author_id = currentUser?.id || authStatus?.user?.id;

        // Clean null/undefined values
        Object.keys(postData).forEach((key) => {
          if (
            postData[key] === null ||
            postData[key] === undefined ||
            postData[key] === ""
          ) {
            delete postData[key];
          }
        });

        response = await postService.createPost(postData);
      }

      // Response validation
      if (response) {
        const isSuccess =
          response.success === true ||
          response.status === "success" ||
          response.id ||
          response.data?.id ||
          response.message?.includes("başarı") ||
          response.message?.includes("success") ||
          response.message?.includes("oluşturuldu");

        if (isSuccess) {
          setSuccess("Gönderi başarıyla oluşturuldu!");

          // Etiketler için etkileşim kaydet
          const userId = currentUser?.id || authStatus?.user?.id;
          if (userId && tags.length > 0) {
            for (const tag of tags) {
              try {
                await interactionService.addInteraction(userId, tag, "post");
              } catch (interactionErr) {
                console.warn("Interaction recording failed:", interactionErr);
              }
            }
          }

          // Başarılı animasyonu göster ve yönlendir
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          throw new Error(
            response?.message ||
              response?.error ||
              response?.data?.error ||
              "Gönderi oluşturulamadı - API yanıtı geçersiz"
          );
        }
      } else {
        throw new Error("API'den yanıt alınamadı");
      }
    } catch (err) {
      console.error("Post creation error:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });

      // Farklı hata türleri için özel handling
      if (
        err.message.includes("Oturum süresi") ||
        err.message.includes("giriş yapın")
      ) {
        setError("Oturum süresi dolmuş. Sayfayı yenileyip tekrar giriş yapın.");
      } else if (
        err.message.includes("400") ||
        err.message.includes("Bad Request") ||
        err.message.includes("Doğrulama hatası") ||
        err.response?.status === 400
      ) {
        const errorDetail = err.response?.data?.message || err.message;
        setError(
          `Gönderi verilerinde hata: ${errorDetail}. Lütfen tüm alanları kontrol edin.`
        );
      } else if (
        err.message.includes("404") ||
        err.message.includes("Not Found") ||
        err.response?.status === 404
      ) {
        setError(
          "Post servisi bulunamadı. Backend servisinin çalıştığından emin olun."
        );
      } else if (
        err.message.includes("Network Error") ||
        err.message.includes("ECONNABORTED") ||
        err.code === "ERR_NETWORK"
      ) {
        setError(
          "Bağlantı hatası. İnternet bağlantınızı ve backend servisini kontrol edin."
        );
      } else {
        setError(err.message || "Gönderi oluşturulurken bir hata oluştu");
      }
    } finally {
      setLoading(false);
    }
  };

  // Preview component
  const PostPreview = () => {
    const previewContent = postType === "text" ? content : content || title;
    const previewMediaUrl = uploadedImageUrl || mediaUrl;

    return (
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.profile_picture_url || "/api/placeholder/40/40"}
            alt={currentUser?.username}
            className="w-10 h-10 rounded-full bg-gray-200"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMkMyMi4yMDkxIDIyIDI0IDIwLjIwOTEgMjQgMThDMjQgMTUuNzkwOSAyMi4yMDkxIDE0IDIwIDE0QzE3Ljc5MDkgMTQgMTYgMTUuNzkwOSAxNiAxOEMxNiAyMC4yMDkxIDE3Ljc5MDkgMjIgMjAgMjJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yMCAyNEMxNS41ODE3IDI0IDEyIDI3LjU4MTcgMTIgMzJIMjhDMjggMjcuNTgxNyAyNC40MTgzIDI0IDIwIDI0WiIgZmlsbD0iIzlCOUJBMCIvPgo8L3N2Zz4K";
            }}
          />
          <div>
            <p className="font-semibold text-gray-800">
              {currentUser?.username || "Kullanıcı"}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {visibility === "public" && (
                <>
                  <FaGlobe className="w-3 h-3" /> Herkese açık
                </>
              )}
              {visibility === "private" && (
                <>
                  <FaLock className="w-3 h-3" /> Özel
                </>
              )}
              {visibility === "followers" && (
                <>
                  <FaUserFriends className="w-3 h-3" /> Takipçiler
                </>
              )}
              {selectedCommunity && (
                <>
                  <span>•</span>
                  <FaUsers className="w-3 h-3" />
                  {
                    userCommunities.find(
                      (c) => c.id.toString() === selectedCommunity
                    )?.name
                  }
                </>
              )}
            </div>
          </div>
        </div>

        {title && (
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        )}

        {postType === "text" && content && (
          <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
        )}

        {postType === "image" && previewMediaUrl && (
          <div className="relative">
            <img
              src={previewMediaUrl}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {selectedFile && !uploadedImageUrl && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                Yüklenecek
              </div>
            )}
            {uploadedImageUrl && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                Yüklendi
              </div>
            )}
          </div>
        )}

        {postType === "link" && previewMediaUrl && (
          <div className="border rounded-lg p-3 bg-gray-50">
            <FaLink className="inline mr-2" />
            <a
              href={previewMediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {previewMediaUrl}
            </a>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={`current-tag-${index}-${tag}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 mt-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-800 mb-8"
            >
              Gönderi Oluştur
            </motion.h1>

            {/* Success/Error Messages */}
            <AnimatePresence mode="wait">
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
                >
                  {success}
                </motion.div>
              )}

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

              {/* Debug Info (Development only) */}
              {process.env.NODE_ENV === "development" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm"
                >
                  <strong>Debug - Auth Status:</strong>
                  <br />
                  <strong>localStorage authState:</strong>
                  <br />
                  &nbsp;&nbsp;Token: {authDebug?.token ? "✅ Mevcut" : "❌ Yok"}
                  <br />
                  &nbsp;&nbsp;User: {authDebug?.user?.username || "N/A"}
                  <br />
                  &nbsp;&nbsp;Authenticated:{" "}
                  {authDebug?.isAuthenticated ? "✅" : "❌"}
                  <br />
                  <strong>Redux currentUser:</strong>
                  <br />
                  &nbsp;&nbsp;Username: {currentUser?.username || "❌ Yok"}
                  <br />
                  &nbsp;&nbsp;ID: {currentUser?.id || "❌ Yok"}
                  <br />
                  &nbsp;&nbsp;isLoggedIn: {isLoggedIn ? "✅" : "❌"}
                  <br />
                  <strong>Status:</strong>{" "}
                  {!authDebug && currentUser
                    ? "🔄 Fallback mode"
                    : authDebug
                    ? "✅ Normal"
                    : "❌ No auth"}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Post Type Selection */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-wrap gap-4">
                {[
                  { type: "text", icon: FaFont, label: "Metin" },
                  { type: "image", icon: FaImage, label: "Görsel" },
                  { type: "link", icon: FaLink, label: "Bağlantı" },
                ].map(({ type, icon: Icon, label }) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                      postType === type
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-white text-gray-700 shadow-md hover:shadow-lg"
                    }`}
                    onClick={() => {
                      setPostType(type);
                      if (type !== "image") {
                        removeSelectedFile();
                      }
                    }}
                  >
                    <Icon /> {label}
                  </motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  placeholder="Başlık"
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 text-gray-700 text-lg transition-all duration-200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  maxLength={300}
                />
              </motion.div>

              {/* Content based on post type */}
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
                      className="w-full p-4 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 text-gray-700 transition-all duration-200"
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
                    {/* Upload Approach Selection */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-3">
                        Resim yükleme yöntemi:
                      </p>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="uploadApproach"
                            value="direct"
                            checked={uploadApproach === "direct"}
                            onChange={(e) => setUploadApproach(e.target.value)}
                            className="text-blue-500"
                          />
                          <span className="text-sm text-blue-700">
                            Doğrudan gönderi ile yükle
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="uploadApproach"
                            value="separate"
                            checked={uploadApproach === "separate"}
                            onChange={(e) => setUploadApproach(e.target.value)}
                            className="text-blue-500"
                          />
                          <span className="text-sm text-blue-700">
                            Önce resmi yükle
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      {!selectedFile ? (
                        <div>
                          <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-4">
                            Resim seçin veya sürükleyip bırakın
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            JPEG, PNG, GIF, WebP - Maksimum 5MB
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all"
                          >
                            <FaUpload className="inline mr-2" />
                            Dosya Seç
                          </motion.button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FaImage className="text-orange-500" />
                              <div className="text-left">
                                <p className="font-medium text-gray-800">
                                  {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeSelectedFile}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <FaTrash />
                            </button>
                          </div>

                          {uploadApproach === "separate" &&
                            !uploadedImageUrl && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={handleSeparateImageUpload}
                                disabled={uploadingImage}
                                className={`w-full py-3 rounded-lg font-medium transition-all ${
                                  uploadingImage
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                } text-white`}
                              >
                                {uploadingImage ? (
                                  <>
                                    <motion.span
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                      }}
                                      className="inline-block mr-2"
                                    >
                                      ⏳
                                    </motion.span>
                                    Yükleniyor...
                                  </>
                                ) : (
                                  <>
                                    <FaUpload className="inline mr-2" />
                                    Resmi Şimdi Yükle
                                  </>
                                )}
                              </motion.button>
                            )}

                          {uploadedImageUrl && (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
                              ✅ Resim başarıyla yüklendi!
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Optional content for image posts */}
                    <textarea
                      placeholder="Resim açıklaması (isteğe bağlı)..."
                      className="w-full p-4 border border-gray-200 rounded-lg h-20 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 text-gray-700 transition-all duration-200"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      maxLength={1000}
                    />
                  </motion.div>
                )}

                {postType === "link" && (
                  <motion.div
                    key="link"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <input
                      type="url"
                      placeholder="Bağlantı URL'si"
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 text-gray-700 transition-all duration-200"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Bağlantı açıklaması (isteğe bağlı)..."
                      className="w-full p-4 border border-gray-200 rounded-lg h-20 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 text-gray-700 transition-all duration-200"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      maxLength={1000}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Community Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  <FaUsers className="inline mr-2" />
                  Topluluk (İsteğe bağlı)
                </label>
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 text-gray-700"
                  disabled={communitiesLoading}
                >
                  <option value="">Profilimde paylaş</option>
                  {userCommunities.map((community) => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
                {communitiesLoading && (
                  <p className="text-sm text-gray-500">
                    Topluluklar yükleniyor...
                  </p>
                )}
              </motion.div>

              {/* Tags Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <label className="block text-sm font-medium text-gray-700">
                  <FaTags className="inline mr-2" />
                  Etiketler (Maksimum 10)
                </label>

                {/* Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Etiket ekle..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-gray-50 text-gray-700"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!currentTag.trim() || tags.length >= 10}
                    className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Ekle
                  </button>
                </div>

                {/* Current Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={`current-tag-${index}-${tag}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Popular Tags */}
                {popularTags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Popüler etiketler:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.slice(0, 10).map((tagObj, index) => (
                        <button
                          key={`popular-tag-${index}-${tagObj.tag || tagObj}`}
                          type="button"
                          onClick={() => addPopularTag(tagObj.tag || tagObj)}
                          disabled={
                            tags.includes(tagObj.tag || tagObj) ||
                            tags.length >= 10
                          }
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          #{tagObj.tag || tagObj}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Privacy & Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="font-medium text-gray-800">
                  Gizlilik ve Ayarlar
                </h3>

                {/* Visibility */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Görünürlük
                  </label>
                  <div className="flex gap-4">
                    {[
                      { value: "public", icon: FaGlobe, label: "Herkese açık" },
                      {
                        value: "followers",
                        icon: FaUserFriends,
                        label: "Takipçiler",
                      },
                      { value: "private", icon: FaLock, label: "Özel" },
                    ].map(({ value, icon: Icon, label }) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={value}
                          checked={visibility === value}
                          onChange={(e) => setVisibility(e.target.value)}
                          className="text-orange-500"
                        />
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Allow Comments */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowComments}
                    onChange={(e) => setAllowComments(e.target.checked)}
                    className="text-orange-500"
                  />
                  <span className="text-sm text-gray-700">
                    Yorumlara izin ver
                  </span>
                </label>
              </motion.div>

              {/* Submit Buttons */}
              <motion.div
                className="flex justify-between gap-4 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  <FaEye />
                  {showPreview ? "Formu Göster" : "Önizleme"}
                </button>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200"
                    onClick={() => router.push("/")}
                    disabled={loading || uploadingImage}
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      loading || uploadingImage
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl"
                    } text-white flex items-center gap-2`}
                    disabled={loading || uploadingImage}
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
                </div>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden lg:sticky lg:top-4 lg:h-fit"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaEye />
              Önizleme
            </h2>

            {title || content || mediaUrl || selectedFile ? (
              <PostPreview />
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  Gönderinizi yazmaya başladığınızda önizleme burada görünecek
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreatePost;
