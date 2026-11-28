---
i18nSource: aebee42034285529
title: 取得 Asset
description: 取得 Asset 中繼資料與已簽署的下載 URL。
aside: false
outline: false
apiReference:
  title: 取得 Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: 取得 Asset 中繼資料與暫時性的已簽署下載 URL。
  groups:
    - title: 路徑參數
      fields:
        - name: asset_id
          type: string
          required: true
          description: 外部 Asset ID，不含 asset:// 前綴。
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
    - title: 由供應商管理的 URL
      description: asset:// 值是可重複使用的 Asset 參照。download_url 由供應商管理，可能為空；請再次查詢此端點以取得其目前的值。
---

<ApiReferencePage />
