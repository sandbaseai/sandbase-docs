---
i18nSource: 4916ed90816680e4
title: Registrar Asset
description: Registre uma URL de mídia como um Asset reutilizável da SandBase.
aside: false
outline: false
apiReference:
  title: Registrar Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: Registra uma URL de mídia acessível publicamente e retorna uma referência asset:// persistente.
  groups:
    - title: Corpo da requisição
      fields:
        - name: url
          type: string
          required: true
          description: URL de origem não vazia, repassada ao provedor de Assets. O provedor precisa conseguir buscá-la.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Tipo do asset, diferencia maiúsculas de minúsculas.
        - name: name
          type: string
          required: false
          description: Nome de exibição opcional.
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
