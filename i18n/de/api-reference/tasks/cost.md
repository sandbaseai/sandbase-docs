---
i18nSource: 6f238c169e0f931d
title: Task-Kosten abrufen
description: Ruft Abrechnungsstatus, endgültige Kosten und Token-Nutzung für eine aktuelle Task ab, die mit demselben API-Schlüssel erstellt wurde.
aside: false
outline: false
apiReference:
  title: Task-Kosten abrufen
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Ruft den asynchronen Abrechnungsstatus, die endgültigen Kosten und die Token-Nutzung für eine aktuelle SandBase-Task ab.
  groups:
    - title: Pfadparameter
      fields:
        - name: task_id
          type: string
          required: true
          description: Opake Task-ID, die von einer abrechenbaren Operation zurückgegeben wird, einschließlich eines x-task-id-Response-Headers, sofern vorhanden.
    - title: Antwort
      fields:
        - name: settled
          type: boolean
          required: true
          description: Gibt an, ob die endgültige Kostenabrechnung abgeschlossen ist. cost ist erst endgültig, wenn dieser Wert true ist.
        - name: cost · estimated_cost
          type: string
          required: true
          description: USD-Beträge mit sechs Nachkommastellen. estimated_cost ist ein unverbindlicher Richtwert vor der Abrechnung.
        - name: usage
          type: object
          required: true
          description: Für die Task erfasste Token-Anzahlen.
        - name: pricing
          type: object
          required: false
          description: "Nach der Abrechnung, wenn ein Rabatt erfasst wurde: original_cost, discount_amount, discount_percent und optional discount_type. original_cost minus discount_amount ergibt cost."
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
