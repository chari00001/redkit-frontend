/**
 * API Servis Konfigürasyonu ve Metotları
 */
import axios from "axios";

// API base URL'leri - Environment variables'ları kullan veya fallback'leri kullan
const API_URLS = {
  user:
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:3001"
      : "http://localhost:3001",
  post:
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_POST_API_URL || "http://localhost:3002"
      : "http://localhost:3002",
  community:
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_COMMUNITY_API_URL || "http://localhost:3003"
      : "http://localhost:3003",
  search:
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_SEARCH_API_URL || "http://localhost:3004"
      : "http://localhost:3004",
  interaction:
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_INTERACTION_API_URL || "http://localhost:3005"
      : "http://localhost:3005",
  recommender:
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_RECOMMENDER_API_URL || "http://localhost:8000"
      : "http://localhost:8000",
};

// Axios instance'ları oluştur
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    // Proxy olmadan doğrudan erişim için
    proxy: false,
  });

  // Request interceptor - giden isteklere token ekle
  instance.interceptors.request.use(
    (config) => {
      // Multipart/form-data istekleri için Content-Type'ı axios'a bırak
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      // Tarayıcı ortamında yerel depolamadan token al
      if (typeof window !== "undefined") {
        const authState = localStorage.getItem("authState");
        if (authState) {
          try {
            const parsedState = JSON.parse(authState);
            if (parsedState.token && parsedState.isAuthenticated) {
              config.headers["Authorization"] = `Bearer ${parsedState.token}`;
            }
          } catch (error) {
            console.error("Token parsing error:", error);
            // Token bozuksa localStorage'ı temizle
            localStorage.removeItem("authState");
          }
        }
      }
      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - gelen yanıtları işle
  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      // Check if the error is a connection error (service unavailable)
      if (!error.response || error.code === "ECONNABORTED") {
        console.error("API bağlantı hatası:", error.message);
        return Promise.reject(
          new Error(
            "Servis şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin."
          )
        );
      }

      // Handle 401 Unauthorized errors - clear authentication
      if (error.response?.status === 401) {
        console.error("Authentication failed - clearing stored token");
        if (typeof window !== "undefined") {
          localStorage.removeItem("authState");
        }
        return Promise.reject(
          new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.")
        );
      }

      // Handle API errors with response
      const errorMessage = error.response?.data?.message || "Bir hata oluştu";
      console.error(
        "API isteği başarısız:",
        errorMessage,
        error.response?.config?.url,
        "Status:",
        error.response?.status
      );
      return Promise.reject(new Error(errorMessage));
    }
  );

  return instance;
};

// API istekleri için instance'ları oluştur
const userApi = createAxiosInstance(API_URLS.user);
const postApi = createAxiosInstance(API_URLS.post);
const communityApi = createAxiosInstance(API_URLS.community);

// Helper function for safe API calls with retry
const safeApiCall = async (apiCall, maxRetries = 1) => {
  let retries = 0;

  while (retries <= maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      if (retries === maxRetries) {
        throw error;
      }

      retries++;
      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

// User Service
export const userService = {
  // Kullanıcı girişi
  login: async (credentials) => {
    try {
      // API doğrudan /api/users/login şeklinde erişilecek
      const result = await userApi.post("/api/users/login", credentials);

      // Token'ı localStorage'a kaydet
      if (
        result &&
        (result.token || result.data?.token || result.access_token)
      ) {
        const token = result.token || result.data?.token || result.access_token;
        const user = result.user || result.data?.user || result.data;

        // Auth state'i localStorage'a kaydet
        const authState = {
          token: token,
          user: user,
          isAuthenticated: true,
          timestamp: Date.now(),
        };

        localStorage.setItem("authState", JSON.stringify(authState));
      } else {
        console.warn("No token found in login response:", result);
      }

      return result;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  // Kullanıcı kaydı
  register: async (userData) => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 saniye

    const attemptRegister = async () => {
      try {
        // API doğrudan /api/users/register şeklinde erişilecek
        const directResult = await userApi.post(
          "/api/users/register",
          userData
        );

        // Token'ı localStorage'a kaydet (eğer register'da token dönüyorsa)
        if (
          directResult &&
          (directResult.token ||
            directResult.data?.token ||
            directResult.access_token)
        ) {
          const token =
            directResult.token ||
            directResult.data?.token ||
            directResult.access_token;
          const user =
            directResult.user || directResult.data?.user || directResult.data;

          // Auth state'i localStorage'a kaydet
          const authState = {
            token: token,
            user: user,
            isAuthenticated: true,
            timestamp: Date.now(),
          };

          localStorage.setItem("authState", JSON.stringify(authState));
        }

        return directResult;
      } catch (error) {
        // Eğer API bağlantı hatası veya zaman aşımı hatası ise
        if (!error.response || error.code === "ECONNABORTED") {
          console.error("API bağlantı hatası, alternatif endpoint deneniyor");
          try {
            // Alternatif endpoint dene
            const alternativeResult = await userApi.post(
              "/api/register",
              userData
            );

            // Token'ı localStorage'a kaydet (alternatif endpoint'ten)
            if (
              alternativeResult &&
              (alternativeResult.token ||
                alternativeResult.data?.token ||
                alternativeResult.access_token)
            ) {
              const token =
                alternativeResult.token ||
                alternativeResult.data?.token ||
                alternativeResult.access_token;
              const user =
                alternativeResult.user ||
                alternativeResult.data?.user ||
                alternativeResult.data;

              // Auth state'i localStorage'a kaydet
              const authState = {
                token: token,
                user: user,
                isAuthenticated: true,
                timestamp: Date.now(),
              };

              localStorage.setItem("authState", JSON.stringify(authState));
            }

            return alternativeResult;
          } catch (altError) {
            console.error("Alternative endpoint also failed:", altError);
            throw altError;
          }
        }
        throw error;
      }
    };

    while (retryCount < maxRetries) {
      try {
        return await attemptRegister();
      } catch (error) {
        retryCount++;
        console.error(`Register attempt ${retryCount} failed:`, error);

        if (retryCount === maxRetries) {
          // Son deneme başarısız olduysa, hatayı kullanan komponente ilet
          throw new Error(`Kayıt işlemi başarısız oldu: ${error.message}`);
        }

        // Tekrar denemeden önce bekle
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  },

  // Kullanıcı çıkışı
  logout: async () => {
    try {
      // API'ye logout isteği gönder (eğer endpoint varsa)
      try {
        await userApi.post("/api/users/logout");
      } catch (error) {
        // Logout endpoint yoksa veya hata varsa devam et
        console.warn(
          "Logout endpoint error (continuing anyway):",
          error.message
        );
      }

      // LocalStorage'ı temizle
      if (typeof window !== "undefined") {
        localStorage.removeItem("authState");
      }

      return { success: true, message: "Başarıyla çıkış yapıldı" };
    } catch (error) {
      console.error("Logout error:", error);

      // Hata olsa bile localStorage'ı temizle
      if (typeof window !== "undefined") {
        localStorage.removeItem("authState");
      }

      throw error;
    }
  },

  // Şifre sıfırlama isteği
  forgotPassword: async (email) => {
    try {
      const result = await userApi.post("/api/users/forgot-password", {
        email,
      });
      return result;
    } catch (error) {
      console.error("Forgot password API error:", error);
      throw error;
    }
  },

  // Şifre sıfırlama
  resetPassword: async (token, password) => {
    try {
      const result = await userApi.post("/api/users/reset-password", {
        token,
        password,
      });
      return result;
    } catch (error) {
      console.error("Reset password API error:", error);
      throw error;
    }
  },

  // Hesap doğrulama
  verifyAccount: async (token) => {
    try {
      const result = await userApi.get(`/api/users/verify/${token}`);
      return result;
    } catch (error) {
      console.error("Verify account API error:", error);
      throw error;
    }
  },

  // Kullanıcı bilgilerini getir
  getProfile: async (userId) => {
    try {
      if (!userId) {
        // If no userId is provided, get current user profile
        return userApi.get("/api/users/me");
      }
      return userApi.get(`/api/users/${userId}`);
    } catch (error) {
      console.error("Get profile API error:", error);
      throw error;
    }
  },

  // Kullanıcı bilgilerini güncelle
  updateProfile: async (userId, userData) => {
    try {
      if (!userId) {
        // If no userId is provided, update current user profile
        return userApi.put("/api/users/me", userData);
      }
      return userApi.put(`/api/users/${userId}`, userData);
    } catch (error) {
      console.error("Update profile API error:", error);
      throw error;
    }
  },

  // Şifre değiştirme
  changePassword: async (currentPassword, newPassword) => {
    try {
      const result = await userApi.put("/api/users/me/password", {
        currentPassword,
        newPassword,
      });
      return result;
    } catch (error) {
      console.error("Change password API error:", error);
      throw error;
    }
  },

  // E-posta değiştirme
  changeEmail: async (password, newEmail) => {
    try {
      const result = await userApi.put("/api/users/me/email", {
        password,
        newEmail,
      });
      return result;
    } catch (error) {
      console.error("Change email API error:", error);
      throw error;
    }
  },

  // Bildirim tercihlerini güncelleme
  updateNotificationPreferences: async (preferences) => {
    try {
      const result = await userApi.put(
        "/api/users/me/notifications",
        preferences
      );
      return result;
    } catch (error) {
      console.error("Update notifications API error:", error);
      throw error;
    }
  },

  // Takipçileri getir
  getFollowers: async (page = 1, limit = 10) => {
    try {
      const result = await userApi.get("/api/users/followers", {
        params: { page, limit },
      });
      return result;
    } catch (error) {
      console.error("Get followers API error:", error);
      throw error;
    }
  },

  // Takip edilenleri getir
  getFollowing: async (page = 1, limit = 10) => {
    try {
      const result = await userApi.get("/api/users/following", {
        params: { page, limit },
      });
      return result;
    } catch (error) {
      console.error("Get following API error:", error);
      throw error;
    }
  },

  // Kullanıcı takip et
  followUser: async (userId) => {
    try {
      const result = await userApi.post(`/api/users/follow/${userId}`);
      return result;
    } catch (error) {
      console.error("Follow user API error:", error);
      throw error;
    }
  },

  // Kullanıcı takibini bırak
  unfollowUser: async (userId) => {
    try {
      const result = await userApi.delete(`/api/users/follow/${userId}`);
      return result;
    } catch (error) {
      console.error("Unfollow user API error:", error);
      throw error;
    }
  },

  // Admin: Tüm kullanıcıları listele
  getAllUsers: async (params = {}) => {
    try {
      const result = await userApi.get("/api/users", { params });
      return result;
    } catch (error) {
      console.error("Get all users API error:", error);
      throw error;
    }
  },

  // Admin: Kullanıcı durumunu güncelle
  updateUserStatus: async (userId, status, reason) => {
    try {
      const result = await userApi.put(`/api/users/${userId}/status`, {
        status,
        reason,
      });
      return result;
    } catch (error) {
      console.error("Update user status API error:", error);
      throw error;
    }
  },

  // Admin: Kullanıcı sil
  deleteUser: async (userId) => {
    try {
      const result = await userApi.delete(`/api/users/${userId}`);
      return result;
    } catch (error) {
      console.error("Delete user API error:", error);
      throw error;
    }
  },

  // Auth durumunu kontrol et
  checkAuthStatus: () => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const authState = localStorage.getItem("authState");

      if (!authState) {
        return null;
      }

      const parsedState = JSON.parse(authState);

      // Token'ın varlığını ve süresini kontrol et
      if (parsedState.token && parsedState.isAuthenticated) {
        // Token 24 saatten eskiyse süresi dolmuş sayalım
        const tokenAge = Date.now() - (parsedState.timestamp || 0);
        const maxAge = 24 * 60 * 60 * 1000; // 24 saat

        if (tokenAge > maxAge) {
          localStorage.removeItem("authState");
          return null;
        }

        return parsedState;
      }

      return null;
    } catch (error) {
      console.error("checkAuthStatus: Auth status check error:", error);
      localStorage.removeItem("authState");
      return null;
    }
  },

  // Mevcut kullanıcı bilgilerini getir (localStorage ve Redux için yardımcı)
  getCurrentUser: () => {
    if (typeof window === "undefined") return null;

    // Önce localStorage'a bak
    const authStatus = userService.checkAuthStatus();
    if (authStatus && authStatus.user) {
      return authStatus.user;
    }

    // Redux store'dan da çek (eğer mevcut sayfa context'inde varsa)
    // Bu çoğunlukla component'larda useSelector ile yapılacak
    return null;
  },

  // Dummy token ile fallback authState oluştur
  createFallbackAuth: (user) => {
    if (typeof window === "undefined" || !user) return null;

    try {
      const fallbackAuthState = {
        token: `fallback-${Date.now()}-${user.id || "unknown"}`, // Daha unique token
        user: user,
        isAuthenticated: true,
        timestamp: Date.now(),
        isFallback: true, // Fallback olduğunu belirtmek için
      };

      localStorage.setItem("authState", JSON.stringify(fallbackAuthState));
      return fallbackAuthState;
    } catch (error) {
      console.error("Failed to create fallback auth:", error);
      return null;
    }
  },
};

// Post Service
export const postService = {
  // Tüm gönderileri getir
  getAllPosts: async (params = {}) => {
    return safeApiCall(() => postApi.get("/api/posts", { params }));
  },

  // Gönderi detaylarını getir
  getPostById: async (postId) => {
    return safeApiCall(() => postApi.get(`/api/posts/${postId}`));
  },

  // Yeni gönderi oluştur (JSON)
  createPost: async (postData) => {
    return safeApiCall(() => postApi.post("/api/posts", postData));
  },

  // Resim ile birlikte gönderi oluştur (Form Data)
  createPostWithImage: async (formData) => {
    return safeApiCall(() => postApi.post("/api/posts/with-image", formData));
  },

  // Resim yükle (tek başına)
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    return safeApiCall(() => postApi.post("/api/posts/upload-image", formData));
  },

  // Gönderiyi güncelle
  updatePost: async (postId, postData) => {
    return safeApiCall(() => postApi.put(`/api/posts/${postId}`, postData));
  },

  // Gönderiyi sil
  deletePost: async (postId) => {
    return safeApiCall(() => postApi.delete(`/api/posts/${postId}`));
  },

  // Gönderiyi beğen/beğeni kaldır
  likePost: async (postId) => {
    return safeApiCall(() => postApi.post(`/api/posts/${postId}/like`));
  },

  // Gönderiyi paylaş
  sharePost: async (postId) => {
    return safeApiCall(() => postApi.post(`/api/posts/${postId}/share`));
  },

  // Kullanıcının gönderilerini getir
  getUserPosts: async (userId, params = {}) => {
    return safeApiCall(() =>
      postApi.get(`/api/posts/user/${userId}`, { params })
    );
  },

  // Gönderi yorumlarını getir
  getPostComments: async (postId) => {
    try {
      const response = await postApi.get(`/api/posts/${postId}/comments`);
      return response;
    } catch (error) {
      console.error("Get comments API error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // API'den gelen hata mesajını kullan
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Yorumlar yüklenemedi";

      throw new Error(errorMessage);
    }
  },

  // Yorum oluştur
  createComment: async (postId, commentData) => {
    try {
      const response = await postApi.post(
        `/api/posts/${postId}/comments`,
        commentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Create comment API error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      console.error("Request config:", error.config);

      // API'den gelen detaylı hata mesajını logla
      if (error.response?.data) {
        console.error(
          "Server error details:",
          JSON.stringify(error.response.data, null, 2)
        );
      }

      // API'den gelen hata mesajını kullan
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.details ||
        error.message ||
        "Yorum oluşturulamadı";

      throw new Error(errorMessage);
    }
  },

  // Yorum güncelle
  updateComment: async (postId, commentId, commentData) => {
    try {
      const response = await postApi.put(
        `/api/posts/${postId}/comments/${commentId}`,
        commentData
      );

      return response;
    } catch (error) {
      console.error("Update comment API error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Yorum güncellenemedi";

      throw new Error(errorMessage);
    }
  },

  // Yorum sil
  deleteComment: async (postId, commentId) => {
    try {
      const response = await postApi.delete(
        `/api/posts/${postId}/comments/${commentId}`
      );

      return response;
    } catch (error) {
      console.error("Delete comment API error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Yorum silinemedi";

      throw new Error(errorMessage);
    }
  },

  // Yorum beğen/beğeni kaldır
  likeComment: async (postId, commentId) => {
    try {
      const response = await postApi.post(
        `/api/posts/${postId}/comments/${commentId}/like`
      );

      return response;
    } catch (error) {
      console.error("Like comment API error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Beğeni işlemi başarısız";

      throw new Error(errorMessage);
    }
  },

  // Yeni up/down vote fonksiyonu
  votePost: async (postId, direction) => {
    // direction: 'up' | 'down' | null (null to clear)

    try {
      const response = await postApi.post(`/api/posts/${postId}/vote`, {
        direction,
      });

      return response;
    } catch (error) {
      console.error("Vote post API error:", error);
      throw error;
    }
  },
};

// Community Service
export const communityService = {
  // Tüm toplulukları getir
  getAllCommunities: async (params = {}) => {
    try {
      return communityApi.get("/api/communities", { params });
    } catch (error) {
      console.error("Get all communities error:", error);
      throw error;
    }
  },

  // Topluluk detaylarını getir
  getCommunityById: async (communityId) => {
    try {
      // Önce direkt ID olarak dene
      try {
        const response = await communityApi.get(
          `/api/communities/${communityId}`
        );

        return response;
      } catch (error) {
        console.error(
          `Failed to get community by ID/name ${communityId}:`,
          error
        );

        // Eğer string ise ve sayı değilse, tüm toplulukları getirip name ile filtrele
        if (isNaN(communityId) && typeof communityId === "string") {
          try {
            const allCommunitiesResponse = await communityApi.get(
              "/api/communities"
            );
            const communities = allCommunitiesResponse.communities || [];

            // Case-insensitive name matching
            const foundCommunity = communities.find(
              (community) =>
                community.name.toLowerCase() === communityId.toLowerCase()
            );

            if (foundCommunity) {
              return foundCommunity;
            } else {
              console.error(`Community not found by name: ${communityId}`);
              throw new Error(`Topluluk bulunamadı: ${communityId}`);
            }
          } catch (fallbackError) {
            console.error("Fallback method also failed:", fallbackError);
            throw error; // Orijinal hatayı fırlat
          }
        }

        throw error;
      }
    } catch (error) {
      console.error(`Get community ${communityId} error:`, error);
      throw error;
    }
  },

  // Topluluk adına göre getir (ayrı fonksiyon)
  getCommunityByName: async (communityName) => {
    try {
      return communityApi.get(
        `/api/communities/name/${encodeURIComponent(communityName)}`
      );
    } catch (error) {
      console.error(`Get community by name ${communityName} error:`, error);
      throw error;
    }
  },

  getCommunityPosts: async (communityId) => {
    try {
      return communityApi.get(`/api/communities/${communityId}/posts`);
    } catch (error) {
      console.error(`Get posts for community ${communityId} error:`, error);
      throw error;
    }
  },

  // Yeni topluluk oluştur
  createCommunity: async (communityData) => {
    try {
      return communityApi.post("/api/communities", communityData);
    } catch (error) {
      console.error("Create community error:", error);
      throw error;
    }
  },

  // Topluluğu güncelle
  updateCommunity: async (communityId, communityData) => {
    try {
      return communityApi.put(`/api/communities/${communityId}`, communityData);
    } catch (error) {
      console.error(`Update community ${communityId} error:`, error);
      throw error;
    }
  },

  // Topluluğu sil
  deleteCommunity: async (communityId) => {
    try {
      return communityApi.delete(`/api/communities/${communityId}`);
    } catch (error) {
      console.error(`Delete community ${communityId} error:`, error);
      throw error;
    }
  },

  // Topluluk üyelerini getir
  getCommunityMembers: async (communityId, params = {}) => {
    try {
      return communityApi.get(`/api/communities/${communityId}/members`, {
        params,
      });
    } catch (error) {
      console.error(`Get members for community ${communityId} error:`, error);
      throw error;
    }
  },

  // Topluluğa katıl
  joinCommunity: async (communityId) => {
    try {
      return communityApi.post(`/api/communities/${communityId}/join`);
    } catch (error) {
      console.error(`Join community ${communityId} error:`, error);
      throw error;
    }
  },

  // Topluluktan ayrıl
  leaveCommunity: async (communityId) => {
    try {
      return communityApi.post(`/api/communities/${communityId}/leave`);
    } catch (error) {
      console.error(`Leave community ${communityId} error:`, error);
      throw error;
    }
  },

  // Üye rolünü güncelle
  updateMemberRole: async (communityId, userId, role) => {
    try {
      return communityApi.put(
        `/api/communities/${communityId}/members/${userId}`,
        { role }
      );
    } catch (error) {
      console.error(`Update member role error:`, error);
      throw error;
    }
  },

  // Kullanıcının topluluklarını getir
  getUserCommunities: async (userId = null) => {
    try {
      const endpoint = userId
        ? `/api/communities/user/${userId}`
        : "/api/communities/user";

      // API istekleri için güçlü hata yönetimi
      try {
        // Direkt endpoint'e istek yapalım
        const response = await communityApi.get(endpoint);
        return response;
      } catch (error) {
        console.error(
          "Failed to get user communities from standard endpoint:",
          error
        );

        // Alternatif bir endpoint deneyelim
        try {
          const altEndpoint = "/api/communities";
          const altResponse = await communityApi.get(altEndpoint);
          return { communities: altResponse.communities || [] };
        } catch (altError) {
          console.error("Alternative endpoint also failed:", altError);
          // Son çare olarak boş bir array döndür
          return { communities: [] };
        }
      }
    } catch (error) {
      console.error(`Get user communities error:`, error);
      // En kötü senaryoda bile boş dizi döndür
      return { communities: [] };
    }
  },
};

// Search instance'ı oluştur
const searchApi = createAxiosInstance(API_URLS.search);

// Search Service
export const searchService = {
  // Genel arama yapma
  search: async (query, limit = 10, offset = 0) => {
    try {
      const params = { query, limit, offset };
      const response = await searchApi.get("/api/search", { params });
      return response;
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  },

  // Kullanıcı araması
  searchUsers: async (query, limit = 10, offset = 0) => {
    try {
      const params = { query, limit, offset };
      const response = await searchApi.get("/api/search/users", { params });
      return response;
    } catch (error) {
      console.error("User search error:", error);
      throw error;
    }
  },

  // Topluluk araması
  searchCommunities: async (query, limit = 10, offset = 0) => {
    try {
      const params = { query, limit, offset };
      const response = await searchApi.get("/api/search/communities", {
        params,
      });
      return response;
    } catch (error) {
      console.error("Community search error:", error);
      throw error;
    }
  },

  // Gönderi araması
  searchPosts: async (query, limit = 10, offset = 0) => {
    try {
      const params = { query, limit, offset };
      const response = await searchApi.get("/api/search/posts", { params });
      return response;
    } catch (error) {
      console.error("Post search error:", error);
      throw error;
    }
  },
};

// Interaction instance'ı oluştur
const interactionApi = createAxiosInstance(API_URLS.interaction);

// Recommender instance'ı oluştur
const recommenderApi = createAxiosInstance(API_URLS.recommender);

// Etkileşim Servisi
export const interactionService = {
  // Yeni bir etkileşim kaydet
  addInteraction: async (userId, tag, interactionType) => {
    try {
      const data = {
        userId,
        tag,
        interactionType,
      };

      console.log(
        `Etkileşim kaydediliyor: ${interactionType} - ${tag} - Kullanıcı: ${userId}`
      );
      const response = await interactionApi.post("/api/interactions", data);
      return response;
    } catch (error) {
      console.error("Etkileşim kaydetme hatası:", error);
      throw error;
    }
  },

  // Kullanıcının tüm etkileşimlerini getir
  getUserInteractions: async (userId, type = null) => {
    try {
      const params = type ? { type } : {};

      console.log(`Kullanıcı etkileşimleri getiriliyor: ${userId}`);
      const response = await interactionApi.get(
        `/api/users/${userId}/interactions`,
        { params }
      );
      return response;
    } catch (error) {
      console.error(`Kullanıcı etkileşimleri getirme hatası: ${userId}`, error);
      throw error;
    }
  },

  // Kullanıcının belirli bir etiket ile etkileşimlerini getir
  getUserTagInteractions: async (userId, tag) => {
    try {
      console.log(
        `Kullanıcının etiket etkileşimleri getiriliyor: ${userId} - ${tag}`
      );
      const response = await interactionApi.get(
        `/api/users/${userId}/tags/${tag}`
      );
      return response;
    } catch (error) {
      console.error(
        `Kullanıcı etiket etkileşimleri getirme hatası: ${userId} - ${tag}`,
        error
      );
      throw error;
    }
  },

  // Popüler etiketleri getir
  getPopularTags: async (limit = 10) => {
    try {
      const params = { limit };

      console.log(`Popüler etiketler getiriliyor, limit: ${limit}`);
      const response = await interactionApi.get("/api/tags/popular", {
        params,
      });
      return response;
    } catch (error) {
      console.error("Popüler etiketleri getirme hatası:", error);
      throw error;
    }
  },

  // Kullanıcı etkileşimi kaydetmek için yardımcı fonksiyonlar
  likeTag: async (userId, tag) => {
    return interactionService.addInteraction(userId, tag, "like");
  },

  viewTag: async (userId, tag) => {
    return interactionService.addInteraction(userId, tag, "view");
  },

  shareTag: async (userId, tag) => {
    return interactionService.addInteraction(userId, tag, "share");
  },

  commentTag: async (userId, tag) => {
    return interactionService.addInteraction(userId, tag, "comment");
  },
};

// Recommender Service
export const recommenderService = {
  // Kişiselleştirilmiş öneriler al
  getRecommendations: async (userId) => {
    try {
      console.log(`Recommender: Kullanıcı ${userId} için öneri getiriliyor...`);
      const params = { user_id: userId };
      const response = await recommenderApi.get("/api/v1/recommendations", {
        params,
      });
      console.log(
        `Recommender: ${response.recommendations?.length || 0} öneri alındı`
      );
      return response;
    } catch (error) {
      console.error("Öneri getirme hatası:", error);
      throw error;
    }
  },

  // Kişiselleştirilmiş feed al
  getFeed: async (userId) => {
    try {
      console.log(
        `Recommender: Kullanıcı ${userId} için kişiselleştirilmiş feed getiriliyor...`
      );
      const params = { user_id: userId };
      const response = await recommenderApi.get("/api/v1/feed", { params });
      console.log(`Recommender: Feed yanıtı alındı:`, {
        posts_count: response.posts?.length || 0,
        status: response.status || "unknown",
        timestamp: response.timestamp || "unknown",
      });
      return response;
    } catch (error) {
      console.error("Feed getirme hatası:", error);
      throw error;
    }
  },

  // Kullanıcı profili al
  getUserProfile: async (userId) => {
    try {
      console.log(`Recommender: Kullanıcı ${userId} profili getiriliyor...`);
      const response = await recommenderApi.get(
        `/api/v1/user-profile/${userId}`
      );
      console.log(`Recommender: Kullanıcı profili alındı:`, {
        total_interactions: response.total_interactions,
        tag_preferences_count: Object.keys(response.tag_preferences || {})
          .length,
        cluster_preferences_count: Object.keys(
          response.cluster_preferences || {}
        ).length,
      });
      return response;
    } catch (error) {
      console.error("Kullanıcı profili getirme hatası:", error);
      throw error;
    }
  },

  // Post analizi al
  getPostAnalysis: async (postId) => {
    try {
      console.log(`Recommender: Post ${postId} analizi getiriliyor...`);
      const response = await recommenderApi.get(
        `/api/v1/post-analysis/${postId}`
      );
      console.log(`Recommender: Post analizi alındı:`, {
        post_id: response.post_id,
        cluster_id: response.analysis?.cluster_id,
        keywords_count: response.analysis?.keywords?.length || 0,
        enhanced_tags_count: response.analysis?.enhanced_tags?.length || 0,
      });
      return response;
    } catch (error) {
      console.error("Post analizi getirme hatası:", error);
      throw error;
    }
  },

  // Benzer postlar al
  getSimilarPosts: async (postId, limit = 5) => {
    try {
      console.log(
        `Recommender: Post ${postId} için ${limit} benzer post getiriliyor...`
      );
      const params = { limit };
      const response = await recommenderApi.get(
        `/api/v1/similar-posts/${postId}`,
        { params }
      );
      console.log(
        `Recommender: ${
          response.similar_posts?.length || 0
        } benzer post bulundu`
      );
      return response;
    } catch (error) {
      console.error("Benzer postlar getirme hatası:", error);
      throw error;
    }
  },

  // Tüm konular al
  getTopics: async () => {
    try {
      console.log(`Recommender: Tüm konular getiriliyor...`);
      const response = await recommenderApi.get("/api/v1/topics");
      console.log(
        `Recommender: ${response.total_clusters || 0} konu bulundu:`,
        Object.keys(response.cluster_info || {})
          .map(
            (key) =>
              `Cluster ${key}: ${response.cluster_info[key].post_count} post`
          )
          .join(", ")
      );
      return response;
    } catch (error) {
      console.error("Konular getirme hatası:", error);
      throw error;
    }
  },

  // Konu postları al
  getTopicPosts: async (topicId, limit = 10) => {
    try {
      console.log(
        `Recommender: Konu ${topicId} için ${limit} post getiriliyor...`
      );
      const params = { limit };
      const response = await recommenderApi.get(
        `/api/v1/topic-posts/${topicId}`,
        { params }
      );
      console.log(
        `Recommender: Konu ${topicId} için ${
          response.posts?.length || 0
        } post alındı`
      );
      return response;
    } catch (error) {
      console.error("Konu postları getirme hatası:", error);
      throw error;
    }
  },

  // Etkileşim kaydet
  trackInteraction: async (userId, postId, interactionType) => {
    try {
      console.log(
        `Recommender: Etkileşim kaydediliyor - User: ${userId}, Post: ${postId}, Type: ${interactionType}`
      );
      const data = {
        user_id: userId,
        post_id: postId,
        interaction_type: interactionType,
      };
      const response = await recommenderApi.post(
        "/api/v1/track-interaction",
        data
      );
      console.log(`Recommender: Etkileşim başarıyla kaydedildi:`, {
        status: response.status,
        message: response.message,
        weight: response.weight,
      });
      return response;
    } catch (error) {
      console.error("Etkileşim kaydetme hatası:", error);
      throw error;
    }
  },

  // Yeni postları analiz et
  analyzeNewPosts: async () => {
    try {
      console.log(`Recommender: Yeni postlar analiz ediliyor...`);
      const response = await recommenderApi.post("/api/v1/analyze-new-posts");
      console.log(`Recommender: Analiz tamamlandı:`, {
        analyzed_count: response.analyzed_count,
        total_posts: response.total_posts,
        timestamp: response.timestamp,
      });
      return response;
    } catch (error) {
      console.error("Yeni post analizi hatası:", error);
      throw error;
    }
  },

  // Modeli yeniden eğit
  retrainModel: async () => {
    try {
      console.log(`Recommender: Model yeniden eğitiliyor...`);
      const response = await recommenderApi.post("/api/v1/retrain-model");
      console.log(`Recommender: Model eğitimi tamamlandı:`, {
        posts_count: response.posts_count,
        features_count: response.features_count,
        users_count: response.users_count,
        topics_count: response.topics_count,
        timestamp: response.timestamp,
      });
      return response;
    } catch (error) {
      console.error("Model yeniden eğitimi hatası:", error);
      throw error;
    }
  },
};
