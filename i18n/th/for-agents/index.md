---
i18nSource: 0314b37a870481ae
title: เอกสารที่ AI อ่านได้
description: ทุกสิ่งที่ AI agent ต้องใช้เพื่อค้นหาและใช้งาน SandBase API ในสรุปหน้าเดียว
---

# ภาพรวม API ที่เป็นมิตรกับ AI {#ai-friendly-api-overview}

::: info สัญญาของ Session
Session (`ses_*`) จะรัน Agent ที่บันทึกไว้หนึ่งเวอร์ชัน สร้างได้โดยตรงด้วย `POST /v1/agents/sessions` อินสแตนซ์ของรันไทม์เป็นข้อมูลภายในและจะไม่ถูกส่งคืน
:::

> เอกสารอ้างอิงแบบกระชับสำหรับทั้งมนุษย์และ AI agent ดูเวอร์ชันข้อความล้วนที่ปรับให้เหมาะกับการนำเข้าของ LLM ได้ที่ [`llms.txt`](https://www.sandbase.ai/docs/llms.txt)

## SandBase คืออะไร {#what-is-sandbase}

SandBase คือแพลตฟอร์มโครงสร้างพื้นฐานสำหรับ AI agent API key เดียวเข้าถึง Models และ APIs ที่เปิดใช้งานได้ครอบคลุมภาษา ภาพ วิดีโอ เสียง การค้นหา และข้อมูล รวมถึงเวิร์กโฟลว์ของ Agent ให้ค้นหาแคตตาล็อกปัจจุบันแทนการยึดตามจำนวนตายตัว

## Base URL ของ API {#api-base-url}

```
https://api.sandbase.ai/v1
```

## การยืนยันตัวตน {#authentication}

ทุกคำขอต้องใช้ Bearer token:

```
Authorization: Bearer sk-YOUR_KEY
```

รับคีย์ได้ที่ [Developer → API Keys](https://www.sandbase.ai/console/keys)

## ตัวอย่างแบบเร็ว {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## API หลัก {#core-apis}

| เมธอด | เส้นทาง | คำอธิบาย |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | แชตที่เข้ากันได้กับ OpenAI ความสามารถเสริมขึ้นอยู่กับโมเดลที่เลือก |
| `POST` | `/v1/messages` | Messages API ที่เข้ากันได้กับ Anthropic |
| `POST` | `/v1/run` | ส่งงานสร้างด้วยโมเดลโดยใช้สคีมาเฉพาะของโมเดลนั้น |
| `GET` | `/v1/run/{id}` | โพลสถานะการสร้างแบบอะซิงโครนัสและดึงผลลัพธ์ |
| `GET` | `/v1/models` | แสดงรายการโมเดลเชิงตรรกะที่เปิดใช้งาน ค่าเริ่มต้นคือประเภท LLM |
| `GET` | `/v1/models/{id_or_name}` | ดึงรายละเอียด สคีมา ความสามารถ และราคาของโมเดล |
| `GET` | `/v1/tasks/{task_id}/cost` | ดึงค่าใช้จ่ายและการใช้งานของงาน |

## กลุ่ม API เพิ่มเติม {#additional-api-groups}

นอกเหนือจาก API การสร้างหลักแล้ว SandBase ยังมี API สำหรับจัดการวงจรชีวิตของ agent ดูเวิร์กโฟลว์ที่ใช้บ่อยได้ที่[คู่มือ AI API](./full) และดูสัญญาฉบับสมบูรณ์ได้ที่[ข้อกำหนด OpenAPI](https://www.sandbase.ai/docs/openapi.yaml)

| กลุ่ม | เส้นทางหลัก | วัตถุประสงค์ |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | สร้างและจัดเวอร์ชันนิยาม Agent ที่บันทึกไว้ |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | รัน Agent ส่ง input และสตรีมอีเวนต์สด |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | ชุดคำสั่งที่มีเวอร์ชันซึ่ง Agents เมานต์ใช้ |
| **การเชื่อมต่อ MCP และ Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | เครื่องมือ MCP ระยะไกลผ่าน HTTPS และ Bearer token แบบเขียนได้อย่างเดียว |

ทรัพยากรของแพลตฟอร์ม Agents รับ `Authorization: Bearer` หรือ `X-API-Key` และส่งคืน `{"error":{"type","code","param","message"}}` เมื่อล้มเหลว

## รูปแบบราคา {#pricing-model}

จ่ายตามการใช้งาน ราคาขึ้นอยู่กับแต่ละโมเดลและอาจเปลี่ยนแปลงโดยไม่ขึ้นกับหน้านี้:

- **ราคาของโมเดล**: อ่านสูตรและหน่วยปัจจุบันของโมเดลที่เลือกจาก `model_card`
- **ราคาตามโทเค็น**: อาจมีส่วนของ input, output, cache หรือ reasoning เมื่อโมเดลนั้นประกาศไว้
- **สื่อและการดำเนินการอื่น**: อาจใช้หน่วยต่อคำขอ ระยะเวลา ความละเอียด หรือหน่วยอื่นเฉพาะของโมเดล
- **Data APIs** (การค้นหา โซเชียล การดึงข้อมูลเว็บ อีคอมเมิร์ซ การเงิน): แต่ละองค์กรได้รับการเรียกฟรี 100 ครั้งต่อวันตามเวลา UTC ซึ่งใช้ร่วมกันใน data APIs ที่มีสิทธิ์ หลังจากนั้นการเรียกจะถูกเรียกเก็บเงินต่อครั้ง ไม่ถูกบล็อก ใน MCP เครื่องมือที่มีสิทธิ์จะแสดง `pricing.free_quota` ใน `sandbase_inspect` และ `sandbase_account` จะส่งคืน `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`) ดู[การเรียก API ฟรีรายวัน](/guides/billing#daily-free-api-calls)

ค้นหา ID ของโมเดลปัจจุบันด้วย `GET /v1/models` แล้วตรวจสอบ `GET /v1/models/{id_or_name}` ก่อนส่งคำขอ อย่าคาดว่าราคาหรือส่วนลด cache จะเหมือนกันในทุกผู้ให้บริการ

เมื่อการดำเนินการส่งคืน task ID ให้ตรวจสอบค่าใช้จ่ายที่บันทึกไว้:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## ขีดจำกัดอัตราการเรียกใช้ {#rate-limits}

ไม่มีค่าเริ่มต้นที่เป็นตัวเลขแบบสากลที่เผยแพร่ไว้ คำขออาจอยู่ภายใต้ขีดจำกัดจำนวนคำขอต่อนาทีที่กำหนดให้
องค์กรของคุณ (ถ้ามี) ซึ่งใช้ร่วมกันในทุก API key ขององค์กร การตอบกลับ `429` ไม่มีเฮดเดอร์โควตาหรือ `Retry-After` ให้ใช้
exponential backoff แบบมีขอบเขตพร้อม jitter ดู[คู่มือข้อผิดพลาด](./errors)

---

## อ่านเพิ่มเติม {#further-reading}

- [คู่มือ AI API](./full) — เวิร์กโฟลว์หลัก รูปแบบคำขอ/การตอบกลับ และตัวอย่าง curl
- [Models และราคา](./models) — การค้นหาโมเดลแบบสด ราคา และแนวทางด้านความสามารถ
- [คู่มือข้อผิดพลาด](./errors) — รูปแบบการตอบกลับที่ระบุไว้ การจัดการ HTTP และความปลอดภัยในการลองใหม่
- [ข้อกำหนด OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — OpenAPI 3.1 ที่เครื่องอ่านได้

## เวอร์ชันข้อความล้วน (สำหรับ AI agent) {#plain-text-versions-for-ai-agents}

| ไฟล์ | URL | เนื้อหา |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | สรุปแบบกระชับ (~60 บรรทัด) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | คู่มือ API ฉบับขยายสำหรับ AI |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | ข้อกำหนด OpenAPI 3.1 ที่เครื่องอ่านได้ |
