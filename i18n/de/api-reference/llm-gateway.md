---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: Erstelle OpenAI-kompatible Chat Completions mit den Sprach- und Vision-Modellen von SandBase.
aside: false
outline: false
apiReference:
  title: Chat Completion erstellen
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Erstellt eine OpenAI-kompatible Chat Completion mit einem beliebigen unterstützten SandBase-Chatmodell. Provider-kompatible Felder bleiben erhalten, wenn die gewählte Route sie unterstützt.
  signature: client.chat.completions.create(params)
  groups:
    - title: Request-Body
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Modell-ID aus der Models API.
        - name: messages
          type: object[]
          required: true
          description: Gesprächsnachrichten mit den Rollen, die der gewählte Provider unterstützt, üblicherweise system, developer, user, assistant oder tool.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Sampling-Temperatur von 0 bis 2.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Schwellenwert für Nucleus-Sampling.
        - name: max_tokens
          type: integer
          required: false
          description: Maximale Anzahl an Ausgabe-Tokens.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Inkrementelle Server-Sent Events zurückgeben.
        - name: stop
          type: string | string[]
          required: false
          description: Sequenz oder Sequenzen, die die Generierung beenden.
        - name: tools
          type: object[]
          required: false
          description: Funktionsdefinitionen, die dem Modell zur Verfügung stehen.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Steuert, ob und welches Tool ausgewählt wird.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Erlaubt unterstützten Modellen, mehrere Tool-Aufrufe in einem Turn auszugeben.
        - name: user
          type: string
          required: false
          description: Provider-kompatible Kennung des Endnutzers.
        - name: response_format
          type: object
          required: false
          description: Ausgabekonfiguration als JSON-Objekt oder JSON Schema.
        - name: reasoning_effort
          type: string
          required: false
          description: Provider-kompatible Einstellung für den Reasoning-Aufwand.
        - name: reasoning
          type: object
          required: false
          description: Reasoning-Konfiguration, etwa effort oder max_tokens.
        - name: thinking
          type: object
          required: false
          description: Thinking-Konfiguration, etwa type oder budget_tokens.
        - name: extra_body
          type: object
          required: false
          description: Provider-spezifische Parameter für Routen, die eine Protokollübersetzung erfordern.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Anzahl der zu generierenden Completion-Auswahlen.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Presence Penalty von -2 bis 2.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Frequency Penalty von -2 bis 2.
        - name: stream_options
          type: object
          required: false
          description: Streaming-Optionen wie include_usage.
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
    - title: Streaming und Tools
      description: "Setze stream auf true für SSE; der Stream endet mit data: [DONE]. Füge stream_options.include_usage hinzu, um den abschließenden Usage-Chunk zu erhalten. Tool-Aufrufe und multimodale Inhalte folgen dem OpenAI-kompatiblen Schema."
    - title: Provider-Kompatibilität
      description: SandBase behält zusätzliche kompatible Felder auf Routen mit demselben Protokoll bei. Die Unterstützung protokollübergreifender und provider-spezifischer Felder variiert; verwende gegebenenfalls extra_body.
  errors:
    - status: "400"
      description: Ungültiger Request-Body oder nicht unterstützter Parameter.
    - status: "401"
      description: Fehlender oder ungültiger API-Schlüssel.
    - status: "402"
      description: Ausgabenlimit der Organisation erreicht.
    - status: "404"
      description: Modell nicht gefunden oder nicht verfügbar.
    - status: "429"
      description: Rate Limit überschritten.
    - status: "500"
      description: Speichern der Anfrage oder Abruf der Organisation fehlgeschlagen.
    - status: "502"
      description: Der gewählte Provider hat eine ungültige Antwort geliefert.
    - status: "503"
      description: Keine Provider-Route war erfolgreich.
---

<ApiReferencePage />
