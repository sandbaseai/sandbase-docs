---
i18nSource: efa205ed7505643c
title: Modell oder API-Fähigkeit ausführen
description: Sende ein SandBase-Modell oder eine API-Fähigkeit über den einheitlichen Run-Endpoint.
aside: false
outline: false
apiReference:
  title: Modell oder API-Fähigkeit ausführen
  operation: Models
  method: POST
  path: /v1/run
  description: Führt ein aktiviertes SandBase-Modell oder eine API-Fähigkeit aus. Die Request-Felder sind fähigkeitsspezifisch; das Schema der gewählten Fähigkeit findest du auf der Referenzseite des Modells bzw. der API auf der SandBase-Website.
  groups:
    - title: Request-Body
      fields:
        - name: model
          type: string
          required: true
          description: Bezeichner eines aktivierten logischen Modells oder einer API-Fähigkeit.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Hinweis zum Ausführungsmodus. `auto` verwendet den konfigurierten Standard der gewählten Fähigkeit; andere Werte müssen von der Fähigkeit unterstützt werden.
        - name: stream
          type: boolean
          required: false
          description: "Fordert gestreamte Ausgabe an, wenn die gewählte Fähigkeit das unterstützt. Entspricht `mode: stream`."
        - name: webhook_url
          type: string
          required: false
          description: Optionaler HTTPS-Callback für unterstützte asynchrone Bild
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

## Ausführung und Ergebnisse {#execution-and-results}

Synchrone Fähigkeiten geben in der ursprünglichen Anfrage eine abgeschlossene Antwort zurück. Asynchrone Fähigkeiten geben `202 Accepted` mit einer undurchsichtigen `id` zurück; frage [Asynchronen Run abrufen](./run-get) ab, bis der Status final ist.

Fähigkeitsspezifische Request-Felder und Ausgabeformate sind auf der Seite des gewählten Modells bzw. der API-Operation definiert. Sende diese Felder auf oberster Ebene des JSON-Bodys; packe sie nicht in ein `input`-Objekt. Geh nicht davon aus, dass jede Fähigkeit dieselben Parameter akzeptiert.

## Webhook-Callbacks {#webhook-callbacks}

Setze `webhook_url` nur für unterstützte asynchrone Bild-, Video- oder Audio-Tasks. SandBase sendet das finale Run-Event nach Abschluss oder Fehlschlag an den HTTPS-Endpoint; der Callback ist ein Zustellungshinweis und kein Ersatz für `GET /v1/run/{id}`. Frage für den maßgeblichen Status immer weiter den Run-Endpoint ab und wiederhole sicher, wenn ein Callback verzögert oder doppelt eintrifft. Synchrone Modellantworten und anbieternative Endpoints verwenden dieses Callback-Feld nicht.
