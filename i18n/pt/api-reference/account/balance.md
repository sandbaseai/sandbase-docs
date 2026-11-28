---
i18nSource: 38d39c933364402c
title: Obter saldo da conta
description: Obtenha o saldo atual e as configurações de crédito opcionais da organização da chave de API.
aside: false
outline: false
apiReference:
  title: Obter saldo da conta
  operation: Account
  method: GET
  path: /v1/account/balance
  description: Retorna o saldo atual em USD e as configurações de crédito opcionais da organização identificada pela chave de API.
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
