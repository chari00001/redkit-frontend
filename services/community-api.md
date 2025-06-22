# Community Service API

**Base URL**: `http://localhost:3003/api/communities`

---

## 📋 Endpoints

### 1. Tüm Toplulukları Getir
```
GET /api/communities
```

**Query Parameters:**
- `page`: sayfa numarası (default: 1)
- `limit`: sayfa başına kayıt (default: 10)
- `name`: topluluk adında arama
- `sort`: newest|oldest|members|posts

**Response:**
```json
{
  "communities": [
    {
      "id": 1,
      "name": "Teknoloji",
      "description": "Teknoloji tartışmaları",
      "visibility": "public",
      "member_count": 150,
      "post_count": 45,
      "cover_image_url": "https://example.com/cover.jpg",
      "creator": {
        "id": 3,
        "username": "cagri"
      }
    }
  ],
  "totalCount": 25,
  "totalPages": 3,
  "currentPage": 1
}
```

---

### 2. Topluluk Detayı
```
GET /api/communities/:id
```

**Parameters:**
- `id`: Topluluk ID'si (number) ⚠️ **Sadece ID destekleniyor**

**Response:**
```json
{
  "id": 1,
  "name": "Teknoloji",
  "description": "Teknoloji tartışmaları",
  "visibility": "public",
  "member_count": 150,
  "post_count": 45,
  "rules": "1. Saygılı olun\n2. Spam yapmayın",
  "tags": ["tech", "programming"],
  "cover_image_url": "https://example.com/cover.jpg",
  "creator": {
    "id": 3,
    "username": "cagri"
  }
}
```

---

### 3. Topluluk Oluştur
```
POST /api/communities
```

**Request:**
```json
{
  "name": "Yeni Topluluk",
  "description": "Açıklama",
  "visibility": "public",
  "rules": "Kurallar",
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "message": "Topluluk başarıyla oluşturuldu",
  "community": {
    "id": 2,
    "name": "Yeni Topluluk",
    "member_count": 1
  }
}
```

---

### 4. Topluluk Güncelle
```
PUT /api/communities/:id
```

**Parameters:**
- `id`: Topluluk ID'si (number) ⚠️ **Sadece ID destekleniyor**

**Request:**
```json
{
  "description": "Yeni açıklama",
  "rules": "Yeni kurallar",
  "tags": ["yeni", "etiketler"]
}
```

---

### 5. Topluluğa Katıl
```
POST /api/communities/:id/join
```

**Parameters:**
- `id`: Topluluk ID'si (number) ⚠️ **Sadece ID destekleniyor**

**Response:**
```json
{
  "message": "Topluluğa başarıyla katıldınız"
}
```

---

### 6. Topluluktan Ayrıl
```
POST /api/communities/:id/leave
```

**Parameters:**
- `id`: Topluluk ID'si (number) ⚠️ **Sadece ID destekleniyor**

**Response:**
```json
{
  "message": "Topluluktan başarıyla ayrıldınız"
}
```

---

### 7. Topluluk Üyeleri
```
GET /api/communities/:id/members
```

**Parameters:**
- `id`: Topluluk ID'si (number) ⚠️ **Sadece ID destekleniyor**

**Query Parameters:**
- `page`: sayfa numarası
- `limit`: sayfa başına kayıt
- `role`: member|moderator|admin

**Response:**
```json
{
  "members": [
    {
      "user_id": 3,
      "role": "admin",
      "joined_at": "2025-05-24T17:00:00.000Z",
      "User": {
        "id": 3,
        "username": "cagri"
      }
    }
  ],
  "totalCount": 150,
  "currentPage": 1
}
```

---

### 8. Kullanıcının Toplulukları
```
GET /api/communities/user/:userId
```

**Response:**
```json
{
  "communities": [
    {
      "id": 1,
      "name": "Teknoloji",
      "member_count": 150,
      "cover_image_url": "https://example.com/cover.jpg"
    }
  ],
  "totalCount": 5
}
```

---

### 9. Topluluk Postları ✅ **ÇALIŞIYOR**
```
GET /api/communities/:id/posts
```

**Parameters:**
- `id`: Topluluk ID'si (number) ⚠️ **Sadece ID destekleniyor**
  - ✅ Çalışır: `/api/communities/10/posts`
  - ❌ Çalışmaz: `/api/communities/DevCorner/posts`

**Query Parameters:**
- `page`: sayfa numarası (default: 1)
- `limit`: sayfa başına kayıt (default: 10)
- `sort`: newest|oldest|popular

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Yeni Teknoloji Trendi",
      "content": "Bu yıl dikkat çeken teknolojiler...",
      "user_id": 3,
      "media_url": "http://localhost:3002/static/uploads/images/example.jpg",
      "likes_count": 25,
      "comments_count": 8,
      "views_count": 150,
      "visibility": "public",
      "tags": ["teknoloji", "ai"],
      "created_at": "2025-05-24T17:00:00.000Z"
    }
  ],
  "totalCount": 45,
  "totalPages": 5,
  "currentPage": 1,
  "community": {
    "id": 1,
    "name": "Teknoloji",
    "description": "Teknoloji tartışmaları",
    "member_count": 150
  }
}
```

---

## 🔧 JavaScript Örnekleri

### Toplulukları Getir
```javascript
const getCommunities = async (page = 1) => {
  const response = await fetch(`http://localhost:3003/api/communities?page=${page}`);
  const data = await response.json();
  return data.communities;
};
```

### Topluluk Oluştur
```javascript
const createCommunity = async (communityData) => {
  const response = await fetch('http://localhost:3003/api/communities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(communityData)
  });
  return await response.json();
};
```

### Topluluğa Katıl (Sadece ID ile)
```javascript
const joinCommunity = async (communityId) => {
  const response = await fetch(`http://localhost:3003/api/communities/${communityId}/join`, {
    method: 'POST'
  });
  return await response.json();
};

// Kullanım örnekleri:
// await joinCommunity(10);           // ✅ ID ile çalışır
// await joinCommunity('DevCorner');  // ❌ Name ile çalışmaz
```

### Topluluk Postlarını Getir (Sadece ID ile)
```javascript
const getCommunityPosts = async (communityId, page = 1, limit = 10) => {
  const response = await fetch(
    `http://localhost:3003/api/communities/${communityId}/posts?page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// Kullanım örnekleri:
// await getCommunityPosts(10);           // ✅ ID ile çalışır
// await getCommunityPosts('DevCorner');  // ❌ Name ile çalışmaz
```

### Topluluk Detayı Getir (Frontend'de Name Desteği)
```javascript
// Frontend'de name desteği için önce tüm toplulukları getirip filtrele
const getCommunityByName = async (communityName) => {
  const response = await fetch('http://localhost:3003/api/communities');
  const data = await response.json();
  
  const community = data.communities.find(
    c => c.name.toLowerCase() === communityName.toLowerCase()
  );
  
  if (!community) {
    throw new Error(`Topluluk bulunamadı: ${communityName}`);
  }
  
  return community;
};

// Kullanım:
// const devCorner = await getCommunityByName('DevCorner');
// const posts = await getCommunityPosts(devCorner.id);
```

---

## ⚠️ Hata Kodları

- **400**: Geçersiz istek
- **401**: Giriş gerekli
- **403**: Yetki yok (özel topluluk erişimi)
- **404**: Topluluk bulunamadı
- **500**: Sunucu hatası

---

## 🚨 Bilinen Sorunlar ve Çözümler

### ❌ **Name Endpoint'leri Çalışmıyor**
Backend'de aşağıdaki endpoint'ler mevcut değil:
- `/api/communities/name/:name`
- `/api/communities/:name/posts` (name ile)
- `/api/communities/:name/join` (name ile)

### ✅ **Frontend Çözümü**
Frontend'de name desteği için:
1. Önce tüm toplulukları getir (`/api/communities`)
2. Name ile filtrele
3. Bulunan community'nin ID'sini kullan

```javascript
// Frontend'de otomatik name->ID çevirimi
const smartCommunityRequest = async (communityIdOrName, endpoint) => {
  // Eğer sayı ise direkt kullan
  if (!isNaN(communityIdOrName)) {
    return await fetch(`/api/communities/${communityIdOrName}${endpoint}`);
  }
  
  // String ise önce ID'yi bul
  const allCommunities = await fetch('/api/communities').then(r => r.json());
  const community = allCommunities.communities.find(
    c => c.name.toLowerCase() === communityIdOrName.toLowerCase()
  );
  
  if (!community) {
    throw new Error(`Topluluk bulunamadı: ${communityIdOrName}`);
  }
  
  return await fetch(`/api/communities/${community.id}${endpoint}`);
};
```

---

## 📝 Notlar

- ✅ Test ortamında authentication otomatik
- ✅ Özel topluluklar sadece üyeler görebilir
- ✅ Topluluk yaratıcısı otomatik admin olur
- ⚠️ **Topluluk adları ile direkt API erişimi desteklenmiyor**
- ✅ **Frontend'de name desteği otomatik çeviri ile sağlanıyor**
- ✅ **Post service ile microservice iletişimi çalışıyor**
- ✅ **ID ile tüm endpoint'ler çalışıyor**

---

## 🔄 Son Güncellemeler

### 2025-05-25
- ❌ Name endpoint'lerinin çalışmadığı tespit edildi
- ✅ Frontend'de otomatik name->ID çevirimi eklendi
- ✅ Community posts endpoint'i ID ile çalışıyor
- ✅ Hata yönetimi iyileştirildi
- ✅ Circular dependency sorunları çözüldü
