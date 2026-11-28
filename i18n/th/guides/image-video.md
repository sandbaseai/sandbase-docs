---
i18nSource: 8c960d117a998817
title: โมเดลภาพและวิดีโอ
description: ใช้ Run API ที่ใช้ร่วมกันของ SandBase เพื่อสร้างภาพและวิดีโอแบบอะซิงโครนัส
---

# โมเดลภาพและวิดีโอ {#image-and-video-models}

โมเดลภาพและวิดีโอใช้ Run API แบบอะซิงโครนัสที่ใช้ร่วมกันของ SandBase ส่งงาน
ด้วย `POST /v1/run` แล้วโพล `GET /v1/run/{id}` จนกว่าการรันจะถึง
สถานะสิ้นสุด

## ส่งงาน {#submit-a-task}

ใช้ ID ของโมเดลแบบตรงตัวจาก[โมเดลภาพและวิดีโอ](https://www.sandbase.ai/models/image-video) ฟิลด์คำขอ
ที่เหลือขึ้นอยู่กับแต่ละโมเดล ให้เปิดเอกสารอ้างอิง API ของโมเดลเพื่อดู
input ที่จำเป็นและขีดจำกัด

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

การตอบกลับจะมี `id` แบบทึบ และ `status` เช่น `pending` หรือ
`running`

## โพลเพื่อรับผลลัพธ์ {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

โพลต่อไปจนกว่า `status` จะเป็น `completed`, `failed` หรือ `timeout` การรันที่เสร็จสมบูรณ์
จะมีเอาต์พุตเฉพาะของความสามารถ เช่น URL ของภาพหรือวิดีโอ เก็บ
run ID ไว้และถือว่าการตอบกลับของการรันเป็นสถานะที่เชื่อถือได้

## Webhook callback {#webhook-callbacks}

งานแบบอะซิงโครนัสที่รองรับอาจตั้งค่า `webhook_url` ในคำขอที่ส่งได้ด้วย
callback เป็นเพียงสัญญาณแจ้งการส่ง ไม่ได้ใช้แทนการโพล ให้ใช้
`GET /v1/run/{id}` ต่อไปและจัดการ callback ที่ซ้ำหรือล่าช้าอย่างปลอดภัย ดู
[รันความสามารถ](/api-reference/models/run#webhook-callbacks) สำหรับ
สัญญา callback ทั่วไป

## ความสามารถของ API ใช้พาธที่ได้มาจาก URL {#api-capabilities-use-a-url-derived-path}

Run API ที่ใช้ร่วมกันมีไว้สำหรับการสร้างด้วยโมเดล ความสามารถของ API จาก
[แคตตาล็อก APIs](https://www.sandbase.ai/apis) ใช้
เส้นทางอื่นที่ได้มาจาก URL: `GET` หรือ `POST /v1/api/{vendor}/{upstream_path}`
ชื่อความสามารถที่ระบุผู้ให้บริการมาจาก Models API หรือแคตตาล็อก APIs จึง
ละฟิลด์ `model` ในเนื้อหา POST ได้:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

เส้นทางนี้ใช้สำหรับความสามารถของ API ไม่ได้ใช้แทน `/v1/run` เมื่อ
เรียกโมเดลภาพหรือวิดีโอ หากความสามารถของ API ที่เลือกทำงานแบบอะซิงโครนัส
ให้โพล run ID ที่ได้รับด้วย `GET /v1/run/{id}`

## ขั้นตอนถัดไป {#next-steps}

- [โมเดลภาพและวิดีโอ](https://www.sandbase.ai/models/image-video)
- [รันความสามารถ](/api-reference/models/run)
- [ดึงผลลัพธ์ของการรัน](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)
