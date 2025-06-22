"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaRegCalendarAlt,
  FaUsers,
  FaHeart,
  FaTags,
  FaShare,
} from "react-icons/fa";
import PostCard from "@/components/PostComponents/PostCard";
import { useRouter } from "next/navigation";
import {
  userService,
  postService,
  communityService,
  interactionService,
} from "@/services/apiService";
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

  // State'ler
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userInteractions, setUserInteractions] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [interactionsLoading, setInteractionsLoading] = useState(false);

  // Error states
  const [error, setError] = useState(null);
  const [postsError, setPostsError] = useState(null);
  const [communitiesError, setCommunitiesError] = useState(null);
  const [followersError, setFollowersError] = useState(null);
  const [interactionsError, setInteractionsError] = useState(null);

  // Tab yönetimi
  const [activeTab, setActiveTab] = useState("posts");

  // Kullanıcı profil bilgilerini getir
  const fetchUserProfile = async (userId) => {
    try {
      setProfileLoading(true);

      const profileResponse = await userService.getProfile(userId);

      if (profileResponse && profileResponse.success) {
        setUserProfile(profileResponse.user || profileResponse.data);
      } else {
        console.warn("Profil API yanıtı başarılı değil:", profileResponse);
        // Redux'dan gelen currentUser'ı kullan
        setUserProfile(currentUser);
      }
    } catch (err) {
      console.error("Profil yükleme hatası:", err);
      setUserProfile(currentUser); // Fallback olarak currentUser'ı kullan
    } finally {
      setProfileLoading(false);
    }
  };

  // Kullanıcının gönderilerini getir
  const fetchUserPosts = async (userId) => {
    try {
      setPostsLoading(true);

      const postsResponse = await postService.getUserPosts(userId);

      if (postsResponse && postsResponse.success) {
        const posts =
          postsResponse.posts ||
          postsResponse.data?.posts ||
          postsResponse.data ||
          [];
        setUserPosts(posts);
        setPostsError(null);
      } else {
        console.warn("Posts API yanıtı başarılı değil:", postsResponse);
        setPostsError("Gönderiler yüklenemedi - API yanıtı geçersiz");
        setUserPosts([]);
      }
    } catch (err) {
      console.error("Gönderiler yükleme hatası:", err);

      // 404 hatası özel olarak handle et - kullanıcının postu yok demektir
      if (
        err.message &&
        (err.message.includes("404") || err.message.includes("bulunamadı"))
      ) {
        setUserPosts([]);
        setPostsError(null); // Hata gösterme, sadece boş liste göster
      } else {
        // Diğer hatalar için fallback
        setPostsError(`Gönderiler yüklenemedi: ${err.message}`);
        setUserPosts(dummyPosts);
      }
    } finally {
      setPostsLoading(false);
    }
  };

  // Kullanıcının topluluklarını getir
  const fetchUserCommunities = async (userId) => {
    try {
      setCommunitiesLoading(true);

      const communitiesResponse = await communityService.getUserCommunities(
        userId
      );

      if (communitiesResponse && communitiesResponse.communities) {
        setUserCommunities(communitiesResponse.communities);
        setCommunitiesError(null);
      } else {
        console.warn(
          "Communities API yanıtı başarılı değil:",
          communitiesResponse
        );
        setCommunitiesError("Topluluklar yüklenemedi");
        setUserCommunities([]);
      }
    } catch (err) {
      console.error("Topluluklar yükleme hatası:", err);
      setCommunitiesError(`Topluluklar yüklenemedi: ${err.message}`);
      setUserCommunities([]);
    } finally {
      setCommunitiesLoading(false);
    }
  };

  // Takipçi/Takip verilerini getir
  const fetchFollowData = async () => {
    try {
      setFollowersLoading(true);

      const [followersResponse, followingResponse] = await Promise.all([
        userService.getFollowers(),
        userService.getFollowing(),
      ]);

      if (followersResponse && followersResponse.success) {
        setFollowers(followersResponse.followers || []);
      } else {
        setFollowers([]);
      }

      if (followingResponse && followingResponse.success) {
        setFollowing(followingResponse.following || []);
      } else {
        setFollowing([]);
      }

      setFollowersError(null);
    } catch (err) {
      console.error("Takipçi/Takip verileri yükleme hatası:", err);
      setFollowersError(`Takipçi verileri yüklenemedi: ${err.message}`);
      setFollowers([]);
      setFollowing([]);
    } finally {
      setFollowersLoading(false);
    }
  };

  // Kullanıcı etkileşimlerini getir
  const fetchUserInteractions = async (userId) => {
    try {
      setInteractionsLoading(true);

      const [interactionsResponse, popularTagsResponse] = await Promise.all([
        interactionService.getUserInteractions(userId),
        interactionService.getPopularTags(10),
      ]);

      setUserInteractions(interactionsResponse || []);
      setPopularTags(popularTagsResponse || []);
      setInteractionsError(null);
    } catch (err) {
      console.error("Etkileşimler yükleme hatası:", err);
      setInteractionsError(`Etkileşimler yüklenemedi: ${err.message}`);
      setUserInteractions([]);
      setPopularTags([]);
    } finally {
      setInteractionsLoading(false);
    }
  };

  // Post beğenme fonksiyonu
  const handleLikePost = async (postId) => {
    try {
      const likeResponse = await postService.likePost(postId);

      // Post listesini güncelle
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes_count: post.likes_count + 1 }
            : post
        )
      );
    } catch (err) {
      console.error("Post beğeni hatası:", err);
    }
  };

  // Post paylaşma fonksiyonu
  const handleSharePost = async (postId) => {
    try {
      const shareResponse = await postService.sharePost(postId);

      // Post listesini güncelle
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, shares_count: (post.shares_count || 0) + 1 }
            : post
        )
      );
    } catch (err) {
      console.error("Post paylaşım hatası:", err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      console.warn("Kullanıcı giriş yapmamış, ana sayfaya yönlendiriliyor");
      router.push("/");
      return;
    }

    if (!currentUser.id) {
      console.warn("Kullanıcı ID'si bulunamadı, geçici ID oluşturuluyor");
      currentUser.id = 1;
    }

    const loadProfileData = async () => {
      try {
        setLoading(true);
        const userId = currentUser.id;

        // Tüm profil verilerini paralel olarak yükle
        await Promise.all([
          fetchUserProfile(userId),
          fetchUserPosts(userId),
          fetchUserCommunities(userId),
          fetchFollowData(),
          fetchUserInteractions(userId),
        ]);
      } catch (err) {
        console.error("Profil verileri yükleme hatası:", err);
        setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [isLoggedIn, currentUser, router]);

  // Ana yükleme durumu
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-14 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  // Kritik hata durumu
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

  // Kullanıcı profil verisini belirle
  const displayUser = userProfile || currentUser;

  if (!displayUser) {
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
              {profileLoading ? (
                <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
              ) : (
                <img
                  src={
                    displayUser.profile_picture_url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={displayUser.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              )}
              {displayUser.is_verified && (
                <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                  ✓
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  {displayUser.username || "Kullanıcı"}
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
                {displayUser.bio || "Henüz bir bio eklenmemiş."}
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-6 mt-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {displayUser.location || "Konum belirtilmemiş"}
                </span>
                <span className="flex items-center gap-2">
                  <FaUsers />
                  Takipçi: {followers.length || displayUser.follower_count || 0}
                </span>
                <span className="flex items-center gap-2">
                  <FaHeart />
                  Takip: {following.length || displayUser.following_count || 0}
                </span>
                <span className="flex items-center gap-2">
                  <FaTags />
                  Topluluk: {userCommunities.length}
                </span>
              </div>

              {/* Error Messages */}
              <div className="mt-2 space-y-1">
                {followersError && (
                  <p className="text-red-500 text-sm">{followersError}</p>
                )}
                {communitiesError && (
                  <p className="text-red-500 text-sm">{communitiesError}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 bg-white rounded-lg shadow-md">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { key: "posts", label: "Gönderiler", icon: <FaEdit /> },
                { key: "communities", label: "Topluluklar", icon: <FaUsers /> },
                {
                  key: "interactions",
                  label: "Etkileşimler",
                  icon: <FaTags />,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.key
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Gönderiler
                  </h2>
                  {postsError && (
                    <span className="text-red-500 text-sm">{postsError}</span>
                  )}
                </div>

                {postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-200 h-32 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : userPosts && userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      {...post}
                      author={{
                        username: displayUser.username || "Kullanıcı",
                        profile_picture_url:
                          displayUser.profile_picture_url ||
                          "https://via.placeholder.com/150",
                      }}
                      onLike={() => handleLikePost(post.id)}
                      onShare={() => handleSharePost(post.id)}
                    />
                  ))
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-600">Henüz gönderi bulunmuyor.</p>
                  </div>
                )}
              </div>
            )}

            {/* Communities Tab */}
            {activeTab === "communities" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Topluluklar
                  </h2>
                  {communitiesError && (
                    <span className="text-red-500 text-sm">
                      {communitiesError}
                    </span>
                  )}
                </div>

                {communitiesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-200 h-24 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : userCommunities && userCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userCommunities.map((community) => (
                      <div
                        key={community.id}
                        className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-semibold text-gray-800">
                          {community.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {community.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-500">
                            {community.member_count || 0} üye
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              community.visibility === "public"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {community.visibility}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-600">
                      Henüz topluluk üyeliği bulunmuyor.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Interactions Tab */}
            {activeTab === "interactions" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Etkileşimler
                  </h2>
                  {interactionsError && (
                    <span className="text-red-500 text-sm">
                      {interactionsError}
                    </span>
                  )}
                </div>

                {interactionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-200 h-24 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Interactions */}
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Etkileşim Geçmişi
                      </h3>
                      {userInteractions && userInteractions.length > 0 ? (
                        <div className="space-y-2">
                          {userInteractions
                            .slice(0, 5)
                            .map((interaction, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                              >
                                <span className="text-sm text-gray-600">
                                  {interaction.tag}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {interaction.interaction_type}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {interaction.interaction_count}x
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Henüz etkileşim bulunmuyor.
                        </p>
                      )}
                    </div>

                    {/* Popular Tags */}
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Popüler Etiketler
                      </h3>
                      {popularTags && popularTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {popularTags.slice(0, 10).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                            >
                              #{tag.tag} ({tag.total_interactions})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Popüler etiket bulunamadı.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
