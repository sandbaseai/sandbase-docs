---
i18nSource: efa205ed7505643c
title: Uruchom model lub możliwość API
description: Prześlij model lub możliwość API SandBase przez ujednolicony endpoint uruchamiania.
aside: false
outline: false
apiReference:
  title: Uruchom model lub możliwość API
  operation: Models
  method: POST
  path: /v1/run
  description: Wykonuje włączony model lub możliwość API SandBase. Pola żądania zależą od możliwości; schemat wybranej możliwości znajdziesz na stronie modelu lub API w witrynie SandBase.
  groups:
    - title: Treść żądania
      fields:
        - name: model
          type: string
          required: true
          description: Identyfikator włączonego modelu logicznego lub możliwości API.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Wskazówka trybu wykonania. `auto` używa domyślnej konfiguracji wybranej możliwości; inne wartości wymagają obsługi przez możliwość.
        - name: stream
          type: boolean
          required: false
          description: "Żądaj strumieniowania wyniku, jeśli wybrana możliwość to obsługuje. Odpowiednik `mode: stream`."
        - name: webhook_url
          type: string
          required: false
          description: Opcjonalne wywołanie zwrotne HTTPS dla obsługiwanych asynchronicznych zadań graficznych
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Wykonanie i wyniki {#execution-and-results}

Możliwości synchroniczne zwracają ukończoną odpowiedź w ramach pierwotnego żądania. Możliwości asynchroniczne zwracają `202 Accepted` z nieprzejrzystym `id`; odpytuj [Pobieranie asynchronicznego uruchomienia](./run-get), dopóki status nie będzie końcowy.

Pola żądania i kształty wyników właściwe dla danej możliwości są opisane na stronie wybranego modelu lub operacji API. Wysyłaj te pola na najwyższym poziomie treści JSON; nie opakowuj ich w obiekt `input`. Nie zakładaj, że każda możliwość przyjmuje te same parametry.

## Wywołania zwrotne webhook {#webhook-callbacks}

Ustawiaj `webhook_url` tylko dla obsługiwanych asynchronicznych zadań graficznych, wideo lub audio. Po zakończeniu lub niepowodzeniu SandBase wysyła końcowe zdarzenie uruchomienia na endpoint HTTPS; wywołanie zwrotne jest wskazówką o dostarczeniu, a nie zamiennikiem `GET /v1/run/{id}`. Zawsze odpytuj endpoint uruchomienia, aby uzyskać wiążący status, i bezpiecznie ponawiaj, gdy wywołanie zwrotne jest opóźnione lub zduplikowane. Synchroniczne odpowiedzi modeli i natywne endpointy dostawców nie używają tego pola wywołania zwrotnego.
