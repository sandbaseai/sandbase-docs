---
i18nSource: 6f238c169e0f931d
title: Task cost प्राप्त करें
description: उसी API key द्वारा बनाए गए हाल के task का settlement status, अंतिम cost और token usage प्राप्त करें।
aside: false
outline: false
apiReference:
  title: Task cost प्राप्त करें
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: हाल के SandBase task का asynchronous settlement status, अंतिम cost और token usage प्राप्त करें।
  groups:
    - title: Path parameters
      fields:
        - name: task_id
          type: string
          required: true
          description: किसी billable operation द्वारा लौटाया गया opaque task ID, जिसमें मौजूद होने पर x-task-id response header भी शामिल है।
    - title: Response
      fields:
        - name: settled
          type: boolean
          required: true
          description: अंतिम cost settlement पूरा हुआ है या नहीं। जब तक यह true न हो, cost अंतिम नहीं है।
        - name: cost · estimated_cost
          type: string
          required: true
          description: छह दशमलव स्थानों वाली USD राशियाँ। estimated_cost, settlement से पहले का best-effort संदर्भ है।
        - name: usage
          type: object
          required: true
          description: Task के लिए दर्ज token counts।
        - name: pricing
          type: object
          required: false
          description: "Settlement के बाद, जब discount दर्ज हुआ हो: original_cost, discount_amount, discount_percent, और वैकल्पिक discount_type। original_cost में से discount_amount घटाने पर cost मिलता है।"
  examples:
    - label: HTTP
      language: http
      code: "Authorization: Bearer sk-YOUR_API_KEY"
    - label: cURL
      language: bash
      code: |-
        curl -sS \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          "https://api.sandbase.ai/v1/tasks/$TASK_ID/cost" | jq .
  response:
    status: 200 OK
    code: |-
      {
        "id": "f3d2e8a1-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "status": "completed",
        "settled": true,
        "currency": "USD",
        "cost": "0.001234",
        "estimated_cost": "0.001234",
        "usage": {
          "prompt_tokens": 1000,
          "completion_tokens": 200,
          "total_tokens": 1200,
          "cached_tokens": 800,
          "cache_creation_tokens": 0,
          "reasoning_tokens": 0
        }
      }
---

<ApiReferencePage />
