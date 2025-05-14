import axios from "axios";

// API temel URL'si
const API_URL = "http://localhost:3010/api/users";

// İstek interceptor'ları ve hata yakalama fonksiyonu
const userApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Requestler için interceptor - token ekleme
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API çağrıları için güvenli sarmalayıcı fonksiyon
const safeApiCall = async (apiCall) => {
  try {
    const response = await apiCall();

    // API'den başarılı yanıt geldi mi kontrol et
    if (response.status === 200 || response.status === 201) {
      // Eğer data kısmında success bilgisi yoksa manuel ekleyelim
      if (response.data && typeof response.data.success === "undefined") {
        response.data.success = true;
      }
      return response.data;
    }

    // Başarılı HTTP kodu olmasına rağmen API'den hata gelebilir
    if (response.data && response.data.success === false) {
      console.warn(
        "API başarılı HTTP kodu döndü ama success: false içeriyor:",
        response.data
      );
      return response.data;
    }

    // Beklenmeyen durum
    return {
      success: false,
      message: "API yanıtı beklenmeyen formatta.",
      data: response.data,
    };
  } catch (error) {
    console.error("API hatası:", error);

    // API'den gelen hata yanıtı varsa detaylı log tut
    if (error.response) {
      console.error("API hata detayı:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      // API'den gelen hata yanıtı varsa onu döndür
      if (error.response.data) {
        return {
          success: false,
          message:
            error.response.data.message ||
            `HTTP Hatası: ${error.response.status} ${error.response.statusText}`,
          statusCode: error.response.status,
          ...error.response.data,
        };
      }

      // HTTP durum koduna göre anlamlı mesaj döndür
      return {
        success: false,
        message: `HTTP Hatası: ${error.response.status} ${error.response.statusText}`,
        statusCode: error.response.status,
      };
    }

    // Ağ hatası veya istek gönderilemeyen durumlar
    if (error.request) {
      console.error(
        "API isteği gönderildi ancak yanıt alınamadı:",
        error.request
      );
      return {
        success: false,
        message:
          "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.",
      };
    }

    // Genel hata durumu
    return {
      success: false,
      message:
        error.message || "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
    };
  }
};

// User servis fonksiyonları
export const userService = {
  // Kimlik doğrulama işlemleri
  auth: {
    // Kullanıcı kaydı
    register: async (userData) => {
      return safeApiCall(() => userApi.post("/register", userData));
    },

    // Kullanıcı girişi
    login: async (credentials) => {
      return safeApiCall(() => userApi.post("/login", credentials));
    },

    // Şifre sıfırlama isteği
    forgotPassword: async (email) => {
      return safeApiCall(() => userApi.post("/forgot-password", { email }));
    },

    // Şifre sıfırlama
    resetPassword: async (token, password) => {
      return safeApiCall(() =>
        userApi.post("/reset-password", { token, password })
      );
    },

    // Hesap doğrulama
    verifyAccount: async (token) => {
      return safeApiCall(() => userApi.get(`/verify/${token}`));
    },
  },

  // Profil işlemleri
  profile: {
    // Kendi profilini görüntüleme
    getMyProfile: async () => {
      return safeApiCall(() => userApi.get("/me"));
    },

    // Profil güncelleme
    updateProfile: async (profileData) => {
      return safeApiCall(() => userApi.put("/me", profileData));
    },

    // Şifre değiştirme
    changePassword: async (passwordData) => {
      return safeApiCall(() => userApi.put("/me/password", passwordData));
    },

    // E-posta değiştirme
    changeEmail: async (emailData) => {
      return safeApiCall(() => userApi.put("/me/email", emailData));
    },

    // Bildirim tercihlerini güncelleme
    updateNotificationPreferences: async (preferences) => {
      return safeApiCall(() => userApi.put("/me/notifications", preferences));
    },
  },

  // Sosyal işlemler
  social: {
    // Takipçileri görüntüleme
    getFollowers: async (params = {}) => {
      return safeApiCall(() => userApi.get("/followers", { params }));
    },

    // Takip edilenleri görüntüleme
    getFollowing: async (params = {}) => {
      return safeApiCall(() => userApi.get("/following", { params }));
    },

    // Kullanıcı takip etme
    followUser: async (userId) => {
      return safeApiCall(() => userApi.post(`/follow/${userId}`));
    },

    // Kullanıcı takibini bırakma
    unfollowUser: async (userId) => {
      return safeApiCall(() => userApi.delete(`/follow/${userId}`));
    },
  },

  // Kullanıcı işlemleri (genel)
  users: {
    // Kullanıcıları listeleme (admin)
    getAllUsers: async (params = {}) => {
      return safeApiCall(() => userApi.get("/", { params }));
    },

    // Kullanıcı detaylarını görüntüleme
    getUserById: async (userId) => {
      return safeApiCall(() => userApi.get(`/${userId}`));
    },

    // Kullanıcı güncelleme (admin)
    updateUser: async (userId, userData) => {
      return safeApiCall(() => userApi.put(`/${userId}`, userData));
    },

    // Kullanıcı silme
    deleteUser: async (userId) => {
      return safeApiCall(() => userApi.delete(`/${userId}`));
    },

    // Kullanıcı durumunu güncelleme
    updateUserStatus: async (userId, statusData) => {
      return safeApiCall(() => userApi.put(`/${userId}/status`, statusData));
    },
  },
};

export default userService;
