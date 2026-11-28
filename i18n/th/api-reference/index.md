---
i18nSource: 071e97a48f9c4f4c
title: เอกสารอ้างอิง API
description: เรียกใช้โมเดลของ SandBase และจัดการ Agents, Sessions, Skills, การเชื่อมต่อ MCP, Secrets และรีซอร์สของบัญชี
---

# เอกสารอ้างอิง API {#api-reference}

ใช้ API เพื่อเรียกโมเดลโดยตรง หรือเพื่อกำหนด Agent ที่นำกลับมาใช้ซ้ำได้ รัน Agent ใน Session และเชื่อมต่อกับ Skills และเครื่องมือ MCP

::: tip กำลังมองหา model inference อยู่ใช่ไหม
สัญญา inference (Chat Completions, Responses, Anthropic Messages, Gemini, Images และวิดีโอ Seedance) อยู่ในส่วน **Model inference** ของเอกสารอ้างอิงนี้ ฟิลด์และราคาของแต่ละโมเดลอยู่ในหน้าของโมเดลนั้นใน[แค็ตตาล็อกโมเดล](https://www.sandbase.ai/models)
:::

## เลือกจุดเริ่มต้น {#choose-a-starting-point}

| เป้าหมาย | เริ่มที่ | ขั้นตอนถัดไป |
|---|---|---|
| กำหนดพฤติกรรมที่นำกลับมาใช้ซ้ำได้ | [Agents](/api-reference/agents/) | สร้างและกำหนดเวอร์ชันการกำหนดค่า Agent |
| รัน Agent โดยตรง | [Sessions](/api-reference/sessions/) | ส่งอินพุต สตรีมเหตุการณ์ และอ่านประวัติ |
| นำชุดคำสั่งกลับมาใช้ซ้ำ | [Skills](/api-reference/skills/) | อัปโหลดชุด ZIP ที่มีเวอร์ชันและแนบเข้ากับ Agent |
| เรียกเครื่องมือภายนอก | [การเชื่อมต่อ MCP](/api-reference/mcp-connections/) | ลงทะเบียนเซิร์ฟเวอร์ MCP ระยะไกลแบบ HTTPS สำหรับ Agent |
| ยืนยันตัวตนกับเครื่องมือภายนอก | [Secrets](/agents/api-credentials#with-the-api) | จัดเก็บ Bearer token แบบเขียนได้อย่างเดียวสำหรับการเชื่อมต่อ MCP |

## วงจรชีวิตของรีซอร์ส {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent** (`agt_`) คือการกำหนดค่าที่บันทึกไว้และมีการกำหนดเวอร์ชัน การสร้าง Agent จะไม่ทำให้ Agent ทำงาน
- **Session** (`ses_`) รัน Agent หนึ่งเวอร์ชันและตรึง Skills และการเชื่อมต่อ MCP ของเวอร์ชันนั้นไว้ พาธของ Session อยู่ภายใต้ `/v1/agents/sessions`
- **Skill** (`skl_`) คือชุดคำสั่งที่มีการกำหนดเวอร์ชัน **การเชื่อมต่อ MCP** (`mcp_`) ใช้ลงทะเบียนเซิร์ฟเวอร์เครื่องมือระยะไกล และ **Secret** (`sec_`) ใช้จัดเก็บ Bearer token ของการเชื่อมต่อนั้น

## ข้อกำหนดสำหรับรีซอร์สของแพลตฟอร์ม Agents {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, การเชื่อมต่อ MCP และ Secrets ให้บริการภายใต้ `https://api.sandbase.ai/v1` และใช้กฎร่วมกันดังนี้

- ยืนยันตัวตนด้วย `Authorization: Bearer` หรือ `X-API-Key` ดู[การยืนยันตัวตน](/api-reference/authentication#agents-platform-resources)
- Request body ต้องเป็น JSON แบบเข้มงวดขนาดไม่เกิน 1 MiB ฟิลด์ที่ไม่รู้จักจะได้ 400
- การเขียนที่สร้างการเชื่อมต่อ MCP หรือ Secret ต้องมี `Idempotency-Key` ส่วนการเขียนอื่นรับค่านี้ได้เช่นกัน
- การควบคุมการทำงานพร้อมกันแบบ optimistic ใช้ `row_version` ให้ส่งค่าที่คุณอ่านล่าสุด และเมื่อได้ 409 ให้อ่านใหม่อีกครั้ง
- Agents, Sessions, item, turn และ Skills ใช้การแบ่งหน้าแบบ cursor (`limit`, `after`, `order` โดย response มี `has_more` และ `last_id`) ส่วนเวอร์ชันของ Agent ไฟล์แนบ การเชื่อมต่อ MCP และ Secrets ใช้การแบ่งหน้าแบบ offset (`limit`, `offset` โดย response มี `total`)
- ข้อผิดพลาดใช้ `{"error": {"type", "code", "param", "message"}}` ดู[ข้อผิดพลาดของแพลตฟอร์ม Agents](/api-reference/errors#agents-platform-errors)

## การยืนยันตัวตน {#authentication}

ส่ง SandBase API key เป็น Bearer token:

```http
Authorization: Bearer sk-YOUR_KEY
```

ให้ถือว่าคีย์เป็นความลับแบบทึบ เก็บไว้บนเซิร์ฟเวอร์ และห้ามใส่ไว้ในโค้ดฝั่งเบราว์เซอร์หรือในล็อก ดูรายละเอียดด้านความเข้ากันได้ที่[การยืนยันตัวตน](/api-reference/authentication) และ envelope ข้อผิดพลาดสาธารณะที่[ข้อผิดพลาด](/api-reference/errors)

## องค์กรและการใช้งาน {#organization-and-usage}

รีซอร์สของแพลตฟอร์มเป็นขององค์กรที่ผูกกับ API key ใช้ [Account API](/api-reference/account/) เพื่อตรวจสอบยอดคงเหลือและมุมมองประวัติการดำเนินการล่าสุดที่รองรับ การดูแลองค์กรและการจัดการการเรียกเก็บเงินยังคงทำผ่าน Console เว้นแต่จะมี endpoint สาธารณะระบุไว้ที่นี่

## รูปแบบเอกสารอ้างอิง {#reference-formats}

- เรียกดูการดำเนินการจากแถบด้านข้างเพื่อดูตัวอย่างและรายละเอียดของ response
- ดาวน์โหลด[ข้อกำหนด OpenAPI](/openapi.yaml) ที่เครื่องอ่านได้
- เปิดหน้าของโมเดลใน[แค็ตตาล็อกโมเดล](https://www.sandbase.ai/models) หรือหน้าของ API ใน[แค็ตตาล็อก API](https://www.sandbase.ai/apis) เพื่อดูฟิลด์ของคำขอที่ถูกต้อง

## ขั้นตอนถัดไป {#next-steps}

- เพิ่งเริ่มใช้ Agent แบบมีการจัดการ: [สร้าง Agent](/agents/)
- เรียกโมเดลโดยตรง: [Chat Completions](/api-reference/llm-gateway) หรือ[แค็ตตาล็อกโมเดล](https://www.sandbase.ai/models)
