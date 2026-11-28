---
i18nSource: b5cf676d897d17a3
title: Utwórz odpowiedź
description: Utwórz odpowiedź modelu zgodną z OpenAI, w tym żądania strumieniowe i z narzędziami.
aside: false
outline: false
apiReference:
  title: Utwórz odpowiedź
  operation: Inference
  method: POST
  path: /v1/responses
  description: Tworzy odpowiedź modelu zgodną z OpenAI. SandBase zachowuje pola żądania po mapowaniu modelu, a następnie oczyszcza odpowiedzi do publicznych pól OpenAI.
  signature: client.responses.create(params)
  groups:
    - title: Treść żądania
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identyfikator modelu z Models API.
        - name: input
          type: string | object[]
          required: false
          description: Tekst, elementy wiadomości lub inne wejście obsługiwane przez wybrany model i dostawcę.
        - name: instructions
          type: string
          required: false
          description: Instrukcja systemowa lub deweloperska dla odpowiedzi.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Zwracaj zdarzenia Server-Sent Events zgodne z OpenAI.
        - name: background
          type: boolean
          required: false
          description: Żądaj wykonania w tle, jeśli wybrany dostawca to obsługuje.
        - name: include
          type: string[]
          required: false
          description: Dodatkowe publiczne dane odpowiedzi do dołączenia, jeśli są obsługiwane.
        - name: max_output_tokens
          type: integer
          required: false
          description: Maksymalna liczba generowanych tokenów.
        - name: max_tool_calls
          type: integer
          required: false
          description: Maksymalna liczba wywołań wbudowanych narzędzi, jeśli jest obsługiwana.
        - name: metadata
          type: object
          required: false
          description: Metadane żądania przekazywane dostawcy.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Pozwala obsługiwanym modelom wywoływać narzędzia równolegle.
        - name: previous_response_id
          type: string
          required: false
          description: Poprzednia odpowiedź do kontynuowania, jeśli wybrana trasa to obsługuje.
        - name: reasoning
          type: object
          required: false
          description: Konfiguracja rozumowania dla obsługiwanych modeli.
        - name: store
          type: boolean
          required: false
          description: Żądaj przechowywania odpowiedzi po stronie dostawcy, jeśli jest obsługiwane.
        - name: text
          type: object
          required: false
          description: Konfiguracja wyjścia tekstowego i formatu strukturalnego.
        - name: tool_choice
          type: string | object
          required: false
          description: Steruje wyborem narzędzi.
        - name: tools
          type: object[]
          required: false
          description: Narzędzia dostępne dla modelu.
        - name: truncation
          type: string
          required: false
          description: Sposób przycinania wejścia.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: Zgodność żądań
      description: SandBase zamienia model na wybrany model nadrzędny i zachowuje pozostałe pola żądania. Obsługa nadal zależy od dostawcy.
    - title: Oczyszczone odpowiedzi
      description: Zwracane są tylko publiczne pola odpowiedzi OpenAI i użycie tokenów. Rozliczenia dostawcy, dane konta, routing i nieznane rozszerzenia najwyższego poziomu są usuwane; treść elementów wyjściowych pozostaje bez zmian.
    - title: Strumieniowanie
      description: Publiczne zdarzenia SSE response.* i error są oczyszczane i przekazywane dalej. Nieznane zdarzenia prywatne są pomijane; nieprawidłowe dane zamykają strumień zamiast przekazywać niebezpieczną treść.
  errors:
    - status: "400"
      description: Nieprawidłowy JSON, brak model lub nieprawidłowe żądanie do dostawcy.
    - status: "401"
      description: Brak klucza API lub nieprawidłowy klucz.
    - status: "402"
      description: Osiągnięto limit wydatków organizacji lub klucza API.
    - status: "403"
      description: Odrzucenie z powodu zakresu klucza API lub uprawnień po stronie dostawcy.
    - status: "413"
      description: Dostawca nadrzędny odrzucił żądanie jako zbyt duże.
    - status: "500"
      description: Niepowodzenie cyklu życia predykcji lub wyszukania organizacji.
    - status: "502"
      description: Nie udało się bezpiecznie przetworzyć i oczyścić odpowiedzi dostawcy.
    - status: "503"
      description: Routing się nie powiódł lub wyczerpano wszystkich kandydatów na dostawcę.
---

<ApiReferencePage />
