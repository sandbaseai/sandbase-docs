---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: กำหนด ทดสอบ และเรียกใช้ Agent ที่นำกลับมาใช้ซ้ำได้และมีเวอร์ชันใน SandBase Session
---

# Build Agent {#build-agent}

Build Agent คือที่ที่คุณกำหนดและทดสอบ Agent แล้วตัดสินใจว่าจะให้ Agent ทำงานอย่างไร

Agent คือการกำหนดค่าที่บันทึกไว้และมีเวอร์ชัน ประกอบด้วย Model, คำสั่ง, โปรไฟล์รันไทม์, Skills และการเชื่อมต่อ MCP ไปยังเครื่องมือภายนอก การบันทึก Agent ไม่ได้ทำให้ Agent เริ่มทำงาน

## Agent คืออะไร {#what-an-agent-is}

| คำถาม | อยู่ที่ไหน |
|---|---|
| ควรทำอะไร | `instructions` |
| ใช้โมเดลใดทำงาน | `model` ซึ่งเป็น model ID จาก [Models API](/api-reference/models/) |
| ทำอะไรได้บ้าง | [Skills](/agents/mcp-tools#skills) ซึ่งเป็นชุดคำสั่งที่มีเวอร์ชัน |
| เรียกใช้เครื่องมือภายนอกใดได้บ้าง | [การเชื่อมต่อ MCP](/agents/mcp-tools#mcp-connections) พร้อม[ข้อมูลรับรอง](/agents/api-credentials) เมื่อเซิร์ฟเวอร์ต้องใช้โทเค็น |
| ทำงานอย่างไร | ใน [Session](/agents/sessions) |

การเปลี่ยนแปลงที่มีผลทุกครั้งจะสร้างเวอร์ชันใหม่ที่แก้ไขไม่ได้ คุณสามารถดูรายการเวอร์ชันและกู้คืนเวอร์ชันก่อนหน้าได้ทุกเมื่อ

## Agent ทำงานอย่างไร {#how-an-agent-runs}

คุณเรียกใช้ Agent ใน [Session](/agents/sessions) Session คือทรัพยากร `ses_` ที่คุณส่งอินพุตเข้าไปและสตรีมอีเวนต์ออกมา ไม่ว่าจะเป็นการสนทนาแบบโต้ตอบ การทดสอบ หรือการเรียกจากแอปพลิเคชันของคุณ แต่ละ Session จะตรึงเวอร์ชันของ Agent ที่ใช้ตอนเริ่ม คุณจึงแก้ไข Agent ต่อได้โดยไม่กระทบ Session ที่มีอยู่แล้ว

## วงจรชีวิตของ Agent: ร่าง → ทดสอบใน Session → เรียกใช้จากแอป → ตรวจสอบ Session {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. ร่าง {#_1-draft}

สร้าง Agent ใน Console ที่ **Build → Agents** หรือด้วย [`POST /v1/agents`](/agents/agent-api) เริ่มจากเวิร์กโฟลว์ที่เล็กที่สุดที่ใช้งานได้ และเพิ่ม Skills และการเชื่อมต่อ MCP เฉพาะเมื่อคำสั่งต้องใช้เท่านั้น

### 2. ทดสอบใน Session {#_2-test-in-a-session}

สร้าง Session สำหรับ Agent ส่งอินพุตที่เป็นตัวแทนของการใช้งานจริง แล้วอ่านเอาต์พุต กิจกรรมของเครื่องมือ และข้อผิดพลาด ทดสอบกรณีอินพุตขาดหาย เครื่องมือใช้งานไม่ได้ ผลลัพธ์ว่างเปล่า และข้อกำหนดรูปแบบเอาต์พุต ไม่ใช่เฉพาะกรณีที่ทุกอย่างราบรื่น

### 3. เรียกใช้จากแอป {#_3-run-from-your-app}

สร้าง Session สำหรับ Agent ที่ทดสอบแล้วจากแอปพลิเคชันของคุณด้วย [Sessions API](/api-reference/sessions/)

### 4. ตรวจสอบ Session {#_4-inspect-sessions}

อ่าน items และ turns ของแต่ละ Session ด้วย Sessions API เพื่อตรวจสอบบทสนทนาทั้งหมด กิจกรรมของเครื่องมือ และข้อผิดพลาด

## รายการตรวจสอบก่อนใช้งานจริง {#production-checklist}

- `model` ใช้ model ID ปัจจุบันจาก Models API
- Skills ถูกปักหมุดเวอร์ชันไว้เมื่อพฤติกรรมต้องไม่เปลี่ยนแปลงโดยไม่รู้ตัว
- การเชื่อมต่อ MCP เปิดให้ใช้เฉพาะเครื่องมือที่ Agent ต้องใช้ โดยใช้ `allowed_tools`
- โทเค็นถูกเก็บเป็น [Secret](/agents/api-credentials) และไม่เคยถูกเขียนลงในคำสั่ง อินพุต หรือ metadata
- การสร้าง Session ส่ง `Idempotency-Key` และการลองใหม่ใช้คีย์เดิม
- ตรวจสอบสถานะและข้อผิดพลาดของ Session หลังจากเริ่มทำงาน

## Agent ในแคตตาล็อก {#catalog-agents}

[แคตตาล็อก Agent](/api-reference/agents/catalog) สาธารณะแสดงรายการ Agent ที่ SandBase เผยแพร่ คุณอ่าน Agent ในแคตตาล็อกได้ แต่หากต้องการแก้ไข ต้อง clone มายังองค์กรของคุณก่อนด้วย `POST /v1/agents/catalog/{agent_id}/clone` สำเนาที่ได้คือ Agent ส่วนตัวใหม่ที่คุณเป็นเจ้าของและเรียกใช้ได้

::: tip การใช้ OpenAI SDK
Agents, Sessions และ Skills เป็นไปตาม OpenAI Agents API ดังนั้น OpenAI SDK อย่างเป็นทางการจึงใช้งานได้กับ `base_url="https://api.sandbase.ai/v1"` ดูตัวอย่างที่ผ่านการตรวจสอบและความแตกต่างได้ที่ [ความเข้ากันได้กับ OpenAI](/agents/openai-compatibility)
:::

## ขั้นตอนถัดไป {#next-steps}

- [กำหนด Agent](/agents/agent-api)
- [ความเข้ากันได้กับ OpenAI](/agents/openai-compatibility)
- [Skills และเครื่องมือ MCP](/agents/mcp-tools)
- [Sessions](/agents/sessions)
