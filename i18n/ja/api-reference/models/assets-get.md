---
i18nSource: aebee42034285529
title: Asset の取得
description: Asset のメタデータと署名付きダウンロード URL を取得します。
aside: false
outline: false
apiReference:
  title: Asset の取得
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Asset のメタデータと一時的な署名付きダウンロード URL を取得します。
  groups:
    - title: パスパラメーター
      fields:
        - name: asset_id
          type: string
          required: true
          description: 外部 Asset ID（asset:// プレフィックスなし）。
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
    - title: プロバイダー管理の URL
      description: asset:// の値は再利用可能な Asset 参照です。download_url はプロバイダーが管理しており、空の場合があります。現在の値を得るには、このエンドポイントを再度呼び出してください。
---

<ApiReferencePage />
