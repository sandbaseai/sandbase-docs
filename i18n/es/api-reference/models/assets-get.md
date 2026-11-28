---
i18nSource: aebee42034285529
title: Obtener Asset
description: Obtén los metadatos de un Asset y una URL de descarga firmada.
aside: false
outline: false
apiReference:
  title: Obtener Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Obtén los metadatos de un Asset y una URL de descarga firmada temporal.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: asset_id
          type: string
          required: true
          description: ID externo del Asset, sin el prefijo asset://.
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
    - title: URL gestionada por el proveedor
      description: El valor asset:// es la referencia reutilizable del Asset. download_url la gestiona el proveedor y puede estar vacía; vuelve a consultar este endpoint para obtener su valor actual.
---

<ApiReferencePage />
