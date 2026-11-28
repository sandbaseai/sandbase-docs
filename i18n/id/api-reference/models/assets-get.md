---
i18nSource: aebee42034285529
title: Mendapatkan Asset
description: Ambil metadata Asset dan URL unduhan bertanda tangan.
aside: false
outline: false
apiReference:
  title: Mendapatkan Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Ambil metadata Asset dan URL unduhan bertanda tangan sementara.
  groups:
    - title: Parameter path
      fields:
        - name: asset_id
          type: string
          required: true
          description: ID Asset eksternal, tanpa prefiks asset://.
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
    - title: URL yang dikelola penyedia
      description: Nilai asset:// adalah referensi Asset yang dapat digunakan ulang. download_url dikelola oleh penyedia dan bisa kosong; kueri endpoint ini lagi untuk mendapatkan nilai terkininya.
---

<ApiReferencePage />
