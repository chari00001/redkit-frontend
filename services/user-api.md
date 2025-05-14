# Redit User Service API Dokümantasyonu

## Genel Bilgiler

**Base URL:** `http://localhost:3010/api/users`

**Kimlik Doğrulama:** Çoğu endpoint JWT token gerektirir. Token, `Authorization` başlığında `Bearer [token]` formatında gönderilmelidir.

---

## 1. Kimlik Doğrulama İşlemleri

### 1.1 Kullanıcı Kaydı

- **URL:** `/register`
- **Metod:** `POST`
- **Kimlik Doğrulama:** Gerekli değil
- **İstek (Request):**
  ```json
  {
    "username": "kullanici_adi",
    "email": "ornek@email.com",
    "password": "Parola123"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı başarıyla kaydedildi",
    "token": "jwt_token",
    "verifyToken": "email_dogrulama_tokeni"
  }
  ```

### 1.2 Kullanıcı Girişi

- **URL:** `/login`
- **Metod:** `POST`
- **Kimlik Doğrulama:** Gerekli değil
- **İstek (Request):**
  ```json
  {
    "email": "ornek@email.com", 
    "password": "Parola123"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "token": "jwt_token",
    "user": {
      "id": 1,
      "username": "kullanici_adi",
      "email": "ornek@email.com",
      "role": "user"
    }
  }
  ```

### 1.3 Şifre Sıfırlama İsteği

- **URL:** `/forgot-password`
- **Metod:** `POST`
- **Kimlik Doğrulama:** Gerekli değil
- **İstek (Request):**
  ```json
  {
    "email": "ornek@email.com"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Şifre sıfırlama bağlantısı gönderildi",
    "resetToken": "sifirlama_tokeni"
  }
  ```

### 1.4 Şifre Sıfırlama

- **URL:** `/reset-password`
- **Metod:** `POST`
- **Kimlik Doğrulama:** Gerekli değil
- **İstek (Request):**
  ```json
  {
    "token": "sifirlama_tokeni",
    "password": "YeniParola123"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Şifre başarıyla sıfırlandı"
  }
  ```

### 1.5 Hesap Doğrulama

- **URL:** `/verify/:token`
- **Metod:** `GET`
- **Kimlik Doğrulama:** Gerekli değil
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Hesap başarıyla doğrulandı"
  }
  ```

---

## 2. Profil İşlemleri

### 2.1 Kendi Profilini Görüntüleme

- **URL:** `/me`
- **Metod:** `GET`
- **Kimlik Doğrulama:** Gerekli
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "username": "kullanici_adi",
      "email": "ornek@email.com",
      "bio": "Profil açıklaması",
      "location": "İstanbul",
      "profile_picture_url": "https://example.com/pp.jpg",
      "role": "user",
      "is_verified": true,
      "account_status": "active",
      "follower_count": 10,
      "following_count": 5
    }
  }
  ```

### 2.2 Profil Güncelleme

- **URL:** `/me`
- **Metod:** `PUT`
- **Kimlik Doğrulama:** Gerekli
- **İstek (Request):**
  ```json
  {
    "bio": "Yeni profil açıklaması",
    "location": "Ankara",
    "profile_picture_url": "https://example.com/yeni_pp.jpg"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Profil başarıyla güncellendi",
    "user": {
      "id": 1,
      "username": "kullanici_adi",
      "bio": "Yeni profil açıklaması",
      "location": "Ankara"
    }
  }
  ```

### 2.3 Şifre Değiştirme

- **URL:** `/me/password`
- **Metod:** `PUT`
- **Kimlik Doğrulama:** Gerekli
- **İstek (Request):**
  ```json
  {
    "currentPassword": "EskiParola123",
    "newPassword": "YeniParola456"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Şifre başarıyla değiştirildi"
  }
  ```

### 2.4 E-posta Değiştirme

- **URL:** `/me/email`
- **Metod:** `PUT`
- **Kimlik Doğrulama:** Gerekli
- **İstek (Request):**
  ```json
  {
    "password": "Parola123",
    "newEmail": "yeni@email.com"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "E-posta adresi başarıyla değiştirildi"
  }
  ```

### 2.5 Bildirim Tercihlerini Güncelleme

- **URL:** `/me/notifications`
- **Metod:** `PUT`
- **Kimlik Doğrulama:** Gerekli
- **İstek (Request):**
  ```json
  {
    "email_notifications": true,
    "push_notifications": false
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Bildirim tercihleri başarıyla güncellendi"
  }
  ```

---

## 3. Sosyal İşlemler

### 3.1 Takipçileri Görüntüleme

- **URL:** `/followers`
- **Metod:** `GET`
- **Kimlik Doğrulama:** Gerekli
- **Sorgu Parametreleri:**
  - `page`: Sayfa numarası (varsayılan: 1)
  - `limit`: Sayfa başına öğe sayısı (varsayılan: 10)
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "followers": [
      {
        "id": 2,
        "username": "takipci1",
        "profile_picture_url": "https://example.com/pp1.jpg",
        "followed_at": "2023-04-12T14:30:00Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
  ```

### 3.2 Takip Edilenleri Görüntüleme

- **URL:** `/following`
- **Metod:** `GET`
- **Kimlik Doğrulama:** Gerekli
- **Sorgu Parametreleri:**
  - `page`: Sayfa numarası (varsayılan: 1)
  - `limit`: Sayfa başına öğe sayısı (varsayılan: 10)
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "following": [
      {
        "id": 3,
        "username": "takipedilen1",
        "profile_picture_url": "https://example.com/pp2.jpg",
        "followed_at": "2023-05-20T10:15:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
  ```

### 3.3 Kullanıcı Takip Etme

- **URL:** `/follow/:id`
- **Metod:** `POST`
- **Kimlik Doğrulama:** Gerekli
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı başarıyla takip edildi"
  }
  ```

### 3.4 Kullanıcı Takibini Bırakma

- **URL:** `/follow/:id`
- **Metod:** `DELETE`
- **Kimlik Doğrulama:** Gerekli
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı takibi başarıyla bırakıldı"
  }
  ```

---

## 4. Admin İşlemleri

### 4.1 Tüm Kullanıcıları Listeleme

- **URL:** `/`
- **Metod:** `GET`
- **Kimlik Doğrulama:** Gerekli (Admin)
- **Sorgu Parametreleri:**
  - `page`: Sayfa numarası (varsayılan: 1)
  - `limit`: Sayfa başına öğe sayısı (varsayılan: 10)
  - `status`: Hesap durumu filtresi (active, suspended, deactivated)
  - `role`: Rol filtresi (user, admin, moderator)
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "users": [
      {
        "id": 1,
        "username": "kullanici1",
        "email": "kullanici1@email.com",
        "role": "user",
        "account_status": "active",
        "created_at": "2023-01-15T08:30:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
  ```

### 4.2 Kullanıcı Detaylarını Görüntüleme

- **URL:** `/:id`
- **Metod:** `GET`
- **Kimlik Doğrulama:** Gerekli (Admin)
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "username": "kullanici1",
      "email": "kullanici1@email.com",
      "role": "user",
      "account_status": "active",
      "created_at": "2023-01-15T08:30:00Z",
      "last_login": "2023-06-10T14:20:00Z",
      "bio": "Kullanıcı profil bilgisi",
      "location": "İstanbul"
    }
  }
  ```

### 4.3 Kullanıcı Güncelleme (Admin)

- **URL:** `/:id`
- **Metod:** `PUT`
- **Kimlik Doğrulama:** Gerekli (Admin)
- **İstek (Request):**
  ```json
  {
    "role": "moderator",
    "account_status": "active",
    "subscription_level": "premium"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı başarıyla güncellendi",
    "user": {
      "id": 1,
      "username": "kullanici1",
      "role": "moderator",
      "account_status": "active"
    }
  }
  ```

### 4.4 Kullanıcı Silme

- **URL:** `/:id`
- **Metod:** `DELETE`
- **Kimlik Doğrulama:** Gerekli (Admin)
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı başarıyla silindi"
  }
  ```

### 4.5 Kullanıcı Durumunu Güncelleme

- **URL:** `/:id/status`
- **Metod:** `PUT`
- **Kimlik Doğrulama:** Gerekli (Admin)
- **İstek (Request):**
  ```json
  {
    "status": "suspended",
    "reason": "Topluluk kurallarının ihlali"
  }
  ```
- **Başarılı Yanıt (200):**
  ```json
  {
    "success": true,
    "message": "Kullanıcı durumu başarıyla güncellendi"
  }
  ```

---

## Hata Yanıtları

### Yetkilendirme Hatası (401)
```json
{
  "success": false,
  "message": "Yetkilendirme hatası. Lütfen giriş yapın."
}
```

### Yasak Erişim (403)
```json
{
  "success": false,
  "message": "Bu işlem için yetkiniz yok."
}
```

### Bulunamadı (404)
```json
{
  "success": false,
  "message": "Kullanıcı bulunamadı."
}
```

### Geçersiz İstek (400)
```json
{
  "success": false,
  "message": "Geçersiz istek parametreleri.",
  "errors": [
    {
      "param": "email",
      "message": "Geçerli bir e-posta adresi giriniz."
    }
  ]
}
```

### Sunucu Hatası (500)
```json
{
  "success": false,
  "message": "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin."
}
``` 