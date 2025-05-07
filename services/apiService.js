/**
 * API Servis Konfigürasyonu ve Metotları
 */
import axios from 'axios';

// API base URL'leri - Environment variables'ları kullan veya fallback'leri kullan
const API_URLS = {
  user: typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:3010') : 'http://localhost:3010',
  post: typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_POST_API_URL || 'http://localhost:3002') : 'http://localhost:3002',
  community: typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_COMMUNITY_API_URL || 'http://localhost:3005') : 'http://localhost:3005',
};

// Axios instance'ları oluştur
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    // Proxy olmadan doğrudan erişim için
    proxy: false
  });

  // Request interceptor - giden isteklere token ekle
  instance.interceptors.request.use(
    (config) => {
      console.log(`Making request to: ${config.baseURL}${config.url}`);
      // Tarayıcı ortamında yerel depolamadan token al
      if (typeof window !== 'undefined') {
        const authState = localStorage.getItem('authState');
        if (authState) {
          try {
            const parsedState = JSON.parse(authState);
            if (parsedState.token) {
              config.headers['Authorization'] = `Bearer ${parsedState.token}`;
            }
          } catch (error) {
            console.error("Token parsing error:", error);
            // Continue without token if there's an error
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
      console.log(`Successful response from: ${response.config.url}`, response.data);
      return response.data;
    },
    (error) => {
      // Check if the error is a connection error (service unavailable)
      if (!error.response || error.code === 'ECONNABORTED') {
        console.error('API bağlantı hatası:', error.message);
        return Promise.reject(new Error('Servis şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.'));
      }
      
      // Handle API errors with response
      const errorMessage = error.response?.data?.message || 'Bir hata oluştu';
      console.error('API isteği başarısız:', errorMessage, error.response?.config?.url);
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
      
      console.log(`Retry attempt ${retries + 1} for API call`);
      retries++;
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// User Service
export const userService = {
  // Kullanıcı girişi
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      // API doğrudan /api/users/login şeklinde erişilecek
      const result = await userApi.post('/api/users/login', credentials);
      console.log('Login API response:', result);
      return result;
    } catch (error) {
      console.error('Login API error:', error);
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
        console.log('Attempting registration with:', userData);
        
        // API doğrudan /api/users/register şeklinde erişilecek
        const directResult = await userApi.post('/api/users/register', userData);
        console.log('Register API direct response:', directResult);
        return directResult;
      } catch (error) {
        // Eğer API bağlantı hatası veya zaman aşımı hatası ise
        if (!error.response || error.code === 'ECONNABORTED') {
          console.error('API bağlantı hatası, alternatif endpoint deneniyor');
          try {
            // Alternatif endpoint dene
            const alternativeResult = await userApi.post('/api/register', userData);
            console.log('Register API alternative response:', alternativeResult);
            return alternativeResult;
          } catch (altError) {
            console.error('Alternative endpoint also failed:', altError);
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
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  },

  // Kullanıcı bilgilerini getir
  getProfile: async (userId) => {
    try {
      if (!userId) {
        // If no userId is provided, get current user profile
        return userApi.get('/api/users/me');
      }
      return userApi.get(`/api/users/${userId}`);
    } catch (error) {
      console.error('Get profile API error:', error);
      throw error;
    }
  },

  // Kullanıcı bilgilerini güncelle
  updateProfile: async (userId, userData) => {
    try {
      if (!userId) {
        // If no userId is provided, update current user profile
        return userApi.put('/api/users/me', userData);
      }
      return userApi.put(`/api/users/${userId}`, userData);
    } catch (error) {
      console.error('Update profile API error:', error);
      throw error;
    }
  },
};

// Post Service
export const postService = {
  // Tüm gönderileri getir
  getAllPosts: async (params = {}) => {
    return safeApiCall(() => postApi.get('/posts', { params }));
  },

  // Gönderi detaylarını getir
  getPostById: async (postId) => {
    return safeApiCall(() => postApi.get(`/posts/${postId}`));
  },

  // Yeni gönderi oluştur
  createPost: async (postData) => {
    return safeApiCall(() => postApi.post('/posts', postData));
  },

  // Gönderiyi güncelle
  updatePost: async (postId, postData) => {
    return safeApiCall(() => postApi.put(`/posts/${postId}`, postData));
  },

  // Gönderiyi sil
  deletePost: async (postId) => {
    return safeApiCall(() => postApi.delete(`/posts/${postId}`));
  },

  // Kullanıcının gönderilerini getir
  getUserPosts: async (userId, params = {}) => {
    return safeApiCall(() => postApi.get(`/posts/user/${userId}`, { params }));
  },

  // Topluluk gönderilerini getir
  getCommunityPosts: async (communityId, params = {}) => {
    return safeApiCall(() => postApi.get(`/posts/community/${communityId}`, { params }));
  },
};

// Community Service
export const communityService = {
  // Tüm toplulukları getir
  getAllCommunities: async (params = {}) => {
    try {
      console.log('Getting all communities');
      return communityApi.get('/communities', { params });
    } catch (error) {
      console.error('Get all communities error:', error);
      throw error;
    }
  },

  // Topluluk detaylarını getir
  getCommunityById: async (communityId) => {
    try {
      console.log(`Getting community with id: ${communityId}`);
      return communityApi.get(`/communities/${communityId}`);
    } catch (error) {
      console.error(`Get community ${communityId} error:`, error);
      throw error;
    }
  },

  // Yeni topluluk oluştur
  createCommunity: async (communityData) => {
    try {
      console.log('Creating community with data:', communityData);
      return communityApi.post('/communities', communityData);
    } catch (error) {
      console.error('Create community error:', error);
      throw error;
    }
  },

  // Topluluğu güncelle
  updateCommunity: async (communityId, communityData) => {
    try {
      console.log(`Updating community ${communityId} with:`, communityData);
      return communityApi.put(`/communities/${communityId}`, communityData);
    } catch (error) {
      console.error(`Update community ${communityId} error:`, error);
      throw error;
    }
  },

  // Topluluğu sil
  deleteCommunity: async (communityId) => {
    try {
      console.log(`Deleting community ${communityId}`);
      return communityApi.delete(`/communities/${communityId}`);
    } catch (error) {
      console.error(`Delete community ${communityId} error:`, error);
      throw error;
    }
  },

  // Topluluk üyelerini getir
  getCommunityMembers: async (communityId, params = {}) => {
    try {
      console.log(`Getting members for community ${communityId}`);
      return communityApi.get(`/communities/${communityId}/members`, { params });
    } catch (error) {
      console.error(`Get members for community ${communityId} error:`, error);
      throw error;
    }
  },

  // Topluluğa katıl
  joinCommunity: async (communityId) => {
    try {
      console.log(`Joining community ${communityId}`);
      return communityApi.post(`/communities/${communityId}/join`);
    } catch (error) {
      console.error(`Join community ${communityId} error:`, error);
      throw error;
    }
  },

  // Topluluktan ayrıl
  leaveCommunity: async (communityId) => {
    try {
      console.log(`Leaving community ${communityId}`);
      return communityApi.post(`/communities/${communityId}/leave`);
    } catch (error) {
      console.error(`Leave community ${communityId} error:`, error);
      throw error;
    }
  },

  // Kullanıcının topluluklarını getir
  getUserCommunities: async (userId = null) => {
    try {
      const endpoint = userId 
        ? `/communities/user/${userId}`
        : '/communities/user';
      console.log(`Getting user communities with endpoint: ${endpoint}`);
      
      // API istekleri için güçlü hata yönetimi
      try {
        // Direkt endpoint'e istek yapalım
        const response = await communityApi.get(endpoint);
        console.log('Community response data:', response);
        return response;
      } catch (error) {
        console.error('Failed to get user communities from standard endpoint:', error);
        
        // Alternatif bir endpoint deneyelim
        try {
          const altEndpoint = '/communities';
          console.log(`Trying alternative endpoint: ${altEndpoint}`);
          const altResponse = await communityApi.get(altEndpoint);
          console.log('Alternative community response:', altResponse);
          return { communities: altResponse.communities || [] };
        } catch (altError) {
          console.error('Alternative endpoint also failed:', altError);
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