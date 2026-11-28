---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: ใช้ข้อความ content block เครื่องมือ thinking และการสตรีมที่เข้ากันได้กับ Anthropic กับ SandBase
---

# Anthropic Messages {#anthropic-messages}

SandBase มี endpoint ที่เข้ากันได้กับ Anthropic ที่ `POST /v1/messages` แอปพลิเคชันที่ใช้ Anthropic SDK สามารถเชื่อมต่อได้โดยเปลี่ยน API key และ base URL

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## เฮดเดอร์การยืนยันตัวตนและเวอร์ชัน {#authentication-and-version-headers}

ใช้ `x-api-key` หรือ `Authorization: Bearer …` เมื่อส่งมาทั้งสองรายการ `x-api-key` จะมีลำดับความสำคัญสูงกว่า เฮดเดอร์ `anthropic-version` (ไม่บังคับ) จะถูกส่งต่อไปยังต้นทาง และมีค่าเริ่มต้นเป็น `2023-06-01` เมื่อไม่ระบุ ค่า `anthropic-beta` (ไม่บังคับ) ก็จะถูกส่งต่อเช่นกัน ขึ้นอยู่กับความเข้ากันได้ของผู้ให้บริการ

## ข้อความและ content block {#messages-and-content-blocks}

ข้อความใช้บทบาท `user` และ `assistant` ให้ใส่คำสั่งระบบไว้ในฟิลด์ `system` ระดับบนสุด เนื้อหาเป็นข้อความธรรมดาหรืออาร์เรย์ของ block ที่มีชนิด เช่น `text`, `image`, `tool_use` และ `tool_result` ก็ได้

## เครื่องมือและ extended thinking {#tools-and-extended-thinking}

เพิ่มคำจำกัดความของเครื่องมือใน `tools` และควบคุมการเลือกผ่าน `tool_choice` เมื่อโมเดลที่เลือกรองรับ ให้กำหนดค่า extended reasoning ด้วย `thinking` และเก็บ thinking block ที่ได้รับไว้เมื่อสนทนาต่อ

## การสตรีม {#streaming}

ตั้งค่า `stream: true` เพื่อรับเหตุการณ์ SSE แบบ Anthropic ได้แก่ `message_start`, เหตุการณ์ของ content block, `message_delta` และ `message_stop` SandBase ยังส่งต่อเหตุการณ์ keepalive และเหตุการณ์ beta ที่ผู้ให้บริการกำหนดด้วย ผู้ใช้สตรีมควรละเว้นชนิดเหตุการณ์ที่ไม่รู้จักเพื่อความเข้ากันได้ในอนาคต และจัดการเหตุการณ์ `error` ระดับโปรโตคอล

## ความเข้ากันได้ {#compatibility}

SandBase จะแมปชื่อโมเดลสาธารณะไปยังผู้ให้บริการที่เลือก ฟิลด์ของคำขออื่นที่เข้ากันได้และไบต์ของ response จะคงไว้ เว้นแต่ผู้ให้บริการนั้นมีกฎความเข้ากันได้ที่ระบุชัดเจนให้ลบฟิลด์ที่ไม่รองรับหรือปฏิเสธผู้ให้บริการที่เป็นตัวเลือกนั้น ฟีเจอร์ beta เฉพาะผู้ให้บริการอาจไม่มีในทุกโมเดล สำหรับ schema ของคำขอและ response ฉบับสมบูรณ์ ดูที่ [สร้าง Anthropic Message](/api-reference/anthropic-compat)
