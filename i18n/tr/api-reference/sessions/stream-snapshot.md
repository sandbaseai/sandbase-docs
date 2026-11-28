---
i18nSource: ee0012aea08b0ba3
title: Session Anlık Görüntüsünü Akışla Al
description: Bir Session anlık görüntüsüyle başlayan ürün akışı.
aside: false
outline: false
apiReference:
  title: Session Anlık Görüntüsünü Akışla Al
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/events/stream
  description: "SandBase uzantı akışı. Önce session.snapshot ({session, items, turns, live_only: true}), ardından canlı Session olaylarını ve periyodik heartbeat olaylarını yayar. Upstream hatasında stream.interrupted ({session_id, reconnect: true, resend_input: false}) yayar. cursor veya Last-Event-ID 400 döndürür. API anahtarını Authorization veya X-API-Key başlığında gönderin."
  groups:
    - title: Yol parametreleri
      fields:
        - name: session_id
          type: string
          required: true
          description: Session kimliği (ses_ önekli).
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
