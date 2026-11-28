---
i18nSource: aebee42034285529
title: Получить Asset
description: Получение метаданных Asset и подписанного URL для скачивания.
aside: false
outline: false
apiReference:
  title: Получить Asset
  operation: Assets
  method: GET
  path: /v1/assets/{asset_id}
  description: Получение метаданных Asset и временного подписанного URL для скачивания.
  groups:
    - title: Параметры пути
      fields:
        - name: asset_id
          type: string
          required: true
          description: Внешний ID Asset без префикса asset://.
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
    - title: URL под управлением провайдера
      description: Значение asset:// — многократно используемая ссылка на Asset. download_url управляется провайдером и может быть пустым; чтобы получить актуальное значение, снова вызовите этот эндпоинт.
---

<ApiReferencePage />
