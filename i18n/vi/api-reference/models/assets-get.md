---
i18nSource: aebee42034285529
title: Lấy Asset
description: Lấy metadata của Asset và URL tải xuống đã ký.
aside: false
outline: false
apiReference:
  title: Lấy Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Lấy metadata của Asset và URL tải xuống đã ký tạm thời.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: asset_id
          type: string
          required: true
          description: ID Asset bên ngoài, không có tiền tố asset://.
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
    - title: URL do nhà cung cấp quản lý
      description: Giá trị asset:// là tham chiếu Asset có thể tái sử dụng. download_url do nhà cung cấp quản lý và có thể rỗng; hãy truy vấn lại endpoint này để lấy giá trị hiện tại.
---

<ApiReferencePage />
