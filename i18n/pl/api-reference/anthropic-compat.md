---
i18nSource: 04f3657850b71e58
title: Utwórz wiadomość Anthropic
description: Utwórz wiadomość zgodną z Anthropic za pomocą modelu SandBase.
aside: false
outline: false
apiReference:
  title: Utwórz wiadomość Anthropic
  operation: Inference
  method: POST
  path: /v1/messages
  description: Utwórz wiadomość przez endpoint Messages SandBase zgodny z Anthropic. SandBase mapuje model dla wybranego dostawcy i zachowuje zgodne pola żądania i odpowiedzi.
  signature: client.messages.create(params)
  groups:
    - title: Nagłówki żądania
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "Klucz API SandBase. Akceptowany jest też Authorization: Bearer; gdy obecne są oba, pierwszeństwo ma x-api-key."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Wersja Anthropic API przekazywana dalej. Gdy zostanie pominięta, SandBase ustawia 2023-06-01.
        - name: anthropic-beta
          type: string
          required: false
          description: Rozdzielone przecinkami identyfikatory funkcji beta, zależnie od zgodności dostawcy.
    - title: Treść żądania
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identyfikator modelu zgodny z Anthropic.
        - name: messages
          type: object[]
          required: true
          description: Wiadomości użytkownika i asystenta zawierające tekst lub typowane bloki treści.
        - name: max_tokens
          type: integer
          required: true
          description: Maksymalna liczba tokenów wyjściowych.
        - name: system
          type: string | object[]
          required: false
          description: Instrukcja systemowa najwyższego poziomu.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperatura próbkowania od 0 do 1.
        - name: top_p
          type: number
          required: false
          description: Próg próbkowania nucleus.
        - name: top_k
          type: integer
          required: false
          description: Ogranicz próbkowanie do K najlepszych tokenów.
        - name: stop_sequences
          type: string[]
          required: false
          description: Własne sekwencje zatrzymujące generowanie.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Zwracaj Server-Sent Events w stylu Anthropic.
        - name: metadata
          type: object
          required: false
          description: Metadane żądania, w tym opcjonalny user_id.
        - name: tools
          type: object[]
          required: false
          description: Definicje narzędzi dostępnych dla modelu.
        - name: tool_choice
          type: object
          required: false
          description: Steruje sposobem wyboru narzędzi.
        - name: thinking
          type: object
          required: false
          description: Konfiguracja rozszerzonego myślenia dla obsługiwanych modeli.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: Uwierzytelnianie
      description: "Użyj x-api-key lub Authorization: Bearer. Gdy podano oba, pierwszeństwo ma x-api-key."
    - title: Przezroczysty protokół
      description: Poza mapowaniem modelu i skonfigurowanymi regułami zgodności dostawcy SandBase przekazuje zgodne pola żądania, odpowiedzi bez strumieniowania i zdarzenia SSE bez tłumaczenia protokołu.
    - title: Funkcje beta
      description: anthropic-beta jest przekazywany, jeśli występuje. Reguły zgodności kandydata mogą usunąć nieobsługiwane pola beta lub pominąć tego kandydata.
  errors:
    - status: "400"
      description: Nieprawidłowa treść żądania lub nieobsługiwana funkcja.
    - status: "401"
      description: Brak lub nieprawidłowy klucz API.
    - status: "402"
      description: Osiągnięto limit wydatków organizacji.
    - status: "403"
      description: Limit wydatków klucza API lub brak uprawnień organizacji.
    - status: "404"
      description: Model nie istnieje lub jest niedostępny.
    - status: "413"
      description: Dostawca odrzucił żądanie jako zbyt duże.
    - status: "429"
      description: Przekroczono limit zapytań dostawcy.
    - status: "500"
      description: Błąd cyklu życia predykcji lub dostawcy.
    - status: "502"
      description: Strumień nadrzędny zakończył się przed otrzymaniem użytecznej treści.
    - status: "503"
      description: Routing nie powiódł się lub wszyscy kandydaci dostawców byli niedostępni.
---

<ApiReferencePage />
