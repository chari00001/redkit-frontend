# Redit Arama API Dokümantasyonu

Bu doküman, Redit platformunun arama servisi API'sini tanıtmaktadır. Frontend geliştiricileri için hazırlanmıştır.

## Genel Bilgiler

- **Temel URL**: `http://localhost:3003`
- **API Base Path**: `/api/search`
- **İstek Formatı**: HTTP GET istekleri ile sorgu parametreleri kullanılarak yapılır
- **Yanıt Formatı**: Tüm yanıtlar JSON formatındadır

## API Endpoint'leri

### 1. Genel Arama

Kullanıcılar, topluluklar ve gönderiler dahil olmak üzere tüm içeriklerde arama yapar.

**Endpoint**: `GET /api/search`

**Sorgu Parametreleri**:

| Parametre | Tip    | Zorunlu | Açıklama                                         | Varsayılan |
|-----------|--------|---------|--------------------------------------------------|------------|
| query     | string | Evet    | Arama terimi (en az 2 karakter)                  | -          |
| limit     | int    | Hayır   | Döndürülecek sonuç sayısı (her kategori için)    | 10         |
| offset    | int    | Hayır   | Sayfalama için başlangıç indeksi                 | 0          |

**Yanıt**:

```json
{
  "users": [
    {
      "id": 1,
      "username": "test_user",
      "email": "test@example.com",
      "type": "user"
    }
  ],
  "communities": [
    {
      "id": 1,
      "name": "test_community",
      "description": "Test için topluluk",
      "type": "community"
    }
  ],
  "posts": [
    {
      "id": 1,
      "title": "Test başlık",
      "content": "Test içeriği",
      "user_id": 1,
      "community_id": 1,
      "type": "post"
    }
  ],
  "total": 3
}
```

### 2. Kullanıcı Araması

Sadece kullanıcılar arasında arama yapar.

**Endpoint**: `GET /api/search/users`

**Sorgu Parametreleri**:

| Parametre | Tip    | Zorunlu | Açıklama                                      | Varsayılan |
|-----------|--------|---------|-----------------------------------------------|------------|
| query     | string | Evet    | Arama terimi (en az 2 karakter)               | -          |
| limit     | int    | Hayır   | Döndürülecek kullanıcı sayısı                 | 10         |
| offset    | int    | Hayır   | Sayfalama için başlangıç indeksi              | 0          |

**Yanıt**:

```json
{
  "users": [
    {
      "id": 1,
      "username": "test_user",
      "email": "test@example.com"
    },
    {
      "id": 2,
      "username": "another_test",
      "email": "another@example.com"
    }
  ],
  "total": 2
}
```

### 3. Topluluk Araması

Sadece topluluklar arasında arama yapar.

**Endpoint**: `GET /api/search/communities`

**Sorgu Parametreleri**:

| Parametre | Tip    | Zorunlu | Açıklama                                      | Varsayılan |
|-----------|--------|---------|-----------------------------------------------|------------|
| query     | string | Evet    | Arama terimi (en az 2 karakter)               | -          |
| limit     | int    | Hayır   | Döndürülecek topluluk sayısı                  | 10         |
| offset    | int    | Hayır   | Sayfalama için başlangıç indeksi              | 0          |

**Yanıt**:

```json
{
  "communities": [
    {
      "id": 1,
      "name": "spor_topluluğu",
      "description": "Spor haberleri ve tartışmalar"
    },
    {
      "id": 2,
      "name": "müzik_topluluğu",
      "description": "Müzik hakkında her şey"
    }
  ],
  "total": 2
}
```

### 4. Gönderi Araması

Sadece gönderiler arasında arama yapar.

**Endpoint**: `GET /api/search/posts`

**Sorgu Parametreleri**:

| Parametre | Tip    | Zorunlu | Açıklama                                      | Varsayılan |
|-----------|--------|---------|-----------------------------------------------|------------|
| query     | string | Evet    | Arama terimi (en az 2 karakter)               | -          |
| limit     | int    | Hayır   | Döndürülecek gönderi sayısı                   | 10         |
| offset    | int    | Hayır   | Sayfalama için başlangıç indeksi              | 0          |

**Yanıt**:

```json
{
  "posts": [
    {
      "id": 1,
      "title": "Bugünkü haber",
      "content": "Haber içeriği burada yer alıyor",
      "user_id": 1,
      "community_id": 1
    },
    {
      "id": 2,
      "title": "İlginç bir konu",
      "content": "Konu hakkında detaylar",
      "user_id": 2,
      "community_id": 3
    }
  ],
  "total": 2
}
```

## Hata Durumları

### 1. Geçersiz Sorgu Parametresi

**HTTP Durum Kodu**: `400 Bad Request`

**Yanıt**:

```json
{
  "errors": [
    {
      "query": "Arama sorgusu gereklidir"
    }
  ]
}
```

### 2. Geçersiz Limit veya Offset Değeri

**HTTP Durum Kodu**: `400 Bad Request`

**Yanıt**:

```json
{
  "errors": [
    {
      "limit": "Limit 1 ile 100 arasında bir sayı olmalıdır"
    }
  ]
}
```

### 3. Sunucu Hatası

**HTTP Durum Kodu**: `500 Internal Server Error`

**Yanıt**:

```json
{
  "error": "Sunucu hatası"
}
```

## Örnek İstekler

### Genel Arama Örneği

```
GET /api/search?query=yazılım&limit=5&offset=0
```

### Belirli Bir Kullanıcıyı Arama

```
GET /api/search/users?query=ahmet
```

### Belirli Bir İçeriğe Sahip Toplulukları Arama

```
GET /api/search/communities?query=spor
```

### Belirli Bir Konudaki Gönderileri Arama

```
GET /api/search/posts?query=haber&limit=20
```

## Notlar

- Arama terimleri en az 2 karakter olmalıdır
- Limit değeri en fazla 100 olabilir
- Offset değeri negatif olamaz
- Tüm aramalar büyük/küçük harf duyarsızdır (case-insensitive)
- Sorgu parametresi (query) hem tam kelime eşleşmesi hem de kısmi eşleşme yapabilir