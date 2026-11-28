---
i18nSource: 8c5a71725812bd56
title: สตรีมอีเวนต์ของ Session
description: สมัครรับอีเวนต์ของ Session แบบเรียลไทม์ผ่าน server-sent events
aside: false
outline: false
apiReference:
  title: สตรีมอีเวนต์ของ Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/events
  description: 'เปิดสตรีมอีเวนต์แบบเรียลไทม์ของระบบ (text/event-stream) ให้เปิดสตรีมก่อนส่งอินพุต สตรีมนี้เป็นแบบเรียลไทม์เท่านั้น: Last-Event-ID หรือ query after จะได้ 400 และอีเวนต์ที่เกิดขึ้นระหว่างที่คุณตัดการเชื่อมต่อจะไม่ถูกส่งซ้ำ ให้อ่านจาก items หรือ turns แทน เซิร์ฟเวอร์จะเขียนคอมเมนต์ ": connected" ก่อน ประเภทอีเวนต์ขึ้นต้นด้วย agent.session'
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ขึ้นต้นด้วย ses_)
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Accept: text/event-stream"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with client.beta.agents.sessions.events.stream("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83") as stream:
            for event in stream:
                print(event.type)
                # The stream is live-only and stays open; stop at a terminal turn event.
                if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
                    break
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
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events",
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
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events', {
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
