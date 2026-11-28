---
i18nSource: 57d5d4e3e9e72fe6
title: 发送 Session 输入
description: 向 Session 发送一个输入或取消事件。
aside: false
outline: false
apiReference:
  title: 发送 Session 输入
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: '每个请求只能发送一个事件：agent.session.input.message 或 agent.session.input.cancel。返回 202 且无响应体；请通过事件流跟踪进度。SandBase 扩展形式 {"input": "…", "file_ids": [...]} 可发送文本以及最多 10 个已就绪的附件，且不能与 events 同时使用。返回 409 session_input_pending 表示之前的输入仍在投递中：请等待，不要用新的键重新发送。'
  groups:
    - title: 路径参数
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前缀）。
    - title: 请求头
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 可选，但建议提供。重试同一输入时请复用相同的键。
    - title: 请求体
      description: events 或 input/file_ids 二选一。
      fields:
        - name: events
          type: array
          required: false
          description: 恰好一个事件。input.message 以文本或一条用户 input_text 消息的形式携带输入；input.cancel 不携带输入。
        - name: input
          type: string
          required: false
          description: SandBase 扩展。非空文本，最大 256 KiB。
        - name: file_ids
          type: array
          required: false
          description: SandBase 扩展。最多 10 个互不相同且状态为 ready 的附件 ID。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-input-1" \
          -H "Content-Type: application/json" \
          -d '{
            "events": [
              {
                "type": "agent.session.input.message",
                "input": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "input_text",
                        "text": "List three notable launches this week."
                      }
                    ]
                  }
                ]
              }
            ]
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        client.beta.agents.sessions.events.create(
            "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            events=[{
                "type": "agent.session.input.message",
                "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
            }],
        )
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-input-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events",
            headers=headers,
            json={
                "events": [
                    {
                        "type": "agent.session.input.message",
                        "input": [
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "input_text",
                                        "text": "List three notable launches this week."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        )
        response.raise_for_status()
        print(response.status_code)  # 202 Accepted, no body
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-input-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "events": [
              {
                "type": "agent.session.input.message",
                "input": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "input_text",
                        "text": "List three notable launches this week."
                      }
                    ]
                  }
                ]
              }
            ]
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(response.status); // 202 Accepted, no body
---

<ApiReferencePage />
