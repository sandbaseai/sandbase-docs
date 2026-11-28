---
i18nSource: d4a2ec314b751b1b
title: Anuluj turę sesji
description: Anuluje trwającą turę sesji.
aside: false
outline: false
apiReference:
  title: Anuluj turę sesji
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: Rozszerzenie SandBase. Żąda anulowania trwającej tury (Turn). Treść może być pusta lub mieć postać {}. Nagłówek Idempotency-Key jest wymagany. Jeśli sesja jest bezczynna, wywołanie i tak zwraca 202 z accepted true i niczego nie zmienia. Standardową alternatywą jest wysłanie zdarzenia agent.session.input.cancel.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: session_id
          type: string
          required: true
          description: Identyfikator sesji (prefiks ses_).
    - title: Nagłówki
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: Od 1 do 128 znaków, bez białych znaków na początku i końcu. Przy ponawianiu używaj tego samego klucza i tej samej treści; ten sam klucz z inną treścią zwraca 409.
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
