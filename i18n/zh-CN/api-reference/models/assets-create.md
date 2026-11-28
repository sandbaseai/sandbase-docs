---
i18nSource: 4916ed90816680e4
title: 注册 Asset
description: 将媒体 URL 注册为可复用的 SandBase Asset。
aside: false
outline: false
apiReference:
  title: 注册 Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: 注册一个可公开访问的媒体 URL，并获得持久的 asset:// 引用。
  groups:
    - title: 请求体
      fields:
        - name: url
          type: string
          required: true
          description: 非空的源 URL，会转发给 Asset 服务商。服务商必须能够获取该 URL。
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Asset 类型，区分大小写。
        - name: name
          type: string
          required: false
          description: 可选的显示名称。
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
