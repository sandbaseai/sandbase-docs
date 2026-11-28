---
i18nSource: 1b5099685e9df6ce
title: แค็ตตาล็อก Agent
description: เรียกดู Agent สาธารณะและโคลนไปยังองค์กรของคุณ
---

# แค็ตตาล็อก Agent {#agent-catalog}

แค็ตตาล็อกแสดงรายการ Agent ที่ SandBase เผยแพร่ไว้ให้นำกลับมาใช้ซ้ำ รายการในแค็ตตาล็อกเป็นแบบอ่านอย่างเดียว ให้โคลนรายการที่ต้องการเพื่อรับ Agent ส่วนตัวในองค์กรของคุณที่สามารถแก้ไข รัน และ deploy ได้

| เมธอด | พาธ | วัตถุประสงค์ |
|---|---|---|
| `GET` | `/v1/agents/catalog` | แสดงรายการ Agent สาธารณะ |
| `GET` | `/v1/agents/catalog/{agent_id}` | ดู Agent สาธารณะหนึ่งรายการ โดยระบุ `?version=` ได้ |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | คัดลอกไปยังองค์กรของคุณ |

## แสดงรายการ Agent ในแค็ตตาล็อก {#list-catalog-agents}

แบ่งหน้าแบบ cursor ด้วย `limit` (1-100), `after` และ `order`

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

แต่ละรายการมี `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` และ `updated_at`

## ดู Agent ในแค็ตตาล็อก {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` ไม่บังคับ และต้องเป็นจำนวนเต็มบวก response แบบรายละเอียดจะเพิ่มออบเจ็กต์ `configuration` แบบอ่านอย่างเดียว (name, description, model, instructions, runtime profile, metadata, tools, text, reasoning และ Skills)

## โคลน Agent จากแค็ตตาล็อก {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

body รับ `version` (จำนวนเต็มบวก ค่าเริ่มต้นคือเวอร์ชันสาธารณะปัจจุบัน) และ `name` (สูงสุด 128 อักขระ) ซึ่งไม่บังคับทั้งคู่ response คือ `201 Created` พร้อม[ออบเจ็กต์ Agent](./create) แบบเต็มที่มี ID `agt_` ใหม่ในองค์กรของคุณ `Idempotency-Key` ไม่บังคับ ให้ส่งคีย์ที่คงที่เพื่อไม่ให้การลองใหม่สร้างสำเนาที่สอง

หลังจากโคลนแล้ว ให้[สร้าง Session](/api-reference/sessions/create) เพื่อทดสอบ
