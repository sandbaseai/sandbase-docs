---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Modell-Interactions über das native Google-Protokoll erstellen, streamen und abfragen.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Erstellt eine native Google-Interaction. Prüfe status auch bei HTTP 200; eine in_progress-Antwort muss abgefragt werden.
  groups:
    - title: Request-Body
      fields:
        - name: model
          type: string
          required: true
          description: Logischer SandBase-Modellname.
        - name: input
          type: string | object | array
          required: true
          description: Native Google-Interaction-Eingabe.
        - name: stream
          type: boolean
          required: false
          description: Google-Interactions-SSE-Events zurückgeben, sofern das Modell es unterstützt.
        - name: background
          type: boolean
          required: false
          description: Dauerhaft übermitteln und eine sofort abfragbare Interaction zurückgeben. Nicht mit stream kombinierbar.
        - name: previous_interaction_id
          type: string
          required: false
          description: Von einer Upstream-Interaction fortsetzen und dabei die Provider-Affinität beibehalten.
        - name: store
          type: boolean
          required: false
          description: Die Speicherpräferenz unverändert an den Upstream weiterleiten.
        - name: system_instruction
          type: string
          required: false
          description: Native System-Anweisung.
        - name: tools
          type: array
          required: false
          description: Native Google-Tool-Definitionen.
        - name: generation_config
          type: object
          required: false
          description: Native Generierungskonfiguration.
        - name: response_format
          type: object | array
          required: false
          description: Angefordertes Antwortformat.
        - name: response_modalities
          type: array
          required: false
          description: Angeforderte Ausgabemodalitäten.
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

## Authentifizierung {#authentication}

Verwende `x-goog-api-key`, `Authorization: Bearer …` oder den Query-Parameter `key`, in dieser Prioritätsreihenfolge. Verwende bevorzugt einen Header, da Credentials im Query-String geloggt werden können.

## Unterstützte Modelle {#supported-models}

Der Interactions-Endpunkt ist keine allgemeine Route für jedes Modell, dessen Katalogname mit `google/` beginnt. Das Modell
muss eine Interactions-kompatible Provider-Zuordnung haben. SandBase dokumentiert derzeit diese kompatiblen Modelle:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

Andere Google-Modelle verwenden andere Endpunkte. Nano Banana Pro und Nano Banana 2 verwenden zum Beispiel
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content), nicht `/v1beta/interactions`. Ein nicht unterstütztes Modell schlägt fehl, statt über
ein anderes Google-Protokoll geroutet zu werden.

## Erfolg und Polling {#success-and-polling}

Erfolgreiche Übermittlungen geben HTTP `200` zurück, auch bei Hintergrundarbeit und bei synchronen Anfragen, deren begrenzte Wartezeit abläuft. Prüfe immer `status`:

- `completed`, `failed`, `cancelled` und `incomplete` sind Endzustände.
- `in_progress` läuft noch. Frage `GET /v1beta/interactions/{id}` ab; die Antwort kann diesen Pfad auch im Header `Location` enthalten.
- `requires_action` ist ein Protokollstatus, aber SandBase stellt derzeit den Endpunkt zur Tool-Bestätigung, der zum Fortsetzen nötig wäre, nicht bereit.

Die Polling-ID ist die upstream-`id` der Interaction, die `POST` zurückgibt, keine SandBase-Prediction-ID. Derselbe SandBase-API-Key, der die Interaction erstellt hat, muss sie abrufen.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Nicht abschließende GET-Antworten enthalten weder Teilausgaben noch Nutzungsdaten. Abschließende Antworten können Inline-Bild-, Audio- oder Videodaten enthalten und mehrere Megabyte groß sein. Lade benötigte Medien zeitnah herunter und speichere sie: Nach Ablauf der Upstream-Aufbewahrung kann SandBase nur noch einen verlustbehafteten abschließenden Fallback mit Struktur und Metadaten zurückgeben, nicht die ursprünglichen Medienbytes.

## Streaming {#streaming}

Setze `stream: true` im Request-Body. Die Antwort ist `text/event-stream`; `?alt=sse` wird von diesem Protokoll nicht verwendet. Event- und Delta-Typen sind nicht abschließend festgelegt und werden ohne feste Allowlist weitergeleitet, daher sollten Clients unbekannte Werte tolerieren. Sobald die Streaming-Header geschrieben sind, kommen Fehler als `error`-Event statt als anderer HTTP-Status.

Streaming hängt vom Modell ab. Ein Upstream-Provider kann `stream: true` ablehnen, obwohl das Protokoll es unterstützt.

## Aktuelle Grenzen {#current-limits}

SandBase stellt derzeit nur create und get bereit:

- Agent-Interactions werden abgelehnt; verwende `model`.
- `background: true` und `stream: true` lassen sich nicht kombinieren.
- list, delete und cancel für Interactions werden nicht bereitgestellt.
- URI-Auslieferung und GET-basierte Wiederverbindung zum Stream werden nicht bereitgestellt.
- `previous_interaction_id` erfordert eine aktive Provider-Affinitätszuordnung und Unterstützung durch den Upstream. Ist keine Affinität verfügbar, schlägt SandBase fehl, statt stillschweigend den Provider zu wechseln.

Fehler verwenden den Google-Envelope `{ "error": { "code", "message", "status" } }`. Verlass dich auf den HTTP-Status; der bereinigte Upstream-Text in `message` kann sich ändern.
