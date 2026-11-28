---
i18nSource: 6f238c169e0f931d
title: Leggi costo del task
description: Recupera stato di addebito, costo finale e utilizzo di token di un task recente creato dalla stessa chiave API.
aside: false
outline: false
apiReference:
  title: Leggi costo del task
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Recupera lo stato di addebito asincrono, il costo finale e l'utilizzo di token di un task SandBase recente.
  groups:
    - title: Parametri di percorso
      fields:
        - name: task_id
          type: string
          required: true
          description: ID opaco del task restituito da un'operazione a pagamento, incluso l'header di risposta x-task-id quando presente.
    - title: Risposta
      fields:
        - name: settled
          type: boolean
          required: true
          description: Indica se l'addebito del costo finale è completato. cost non è definitivo finché questo valore non è true.
        - name: cost · estimated_cost
          type: string
          required: true
          description: Importi in USD con sei cifre decimali. estimated_cost è un riferimento indicativo prima dell'addebito.
        - name: usage
          type: object
          required: true
          description: Conteggi di token registrati per il task.
        - name: pricing
          type: object
          required: false
          description: "Dopo l'addebito, se è stato registrato uno sconto: original_cost, discount_amount, discount_percent e discount_type facoltativo. original_cost meno discount_amount è uguale a cost."
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
