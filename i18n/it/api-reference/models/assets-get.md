---
i18nSource: aebee42034285529
title: Ottenere un Asset
description: Recupera i metadata di un Asset e un URL di download firmato.
aside: false
outline: false
apiReference:
  title: Ottenere un Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Recupera i metadata di un Asset e un URL di download firmato temporaneo.
  groups:
    - title: Parametri di percorso
      fields:
        - name: asset_id
          type: string
          required: true
          description: ID esterno dell'Asset, senza il prefisso asset://.
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
    - title: URL gestito dal provider
      description: Il valore asset:// è il riferimento riutilizzabile all'Asset. download_url è gestito dal provider e può essere vuoto; interroga di nuovo questo endpoint per ottenerne il valore corrente.
---

<ApiReferencePage />
