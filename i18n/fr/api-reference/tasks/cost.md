---
i18nSource: 6f238c169e0f931d
title: Récupérer le coût d'une tâche
description: Récupérez le statut de règlement, le coût final et l'utilisation des tokens d'une tâche récente créée par la même clé API.
aside: false
outline: false
apiReference:
  title: Récupérer le coût d'une tâche
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Récupère le statut de règlement asynchrone, le coût final et l'utilisation des tokens d'une tâche SandBase récente.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: task_id
          type: string
          required: true
          description: ID de tâche opaque renvoyé par une opération facturable, y compris dans l'en-tête de réponse x-task-id lorsqu'il est présent.
    - title: Réponse
      fields:
        - name: settled
          type: boolean
          required: true
          description: Indique si le règlement du coût final est terminé. cost n'est définitif que lorsque cette valeur est true.
        - name: cost · estimated_cost
          type: string
          required: true
          description: Montants en USD avec six décimales. estimated_cost est une référence indicative avant le règlement.
        - name: usage
          type: object
          required: true
          description: Nombres de tokens enregistrés pour la tâche.
        - name: pricing
          type: object
          required: false
          description: "Après le règlement, lorsqu'une remise a été enregistrée : original_cost, discount_amount, discount_percent et, en option, discount_type. original_cost moins discount_amount est égal à cost."
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
