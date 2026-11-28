---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: ลงทะเบียนและจัดการ webhook ของ SandBase สำหรับอีเวนต์ของโมเดลแบบอะซิงโครนัส
---

# Webhooks {#webhooks}

SandBase รองรับการเรียกกลับขาออกสองโหมด:

- **Webhook ที่ลงทะเบียน** มีขอบเขตอยู่ในองค์กรของคุณ สมัครรับอีเวนต์ของ Model แบบอะซิงโครนัส และมี HMAC `X-Signature`
- **Callback ของโมเดลรายงาน** ใช้ `webhook_url` ในคำขอภาพ วิดีโอ หรือเสียงแบบอะซิงโครนัสหนึ่งรายการ ไม่ต้องลงทะเบียนและไม่มี `X-Signature`

ทั้งสองโหมดใช้การส่งแบบอย่างน้อยหนึ่งครั้ง (at-least-once) ให้ทำ handler ให้เป็น idempotent ด้วย event ID

## ลงทะเบียน webhook {#register-a-webhook}

Events API คือส่วนติดต่อสาธารณะที่ใช้ API key:

```text
POST https://api.sandbase.ai/events/webhooks
```

คุณยังสร้างและจัดการ webhook ได้จาก[หน้า Webhooks ใน Console](https://www.sandbase.ai/console/webhooks)

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

| ฟิลด์ | ประเภท | บังคับ | คำอธิบาย |
|---|---|---:|---|
| `name` | string | ใช่ | ชื่อที่มนุษย์อ่านเข้าใจได้ |
| `url` | string | ใช่ | เอนด์พอยต์ HTTP(S) ที่ถูกต้อง ใช้ HTTPS ในโปรดักชัน |
| `resourceType` | `model` | ใช่ | เลือกอีเวนต์ของ Model แบบอะซิงโครนัสด้านล่าง `model` เป็นค่าเดียวที่รองรับ |
| `events` | string[] | ไม่ | หากว่างหรือไม่ระบุ หมายถึงอีเวนต์ทั้งหมดในปัจจุบันและอนาคตของประเภททรัพยากรที่เลือก |
| `enabled` | boolean | ไม่ | ค่าเริ่มต้นคือ `true` |
| `signatureSecret` | string | ไม่ | ไม่ต้องระบุฟิลด์นี้เพื่อให้ SandBase สร้าง secret ที่มีเอนโทรปีสูงให้ ไคลเอนต์เดิมยังส่งค่าที่ไม่ว่างของตนเองต่อไปได้ |

ประเภททรัพยากร `session`, `sandbox` และ `template` เลิกใช้แล้ว การสร้าง webhook ด้วยประเภทใดประเภทหนึ่งเหล่านี้จะส่งคืน HTTP 400 การลงทะเบียนเดิมของประเภทเหล่านี้จะแสดงในรายการเพื่อให้ล้างออก โดย `PATCH` บนรายการเหล่านั้นจะส่งคืน HTTP 400 เว้นแต่คำขอเดียวกันจะเปลี่ยน `resourceType` เป็น `model` (และการสมัครรับที่ได้ถูกต้อง) ดังนั้นให้ลบหรือแปลงเป็น `model` การสมัครรับแบบ `model` ใช้ได้เฉพาะกับอีเวนต์สิ้นสุดของภาพ วิดีโอ และเสียงแบบอะซิงโครนัสที่แสดงด้านล่าง API จะปฏิเสธอีเวนต์จากประเภททรัพยากรอื่นและชื่ออีเวนต์ที่ไม่รู้จัก

### การตอบกลับเมื่อสำเร็จ {#successful-response}

Events API จะส่งคืน webhook ที่ลงทะเบียนโดยตรง `signatureSecret` สุดท้ายจะรวมอยู่ในการตอบกลับของการสร้างนี้เท่านั้น ให้จัดเก็บอย่างปลอดภัยทันที เพราะการตอบกลับของการแสดงรายการและการแก้ไขจะไม่ส่งคืนค่านี้ และกู้คืนในภายหลังไม่ได้

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

[หน้า Webhooks ใน Console](https://www.sandbase.ai/console/webhooks) จะแสดง secret ที่สร้างขึ้นครั้งเดียวหลังการลงทะเบียน และกำหนดให้คุณบันทึกไว้ก่อนปิดกล่องโต้ตอบ

### แสดงรายการ แก้ไข และลบ {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

ใช้การยืนยันตัวตนด้วย API key แบบเดียวกัน `PATCH` อาจมี `name`, `url`, `resourceType`, `events` และ `enabled` อย่างน้อยหนึ่งรายการ ฟิลด์ที่ไม่ระบุจะไม่เปลี่ยนแปลง การสมัครรับ `resourceType` และ `events` ที่ได้ทั้งหมดต้องถูกต้อง อาร์เรย์ `events` ที่ว่างยังคงหมายถึงอีเวนต์ทั้งหมดในประเภททรัพยากรนั้น

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

ดูหรือเปลี่ยน `signatureSecret` ผ่าน `PATCH` ไม่ได้ คำขอที่มีฟิลด์นี้จะถูกปฏิเสธ หาก secret สูญหาย ให้ลบแล้วสร้าง webhook ใหม่ คุณยังดู แก้ไข เปิดหรือปิดใช้งาน และลบการลงทะเบียนได้จาก[หน้า Webhooks ใน Console](https://www.sandbase.ai/console/webhooks)

`GET` ส่งคืนอาร์เรย์ JSON ของ webhook (ไม่มี `signatureSecret`) `PATCH` ส่งคืน webhook ที่อัปเดตแล้ว และ `DELETE`
ส่งคืน `204 No Content`

### การยืนยันตัวตนและข้อผิดพลาด {#authentication-and-errors}

Events API รับ API key เป็น `Authorization: Bearer $SANDBASE_API_KEY` หรือ `X-API-Key: $SANDBASE_API_KEY` เมื่อ
ส่งมาทั้งสองแบบ ระบบจะใช้เฮดเดอร์ Bearer

ข้อผิดพลาดใช้เนื้อหาในรูปแบบของตนเอง โดยมีสถานะ HTTP ซ้ำอยู่ใน `code`:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

ให้แยกการทำงานตามสถานะ HTTP `401` หมายถึงไม่มีคีย์ คีย์ไม่ถูกต้อง หรือถูกเพิกถอน `400` หมายถึงเนื้อหาคำขอหรือ
การสมัครรับไม่ถูกต้อง และ `404` (`webhook not found`) หมายถึงไม่มี webhook นั้นในองค์กรของคุณ

## Callback ของโมเดลรายงาน {#per-task-model-callback}

สำหรับงานภาพ วิดีโอ หรือเสียงแบบอะซิงโครนัสหนึ่งงาน ให้เพิ่ม `webhook_url` ใน `POST /v1/run` แทนการลงทะเบียน webhook ใหม่:

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

ระบบจะแยกวิเคราะห์และตรวจสอบฟิลด์นี้เฉพาะเมื่อโมเดลที่เลือกเป็นภาพ วิดีโอ หรือเสียง และคำขอทำงานแบบอะซิงโครนัส ในกรณีนั้นค่าต้องเป็นสตริงที่ไม่ว่างซึ่งมี URL แบบ HTTPS สาธารณะที่ถูกต้องและปลอดภัย มิฉะนั้นคำขอจะส่งคืน HTTP 400 สำหรับคำขอแบบซิงโครนัส สตรีม LLM หรือคำขออื่นที่ไม่รองรับ SandBase จะละเว้น `webhook_url` ไม่ว่าค่า JSON จะเป็นอะไร โดยจะไม่ตั้งเวลา callback ไม่จัดเก็บ URL callback และไม่ส่งต่อฟิลด์นี้ไปยังผู้ให้บริการโมเดล การไม่ระบุฟิลด์นี้จะคงขั้นตอนการโพลแบบเดิมไว้

ปลายทางต้องเป็น URL แบบ HTTPS สาธารณะ SandBase จะส่ง envelope สิ้นสุดของ Model แบบเดียวกับที่อธิบายด้านล่าง พร้อม `Content-Type: application/json` และ `X-Event-ID` สำหรับ completed, failed, timeout หรือ cancelled ระบบอาจลองส่งซ้ำเมื่อการส่งล้มเหลว ดังนั้นให้กรองรายการซ้ำด้วย `id` หรือ `X-Event-ID` และส่งคืน 2xx อย่างรวดเร็ว

Callback รายงานไม่มี secret ของ SandBase ที่ใช้ร่วมกัน จึง**ไม่มี** `X-Signature` หากเอนด์พอยต์ของคุณต้องตรวจสอบ HMAC ให้ละ `webhook_url` และลงทะเบียน Model Webhook ขององค์กรแทน คุณอาจใส่โทเค็นความสามารถแบบทึบที่ระบบของคุณสร้างขึ้นไว้ในคิวรีของ URL แบบ HTTPS และตรวจสอบที่เอนด์พอยต์ของคุณ ให้ถือว่า URL นั้นเป็นข้อมูลที่ละเอียดอ่อน

สำหรับงานโมเดลแบบอะซิงโครนัสแต่ละงาน การเลือกปลายทางจะเป็นแบบเลือกอย่างใดอย่างหนึ่ง หากคำขอมี `webhook_url` ที่ถูกต้อง SandBase จะส่งอีเวนต์สิ้นสุดของ Prediction นั้นไปยัง URL รายงานเท่านั้น และข้าม Model Webhook ขององค์กรที่ลงทะเบียนไว้ทั้งหมดสำหรับอีเวนต์นั้น หากคำขอไม่มี `webhook_url` Model Webhook ขององค์กรที่ลงทะเบียนไว้จะยังได้รับอีเวนต์ที่ตรงกันตามปกติ เมื่อการส่งแบบรายงานล้มเหลว ระบบจะลองส่งซ้ำไปยัง URL ของงานเดิม และจะไม่ถอยกลับไปใช้ webhook ที่ลงทะเบียนไว้ ลำดับความสำคัญนี้ไม่ได้สร้าง แทนที่ ปิดใช้งาน หรือแก้ไขการลงทะเบียนใด ๆ และไม่ส่งผลต่ออีเวนต์อื่นของ Model

## ประเภทอีเวนต์ {#event-types}

### การสร้างด้วยโมเดล {#model-generation}

Model webhook ใช้ได้เฉพาะกับการสร้างภาพ วิดีโอ และเสียงแบบอะซิงโครนัส ระบบจะไม่ส่งอีเวนต์สำหรับคำขอภาพ/วิดีโอ/เสียงแบบซิงโครนัสหรือคำขอ LLM แบบซิงโครนัสใด ๆ เพราะผลลัพธ์เหล่านั้นจะส่งคืนในการตอบกลับ HTTP เดิม

| อีเวนต์ | คำอธิบาย |
|---|---|
| `model.generation.completed` | การสร้างภาพ วิดีโอ หรือเสียงแบบอะซิงโครนัสเสร็จสมบูรณ์ |
| `model.generation.failed` | การสร้างภาพ วิดีโอ หรือเสียงแบบอะซิงโครนัสล้มเหลว |
| `model.generation.timeout` | การสร้างภาพ วิดีโอ หรือเสียงแบบอะซิงโครนัสหมดเวลา |
| `model.generation.cancelled` | การสร้างภาพ วิดีโอ หรือเสียงแบบอะซิงโครนัสถูกยกเลิก |

## เพย์โหลดที่ส่ง {#delivery-payload}

SandBase ส่ง `Content-Type: application/json` และ envelope JSON ต่อไปนี้ `data` ขึ้นอยู่กับแต่ละอีเวนต์และอาจมีฟิลด์เพิ่มขึ้นเมื่อเวลาผ่านไป

### ตัวอย่างเมื่อ Model เสร็จสมบูรณ์ {#model-completion-example}

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

อีเวนต์ล้มเหลวและหมดเวลาจะไม่มี outputs และมีเพียงหมวดหมู่ข้อผิดพลาดที่ผ่านการกรองแล้ว

| ฟิลด์ | คำอธิบาย |
|---|---|
| `id` | event ID ที่ไม่ซ้ำกัน ใช้ค่านี้หรือ `X-Event-ID` เป็นคีย์ idempotency ของคุณ |
| `resourceType` | `model` |
| `resourceID` | ID ของ Prediction ที่ได้รับผลกระทบ |
| `type` | ประเภทอีเวนต์จากตารางด้านบน |
| `data` | ข้อมูลเฉพาะของอีเวนต์ |
| `createdAt` | เวลาที่สร้างอีเวนต์ในรูปแบบ RFC 3339 UTC |

## ตรวจสอบลายเซ็นของ webhook ที่ลงทะเบียน {#verify-a-registered-webhook-signature}

การส่ง webhook ที่ลงทะเบียนทุกครั้งจะมีเฮดเดอร์เหล่านี้:

| เฮดเดอร์ | ค่า |
|---|---|
| `X-Event-ID` | `id` ของเพย์โหลด |
| `X-Signature` | HMAC-SHA256 ของเนื้อหาคำขอดิบในรูปแบบเลขฐานสิบหกตัวพิมพ์เล็ก โดยใช้ `signatureSecret` เป็นคีย์ |

ตรวจสอบลายเซ็นกับไบต์ดิบของคำขอก่อนแยกวิเคราะห์ JSON callback `webhook_url` รายงานไม่มีเฮดเดอร์นี้และใช้ขั้นตอนการตรวจสอบนี้ไม่ได้ handler ต่อไปนี้ใช้สำหรับ webhook ที่ลงทะเบียน โดยจะตรวจสอบก่อน แยกวิเคราะห์ทีหลัง ใช้ `id` เป็นคีย์ idempotency และส่งงานต่อให้ฟังก์ชันแบบอะซิงโครนัส ให้แทนที่การเรียกคิวตัวอย่างด้วยคิวหรือ worker ที่คงทนของคุณเอง

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

อินพุตของ HMAC คือเนื้อหาดิบที่ตรงกันทุกไบต์ อย่าเรียกตัวแยกวิเคราะห์ JSON หรือแปลงเพย์โหลดกลับเป็นสตริงใหม่ก่อนคำนวณ

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## พฤติกรรมการส่ง {#delivery-behavior}

- การตอบกลับในช่วง `2xx` ภายใน 10 วินาทีถือว่าสำเร็จ
- ข้อผิดพลาดเครือข่าย การหมดเวลา และการตอบกลับที่ไม่ใช่ 2xx ถือว่าล้มเหลว ตัวกระจายอีเวนต์อาจลองส่งซ้ำเมื่อการส่งล้มเหลว ผู้รับต้องรองรับการส่งซ้ำได้
- ส่งคืนการตอบกลับ 2xx หลังจากรับงานไว้อย่างคงทนแล้ว จากนั้นจึงทำงานที่ใช้เวลานานแบบอะซิงโครนัส ตัวอย่างใช้การกรองรายการซ้ำในหน่วยความจำเพื่อให้รันได้เท่านั้น ผู้รับในโปรดักชันต้องแทนที่ด้วย unique key ในฐานข้อมูลหรือคิวที่คงทน อย่าคาดหวังว่าจะส่งเพียงครั้งเดียวหรือเรียงลำดับอีเวนต์
