---
i18nSource: 4916ed90816680e4
title: Registra asset
description: Registra un URL multimediale come Asset SandBase riutilizzabile.
aside: false
outline: false
apiReference:
  title: Registra asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: Registra un URL multimediale accessibile pubblicamente e ricevi un riferimento asset:// persistente.
  groups:
    - title: Body della richiesta
      fields:
        - name: url
          type: string
          required: true
          description: URL di origine non vuoto inoltrato al provider dell'Asset. Il provider deve poterlo scaricare.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Tipo di asset, con distinzione tra maiuscole e minuscole.
        - name: name
          type: string
          required: false
          description: Nome visualizzato facoltativo.
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
