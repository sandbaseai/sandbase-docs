---
i18nSource: 4bd032d88bac0470
title: วิดีโอ Seedance (โปรโตคอล Volcengine Ark)
description: สร้างวิดีโอ Seedance 2.0 และ 2.5 ผ่านโปรโตคอลงาน Contents Generations ของ Volcengine Ark ครอบคลุมอินพุต การ poll การเรียกเก็บเงิน และ Asset สื่อ
aside: false
outline: false
apiReference:
  title: วิดีโอ Seedance
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: ส่งงานวิดีโอ Seedance การส่งที่สำเร็จจะส่งคืน HTTP 200 และ id ของงาน SandBase
  groups:
    - title: Request body
      fields:
        - name: model
          type: string
          required: true
          description: "ตัวระบุโมเดลที่รองรับ: bytedance/seedance/2.0-official หรือ bytedance/seedance/2.5-official"
        - name: content
          type: array
          required: true
          description: อินพุตข้อความแบบระบุชนิดและอินพุตสื่อ (ไม่บังคับ) รูปแบบของรายการจะได้รับการตรวจสอบโดยโมเดล
        - name: duration
          type: integer
          required: false
          description: ส่งต่อไปยังโมเดลโดยไม่เปลี่ยนแปลง และอยู่ภายใต้การตรวจสอบของโมเดล
        - name: resolution
          type: string
          required: false
          description: ส่งต่อไปยังโมเดลโดยไม่เปลี่ยนแปลง และอยู่ภายใต้การตรวจสอบของโมเดล
        - name: ratio
          type: string
          required: false
          description: ส่งต่อไปยังโมเดลโดยไม่เปลี่ยนแปลง และอยู่ภายใต้การตรวจสอบของโมเดล
        - name: generate_audio
          type: boolean
          required: false
          description: ส่งต่อไปยังโมเดลโดยไม่เปลี่ยนแปลง ขอเสียงที่สร้างขึ้นเมื่อรองรับ
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

## คู่มือ Seedance {#seedance-guide}

Seedance สร้างวิดีโอจากข้อความ เฟรมเปิดและเฟรมปิด รวมถึงข้อมูลอ้างอิงแบบมัลติโมดัล เช่น รูปภาพ วิดีโอ และ
เสียง ใช้ได้ตั้งแต่คลิปแบบข้อความเป็นวิดีโออย่างง่ายไปจนถึงช็อตที่กำกับให้ติดตามตัวแบบ การเคลื่อนกล้อง
และซาวด์แทร็ก

การสร้างเป็นแบบอะซิงโครนัส ให้ส่งงาน แล้ว poll งานนั้นจนกว่าจะถึงสถานะสิ้นสุด

## การเลือกโมเดล {#choosing-a-model}

| `model` | เหมาะสำหรับ | ความละเอียดเอาต์พุต |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | การส่งมอบแบบ 1080p และความละเอียดเอาต์พุตสูงสุดที่มี | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | การสร้างที่มีต้นทุนต่ำกว่าเมื่อ 480p หรือ 720p เพียงพอ | 480p, 720p |

ทั้งสองโมเดลรับอินพุตแบบมัลติโมดัลเหมือนกัน และรองรับเวิร์กโฟลว์ข้อความเป็นวิดีโอ รูปภาพเป็นวิดีโอ และข้อมูลอ้างอิงแบบมัลติโมดัล
ด้วยรูปแบบคำขอเดียวกัน เลือก `2.0-official` เมื่อ 480p หรือ 720p ตอบโจทย์และคุณต้องการตัวเลือกที่ราคาต่ำกว่า
เลือก `2.5-official` เมื่อต้องการ 1080p

## ข้อมูลอ้างอิง API {#api-reference}

| เมธอด | พาธ |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

ไม่รองรับการแสดงรายการงาน รวมถึงการยกเลิกหรือการลบงาน ให้เก็บ `id` ของงานที่ส่งคืนไว้เพื่อดึงผลลัพธ์

ยืนยันตัวตนทุกคำขอด้วย API key เดียวกับที่ใช้สร้างงาน:

```
Authorization: Bearer $SANDBASE_API_KEY
```

ค่า `model` ต้องตรงกับชื่อใดชื่อหนึ่งใน [การเลือกโมเดล](#choosing-a-model) การ poll เป็นวิธีที่รองรับในการ
รับผลลัพธ์ อย่าพึ่ง `callback_url` สำหรับ endpoint นี้

## เริ่มต้นอย่างรวดเร็ว {#quickstart}

ส่งงาน:

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

poll งานด้วย id นั้นทุก 5 ถึง 10 วินาทีจนกว่า `status` จะเป็น `succeeded`, `failed`, `expired` หรือ `cancelled`:

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

วิดีโอที่สร้างขึ้นจะอยู่ที่ `content.video_url`

## เลือกเวิร์กโฟลว์อินพุต {#choose-an-input-workflow}

API รองรับเวิร์กโฟลว์อินพุตที่ใช้บ่อยเจ็ดแบบ แต่ละรายการใน `content` มี `type` และการผสมระหว่างชนิดของรายการกับ
role จะเป็นตัวเลือกเวิร์กโฟลว์:

| เป้าหมาย | การผสม `content` | ใช้เมื่อ |
| --- | --- | --- |
| ข้อความเป็นวิดีโอ | ข้อความ | อธิบายฉากได้ทั้งหมดใน prompt |
| ทำให้เฟรมเปิดเคลื่อนไหว | ข้อความ (ไม่บังคับ) + รูปภาพที่มี `first_frame` | เฟรมแรกต้องตรงกับรูปภาพที่ให้มา |
| เปลี่ยนผ่านระหว่างสองเฟรม | ข้อความ (ไม่บังคับ) + `first_frame` + `last_frame` | ช็อตต้องควบคุมจุดเริ่มต้นและจุดจบได้ |
| ติดตามข้อมูลอ้างอิงด้านภาพ | ข้อความ (ไม่บังคับ) + รูปภาพที่มี `reference_image` | ตัวแบบ สินค้า เครื่องแต่งกาย หรือสไตล์ภาพควรจดจำได้ |
| ติดตามการเคลื่อนไหวหรือภาษากล้อง | ข้อความ (ไม่บังคับ) + วิดีโอที่มี `reference_video` | การเคลื่อนไหว จังหวะเวลา จังหวะการตัดต่อ หรือการเคลื่อนกล้องมาจากคลิปอ้างอิง |
| เพิ่มข้อมูลอ้างอิงด้านเสียง | ข้อความ/รูปภาพ/วิดีโอ + เสียงที่มี `reference_audio` | บทพูด ดนตรี เสียงพูด หรือการออกแบบเสียงควรชี้นำผลลัพธ์ |
| กำกับแบบมัลติโมดัลเต็มรูปแบบ | ข้อมูลอ้างอิงข้อความ + รูปภาพ + วิดีโอ + เสียง | ไฟล์แต่ละชนิดควบคุมรูปลักษณ์ การเคลื่อนไหว และเสียงในช็อตเดียว |

เสียงใช้เพียงอย่างเดียวไม่ได้ ทุกคำขอที่มีรายการเสียงต้องมีรายการข้อความ รูปภาพ หรือวิดีโอ
อย่างน้อยหนึ่งรายการด้วย

### รูปแบบของรายการ content {#content-item-shapes}

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

`role` ระบุว่าโมเดลควรใช้ไฟล์อย่างไร:

| ไฟล์ | `role` | ผลลัพธ์ |
| --- | --- | --- |
| รูปภาพ | `first_frame` | ใช้รูปภาพเป็นเฟรมเปิด |
| รูปภาพ | `last_frame` | ใช้รูปภาพเป็นเฟรมปิด และต้องมี `first_frame` ในคำขอเดียวกัน |
| รูปภาพ | `reference_image` | อ้างอิงตัวแบบ องค์ประกอบภาพ สินค้า เครื่องแต่งกาย หรือสไตล์ภาพ |
| วิดีโอ | `reference_video` | อ้างอิงการเคลื่อนไหว งานกล้อง จังหวะเวลา หรือจังหวะการตัดต่อ |
| เสียง | `reference_audio` | อ้างอิงเสียงพูด บทพูด ดนตรี หรือการออกแบบเสียง |

รายการรูปภาพรับได้ทั้ง URL สาธารณะหรือค่าแบบอินไลน์ `data:image/...;base64,...` ส่วนข้อมูลอ้างอิงวิดีโอและเสียงควร
ใช้ URL สาธารณะที่โมเดลดาวน์โหลดได้

การมีรายการ `video_url` ใดๆ จะทำให้คำขออยู่ในโหมดวิดีโอเป็นวิดีโอ ซึ่งจะเปลี่ยนอัตราค่าโทเค็น ดู
[การเรียกเก็บเงิน](#billing)

## สูตรที่ใช้บ่อย {#common-recipes}

ตัวอย่างด้านล่างแสดง request body คุณส่งตัวอย่างใดก็ได้ไปยัง endpoint สร้างงานที่แสดงใน [เริ่มต้นอย่างรวดเร็ว](#quickstart)

### ทำให้เฟรมแรกเคลื่อนไหว {#animate-a-first-frame}

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

### สร้างการเปลี่ยนผ่านจากเฟรมแรกไปเฟรมสุดท้าย {#create-a-first-to-last-frame-transition}

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

### กำกับช็อตด้วยข้อมูลอ้างอิงรูปภาพ วิดีโอ และเสียง {#direct-a-shot-with-image-video-and-audio-references}

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

ใช้ prompt เพื่อกำหนดหน้าที่ที่ชัดเจนให้ข้อมูลอ้างอิงแต่ละรายการ เช่น “คงรูปลักษณ์ของสินค้าจากรูปภาพ ใช้
การเคลื่อนกล้องจากวิดีโอ และทำตามจังหวะของเสียง” วิธีนี้ได้ผลแน่นอนกว่าการขอให้ไฟล์ทุกไฟล์
ควบคุมผลลัพธ์ทั้งหมด

## การเขียน prompt ที่มีประสิทธิภาพ {#writing-an-effective-prompt}

prompt ที่ใช้งานได้จริงมักเรียงตามลำดับนี้:

1. **ตัวแบบ** — ใครหรืออะไรที่ปรากฏในช็อต
2. **การกระทำ** — สิ่งที่เปลี่ยนแปลงหรือเคลื่อนไหว
3. **ฉาก** — สถานที่ ช่วงเวลาของวัน สภาพอากาศ และรายละเอียดรอบข้าง
4. **สไตล์ภาพ** — แบบภาพยนตร์ สารคดี โฆษณาสินค้า แอนิเมชัน และอื่นๆ
5. **กล้อง** — การจัดเฟรม ความรู้สึกของเลนส์ การเคลื่อนกล้อง และการตัดภาพ
6. **เสียง** — บทพูด เสียงบรรยากาศ ดนตรี หรือเอฟเฟกต์ เมื่อเปิดใช้ `generate_audio`

ระบุให้ชัดว่าสิ่งใดต้องคงที่ เช่น “ฉลากสินค้ายังอ่านออกได้ กล้องเคลื่อนเข้าช้าๆ หนึ่งครั้ง
ไม่มีการตัดฉาก มีเสียงบรรยากาศห้องตามธรรมชาติ” เมื่อมีข้อมูลอ้างอิงหลายรายการ ให้อธิบายว่าจะนำคุณสมบัติด้านภาพหรือการเคลื่อนไหวใด
มาจากแต่ละรายการ

## ตัวเลือกเอาต์พุต {#output-options}

| พารามิเตอร์ | ชนิด | ค่าเริ่มต้น | ค่า |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p` โดย `2.0-official` ไม่รองรับ `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive` โดย `adaptive` จะเลือกอัตราส่วนจากอินพุตและ prompt |
| `duration` | integer | `5` | 4 ถึง 15 วินาที หรือ `-1` เพื่อให้โมเดลเลือกภายในช่วงที่รองรับ |
| `generate_audio` | boolean | `true` | สร้างเสียงพูด เอฟเฟกต์เสียง และดนตรีประกอบที่ซิงก์กัน |
| `seed` | integer | `-1` | `-1` ถึง `2^32-1` prompt และ seed เดียวกันจะให้ผลลัพธ์ที่คล้ายกัน แต่ไม่เหมือนกันทุกประการ |
| `watermark` | boolean | `false` | เพิ่มลายน้ำว่าสร้างโดย AI ที่มุมขวาล่าง |
| `tools` | array | `[]` | `[{"type": "web_search"}]` เปิดใช้การค้นหาเว็บระหว่างวางแผนช็อต |

### การควบคุมงาน {#task-control}

| พารามิเตอร์ | ชนิด | ค่าเริ่มต้น | หมายเหตุ |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | ระยะหมดเวลาของงานเป็นวินาที ตั้งแต่ 3600 ถึง 259200 งานที่เกินเวลานี้จะเป็น `expired` |
| `service_tier` | string | `default` | โมเดลเหล่านี้ไม่รองรับ `flex` |
| `safety_identifier` | string | — | ตัวระบุผู้ใช้ปลายทางแบบทึบ ไม่เกิน 64 อักขระ ให้ส่งค่าแฮช ไม่ใช่ข้อมูลส่วนบุคคลดิบ |

### ขนาดเฟรม {#frame-size}

`resolution` และ `ratio` ร่วมกันกำหนดขนาดพิกเซล:

| ความละเอียด | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## สถานะงาน {#task-status}

| `status` | ความหมาย | สิ่งที่ควรทำ |
| --- | --- | --- |
| `queued` | ยอมรับแล้ว กำลังรอเริ่ม | poll ต่อทุก 5 ถึง 10 วินาที |
| `running` | กำลังสร้าง | poll ต่อ |
| `succeeded` | เสร็จสิ้น | ดาวน์โหลด `content.video_url` |
| `failed` | ถูกปฏิเสธจากการตรวจสอบเนื้อหา หรือโมเดลเกิดข้อผิดพลาด | อ่าน `error.message` แล้วปรับ prompt ก่อนลองใหม่ |
| `expired` | รันเกิน `execution_expires_after` | ส่งงานใหม่ |
| `cancelled` | สิ้นสุดก่อนเริ่มการสร้าง | ส่งงานใหม่ |

### ฟิลด์ของงาน {#task-fields}

| ฟิลด์ | ชนิด | หมายเหตุ |
| --- | --- | --- |
| `id` | string | id ของงานที่ส่งคืนตอนส่งงาน |
| `model` | string | ค่า `model` ที่คุณส่ง |
| `status` | string | ดูด้านบน |
| `created_at` | integer | วินาทีแบบ Unix |
| `updated_at` | integer | วินาทีแบบ Unix มีค่าเท่ากับ `created_at` จนกว่างานจะเสร็จ |
| `content` | object | ว่างจนกว่างานจะสำเร็จ มี `video_url` ที่สร้างขึ้น |
| `usage` | object | จำนวนโทเค็น ดู [การเรียกเก็บเงิน](#billing) |
| `error` | object | มีเมื่อเป็น `failed` และ `expired` ประกอบด้วย `code` และ `message` |

### ขั้นตอน Python แบบสมบูรณ์ {#complete-python-flow}

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

## การเรียกเก็บเงิน {#billing}

โมเดลเหล่านี้คิดค่าบริการตาม `usage.completion_tokens` ซึ่งงานจะรายงานเมื่อเสร็จสิ้น อัตราค่าโทเค็นขึ้นอยู่กับสอง
ปัจจัย:

- **อินพุตมีวิดีโอหรือไม่** คำขอแบบวิดีโอเป็นวิดีโอ ซึ่งหมายถึงมีรายการ `content` ชนิด `video_url` ใดๆ จะคิดค่าบริการใน
  อัตราที่ต่ำกว่าแบบข้อความเป็นวิดีโอ
- **ความละเอียดเอาต์พุต** สำหรับ `2.5-official` นั้น 1080p คิดค่าบริการสูงกว่า 480p และ 720p ส่วนอัตราของ `2.0-official` ไม่เปลี่ยน
  ตามความละเอียด

`usage` รายงาน `completion_tokens` และ `total_tokens` ซึ่งปัจจุบันมีค่าเท่ากัน และจะว่างขณะที่งานกำลังรัน
ดูค่าใช้จ่ายจริงได้ใน[ประวัติบัญชี](/api-reference/account/history) และดูอัตราปัจจุบันได้ใน
[คู่มือราคา](/guides/billing)

## ข้อผิดพลาด {#errors}

คำขอที่ไม่ถูกต้องจะส่งคืนข้อผิดพลาดทันที ข้อผิดพลาดระหว่างการสร้างจะปรากฏในงานหลังการ poll ทั้งสองแบบใช้
ออบเจ็กต์ `error` ที่มี `code` ที่เครื่องอ่านได้และ `message` ที่คนอ่านได้:

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

ขั้นตอนการแก้ไขที่พบบ่อย:

| ผลลัพธ์ | สิ่งที่ควรลอง |
| --- | --- |
| `400 InvalidParameter` | ตรวจสอบชื่อโมเดล content ที่จำเป็น role ความละเอียด ระยะเวลา และ URL ของไฟล์ |
| สถานะงาน `failed` พร้อมข้อผิดพลาดจากการตรวจสอบเนื้อหา | เขียน prompt ใหม่หรือเปลี่ยนไฟล์อ้างอิงที่ถูกตั้งค่าสถานะก่อนส่งอีกครั้ง |
| สถานะงาน `expired` | ส่งงานใหม่ และพิจารณาตั้ง `execution_expires_after` ให้นานขึ้นสำหรับคลิปความละเอียดสูงหรือคลิปยาว |
| `429 RateLimitExceeded` | ลองใหม่ด้วย exponential backoff และลดจำนวนการส่งพร้อมกัน |
| `503 ServiceUnavailable` | ลองส่งคำขอเดิมอีกครั้งหลังรอสักครู่ |

## ใช้ Asset สื่อที่ลงทะเบียนไว้ {#use-registered-media-assets}

SandBase เปิดให้ใช้โปรโตคอล Asset ที่เข้ากันได้กับฉบับทางการที่ `/v1/assets` คำขอ Asset และการอ้างอิง `asset://`
ที่ส่งคืนเป็นไปตามโปรโตคอลทางการ และการอ้างอิงนี้จะถูกส่งต่อโดยไม่เปลี่ยนแปลงในคำขอ ByteDance Contents
Generations แบบเนทีฟ ทั้ง
`bytedance/seedance/2.5-official` และ `bytedance/seedance/2.0-official` รับการอ้างอิงนี้ได้
ในตำแหน่งที่ปกติรับ URL แบบ HTTP(S) สาธารณะ

เวิร์กโฟลว์ทั้งหมดมีดังนี้:

1. ลงทะเบียน URL ของสื่อที่เข้าถึงได้ด้วย `POST /v1/assets`
2. query `GET /v1/assets/{external_id}` จนกว่าผู้ให้บริการจะรายงานว่า Asset พร้อมใช้งาน
3. ใส่ `asset_url` ที่ส่งคืนในรายการ `content` ของ Seedance แล้วส่งงานสร้าง

### การดำเนินการ Asset ที่เข้ากันได้กับฉบับทางการ {#official-compatible-asset-operations}

| เมธอด | พาธ | วัตถุประสงค์ |
| --- | --- | --- |
| `POST` | `/v1/assets` | ลงทะเบียน URL ของสื่อที่เข้าถึงได้และรับการอ้างอิง `asset://` ที่เข้ากันได้กับฉบับทางการ |
| `GET` | `/v1/assets/{external_id}` | อ่านสถานะจากผู้ให้บริการและรับ URL สำหรับดูตัวอย่าง/ดาวน์โหลดปัจจุบัน |

ปัจจุบัน API สาธารณะเปิดให้ใช้การลงทะเบียนและการค้นหา ส่วนกลุ่ม Asset การแสดงรายการ การเปลี่ยนชื่อ การอัปเดต และการลบ
ไม่ใช่การดำเนินการสาธารณะ Asset เป็นขององค์กรที่เชื่อมโยงกับ API key

### ขั้นตอนที่ 1: ลงทะเบียน Asset {#step-1-register-the-asset}

ส่ง URL ที่เข้าถึงได้ไปยัง `POST /v1/assets` โดย `asset_type` คำนึงถึงตัวพิมพ์เล็ก-ใหญ่และต้องเป็น `Image`, `Video` หรือ `Audio`:

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

บันทึก `asset_url` จากการตอบกลับ:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

ค่าหลัง `asset://` คือ `external_id` ที่ใช้ในการค้นหาที่เข้ากันได้กับฉบับทางการ

### ขั้นตอนที่ 2: ตรวจสอบความพร้อม {#step-2-check-readiness}

query Asset ด้วย `external_id` โดยไม่ต้องมีคำนำหน้า `asset://`:

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

ให้ถือว่า `status` เป็นค่าเปิดจากผู้ให้บริการ ไม่ใช่ enum ที่ครบถ้วน รอจนกว่าผู้ให้บริการจะรายงานสถานะที่ใช้งานได้
ก่อนส่งงานสร้าง ค่าที่พร้อมใช้งานที่พบบ่อยคือ `Active` ส่วน `download_url` จัดการโดยผู้ให้บริการและ
อาจว่างระหว่างการประมวลผล ให้ query Asset อีกครั้งเมื่อต้องการ URL ดูตัวอย่างปัจจุบัน และใช้
`asset_url` แบบถาวรในคำขอ Seedance ต่อไป แทนการคัดลอก `download_url`

### ขั้นตอนที่ 3: สร้างด้วย Asset {#step-3-generate-with-the-asset}

ใส่ `asset_url` ในฟิลด์ URL ที่ตรงกับชนิดสื่อ ตัวอย่างนี้ใช้รูปภาพที่ลงทะเบียนไว้เป็นข้อมูลอ้างอิง
ด้านภาพ:

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

การตอบกลับของการสร้างจะส่งคืน `id` ของงาน ให้ poll
`GET /api/v3/contents/generations/tasks/{task_id}` ตามที่อธิบายไว้ในหน้าของโมเดลที่เลือก

### เลือกรายการ content และ role {#choose-the-content-item-and-role}

| ชนิด Asset | `content[].type` | ฟิลด์ URL | role ที่รองรับ | ใช้สำหรับ |
| --- | --- | --- | --- | --- |
| รูปภาพ | `image_url` | `image_url.url` | `first_frame` | เริ่มวิดีโอจากเฟรมนี้ตรงตัว |
| รูปภาพ | `image_url` | `image_url.url` | `last_frame` | จบที่เฟรมนี้ และต้องมี `first_frame` ในคำขอเดียวกัน |
| รูปภาพ | `image_url` | `image_url.url` | `reference_image` | คงตัวแบบ สินค้า องค์ประกอบภาพ เครื่องแต่งกาย หรือสไตล์ภาพ |
| วิดีโอ | `video_url` | `video_url.url` | `reference_video` | ติดตามการเคลื่อนไหว จังหวะเวลา งานกล้อง หรือจังหวะการตัดต่อ |
| เสียง | `audio_url` | `audio_url.url` | `reference_audio` | ติดตามเสียงพูด บทพูด ดนตรี หรือการออกแบบเสียง |

เสียงเป็นอินพุตเพียงอย่างเดียวไม่ได้ ให้ใช้ Asset แบบ `reference_audio` ร่วมกับข้อความ รูปภาพ หรือวิดีโอ คำขอใดก็ตามที่
มี `video_url` จะใช้อัตราค่าบริการแบบวิดีโอเป็นวิดีโอ

#### ตัวอย่าง Asset วิดีโอ {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### ตัวอย่าง Asset เสียง {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### ใช้ URL โดยตรงหรือการอ้างอิง `asset://` {#direct-url-or-asset-reference}

| อินพุต | เหมาะเมื่อ | ข้อแลกเปลี่ยน |
| --- | --- | --- |
| URL แบบ HTTP(S) สาธารณะ | สื่อโฮสต์ไว้แล้วและใช้เพียงครั้งเดียว | เร็วที่สุด แต่ URL ต้องเข้าถึงได้ตลอดตั้งแต่การส่งงานจนถึงการดึงไฟล์ของผู้ให้บริการ |
| การอ้างอิง `asset://` | ใช้สื่อซ้ำผ่านโปรโตคอล Asset ทางการ | เพิ่มขั้นตอนลงทะเบียน/ตรวจสอบความพร้อม แต่ได้การอ้างอิงแบบถาวรสำหรับงาน Seedance ในภายหลัง |

ดูพารามิเตอร์คำขอ การ poll สถานะงาน และการเรียกเก็บเงินได้ใน [คู่มือ Seedance](#seedance-guide) ด้านบน

## แหล่งข้อมูลทางการของ ByteDance {#official-bytedance-resources}
- [เอกสารการสร้างวิดีโอด้วย Seedance](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API สร้างงาน contents generation](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [คู่มือการเขียน prompt สำหรับ Seedance 2.0](https://www.volcengine.com/docs/82379/2222480?lang=en)
