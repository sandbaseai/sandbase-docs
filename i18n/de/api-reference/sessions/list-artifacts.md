---
i18nSource: 270917aea416aa76
title: Session-Artefakte auflisten
description: Liste erfasste Ausgabeartefakte einer Session mit Cursor-Paginierung, undurchsichtigen IDs, Dateigrößen und Download-Links auf.
aside: false
outline: false
apiReference:
  title: Session-Artefakte auflisten
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Listet unveränderliche generierte Ausgaben dieser Session auf. Artefakt-IDs sind undurchsichtige, Session-gebundene Handles; übergib die zurückgegebene ID unverändert an den Download-Endpoint. Unbekannte oder wiederholte Query-Parameter liefern 400.
  groups:
    - title: Pfadparameter
      fields:
        - name: session_id
          type: string
          required: true
          description: Session-ID (Präfix ses_).
    - title: Query-Parameter
      fields:
        - name: limit
          type: integer
          required: false
          description: Seitengröße von 1 bis 100; ungültige Werte liefern 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc oder desc.
          default: desc
        - name: after
          type: string
          required: false
          description: Artefakt-ID, die auf der vorherigen Seite als last_id zurückgegeben wurde. Behalte beim Fortsetzen dieselbe Reihenfolge bei.
    - title: Artefakt-Objekt
      fields:
        - name: object
          type: string
          required: true
          description: Immer agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Undurchsichtiges art_-Handle. Nicht selbst konstruieren oder dekodieren.
        - name: session_id
          type: string
          required: true
          description: ID der zugehörigen Session.
        - name: path
          type: string
          required: true
          description: Pfad der generierten Ausgabe unterhalb von /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Größe des Artefakts in Bytes.
        - name: created_at
          type: integer
          required: true
          description: Erstellungszeitpunkt in Unix-Sekunden.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

Das Handle im Beispiel dient nur zur Veranschaulichung. Verwende für [Artefakt herunterladen](./download-artifact) die `id`, die deine eigene Anfrage zurückgibt. Wenn `has_more` true ist, sende `after=last_id` für die nächste Seite. `first_id` und `last_id` sind bei einer leeren Liste null. Ein separater GET-Endpoint für Artefakt-Metadaten wird nicht angeboten.
