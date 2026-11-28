---
i18nSource: 38d39c933364402c
title: Ottieni saldo dell'account
description: Ottieni il saldo corrente e le eventuali impostazioni di credito dell'organizzazione associata alla chiave API.
aside: false
outline: false
apiReference:
  title: Ottieni saldo dell'account
  operation: Account
  method: GET
  path: /v1/account/balance
  description: Restituisce il saldo corrente in USD e le eventuali impostazioni di credito dell'organizzazione ricavata dalla chiave API.
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
