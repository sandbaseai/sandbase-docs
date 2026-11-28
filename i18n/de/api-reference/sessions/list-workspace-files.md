---
i18nSource: 06a65ded83bf9438
title: Workspace-Dateien auflisten
description: Aktuelle Dateien im Session-Workspace mit Pfad, Größe und Paginierung auflisten. Dieser schreibgeschützte Endpunkt gibt Datei-Metadaten zurück.
aside: false
outline: false
apiReference:
  title: Workspace-Dateien auflisten
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Listet aktuelle Dateipfade und -größen in einem Verzeichnis des Session-Workspace auf. Diese Auflistung enthält nur Metadaten, weder Anhang-Historie noch Artifact-Inhalte. Unbekannte oder wiederholte Query-Parameter ergeben 400.
  groups:
    - title: Pfadparameter
      fields:
        - name: session_id
          type: string
          required: true
          description: Session-ID (Präfix ses_).
    - title: Query-Parameter
      fields:
        - name: path
          type: string
          required: false
          description: Absolutes Verzeichnis /workspace oder ein normalisiertes Verzeichnis darunter. Maximal 4096 Bytes; keine Traversal-Pfade, Backslashes oder abschließenden Schrägstriche.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Seitengröße von 1 bis 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Sortierreihenfolge der Pfade: asc oder desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Opaker next-Wert aus der vorherigen Antwort. Lass ihn auf der ersten Seite weg; sende keinen leeren String. Lass path, order und limit unverändert.
    - title: Response-Felder
      fields:
        - name: object
          type: string
          required: true
          description: Immer page.
        - name: data
          type: array
          required: true
          description: Dateien im aktuellen Verzeichnis, jeweils mit path und size_bytes. Die Auflistung ist nicht rekursiv.
        - name: next
          type: string | null
          required: true
          description: Übergib diesen Wert als page, um fortzufahren; am Ende null.
        - name: has_more
          type: boolean
          required: true
          description: Ob eine weitere Seite verfügbar ist.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

Lesezugriffe auf den Workspace können `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` oder `workspace_unavailable` zurückgeben. Ist der Cursor ungültig, beginne wieder bei der ersten Seite. Über [Artifacts](./list-artifacts) findest du herunterladbare generierte Ausgaben.
