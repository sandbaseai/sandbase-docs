---
i18nSource: ee0012aea08b0ba3
title: Session 스냅샷 스트림
description: Session 스냅샷으로 시작하는 제품 스트림입니다.
aside: false
outline: false
apiReference:
  title: Session 스냅샷 스트림
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/events/stream
  description: "SandBase 확장 스트림입니다. 먼저 session.snapshot({session, items, turns, live_only: true})을 보낸 뒤 실시간 Session 이벤트와 주기적인 heartbeat를 보냅니다. 업스트림 장애가 발생하면 stream.interrupted({session_id, reconnect: true, resend_input: false})를 보냅니다. cursor 또는 Last-Event-ID를 보내면 400을 반환합니다. API 키는 Authorization 또는 X-API-Key 헤더로 보내세요."
  groups:
    - title: 경로 파라미터
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사)입니다.
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
