---
i18nSource: 06feb27e20f1b7f5
title: Lista historii konta
description: Lista ostatnich rekordów wykonań dla organizacji klucza API.
aside: false
outline: false
apiReference:
  title: Lista historii konta
  operation: Account
  method: GET
  path: /v1/account/history
  description: Zwraca ostatnie rekordy wykonań w zakresie organizacji, od najnowszych. Komunikaty błędów są oczyszczane, a zapisane migawki JSON są pomijane, jeśli nie da się ich zdekodować.
  groups:
    - title: Parametry zapytania
      fields:
        - name: model
          type: string
          required: false
          description: Dokładna logiczna nazwa modelu.
        - name: api_key_id
          type: string
          required: false
          description: Dokładny identyfikator zasobu klucza API.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Kategoria wykonania; multimodal obejmuje obraz, wideo i audio.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Zgrupowany status wykonania.
        - name: error_type
          type: string
          required: false
          description: Dokładny typ błędu lub unknown dla rekordów bez typu błędu.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Kroczący zakres daty utworzenia; domyślnie 7d.
        - name: page
          type: integer
          required: false
          description: Numer strony, począwszy od 1.
        - name: page_size
          type: integer
          required: false
          description: Liczba elementów na stronie od 1 do 100; domyślnie 20.
        - name: request_id
          type: string
          required: false
          description: Dokładny identyfikator wykonania w zakresie organizacji. Gdy jest ustawiony, pozostałe filtry są ignorowane i żądany jest jeden wynik.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Podstawa znacznika czasu dla jawnie podanego okna.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Filtr rozliczenia; positive i token wymagają time_basis=settled_at.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Początek okna (włącznie), w parze z end_at.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Koniec okna (wyłącznie); okno nie może przekraczać 32 dni.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Ogranicza próbki opóźnienia do wartości dodatnich.
        - name: min_latency_ms
          type: integer
          required: false
          description: Minimalne opóźnienie w milisekundach.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Tylko walidacja zgodności. Znaczniki czasu pozostają w UTC; dokładne wyszukiwanie po request_id ignoruje ten parametr.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
