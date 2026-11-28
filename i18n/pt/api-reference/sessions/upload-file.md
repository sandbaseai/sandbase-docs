---
i18nSource: 116348cd4360a3c2
title: Fazer upload de arquivo da Session
description: Faça upload de um anexo para o workspace de uma Session.
aside: false
outline: false
apiReference:
  title: Fazer upload de arquivo da Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: "Extensão da SandBase. Faça upload de um arquivo (campo multipart file, até 5 MiB) para o workspace da Session. Idempotency-Key é obrigatório. Extensões suportadas: .txt, .md, .csv, .log, .json, .pdf, .png, .jpg, .jpeg, .webp; o conteúdo deve corresponder à extensão. Nomes de arquivo usam letras, dígitos, espaços, pontos, sublinhados e hifens. Se a transferência falhar, a resposta ainda é 201 com status failed e error_code attachment_unavailable. Envie um arquivo pronto com POST /v1/agents/sessions/{session_id}/events usando file_ids."
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: session_id
          type: string
          required: true
          description: ID da Session (prefixo ses_).
    - title: Cabeçalhos
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: De 1 a 128 caracteres, sem espaços no início ou no fim. Reutilize a mesma chave e o mesmo corpo ao repetir; a mesma chave com um corpo diferente retorna 409.
    - title: Corpo da requisição
      description: multipart/form-data.
      fields:
        - name: file
          type: file
          required: true
          description: Exatamente uma parte file.
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
