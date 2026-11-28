---
i18nSource: faccf5122e785ea0
title: Session-Artefakt herunterladen
description: Lade ein erfasstes Session-Artefakt anhand seiner ID herunter. Erfahre mehr über das Limit für vollständige Downloads, unterstützte Antworttypen und das Range-Verhalten.
aside: false
outline: false
apiReference:
  title: Session-Artefakt herunterladen
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Lädt ein vollständiges, unveränderliches Artefakt über seine ID aus List Session Artifacts herunter. Dateien bis 200 MiB werden unterstützt. Query-Parameter werden nicht akzeptiert; Range-Anfragen liefern nach der Zugriffsprüfung 416.
  groups:
    - title: Pfadparameter
      fields:
        - name: session_id
          type: string
          required: true
          description: Session-ID (Präfix ses_).
        - name: artifact_id
          type: string
          required: true
          description: Exakte, undurchsichtige art_-ID aus der Artefaktliste dieser Session. Anhang-IDs und Workspace-Pfade werden nicht akzeptiert.
    - title: Response-Header
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Aus der Dateiendung abgeleiteter Medientyp oder application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment mit dem Dateinamen des Artefakts.
        - name: Content-Length
          type: integer
          required: true
          description: Vollständige Dateigröße in Bytes.
        - name: Cache-Control
          type: string
          required: true
          description: no-store.
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

Eine erfolgreiche Antwort enthält die Dateibytes, kein JSON. Lade die ganze Datei herunter; Teilübertragungen und fortsetzbare Range-Downloads werden nicht unterstützt. Ein nicht verfügbares Artefakt liefert `404`; ein nicht verfügbarer Artefaktdienst liefert `executor_unavailable`.
