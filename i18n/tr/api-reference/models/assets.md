---
i18nSource: 43d08f60800d37f5
title: Media Assets API
description: Yeniden kullanılabilir medya Asset'lerini kaydedin; güncel meta verilerini ve indirme URL'lerini alın.
---

# Media Assets API {#media-assets-api}

Medya URL'lerini kaydetmek ve yerel video üretim istekleri için bir `asset_url` almak üzere `/v1/assets` adresinde sunulan,
resmi protokolle uyumlu Asset protokolünü kullanın.

Medyayı kaydeden ve döndürülen `asset://` referansını Seedance ile kullanan uçtan uca bir örnek için Seedance referansındaki
[Kayıtlı medya Asset'lerini kullanma](/api-reference/volcengine-contents-generations#use-registered-media-assets) bölümüne bakın.

## Genel bakış {#overview}

| Yöntem | Yol | Açıklama |
|--------|------|-------------|
| `POST` | `/v1/assets` | Asset kaydetme |
| `GET` | `/v1/assets/{id}` | Asset meta verilerini ve güncel bir indirme URL'sini alma |

## POST /v1/assets {#post-v1-assets}

Herkese açık erişilebilen bir dosya URL'sini varlık kitaplığına kaydeder ve video üretim isteklerinde referans verilebilecek bir `asset_url` döndürür.

### İstek {#request}

```http
POST /v1/assets
Authorization: Bearer $SANDBASE_API_KEY
Content-Type: application/json
```

```json
{
  "url": "https://example.com/tea-ad.mp4",
  "asset_type": "Video",
  "name": "Tea ad reference video"
}
```

| Alan | Tür | Zorunlu | Açıklama |
|-------|------|----------|--------------|
| `url` | string | Evet | Herkese açık erişilebilen dosya URL'si |
| `asset_type` | string | Evet | Asset türü: `Image` / `Video` / `Audio` (büyük/küçük harfe duyarlı) |
| `name` | string | Hayır | İsteğe bağlı Asset adı |

### Yanıt {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Alan | Açıklama |
|-------|--------------|
| `id` | Dahili kayıt kimliği |
| `asset_url` | Video üretim isteklerinde kullanılan referans adresi |
| `asset_type` | Asset türü |
| `name` | Asset adı |
| `created_at` | Oluşturulma zaman damgası |

### asset_url kullanımı {#using-asset-url}

Kayıttan sonra `asset_url` değerini, seçilen modelin canlı şemasında Asset referansı kabul eden bir girdi alanına iletin. Alan adları modele göre değişir; örneğin:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Hatalar {#errors}

| HTTP durumu | Açıklama |
|-------------|--------------|
| 400 | Zorunlu alan eksik veya `asset_type` geçersiz |
| 502 | Üst akıştaki Asset kaydı başarısız oldu |
| 500 | Kullanılabilir kimlik bilgisi yok veya dahili hata |

---

## GET /v1/assets/{id}

Kayıtlı bir Asset için harici kimliğiyle imzalı bir indirme URL'si alır. Temel dosyayı önizlemek veya indirmek için kullanılır.

### İstek {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Parametre | Konum | Açıklama |
|-----------|----------|--------------|
| `id` | path | Harici kimlik (`asset_url` içinde `asset://` sonrasındaki kısım) |

### Yanıt {#response-1}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "download_url": "https://cdn.example.com/...?X-Tos-Expires=43200",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Alan | Açıklama |
|-------|--------------|
| `asset_url` | Video üretimi için referans adresi (kalıcı) |
| `status` | Sağlayıcının bildirdiği Asset yaşam döngüsü durumu. Bunu açık uçlu bir metin olarak ele alın. |
| `download_url` | Sağlayıcının döndürdüğü indirme URL'si; Asset hazır değilken boş olabilir |

### Hatalar {#errors-1}

| HTTP durumu | Açıklama |
|-------------|--------------|
| 404 | Asset bulunamadı veya kuruluşunuza ait değil |
| 502 | Üst akış sorgusu başarısız oldu |

---

## Notlar {#notes}

::: tip Önemli
- `asset_url`, `asset://{external_id}` biçimindedir ve desteklenen model girdilerine iletilecek yeniden kullanılabilir referanstır
- `download_url` değerini sağlayıcı tarafından yönetilen bir değer olarak ele alın. Boşsa veya artık çalışmıyorsa güncel değer için bu uç noktayı yeniden sorgulayın
- `asset_type` büyük/küçük harfe duyarlıdır: `Image` / `Video` / `Audio`
- Gönderilen URL herkese açık erişilebilir olmalıdır (platformun dosyayı getirebilmesi gerekir)
:::
