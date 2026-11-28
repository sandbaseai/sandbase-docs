---
i18nSource: 4916ed90816680e4
title: ลงทะเบียน Asset
description: ลงทะเบียน URL ของสื่อเป็น SandBase Asset ที่นำกลับมาใช้ซ้ำได้
aside: false
outline: false
apiReference:
  title: ลงทะเบียน Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: ลงทะเบียน URL ของสื่อที่เข้าถึงได้แบบสาธารณะ และรับการอ้างอิง asset:// แบบถาวร
  groups:
    - title: Request body
      fields:
        - name: url
          type: string
          required: true
          description: URL ต้นทางที่ไม่ว่าง ซึ่งจะส่งต่อไปยังผู้ให้บริการ Asset โดยผู้ให้บริการต้องดึงข้อมูลจาก URL นี้ได้
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: ประเภท asset (แยกตัวพิมพ์เล็ก-ใหญ่)
        - name: name
          type: string
          required: false
          description: ชื่อที่แสดง (ไม่บังคับ)
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/assets \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "url": "https://example.com/tea-ad.mp4",
            "asset_type": "Video",
            "name": "Tea ad reference video"
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "asset_url": "asset://asset-20260710150403-hx4hf",
        "asset_type": "Video",
        "name": "Tea ad reference video",
        "created_at": "2026-07-10T15:04:03Z"
      }
---

<ApiReferencePage />
