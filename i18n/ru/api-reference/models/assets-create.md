---
i18nSource: 4916ed90816680e4
title: Регистрация Asset
description: Зарегистрируйте URL медиафайла как повторно используемый Asset SandBase.
aside: false
outline: false
apiReference:
  title: Регистрация Asset
  operation: Assets
  method: POST
  path: /v1/assets
  description: Регистрирует общедоступный URL медиафайла и возвращает постоянную ссылку asset://.
  groups:
    - title: Тело запроса
      fields:
        - name: url
          type: string
          required: true
          description: Непустой URL источника, передаваемый провайдеру Asset. Провайдер должен иметь возможность загрузить его.
        - name: asset_type
          type: Image | Video | Audio
          required: true
          description: Тип Asset с учётом регистра.
        - name: name
          type: string
          required: false
          description: Необязательное отображаемое имя.
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
