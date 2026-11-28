---
i18nSource: fb62188053fb216d
title: API Passthrough
description: Wywołuj włączone możliwości API z katalogu przez ich ścieżki kwalifikowane nazwą dostawcy.
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Rozwiązuje włączoną możliwość z katalogu o nazwie vendor/upstream_path i wykonuje obiekt JSON przez ujednolicony potok SandBase. GET jest również obsługiwany dla możliwości, które go używają.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: vendor
          type: string
          required: true
          description: Pierwszy segment nazwy możliwości.
        - name: upstream_path
          type: string
          required: true
          description: Pozostała część ścieżki
          including literal slash-separated segments when present.: null
    - title: Treść żądania
      fields:
        - name: model
          type: string
          required: false
          description: Pomiń, aby użyć tożsamości vendor/path wynikającej z URL. Jeśli podano
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Pola zdefiniowane przez aktualny schemat wybranej możliwości.
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

URL wskazuje włączony model o nazwie `vendor/upstream_path`. Użyj dokładnej nazwy z prefiksem dostawcy zwróconej przez [Models API](./). Zagnieżdżone nazwy możliwości pozostają dosłownymi segmentami ścieżki, a nie ukośnikami zakodowanymi procentowo.

POST akceptuje wyłącznie obiekt JSON. Pusta treść POST jest dozwolona i działa jak obiekt zawierający model wynikający z URL. GET używa pustej treści. Pola odpowiedzi oraz tryb synchroniczny lub asynchroniczny zależą od wybranej możliwości; wyniki asynchroniczne odpytuj przez `GET /v1/run/{id}`.
