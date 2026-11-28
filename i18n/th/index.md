---
i18nSource: c063864501452a7b
title: เอกสาร SandBase
description: สร้างด้วย Models และ APIs โดยตรง หรือกำหนด Agents ที่นำกลับมาใช้ซ้ำได้ซึ่งรันบนโครงสร้างพื้นฐานที่มีการจัดการ
---

# เอกสาร SandBase {#sandbase-docs}

สร้างด้วย Models และ APIs โดยตรง หรือกำหนด Agents ที่นำกลับมาใช้ซ้ำได้ซึ่งรันบนโครงสร้างพื้นฐานที่มีการจัดการ

SandBase มีสองวิธีที่เสริมกันในการสร้างแอปพลิเคชัน AI ให้เริ่มจากส่วนที่เล็กที่สุดที่เหมาะกับงาน แล้วค่อยใช้ร่วมกันเมื่อแอปพลิเคชันเติบโตขึ้น

## เลือกวิธีสร้าง {#choose-how-to-build}

| | Models และ APIs | Agents แบบมีการจัดการ |
|---|---|---|
| **คืออะไร** | เข้าถึงโมเดลภาษา รูปภาพ วิดีโอ เสียง และ API ของบุคคลที่สามได้โดยตรง | การกำหนดค่า Agent ที่นำกลับมาใช้ซ้ำได้และมีเวอร์ชัน ซึ่ง SandBase เป็นผู้รัน |
| **เหมาะสำหรับ** | ลูปของแอปพลิเคชันที่กำหนดเองและการควบคุมคำขออย่างละเอียด | งานหลายขั้นตอน งานอะซิงโครนัส หรืองานที่ทำซ้ำได้ |
| **สิ่งที่คุณจัดการ** | prompt การประสานงาน การลองใหม่ และสถานะของแอปพลิเคชัน | นิยาม Agent ความสามารถที่เปิดใช้ อินพุต และพฤติกรรมการส่งมอบ |
| **เริ่มต้นที่นี่** | [Models และ APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip API key เดียวของ SandBase
API key เดียวกันเรียกใช้ได้ทั้ง Models, APIs และ Agents เก็บคีย์ไว้บนเซิร์ฟเวอร์และอย่าเปิดเผยในโค้ดฝั่งเบราว์เซอร์
:::

## แนวคิดหลัก {#core-concepts}

### Models และ APIs {#models-and-apis}

ใช้ Models สำหรับงานด้านภาษา รูปภาพ วิดีโอ และเสียง ใช้ APIs เมื่อแอปพลิเคชันต้องการข้อมูลหรือการดำเนินการจากภายนอก แค็ตตาล็อกบนเว็บไซต์ SandBase แสดงความสามารถที่มี ราคา schema ของอินพุต และตัวอย่างที่ใช้งานได้

- [เรียกดู Models](https://www.sandbase.ai/models)
- [เรียกดู APIs](https://www.sandbase.ai/apis)
- [เรียก API ครั้งแรก](/getting-started/first-call)
- [เปิดข้อมูลอ้างอิง API](/api-reference/)

### Agents {#agents}

Agent คือการกำหนดค่าที่นำกลับมาใช้ซ้ำได้และมีเวอร์ชัน ซึ่งประกอบด้วยโมเดล คำสั่ง Skills และการเชื่อมต่อ MCP กำหนดครั้งเดียว แล้วรันใน Session

- [ทำความเข้าใจ Agents](/agents/)
- [กำหนด Agent](/agents/agent-api)
- [เพิ่ม Skills และเครื่องมือ MCP](/agents/mcp-tools)

### Sessions {#sessions}
Session รัน Agent หนึ่งเวอร์ชัน สร้างด้วย `POST /v1/agents/sessions` ส่งอินพุต สตรีมอีเวนต์ แล้วอ่านบทสนทนาทั้งหมดภายหลัง

- [คู่มือ Sessions](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## ขั้นตอนแรก {#first-steps}

1. สร้างองค์กรและ [API key](/getting-started/api-keys)
2. เลือกโมเดล API หรือ Agent จาก[แค็ตตาล็อก](https://www.sandbase.ai/models)
3. ส่งคำขอโดยตรง หรือกำหนดและทดสอบ Agent
4. รัน Agent ที่ทดสอบแล้วใน Session จากแอปพลิเคชันของคุณ
5. ตรวจสอบ Session ข้อผิดพลาด latency และค่าใช้จ่ายใน Console

## คำแนะนำด้านการดำเนินงาน {#operational-guidance}

- [การตอบกลับแบบสตรีม](/guides/streaming)
- [การจัดการข้อผิดพลาดและการลองใหม่](/guides/error-handling)
- [ขีดจำกัดอัตรา](/guides/rate-limiting)
- [การเรียกเก็บเงินและราคา](/guides/billing)
- [การดูแล workspace](/admin/)

## ขั้นตอนถัดไป {#next-steps}

- สร้างสรรค์ด้วย Skills บนเครื่อง: [บทแนะนำ Skill](/guides/skills/)

- เพิ่งเริ่มใช้ SandBase: [เริ่มต้นใช้งาน](/getting-started/)
- เรียกใช้โมเดลหรือ API: [แค็ตตาล็อก Models](https://www.sandbase.ai/models) และ[แค็ตตาล็อก APIs](https://www.sandbase.ai/apis)
- API สำหรับ inference และ Agent: [ข้อมูลอ้างอิง API](/api-reference/)
- สร้างงานที่นำกลับมาใช้ซ้ำได้: [Build Agent](/agents/)
- เชื่อมต่อเครื่องมือ AI: [การตั้งค่า](/setup/)
