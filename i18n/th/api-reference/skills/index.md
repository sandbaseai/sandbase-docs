---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: อัปโหลดชุด Skill ที่มีการกำหนดเวอร์ชันและแนบเข้ากับ Agent
---

# Skills API {#skills-api}

Skill คือชุด ZIP ของคำสั่งและรีซอร์สที่มีการกำหนดเวอร์ชัน ซึ่ง Agent สามารถ mount ได้ ID ของ Skill ขึ้นต้นด้วย `skl_` และตัวระบุเวอร์ชันเป็นสตริง เช่น `"1"`

## การดำเนินการกับ Skill {#skill-operations}

| เมธอด | พาธ | วัตถุประสงค์ |
|---|---|---|
| `POST` | `/v1/skills` | [สร้าง Skill](./create) จากการอัปโหลด ZIP |
| `GET` | `/v1/skills` | [แสดงรายการ Skill](./list) |
| `GET` | `/v1/skills/{skill_id}` | [ดู Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [อัปเดต](./update) เวอร์ชันเริ่มต้น สถานะ หรือ metadata |
| `DELETE` | `/v1/skills/{skill_id}` | [ลบ Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | ดาวน์โหลด ZIP ของเวอร์ชันเริ่มต้น |
| `GET` | `/v1/skills/{skill_id}/versions` | [แสดงรายการเวอร์ชัน](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [อัปโหลดเวอร์ชัน](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [ดูเวอร์ชัน](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | ดาวน์โหลด ZIP ของเวอร์ชัน |
| `GET` | `/v1/skills/catalog` | [เรียกดู Skill สาธารณะ](./catalog) |

## ตั้งค่าภายในห้านาที {#five-minute-setup}

1. สร้างโฟลเดอร์ที่มี `SKILL.md` ซึ่ง frontmatter กำหนด `name` และ `description`:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. บีบอัดเป็น ZIP (`zip -r release-notes.zip release-notes/`) ไฟล์เก็บถาวรต้องมีขนาดไม่เกิน 5 MiB
3. อัปโหลดเป็น multipart part เดียวชื่อ `files`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. อ้างอิง Skill จาก Agent ด้วย [อัปเดต Agent](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

เมื่อแนบ Skill เป็นครั้งแรก `"version": null` (หรือการไม่ระบุ `version`) จะ resolve เป็น `default_version` ปัจจุบันของ Skill ณ ตอนที่บันทึก Agent โดย Agent ที่บันทึกแล้วจะมีเวอร์ชันที่ระบุชัดเจน การเปลี่ยนค่าเริ่มต้นของ Skill จะไม่อัปเกรด Agent ที่มีอยู่ หากต้องการอัปเกรด ให้อัปเดตอาร์เรย์ `skills` ของ Agent ด้วยเวอร์ชันที่ระบุชัดเจน เช่น `"2"` การส่ง `null` สำหรับการผูกที่มีอยู่แล้วจะคงเวอร์ชันที่ตรึงไว้ แต่ละ Session จะใช้เวอร์ชันของ Agent ที่บันทึกไว้ และแสดง Skills ที่ resolve แล้วใน `environment.skills`

Agent หนึ่งรายการรองรับ Skill ได้สูงสุด 32 รายการ ID และชื่อของ Skill ต้องไม่ซ้ำกันภายในรายการที่เลือก

## เวอร์ชัน {#versions}

- การอัปโหลดไปยัง `POST /v1/skills/{skill_id}/versions` จะเพิ่มเวอร์ชันถัดไป ส่งฟิลด์ฟอร์ม `default=true` เพื่อตั้งเป็นค่าเริ่มต้น
- `POST /v1/skills/{skill_id}` พร้อม `default_version` จะสลับค่าเริ่มต้นโดยไม่ต้องอัปโหลด
- `status` เป็น `active` หรือ `disabled` Session ใหม่ของ Agent ที่อ้างอิง Skill ที่ปิดใช้งานจะล้มเหลวด้วย `400 skill_not_found` ส่วน Session ที่ตรึงเวอร์ชันไว้แล้วจะยังคงใช้เวอร์ชันนั้น
- Skill ที่มีเวอร์ชันของ Agent ใดอ้างอิงอยู่จะลบไม่ได้ (409) ให้ปิดใช้งานแทน การนำ Skill ออกจากเวอร์ชันล่าสุดของ Agent จะไม่ลบการอ้างอิงในเวอร์ชันย้อนหลัง

## การแบ่งหน้าและข้อผิดพลาด {#pagination-and-errors}

รายการใช้การแบ่งหน้าแบบ cursor ด้วย `limit` 0-100, `after` และ `order` ข้อผิดพลาดใช้ [envelope ข้อผิดพลาดของ Agents](/api-reference/errors#agents-platform-errors)

## ดาวน์โหลดชุด Skill {#download-a-bundle}

endpoint สำหรับเนื้อหาจะส่งคืน `application/zip` ไม่ใช่ JSON ให้บันทึก response ลงไฟล์:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

ใช้ `/v1/skills/{skill_id}/content` สำหรับเวอร์ชันเริ่มต้นปัจจุบัน สำหรับชุด Skill ในแค็ตตาล็อกสาธารณะ ให้ใช้ `/v1/skills/catalog/{skill_id}/versions/{version}/content`

รายการเวอร์ชันใช้พารามิเตอร์ cursor เดียวกับรายการ Skill ให้ส่ง `last_id` ที่ได้รับ (เช่น `skl_…:2`) เป็น `after` อย่าส่งเพียงหมายเลขเวอร์ชัน
