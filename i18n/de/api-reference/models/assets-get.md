---
i18nSource: aebee42034285529
title: Asset abrufen
description: Asset-Metadaten und eine signierte Download-URL abrufen.
aside: false
outline: false
apiReference:
  title: Asset abrufen
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Ruft Asset-Metadaten und eine temporäre signierte Download-URL ab.
  groups:
    - title: Pfadparameter
      fields:
        - name: asset_id
          type: string
          required: true
          description: Externe Asset-ID ohne das Präfix asset://.
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
    - title: Vom Anbieter verwaltete URL
      description: Der asset://-Wert ist die wiederverwendbare Asset-Referenz. download_url wird vom Anbieter verwaltet und kann leer sein; frage diesen Endpunkt erneut ab, um den aktuellen Wert zu erhalten.
---

<ApiReferencePage />
