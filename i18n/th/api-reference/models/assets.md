---
i18nSource: 43d08f60800d37f5
title: Media Assets API
description: ลงทะเบียน Assets สื่อที่นำกลับมาใช้ซ้ำได้ และดึงเมทาดาทาปัจจุบันพร้อม URL สำหรับดาวน์โหลด
---

# Media Assets API {#media-assets-api}

ใช้โปรโตคอล Asset ที่เข้ากันได้กับแบบทางการซึ่งเปิดให้ใช้ที่ `/v1/assets` เพื่อลงทะเบียน URL ของสื่อและรับ `asset_url` สำหรับ
คำขอสร้างวิดีโอแบบเนทีฟ

ดูตัวอย่างแบบครบวงจรที่ลงทะเบียนสื่อและใช้การอ้างอิง `asset://` ที่ได้รับกับ Seedance ได้ที่
[ใช้ Assets สื่อที่ลงทะเบียนไว้](/api-reference/volcengine-contents-generations#use-registered-media-assets) ในเอกสารอ้างอิง Seedance

## ภาพรวม {#overview}

| เมธอด | พาธ | คำอธิบาย |
|--------|------|-------------|
| `POST` | `/v1/assets` | ลงทะเบียน Asset |
| `GET` | `/v1/assets/{id}` | ดึงเมทาดาทาของ Asset และ URL สำหรับดาวน์โหลดปัจจุบัน |

## POST /v1/assets {#post-v1-assets}

ลงทะเบียน URL ของไฟล์ที่เข้าถึงได้แบบสาธารณะลงในคลัง Asset และส่งคืน `asset_url` ที่นำไปอ้างอิงในคำขอสร้างวิดีโอได้

### คำขอ {#request}

```http
POST /v1/assets
Authorization: Bearer $SANDBASE_API_KEY
Content-Type: application/json
```

```json
{
  "url": "https://example.com/tea-ad.mp4",
  "asset_type": "Video",
  "name": "Tea ad reference video"
}
```

| ฟิลด์ | ประเภท | บังคับ | คำอธิบาย |
|-------|------|----------|--------------|
| `url` | string | ใช่ | URL ของไฟล์ที่เข้าถึงได้แบบสาธารณะ |
| `asset_type` | string | ใช่ | ประเภท Asset: `Image` / `Video` / `Audio` (คำนึงถึงตัวพิมพ์เล็กใหญ่) |
| `name` | string | ไม่ | ชื่อ Asset (ไม่บังคับ) |

### การตอบกลับ {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| ฟิลด์ | คำอธิบาย |
|-------|--------------|
| `id` | ID ของระเบียนภายใน |
| `asset_url` | ที่อยู่อ้างอิงที่ใช้ในคำขอสร้างวิดีโอ |
| `asset_type` | ประเภท Asset |
| `name` | ชื่อ Asset |
| `created_at` | timestamp ที่สร้าง |

### การใช้ asset_url {#using-asset-url}

เมื่อลงทะเบียนแล้ว ให้ส่ง `asset_url` ไปยังฟิลด์ input ที่รับการอ้างอิง Asset ตามสคีมาปัจจุบันของโมเดลที่เลือก ชื่อฟิลด์แตกต่างกันไปตามโมเดล ตัวอย่างเช่น:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### ข้อผิดพลาด {#errors}

| สถานะ HTTP | คำอธิบาย |
|-------------|--------------|
| 400 | ไม่มีฟิลด์ที่บังคับ หรือ `asset_type` ไม่ถูกต้อง |
| 502 | การลงทะเบียน Asset กับต้นทางล้มเหลว |
| 500 | ไม่มีข้อมูลรับรองที่ใช้ได้ หรือเกิดข้อผิดพลาดภายใน |

---

## GET /v1/assets/{id}

ดึง URL สำหรับดาวน์โหลดที่มีลายเซ็นของ Asset ที่ลงทะเบียนไว้ด้วย ID ภายนอก ใช้สำหรับดูตัวอย่างหรือดาวน์โหลดไฟล์จริง

### คำขอ {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| พารามิเตอร์ | ตำแหน่ง | คำอธิบาย |
|-----------|----------|--------------|
| `id` | path | ID ภายนอก (ส่วนที่อยู่หลัง `asset://` ใน `asset_url`) |

### การตอบกลับ {#response-1}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "download_url": "https://cdn.example.com/...?X-Tos-Expires=43200",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| ฟิลด์ | คำอธิบาย |
|-------|--------------|
| `asset_url` | ที่อยู่อ้างอิงสำหรับการสร้างวิดีโอ (ถาวร) |
| `status` | สถานะวงจรชีวิตของ Asset ที่ผู้ให้บริการรายงาน ให้ถือเป็นสตริงแบบเปิด |
| `download_url` | URL สำหรับดาวน์โหลดที่ผู้ให้บริการส่งคืน อาจว่างเปล่าได้ขณะที่ Asset ยังไม่พร้อม |

### ข้อผิดพลาด {#errors-1}

| สถานะ HTTP | คำอธิบาย |
|-------------|--------------|
| 404 | ไม่พบ Asset หรือ Asset ไม่ได้เป็นขององค์กรของคุณ |
| 502 | การคิวรีต้นทางล้มเหลว |

---

## หมายเหตุ {#notes}

::: tip สำคัญ
- `asset_url` มีรูปแบบเป็น `asset://{external_id}` และเป็นการอ้างอิงที่นำกลับมาใช้ซ้ำได้สำหรับส่งไปยัง input ของโมเดลที่รองรับ
- ให้ถือว่า `download_url` จัดการโดยผู้ให้บริการ หากว่างเปล่าหรือใช้งานไม่ได้แล้ว ให้เรียกเอนด์พอยต์นี้อีกครั้งเพื่อรับค่าปัจจุบัน
- `asset_type` คำนึงถึงตัวพิมพ์เล็กใหญ่: `Image` / `Video` / `Audio`
- URL ที่ส่งต้องเข้าถึงได้แบบสาธารณะ (แพลตฟอร์มต้องดึงไฟล์ได้)
:::
