---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: รัน Agent ใน Session สตรีมอีเวนต์ อ่านประวัติ แนบไฟล์ และจัดการความล้มเหลว
---

# Sessions {#sessions}

**Session** จะรัน Agent เวอร์ชันที่บันทึกไว้หนึ่งเวอร์ชันบนคลาวด์ที่ SandBase โฮสต์ไว้ คุณไม่ต้องเลือกสภาพแวดล้อมการรัน ID ของ Session ขึ้นต้นด้วย `ses_` และพาธทั้งหมดของ Session อยู่ภายใต้ `/v1/agents/sessions` Session จะตรึงเวอร์ชันของ Agent, เวอร์ชันของ Skill และการกำหนดค่าการเชื่อมต่อ MCP ไว้ตามที่ใช้ตอนเริ่มต้น

## วิธีเริ่ม Session {#how-sessions-start}

สร้าง Session ด้วย `POST /v1/agents/sessions` โดย Session จะรายงาน `source: "direct"`

## รัน Session {#run-a-session}

สตรีมอีเวนต์แบบเนทีฟเป็นแบบ **สดเท่านั้น**: อีเวนต์จะไม่ถูกเล่นซ้ำหลังการเชื่อมต่อหลุด ให้เปิดสตรีมก่อนส่งอินพุต และอ่านประวัติจาก item หรือ turn

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

ขั้นตอนเดียวกันโดยใช้ OpenAI Python SDK อย่างเป็นทางการ เปิดสตรีมก่อน ส่งอินพุตจากอีกเธรดหนึ่ง แล้วหยุดเมื่อได้รับอีเวนต์สิ้นสุดของ turn ดูเวอร์ชัน Node.js และความแตกต่างของ SDK ได้ที่ [ความเข้ากันได้กับ OpenAI](/agents/openai-compatibility)

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

การส่งแต่ละครั้งมีอีเวนต์ได้หนึ่งรายการเท่านั้น `input` เป็นสตริงข้อความ หรืออาร์เรย์ที่มีข้อความของผู้ใช้หนึ่งรายการซึ่งมีส่วน `input_text` หนึ่งส่วนเท่านั้น: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]` รูปแบบอื่นจะได้ `400 invalid_request` หากต้องการหยุด turn ที่กำลังรัน ให้ส่ง `{"type": "agent.session.input.cancel"}` หรือเรียก `POST /v1/agents/sessions/{session_id}/cancel` พร้อม `Idempotency-Key` การยกเลิก Session ที่ว่างอยู่จะยังคงส่งคืน `202 {"accepted": true}` และไม่มีอะไรเปลี่ยนแปลง คุณยังส่ง `input` แรกตอนสร้าง Session ได้ด้วย แต่ไม่รองรับ `stream: true` ตอนสร้าง

## สถานะและความล้มเหลว {#status-and-failures}

| ฟิลด์ | ค่า | ความหมาย |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | สถานะการรันของ Session |
| `lifecycle_status` | `active`, `archived` | Session รับอินพุตได้หรือไม่ |
| `failure` | `null` หรือ `{code, message, action, retryable?}` | สาเหตุของความล้มเหลวที่เปิดเผยได้ และขั้นตอนถัดไปที่แนะนำ |

`failure.action` บอกว่าควรทำอะไรต่อ: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` หรือ `create_session_with_updated_model_provider` ดู[ตารางรหัสความล้มเหลว](/api-reference/sessions/#status-fields)

ยังไม่รองรับเครื่องมือฟังก์ชันที่ขอผลลัพธ์จากไคลเอนต์ (`requires_action`) การอ่าน Session ลักษณะนี้จะได้ `502 executor_contract_error`

หากการส่งได้ `409 session_input_pending` แสดงว่าอินพุตก่อนหน้ายังส่งไม่เสร็จ ให้รอแล้วอ่าน Session อย่าส่งซ้ำด้วย `Idempotency-Key` ใหม่ มิฉะนั้นอินพุตอาจถูกรันสองครั้ง

## การเก็บถาวร {#archive}

`DELETE /v1/agents/sessions/{session_id}` จะเก็บถาวร Session โดย Session จะไม่ถูกลบถาวร `POST /v1/agents/sessions/{session_id}/archive` และ `/unarchive` รับ `{"row_version": …}` Session ที่เก็บถาวรแล้วจะยังเก็บประวัติไว้ แต่จะปฏิเสธอินพุต การอัปเดตเมทาดาทา และสตรีม

## ไฟล์แนบ {#attachments}

อัปโหลดไฟล์ไปยัง workspace ของ Session ด้วย `POST /v1/agents/sessions/{session_id}/files` (ฟิลด์ multipart `file` ขนาดไม่เกิน 5 MiB และต้องมี `Idempotency-Key`) ชนิดไฟล์ที่รองรับคือ `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` และ `.webp` เมื่อ `status` ของไฟล์เป็น `ready` ให้ส่งไฟล์นั้นพร้อมไฟล์อื่นได้สูงสุดอีกเก้าไฟล์:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## การเชื่อมต่อไคลเอนต์ใหม่ {#reconnecting-clients}

ไคลเอนต์แบบเบราว์เซอร์ที่ต้องการมุมมองที่สอดคล้องกันหลังการเชื่อมต่อหลุดสามารถเรียก `POST /v1/agents/sessions/{session_id}/reconnect` ได้ ซึ่งจะส่งคืน Session และ `stream_url` สำหรับ `GET /v1/agents/sessions/{session_id}/events/stream` โดยสตรีมนี้จะส่ง `session.snapshot` ก่อน ตามด้วยอีเวนต์สดและ `heartbeat` หากสตรีมส่ง `stream.interrupted` ให้เชื่อมต่อใหม่อีกครั้งแทนการส่งอินพุตซ้ำ

## รีโพซิทอรี GitHub {#github-repository}

ส่ง `github_workspace` ตอนสร้างเพื่อโคลนรีโพซิทอรี GitHub ไปที่ `/workspace` และให้ Agent push ไปยังแบรนช์ของ Session เองได้ ดู [workspace รีโพซิทอรี GitHub](/agents/github-workspace)

## ข้อมูลรับรองของโมเดล {#model-credentials}

Session จะเรียกโมเดลด้วย API key ที่ใช้สร้าง Session นั้น เว้นแต่คุณจะส่ง `model_provider` ใช้ `{"type": "custom", "base_url": "https://…", "api_key": "…"}` เพื่อรันกับ endpoint HTTPS ที่เข้ากันได้กับ OpenAI ของคุณเอง `model_provider` เป็นฟิลด์แบบเขียนอย่างเดียว

## ID {#ids}

| คำนำหน้า | รีซอร์ส |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | การเชื่อมต่อ MCP |
| `sec_` | Secret |
| `fil_` | ไฟล์แนบของ Session |

ให้ถือว่า ID เป็นสตริงทึบ

## ขั้นตอนถัดไป {#next-steps}

- [ข้อมูลอ้างอิง Sessions API](/api-reference/sessions/)
- [ความเข้ากันได้กับ OpenAI](/agents/openai-compatibility)

## ไฟล์ใน workspace และ artifact ที่สร้างขึ้น {#workspace-files-and-generated-artifacts}

รีซอร์สทั้งสามนี้มีจุดประสงค์ต่างกัน:

| รีซอร์ส | ใช้สำหรับ | การแบ่งหน้า |
|---|---|---|
| [ไฟล์แนบ](/api-reference/sessions/list-files) | ไฟล์ที่คุณอัปโหลดและอ้างอิงในอินพุตได้ด้วย `file_id` | `limit` / `offset` |
| [ไฟล์ใน workspace](/api-reference/sessions/list-workspace-files) | พาธและขนาดของไฟล์ปัจจุบันในไดเรกทอรีของ workspace | `page` / `next` |
| [Artifact](/api-reference/sessions/list-artifacts) | เอาต์พุตที่สร้างขึ้นซึ่งแก้ไขไม่ได้และพร้อมให้ดาวน์โหลด | `after` / `last_id` |

แสดงรายการ artifact เพื่อรับ ID แบบ `art_` แล้วส่ง ID นั้นตรงตัวไปยัง [Download Artifact](/api-reference/sessions/download-artifact) พาธใน workspace หรือ `file_id` ของไฟล์แนบใช้แทนไม่ได้ การแสดงรายการ workspace ส่งคืนเฉพาะเมทาดาทาและไม่ใช่ API สำหรับดาวน์โหลดพาธใดก็ได้ Artifact ดาวน์โหลดได้เป็นไฟล์ที่สมบูรณ์ขนาดไม่เกิน 200 MiB และไม่รองรับการดาวน์โหลดบางส่วนด้วย `Range`
