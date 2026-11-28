---
i18nSource: 43d08f60800d37f5
title: मीडिया एसेट API
description: दोबारा इस्तेमाल योग्य media Assets register करें और उनका वर्तमान metadata और download URLs प्राप्त करें।
---

# मीडिया एसेट API {#media-assets-api}

Media URLs register करने और native video generation requests के लिए `asset_url` पाने हेतु `/v1/assets` पर उपलब्ध official-compatible Asset protocol का उपयोग करें।

Media register करने और लौटाए गए `asset://` reference को Seedance के साथ इस्तेमाल करने के end-to-end उदाहरण के लिए, Seedance reference में [Registered media Assets का उपयोग करें](/api-reference/volcengine-contents-generations#use-registered-media-assets) देखें।

## अवलोकन {#overview}

| Method | Path | विवरण |
|--------|------|-------------|
| `POST` | `/v1/assets` | Asset register करें |
| `GET` | `/v1/assets/{id}` | Asset metadata और वर्तमान download URL प्राप्त करें |

## POST /v1/assets {#post-v1-assets}

सार्वजनिक रूप से उपलब्ध file URL को asset library में register करता है और एक `asset_url` लौटाता है, जिसे video generation requests में reference किया जा सकता है।

### अनुरोध {#request}

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

| Field | Type | आवश्यक | विवरण |
|-------|------|----------|--------------|
| `url` | string | हाँ | सार्वजनिक रूप से उपलब्ध file URL |
| `asset_type` | string | हाँ | Asset type: `Image` / `Video` / `Audio` (case-sensitive) |
| `name` | string | नहीं | वैकल्पिक asset name |

### प्रतिक्रिया {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Field | विवरण |
|-------|--------------|
| `id` | Internal record ID |
| `asset_url` | Video generation requests में इस्तेमाल होने वाला reference address |
| `asset_type` | Asset type |
| `name` | Asset name |
| `created_at` | बनाए जाने का timestamp |

### asset_url का उपयोग {#using-asset-url}

Register होने के बाद, `asset_url` को चुने गए model के live schema में उस input field में भेजें जो Asset reference स्वीकार करता है। Field names हर model में अलग होते हैं; उदाहरण के लिए:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### त्रुटियाँ {#errors}

| HTTP Status | विवरण |
|-------------|--------------|
| 400 | आवश्यक field मौजूद नहीं है या `asset_type` अमान्य है |
| 502 | Upstream asset registration विफल रहा |
| 500 | कोई credential उपलब्ध नहीं है या internal error |

---

## GET /v1/assets/{id}

किसी registered asset का signed download URL उसके external ID से प्राप्त करता है। इसका उपयोग मूल file का preview या download करने के लिए होता है।

### अनुरोध {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Parameter | Location | विवरण |
|-----------|----------|--------------|
| `id` | path | External ID (`asset_url` में `asset://` के बाद वाला हिस्सा) |

### प्रतिक्रिया {#response-1}

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

| Field | विवरण |
|-------|--------------|
| `asset_url` | Video generation के लिए reference address (स्थायी) |
| `status` | Provider द्वारा रिपोर्ट किया गया Asset lifecycle status। इसे open string मानें। |
| `download_url` | Provider द्वारा लौटाया गया download URL; Asset तैयार न होने तक यह खाली हो सकता है |

### त्रुटियाँ {#errors-1}

| HTTP Status | विवरण |
|-------------|--------------|
| 404 | Asset नहीं मिला या आपके organization का नहीं है |
| 502 | Upstream query विफल रही |

---

## टिप्पणियाँ {#notes}

::: tip महत्वपूर्ण
- `asset_url` का format `asset://{external_id}` है और यह समर्थित model inputs में भेजा जाने वाला दोबारा इस्तेमाल योग्य reference है
- `download_url` को provider-managed मानें। अगर यह खाली है या अब काम नहीं करता, तो वर्तमान मान के लिए इस endpoint को फिर से query करें
- `asset_type` case-sensitive है: `Image` / `Video` / `Audio`
- Submit किया गया URL सार्वजनिक रूप से उपलब्ध होना चाहिए (platform को उसे fetch कर पाना चाहिए)
:::
