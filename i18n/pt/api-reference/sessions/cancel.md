---
i18nSource: d4a2ec314b751b1b
title: Cancelar turn da Session
description: Cancele o Turn em andamento de uma Session.
aside: false
outline: false
apiReference:
  title: Cancelar turn da Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: Extensão do SandBase. Solicita o cancelamento do Turn em andamento. O corpo pode estar vazio ou ser {}. Idempotency-Key é obrigatório. Se a Session estiver ociosa, a chamada ainda retorna 202 com accepted true e não altera nada. A alternativa padrão é enviar um evento agent.session.input.cancel.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: session_id
          type: string
          required: true
          description: ID da Session (prefixo ses_).
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: De 1 a 128 caracteres, sem espaços em branco no início ou no fim. Reutilize a mesma chave e o mesmo corpo ao tentar novamente; a mesma chave com um corpo diferente retorna 409.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-cancel-1" \
          -H "Content-Type: application/json" \
          -d '{}'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-cancel-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel",
            headers=headers,
            json={},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-cancel-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 202 Accepted
    code: |-
      {
        "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "accepted": true
      }
---

<ApiReferencePage />
