---
i18nSource: 116348cd4360a3c2
title: Subir archivo de Session
description: Sube un adjunto al workspace de una Session.
aside: false
outline: false
apiReference:
  title: Subir archivo de Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: "Extensión de SandBase. Sube un archivo (campo multipart file, hasta 5 MiB) al workspace de la Session. Idempotency-Key es obligatorio. Extensiones admitidas: .txt, .md, .csv, .log, .json, .pdf, .png, .jpg, .jpeg, .webp; el contenido debe coincidir con la extensión. Los nombres de archivo usan letras, dígitos, espacios, puntos, guiones bajos y guiones. Si la transferencia falla, la respuesta sigue siendo 201 con status failed y error_code attachment_unavailable. Envía un archivo listo con POST /v1/agents/sessions/{session_id}/events usando file_ids."
  groups:
    - title: Parámetros de ruta
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (prefijo ses_).
    - title: Encabezados
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: De 1 a 128 caracteres, sin espacios en blanco al principio ni al final. Reutiliza la misma clave y el mismo cuerpo al reintentar; la misma clave con un cuerpo distinto devuelve 409.
    - title: Cuerpo de la solicitud
      description: multipart/form-data.
      fields:
        - name: file
          type: file
          required: true
          description: Exactamente una parte file.
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
