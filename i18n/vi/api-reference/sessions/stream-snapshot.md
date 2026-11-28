---
i18nSource: ee0012aea08b0ba3
title: Stream snapshot Session
description: Luồng sản phẩm bắt đầu bằng snapshot của Session.
aside: false
outline: false
apiReference:
  title: Stream snapshot Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/events/stream
  description: "Luồng mở rộng của SandBase. Phát session.snapshot trước ({session, items, turns, live_only: true}), sau đó là các sự kiện Session trực tiếp và heartbeat định kỳ. Khi upstream gặp lỗi, luồng phát stream.interrupted ({session_id, reconnect: true, resend_input: false}). cursor hoặc Last-Event-ID trả về 400. Gửi API key trong header Authorization hoặc X-API-Key."
  groups:
    - title: Tham số path
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (tiền tố ses_).
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
