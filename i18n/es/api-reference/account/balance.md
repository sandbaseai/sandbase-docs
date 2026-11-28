---
i18nSource: 38d39c933364402c
title: Obtener el saldo de la cuenta
description: Obtén el saldo actual y la configuración de crédito opcional de la organización de la clave de API.
aside: false
outline: false
apiReference:
  title: Obtener el saldo de la cuenta
  operation: Account
  method: GET
  path: /v1/account/balance
  description: Devuelve el saldo actual en USD y la configuración de crédito opcional de la organización resuelta a partir de la clave de API.
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
