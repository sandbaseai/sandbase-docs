---
i18nSource: 6f238c169e0f931d
title: Pobierz koszt zadania
description: Pobiera status rozliczenia, koszt końcowy i zużycie tokenów dla niedawnego zadania utworzonego tym samym kluczem API.
aside: false
outline: false
apiReference:
  title: Pobierz koszt zadania
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Pobiera status asynchronicznego rozliczenia, koszt końcowy i zużycie tokenów dla niedawnego zadania SandBase.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: task_id
          type: string
          required: true
          description: Nieprzezroczysty identyfikator zadania zwrócony przez płatną operację, w tym w nagłówku odpowiedzi x-task-id, jeśli występuje.
    - title: Odpowiedź
      fields:
        - name: settled
          type: boolean
          required: true
          description: Czy rozliczenie kosztu końcowego zostało zakończone. Wartość cost nie jest ostateczna, dopóki to pole nie ma wartości true.
        - name: cost · estimated_cost
          type: string
          required: true
          description: Kwoty w USD z sześcioma miejscami po przecinku. estimated_cost to orientacyjna wartość przed rozliczeniem.
        - name: usage
          type: object
          required: true
          description: Liczby tokenów zarejestrowane dla zadania.
        - name: pricing
          type: object
          required: false
          description: "Po rozliczeniu, jeśli zarejestrowano rabat: original_cost, discount_amount, discount_percent i opcjonalnie discount_type. original_cost minus discount_amount równa się cost."
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
