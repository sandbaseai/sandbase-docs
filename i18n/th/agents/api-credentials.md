---
i18nSource: dab112fdbbc56799
title: ข้อมูลรับรองสำหรับเครื่องมือ MCP
description: เก็บ Bearer token แบบเขียนได้อย่างเดียวเป็น Secret เพื่อให้ Agent เรียกใช้เซิร์ฟเวอร์ MCP ที่ต้องยืนยันตัวตนได้
---

# ข้อมูลรับรองสำหรับเครื่องมือ MCP {#credentials-for-mcp-tools}

เมื่อเซิร์ฟเวอร์ MCP ต้องการการยืนยันตัวตน ให้เก็บ Bearer token ของเซิร์ฟเวอร์นั้นเป็น **Secret** แล้วแนบ Secret เข้ากับ [การเชื่อมต่อ MCP](/agents/mcp-tools#mcp-connections) สภาพแวดล้อมการทำงานจะส่งโทเค็นไปยังเซิร์ฟเวอร์นั้นเท่านั้น

## Secret ทำงานอย่างไร {#how-secrets-work}

- `kind` เป็น `mcp_bearer` เสมอ ซึ่งหมายถึง Bearer token สำหรับเซิร์ฟเวอร์ MCP หนึ่งเซิร์ฟเวอร์
- Secret แต่ละรายการผูกกับ `server_url` ที่ตรงกันทุกตัวอักษรเพียงค่าเดียว การเชื่อมต่อจะใช้ Secret ได้ก็ต่อเมื่อ `server_url` ตรงกันเท่านั้น หากต้องการใช้ URL อื่น ให้สร้าง Secret ใหม่
- โทเค็นเป็นแบบเขียนได้อย่างเดียว API จะส่งคืนชื่อ, URL, สถานะ และ `row_version` ของ Secret แต่จะไม่ส่งคืนโทเค็น
- Secret ไม่ใช่ตัวแปรสภาพแวดล้อม Secret จะไม่ถูกแทรกเข้าไปในรันไทม์ของ Agent และ Agent ไม่สามารถอ่าน Secret ได้

SandBase เวอร์ชันก่อนหน้าเก็บข้อมูลรับรองในขอบเขตของเวิร์กสเปซหรือ Agent และแทรกเป็นตัวแปรสภาพแวดล้อม เช่น `GITHUB_TOKEN` รูปแบบดังกล่าวเลิกใช้แล้วและจะไม่มีการย้ายข้อมูลเดิม ให้สร้างค่าที่ยังต้องใช้ใหม่เป็น Secret บนการเชื่อมต่อ MCP

## การใช้งานผ่าน API {#with-the-api}
สร้าง หมุนเวียน และเพิกถอน Secret ผ่าน API คู่มือนี้คือข้อกำหนดของ API ส่วนหน้า Credentials ใน Console ที่เปิดจากตัวแก้ไข Agent ไม่ใช่เอกสารอ้างอิงสำหรับพฤติกรรมของ Secret ให้เรียก endpoint เหล่านี้จากแบ็กเอนด์ที่เชื่อถือได้เท่านั้น ห้ามเรียกจากโค้ดฝั่งเบราว์เซอร์ เพราะต้องใช้ SandBase API key และโทเค็นแบบข้อความธรรมดา

| เมธอด | พาธ | วัตถุประสงค์ |
|---|---|---|
| `POST` | `/v1/secrets` | [สร้าง Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [แสดงรายการ Secret](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [ดึงข้อมูล Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [หมุนเวียนโทเค็น](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [เพิกถอน Secret](#revoke-a-secret) |

การเขียนทุกครั้งต้องมี `Idempotency-Key` (1-128 ไบต์ ไม่มีช่องว่างนำหน้าหรือต่อท้าย) ออบเจ็กต์ Secret มี `id` (ขึ้นต้นด้วย `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` และ `updated_at` โดย `status` จะเป็น `pending` ระหว่างที่กำลังจัดเก็บโทเค็น เป็น `active` เมื่อพร้อมใช้งาน และเป็น `disabled` หลังจากถูกเพิกถอน ส่วน `created_at` และ `updated_at` เป็นสตริงเวลาตามรูปแบบ RFC 3339

### สร้าง Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` ต้องเป็น `mcp_bearer`
- `server_url` ต้องเป็น HTTPS และไม่มีข้อมูลผู้ใช้, query หรือ fragment โดย Secret จะใช้ได้กับ URL นี้เท่านั้น
- ต้องระบุ `name` และ `token` และต้องไม่เว้นว่าง `name` ยาวได้สูงสุด 128 ไบต์ `token` สูงสุด 16384 ไบต์ และ `server_url` สูงสุด 2048 ไบต์

การตอบกลับคือ `201 Created` โดยไม่มีโทเค็น ให้ใช้ ID ที่ขึ้นต้นด้วย `sec_` เป็น `secret_id` เมื่อคุณ[สร้างการเชื่อมต่อ MCP](/api-reference/mcp-connections/#create-a-connection)

### แสดงรายการ Secret {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

ใช้การแบ่งหน้าแบบ offset ที่มี `data`, `total`, `limit` และ `offset` ค่าเริ่มต้นของ `limit` คือ 20 และสูงสุด 200 หากไม่ระบุ ไม่ถูกต้อง หรือไม่เป็นค่าบวก จะใช้ 20 ค่าเริ่มต้นของ `offset` คือ 0 หากไม่ถูกต้องหรือไม่เป็นค่าบวก จะใช้ 0 ให้เลื่อนไปทีละ `limit` ที่ได้รับกลับมาจนกว่า `offset + data.length >= total` Secret ที่ถูกปิดใช้งานยังคงแสดงอยู่ในรายการ

### ดึงข้อมูล Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### หมุนเวียน Secret {#rotate-a-secret}

ตั้งค่า `SECRET_ROW_VERSION` เป็น `row_version` ล่าสุดที่ได้จากการดึงข้อมูล Secret

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

การหมุนเวียนจะแทนที่โทเค็นโดยคง Secret และ `server_url` เดิมไว้ ต้องระบุ `token` และ `row_version` ที่เป็นจำนวนเต็มบวก Secret ต้องอยู่ในสถานะ `active` และ `row_version` ต้องตรงกับค่าล่าสุด การตอบกลับคือ `201 Created` Session ใหม่จะใช้โทเค็นใหม่ ส่วน Session ที่เริ่มไปแล้วจะใช้ข้อมูลรับรองที่ตรึงไว้ตอนเริ่มต่อไป

### เพิกถอน Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

การตอบกลับคือ `204 No Content` และตั้งค่า `status` เป็น `disabled` การเชื่อมต่อที่ใช้ Secret นี้จะหยุดทำงานสำหรับ Session ใหม่และสำหรับอินพุตเพิ่มเติมใน Session ที่มีอยู่ การเพิกถอนไม่สามารถยกเลิกได้ ให้สร้าง Secret ใหม่แล้วแทนที่การเชื่อมต่อ

### ข้อผิดพลาดและการลองใหม่ {#errors-and-retries}

ข้อผิดพลาดใช้ [รูปแบบข้อผิดพลาดของ Agents](/api-reference/errors#agents-platform-errors) ฟิลด์ที่ไม่ถูกต้องหรือการเขียนที่ไม่มี idempotency key จะได้ `400 invalid_request` ส่วน Secret ที่ไม่รู้จักหรือเข้าถึงไม่ได้จะได้ `404 not_found` หาก `row_version` ล้าสมัย สถานะวงจรชีวิตไม่เข้ากัน หรือใช้คีย์สร้างซ้ำกับอินพุตที่ต่างกัน จะได้ `409 conflict` ให้อ่าน Secret อีกครั้งก่อนลองใหม่ และใช้คีย์ใหม่สำหรับการเขียนใหม่ทุกครั้ง

## ความปลอดภัย {#security}

- สร้างและหมุนเวียน Secret จากแบ็กเอนด์ที่เชื่อถือได้ ห้ามทำจากโค้ดฝั่งเบราว์เซอร์
- อ่านโทเค็นจากที่เก็บความลับหรือสภาพแวดล้อมของคุณเอง เช่น `$GITHUB_MCP_TOKEN` ข้างต้น แทนการวางโทเค็นลงในสคริปต์
- อย่าใส่โทเค็นไว้ในคำสั่ง, อินพุตของ Session, metadata และชุด Skill
- เพิกถอน Secret ทันทีที่โทเค็นอาจรั่วไหล จากนั้นสร้าง Secret ใหม่และแทนที่การเชื่อมต่อ

## ขั้นตอนถัดไป {#next-steps}

- [Skills และเครื่องมือ MCP](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
