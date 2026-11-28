---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: Twórz uzupełnienia czatu zgodne z OpenAI przy użyciu modeli językowych i wizyjnych SandBase.
aside: false
outline: false
apiReference:
  title: Utwórz uzupełnienie czatu
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Tworzy uzupełnienie czatu zgodne z OpenAI przy użyciu dowolnego obsługiwanego modelu czatu SandBase. Pola zgodne z dostawcą są zachowywane, jeśli wybrana trasa je obsługuje.
  signature: client.chat.completions.create(params)
  groups:
    - title: Treść żądania
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identyfikator modelu z Models API.
        - name: messages
          type: object[]
          required: true
          description: Wiadomości rozmowy z rolami obsługiwanymi przez wybranego dostawcę, zwykle system, developer, user, assistant lub tool.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperatura próbkowania od 0 do 2.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Próg próbkowania nucleus.
        - name: max_tokens
          type: integer
          required: false
          description: Maksymalna liczba tokenów wyjściowych.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Zwraca przyrostowe zdarzenia Server-Sent Events.
        - name: stop
          type: string | string[]
          required: false
          description: Sekwencja lub sekwencje zatrzymujące generowanie.
        - name: tools
          type: object[]
          required: false
          description: Definicje funkcji dostępnych dla modelu.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Określa, czy i które narzędzie zostanie wybrane.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Pozwala obsługiwanym modelom zwracać wiele wywołań narzędzi w jednej turze.
        - name: user
          type: string
          required: false
          description: Identyfikator użytkownika końcowego zgodny z dostawcą.
        - name: response_format
          type: object
          required: false
          description: Konfiguracja wyjścia jako obiekt JSON lub JSON Schema.
        - name: reasoning_effort
          type: string
          required: false
          description: Ustawienie nakładu rozumowania zgodne z dostawcą.
        - name: reasoning
          type: object
          required: false
          description: Konfiguracja rozumowania, np. effort lub max_tokens.
        - name: thinking
          type: object
          required: false
          description: Konfiguracja myślenia, np. type lub budget_tokens.
        - name: extra_body
          type: object
          required: false
          description: Parametry specyficzne dla dostawcy na trasach wymagających translacji protokołu.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Liczba wariantów odpowiedzi do wygenerowania.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Kara za obecność od -2 do 2.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Kara za częstotliwość od -2 do 2.
        - name: stream_options
          type: object
          required: false
          description: Opcje strumieniowania, np. include_usage.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: Strumieniowanie i narzędzia
      description: "Ustaw stream na true, aby używać SSE; strumień kończy się na data: [DONE]. Dodaj stream_options.include_usage, aby otrzymać końcowy fragment z użyciem. Wywołania narzędzi i treści multimodalne są zgodne ze schematem OpenAI."
    - title: Zgodność z dostawcami
      description: SandBase zachowuje dodatkowe zgodne pola na trasach w tym samym protokole. Obsługa pól między protokołami i pól specyficznych dla dostawcy jest różna; w razie potrzeby używaj extra_body.
  errors:
    - status: "400"
      description: Nieprawidłowa treść żądania lub nieobsługiwany parametr.
    - status: "401"
      description: Brak klucza API lub klucz jest nieprawidłowy.
    - status: "402"
      description: Osiągnięto limit wydatków organizacji.
    - status: "404"
      description: Model nie istnieje lub jest niedostępny.
    - status: "429"
      description: Przekroczono limit żądań.
    - status: "500"
      description: Nie udało się zapisać żądania lub odczytać organizacji.
    - status: "502"
      description: Wybrany dostawca zwrócił nieprawidłową odpowiedź.
    - status: "503"
      description: Żadna trasa dostawcy nie zakończyła się powodzeniem.
---

<ApiReferencePage />
