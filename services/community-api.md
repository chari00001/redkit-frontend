# Redit Topluluk Servisi API Dokümantasyonu

## Genel Bilgiler

**Base URL:** `http://localhost:3002/api/communities`

**Kimlik Doğrulama:** Çoğu endpoint JWT token gerektirir. Token, `Authorization` başlığında `Bearer [token]` formatında gönderilmelidir.

---

## 1. Topluluk İşlemleri

### 1.1 Tüm Toplulukları Listeleme

- **URL:** `/`
- **Metod:** `GET`
- **Kimlik Doğrulama:** İsteğe bağlı (Kimlik doğrulaması olmadan sadece herkese açık topluluklar görüntülenir)
- **Sorgu Parametreleri:**
  - `name`: Topluluk adına göre filtrele
  - `visibility`: Görünürlüğe göre filtrele (public, private, restricted)
  - `sort`: Sıralama kriteri (oldest, members, posts, created_at)
  - `page`: Sayfa numarası (varsayılan: 1)
  - `limit`: Sayfa başına öğe sayısı (varsayılan: 10)
- **Başarılı Yanıt (200):**
  ```json
  {
    "communities": [
      {
        "id": 1,
        "name": "Programlama",
        "description": "Programlama hakkında konuşmalar",
        "visibility": "public",
        "member_count": 120,
        "post_count": 45,
        "created_at": "2023-05-10T14:30:00Z",
        "creator": {
          "id": 5,
          "username": "admin",
          "profile_picture_url": "https://example.com/pp.jpg"
        }
      }
    ],
    "totalCount": 50,
    "totalPages": 5,
    "currentPage": 1
  }
  ```

### 1.2 Topluluk Oluşturma

- **URL:** `/`
- **Metod:** `POST`
- **Kimlik Doğrulama:** Gerekli
- **İstek (Request):**
  ```json
  {
    "name": "Yeni Topluluk",
    "description": "Topluluk açıklaması",
    "visibility": "public",
    "rules": "Topluluk kuralları",
    "tags": ["teknoloji", "yazılım"],
    "is_featured": false,
    "cover_image_url": "https://example.com/cover.jpg"
  }
  ```
- **Başarılı Yanıt (201):**
  ```json
  {
    "message": "Topluluk başarıyla oluşturuldu",
    "community": {
      "id": 10,
      "name": "Yeni Topluluk",
      "description": "Topluluk açıklaması",
      "visibility": "public",
      "member_count": 1,
      "created_at": "2023-08-15T10:20:30Z"
    }
  }
  ```

### 1.3 Topluluk Detaylarını Görüntüleme

- **URL:** `/:id`
- **Metod:** `GET`
- **Kimlik Doğrulama:** İsteğe bağlı (Özel topluluklar için kimlik doğrulaması gerekli)
- **Başarılı Yanıt (200):**
  ```json
  {
    "id": 10,
    "name": "Yeni Topluluk",
    "description": "Topluluk açıklaması",
    "visibility": "public",
    "rules": "Topluluk kuralları",
    "tags": ["teknoloji", "yazılım"],
    "member_count": 45,
    "post_count": 12,
    "is_verified": false,
    "is_featured": false,
    "cover_image_url": "https://example.com/cover.jpg",
    "created_at": "2023-08-15T10:20:30Z",
    "creator": {
      "id": 5,
      "username": "admin",
      "profile_picture_url": "https://example.com/pp.jpg"
    }
  }
  ```

### 1.4 Topluluk Güncelleme

- **URL:** `/:id`
- **Metod:** `PUT`
- **Kimlik Doğrulama:** Gerekli (Admin veya Moderatör rolü)
- **İstek (Request):**
  ```json
  {
    "description": "Güncellenmiş açıklama",
    "visibility": "restricted",
    "rules": "Güncellenmiş kurallar",
    "tags": ["yeni", "etiketler"],
    "cover_image_url": "https://example.com/new-cover.jpg"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "message": "Topluluk başarıyla güncellendi",
    "community": {
      "id": 10,
      "name": "Yeni Topluluk",
      "description": "Güncellenmiş açıklama",
      "visibility": "restricted"
    }
  }
  ```

### 1.5 Topluluk Silme

- **URL:** `/:id`
- **Metod:** `DELETE`
- **Kimlik Doğrulama:** Gerekli (Topluluk sahibi veya admin)
- **Başarılı Yanıt (200):**
  ```json
  {
    "message": "Topluluk başarıyla silindi"
  }
  ```

---

## 2. Üyelik İşlemleri

### 2.1 Topluluğa Katılma

- **URL:** `/:id/join`
- **Metod:** `POST`
- **Kimlik Doğrulama:** Gerekli
- **Başarılı Yanıt (200):**
  ```json
  {
    "message": "Topluluğa başarıyla katıldınız"
  }
  ```

### 2.2 Topluluktan Ayrılma

- **URL:** `/:id/leave`
- **Metod:** `POST`
- **Kimlik Doğrulama:** Gerekli
- **Başarılı Yanıt (200):**
  ```json
  {
    "message": "Topluluktan başarıyla ayrıldınız"
  }
  ```

### 2.3 Topluluk Üyelerini Görüntüleme

- **URL:** `/:id/members`
- **Metod:** `GET`
- **Kimlik Doğrulama:** İsteğe bağlı (Özel topluluklar için kimlik doğrulaması gerekli)
- **Sorgu Parametreleri:**
  - `role`: Rol bazında filtreleme (admin, moderator, member)
  - `search`: Kullanıcı adına göre arama
  - `page`: Sayfa numarası (varsayılan: 1)
  - `limit`: Sayfa başına öğe sayısı (varsayılan: 20)
- **Başarılı Yanıt (200):**
  ```json
  {
    "members": [
      {
        "role": "admin",
        "joined_at": "2023-08-15T10:20:30Z",
        "User": {
          "id": 5,
          "username": "admin",
          "profile_picture_url": "https://example.com/pp.jpg"
        }
      },
      {
        "role": "moderator",
        "joined_at": "2023-08-16T11:25:30Z",
        "User": {
          "id": 8,
          "username": "moderator_user",
          "profile_picture_url": "https://example.com/pp2.jpg"
        }
      }
    ],
    "totalCount": 45,
    "totalPages": 3,
    "currentPage": 1
  }
  ```

### 2.4 Üye Rolünü Güncelleme

- **URL:** `/:id/members/:userId`
- **Metod:** `PUT`
- **Kimlik Doğrulama:** Gerekli (Admin rolü)
- **İstek (Request):**
  ```json
  {
    "role": "moderator"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "message": "Üye rolü başarıyla güncellendi",
    "membership": {
      "user_id": 8,
      "community_id": 10,
      "role": "moderator",
      "joined_at": "2023-08-16T11:25:30Z"
    }
  }
  ```

### 2.5 Kullanıcının Toplulukları

- **URL:** `/user/:userId?`
- **Metod:** `GET`
- **Kimlik Doğrulama:** Gerekli
- **Not:** `userId` parametresi belirtilmezse, kimliği doğrulanmış kullanıcının toplulukları getirilir.
- **Sorgu Parametreleri:**
  - `page`: Sayfa numarası (varsayılan: 1)
  - `limit`: Sayfa başına öğe sayısı (varsayılan: 10)
- **Başarılı Yanıt (200):**
  ```json
  {
    "communities": [
      {
        "id": 10,
        "name": "Yeni Topluluk",
        "description": "Topluluk açıklaması",
        "visibility": "public",
        "member_count": 45,
        "post_count": 12,
        "cover_image_url": "https://example.com/cover.jpg"
      }
    ],
    "totalCount": 5,
    "totalPages": 1,
    "currentPage": 1
  }
  ```

---

## Hata Yanıtları

### Yetkilendirme Hatası (401)
```json
{
  "message": "Yetkilendirme hatası, lütfen tekrar giriş yapın"
}
```

### Yasak Erişim (403)
```json
{
  "message": "Bu topluluğu güncelleme yetkiniz yok"
}
```

### Kaynak Bulunamadı (404)
```json
{
  "message": "Topluluk bulunamadı"
}
```

### Geçersiz İstek (400)
```json
{
  "message": "Bu isimde bir topluluk zaten var"
}
```

### Sunucu Hatası (500)
```json
{
  "message": "Topluluk oluşturulurken bir hata oluştu",
  "error": "Hata mesajı",
  "detail": "Hata detayları"
}
``` 