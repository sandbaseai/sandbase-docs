---
i18nSource: d637409019c8109d
title: ความเข้ากันได้กับ OpenAI
description: ใช้ OpenAI SDK อย่างเป็นทางการกับ SandBase Agents, Sessions และ Skills พร้อมดูจุดที่ SandBase แตกต่างจาก OpenAI Agents API
---

# ความเข้ากันได้กับ OpenAI {#openai-compatibility}

SandBase Agents รองรับโปรโตคอล [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) สำหรับ Agents, Session, session event, item, turn และ Skills สำหรับรีซอร์สเหล่านี้ คุณใช้ OpenAI SDK อย่างเป็นทางการได้โดยตรง เพียงตั้ง `base_url` เป็น `https://api.sandbase.ai/v1` และส่ง API key ของ SandBase

การเชื่อมต่อ MCP, Secrets และแค็ตตาล็อกเป็นรีซอร์สเฉพาะของ SandBase โดย SDK ไม่มีเมธอดสำหรับรีซอร์สเหล่านี้ จึงต้องเรียกผ่าน HTTP (หรือใช้ `client.post` / `client.get` แบบทั่วไปของ SDK)

เวอร์ชัน SDK ที่ตรวจสอบแล้ว:

| SDK | เวอร์ชัน | หมายเหตุ |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` และ `sessions.traces` ไม่มีใน 3.13.0 |
| openai-node | 7.28.0 (Node.js 26) | ใช้ dispatcher แบบ HTTP/1.1 สำหรับการสตรีม ดู[ด้านล่าง](#node-js-and-http-2) |

## ตั้งค่าไคลเอนต์ {#set-up-the-client}

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],  # your SandBase API key
    base_url="https://api.sandbase.ai/v1",
)
```

```js [Node.js]
// npm install openai@7.28.0 undici
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY, // your SandBase API key
  baseURL: 'https://api.sandbase.ai/v1',
  // HTTP/1.1 keeps the live event stream and the input request on separate connections.
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})
```

:::

SDK จะส่ง `OpenAI-Beta: agents=v1` ให้อัตโนมัติ SandBase ยอมรับค่านี้หรือการไม่ส่งเฮดเดอร์เลย หากเป็นค่าอื่นจะได้ `400`

## รัน Agent ตั้งแต่ต้นจนจบ {#run-an-agent-end-to-end}

สร้าง Agent สร้าง Session เปิดสตรีมอีเวนต์แบบสด ส่งอินพุตหนึ่งรายการ แล้วอ่านประวัติ สตรีมเป็นแบบสดเท่านั้น จึงต้องเปิดก่อนส่งอินพุต

::: code-group

```python [Python]
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")

agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Keep output brief.",
    metadata={"team": "research"},
)
session = client.beta.agents.sessions.create(
    agent_id=agent.id,
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "Reply with exactly: ok"}]}],
        }],
        idempotency_key="research-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break

for item in client.beta.agents.sessions.items.list(session.id, order="asc", limit=100).data:
    print(item.type, getattr(item, "role", None))

# Clean up: both calls archive the resource.
client.beta.agents.sessions.delete(session.id)
client.beta.agents.delete(agent.id)
```

```js [Node.js]
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})

const agent = await client.beta.agents.create({
  model: 'deepseek/deepseek-v4-flash',
  name: 'Research assistant',
  instructions: 'Keep output brief.',
  metadata: { team: 'research' },
})
const session = await client.beta.agents.sessions.create({
  agent_id: agent.id,
  environment: { type: 'openai_hosted' }, // Required by the SDK types; SandBase always runs in its hosted cloud.
})

const stream = await client.beta.agents.sessions.events.stream(session.id)
const done = (async () => {
  for await (const event of stream) {
    console.log(event.type)
    if (/^agent\.session\.turn\.(completed|failed|cancelled)$/.test(event.type)) break
  }
})()

await client.beta.agents.sessions.events.create(session.id, {
  events: [{ type: 'agent.session.input.message', input: 'Reply with exactly: ok' }],
  'Idempotency-Key': 'research-input-1',
})
await done

const items = await client.beta.agents.sessions.items.list(session.id, { order: 'asc', limit: 100 })
for (const item of items.data) console.log(item.type, item.role)

// Clean up: both calls archive the resource.
await client.beta.agents.sessions.delete(session.id)
await client.beta.agents.delete(agent.id)
```

:::

`events.create` จะส่งคืน `202` โดยไม่มี body แต่ละคำขอมีอีเวนต์ได้หนึ่งรายการเท่านั้น การใช้ `Idempotency-Key` เดิมกับ body เดิมซ้ำจะไม่เริ่ม turn ที่สอง หากต้องการหยุด turn ที่กำลังรัน ให้ส่ง `{"type": "agent.session.input.cancel"}` เป็นอีเวนต์เดียว

### Node.js และ HTTP/2 {#node-js-and-http-2}

`fetch` ของ Node.js 26 อาจเจรจาใช้ HTTP/2 กับ SandBase API หากเป็นเช่นนั้น บนการเชื่อมต่อ HTTP/2 ที่ใช้ร่วมกัน `events.create` อาจค้างระหว่างที่ `events.stream` เปิดอยู่บนการเชื่อมต่อเดียวกันจนกว่าสตรีมจะปิด การใช้ dispatcher ของ `undici` ที่ตั้ง `allowH2: false` ตามตัวอย่างด้านบนจะช่วยหลีกเลี่ยงปัญหานี้ ส่วน Python SDK ใช้ HTTP/1.1 เป็นค่าเริ่มต้นจึงไม่ต้องแก้ไขใดๆ

## ใช้ Skills กับ SDK {#skills-with-the-sdk}

`client.skills` ทำงานเหมือนใน OpenAI ยกเว้นว่าไม่สามารถลบ Skill ทีละเวอร์ชันได้ ไฟล์ ZIP ต้องมีโฟลเดอร์ระดับบนสุดหนึ่งโฟลเดอร์ที่มี `SKILL.md` อยู่ภายใน (`zip -r release-notes.zip release-notes/`) หาก `SKILL.md` อยู่ที่รากของ ZIP จะได้ `400 invalid_request`

::: code-group

```python [Python]
with open("release-notes.zip", "rb") as bundle:
    skill = client.skills.create(files=[("release-notes.zip", bundle.read(), "application/zip")])
print(skill.id, skill.default_version)

zip_bytes = client.skills.content.retrieve(skill.id).read()
```

```js [Node.js]
import fs from 'node:fs'

const skill = await client.skills.create({ files: fs.createReadStream('release-notes.zip') })
console.log(skill.id, skill.default_version)

const zip = Buffer.from(await (await client.skills.content.retrieve(skill.id)).arrayBuffer())
```

:::

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` และ `skills.delete` ก็ใช้งานได้เช่นกัน Skill ที่ถูกอ้างอิงโดย Agent เวอร์ชันใดก็ตามจะลบไม่ได้ (`409`) ให้ตั้ง `status` เป็น `disabled` ด้วย Update Skill แทน

## ใช้การเชื่อมต่อ MCP กับ SDK {#mcp-connections-with-the-sdk}

OpenAI ประกาศเซิร์ฟเวอร์ MCP แบบอินไลน์เป็น `tools: [{"type": "mcp", ...}]` แต่ SandBase จะส่งคืน `400` สำหรับรูปแบบนี้ ให้ลงทะเบียนเซิร์ฟเวอร์ครั้งเดียวด้วย [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) แล้วอ้างอิงจาก `mcp_connections` ของ Agent เมธอดคำขอแบบทั่วไปและฟิลด์ body เพิ่มเติมของ SDK รองรับทั้งสองขั้นตอน:

::: code-group

```python [Python]
import uuid

connection = client.post(
    "/mcp-connections",
    cast_to=object,
    body={"name": "DeepWiki", "server_url": "https://mcp.deepwiki.com/mcp"},
    options={"headers": {"Idempotency-Key": str(uuid.uuid4())}},  # Use a new key per create; reusing one returns the original (possibly disabled) connection.
)
agent = client.beta.agents.update(
    agent.id,
    extra_body={"mcp_connections": [
        {"connection_id": connection["id"], "server_label": "deepwiki", "allowed_tools": None, "required": False},
    ]},
)
```

```js [Node.js]
const connection = await client.post('/mcp-connections', {
  body: { name: 'DeepWiki', server_url: 'https://mcp.deepwiki.com/mcp' },
  headers: { 'Idempotency-Key': crypto.randomUUID() }, // Use a new key per create; reusing one returns the original (possibly disabled) connection.
})
await client.beta.agents.update(agent.id, {
  mcp_connections: [
    { connection_id: connection.id, server_label: 'deepwiki', allowed_tools: null, required: false },
  ],
})
```

:::

การเรียกใน Node.js ส่ง `mcp_connections` ด้วย JavaScript ธรรมดา ใน TypeScript ฟิลด์นี้ไม่ได้อยู่ในชนิดข้อมูลของ SDK โทเค็น Bearer สำหรับเซิร์ฟเวอร์ MCP จะถูกจัดเก็บเป็น [Secrets](/agents/api-credentials) ไม่ใช่ vault ของ OpenAI

## สภาพแวดล้อมการรัน {#execution-environment}

SandBase รันทุก Session บนคลาวด์ที่โฮสต์ไว้ จึงไม่มีสภาพแวดล้อมให้เลือกหรือจัดการ

- การเรียก HTTP โดยตรงไม่ต้องใส่ `environment`
- OpenAI SDK กำหนดให้ต้องมีอาร์กิวเมนต์ `environment` ใน `sessions.create` (Python จะเกิด `TypeError` หากไม่ใส่ และชนิดข้อมูลของ Node.js ก็กำหนดให้ต้องมี) ให้ส่ง `{"type": "openai_hosted"}` ซึ่ง SandBase ยอมรับ ค่าอื่นๆ เช่น `self_hosted` จะได้ `400`
- การตอบกลับของ Session มีออบเจ็กต์ `environment` เพื่อความเข้ากันได้กับ SDK คุณไม่จำเป็นต้องอ่านหรือดำเนินการใดๆ กับออบเจ็กต์นี้

## สรุปความเข้ากันได้ {#compatibility-at-a-glance}

| ส่วน | สถานะ | รายละเอียด |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | เข้ากันได้ พร้อมส่วนขยาย | การตอบกลับมี `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` และอื่นๆ เพิ่มเติม `delete` จะเก็บถาวร Agent และส่งคืน `agent.deleted` |
| `beta.agents.sessions.create / retrieve / update / list / delete` | เข้ากันได้ โดยมีข้อจำกัด | รับ `agent_id` ที่บันทึกไว้ `agent` แบบอินไลน์ หรือทั้งสองอย่าง `agent` รับ `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` และ `multi_agent` `stream=True` จะสตรีม turn แรกและต้องมี `input` เริ่มต้น `update` รับเฉพาะ `metadata` `delete` จะเก็บถาวร Session |
| `sessions.events.stream` | เข้ากันได้ | แบบสดเท่านั้นเหมือน OpenAI `Last-Event-ID` หรือ `?after=` จะได้ `400` |
| `sessions.events.create` | เข้ากันได้ โดยมีข้อจำกัด | อีเวนต์ `agent.session.input.message` หรือ `agent.session.input.cancel` ได้หนึ่งรายการต่อคำขอเท่านั้น ข้อความต้องมีส่วน `input_text` ของผู้ใช้หนึ่งส่วนหรือเป็นสตริงธรรมดา |
| `sessions.items.list`, `sessions.turns.list / retrieve` | เข้ากันได้ | แบ่งหน้าด้วย cursor โดยใช้ `limit` 1-100, `after`, `order` |
| `client.skills` และ `skills.versions` | เข้ากันได้ ยกเว้นการลบเวอร์ชัน | `skills.versions.delete` จะส่งคืน `404` |
| รูปแบบข้อผิดพลาด | เข้ากันได้ | `{"error": {"type", "code", "param", "message"}}` โดย exception ของ SDK แสดงข้อมูลนี้เป็น `exc.body` |
| เวอร์ชันของ Agent, การกู้คืน, การเก็บถาวร, แค็ตตาล็อก, การเปลี่ยนชื่อ/เก็บถาวร/เชื่อมต่อใหม่/ไฟล์/ไฟล์ใน workspace/artifact ของ Session | เฉพาะ SandBase | ดูข้อมูลอ้างอิง API ของ [Agents](/api-reference/agents/) และ [Sessions](/api-reference/sessions/) |
| การเชื่อมต่อ MCP, Secrets | เฉพาะ SandBase | ใช้ HTTP หรือ `client.post` / `client.get` |

SandBase เปิดให้ใช้ [การแสดงรายการ artifact](/api-reference/sessions/list-artifacts) และ [การดาวน์โหลดเนื้อหา](/api-reference/sessions/download-artifact) ผ่าน HTTP โดย ID ของ artifact เป็นค่าทึบและอยู่ในขอบเขตของ Session สิ่งนี้ไม่ได้หมายความว่ารองรับเมธอด artifact ทุกตัวของ SDK และไม่มี endpoint สำหรับเมทาดาทาของ artifact แยกต่างหาก

### สิ่งที่ไม่รองรับ {#not-supported}

การเรียก OpenAI SDK ต่อไปนี้จะล้มเหลวเมื่อใช้กับ SandBase ข้อความที่แสดงคือ `error.message` ที่ส่งคืนจริง

| การเรียก SDK | ผลลัพธ์ |
|---|---|
| `sessions.create(..., stream=True)` โดยไม่มี `input` เริ่มต้น | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` ที่มีฟิลด์อื่นนอกจาก `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` และ `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 ไม่มีพารามิเตอร์ `agent` และจะเกิด `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])` รวมถึงเครื่องมือ `tool_search`, `programmatic_tool_calling` และ `computer_use` | `400 invalid_request` ยอมรับเฉพาะเครื่องมือ `function` และ `web_search` หนึ่งรายการ |
| `events.create` ที่มีอีเวนต์ `tool_result` หรืออีเวนต์อนุมัติ computer-use | `400 invalid_request` ไม่รองรับ Session ที่เข้าสู่สถานะ `requires_action` |
| `events.create` ที่มีอีเวนต์มากกว่าหนึ่งรายการ | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 ไม่มี `traces`) |
| `beta.agents.vaults` | `404` พร้อม body เป็นข้อความธรรมดา (`404 page not found`) ไม่ใช่รูปแบบข้อผิดพลาด JSON |
| `skills.versions.delete` | `404 not_found` |

### ความแตกต่างของฟิลด์ {#field-differences}

- Session รายงานความล้มเหลวใน `failure` (`{code, message, action, retryable?}`) ไม่ใช่ `error` แบบ OpenAI เมื่อใช้ SDK ค่า `session.error` จะเป็น `None` ให้อ่าน `session.failure` แทน
- `required_actions` และ `vault_ids` เป็นอาร์เรย์ว่างเสมอ
- timestamp ของ Agent และ Session เป็นวินาทีแบบ Unix ส่วน `created_at` ของเวอร์ชัน Agent, การเชื่อมต่อ MCP และ Secrets ใช้สตริง ISO 8601
- `402 spending_limit_exceeded` ไม่มีคลาส exception เฉพาะใน SDK แต่จะแสดงเป็น `APIStatusError` ทั่วไป
- เมธอดที่ไม่รองรับบนพาธที่รู้จัก (เช่น `PUT` บน `/v1/agents`) จะส่งคืน `404` พร้อมรูปแบบข้อผิดพลาด JSON ไม่ใช่ `405`

## ขั้นตอนถัดไป {#next-steps}

- [Sessions](/agents/sessions)
- [Skills และเครื่องมือ MCP](/agents/mcp-tools)
- [ข้อมูลอ้างอิง Agents API](/api-reference/agents/)
