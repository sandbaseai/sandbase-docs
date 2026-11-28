---
i18nSource: aebee42034285529
title: ดึงข้อมูล Asset
description: ดึงเมทาดาทาของ Asset และ URL สำหรับดาวน์โหลดที่มีลายเซ็น
aside: false
outline: false
apiReference:
  title: ดึงข้อมูล Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: ดึงเมทาดาทาของ Asset และ URL สำหรับดาวน์โหลดแบบชั่วคราวที่มีลายเซ็น
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: asset_id
          type: string
          required: true
          description: ID ภายนอกของ Asset โดยไม่มีคำนำหน้า asset://
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "external_id": "asset-20260710150403-hx4hf",
        "asset_url": "asset://asset-20260710150403-hx4hf",
        "status": "Active",
        "asset_type": "Video",
        "download_url": "https://cdn.example.com/signed-url",
        "created_at": "2026-07-10T15:04:03Z"
      }
  notes:
    - title: URL ที่ผู้ให้บริการจัดการ
      description: ค่า asset:// คือการอ้างอิง Asset ที่นำกลับมาใช้ซ้ำได้ ส่วน download_url จัดการโดยผู้ให้บริการและอาจว่างเปล่าได้ ให้เรียกเอนด์พอยต์นี้อีกครั้งเพื่อรับค่าปัจจุบัน
---

<ApiReferencePage />
