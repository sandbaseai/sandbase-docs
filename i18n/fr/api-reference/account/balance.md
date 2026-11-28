---
i18nSource: 38d39c933364402c
title: Obtenir le solde du compte
description: Obtenez le solde actuel et les paramètres de crédit facultatifs de l'organisation de la clé API.
aside: false
outline: false
apiReference:
  title: Obtenir le solde du compte
  operation: Account
  method: GET
  path: /v1/account/balance
  description: Renvoie le solde actuel en USD et les paramètres de crédit facultatifs de l'organisation déterminée à partir de la clé API.
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
