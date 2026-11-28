---
i18nSource: b5cf676d897d17a3
title: Response erstellen
description: Erstelle eine OpenAI-kompatible Modellantwort, auch mit Streaming und Tools.
aside: false
outline: false
apiReference:
  title: Response erstellen
  operation: Inference
  method: POST
  path: /v1/responses
  description: Erstellt eine OpenAI-kompatible Modellantwort. SandBase übernimmt die Request-Felder nach dem Modell-Mapping und bereinigt Antworten auf öffentliche OpenAI-Felder.
  signature: client.responses.create(params)
  groups:
    - title: Request-Body
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Modellbezeichner aus der Models API.
        - name: input
          type: string | object[]
          required: false
          description: Text, Message-Items oder andere Eingaben, die das gewählte Modell und der Anbieter unterstützen.
        - name: instructions
          type: string
          required: false
          description: System- oder Developer-Anweisung für die Antwort.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: OpenAI-kompatible Server-Sent Events zurückgeben.
        - name: background
          type: boolean
          required: false
          description: Hintergrundausführung anfordern, wenn der gewählte Anbieter sie unterstützt.
        - name: include
          type: string[]
          required: false
          description: Zusätzliche öffentliche Antwortdaten, die bei Unterstützung enthalten sein sollen.
        - name: max_output_tokens
          type: integer
          required: false
          description: Maximale Anzahl generierter Tokens.
        - name: max_tool_calls
          type: integer
          required: false
          description: Maximale Anzahl integrierter Tool-Aufrufe, sofern unterstützt.
        - name: metadata
          type: object
          required: false
          description: Request-Metadaten, die an den Anbieter weitergegeben werden.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Unterstützten Modellen erlauben, Tools parallel aufzurufen.
        - name: previous_response_id
          type: string
          required: false
          description: Vorherige Antwort, die fortgesetzt werden soll, sofern die gewählte Route das unterstützt.
        - name: reasoning
          type: object
          required: false
          description: Reasoning-Konfiguration für unterstützte Modelle.
        - name: store
          type: boolean
          required: false
          description: Speicherung der Antwort beim Anbieter anfordern, sofern unterstützt.
        - name: text
          type: object
          required: false
          description: Konfiguration für Textausgabe und strukturiertes Format.
        - name: tool_choice
          type: string | object
          required: false
          description: Steuert die Tool-Auswahl.
        - name: tools
          type: object[]
          required: false
          description: Tools, die dem Modell zur Verfügung stehen.
        - name: truncation
          type: string
          required: false
          description: Verhalten beim Kürzen der Eingabe.
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
    - title: Request-Kompatibilität
      description: SandBase schreibt model auf das gewählte Upstream-Modell um und übernimmt die übrigen Request-Felder. Die Unterstützung variiert je nach Anbieter.
    - title: Bereinigte Antworten
      description: Zurückgegeben werden nur öffentliche OpenAI-Antwortfelder und die Token-Nutzung. Abrechnungs-, Konto- und Routing-Daten des Anbieters sowie unbekannte Erweiterungen auf oberster Ebene werden entfernt; der Inhalt der Output-Items bleibt erhalten.
    - title: Streaming
      description: Öffentliche response.*- und error-SSE-Events werden bereinigt und weitergeleitet. Unbekannte private Events werden verworfen; fehlerhafte Daten schließen den Stream, statt unsichere Inhalte weiterzuleiten.
  errors:
    - status: "400"
      description: Ungültiges JSON, fehlendes model oder eine ungültige Anfrage an den Anbieter.
    - status: "401"
      description: Fehlender oder ungültiger API-Key.
    - status: "402"
      description: Ausgabenlimit der Organisation oder des API-Keys erreicht.
    - status: "403"
      description: Ablehnung wegen API-Key-Scope oder fehlender Upstream-Berechtigung.
    - status: "413"
      description: Der Upstream-Anbieter hat die Anfrage als zu groß abgelehnt.
    - status: "500"
      description: Prediction-Lebenszyklus oder Abfrage der Organisation fehlgeschlagen.
    - status: "502"
      description: Die Upstream-Antwort konnte nicht sicher geparst und bereinigt werden.
    - status: "503"
      description: Routing fehlgeschlagen oder alle Anbieterkandidaten ausgeschöpft.
---

<ApiReferencePage />
