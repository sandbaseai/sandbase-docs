---
i18nSource: 38d39c933364402c
title: Pobierz saldo konta
description: Pobierz bieżące saldo i opcjonalne ustawienia kredytu organizacji powiązanej z kluczem API.
aside: false
outline: false
apiReference:
  title: Pobierz saldo konta
  operation: Account
  method: GET
  path: /v1/account/balance
  description: Zwraca bieżące saldo w USD i opcjonalne ustawienia kredytu organizacji ustalonej na podstawie klucza API.
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
