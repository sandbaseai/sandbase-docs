---
i18nSource: e566962f42a5f6b0
title: คู่มือ SandBase AI API
description: คู่มือ SandBase API ฉบับขยายสำหรับ AI agent พร้อมเวิร์กโฟลว์หลัก ตัวอย่างคำขอ และลิงก์ไปยังข้อกำหนด OpenAPI ที่เป็นทางการ
---

# คู่มือ AI API {#ai-api-guide}

::: info ข้อกำหนดของ Session
Session (`ses_*`) เรียกใช้ Agent ที่บันทึกไว้หนึ่งเวอร์ชัน และสร้างโดยตรงด้วย `POST /v1/agents/sessions` โดยไม่เปิดเผย Runtime Session ID ภายใน
:::

> คู่มือหน้าเดียวสำหรับเวิร์กโฟลว์ API ที่ใช้บ่อยที่สุด สำหรับข้อกำหนดฉบับสมบูรณ์ที่เครื่องอ่านได้ ให้ใช้ [ข้อกำหนด OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) ฉบับข้อความล้วน: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt)

## การยืนยันตัวตน {#authentication}

ทุกคำขอต้องมี:

```
Authorization: Bearer sk-YOUR_KEY
```

Base URL: `https://api.sandbase.ai/v1`

---

## คำศัพท์ {#terminology}

| คำศัพท์ | ความหมาย |
|------|---------|
| **Task** | บันทึกการทำงานที่มีการเรียกเก็บเงิน สำหรับการดำเนินการ เช่น การอนุมานของโมเดล ไม่ใช่ทุกการดำเนินการของ API ที่จะสร้าง Task |
| **Run** | คำขอสร้างสื่อผ่าน `POST /v1/run` อาจเป็นแบบซิงโครนัสหรืออะซิงโครนัส poll ด้วย `GET /v1/run/{id}` |
| **Session** | การทำงานของ Agent ผ่าน `POST /v1/agents/sessions` ซึ่งเก็บบทสนทนา กิจกรรมของเครื่องมือ และเอาต์พุต ดึงข้อมูลด้วย `GET /v1/agents/sessions/{session_id}` |
> **run กับ session**: "run" ของโมเดล (`/v1/run`) คืองานสร้างผลลัพธ์ของโมเดล ส่วน "Session" (`/v1/agents/sessions`) คือการทำงานของ Agent ID ทั้งหมดเป็นค่าทึบและห้ามนำไปแยกวิเคราะห์
>
> **task กับ run**: "run" หรือ "session" คือคำขอที่คุณส่ง ส่วน "task" คือบันทึกการทำงานที่มีการเรียกเก็บเงิน ให้ใช้
> `GET /v1/tasks/{task_id}/cost` เมื่อการดำเนินการส่งคืน task ID ไม่ใช่ทุกการดำเนินการของ API ที่จะสร้าง task

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

เข้ากันได้กับ OpenAI การรองรับการสตรีม เครื่องมือ vision การให้เหตุผล และเอาต์พุตแบบมีโครงสร้าง ขึ้นอยู่กับโมเดลที่เลือกและ schema ที่โมเดลประกาศไว้

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in one paragraph."}
    ],
    "temperature": 0.7,
    "max_tokens": 500,
    "stream": false
  }'
```

**การตอบกลับ:**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "openai/gpt-5.6-luna",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing leverages quantum mechanical phenomena..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113
  }
}
```

> การดำเนินการบางรายการที่มีการเรียกเก็บเงินอาจส่งคืน `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc` เมื่อมีค่านี้ ให้ใช้ค่านี้เรียก
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Messages API ที่เข้ากันได้กับ Anthropic การแคชและฟีเจอร์เสริมอื่นขึ้นอยู่กับโมเดลที่เลือกและ schema ของคำขอ

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is SandBase?"}]
  }'
```

**การตอบกลับ:**

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "SandBase is an AI agent infrastructure platform..." }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 12, "output_tokens": 64 }
}
```

---

## การสร้างภาพ {#image-generation}

### POST /v1/run {#post-v1-run}

endpoint `/v1/run` เป็น **endpoint สำหรับการสร้างแบบรวมศูนย์** โดยฟิลด์ `model` เป็นตัวกำหนดประเภทเอาต์พุต (ภาพ วิดีโอ หรือเสียง)

> **วิธีจัดการการตอบกลับ:** ตรวจสอบฟิลด์ `status`
> - `"completed"` → ผลลัพธ์อยู่ใน `outputs` เสร็จสิ้น
> - `"pending"` หรือ `"running"` → poll `GET /v1/run/{id}` ทุก 2–5 วินาทีจนกว่าจะถึงสถานะสิ้นสุด (`completed`, `failed` หรือ `timeout`)

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bfl/flux-2/flash",
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "aspect_ratio": "1:1"
  }'
```

**การตอบกลับ (ซิงโครนัส):**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "model": "bfl/flux-2/flash",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/f3d2e8a1-7c4b-4a12-9d2e-123456789abc.png",
    "content_type": "image/png",
    "width": 1024,
    "height": 1024
  }]
}
```

---

## การสร้างวิดีโอ {#video-generation}

### POST /v1/run {#post-v1-run-1}

ตรวจสอบ `execution_mode` ของโมเดลที่เลือก เมื่อการส่งงานส่งคืน `pending` หรือ `running` ให้ poll `GET /v1/run/{id}` จนกว่าจะถึงสถานะสิ้นสุด

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kwaivgi/kling-video/v3/standard/text-to-video",
    "prompt": "A drone flying over mountains at golden hour",
    "duration": 5
  }'
```

**การตอบกลับ (อะซิงโครนัส — ครั้งแรก):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**poll สถานะ: `GET /v1/run/{id}`**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "completed",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/6a7b9c10-2d3e-4f50-8a61-23456789abcd.mp4",
    "content_type": "video/mp4",
    "duration": 5
  }]
}
```

---

## เสียง (แปลงข้อความเป็นเสียง) {#audio-text-to-speech}

### POST /v1/run {#post-v1-run-2}

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seed-speech/tts/2.0",
    "text": "Hello world, this is a test of text to speech."
  }'
```

**การตอบกลับ:**

```json
{
  "id": "7b8c0d21-3e4f-5061-9b72-3456789abcde",
  "status": "completed",
  "model": "bytedance/seed-speech/tts/2.0",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/7b8c0d21-3e4f-5061-9b72-3456789abcde.mp3",
    "content_type": "audio/mpeg",
    "duration_seconds": 3.2
  }]
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- DISCOVERY APIs                                           -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## แสดงรายการโมเดล {#list-models}

### GET /v1/models {#get-v1-models}

ส่งคืนโมเดลเชิงตรรกะที่เปิดใช้งานในรูปแบบรายการโมเดลที่เข้ากันได้กับ OpenAI endpoint นี้ไม่มีการแบ่งหน้าและ
ใช้ค่าเริ่มต้น `type=llm` โดยตั้งใจไม่รวมรายละเอียดความสามารถและราคา

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

การตอบกลับมี `object: "list"` และอาร์เรย์ `data` แต่ละรายการมี `id`, `object`, `created` และ
`owned_by` ให้ใช้ `id` เป็นชื่อโมเดลเชิงตรรกะ แล้วดึงข้อมูลโมเดลนั้นเพื่อดู metadata ด้านความสามารถและราคา

---

## ดึงข้อมูลโมเดล {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

การตอบกลับแบบละเอียดจะเพิ่ม `unified_schema`, `supported_modes` และ `model_card` ราคาโดยละเอียดอยู่ภายใน
`model_card` ไม่มีออบเจ็กต์ `pricing` ระดับบนสุด

---

## ดึงค่าใช้จ่ายของ Task {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

ตรวจสอบค่าใช้จ่ายที่บันทึกไว้ของ task โดยใช้ task ID ที่การดำเนินการของ API ส่งคืน

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**การตอบกลับ:**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "settled": true,
  "currency": "USD",
  "cost": "0.000325",
  "estimated_cost": "0.000325",
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113,
    "cached_tokens": 0,
    "cache_creation_tokens": 0,
    "reasoning_tokens": 0
  }
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- PLATFORM APIs                                            -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## ข้อตกลงของแพลตฟอร์ม Agents {#agents-platform-conventions}

- Base URL `https://api.sandbase.ai/v1` ส่ง `Authorization: Bearer sk-YOUR_KEY` หรือ `X-API-Key: sk-YOUR_KEY` (ใช้ค่าเดียวกันหากส่งทั้งคู่) `OpenAI-Beta` ไม่บังคับ หากส่งต้องเป็น `agents=v1` OpenAI SDK อย่างเป็นทางการ (`client.beta.agents`, `client.skills`) ใช้งานได้กับ `base_url="https://api.sandbase.ai/v1"` ดูความแตกต่างได้ที่ [ความเข้ากันได้กับ OpenAI](/agents/openai-compatibility)

- เนื้อหาคำขอเป็น JSON แบบเข้มงวด ขนาดไม่เกิน 1 MiB ฟิลด์ที่ไม่รู้จักจะได้ 400

- ข้อผิดพลาด: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}` ให้แยกการจัดการตาม `code` ดู [คู่มือข้อผิดพลาด](./errors#agents-platform-errors)

- `row_version` คือโทเค็น compare-and-set สำหรับ PATCH, archive, restore และ rotate เมื่อได้ 409 ให้อ่านใหม่

- รายการแบบ cursor (Agents, Sessions, items, turns, Skills): `limit` 1-100, `after`, `order` การตอบกลับ `{object:"list", data, has_more, first_id, last_id}`

- รายการแบบ offset (เวอร์ชันของ Agent, ไฟล์แนบ, การเชื่อมต่อ MCP, Secrets): `limit`, `offset` การตอบกลับ `{data, total, limit, offset}`

- ID: Agent `agt_`, Session `ses_`, Skill `skl_`, การเชื่อมต่อ MCP `mcp_`, Secret `sec_`, ไฟล์แนบ `fil_` ให้ถือว่าเป็นค่าทึบ

---

## Agents {#agents}

### POST /v1/agents — สร้าง Agent {#post-v1-agents-—-create-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question and cite sources."
  }'
```

จำเป็น: `model` ไม่บังคับ: `name`, `instructions`, `description`, `runtime_profile` (ค่าเริ่มต้น `codex`, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note` ส่งคืน `201` พร้อม `id` (`agt_`), `version`, `row_version`, `status` และ `projection_status` ให้เริ่ม Session เมื่อ `projection_status` เป็น `ready` เครื่องมือ `web_search` ต้องใช้ `mode: "disabled"` และไม่รองรับผลลัพธ์ฟังก์ชันฝั่งไคลเอนต์ (`requires_action`)

### GET /v1/agents — แสดงรายการ Agent {#get-v1-agents-—-list-agents}

query `status` (ค่าเริ่มต้น `active`, `archived`, `all`) พร้อมการแบ่งหน้าแบบ cursor

### GET /v1/agents/{agent_id} — ดึงข้อมูล Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — อัปเดต Agent (แบบ SDK) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

อัปเดตบางส่วนของ `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills` ไม่ต้องใช้ `row_version` และจะสร้างเวอร์ชันใหม่

### PATCH /v1/agents/{agent_id} — อัปเดต Agent (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

ฟิลด์เดียวกัน พร้อม `description` และ `note` ต้องระบุ `row_version` การส่ง `null` อย่างชัดเจนจะได้ 400

### เวอร์ชัน การเก็บถาวร การกู้คืน และแคตตาล็อก {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` และ `GET /v1/agents/{agent_id}/versions/{version}` อ่านสแนปช็อตที่แก้ไขไม่ได้

- `POST /v1/agents/{agent_id}/archive`, `POST /v1/agents/{agent_id}/unarchive` รับ `{"row_version"}` ส่วน `DELETE /v1/agents/{agent_id}` ก็เก็บถาวรเช่นกัน

- `POST /v1/agents/{agent_id}/restore` รับ `{"source_version","row_version"}`

- `GET /v1/agents/catalog` แสดงรายการ Agent สาธารณะ ส่วน `POST /v1/agents/catalog/{agent_id}/clone` คัดลอก Agent หนึ่งรายการมายังองค์กรของคุณ (`201`, `agt_` ใหม่)

---

## Sessions {#sessions}

Session เรียกใช้ Agent ที่บันทึกไว้หนึ่งเวอร์ชัน พาธอยู่ภายใต้ `/v1/agents/sessions` เวอร์ชันของ Agent, เวอร์ชันของ Skill และการเชื่อมต่อ MCP จะถูกตรึงไว้ตอนสร้าง

### POST /v1/agents/sessions — สร้าง Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

ส่ง `agent_id` (Agent ที่บันทึกไว้), `agent` (Agent แบบ inline หรือการแทนที่ค่าต่อ Session สำหรับ `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` และ `multi_agent`) หรือทั้งสองอย่าง ไม่บังคับ: `version` (เฉพาะ Agent ที่บันทึกไว้), `title`, `input` (สตริง หรืออาร์เรย์ที่มีข้อความของ user เพียงหนึ่งข้อความซึ่งมี part `input_text` หนึ่งรายการ), `model` หรือ `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}` หากไม่ระบุจะใช้คีย์ที่คุณใช้เรียก) การใช้ `stream: true` กับ `input` ที่ไม่ว่างจะส่งคืน `201` เป็นสตรีม Server-Sent Events ของ turn แรก เริ่มด้วย `agent.session.created` Session ทำงานบนคลาวด์ที่ SandBase โฮสต์เสมอ จึงไม่มีสภาพแวดล้อมให้เลือก แต่ OpenAI SDK ยังต้องระบุ `environment={"type": "openai_hosted"}` ส่งคืน `201` พร้อม `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) และ `row_version`

### GET /v1/agents/sessions/{session_id}/events — สตรีมอีเวนต์ (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

เป็นแบบเรียลไทม์เท่านั้น ให้เปิดก่อนส่งอินพุต `Last-Event-ID` หรือ `after` จะได้ 400 และอีเวนต์จะไม่ถูกส่งซ้ำ ค่า `type` ของอีเวนต์ขึ้นต้นด้วย `agent.session.`

### POST /v1/agents/sessions/{session_id}/events — ส่งอินพุต {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

หนึ่งคำขอต่อหนึ่งอีเวนต์เท่านั้น: `agent.session.input.message` หรือ `agent.session.input.cancel` ส่งคืน `202` โดยไม่มีเนื้อหา รูปแบบส่วนขยาย: `{"input": "...", "file_ids": ["fil_..."]}` (ไฟล์แนบที่พร้อมใช้งานสูงสุด 10 รายการ) `409 session_input_pending` หมายความว่าอินพุตก่อนหน้ายังส่งไม่เสร็จ ให้รอ และอย่าส่งซ้ำด้วยคีย์ใหม่

### ประวัติและการดำเนินการอื่นของ Session {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (query `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns`, `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` อ่านประวัติ

- `POST /v1/agents/sessions/{session_id}` แทนที่ `metadata` ส่วน `PATCH /v1/agents/sessions/{session_id}` เปลี่ยนชื่อด้วย `{"title","row_version"}`

- `POST /v1/agents/sessions/{session_id}/cancel` (ต้องมี `Idempotency-Key`) ยกเลิก turn ที่กำลังทำงาน

- `DELETE /v1/agents/sessions/{session_id}` เก็บถาวร ส่วน `POST /v1/agents/sessions/{session_id}/unarchive` กู้คืน

- `POST /v1/agents/sessions/{session_id}/files` อัปโหลดไฟล์แนบหนึ่งไฟล์ (multipart `file`, 5 MiB, ต้องมี `Idempotency-Key`)

- `POST /v1/agents/sessions/{session_id}/reconnect` ส่งคืน `stream_url` สำหรับ `GET /v1/agents/sessions/{session_id}/events/stream` ซึ่งส่ง `session.snapshot` แล้วตามด้วยอีเวนต์แบบเรียลไทม์

---

### ไฟล์ในเวิร์กสเปซและ artifact ของเอาต์พุต {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` แสดง metadata ของไฟล์ปัจจุบันภายใต้ `path` (ค่าเริ่มต้น `/workspace`) query `limit` (1-100 ค่าเริ่มต้น 20), `order` (ค่าเริ่มต้น `asc` หรือ `desc`) และ `page` (cursor `next` ก่อนหน้า) ส่งคืน `{object:"page", data:[{path,size_bytes}], next, has_more}` หาก cursor ไม่ถูกต้อง ต้องเริ่มใหม่จากหน้าแรก
- `GET /v1/agents/sessions/{session_id}/artifacts` แสดงเอาต์พุตที่แก้ไขไม่ได้ซึ่งเก็บไว้ภายใต้ `/workspace/outputs/` query `limit` (ค่าเริ่มต้น 20), `order` (ค่าเริ่มต้น `desc`) และ `after` (ใช้ `last_id` เมื่อ `has_more` เป็น true)
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` ดาวน์โหลด artifact ทั้งไฟล์โดยใช้ ID `art_` แบบทึบที่ได้รับ การดาวน์โหลดจำกัดที่ 200 MiB และไม่รองรับ `Range` (`416`) metadata ของเวิร์กสเปซ ไฟล์แนบที่อัปโหลด และ artifact ที่เก็บไว้เป็นทรัพยากรแยกกัน

---

## Skills, การเชื่อมต่อ MCP และ Secrets {#skills-mcp-connections-and-secrets}

### POST /v1/skills — สร้าง Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

ZIP part `files` หนึ่งรายการ (5 MiB) ไฟล์ ZIP ต้องมีโฟลเดอร์ระดับบนสุดหนึ่งโฟลเดอร์ที่มี `SKILL.md` (frontmatter `name` และ `description`) อยู่ข้างใน เช่น `zip -r release-notes.zip release-notes/` หาก `SKILL.md` อยู่ที่ราก ZIP จะได้ `400 invalid_request` Skill ที่ถูกอ้างอิงโดย Agent เวอร์ชันใดก็ตาม (รวมถึง Agent ที่เก็บถาวร) จะลบไม่ได้ (`409`) ให้ปิดใช้งานด้วย `POST /v1/skills/{skill_id}` และ `{"status": "disabled"}` แทน ส่งคืน `201` พร้อม `id` (`skl_`) และ `default_version` เพิ่มเวอร์ชันด้วย `POST /v1/skills/{skill_id}/versions` แสดงรายการด้วย `GET /v1/skills` อ้างอิงจาก Agent เป็น `{"skill_id": "skl_...", "version": null}`

### POST /v1/mcp-connections — ลงทะเบียนเซิร์ฟเวอร์ MCP {#post-v1-mcp-connections-—-register-an-mcp-server}

เนื้อหา `{"name", "server_url" (HTTPS), "secret_id"?}` ต้องมี `Idempotency-Key` อ้างอิงจาก `mcp_connections` ของ Agent การปิดใช้งานจะบล็อก Session ใหม่และอินพุตเพิ่มเติม

### POST /v1/secrets — จัดเก็บ MCP Bearer token {#post-v1-secrets-—-store-an-mcp-bearer-token}

เนื้อหา `{"name", "kind": "mcp_bearer", "server_url", "token"}` ต้องมี `Idempotency-Key` โทเค็นเป็นแบบเขียนได้อย่างเดียวและผูกกับ URL นั้นเท่านั้น Secret ไม่ใช่ตัวแปรสภาพแวดล้อม หมุนเวียนด้วย `POST /v1/secrets/{secret_id}/rotate` และเพิกถอนด้วย `DELETE /v1/secrets/{secret_id}` (204)

---

## การเรียกเก็บเงินและค่าใช้จ่าย {#billing-cost}

### วิธีคำนวณค่าใช้จ่าย {#how-costs-are-calculated}

- อ่านสูตรราคาและหน่วยปัจจุบันของโมเดลที่เลือกจาก `model_card`
- โมเดลที่คิดราคาตามโทเค็นอาจมีองค์ประกอบด้านอินพุต เอาต์พุต แคช หรือการให้เหตุผล เมื่อมีการประกาศไว้
- โมเดลสื่อและโมเดลอื่นอาจใช้หน่วยต่อคำขอ ระยะเวลา ความละเอียด หรือหน่วยเฉพาะของโมเดล
- Data API (search, social, scraping, e-commerce, finance) มีการเรียกฟรี 100 ครั้งต่อองค์กรต่อวันตามเวลา UTC ใช้ร่วมกันใน Data API ที่มีสิทธิ์ และรีเซ็ตเวลา 00:00 UTC การเรียกหลังจากนั้นจะคิดเงินต่อครั้งโดยไม่ถูกปฏิเสธ องค์กรที่มียอดคงเหลือเป็นศูนย์ยังใช้การเรียกฟรีได้
- ไม่มีสิทธิ์: LLM, โมเดลสื่อ และ Data API ที่ราคาสูงกว่าหรือคิดราคาตามสูตร (เช่น endpoint แบบ batch บางรายการ, crawl, Xiaohongshu PGY และเส้นทาง `kol-*` ของ Douyin Xingtu) ซึ่งคิดเงินตั้งแต่การเรียกครั้งแรก ให้ตรวจสอบจาก `pricing.free_quota` ใน `sandbase_inspect`
- MCP: `sandbase_inspect` แสดง `pricing.free_quota` บนเครื่องมือที่มีสิทธิ์ `sandbase_account` ส่งคืน `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`) และผลลัพธ์ของ `sandbase_run` และ `sandbase_run_get` ที่ชำระแล้วจะมี `free_quota_status` (`free`, `overage` หรือ `degraded`)
- เมื่อการดำเนินการที่มีการเรียกเก็บเงินส่งคืน task ID (รวมถึงส่วนหัวการตอบกลับ `x-task-id`) ให้ใช้ `GET /v1/tasks/{task_id}/cost` เพื่อดูการชำระและการใช้งาน
- สำหรับการตอบกลับ `POST /v1/run` แบบอะซิงโครนัส ให้ดึงผลลัพธ์การสร้างด้วย `GET /v1/run/{id}` run ID ไม่ใช่ task ID และห้ามส่งไปยัง endpoint ค่าใช้จ่าย

### การควบคุมงบประมาณ {#budget-control}

- ตั้งขีดจำกัดการใช้จ่าย (ไม่บังคับ) เมื่อสร้างหรือแก้ไขคีย์มาตรฐานที่ [Developer → API Keys](https://www.sandbase.ai/console/keys)
- ติดตามคำขอและค่าใช้จ่ายที่ **Developer → Activities → Usage**
- ตรวจสอบยอดคงเหลือและธุรกรรมเครดิตที่ [Developer → Billing](https://www.sandbase.ai/console/billing)

---

## ดูเพิ่มเติม {#see-also}

- [โมเดลและราคา](./models): การค้นหาโมเดลแบบเรียลไทม์ ความสามารถ และแนวทางด้านราคา
- [คู่มือข้อผิดพลาด](./errors): รูปแบบการตอบกลับที่มีเอกสาร การจัดการ HTTP และความปลอดภัยในการลองใหม่
- [ข้อกำหนด OpenAPI](https://www.sandbase.ai/docs/openapi.yaml): schema ที่เครื่องอ่านได้


## การผูกเวอร์ชันของ Skill กับ Agent {#agent-skill-version-bindings}

การบันทึก Agent จะปักหมุดการอ้างอิง Skill ใหม่แต่ละรายการไว้กับเวอร์ชันที่ระบุชัดเจน สำหรับการผูกใหม่ `version: null` จะเลือกค่าเริ่มต้นปัจจุบัน ณ เวลาที่บันทึก สำหรับการผูกที่มีอยู่แล้ว `version: null` จะคงเวอร์ชันที่ปักหมุดไว้ การเปลี่ยนค่าเริ่มต้นของ Skill จะไม่อัปเกรด Agent ที่บันทึกไว้หรือ Session ที่มีอยู่ ให้บันทึกเวอร์ชันที่ระบุชัดเจนบน Agent เพื่ออัปเกรด Session ในอนาคต
