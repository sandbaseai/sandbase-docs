---
i18nSource: 116348cd4360a3c2
title: Téléverser un fichier de Session
description: Téléverser une pièce jointe dans le workspace d'une Session.
aside: false
outline: false
apiReference:
  title: Téléverser un fichier de Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: "Extension SandBase. Téléverse un fichier (champ multipart file, 5 MiB au maximum) dans le workspace de la Session. Idempotency-Key est obligatoire. Extensions prises en charge : .txt, .md, .csv, .log, .json, .pdf, .png, .jpg, .jpeg, .webp ; le contenu doit correspondre à l'extension. Les noms de fichiers peuvent contenir des lettres, des chiffres, des espaces, des points, des underscores et des tirets. Si le transfert échoue, la réponse reste un 201 avec le statut failed et error_code attachment_unavailable. Envoyez un fichier prêt avec POST /v1/agents/sessions/{session_id}/events en utilisant file_ids."
  groups:
    - title: Paramètres de chemin
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (préfixe ses_).
    - title: En-têtes
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1 à 128 caractères, sans espace au début ni à la fin. Réutilisez la même clé et le même corps lors des nouvelles tentatives ; la même clé avec un corps différent renvoie 409.
    - title: Corps de la requête
      description: multipart/form-data.
      fields:
        - name: file
          type: file
          required: true
          description: Exactement une partie file.
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
