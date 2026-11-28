---
i18nSource: aebee42034285529
title: 获取 Asset
description: 获取 Asset 元数据和签名下载 URL。
aside: false
outline: false
apiReference:
  title: 获取 Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: 获取 Asset 元数据和临时签名下载 URL。
  groups:
    - title: 路径参数
      fields:
        - name: asset_id
          type: string
          required: true
          description: 外部 Asset ID，不含 asset:// 前缀。
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
    - title: 由服务商管理的 URL
      description: asset:// 值是可复用的 Asset 引用。download_url 由服务商管理，可能为空；如需获取当前值，请再次查询此端点。
---

<ApiReferencePage />
