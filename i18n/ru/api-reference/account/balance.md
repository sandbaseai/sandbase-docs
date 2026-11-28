---
i18nSource: 38d39c933364402c
title: Получение баланса аккаунта
description: Получите текущий баланс и необязательные настройки кредита для организации API-ключа.
aside: false
outline: false
apiReference:
  title: Получение баланса аккаунта
  operation: Account
  method: GET
  path: /v1/account/balance
  description: Возвращает текущий баланс в USD и необязательные настройки кредита для организации, определённой по API-ключу.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/account/balance \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "org_id": "550e8400-e29b-41d4-a716-446655440000",
        "balance": "42.125",
        "credit_limit": "10",
        "alert_threshold": "5"
      }
---

<ApiReferencePage />
