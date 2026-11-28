---
i18nSource: 04f3657850b71e58
title: Anthropic-Message erstellen
description: Eine Anthropic-kompatible Message mit einem SandBase-Modell erstellen.
aside: false
outline: false
apiReference:
  title: Anthropic-Message erstellen
  operation: Inference
  method: POST
  path: /v1/messages
  description: Erstellt eine Message über den Anthropic-kompatiblen Messages-Endpunkt von SandBase. SandBase ordnet das Modell dem ausgewählten Provider zu und behält kompatible Request- und Response-Felder bei.
  signature: client.messages.create(params)
  groups:
    - title: Request-Header
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "SandBase-API-Key. Authorization: Bearer wird ebenfalls akzeptiert; sind beide vorhanden, hat x-api-key Vorrang."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Anthropic-API-Version, die upstream weitergeleitet wird. Fehlt sie, setzt SandBase 2023-06-01.
        - name: anthropic-beta
          type: string
          required: false
          description: Kommagetrennte Kennungen von Beta-Features, abhängig von der Kompatibilität des Providers.
    - title: Request-Body
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Anthropic-kompatible Modellkennung.
        - name: messages
          type: object[]
          required: true
          description: User- und Assistant-Messages mit Text oder typisierten Content-Blöcken.
        - name: max_tokens
          type: integer
          required: true
          description: Maximale Anzahl an Output-Tokens.
        - name: system
          type: string | object[]
          required: false
          description: System-Anweisung auf oberster Ebene.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Sampling-Temperatur von 0 bis 1.
        - name: top_p
          type: number
          required: false
          description: Schwellenwert für Nucleus Sampling.
        - name: top_k
          type: integer
          required: false
          description: Sampling auf die Top-K-Tokens beschränken.
        - name: stop_sequences
          type: string[]
          required: false
          description: Eigene Sequenzen, die die Generierung beenden.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Server-Sent Events im Anthropic-Stil zurückgeben.
        - name: metadata
          type: object
          required: false
          description: Request-Metadaten, einschließlich einer optionalen user_id.
        - name: tools
          type: object[]
          required: false
          description: Tool-Definitionen, die dem Modell zur Verfügung stehen.
        - name: tool_choice
          type: object
          required: false
          description: Steuert, wie Tools ausgewählt werden.
        - name: thinking
          type: object
          required: false
          description: Konfiguration für Extended Thinking bei unterstützten Modellen.
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
    - title: Authentifizierung
      description: "Verwende x-api-key oder Authorization: Bearer. Sind beide angegeben, hat x-api-key Vorrang."
    - title: Transparentes Protokoll
      description: Abgesehen von der Modellzuordnung und konfigurierten Kompatibilitätsregeln des Providers leitet SandBase kompatible Request-Felder, Nicht-Stream-Responses und SSE-Events ohne Protokollübersetzung weiter.
    - title: Beta-Features
      description: anthropic-beta wird weitergeleitet, wenn vorhanden. Die Kompatibilitätsregeln eines Kandidaten können nicht unterstützte Beta-Felder entfernen oder diesen Kandidaten überspringen.
  errors:
    - status: "400"
      description: Ungültiger Request-Body oder nicht unterstütztes Feature.
    - status: "401"
      description: Fehlender oder ungültiger API-Key.
    - status: "402"
      description: Ausgabenlimit der Organisation erreicht.
    - status: "403"
      description: Ausgabenlimit des API-Keys erreicht oder fehlende Berechtigung der Organisation.
    - status: "404"
      description: Modell nicht gefunden oder nicht verfügbar.
    - status: "413"
      description: Der Provider hat die Anfrage als zu groß abgelehnt.
    - status: "429"
      description: Rate Limit des Providers überschritten.
    - status: "500"
      description: Fehler im Prediction-Lebenszyklus oder beim Provider.
    - status: "502"
      description: Der Upstream-Stream endete, bevor verwertbarer Inhalt kam.
    - status: "503"
      description: Routing fehlgeschlagen oder alle Provider-Kandidaten waren nicht verfügbar.
---

<ApiReferencePage />
