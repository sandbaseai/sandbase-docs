---
i18nSource: d6c92171e494b8d9
title: Baixar arquivo da Session
description: Baixe um anexo de uma Session.
aside: false
outline: false
apiReference:
  title: Baixar arquivo da Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/files/{file_id}/content
  description: Baixa os bytes originais de um anexo pronto. Outros status retornam 404.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: session_id
          type: string
          required: true
          description: ID da Session (prefixo ses_).
        - name: file_id
          type: string
          required: true
          description: ID do anexo (prefixo fil_).
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files/fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72/content \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files/fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72/content",
            headers=headers,
        )
        response.raise_for_status()
        with open("q3-report.pdf", "wb") as f:
            f.write(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files/fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72/content', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        const bytes = new Uint8Array(await response.arrayBuffer());
        console.log(bytes.length, response.headers.get('content-type'));
---

<ApiReferencePage />
