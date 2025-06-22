# Redit Frontend API Servisleri

Bu dosya, Redit frontend uygulaması için güncellenmiş API servislerini açıklamaktadır.

## API Servisi Yapılandırması

### Port Yapılandırması
- **User API**: `http://localhost:3001`
- **Post API**: `http://localhost:3002`
- **Community API**: `http://localhost:3003`
- **Search API**: `http://localhost:3004`
- **Interaction API**: `http://localhost:3005`

### Özellikler
- Otomatik JWT token yönetimi
- Request/Response interceptors
- Hata yönetimi ve retry mekanizması
- Timeout yönetimi (10 saniye)
- Detaylı loglama

## Servisler

### 1. User Service (`userService`)

#### Kimlik Doğrulama
- `login(credentials)` - Kullanıcı girişi
- `register(userData)` - Kullanıcı kaydı
- `forgotPassword(email)` - Şifre sıfırlama isteği
- `resetPassword(token, password)` - Şifre sıfırlama
- `verifyAccount(token)` - Hesap doğrulama

#### Profil Yönetimi
- `getProfile(userId?)` - Profil bilgilerini getir
- `updateProfile(userId?, userData)` - Profil güncelle
- `changePassword(currentPassword, newPassword)` - Şifre değiştir
- `changeEmail(password, newEmail)` - E-posta değiştir
- `updateNotificationPreferences(preferences)` - Bildirim tercihleri

#### Sosyal Özellikler
- `getFollowers(page?, limit?)` - Takipçileri getir
- `getFollowing(page?, limit?)` - Takip edilenleri getir
- `followUser(userId)` - Kullanıcı takip et
- `unfollowUser(userId)` - Takibi bırak

#### Admin İşlemleri
- `getAllUsers(params?)` - Tüm kullanıcıları listele
- `updateUserStatus(userId, status, reason?)` - Kullanıcı durumunu güncelle
- `deleteUser(userId)` - Kullanıcı sil

### 2. Post Service (`postService`)

#### Temel CRUD
- `getAllPosts(params?)` - Tüm gönderileri getir
- `getPostById(postId)` - Gönderi detayı
- `createPost(postData)` - Yeni gönderi oluştur
- `updatePost(postId, postData)` - Gönderi güncelle
- `deletePost(postId)` - Gönderi sil

#### Etkileşimler
- `likePost(postId)` - Gönderi beğen/beğeni kaldır
- `sharePost(postId)` - Gönderi paylaş

#### Filtreleme
- `getUserPosts(userId, params?)` - Kullanıcının gönderileri
- `getCommunityPosts(communityId, params?)` - Topluluk gönderileri

#### Yorum Yönetimi
- `getPostComments(postId)` - Gönderi yorumları
- `createComment(postId, commentData)` - Yorum oluştur
- `updateComment(postId, commentId, commentData)` - Yorum güncelle
- `deleteComment(postId, commentId)` - Yorum sil
- `likeComment(postId, commentId)` - Yorum beğen/beğeni kaldır

### 3. Community Service (`communityService`)

#### Temel CRUD
- `getAllCommunities(params?)` - Tüm toplulukları getir
- `getCommunityById(communityId)` - Topluluk detayı
- `createCommunity(communityData)` - Yeni topluluk oluştur
- `updateCommunity(communityId, communityData)` - Topluluk güncelle
- `deleteCommunity(communityId)` - Topluluk sil

#### Üyelik Yönetimi
- `getCommunityMembers(communityId, params?)` - Topluluk üyeleri
- `joinCommunity(communityId)` - Topluluğa katıl
- `leaveCommunity(communityId)` - Topluluktan ayrıl
- `updateMemberRole(communityId, userId, role)` - Üye rolü güncelle

#### Kullanıcı Toplulukları
- `getUserCommunities(userId?)` - Kullanıcının toplulukları

### 4. Search Service (`searchService`)

#### Arama İşlemleri
- `search(query, limit?, offset?)` - Genel arama
- `searchUsers(query, limit?, offset?)` - Kullanıcı araması
- `searchCommunities(query, limit?, offset?)` - Topluluk araması
- `searchPosts(query, limit?, offset?)` - Gönderi araması

### 5. Interaction Service (`interactionService`)

#### Etkileşim Yönetimi
- `addInteraction(userId, tag, interactionType)` - Etkileşim kaydet
- `getUserInteractions(userId, type?)` - Kullanıcı etkileşimleri
- `getUserTagInteractions(userId, tag)` - Kullanıcı-etiket etkileşimleri
- `getPopularTags(limit?)` - Popüler etiketler

#### Yardımcı Fonksiyonlar
- `likeTag(userId, tag)` - Etiket beğen
- `viewTag(userId, tag)` - Etiket görüntüle
- `shareTag(userId, tag)` - Etiket paylaş
- `commentTag(userId, tag)` - Etiket yorumla

## Kullanım Örnekleri

### Kullanıcı Girişi
```javascript
import { userService } from './services/apiService';

const login = async (email, password) => {
  try {
    const result = await userService.login({ email, password });
    // Token otomatik olarak localStorage'a kaydedilir
    return result;
  } catch (error) {
    console.error('Giriş hatası:', error.message);
  }
};
```

### Gönderi Oluşturma
```javascript
import { postService } from './services/apiService';

const createPost = async (postData) => {
  try {
    const result = await postService.createPost(postData);
    return result;
  } catch (error) {
    console.error('Gönderi oluşturma hatası:', error.message);
  }
};
```

### Topluluk Arama
```javascript
import { searchService } from './services/apiService';

const searchCommunities = async (searchTerm) => {
  try {
    const result = await searchService.searchCommunities(searchTerm, 20, 0);
    return result;
  } catch (error) {
    console.error('Arama hatası:', error.message);
  }
};
```

## Hata Yönetimi

Tüm servislerde otomatik hata yönetimi bulunmaktadır:
- **401 Unauthorized**: Token geçersiz veya eksik
- **403 Forbidden**: Yetkisiz erişim
- **404 Not Found**: Kaynak bulunamadı
- **400 Bad Request**: Geçersiz parametre
- **500 Internal Server Error**: Sunucu hatası

## Environment Variables

Geliştirme ortamında farklı portlar kullanmak için environment variables kullanabilirsiniz:

```env
NEXT_PUBLIC_USER_API_URL=http://localhost:3001
NEXT_PUBLIC_POST_API_URL=http://localhost:3002
NEXT_PUBLIC_COMMUNITY_API_URL=http://localhost:3003
NEXT_PUBLIC_SEARCH_API_URL=http://localhost:3004
NEXT_PUBLIC_INTERACTION_API_URL=http://localhost:3005
``` 