---
i18nSource: 2ffb24dad49b9c79
title: Pobierz asynchroniczne uruchomienie
description: Odpytuj asynchroniczne uruchomienie modelu lub API w SandBase i pobierz jego bieżący lub końcowy wynik.
aside: false
outline: false
apiReference:
  title: Pobierz asynchroniczne uruchomienie
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Pobiera bieżący lub końcowy stan asynchronicznego uruchomienia utworzonego przez POST /v1/run.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: id
          type: string
          required: true
          description: Nieprzezroczysty identyfikator uruchomienia zwrócony przez POST /v1/run. Używaj go dokładnie w zwróconej postaci; prefiks nie jest gwarantowany.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## Odpytywanie {#polling}

Przy długotrwałych zadaniach multimedialnych lub API odpytuj co 5–10 sekund. Przerwij, gdy `status` ma wartość `completed`, `failed` lub `timeout`. Odpowiedź w stanie niekońcowym może nie zawierać `outputs`; traktuj identyfikator uruchomienia jako nieprzezroczysty i nie konstruuj innego URL statusu.
