---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: ใช้ chat completions ที่เข้ากันได้กับ OpenAI การสตรีม เครื่องมือ อินพุตหลายรูปแบบ และเอาต์พุตแบบมีโครงสร้างกับ SandBase
---

# Chat Completions {#chat-completions}

SandBase มี endpoint Chat Completions ที่เข้ากันได้กับ OpenAI ที่ `POST /v1/chat/completions` แอปพลิเคชันที่ใช้ OpenAI SDK อยู่แล้วสามารถใช้ SandBase ได้โดยเปลี่ยน API key และ base URL

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## ข้อความและเนื้อหาหลายรูปแบบ {#messages-and-multimodal-content}

ส่งข้อความตามลำดับของบทสนทนาโดยใช้บทบาทที่ผู้ให้บริการที่เลือกรองรับ ซึ่งโดยทั่วไปได้แก่ `system`, `developer`, `user`, `assistant` และ `tool` ข้อความอาจเป็นสตริง โมเดลที่รองรับ vision ยังรับ content part เช่น `text` และ `image_url` ได้ด้วย

## การสตรีม {#streaming}

ตั้งค่า `stream: true` เพื่อรับ Server-Sent Events อ่านอีเวนต์ `data:` แต่ละรายการตามลำดับแล้วต่อ `choices[0].delta.content` เข้าด้วยกัน สตรีมจะจบด้วย `data: [DONE]` เพิ่ม `stream_options: {"include_usage": true}` เมื่อผู้ให้บริการที่เลือกส่งข้อมูลการใช้งานระหว่างสตรีม มิฉะนั้นอาจไม่มีข้อมูลการใช้งาน

## เครื่องมือ {#tools}

กำหนดฟังก์ชันที่เรียกได้ใน `tools` เมื่อผู้ช่วยส่งคืน `tool_calls` ให้เรียกใช้แต่ละฟังก์ชันในแอปพลิเคชันของคุณ แล้วเพิ่มข้อความ `tool` ที่มี `tool_call_id` ที่ตรงกันก่อนดำเนินการต่อ

## เอาต์พุตแบบมีโครงสร้าง {#structured-output}

ใช้ `response_format` เพื่อขอการตอบกลับเป็นออบเจ็กต์ JSON หรือตาม JSON Schema การรองรับต่างกันไปตามโมเดล จึงควรตรวจสอบความสามารถของโมเดลที่เลือกก่อนพึ่งพาการบังคับ schema แบบเข้มงวด

## พารามิเตอร์เฉพาะของผู้ให้บริการ {#provider-specific-parameters}

SandBase ใช้ `model` และ `stream` ในการกำหนดเส้นทาง ฟิลด์คำขอเพิ่มเติมที่เข้ากันได้กับ OpenAI จะถูกคงไว้เมื่อผู้ให้บริการที่เลือกใช้โปรโตคอลเดียวกัน เมื่อ SandBase แปลงระหว่างโปรโตคอล ให้ใช้ฟิลด์ที่มีเอกสารหรือ `extra_body` ซึ่งการรองรับต่างกันไปตามผู้ให้บริการ

## ข้อผิดพลาดและการลองใหม่ {#errors-and-retries}

ใช้ backoff ที่มีขอบเขตสำหรับ `429` ที่ลองใหม่ได้และการตอบกลับชั่วคราวจากเซิร์ฟเวอร์ เฉพาะเมื่อการสร้างใหม่ปลอดภัยเท่านั้น อย่าลองใหม่โดยอัตโนมัติสำหรับคำขอที่ผิดรูปแบบ การยืนยันตัวตนที่ล้มเหลว หรือคำขอที่ผลข้างเคียงจากเครื่องมืออาจเกิดขึ้นไปแล้ว ดู [ข้อผิดพลาดและการลองใหม่](/guides/error-handling) สำหรับ schema ฉบับสมบูรณ์ของฟิลด์และการตอบกลับ ดู [Chat Completions API](/api-reference/llm-gateway)
