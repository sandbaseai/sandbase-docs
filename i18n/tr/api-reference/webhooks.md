---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: Eşzamansız model olayları için SandBase webhook'larını kaydedin ve yönetin.
---

# Webhooks {#webhooks}

SandBase iki giden geri çağırma modunu destekler:

- **Kayıtlı webhook'lar** kuruluşunuzla sınırlıdır, eşzamansız Model olaylarına abone olur ve bir HMAC `X-Signature` içerir.
- **Görev başına model geri çağırmaları**, tek bir eşzamansız görüntü, video veya ses isteğinde `webhook_url` kullanır. Kayıt gerektirmez ve `X-Signature` içermez.

Her iki mod da en az bir kez teslimat kullanır. İşleyicilerinizi olay kimliğiyle idempotent hale getirin.

## Webhook kaydetme {#register-a-webhook}

Events API, API anahtarıyla erişilen herkese açık arayüzdür:

```text
POST https://api.sandbase.ai/events/webhooks
```

Webhook'ları [Console Webhooks sayfasından](https://www.sandbase.ai/console/webhooks) da oluşturup yönetebilirsiniz.

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Model generation monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "model",
    "events": ["model.generation.completed", "model.generation.failed"]
  }'
```

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---:|---|
| `name` | string | Evet | İnsanların okuyabileceği bir ad. |
| `url` | string | Evet | Geçerli bir HTTP(S) uç noktası. Üretimde HTTPS kullanın. |
| `resourceType` | `model` | Evet | Aşağıdaki eşzamansız Model olaylarını seçer. Desteklenen tek değer `model`'dir. |
| `events` | string[] | Hayır | Boş bırakılması veya atlanması, seçilen kaynak türündeki mevcut ve gelecekteki tüm olaylar anlamına gelir. |
| `enabled` | boolean | Hayır | Varsayılan `true`. |
| `signatureSecret` | string | Hayır | SandBase'in yüksek entropili bir gizli anahtar üretmesi için bu alanı atlayın. Mevcut istemciler boş olmayan kendi değerlerini sağlamaya devam edebilir. |

`session`, `sandbox` ve `template` kaynak türleri kullanımdan kaldırılmıştır: bunlardan herhangi biriyle webhook oluşturmak HTTP 400 döndürür. Bu türlerdeki mevcut kayıtlar temizlik için listelenir: aynı istek `resourceType` değerini `model` olarak değiştirmediği (ve sonuçtaki abonelik geçerli olmadığı) sürece bunlar üzerindeki bir `PATCH` HTTP 400 döndürür; bu nedenle bunları silin veya `model` türüne dönüştürün. `model` abonelikleri yalnızca aşağıda listelenen eşzamansız görüntü, video ve ses son durum olayları için kullanılabilir. API, diğer kaynak türlerinden gelen olayları ve bilinmeyen olay adlarını reddeder.

### Başarılı yanıt {#successful-response}

Events API kayıtlı webhook'u doğrudan döndürür. Nihai `signatureSecret` yalnızca bu oluşturma yanıtına dahil edilir. Şimdi güvenli bir şekilde saklayın: listeleme ve düzenleme yanıtları bunu hiçbir zaman döndürmez ve daha sonra kurtarılamaz.

```json
{
  "id": "wh_01...",
  "name": "Model generation monitor",
  "url": "https://example.com/hooks/sandbase",
  "resourceType": "model",
  "events": ["model.generation.completed", "model.generation.failed"],
  "enabled": true,
  "createdAt": "2026-07-15T12:00:00Z",
  "signatureSecret": "whsec_<one-time-value>"
}
```

[Console Webhooks sayfası](https://www.sandbase.ai/console/webhooks), üretilen gizli anahtarı kayıttan sonra bir kez gösterir ve iletişim kutusunu kapatmadan önce kaydetmenizi gerektirir.

### Listeleme, düzenleme ve silme {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Aynı API anahtarı kimlik doğrulamasını kullanın. Bir `PATCH`, `name`, `url`, `resourceType`, `events` ve `enabled` alanlarından bir veya daha fazlasını içerebilir; atlanan alanlar değişmeden kalır. Sonuçta ortaya çıkan `resourceType` ve `events` aboneliğinin tamamı geçerli olmalıdır. Boş bir `events` dizisi yine o kaynak türündeki tüm olaylar anlamına gelir.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret`, `PATCH` ile görüntülenemez veya değiştirilemez; bunu içeren bir istek reddedilir. Gizli anahtar kaybolursa webhook'u silip yeniden oluşturun. Kayıtları [Console Webhooks sayfasından](https://www.sandbase.ai/console/webhooks) da görüntüleyebilir, düzenleyebilir, etkinleştirip devre dışı bırakabilir ve silebilirsiniz.

`GET` bir JSON webhook dizisi döndürür (`signatureSecret` olmadan), `PATCH` güncellenmiş webhook'u döndürür ve `DELETE`
`204 No Content` döndürür.

### Kimlik doğrulama ve hatalar {#authentication-and-errors}

Events API, API anahtarını `Authorization: Bearer $SANDBASE_API_KEY` veya `X-API-Key: $SANDBASE_API_KEY` olarak kabul eder. İkisi
birlikte gönderildiğinde Bearer başlığı kullanılır.

Hatalar kendi gövdelerini kullanır ve HTTP durumu `code` içinde tekrarlanır:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

HTTP durumuna göre dallanın. `401`, anahtarın eksik, geçersiz veya iptal edilmiş olduğu anlamına gelir; `400`, istek gövdesinin veya
aboneliğin geçersiz olduğu anlamına gelir; `404` (`webhook not found`), webhook'un kuruluşunuzda bulunmadığı anlamına gelir.

## Görev başına model geri çağırması {#per-task-model-callback}

Tek bir eşzamansız görüntü, video veya ses görevi için yeni bir webhook kaydetmek yerine `POST /v1/run` isteğine `webhook_url` ekleyin:

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example/async-image-model",
    "mode": "async",
    "prompt": "A lighthouse at night",
    "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
  }'
```

Alan yalnızca seçilen model görüntü, video veya ses modeli olduğunda ve istek eşzamansız yürütmeye çözümlendiğinde ayrıştırılır ve doğrulanır. Bu durumda geçerli ve güvenli bir herkese açık HTTPS URL'si içeren boş olmayan bir metin olmalıdır; aksi halde istek HTTP 400 döndürür. Eşzamanlı, akışlı, LLM veya desteklenmeyen diğer isteklerde SandBase, JSON değeri ne olursa olsun `webhook_url` alanını yok sayar: hiçbir geri çağırma planlamaz, geri çağırma URL'si saklamaz ve alanı model sağlayıcısına iletmez. Alanı atlamak mevcut yoklama akışını korur.

Hedef, herkese açık bir HTTPS URL'si olmalıdır. SandBase; completed, failed, timeout veya cancelled durumları için aşağıda belgelenen Model son durum zarfının aynısını `Content-Type: application/json` ve `X-Event-ID` ile gönderir. Başarısız bir teslimatı yeniden deneyebilir; bu nedenle `id` veya `X-Event-ID` ile yinelenenleri ayıklayın ve hızlıca 2xx döndürün.

Görev başına bir geri çağırmanın paylaşılan bir SandBase gizli anahtarı yoktur; bu nedenle `X-Signature` **içermez**. Uç noktanız HMAC doğrulaması gerektiriyorsa `webhook_url` alanını atlayın ve bunun yerine bir kuruluş Model Webhook'u kaydedin. HTTPS URL sorgusuna kendi sisteminizin ürettiği opak bir yetki token'ı ekleyebilir ve bunu uç noktanızda doğrulayabilirsiniz. Bu URL'yi hassas veri olarak ele alın.

Her eşzamansız model görevi için hedef seçimi birbirini dışlar. İstek geçerli bir `webhook_url` içeriyorsa SandBase, o Prediction'ın son durum olayını yalnızca görev başına URL'ye gönderir ve o olay için kayıtlı tüm kuruluş Model Webhook'larını atlar. İstek `webhook_url` içermiyorsa kayıtlı kuruluş Model Webhook'ları eşleşen olayları normal şekilde almaya devam eder. Görev başına teslimat hatası aynı görev URL'sini yeniden dener ve hiçbir zaman kayıtlı bir webhook'a geri dönmez. Bu öncelik hiçbir kaydı oluşturmaz, değiştirmez, devre dışı bırakmaz veya düzenlemez ve diğer Model olaylarını etkilemez.

## Olay türleri {#event-types}

### Model üretimi {#model-generation}

Model webhook'ları yalnızca eşzamansız görüntü, video ve ses üretimi için kullanılabilir. Eşzamanlı görüntü/video/ses istekleri veya herhangi bir eşzamanlı LLM isteği için yayımlanmazlar: bu sonuçlar özgün HTTP yanıtıyla döndürülür.

| Olay | Açıklama |
|---|---|
| `model.generation.completed` | Eşzamansız bir görüntü, video veya ses üretimi tamamlandı. |
| `model.generation.failed` | Eşzamansız bir görüntü, video veya ses üretimi başarısız oldu. |
| `model.generation.timeout` | Eşzamansız bir görüntü, video veya ses üretimi zaman aşımına uğradı. |
| `model.generation.cancelled` | Eşzamansız bir görüntü, video veya ses üretimi iptal edildi. |

## Teslimat yükü {#delivery-payload}

SandBase, `Content-Type: application/json` ve aşağıdaki JSON zarfını gönderir. `data` olaya özgüdür ve zamanla yeni alanlar kazanabilir.

### Model tamamlanma örneği {#model-completion-example}

```json
{
  "id": "model_pred_01_completed",
  "resourceType": "model",
  "resourceID": "pred_01...",
  "type": "model.generation.completed",
  "data": {
    "predictionID": "pred_01...",
    "model": "example-image-model",
    "generationType": "image",
    "status": "completed",
    "completedAt": "2026-07-14T09:30:38Z",
    "outputs": ["https://.../generated-image.png"]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

Hata ve zaman aşımı olayları çıktıları içermez ve yalnızca temizlenmiş hata kategorisini barındırır.

| Alan | Açıklama |
|---|---|
| `id` | Benzersiz olay kimliği. Bunu veya `X-Event-ID` değerini idempotency anahtarınız olarak kullanın. |
| `resourceType` | `model`. |
| `resourceID` | Etkilenen Prediction kimliği. |
| `type` | Yukarıdaki tablodaki olay türü. |
| `data` | Olaya özgü veriler. |
| `createdAt` | RFC 3339 UTC biçiminde olay oluşturulma zamanı. |

## Kayıtlı webhook imzasını doğrulama {#verify-a-registered-webhook-signature}

Her kayıtlı webhook teslimatı şu başlıkları içerir:

| Başlık | Değer |
|---|---|
| `X-Event-ID` | Yükteki `id`. |
| `X-Signature` | Ham istek gövdesinin `signatureSecret` anahtarıyla hesaplanmış, küçük harfli onaltılık HMAC-SHA256 değeri. |

JSON'u ayrıştırmadan önce imzayı ham istek baytlarına göre doğrulayın. Görev başına `webhook_url` geri çağırmaları bu başlığı içermez ve bu doğrulama akışını kullanamaz. Aşağıdaki işleyiciler kayıtlı webhook'lar içindir: önce doğrular, sonra ayrıştırır, idempotency anahtarı olarak `id` kullanır ve işi eşzamansız bir fonksiyona devreder. Yer tutucu kuyruk çağrısını kendi kalıcı kuyruğunuz veya worker'ınızla değiştirin.

::: code-group

```javascript [Node.js + Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()
const webhookSecret = process.env.SANDBASE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error('SANDBASE_WEBHOOK_SECRET is required')
const acceptedEventIDs = new Set() // Use a DB unique key in production.

function enqueueSandBaseEvent(event) {
  setImmediate(() => {
    console.log(`processing ${event.type} (${event.id})`)
    // Perform slow business work here or publish to your durable queue.
  })
}

// This route must be registered before express.json() for the webhook path.
app.post('/hooks/sandbase', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body
  const signature = req.get('X-Signature') || ''

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const received = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (received.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, received)) {
    return res.status(401).json({ error: 'invalid signature' })
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  if (acceptedEventIDs.has(event.id)) return res.sendStatus(204)
  acceptedEventIDs.add(event.id)
  enqueueSandBaseEvent(event)
  return res.sendStatus(204)
})

app.listen(3000)
```

```python [Python + Flask]
import hashlib
import hmac
import json
import os
import threading

from flask import Flask, abort, request

app = Flask(__name__)
webhook_secret = os.environ["SANDBASE_WEBHOOK_SECRET"].encode()
accepted_event_ids = set()  # Use a DB unique key in production.
accepted_event_ids_lock = threading.Lock()

def process_sandbase_event(event):
    print(f"processing {event['type']} ({event['id']})")
    # Perform slow business work here or publish to your durable queue.

@app.post("/hooks/sandbase")
def sandbase_webhook():
    raw_body = request.get_data(cache=True)
    received = request.headers.get("X-Signature", "")
    expected = hmac.new(webhook_secret, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received):
        abort(401, "invalid signature")

    event = json.loads(raw_body)
    with accepted_event_ids_lock:
        if event["id"] in accepted_event_ids:
            return "", 204
        accepted_event_ids.add(event["id"])
    threading.Thread(target=process_sandbase_event, args=(event,), daemon=True).start()
    return "", 204
```

:::

HMAC girdisi ham gövdenin kendisidir. Hesaplamadan önce JSON ayrıştırıcı çağırmayın veya yükü yeniden serileştirmeyin.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Teslimat davranışı {#delivery-behavior}

- 10 saniye içinde `2xx` aralığında bir yanıt başarılı sayılır.
- Ağ hataları, zaman aşımları ve 2xx dışı yanıtlar başarısız sayılır. Mevcut olay dağıtıcısı başarısız teslimatı yeniden deneyebilir; alıcılar yinelenen teslimatı tolere etmelidir.
- Kalıcı kabulden sonra 2xx yanıtı döndürün, ardından yavaş işleri eşzamansız olarak yapın. Örnekler yalnızca çalıştırılabilir kalmak için bellek içi yineleme ayıklama kullanır; üretim alıcıları bunu bir veritabanı benzersiz anahtarı veya kalıcı bir kuyrukla değiştirmelidir. Tam olarak bir kez teslimat veya olay sıralaması varsaymayın.
