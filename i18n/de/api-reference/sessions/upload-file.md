---
i18nSource: 116348cd4360a3c2
title: Session-Datei hochladen
description: Einen Anhang in den Workspace einer Session hochladen.
aside: false
outline: false
apiReference:
  title: Session-Datei hochladen
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: "SandBase-Erweiterung. Lädt eine Datei (Multipart-Feld file, bis zu 5 MiB) in den Session-Workspace hoch. Idempotency-Key ist erforderlich. Unterstützte Endungen: .txt, .md, .csv, .log, .json, .pdf, .png, .jpg, .jpeg, .webp; der Inhalt muss zur Endung passen. Dateinamen bestehen aus Buchstaben, Ziffern, Leerzeichen, Punkten, Unterstrichen und Bindestrichen. Schlägt die Übertragung fehl, ist die Antwort trotzdem 201 mit status failed und error_code attachment_unavailable. Sende eine fertige Datei mit POST /v1/agents/sessions/{session_id}/events über file_ids."
  groups:
    - title: Pfadparameter
      fields:
        - name: session_id
          type: string
          required: true
          description: Session-ID (Präfix ses_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1–128 Zeichen, ohne führende oder nachgestellte Leerzeichen. Verwende bei Wiederholungen denselben Schlüssel und denselben Body; derselbe Schlüssel mit einem anderen Body liefert 409.
    - title: Request-Body
      description: multipart/form-data.
      fields:
        - name: file
          type: file
          required: true
          description: Genau ein file-Teil.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: upload-q3-report" \
          -F "file=@q3-report.pdf;type=application/pdf"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "upload-q3-report",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files",
            headers=headers,
            files={"file": open("q3-report.pdf", "rb")},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('file', new Blob([await readFile('q3-report.pdf')], { type: 'application/pdf' }), 'q3-report.pdf');

        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'upload-q3-report',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72",
        "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "name": "q3-report.pdf",
        "mime_type": "application/pdf",
        "size_bytes": 482113,
        "status": "ready",
        "created_at": "2026-10-06T08:10:00Z",
        "updated_at": "2026-10-06T08:10:02Z"
      }
---

<ApiReferencePage />
