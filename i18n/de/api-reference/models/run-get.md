---
i18nSource: 2ffb24dad49b9c79
title: Asynchronen Run abrufen
description: Einen asynchronen Modell- oder API-Run von SandBase abfragen und sein aktuelles oder finales Ergebnis abrufen.
aside: false
outline: false
apiReference:
  title: Asynchronen Run abrufen
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Ruft den aktuellen oder finalen Zustand eines asynchronen Runs ab, der mit POST /v1/run erstellt wurde.
  groups:
    - title: Pfadparameter
      fields:
        - name: id
          type: string
          required: true
          description: Opake Run-Kennung, die POST /v1/run zurückgibt. Verwende sie genau so, wie sie zurückgegeben wird; ein bestimmtes Präfix ist nicht garantiert.
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

## Polling {#polling}

Frage bei lang laufenden Medien- oder API-Aufgaben alle 5–10 Sekunden ab. Hör auf, sobald `status` den Wert `completed`, `failed` oder `timeout` hat. Eine nicht finale Antwort kann `outputs` weglassen; behandle die Run-ID als opak und konstruiere keine andere Status-URL.
