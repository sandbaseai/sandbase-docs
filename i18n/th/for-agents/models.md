---
i18nSource: b95a8cd6f82c3a9a
title: Models และราคาสำหรับ AI
description: ค้นหาโมเดล ความสามารถ สคีมา และราคาปัจจุบันของ SandBase ผ่าน Models API
---

# Models และราคา {#models-pricing}

เข้าถึงทุกโมเดลได้ด้วย SandBase API key เดียว ความพร้อมใช้งาน สคีมา ความสามารถ ขีดจำกัดบริบท
และราคาของโมเดลอาจเปลี่ยนแปลงแยกจากกัน

::: info ใช้เมทาดาทาของโมเดลแบบสด
ใช้ `GET /v1/models` และ `GET /v1/models/{id_or_name}` เสมอเพื่อรับข้อมูลปัจจุบันที่เชื่อถือได้ อย่าอนุมานว่า
LLM ทุกตัวรองรับการสตรีม vision เครื่องมือ structured output หรือ caching และอย่าคัดลอกฟิลด์ input หรือ
ราคาของโมเดลหนึ่งไปใช้กับอีกโมเดลหนึ่ง
:::

## การตอบกลับของแคตตาล็อกและรายละเอียด {#catalog-and-detail-responses}

`GET /v1/models` ส่งคืนระเบียนตัวตนที่เข้ากันได้กับ OpenAI ซึ่งมี `id`, `object`, `created` และ `owned_by`
โดยจงใจไม่รวมเมทาดาทาด้านความสามารถ สคีมา และราคาของ SandBase

`GET /v1/models/{id_or_name}` เพิ่ม `unified_schema`, `supported_modes` และ `model_card` อ่านราคาโดยละเอียดได้จาก
`model_card` เพราะไม่มีออบเจ็กต์ `pricing` ระดับบนสุด ให้ถือว่า `capability_tags`, `supported_modes` และ
`unified_schema` เป็นข้อมูลเฉพาะของแต่ละโมเดล

## ค้นหาโมเดล {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

เอนด์พอยต์รายการรองรับ `q`, `vendor`, `type` และ `order` ไม่มีการแบ่งหน้าและมีค่าเริ่มต้นเป็น `type=llm`
โดยส่งคืนรายการที่เข้ากันได้กับ OpenAI ซึ่งมี `id`, `object`, `created` และ `owned_by` ใช้ `id` ที่ได้รับเป็น
ชื่อโมเดลเมื่อขอรายละเอียดหรือเรียกใช้โมเดล

สำหรับการตอบกลับ `202` แบบอะซิงโครนัสใด ๆ ให้โพล `GET /v1/run/{id}` ด้วย ID ที่ได้รับ ให้ถือว่า ID เป็นค่าทึบ อย่า
อนุมานรูปแบบของ ID หรือสร้างพาธการโพลแบบอื่นจากคำนำหน้าของ ID หรือเฮดเดอร์ความเข้ากันได้

## ตรวจสอบโมเดลหนึ่งตัว {#inspect-one-model}

ชื่อโมเดลระบุผู้ให้บริการและอาจมี `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

ก่อนเรียกใช้ ให้ตรวจสอบ:

- `enabled` และ `execution_mode`
- `capability_tags` และ `supported_modes`
- `unified_schema` สำหรับฟิลด์คำขอที่รับได้
- `model_card` สำหรับสูตรราคาปัจจุบันและตัวคูณของโทเค็นหรือ cache

## ตรวจสอบค่าใช้จ่ายจริงของงาน {#check-actual-task-cost}

สำหรับงานที่เสร็จสมบูรณ์หรือกำลังดำเนินการ ให้คิวรีค่าใช้จ่ายที่บันทึกไว้แทนการคำนวณใหม่จากตารางที่ล้าสมัย:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

ดูสัญญาการตอบกลับได้ที่[เอกสารอ้างอิง Models API](/api-reference/models/) และดู
แนวทางเกี่ยวกับรูปแบบการตอบกลับและการลองใหม่ได้ที่[คู่มือข้อผิดพลาด](/for-agents/errors)
