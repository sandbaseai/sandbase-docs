---
i18nSource: efd4d5f7b8980661
title: वेबहुक
description: Asynchronous model events के लिए SandBase webhooks register और manage करें।
---

# वेबहुक {#webhooks}

SandBase दो outbound callback modes समर्थित करता है:

- **Registered webhooks** आपके organization तक सीमित होते हैं, asynchronous Model events को subscribe करते हैं, और उनमें HMAC `X-Signature` होता है।
- **Per-task model callbacks** किसी एक asynchronous image, video या audio request पर `webhook_url` का उपयोग करते हैं। इनके लिए registration की ज़रूरत नहीं होती और इनमें `X-Signature` नहीं होता।

दोनों modes at-least-once delivery का उपयोग करते हैं। Event ID की मदद से handlers को idempotent बनाएँ।

## Webhook register करें {#register-a-webhook}

Events API, public API-key surface है:

```text
POST https://api.sandbase.ai/events/webhooks
```

आप [Console Webhooks page](https://www.sandbase.ai/console/webhooks) से भी webhooks बना और manage कर सकते हैं।

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

| Field | Type | आवश्यक | विवरण |
|---|---|---:|---|
| `name` | string | हाँ | पढ़ने में आसान नाम। |
| `url` | string | हाँ | एक मान्य HTTP(S) endpoint। Production में HTTPS का उपयोग करें। |
| `resourceType` | `model` | हाँ | नीचे दिए गए asynchronous Model events चुनता है। `model` ही एकमात्र समर्थित मान है। |
| `events` | string[] | नहीं | खाली या न भेजने का अर्थ है चुने गए resource type के सभी वर्तमान और भविष्य के events। |
| `enabled` | boolean | नहीं | Default `true`। |
| `signatureSecret` | string | नहीं | SandBase से high-entropy secret बनवाने के लिए यह field न भेजें। मौजूदा clients अपना non-empty मान देना जारी रख सकते हैं। |

`session`, `sandbox` और `template` resource types retire कर दिए गए हैं: इनमें से किसी के साथ webhook बनाने पर HTTP 400 लौटता है। इन types के मौजूदा registrations cleanup के लिए सूची में दिखते हैं: इन पर `PATCH` HTTP 400 लौटाता है, जब तक वही request `resourceType` को `model` में न बदले (और परिणामी subscription मान्य न हो), इसलिए इन्हें delete करें या `model` में बदलें। `model` subscriptions केवल नीचे सूचीबद्ध asynchronous image, video और audio terminal events के लिए उपलब्ध हैं। API अन्य resource types के events और अज्ञात event names अस्वीकार करता है।

### सफल response {#successful-response}

Events API registered webhook को सीधे लौटाता है। अंतिम `signatureSecret` केवल इसी create response में शामिल होता है। इसे अभी सुरक्षित रूप से store करें: list और edit responses इसे कभी नहीं लौटाते, और बाद में इसे वापस नहीं पाया जा सकता।

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

[Console Webhooks page](https://www.sandbase.ai/console/webhooks) registration के बाद generated secret एक बार दिखाता है और dialog बंद करने से पहले आपको उसे save करना होता है।

### List, edit और delete {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

वही API-key authentication इस्तेमाल करें। `PATCH` में `name`, `url`, `resourceType`, `events` और `enabled` में से एक या अधिक शामिल हो सकते हैं; छोड़े गए fields अपरिवर्तित रहते हैं। परिणामी पूरा `resourceType` और `events` subscription मान्य होना चाहिए। खाली `events` array का अर्थ अब भी उस resource type के सभी events है।

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` को `PATCH` से न देखा जा सकता है और न बदला जा सकता है; इसे शामिल करने वाला request अस्वीकार किया जाता है। अगर secret खो जाए, तो webhook delete करके दोबारा बनाएँ। आप [Console Webhooks page](https://www.sandbase.ai/console/webhooks) से भी registrations देख, edit, enable या disable और delete कर सकते हैं।

`GET` webhooks का JSON array (`signatureSecret` के बिना) लौटाता है, `PATCH` updated webhook लौटाता है, और `DELETE` `204 No Content` लौटाता है।

### Authentication और errors {#authentication-and-errors}

Events API, API key को `Authorization: Bearer $SANDBASE_API_KEY` या `X-API-Key: $SANDBASE_API_KEY` के रूप में स्वीकार करता है। दोनों भेजे जाने पर Bearer header का उपयोग होता है।

Errors की अपनी body होती है, जिसमें HTTP status `code` में दोहराया जाता है:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

HTTP status के आधार पर branch करें। `401` का अर्थ है कि key मौजूद नहीं है, अमान्य है या revoked है; `400` का अर्थ है कि request body या subscription अमान्य है; `404` (`webhook not found`) का अर्थ है कि webhook आपके organization में मौजूद नहीं है।

## प्रति-टास्क मॉडल कॉलबैक {#per-task-model-callback}

किसी एक asynchronous image, video या audio task के लिए, नया webhook register करने के बजाय `POST /v1/run` में `webhook_url` जोड़ें:

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

यह field केवल तब parse और validate किया जाता है जब चुना गया model image, video या audio हो और request asynchronous execution पर resolve हो। उस स्थिति में यह एक non-empty string होना चाहिए जिसमें मान्य और सुरक्षित public HTTPS URL हो; अन्यथा request HTTP 400 लौटाता है। Synchronous, streaming, LLM या अन्य असमर्थित requests के लिए SandBase `webhook_url` को उसके JSON मान की परवाह किए बिना अनदेखा करता है: वह कोई callback schedule नहीं करता, कोई callback URL store नहीं करता, और field को model provider तक नहीं भेजता। Field छोड़ने पर मौजूदा polling flow बना रहता है।

Target एक public HTTPS URL होना चाहिए। SandBase completed, failed, timeout या cancelled के लिए नीचे documented वही Model terminal envelope, `Content-Type: application/json` और `X-Event-ID` के साथ भेजता है। यह विफल delivery को retry कर सकता है, इसलिए `id` या `X-Event-ID` से deduplicate करें और जल्दी 2xx लौटाएँ।

Per-task callback में कोई साझा SandBase secret नहीं होता, इसलिए इसमें `X-Signature` **नहीं** होता। अगर आपके endpoint को HMAC verification चाहिए, तो `webhook_url` छोड़ दें और इसके बजाय organization Model Webhook register करें। आप अपने system से बनाया गया opaque capability token HTTPS URL query में रखकर अपने endpoint पर उसे validate कर सकते हैं। उस URL को संवेदनशील मानें।

हर asynchronous model task के लिए target selection exclusive है। अगर request में मान्य `webhook_url` है, तो SandBase उस Prediction का terminal event केवल per-task URL पर भेजता है और उस event के लिए हर registered organization Model Webhook को छोड़ देता है। अगर request में `webhook_url` नहीं है, तो registered organization Model Webhooks को मेल खाने वाले events सामान्य रूप से मिलते रहते हैं। Per-task delivery विफल होने पर उसी task URL पर retry होता है और कभी registered webhook पर fallback नहीं होता। यह प्राथमिकता किसी registration को न बनाती है, न बदलती है, न disable या modify करती है, और अन्य Model events को प्रभावित नहीं करती।

## इवेंट प्रकार {#event-types}

### मॉडल जनरेशन {#model-generation}

Model webhooks केवल asynchronous image, video और audio generation के लिए उपलब्ध हैं। ये synchronous image/video/audio requests या किसी synchronous LLM request के लिए emit नहीं होते: उनके results मूल HTTP response में लौटते हैं।

| Event | विवरण |
|---|---|
| `model.generation.completed` | कोई asynchronous image, video या audio generation पूरा हुआ। |
| `model.generation.failed` | कोई asynchronous image, video या audio generation विफल हुआ। |
| `model.generation.timeout` | कोई asynchronous image, video या audio generation time out हुआ। |
| `model.generation.cancelled` | कोई asynchronous image, video या audio generation cancel हुआ। |

## डिलीवरी पेलोड {#delivery-payload}

SandBase `Content-Type: application/json` और निम्न JSON envelope भेजता है। `data` event-specific है और समय के साथ इसमें fields जुड़ सकते हैं।

### Model completion का उदाहरण {#model-completion-example}

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

Failure और timeout events में outputs नहीं होते और केवल sanitized error category होती है।

| Field | विवरण |
|---|---|
| `id` | Unique event ID। इसे, या `X-Event-ID` को, अपनी idempotency key के रूप में इस्तेमाल करें। |
| `resourceType` | `model`। |
| `resourceID` | प्रभावित Prediction ID। |
| `type` | ऊपर की table से event type। |
| `data` | Event-specific data। |
| `createdAt` | RFC 3339 UTC में event बनने का समय। |

## Registered webhook signature verify करें {#verify-a-registered-webhook-signature}

हर registered webhook delivery में ये headers होते हैं:

| Header | मान |
|---|---|
| `X-Event-ID` | Payload का `id`। |
| `X-Signature` | `signatureSecret` को key बनाकर raw request body का lowercase hexadecimal HMAC-SHA256। |

JSON parse करने से पहले raw request bytes पर signature verify करें। Per-task `webhook_url` callbacks में यह header नहीं होता और वे इस verification flow का उपयोग नहीं कर सकते। निम्न handlers registered webhooks के लिए हैं: ये पहले verify करते हैं, फिर parse करते हैं, `id` को idempotency key के रूप में इस्तेमाल करते हैं, और काम एक asynchronous function को सौंप देते हैं। Placeholder queue call को अपनी durable queue या worker से बदलें।

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

HMAC input ठीक वही raw body है। इसकी गणना से पहले कोई JSON parser call न करें और payload को re-serialize न करें।

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Delivery व्यवहार {#delivery-behavior}

- 10 seconds के भीतर `2xx` range का response सफल माना जाता है।
- Network errors, timeouts और non-2xx responses विफलताएँ हैं। मौजूदा event dispatcher विफल delivery को retry कर सकता है; receivers को duplicate delivery सहन करनी चाहिए।
- Durable acceptance के बाद 2xx response लौटाएँ, फिर धीमा काम asynchronously करें। उदाहरण केवल runnable बने रहने के लिए in-memory deduplication का उपयोग करते हैं; production receivers को इसे database unique key या durable queue से बदलना होगा। Exactly-once delivery या event ordering की धारणा न बनाएँ।
