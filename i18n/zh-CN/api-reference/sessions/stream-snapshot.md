---
i18nSource: ee0012aea08b0ba3
title: 流式获取 Session 快照
description: 以 Session 快照开头的产品级事件流。
aside: false
outline: false
apiReference:
  title: 流式获取 Session 快照
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/events/stream
  description: "SandBase 扩展事件流。首先发出 session.snapshot（{session, items, turns, live_only: true}），随后发出实时 Session 事件和定期 heartbeat。上游失败时会发出 stream.interrupted（{session_id, reconnect: true, resend_input: false}）。传入 cursor 或 Last-Event-ID 将返回 400。请在 Authorization 或 X-API-Key 请求头中发送 API 密钥。"
  groups:
    - title: 路径参数
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前缀）。
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
