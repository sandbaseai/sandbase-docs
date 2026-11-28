---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: ลงทะเบียนเซิร์ฟเวอร์ MCP ระยะไกลแบบ HTTPS ที่ Agents เรียกใช้ได้
---

# MCP Connections API {#mcp-connections-api}

การเชื่อมต่อ MCP ใช้ลงทะเบียนเซิร์ฟเวอร์ MCP ระยะไกลที่เข้าถึงได้ผ่าน HTTPS โดย Agents อ้างอิงการเชื่อมต่อใน `mcp_connections` และแต่ละ Session จะตรึงการกำหนดค่าการเชื่อมต่อไว้เมื่อเริ่มต้น ID ของการเชื่อมต่อใช้คำนำหน้า `mcp_` หากต้องการยืนยันตัวตนกับเซิร์ฟเวอร์ด้วยโทเค็น Bearer ให้สร้าง [Secret](/agents/api-credentials#with-the-api) สำหรับ URL เดียวกันก่อน

| เมธอด | พาธ | วัตถุประสงค์ |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [สร้างการเชื่อมต่อ](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [แสดงรายการการเชื่อมต่อ](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [ดึงข้อมูลการเชื่อมต่อ](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [แทนที่การเชื่อมต่อ](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [เปิดใช้งานการเชื่อมต่อ](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [ปิดใช้งานการเชื่อมต่อ](#disable-a-connection) |

การเขียนทุกครั้งต้องมี `Idempotency-Key` (1-128 ไบต์ โดยไม่มีช่องว่างนำหน้าหรือต่อท้าย) ออบเจ็กต์การเชื่อมต่อมี `id`, `name`, `server_url`, `secret_id` (เมื่อตั้งค่าไว้), `status` (`active` หรือ `disabled`), `row_version`, `created_at` และ `updated_at`

## สร้างการเชื่อมต่อ {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` ต้องระบุและต้องไม่ว่าง ไม่เกิน 128 ไบต์
- `server_url` ต้องเป็น HTTPS โดยไม่มีข้อมูลผู้ใช้ query หรือ fragment (ไม่เกิน 2048 ไบต์)
- `secret_id` ไม่บังคับ ให้ละไว้สำหรับเซิร์ฟเวอร์แบบไม่ระบุตัวตน เมื่อตั้งค่าไว้ Secret ต้องเป็น `active` และ `server_url` ของ Secret ต้องตรงกับ `server_url` นี้ทุกตัวอักษร มิฉะนั้นคำขอจะล้มเหลว (409 สำหรับ Secret ที่ไม่ active และ 400 สำหรับ URL ที่ไม่ตรงกัน)

ส่งคืน `201 Created`

## แสดงรายการการเชื่อมต่อ {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

แบ่งหน้าด้วย offset โดยมี `data`, `total`, `limit` และ `offset` ค่าเริ่มต้นของ `limit` คือ 20 และสูงสุด 200 หากไม่ระบุ ไม่ถูกต้อง หรือไม่ใช่ค่าบวก จะใช้ 20 ค่าเริ่มต้นของ `offset` คือ 0 หากไม่ถูกต้องหรือไม่ใช่ค่าบวก จะใช้ 0 ให้เลื่อนไปทีละ `limit` ที่ส่งคืนจนกว่า `offset + data.length >= total` รีซอร์สที่ปิดใช้งานแล้วยังคงแสดงในรายการ

## ดึงข้อมูลการเชื่อมต่อ {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## แทนที่การเชื่อมต่อ {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` จะแทนที่ `name`, `server_url` และ `secret_id` พร้อมกัน การละ `secret_id` จะทำให้การเชื่อมต่อเป็นแบบไม่ระบุตัวตน ต้องระบุ `row_version` และต้องตรงกับค่าปัจจุบันที่ได้จาก Get Connection ส่งคืน `200 OK` พร้อมการเชื่อมต่อที่อัปเดตแล้ว การเชื่อมต่อที่ปิดใช้งานอยู่จะยังคงปิดใช้งานหลังการแทนที่จนกว่าคุณจะเปิดใช้งาน

## เปิดใช้งานการเชื่อมต่อ {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

ต้องระบุ `row_version` และต้องเป็นจำนวนเต็มบวกที่ตรงกับรีซอร์สปัจจุบัน ส่งคืน `200 OK` พร้อมการเชื่อมต่อ การเปิดใช้งานจะคง ID การเชื่อมต่อเดิมไว้ แต่จะไม่กู้คืน Secret ที่ถูกเพิกถอน ให้แทนที่การเชื่อมต่อด้วย Secret ใหม่ที่ active ก่อน

## ปิดใช้งานการเชื่อมต่อ {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

ส่งคืน `204 No Content` และตั้ง `status` เป็น `disabled` Session ใหม่จะใช้การเชื่อมต่อนี้ไม่ได้ และ Session ที่มีอยู่ซึ่งตรึงการเชื่อมต่อนี้ไว้จะปฏิเสธอินพุตเพิ่มเติม การเรียกเครื่องมือที่กำลังรันอยู่จะไม่ถูกขัดจังหวะ

## การเปลี่ยนแปลงและ Session ที่กำลังรัน {#changes-and-running-sessions}

Session จะตรึงการตั้งค่าการเชื่อมต่อไว้เมื่อเริ่มต้น หลังจากคุณแทนที่การเชื่อมต่อหรือหมุนเวียน Secret ของการเชื่อมต่อ Session ใหม่จะใช้การกำหนดค่าใหม่ ส่วน Session ที่มีอยู่จะใช้ snapshot เดิม การปิดใช้งานการเชื่อมต่อหรือการเพิกถอน Secret จะบล็อกทั้ง Session ใหม่และอินพุตเพิ่มเติมไปยัง Session ที่มีอยู่

## ข้อผิดพลาดและการลองใหม่ {#errors-and-retries}

ข้อผิดพลาดใช้[รูปแบบข้อผิดพลาดของ Agents](/api-reference/errors#agents-platform-errors) ฟิลด์ที่ไม่ถูกต้องหรือการไม่มี idempotency key สำหรับการเขียนจะได้ `400 invalid_request` รีซอร์สที่ไม่รู้จักหรือเข้าถึงไม่ได้จะได้ `404 not_found` ส่วน `row_version` ที่ล้าสมัย สถานะวงจรชีวิตที่ไม่เข้ากัน หรือการใช้คีย์สำหรับการสร้าง/อัปเดตซ้ำกับอินพุตที่ต่างกันจะได้ `409 conflict` ให้อ่านรีซอร์สใหม่อีกครั้งก่อนส่งการอัปเดตใหม่ และใช้คีย์ใหม่สำหรับการเขียนแต่ละครั้ง

`created_at` และ `updated_at` เป็นสตริง timestamp แบบ RFC 3339
