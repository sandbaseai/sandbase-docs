---
i18nSource: 4916ed90816680e4
title: 註冊 Asset
description: 將媒體 URL 註冊為可重複使用的 SandBase Asset。
aside: false
outline: false
apiReference:
  title: 註冊 Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: 註冊可公開存取的媒體 URL，並取得永久的 asset:// 參照。
  groups:
    - title: 請求本文
      fields:
        - name: url
          type: string
          required: true
          description: 轉送給 Asset 供應商的非空白來源 URL。供應商必須能夠擷取該 URL。
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: 區分大小寫的 Asset 類型。
        - name: name
          type: string
          required: false
          description: 選用的顯示名稱。
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
