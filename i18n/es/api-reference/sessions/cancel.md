---
i18nSource: d4a2ec314b751b1b
title: Cancelar turno de Session
description: Cancela el turno en curso de una Session.
aside: false
outline: false
apiReference:
  title: Cancelar turno de Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: Extensión de SandBase. Solicita la cancelación del turno en curso. El cuerpo puede estar vacío o ser {}. Idempotency-Key es obligatorio. Si la Session está inactiva, la llamada igualmente devuelve 202 con accepted true y no cambia nada. La alternativa estándar es enviar un evento agent.session.input.cancel.
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
          description: De 1 a 128 caracteres, sin espacios al principio ni al final. Reutiliza la misma clave y el mismo cuerpo al reintentar; la misma clave con un cuerpo distinto devuelve 409.
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
