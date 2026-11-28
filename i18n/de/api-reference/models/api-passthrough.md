---
i18nSource: fb62188053fb216d
title: API-Passthrough
description: Aktivierte API-Capabilities aus dem Katalog über ihre anbieterqualifizierten Pfade aufrufen.
aside: false
outline: false
apiReference:
  title: API-Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Löst eine aktivierte Katalog-Capability namens vendor/upstream_path auf und führt ein JSON-Objekt über die einheitliche SandBase-Pipeline aus. GET wird ebenfalls unterstützt, sofern die Capability es verwendet.
  groups:
    - title: Pfadparameter
      fields:
        - name: vendor
          type: string
          required: true
          description: Erstes Segment des Capability-Namens.
        - name: upstream_path
          type: string
          required: true
          description: Restlicher Pfad
          including literal slash-separated segments when present.: null
    - title: Request-Body
      fields:
        - name: model
          type: string
          required: false
          description: Lass es weg, um die aus der URL abgeleitete vendor/path-Identität zu verwenden. Falls angegeben
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Felder, die durch das Live-Schema der gewählten Capability definiert sind.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

Die URL wird zu einem aktivierten Modell namens `vendor/upstream_path` aufgelöst. Verwende den exakten, mit dem Anbieter qualifizierten Namen, den die [Models API](./) zurückgibt. Verschachtelte Capability-Namen bleiben wörtliche Pfadsegmente und werden nicht als prozentkodierte Schrägstriche geschrieben.

POST akzeptiert nur ein JSON-Objekt. Ein leerer POST-Body ist erlaubt und verhält sich wie ein Objekt, das das aus der URL abgeleitete Modell enthält. GET verwendet einen leeren Body. Antwortfelder sowie synchrones oder asynchrones Verhalten hängen von der gewählten Capability ab; frage asynchrone Ergebnisse über `GET /v1/run/{id}` ab.
