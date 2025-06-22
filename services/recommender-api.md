# 📚 Redit Feed API Dokümantasyonu

## 🚀 Genel Bilgiler

Bu API, Reddit benzeri sosyal medya platformu için **akıllı makine öğrenmesi** tabanlı içerik öneri sistemi sunar.

**Base URL:** `http://localhost:8000/api/v1`

---

## 🗒️ Hızlı Referans Tablosu

| # | Metot | Yol | Açıklama |
|---|-------|-------------------------------|----------------------------------|
| 1 | GET   | `/recommendations`            | Kişiselleştirilmiş öneriler |
| 2 | GET   | `/feed`                       | Kişiselleştirilmiş ana feed |
| 3 | GET   | `/user-profile/{user_id}`     | Kullanıcı profili |
| 4 | GET   | `/post-analysis/{post_id}`    | Post analizi |
| 5 | GET   | `/similar-posts/{post_id}`    | Benzer postlar |
| 6 | GET   | `/topics`                     | Tüm konular |
| 7 | GET   | `/topic-posts/{topic_id}`     | Konudaki postlar |
| 8 | POST  | `/track-interaction`          | Etkileşim kaydetme |
| 9 | POST  | `/analyze-new-posts`          | Yeni post analizi |
|10 | POST  | `/retrain-model`              | Model yeniden eğitimi |
|11 | POST  | `/interact` (legacy)          | Eski endpoint |

> Tüm yollar `http://localhost:8000/api/v1` önekini alır (ör: `/recommendations` → `http://localhost:8000/api/v1/recommendations`).

### 🚀 Entegrasyon Notları
1. **İçerik Tipi:** JSON istekleri için `Content-Type: application/json` başlığı gönderin.
2. **CORS:** Sunucu tüm origin'lere açıktır (geliştirme için). Production'da kısıtlanabilir.
3. **Yanıt Formatı:** Başarılı yanıtlar genellikle şu alanları içerir:
   - `status` (success / error)
   - `message` (opsiyonel bilgi)
   - Özel veri alanları (ör. `recommendations`, `posts`)
4. **Hata Kodları:** 404 (Bulunamadı), 422 (Geçersiz parametre), 500 (Sunucu hatası).
5. **Örnek İstemci:**
```javascript
fetch("http://localhost:8000/api/v1/recommendations?user_id=123")
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## 📍 API Endpoints

### 🎯 **Öneri Sistemi**

#### 1. **GET** `/recommendations`
**Açıklama:** Kullanıcıya kişiselleştirilmiş içerik önerileri sunar.

**Controller:** `get_recommendations()`

**Parametreler:**
- `user_id` (int, gerekli) - Kullanıcı ID'si
- `limit` (int, opsiyonel) - Öneri sayısı (varsayılan: 10, maksimum: 50)

**Örnek Kullanım:**
```bash
GET /api/v1/recommendations?user_id=123&limit=10
```

**Yanıt:**
```json
{
  "user_id": 123,
  "recommendations": [...],
  "count": 10,
  "timestamp": "2024-01-01T00:00:00"
}
```

---

#### 2. **GET** `/feed`
**Açıklama:** Kullanıcıya kişiselleştirilmiş ana feed döndürür.

**Controller:** `feed()`

**Parametreler:**
- `user_id` (int, gerekli) - Kullanıcı ID'si

**Örnek Kullanım:**
```bash
GET /api/v1/feed?user_id=123
```

---

### 👤 **Kullanıcı Profili**

#### 3. **GET** `/user-profile/{user_id}`
**Açıklama:** Kullanıcının ilgi alanları profilini döndürür.

**Controller:** `get_user_interest_profile()`

**Parametreler:**
- `user_id` (int, path) - Kullanıcı ID'si

**Örnek Kullanım:**
```bash
GET /api/v1/user-profile/123
```

**Yanıt:**
```json
{
  "tag_preferences": {...},
  "cluster_preferences": {...},
  "total_interactions": 45,
  "last_updated": "..."
}
```

---

### 📝 **Post Analizi**

#### 4. **GET** `/post-analysis/{post_id}`
**Açıklama:** Belirli bir postun detaylı analizini döndürür.

**Controller:** `get_post_analysis()`

**Parametreler:**
- `post_id` (int, path) - Post ID'si

**Örnek Kullanım:**
```bash
GET /api/v1/post-analysis/456
```

**Yanıt:**
```json
{
  "post_id": 456,
  "analysis": {
    "enhanced_tags": [...],
    "cluster_id": 2,
    "keywords": [...]
  },
  "status": "analyzed"
}
```

---

#### 5. **GET** `/similar-posts/{post_id}`
**Açıklama:** Belirli bir posta benzer postları döndürür.

**Controller:** `get_similar_posts()`

**Parametreler:**
- `post_id` (int, path) - Post ID'si
- `limit` (int, opsiyonel) - Benzer post sayısı (varsayılan: 5, maksimum: 20)

**Örnek Kullanım:**
```bash
GET /api/v1/similar-posts/456?limit=5
```

**Yanıt:**
```json
{
  "post_id": 456,
  "similar_posts": [...],
  "count": 5
}
```

---

### 🎯 **Konu Yönetimi**

#### 6. **GET** `/topics`
**Açıklama:** Tüm konuların özetini döndürür.

**Controller:** `get_topics()`

**Örnek Kullanım:**
```bash
GET /api/v1/topics
```

**Yanıt:**
```json
{
  "total_clusters": 8,
  "cluster_info": {
    "0": {
      "keywords": ["teknoloji", "yapay zeka"],
      "post_count": 25
    }
  }
}
```

---

#### 7. **GET** `/topic-posts/{topic_id}`
**Açıklama:** Belirli bir konudaki postları döndürür.

**Controller:** `get_topic_posts()`

**Parametreler:**
- `topic_id` (int, path) - Konu ID'si
- `limit` (int, opsiyonel) - Post sayısı (varsayılan: 10, maksimum: 50)

**Örnek Kullanım:**
```bash
GET /api/v1/topic-posts/2?limit=10
```

**Yanıt:**
```json
{
  "topic_id": 2,
  "posts": [...],
  "count": 10
}
```

---

### 📊 **Etkileşim Yönetimi**

#### 8. **POST** `/track-interaction`
**Açıklama:** Kullanıcı etkileşimini kaydet ve öneri modelini güncelle.

**Controller:** `track_interaction()`

**Parametreler:**
- `user_id` (int) - Kullanıcı ID'si
- `post_id` (int) - Post ID'si
- `interaction_type` (str) - Etkileşim türü (`view`, `like`, `comment`, `share`)

**Örnek Kullanım:**
```bash
POST /api/v1/track-interaction
```

**Request Body:**
```json
{
  "user_id": 123,
  "post_id": 456,
  "interaction_type": "like"
}
```

**Yanıt:**
```json
{
  "status": "success",
  "message": "Etkileşim kaydedildi: like",
  "user_id": 123,
  "post_id": 456,
  "weight": 3.0
}
```

---

### 🔄 **Sistem Yönetimi**

#### 9. **POST** `/analyze-new-posts`
**Açıklama:** Son 3 saatte eklenen yeni postları analiz eder.

**Controller:** `analyze_new_posts()`

**Örnek Kullanım:**
```bash
POST /api/v1/analyze-new-posts
```

**Yanıt:**
```json
{
  "status": "success",
  "message": "Yeni postlar analiz edildi",
  "analyzed_count": 15,
  "total_posts": 1250,
  "timestamp": "2024-01-01T00:00:00"
}
```

---

#### 10. **POST** `/retrain-model`
**Açıklama:** Öneri modelini tüm verileri kullanarak yeniden eğitir.

**Controller:** `retrain_model()`

**Örnek Kullanım:**
```bash
POST /api/v1/retrain-model
```

**Yanıt:**
```json
{
  "status": "success",
  "message": "Model başarıyla yeniden eğitildi",
  "posts_count": 1250,
  "features_count": 845,
  "users_count": 150,
  "topics_count": 8,
  "timestamp": "2024-01-01T00:00:00"
}
```

---

### 📎 **Eski Endpoints (Geriye Uyumluluk)**

#### 11. **POST** `/interact`
**Açıklama:** Eski etkileşim endpoint'i (geriye uyumluluk için).

**Controller:** `interact()`

---

## 🔧 **Yardımcı Fonksiyonlar**

### 1. `load_recommender_data(force_reload=False)`
- **Amaç:** Öneri modelini yükler ve eğitir
- **Parametreler:** 
  - `force_reload` (bool) - Zorla yeniden yükleme

### 2. `load_user_interactions()`
- **Amaç:** Kullanıcı etkileşimlerini veritabanından yükler
- **Kaynak:** `Likes` ve `Comments` tabloları

---

## 📊 **Etkileşim Ağırlıkları**

- **`view`**: 1.0
- **`like`**: 3.0
- **`comment`**: 4.0
- **`share`**: 5.0

---

## 🚀 **Kullanım Örnekleri**

### Kişiselleştirilmiş Öneri Alma
```bash
curl "http://localhost:8000/api/v1/recommendations?user_id=123&limit=10"
```

### Etkileşim Kaydetme
```bash
curl -X POST "http://localhost:8000/api/v1/track-interaction" \
  -H "Content-Type: application/json" \
  -d '{"user_id":123, "post_id":456, "interaction_type":"like"}'
```

### Model Yeniden Eğitimi
```bash
curl -X POST "http://localhost:8000/api/v1/retrain-model"
```

---

## ⚡ **Hata Kodları**

- **404:** Post bulunamadı
- **500:** Sunucu hatası
- **422:** Geçersiz parametre

---

*Bu dokümantasyon, Redit Feed API v2.0.0 için hazırlanmıştır.*
