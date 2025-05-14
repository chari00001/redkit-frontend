"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaRegCalendarAlt,
} from "react-icons/fa";
import PostCard from "@/components/PostComponents/PostCard";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import { postService } from "@/services/apiService";
import { useSelector, useDispatch } from "react-redux";

// Dummy post verileri - API çalışmazsa
const dummyPosts = [
  {
    id: 1,
    title: "Redux store ile ilgili deneme gönderisi",
    content:
      "Kullanıcı verileri Redux store'dan geliyorsa bu gönderi görünecek...",
    media_url: null,
    tags: ["test", "redux"],
    likes_count: 42,
    comments_count: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "API bağlantısı olmadığında bu gönderiler görünecek",
    content:
      "Bu örnek gönderiler API çalışmadığında devreye girer ve kullanıcı deneyimini sürdürür.",
    media_url: "https://picsum.photos/800/400",
    tags: ["deneme", "uygulama"],
    likes_count: 23,
    comments_count: 4,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 gün öncesi
  },
];

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser, isLoggedIn, token } = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    // Sayfa yüklendiğinde Redux store'daki kullanıcı bilgilerini kontrol et ve konsola yaz
    console.log("Redux store'dan gelen kullanıcı verisi:", currentUser);
    console.log("Kullanıcı giriş durumu:", isLoggedIn);
    console.log("Kullanıcı token:", token);

    // LocalStorage'dan token'ı kontrol et
    const savedToken = localStorage.getItem("token");
    console.log("LocalStorage'dan alınan token:", savedToken);

    // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
    if (!isLoggedIn || !currentUser) {
      console.warn("Kullanıcı giriş yapmamış, ana sayfaya yönlendiriliyor");
      router.push("/");
      return;
    }

    // Kullanıcı ID'si kontrolü - dummy bir ID verisi yaratılıyor
    if (!currentUser.id) {
      console.warn("Kullanıcı ID'si bulunamadı, geçici ID oluşturuluyor");
      // Geçici ID kullan (gerçek uygulamada bu şekilde yapılmamalı)
      currentUser.id = 1;
    }

    const fetchUserPosts = async () => {
      try {
        setLoading(true);

        // Kullanıcının gönderilerini getir
        if (currentUser.id) {
          try {
            console.log(
              `Kullanıcı gönderileri isteniyor, user ID: ${currentUser.id}`
            );
            const postsResponse = await postService.getUserPosts(
              currentUser.id
            );

            console.log("API yanıtı (gönderiler):", postsResponse);

            if (postsResponse && postsResponse.success) {
              // API yanıt formatına göre posts verisini seç
              const posts =
                postsResponse.posts ||
                postsResponse.data?.posts ||
                postsResponse.data ||
                [];
              console.log("İşlenmiş gönderiler:", posts);
              setUserPosts(posts);
            } else {
              console.warn(
                "API yanıtı başarılı değil veya yanlış format:",
                postsResponse
              );
              setPostsError("Gönderiler yüklenemedi - API yanıtı geçersiz");
              // API veri sağlamazsa dummy verileri göster
              setUserPosts(dummyPosts);
            }
          } catch (err) {
            console.error("Gönderileri yükleme hatası:", err);
            setPostsError(`Gönderiler yüklenemedi: ${err.message}`);
            // Hata durumunda dummy verileri göster
            setUserPosts(dummyPosts);
          }
        } else {
          console.warn("Kullanıcı ID'si bulunamadı:", currentUser);
          setPostsError("Kullanıcı ID'si bulunamadı, gönderiler yüklenemedi");
          setUserPosts(dummyPosts);
        }
      } catch (err) {
        console.error("Genel hata:", err);
        setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [isLoggedIn, currentUser, router]);

  // Yükleniyor durumunu göster
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  // Kritik hata durumunda hata mesajı göster
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-orange-500 text-white rounded-full"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  // Kullanıcı yoksa
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-700 mb-4">
            Kullanıcı bulunamadı veya oturum sona erdi.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-orange-500 text-white rounded-full"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  // Redux store'daki kullanıcı verilerini konsola yazdıralım
  console.log("Profil sayfasında kullanıcı verileri:", currentUser);
  console.log("Kullanıcı giriş durumu:", isLoggedIn);
  console.log("Kullanıcı token'ı:", token);

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-orange-400 to-orange-600 relative">
        <img
          src="https://picsum.photos/1920/400"
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="bg-white rounded-lg shadow-md -mt-20 p-6">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={
                  currentUser.profile_picture_url ||
                  "https://via.placeholder.com/150"
                }
                alt={currentUser.username}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              {currentUser.is_verified && (
                <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                  ✓
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  {currentUser.username || "Kullanıcı"}
                </h1>
                <motion.button
                  className="px-4 py-2 bg-orange-500 text-white rounded-full flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/profile/edit")}
                >
                  <FaEdit /> Profili Düzenle
                </motion.button>
              </div>

              <p className="text-gray-600 mt-2">
                {currentUser.bio || "Henüz bir bio eklenmemiş."}
              </p>

              <div className="flex items-center gap-6 mt-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt />{" "}
                  {currentUser.location || "Konum belirtilmemiş"}
                </span>
                <span className="flex items-center gap-2">
                  <FaBirthdayCake /> Takipçi: {currentUser.follower_count || 0}
                </span>
                <span className="flex items-center gap-2">
                  <FaRegCalendarAlt /> Takip: {currentUser.following_count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Gönderiler</h2>
            {postsError && (
              <span className="text-red-500 text-sm">{postsError}</span>
            )}
          </div>

          {userPosts && userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                author={{
                  username: currentUser.username || "Kullanıcı",
                  profile_picture_url:
                    currentUser.profile_picture_url ||
                    "https://via.placeholder.com/150",
                }}
              />
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600">Henüz gönderi bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
