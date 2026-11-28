---
i18nSource: 2ba7f0f41847d04f
title: กำหนด Agent
description: สร้างและอัปเดต Agent ที่มีเวอร์ชันด้วย Agents API รวมถึงฟิลด์ ขีดจำกัด เวอร์ชัน และการเก็บถาวร
---

# กำหนด Agent {#define-an-agent}

สร้าง Agent ด้วย `POST /v1/agents` API นี้เป็นไปตามโปรโตคอล OpenAI Agents คุณจึงใช้ HTTP ธรรมดาหรือ `client.beta.agents` ของ OpenAI SDK พร้อม `base_url="https://api.sandbase.ai/v1"` ได้ เฮดเดอร์ `OpenAI-Beta` ไม่บังคับ แต่หากส่งมา ค่าต้องเป็น `agents=v1` ดูสิ่งที่ SDK รองรับได้ที่ [ความเข้ากันได้กับ OpenAI](/agents/openai-compatibility)

## สร้าง Agent {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

การตอบกลับคือ `201 Created` พร้อม Agent ซึ่งมี ID แบบ `agt_`, `version: 1`, `row_version`, `status: "active"` และ `projection_status` เวอร์ชันใหม่จะถูกเตรียมสำหรับการทำงานในเบื้องหลัง ให้เริ่ม Sessions เมื่อ `projection_status` เป็น `ready`

`Idempotency-Key` ไม่บังคับ หากไม่ระบุ บริการจะสร้างให้เอง ซึ่งทำให้คำขอที่ส่งซ้ำอาจสร้าง Agent ตัวที่สองได้ ควรส่งคีย์ที่คงที่ของคุณเองเมื่อส่งคำขอซ้ำ

## ฟิลด์ {#fields}

เนื้อหาคำขอเป็น JSON แบบเข้มงวด (ขนาดไม่เกิน 1 MiB) ฟิลด์ที่ไม่รู้จักจะส่งคืน 400

| ฟิลด์ | บังคับ | ขีดจำกัดและค่า |
|---|---|---|
| `model` | ใช่ | ID ของโมเดล ยาวได้สูงสุด 200 อักขระ |
| `name` | ไม่ | สูงสุด 128 อักขระ |
| `instructions` | ไม่ | สูงสุด 256 KiB |
| `description` | ไม่ | สูงสุด 4096 อักขระ |
| `runtime_profile` | ไม่ | `codex` (ค่าเริ่มต้น), `claude` หรือ `mcode` |
| `skills` | ไม่ | การอ้างอิงสูงสุด 32 รายการ การผูกใหม่ที่มี `version: null` จะตรึงเวอร์ชันเริ่มต้นปัจจุบัน ณ ตอนบันทึก ส่วนการผูกที่มีอยู่แล้วจะคงเวอร์ชันที่ตรึงไว้ ให้ระบุเวอร์ชันอย่างชัดเจนเพื่ออัปเกรด ดู [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | ไม่ | การอ้างอิงสูงสุด 32 รายการ ดู [การเชื่อมต่อ MCP](/agents/mcp-tools#mcp-connections) |
| `tools` | ไม่ | เครื่องมือ `function` สูงสุด 64 รายการ และเครื่องมือ `web_search` ไม่เกินหนึ่งรายการ |
| `text` | ไม่ | `format.type` เป็น `text` หรือ `json_schema` (สคีมาแบบ object) และ `verbosity` เป็น `low`, `medium` หรือ `high` |
| `reasoning` | ไม่ | `effort` เป็น `none`, `minimal`, `low`, `medium`, `high`, `xhigh` หรือ `max` และ `summary` เป็น `concise`, `detailed` หรือ `auto` |
| `service_tier` | ไม่ | `auto` (ค่าเริ่มต้น), `default`, `flex`, `priority` หรือ `fast` |
| `metadata` | ไม่ | คู่สตริงสูงสุด 16 คู่ คีย์ยาวได้สูงสุด 64 อักขระ และค่ายาวได้สูงสุด 512 อักขระ |
| `note` | ไม่ | หมายเหตุการเปลี่ยนแปลงที่จัดเก็บไว้กับเวอร์ชัน |

## ขีดจำกัดปัจจุบัน {#current-limits}

- `web_search` ต้องใช้ `"mode": "disabled"` จึงจะเริ่ม Sessions ได้
- บันทึกเครื่องมือ `function` ได้ แต่ยังไม่รองรับ Run ที่ต้องให้ไคลเอนต์ส่งผลลัพธ์ของเครื่องมือกลับมา (`requires_action`) Session ที่อยู่ในสถานะนั้นจะส่งคืน `502 executor_contract_error` ให้มอบความสามารถภายนอกแก่ Agent ผ่าน [การเชื่อมต่อ MCP](/agents/mcp-tools#mcp-connections) แทน
- ต้องไม่ระบุ `multi_agent` หรือตั้งเป็น `null`

## อัปเดต Agent {#update-an-agent}

การอัปเดตมีสองรูปแบบ และทั้งสองแบบจะสร้างเวอร์ชันใหม่

- `POST /v1/agents/{agent_id}` คือการอัปเดตแบบ OpenAI SDK ส่งเฉพาะฟิลด์ที่ต้องการเปลี่ยน ไม่ต้องใช้ `row_version` ดังนั้นผู้เขียนคนสุดท้ายจะเป็นผู้ชนะ รูปแบบนี้ไม่รับ `description` และ `note`
- `PATCH /v1/agents/{agent_id}` คือการอัปเดตแบบ compare-and-set ต้องระบุ `row_version` ที่คุณอ่านล่าสุด และจะส่งคืน 409 หาก Agent มีการเปลี่ยนแปลงในระหว่างนั้น ระบบจะปฏิเสธค่า `null` ที่ระบุอย่างชัดเจน

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## เวอร์ชัน การเก็บถาวร และการกู้คืน {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` แสดงรายการสแนปช็อตที่เปลี่ยนแปลงไม่ได้ ส่วน `GET /v1/agents/{agent_id}/versions/{version}` อ่านสแนปช็อตหนึ่งรายการ
- `POST /v1/agents/{agent_id}/restore` พร้อม `{"source_version": 1, "row_version": 3}` จะคัดลอกการกำหนดค่าก่อนหน้าไปเป็นเวอร์ชันปัจจุบันใหม่
- `POST /v1/agents/{agent_id}/archive` และ `/unarchive` รับ `{"row_version": …}` Agent ที่ถูกเก็บถาวรจะเริ่ม Sessions ใหม่ไม่ได้
- `DELETE /v1/agents/{agent_id}` จะเก็บถาวร Agent โดย Agents จะไม่ถูกลบถาวรเลย

## ขั้นตอนถัดไป {#next-steps}

- [Skills และเครื่องมือ MCP](/agents/mcp-tools)
- [รัน Agent ใน Session](/agents/sessions)
- [เอกสารอ้างอิง Agents API](/api-reference/agents/)
