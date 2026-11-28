---
i18nSource: 4916ed90816680e4
title: アセットの登録
description: メディア URL を再利用可能な SandBase のアセットとして登録します。
aside: false
outline: false
apiReference:
  title: アセットの登録
  operation: Assets
  method: POST
  path: /v1/assets
  description: 公開アクセス可能なメディア URL を登録し、永続的な asset:// 参照を受け取ります。
  groups:
    - title: リクエストボディ
      fields:
        - name: url
          type: string
          required: true
          description: アセットプロバイダーに転送される、空でないソース URL。プロバイダーが取得できる URL である必要があります。
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: 大文字と小文字を区別するアセットタイプ。
        - name: name
          type: string
          required: false
          description: 任意の表示名。
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
