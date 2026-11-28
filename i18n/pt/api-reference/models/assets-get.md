---
i18nSource: aebee42034285529
title: Obter Asset
description: Obtenha os metadados de um Asset e uma URL de download assinada.
aside: false
outline: false
apiReference:
  title: Obter Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Obtenha os metadados de um Asset e uma URL de download assinada temporária.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: asset_id
          type: string
          required: true
          description: ID externo do Asset, sem o prefixo asset://.
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
    - title: URL gerenciada pelo provedor
      description: O valor asset:// é a referência reutilizável do Asset. download_url é gerenciada pelo provedor e pode estar vazia; consulte este endpoint novamente para obter o valor atual.
---

<ApiReferencePage />
