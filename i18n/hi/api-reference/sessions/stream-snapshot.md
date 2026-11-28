---
i18nSource: ee0012aea08b0ba3
title: Session snapshot stream करें
description: Session snapshot से शुरू होने वाला product stream।
aside: false
outline: false
apiReference:
  title: Session snapshot stream करें
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/events/stream
  description: "SandBase extension stream। पहले session.snapshot ({session, items, turns, live_only: true}) भेजता है, फिर live Session events और समय-समय पर heartbeat। Upstream विफलता पर यह stream.interrupted ({session_id, reconnect: true, resend_input: false}) भेजता है। cursor या Last-Event-ID 400 लौटाता है। API key को Authorization या X-API-Key header में भेजें।"
  groups:
    - title: Path parameters
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ses_ prefix)।
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
