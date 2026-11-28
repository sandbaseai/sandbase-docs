---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: สร้าง กำหนดเวอร์ชัน เก็บถาวร และโคลนการกำหนดค่า Agent ที่บันทึกไว้
---

# Agents API {#agents-api}

Agent คือการกำหนดค่าที่บันทึกไว้และมีการกำหนดเวอร์ชัน ประกอบด้วยโมเดล คำสั่ง runtime profile, Skills, การเชื่อมต่อ MCP และการตั้งค่าเอาต์พุต การสร้างหรืออัปเดต Agent จะไม่ทำให้ Agent ทำงาน ให้รัน Agent ใน [Session](/api-reference/sessions/)

Agents API เป็นไปตามโปรโตคอล OpenAI Agents (`client.beta.agents` ใน OpenAI Python SDK) เฮดเดอร์ `OpenAI-Beta` ไม่บังคับ แต่หากส่ง ค่าต้องเป็น `agents=v1` SandBase เพิ่มความสามารถด้านเวอร์ชัน การอัปเดตแบบ compare-and-set การเก็บถาวรและการกู้คืน และแค็ตตาล็อกสาธารณะ

## การดำเนินการกับ Agent {#agent-operations}

| เมธอด | พาธ | วัตถุประสงค์ |
|---|---|---|
| `POST` | `/v1/agents` | [สร้าง Agent](./create) เป็นเวอร์ชัน 1 |
| `GET` | `/v1/agents` | [แสดงรายการ Agent](./list) |
| `GET` | `/v1/agents/{agent_id}` | [ดู Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [อัปเดต Agent](./update) (อัปเดตบางส่วนแบบ SDK) |
| `PATCH` | `/v1/agents/{agent_id}` | [แทนที่ด้วย compare-and-set](./replace) บน `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [ลบ](./delete) ซึ่งจะเก็บถาวร Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [เก็บถาวร Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [ยกเลิกการเก็บถาวร Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [กู้คืนเวอร์ชันก่อนหน้า](./restore) เป็นเวอร์ชันใหม่ |
| `GET` | `/v1/agents/{agent_id}/versions` | [แสดงรายการเวอร์ชัน](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [ดูเวอร์ชันหนึ่งรายการ](./get-version) |
| `GET` | `/v1/agents/catalog` | [เรียกดูแค็ตตาล็อกสาธารณะ](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [โคลน Agent จากแค็ตตาล็อก](./catalog#clone-a-catalog-agent) ไปยังองค์กรของคุณ |

ID ของ Agent ขึ้นต้นด้วย `agt_` Request body ต้องเป็น JSON แบบเข้มงวดขนาดไม่เกิน 1 MiB ฟิลด์ที่ไม่รู้จักจะได้ 400

## เวอร์ชันและการอัปเดต {#versions-and-updates}

- การเขียนที่มีผลทุกครั้ง (create, update, replace, restore) จะสร้างเวอร์ชันที่เปลี่ยนแปลงไม่ได้ `version` คือหมายเลขเวอร์ชันปัจจุบัน
- `POST /v1/agents/{agent_id}` คือการอัปเดตแบบ OpenAI SDK ไม่ต้องใช้ `row_version` ดังนั้นผู้เขียนคนสุดท้ายจะเป็นผู้ชนะ
- `PATCH /v1/agents/{agent_id}` ต้องใช้ `row_version` ที่คุณอ่านล่าสุด และจะได้ 409 เมื่อมีผู้อื่นเปลี่ยน Agent ไปก่อน ให้ใช้วิธีนี้กับเอดิเตอร์และระบบอัตโนมัติที่อาจทำงานพร้อมกัน
- แต่ละ Session จะตรึงเวอร์ชันของ Agent เวอร์ชันของ Skill และการกำหนดค่าการเชื่อมต่อ MCP ที่ใช้ตอนเริ่มต้น

## ความพร้อมใช้งาน {#readiness}

เวอร์ชันที่เพิ่งเขียนจะแสดง `projection_status` ระหว่างที่กำลังเตรียมพร้อมสำหรับการทำงาน Session ต้องใช้ Agent ที่ active และมี `projection_status` เป็น `ready` มิฉะนั้นจะได้ 409 Agent ที่เก็บถาวรแล้วก็จะได้ 409 สำหรับการทำงานใหม่เช่นกัน

## ข้อจำกัดในปัจจุบัน {#current-limits}

- `tools` รับ `function` tool และ `web_search` tool ได้ไม่เกินหนึ่งรายการ ปัจจุบันการทำงานกำหนดให้ `web_search.mode` เป็น `disabled`
- สามารถบันทึก function tool ได้ แต่ Run ที่ขอให้ไคลเอนต์ส่งผลลัพธ์ของเครื่องมือกลับมา (`requires_action`) ยังไม่รองรับ และจะแสดงเป็น `502 executor_contract_error`
- ต้องละ `multi_agent` ไว้หรือกำหนดเป็น `null`

## การแบ่งหน้า {#pagination}

`GET /v1/agents` และแค็ตตาล็อกใช้การแบ่งหน้าแบบ cursor ได้แก่ `limit` (1-100 ค่าเริ่มต้น 20), `after` และ `order` (`asc` หรือ `desc` ค่าเริ่มต้น `desc`) response จะมี `object: "list"`, `data`, `has_more`, `first_id` และ `last_id` ให้ส่ง `last_id` เป็น `after` เพื่อรับหน้าถัดไป

`GET /v1/agents/{agent_id}/versions` ใช้การแบ่งหน้าแบบ offset ได้แก่ `limit` และ `offset` โดย response จะมี `data`, `total`, `limit` และ `offset`

## ข้อผิดพลาด {#errors}

ข้อผิดพลาดใช้ envelope ของ Agents `{"error":{"type","code","param":null,"message"}}` ดูรายการโค้ดได้ที่[ข้อผิดพลาด](/api-reference/errors#agents-platform-errors)
