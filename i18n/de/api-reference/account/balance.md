---
i18nSource: 38d39c933364402c
title: Kontoguthaben abrufen
description: Ruft das aktuelle Guthaben und optionale Krediteinstellungen der Organisation des API-Keys ab.
aside: false
outline: false
apiReference:
  title: Kontoguthaben abrufen
  operation: Account
  method: GET
  path: /v1/account/balance
  description: Gibt das aktuelle USD-Guthaben und optionale Krediteinstellungen der Organisation zurück, die über den API-Key ermittelt wird.
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
