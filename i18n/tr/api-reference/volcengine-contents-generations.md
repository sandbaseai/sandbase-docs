---
i18nSource: 4bd032d88bac0470
title: Seedance Video (Volcengine Ark Protokolü)
description: Volcengine Ark Contents Generations görev protokolü üzerinden Seedance 2.0 ve 2.5 videoları oluşturun; girdiler, sorgulama, faturalandırma ve medya Asset'leri dahil.
aside: false
outline: false
apiReference:
  title: Seedance Video
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Bir Seedance video görevi gönderin. Başarılı bir gönderim HTTP 200 ve bir SandBase görev kimliği döndürür.
  groups:
    - title: İstek gövdesi
      fields:
        - name: model
          type: string
          required: true
          description: "Desteklenen model tanımlayıcısı: bytedance/seedance/2.0-official veya bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: Türü belirtilmiş metin ve isteğe bağlı medya girdileri. Öğe yapıları model tarafından doğrulanır.
        - name: duration
          type: integer
          required: false
          description: Modele değiştirilmeden iletilir. Model doğrulaması uygulanır.
        - name: resolution
          type: string
          required: false
          description: Modele değiştirilmeden iletilir. Model doğrulaması uygulanır.
        - name: ratio
          type: string
          required: false
          description: Modele değiştirilmeden iletilir. Model doğrulaması uygulanır.
        - name: generate_audio
          type: boolean
          required: false
          description: Modele değiştirilmeden iletilir. Destekleniyorsa oluşturulan ses ister.
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Seedance kılavuzu {#seedance-guide}

Seedance; metinden, açılış ve kapanış karelerinden ve görüntü, video ve ses gibi çok modlu referanslardan video üretir.
Basit bir metinden videoya klipten, görsel bir özneyi, kamera hareketini ve film müziğini izleyen yönetilmiş bir çekime
kadar her şey için kullanabilirsiniz.

Üretim asenkrondur. Bir görev gönderin, ardından terminal bir duruma ulaşana kadar sorgulayın.

## Model seçimi {#choosing-a-model}

| `model` | En uygun kullanım | Çıktı çözünürlükleri |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | 1080p teslimat ve mevcut en yüksek çıktı çözünürlüğü | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | 480p veya 720p yeterli olduğunda daha düşük maliyetli üretim | 480p, 720p |

Her iki model de aynı çok modlu girdiyi kabul eder ve metinden videoya, görüntüden videoya ve çok modlu referans
iş akışlarını tek bir istek yapısıyla destekler. 480p veya 720p ihtiyacınızı karşılıyorsa ve daha düşük fiyatlı seçeneği
istiyorsanız `2.0-official` modelini seçin. 1080p gerekiyorsa `2.5-official` modelini seçin.

## API referansı {#api-reference}

| Metot | Yol |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Görevleri listeleme ve bir görevi iptal etme veya silme desteklenmez. Sonucu almak için dönen görev `id` değerini saklayın.

Her isteği, görevi oluştururken kullanılan API anahtarıyla doğrulayın:

```
Authorization: Bearer $SANDBASE_API_KEY
```

`model` değeri [Model seçimi](#choosing-a-model) bölümündeki adlardan biriyle eşleşmelidir. Sonuçları almanın desteklenen
yolu sorgulamadır; bu uç nokta için `callback_url` değerine güvenmeyin.

## Hızlı başlangıç {#quickstart}

Bir görev gönderin:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

`status` değeri `succeeded`, `failed`, `expired` veya `cancelled` olana kadar görevi bu id ile 5 ila 10 saniyede bir sorgulayın:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

Oluşturulan video `content.video_url` adresinde bulunur.

## Bir girdi iş akışı seçin {#choose-an-input-workflow}

API yedi yaygın girdi iş akışını destekler. `content` içindeki her öğenin bir `type` değeri vardır; öğe türlerinin ve
rollerin birleşimi iş akışını belirler:

| Hedef | `content` birleşimi | Ne zaman kullanılır |
| --- | --- | --- |
| Metinden videoya | Metin | Sahne tamamen prompt ile tanımlanabiliyorsa |
| Açılış karesini canlandırma | Metin (isteğe bağlı) + `first_frame` ile görüntü | İlk karenin verilen bir görüntüyle eşleşmesi gerekiyorsa |
| İki kare arasında geçiş | Metin (isteğe bağlı) + `first_frame` + `last_frame` | Çekimin denetimli bir başlangıcı ve bitişi olması gerekiyorsa |
| Görsel bir referansı izleme | Metin (isteğe bağlı) + `reference_image` ile görüntü | Bir öznenin, ürünün, kostümün veya görsel stilin tanınabilir kalması gerekiyorsa |
| Hareket veya kamera dilini izleme | Metin (isteğe bağlı) + `reference_video` ile video | Hareket, zamanlama, kurgu ritmi veya kamera hareketi bir referans klipten geliyorsa |
| Ses referansı ekleme | Metin/görüntü/video + `reference_audio` ile ses | Diyalog, müzik, ses veya ses tasarımı sonuca yön vermeliyse |
| Tam çok modlu yönetim | Metin + görüntü + video + ses referansları | Farklı varlıklar tek bir çekimde görünümü, hareketi ve sesi denetliyorsa |

Ses tek başına kullanılamaz. Ses öğesi içeren her istek en az bir metin, görüntü veya video öğesi de
içermelidir.

### İçerik öğesi yapıları {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role`, modelin varlığı nasıl kullanacağını belirtir:

| Varlık | `role` | Etkisi |
| --- | --- | --- |
| Görüntü | `first_frame` | Görüntüyü açılış karesi olarak kullanır |
| Görüntü | `last_frame` | Görüntüyü kapanış karesi olarak kullanır; aynı isteğe bir `first_frame` ekleyin |
| Görüntü | `reference_image` | Özneyi, kompozisyonu, ürünü, kostümü veya görsel stili referans alır |
| Video | `reference_video` | Hareketi, kamera çalışmasını, zamanlamayı veya kurgu ritmini referans alır |
| Ses | `reference_audio` | Sesi, diyaloğu, müziği veya ses tasarımını referans alır |

Görüntü öğeleri herkese açık bir URL veya satır içi bir `data:image/...;base64,...` değeri kabul eder. Video ve ses
referansları, modelin indirebileceği herkese açık URL'ler kullanmalıdır.

Herhangi bir `video_url` öğesi eklemek isteği videodan videoya moduna geçirir ve bu token ücretini değiştirir.
[Faturalandırma](#billing) bölümüne bakın.

## Yaygın tarifler {#common-recipes}

Aşağıdaki örnekler istek gövdelerini gösterir. Bunlardan herhangi birini [Hızlı başlangıç](#quickstart) bölümünde gösterilen görev oluşturma uç noktasına gönderin.

### İlk kareyi canlandırma {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### İlk kareden son kareye geçiş oluşturma {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### Görüntü, video ve ses referanslarıyla bir çekimi yönetme {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

Prompt ile her referansa net bir görev verin: örneğin, “ürün görünümünü görüntüden koru, kamera hareketini videodan
al ve sesin temposunu izle.” Bu, her varlıktan sonucun tamamını denetlemesini istemekten daha güvenilirdir.

## Etkili bir prompt yazma {#writing-an-effective-prompt}

Pratik bir prompt genellikle şu sırayı izler:

1. **Özne** — çekimde kim veya ne görünüyor.
2. **Eylem** — ne değişiyor veya hareket ediyor.
3. **Sahne** — konum, günün saati, hava durumu ve çevredeki ayrıntılar.
4. **Görsel stil** — sinematik, belgesel, ürün reklamı, animasyon vb.
5. **Kamera** — kadraj, lens hissi, kamera hareketi ve kesmeler.
6. **Ses** — `generate_audio` etkin olduğunda diyalog, ortam sesi, müzik veya efektler.

Neyin sabit kalması gerektiğini açıkça belirtin. Örneğin: “Ürün etiketi okunabilir kalır, kamera tek bir yavaş
yaklaşma yapar, sahne kesmesi yok, doğal oda tonu.” Birden fazla referans olduğunda her birinden hangi görsel veya
hareket niteliğinin alınacağını açıklayın.

## Çıktı seçenekleri {#output-options}

| Parametre | Tür | Varsayılan | Değerler |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` `1080p` desteklemez |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive`, girdiye ve prompt'a göre bir oran seçer |
| `duration` | integer | `5` | 4 ila 15 saniye veya modelin desteklenen aralıkta seçmesi için `-1` |
| `generate_audio` | boolean | `true` | Senkronize ses, ses efektleri ve arka plan müziği üretir |
| `seed` | integer | `-1` | `-1` ile `2^32-1` arası. Aynı prompt ve seed benzer, ancak aynı olmayan çıktı üretir |
| `watermark` | boolean | `false` | Sağ alt köşeye yapay zekâ tarafından üretildiğini belirten bir filigran ekler |
| `tools` | array | `[]` | `[{"type": "web_search"}]`, çekim planlanırken web aramasını etkinleştirir |

### Görev denetimi {#task-control}

| Parametre | Tür | Varsayılan | Notlar |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Saniye cinsinden görev zaman aşımı, 3600 ile 259200 arası. Bu süreyi aşan bir görev `expired` olur |
| `service_tier` | string | `default` | Bu modeller `flex` desteklemez |
| `safety_identifier` | string | — | Opak son kullanıcı tanımlayıcısı, en fazla 64 karakter. Ham kişisel veri yerine bir hash gönderin |

### Kare boyutu {#frame-size}

`resolution` ve `ratio` birlikte piksel boyutlarını belirler:

| Çözünürlük | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Görev durumu {#task-status}

| `status` | Anlamı | Ne yapılmalı |
| --- | --- | --- |
| `queued` | Kabul edildi, başlamayı bekliyor | 5 ila 10 saniyede bir sorgulamaya devam edin |
| `running` | Üretiliyor | Sorgulamaya devam edin |
| `succeeded` | Tamamlandı | `content.video_url` adresinden indirin |
| `failed` | İçerik incelemesi tarafından reddedildi veya modelde hata oluştu | `error.message` değerini okuyun. Yeniden denemeden önce prompt'u düzenleyin |
| `expired` | `execution_expires_after` süresini aştı | Yeniden gönderin |
| `cancelled` | Üretim başlamadan sona erdi | Yeniden gönderin |

### Görev alanları {#task-fields}

| Alan | Tür | Notlar |
| --- | --- | --- |
| `id` | string | Gönderimde dönen görev id'si |
| `model` | string | Gönderdiğiniz `model` değeri |
| `status` | string | Yukarıya bakın |
| `created_at` | integer | Unix saniyesi |
| `updated_at` | integer | Unix saniyesi. Görev bitene kadar `created_at` değerine eşittir |
| `content` | object | Görev başarılı olana kadar boştur. Oluşturulan `video_url` değerini taşır |
| `usage` | object | Token sayıları. [Faturalandırma](#billing) bölümüne bakın |
| `error` | object | `failed` ve `expired` için bulunur. `code` ve `message` içerir |

### Eksiksiz Python akışı {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## Faturalandırma {#billing}

Bu modeller, görev bittiğinde bildirilen `usage.completion_tokens` üzerinden ücretlendirilir. Token ücreti iki
boyuta bağlıdır:

- **Girdinin video içerip içermediği.** Videodan videoya istekler, yani `video_url` türünde herhangi bir `content` öğesi
  içeren istekler, metinden videoya isteklerden daha düşük bir ücretle faturalandırılır.
- **Çıktı çözünürlüğü.** `2.5-official` için 1080p, 480p ve 720p'den daha yüksek ücretlendirilir. `2.0-official` ücreti
  çözünürlüğe göre değişmez.

`usage`, şu anda birbirine eşit olan `completion_tokens` ve `total_tokens` değerlerini bildirir. Görev çalışırken boştur.
Gerçek ücretler için [hesap geçmişinize](/api-reference/account/history), güncel ücretler için
[fiyatlandırma kılavuzuna](/guides/billing) bakın.

## Hatalar {#errors}

Geçersiz bir istek hemen bir hata döndürür. Üretim sırasında oluşan bir hata, sorgulamadan sonra görevde görünür. Her ikisi de
makine tarafından okunabilir bir `code` ve insan tarafından okunabilir bir `message` içeren bir `error` nesnesi kullanır:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

Yaygın kurtarma adımları:

| Sonuç | Ne denenmeli |
| --- | --- |
| `400 InvalidParameter` | Model adını, zorunlu içeriği, rolleri, çözünürlüğü, süreyi ve varlık URL'lerini kontrol edin |
| İçerik incelemesi hatasıyla `failed` görev durumu | Yeniden göndermeden önce prompt'u yeniden yazın veya işaretlenen referans varlığı değiştirin |
| `expired` görev durumu | Yeni bir görev gönderin; yüksek çözünürlüklü veya uzun klipler için daha uzun bir `execution_expires_after` düşünün |
| `429 RateLimitExceeded` | Üstel geri çekilmeyle yeniden deneyin ve eşzamanlı gönderimleri azaltın |
| `503 ServiceUnavailable` | Kısa bir beklemeden sonra aynı isteği yeniden deneyin |

## Kayıtlı medya Asset'lerini kullanma {#use-registered-media-assets}

SandBase, resmi protokolle uyumlu Asset protokolünü `/v1/assets` adresinde sunar. Asset isteği ve dönen `asset://`
referansı resmi protokolü izler ve referans, yerel ByteDance Contents Generations isteğine değiştirilmeden
aktarılır. Hem
`bytedance/seedance/2.5-official` hem de `bytedance/seedance/2.0-official`, normalde herkese açık bir HTTP(S) URL'si
kabul ettikleri yerlerde bu referansı kabul eder.

İş akışının tamamı şöyledir:

1. `POST /v1/assets` ile erişilebilir bir medya URL'si kaydedin.
2. Sağlayıcı Asset'in kullanılabilir olduğunu bildirene kadar `GET /v1/assets/{external_id}` sorgusunu yapın.
3. Dönen `asset_url` değerini bir Seedance `content` öğesine koyun ve üretim görevini gönderin.

### Resmi protokolle uyumlu Asset işlemleri {#official-compatible-asset-operations}

| Metot | Yol | Amaç |
| --- | --- | --- |
| `POST` | `/v1/assets` | Erişilebilir bir medya URL'si kaydeder ve resmi protokolle uyumlu bir `asset://` referansı alır |
| `GET` | `/v1/assets/{external_id}` | Sağlayıcı durumunu okur ve güncel önizleme/indirme URL'sini alır |

Herkese açık API şu anda kayıt ve sorgulama işlemlerini sunar. Asset grupları, listeleme, yeniden adlandırma, güncelleme ve silme
herkese açık işlemler değildir. Asset'ler, API anahtarıyla ilişkili organizasyona aittir.

### 1. adım: Asset'i kaydedin {#step-1-register-the-asset}

Erişilebilir URL'yi `POST /v1/assets` adresine gönderin. `asset_type` büyük/küçük harfe duyarlıdır ve `Image`, `Video` veya `Audio` olmalıdır:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

Yanıttaki `asset_url` değerini kaydedin:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`asset://` sonrasındaki değer, resmi protokolle uyumlu sorgulama işleminde kullanılan `external_id` değeridir.

### 2. adım: hazır olup olmadığını kontrol edin {#step-2-check-readiness}

Asset'i `asset://` öneki olmadan `external_id` ile sorgulayın:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`status` değerini kapsamlı bir enum yerine açık uçlu bir sağlayıcı değeri olarak ele alın. Üretim görevini göndermeden önce
sağlayıcının kullanılabilir bir durum bildirmesini bekleyin; yaygın bir hazır değeri `Active`'dir. `download_url` sağlayıcı
tarafından yönetilir ve işlem sürerken boş olabilir. Güncel bir önizleme URL'sine ihtiyaç duyduğunuzda Asset'i yeniden sorgulayın.
Seedance isteklerinde `download_url` değerini kopyalamak yerine kalıcı `asset_url` değerini kullanmaya devam edin.

### 3. adım: Asset ile üretim yapın {#step-3-generate-with-the-asset}

`asset_url` değerini medya türüne uyan URL alanına koyun. Bu örnek, kayıtlı görüntüyü görsel bir
referans olarak kullanır:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

Oluşturma yanıtı bir görev `id` değeri döndürür. Seçilen model sayfasında açıklandığı şekilde
`GET /api/v3/contents/generations/tasks/{task_id}` ile sorgulayın.

### İçerik öğesini ve rolü seçin {#choose-the-content-item-and-role}

| Asset türü | `content[].type` | URL alanı | Desteklenen rol | Kullanım amacı |
| --- | --- | --- | --- | --- |
| Görüntü | `image_url` | `image_url.url` | `first_frame` | Videoyu tam olarak bu kareden başlatır |
| Görüntü | `image_url` | `image_url.url` | `last_frame` | Bu karede bitirir; aynı isteğe bir `first_frame` ekleyin |
| Görüntü | `image_url` | `image_url.url` | `reference_image` | Bir özneyi, ürünü, kompozisyonu, kostümü veya görsel stili korur |
| Video | `video_url` | `video_url.url` | `reference_video` | Hareketi, zamanlamayı, kamera çalışmasını veya kurgu ritmini izler |
| Ses | `audio_url` | `audio_url.url` | `reference_audio` | Sesi, diyaloğu, müziği veya ses tasarımını izler |

Ses tek girdi olamaz. Bir `reference_audio` Asset'ini metin, görüntü veya video ile birleştirin. `video_url`
içeren her istek videodan videoya faturalandırma ücretini kullanır.

#### Video Asset örneği {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Ses Asset örneği {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### Doğrudan URL mi, `asset://` referansı mı? {#direct-url-or-asset-reference}

| Girdi | En uygun durum | Ödünleşim |
| --- | --- | --- |
| Herkese açık HTTP(S) URL'si | Medya zaten barındırılıyor ve bir kez kullanılıyor | En hızlı yol, ancak URL görev gönderimi ve sağlayıcı indirmesi boyunca erişilebilir kalmalıdır |
| `asset://` referansı | Medya resmi Asset protokolü üzerinden yeniden kullanılıyor | Bir kayıt/hazırlık adımı ekler, ardından sonraki Seedance görevleri için kalıcı bir referans sağlar |

İstek parametreleri, sorgulama, görev durumları ve faturalandırma için yukarıdaki [Seedance kılavuzuna](#seedance-guide) bakın.

## Resmi ByteDance kaynakları {#official-bytedance-resources}
- [Seedance video üretimi belgeleri](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [İçerik üretim görevi oluşturma API'si](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Seedance 2.0 prompt yazma kılavuzu](https://www.volcengine.com/docs/82379/2222480?lang=en)
