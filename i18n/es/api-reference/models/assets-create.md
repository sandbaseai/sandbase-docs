---
i18nSource: 4916ed90816680e4
title: Registrar Asset
description: Registra una URL de medios como un Asset reutilizable de SandBase.
aside: false
outline: false
apiReference:
  title: Registrar Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: Registra una URL de medios de acceso público y recibe una referencia asset:// persistente.
  groups:
    - title: Cuerpo de la solicitud
      fields:
        - name: url
          type: string
          required: true
          description: URL de origen no vacía que se reenvía al proveedor del Asset. El proveedor debe poder descargarla.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Tipo de asset, distingue mayúsculas y minúsculas.
        - name: name
          type: string
          required: false
          description: Nombre visible opcional.
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
