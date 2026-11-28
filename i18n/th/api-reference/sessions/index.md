---
i18nSource: 99170a141af66587
title: Sessions API
description: รัน Agent เวอร์ชันที่บันทึกไว้ ส่ง input สตรีมอีเวนต์ และอ่านประวัติของ Session
---

# Sessions API {#sessions-api}

Session จะรัน [Agent](/api-reference/agents/) ที่บันทึกไว้หนึ่งเวอร์ชันบนคลาวด์ที่ SandBase โฮสต์ จึงไม่มีสภาพแวดล้อมการทำงานให้เลือก ID ของ Session ใช้คำนำหน้า `ses_` Sessions เป็นทรัพยากรย่อยของ Agents ทุกพาธจึงขึ้นต้นด้วย `/v1/agents/sessions`

การดำเนินการมาตรฐานเป็นไปตามโปรโตคอล OpenAI Agents (`client.beta.agents.sessions`) ดูสิ่งที่ SDK ทางการทำได้และทำไม่ได้ที่ [ความเข้ากันได้กับ OpenAI](/agents/openai-compatibility) ส่วนขยายของ SandBase เพิ่มการเปลี่ยนชื่อ สถานะการเก็บถาวร การยกเลิก ไฟล์แนบ เมทาดาทาของไฟล์ใน workspace อาร์ติแฟกต์ที่เปลี่ยนแปลงไม่ได้ และสตรีมของผลิตภัณฑ์ที่เชื่อมต่อใหม่ได้

::: info Sessions มาจากไหน
คุณสร้าง Session ได้โดยตรงด้วย `POST /v1/agents/sessions` Session จะรายงาน `source: "direct"` และ `source_id: null`
:::

## ขั้นตอนที่แนะนำ {#recommended-flow}

1. [สร้าง Session](./create) สำหรับ Agent ที่บันทึกไว้ Session จะตรึงเวอร์ชันของ Agent และการเชื่อมต่อ MCP ที่เลือกไว้ และใช้เวอร์ชันของ Skill ที่ตรึงไว้กับเวอร์ชันของ Agent นั้นอยู่แล้ว
2. [เปิดสตรีมอีเวนต์](./stream) ด้วย `GET /v1/agents/sessions/{session_id}/events` สตรีมนี้เป็นแบบสดเท่านั้น จึงต้องเปิดก่อนส่ง input
3. [ส่ง input](./send-events) ด้วย `POST /v1/agents/sessions/{session_id}/events` และอีเวนต์ `agent.session.input.message` การเรียกจะส่งคืน 202
4. อ่านผลลัพธ์จากสตรีม หรืออ่านภายหลังจาก [items](./items) และ [turns](./turns)

## การดำเนินการของ Session {#session-operations}

| เมธอด | พาธ | วัตถุประสงค์ |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [สร้าง Session](./create) |
| `GET` | `/v1/agents/sessions` | [แสดงรายการ Sessions](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [ดึงข้อมูล Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [แทนที่ metadata](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [เปลี่ยนชื่อ](./rename) ด้วย `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [ลบ](./delete) ซึ่งจะเก็บถาวร Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [ส่งอีเวนต์ input หรืออีเวนต์ยกเลิกหนึ่งรายการ](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [สตรีมอีเวนต์สด](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [แสดงรายการ items](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [แสดงรายการ turns](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [ดึงข้อมูล turn หนึ่งรายการ](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [ยกเลิก turn ที่กำลังทำงาน](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [เก็บถาวร](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [ยกเลิกการเก็บถาวร](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [เชื่อมต่อใหม่](./reconnect) หลังสตรีมหลุด |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [สตรีมแบบสแนปช็อตแล้วต่อด้วยสด](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [อัปโหลดไฟล์แนบ](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [แสดงรายการไฟล์แนบ](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [ดาวน์โหลดไฟล์แนบ](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [ลบไฟล์แนบ](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [แสดงรายการเมทาดาทาของไฟล์ใน workspace](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [แสดงรายการอาร์ติแฟกต์ที่เปลี่ยนแปลงไม่ได้](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [ดาวน์โหลดอาร์ติแฟกต์](./download-artifact) |

## ฟิลด์สถานะ {#status-fields}

- `status` คือสถานะการทำงาน: `idle`, `in_progress` หรือ `failed` ยังไม่รองรับเครื่องมือ function ที่ต้องใช้ผลลัพธ์จากไคลเอนต์ (`requires_action`) การอ่าน Session ในลักษณะนั้นจะส่งคืน `502 executor_contract_error`
- `lifecycle_status` เป็น `active` หรือ `archived` Session ที่ถูกเก็บถาวรจะปฏิเสธ input การอัปเดต metadata และสตรีม `DELETE` จะเก็บถาวร ส่วน `unarchive` จะกู้คืน
- `failure` เป็น `null` หรือออบเจ็กต์ที่มี `code`, `message`, `action` และบางครั้งมี `retryable`

| `failure.code` | ความหมาย | `action` ที่แนะนำ |
|---|---|---|
| `session_creation_rejected` | ชั้นการทำงานปฏิเสธ Session | `create_new_session` |
| `model_authentication_failed` | ผู้ให้บริการโมเดลปฏิเสธคีย์ | `create_session_with_updated_model_provider` |
| `model_rate_limited` | ผู้ให้บริการโมเดลกำลังจำกัดอัตราการเรียก (ลองใหม่ได้) | `retry_later` |
| `model_quota_exceeded` | บัญชีโมเดลไม่มีโควตาเหลือ | `check_model_account` |
| `context_limit_exceeded` | บทสนทนายาวเกินบริบทของโมเดล | `create_new_session` |
| `environment_connection_timeout` | สภาพแวดล้อมเชื่อมต่อไม่ทันเวลา (ลองใหม่ได้) | `retry_later` |
| `runtime_unavailable` | สภาพแวดล้อมการทำงานไม่พร้อมใช้งาน (ลองใหม่ได้) | `retry_later` |
| `model_request_failed` | คำขอไปยังโมเดลไม่เสร็จสมบูรณ์ | `inspect_history` |
| `model_configuration_rejected` | โมเดลหรือชั้นการทำงานปฏิเสธการกำหนดค่า | `create_session_with_updated_model_provider` |
| `execution_failed` | ความล้มเหลวที่ไม่มีสาเหตุสาธารณะที่เจาะจงกว่านี้ | `inspect_history` |

ผลลัพธ์ของรายการอาจมีแถวตัวยึดตำแหน่งที่มี `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` หรือ `session_snapshot_unavailable` เมื่ออ่าน Session แบบสดไม่ได้

## ข้อมูลรับรองของโมเดล {#model-credentials}

โดยค่าเริ่มต้น Session จะเรียกโมเดลด้วย SandBase API key เดียวกับที่ใช้สร้าง Session ส่ง `model_provider` เพื่อเลือกอย่างชัดเจน:

- `{"type": "sandbase"}` ใช้คีย์ที่เรียกอยู่ ไม่อนุญาตให้ใช้ `base_url`
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` เรียกเอนด์พอยต์ HTTPS ที่เข้ากันได้กับ OpenAI ของคุณเอง URL ต้องไม่มีข้อมูลรับรอง คิวรี หรือ fragment และ SandBase จะไม่ถอยกลับไปใช้คีย์ SandBase ของคุณเลย

`model_provider` เขียนได้อย่างเดียวและจะไม่ปรากฏในการตอบกลับ

## การตรวจสิทธิ์และข้อผิดพลาด {#admission-and-errors}

การสร้าง Session และการส่ง input จะตรวจสิทธิ์การทำงาน: `402 spending_limit_exceeded` เมื่อขีดจำกัดของคีย์หรือยอดเงินขององค์กรหมด `403 org_disabled` เมื่อองค์กรรัน Agents ไม่ได้ และ `503 admission_unavailable` เมื่อการตรวจสอบทำไม่สำเร็จ การอ่าน การยกเลิก และการเก็บถาวรจะไม่ถูกบล็อกเพราะยอดเงิน

การส่ง input อาจส่งคืน `409 session_input_pending` ด้วย (input ก่อนหน้ายังส่งไม่เสร็จ ให้รอและอย่าส่งซ้ำด้วยคีย์ใหม่), `409 session_input_expired` (ตรวจสอบประวัติก่อนส่งอีกครั้ง) หรือ `409 session_environment_unavailable` (รอหรือสร้าง Session ใหม่) ดู[ข้อผิดพลาด](/api-reference/errors#agents-platform-errors)

## การแบ่งหน้า {#pagination}

Sessions, items, turns และอาร์ติแฟกต์ใช้การแบ่งหน้าแบบ cursor (`limit` 1-100, `after`, `order`) ไฟล์แนบใช้การแบ่งหน้าแบบ offset (`limit` 1-100, `offset`)

ไฟล์ใน workspace ใช้การแบ่งหน้าแบบ `page` / `next` แทน ดู[แสดงรายการไฟล์ใน workspace](./list-workspace-files)
