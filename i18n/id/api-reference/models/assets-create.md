---
i18nSource: 4916ed90816680e4
title: Daftarkan Asset
description: Daftarkan URL media sebagai Asset SandBase yang dapat digunakan ulang.
aside: false
outline: false
apiReference:
  title: Daftarkan Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: Daftarkan URL media yang dapat diakses publik dan terima referensi asset:// yang persisten.
  groups:
    - title: Body permintaan
      fields:
        - name: url
          type: string
          required: true
          description: URL sumber yang tidak kosong dan diteruskan ke penyedia Asset. Penyedia harus dapat mengambilnya.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Jenis asset, peka huruf besar-kecil.
        - name: name
          type: string
          required: false
          description: Nama tampilan opsional.
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
