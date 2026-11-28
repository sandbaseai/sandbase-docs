---
i18nSource: 4916ed90816680e4
title: Đăng ký Asset
description: Đăng ký một URL media thành SandBase Asset có thể tái sử dụng.
aside: false
outline: false
apiReference:
  title: Đăng ký Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: Đăng ký một URL media truy cập công khai và nhận tham chiếu asset:// lâu dài.
  groups:
    - title: Body của request
      fields:
        - name: url
          type: string
          required: true
          description: URL nguồn không rỗng, được chuyển tiếp đến nhà cung cấp Asset. Nhà cung cấp phải tải được URL này.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Loại asset, phân biệt chữ hoa chữ thường.
        - name: name
          type: string
          required: false
          description: Tên hiển thị tùy chọn.
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
