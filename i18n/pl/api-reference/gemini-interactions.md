---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Twórz, strumieniuj i odpytuj Interactions modeli przez natywny protokół Google.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Utwórz natywną Interaction Google. Sprawdzaj status nawet przy HTTP 200; odpowiedź in_progress trzeba odpytywać.
  groups:
    - title: Treść żądania
      fields:
        - name: model
          type: string
          required: true
          description: Logiczna nazwa modelu SandBase.
        - name: input
          type: string | object | array
          required: true
          description: Natywne wejście Google Interaction.
        - name: stream
          type: boolean
          required: false
          description: Zwracaj zdarzenia SSE Google Interactions, jeśli model to obsługuje.
        - name: background
          type: boolean
          required: false
          description: Zgłoś trwale i zwróć Interaction, którą można od razu odpytywać. Nie można łączyć ze stream.
        - name: previous_interaction_id
          type: string
          required: false
          description: Kontynuuj od nadrzędnej Interaction, zachowując powiązanie z dostawcą.
        - name: store
          type: boolean
          required: false
          description: Przekaż bez zmian preferencję przechowywania dostawcy.
        - name: system_instruction
          type: string
          required: false
          description: Natywna instrukcja systemowa.
        - name: tools
          type: array
          required: false
          description: Natywne definicje narzędzi Google.
        - name: generation_config
          type: object
          required: false
          description: Natywna konfiguracja generowania.
        - name: response_format
          type: object | array
          required: false
          description: Żądany format odpowiedzi.
        - name: response_modalities
          type: array
          required: false
          description: Żądane modalności wyjścia.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Uwierzytelnianie {#authentication}

Użyj `x-goog-api-key`, `Authorization: Bearer …` lub parametru zapytania `key`, w tej kolejności priorytetu. Preferuj nagłówek, ponieważ poświadczenia w ciągu zapytania mogą trafić do logów.

## Obsługiwane modele {#supported-models}

Endpoint Interactions nie jest ogólną trasą dla każdego modelu, którego nazwa w katalogu zaczyna się od `google/`. Model
musi mieć mapowanie dostawcy zgodne z Interactions. SandBase dokumentuje obecnie następujące zgodne modele:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

Inne modele Google używają innych endpointów. Na przykład Nano Banana Pro i Nano Banana 2 używają
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content), a nie `/v1beta/interactions`. Nieobsługiwany model kończy się błędem zamiast zostać skierowany
przez inny protokół Google.

## Powodzenie i odpytywanie {#success-and-polling}

Pomyślne zgłoszenia zwracają HTTP `200`, także dla pracy w tle i żądań synchronicznych, których ograniczony czas oczekiwania upłynął. Zawsze sprawdzaj `status`:

- `completed`, `failed`, `cancelled` i `incomplete` są stanami końcowymi.
- `in_progress` oznacza, że praca nadal trwa. Odpytuj `GET /v1beta/interactions/{id}`; odpowiedź może też zawierać tę ścieżkę w nagłówku `Location`.
- `requires_action` jest statusem protokołu, ale SandBase nie udostępnia obecnie endpointu potwierdzania narzędzi potrzebnego do przejścia dalej.

Identyfikator do odpytywania to nadrzędny `id` Interaction zwrócony przez `POST`, a nie identyfikator predykcji SandBase. Interaction musi zostać pobrana tym samym kluczem API SandBase, którym ją utworzono.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Odpowiedzi GET dla stanów niekońcowych pomijają częściowe wyjście i użycie. Odpowiedzi końcowe mogą zawierać dane inline obrazu, audio lub wideo i mieć kilka megabajtów. Pobierz i zapisz potrzebne media od razu: po wygaśnięciu retencji u dostawcy SandBase może zwrócić tylko stratną końcową odpowiedź zastępczą ze strukturą i metadanymi, bez oryginalnych bajtów mediów.

## Strumieniowanie {#streaming}

Ustaw `stream: true` w treści żądania. Odpowiedź ma typ `text/event-stream`; ten protokół nie używa `?alt=sse`. Typy zdarzeń i delt są otwarte i przekazywane bez stałej listy dozwolonych wartości, więc klienci powinni tolerować nieznane wartości. Po zapisaniu nagłówków strumienia błędy przychodzą jako zdarzenie `error`, a nie jako inny status HTTP.

Strumieniowanie zależy od modelu. Dostawca nadrzędny może odrzucić `stream: true`, mimo że protokół je obsługuje.

## Obecne ograniczenia {#current-limits}

SandBase obecnie udostępnia tylko create i get:

- Agent Interactions są odrzucane; użyj `model`.
- Nie można łączyć `background: true` i `stream: true`.
- Lista, usuwanie i anulowanie Interaction nie są udostępnione.
- Dostarczanie przez URI i ponowne łączenie strumienia przez GET nie są udostępnione.
- `previous_interaction_id` wymaga aktywnego mapowania powiązania z dostawcą i obsługi po stronie dostawcy. Gdy powiązanie jest niedostępne, SandBase zwraca błąd zamiast po cichu przełączać dostawcę.

Błędy używają koperty Google `{ "error": { "code", "message", "status" } }`. Traktuj status HTTP jako stabilny; oczyszczony tekst od dostawcy w `message` może się zmieniać.
