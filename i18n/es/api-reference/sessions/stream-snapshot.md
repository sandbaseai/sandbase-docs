---
i18nSource: ee0012aea08b0ba3
title: Transmitir instantánea de Session
description: Flujo de producto que empieza con una instantánea de la Session.
aside: false
outline: false
apiReference:
  title: Transmitir instantánea de Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/events/stream
  description: "Flujo de extensión de SandBase. Emite primero session.snapshot ({session, items, turns, live_only: true}) y después los eventos en vivo de la Session y un heartbeat periódico. Si falla el servicio de origen, emite stream.interrupted ({session_id, reconnect: true, resend_input: false}). cursor o Last-Event-ID devuelven 400. Envía la API key en el encabezado Authorization o X-API-Key."
  groups:
    - title: Parámetros de ruta
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (prefijo ses_).
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events/stream \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Accept: text/event-stream"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Accept": "text/event-stream",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events/stream",
            headers=headers,
            stream=True,
        )
        response.raise_for_status()
        for line in response.iter_lines(decode_unicode=True):
            if line:
                print(line)
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events/stream', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Accept': 'text/event-stream',
          },
        });

        if (!response.ok) throw new Error(await response.text());
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          process.stdout.write(decoder.decode(value));
        }
---

<ApiReferencePage />
