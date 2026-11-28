---
i18nSource: 38d39c933364402c
title: अकाउंट बैलेंस पाएं
description: API key के organization का मौजूदा बैलेंस और वैकल्पिक credit settings पाएं।
aside: false
outline: false
apiReference:
  title: अकाउंट बैलेंस पाएं
  operation: Account
  method: GET
  path: /v1/account/balance
  description: API key से पहचाने गए organization का मौजूदा USD बैलेंस और वैकल्पिक credit settings लौटाएं।
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
