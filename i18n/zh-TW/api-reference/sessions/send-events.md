---
i18nSource: 57d5d4e3e9e72fe6
title: 傳送 Session 輸入
description: 傳送一個輸入或取消事件至 Session。
aside: false
outline: false
apiReference:
  title: 傳送 Session 輸入
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: '每個請求只能傳送一個事件：agent.session.input.message 或 agent.session.input.cancel。會回傳 202 且不含本文；請透過事件串流追蹤進度。SandBase 擴充形式 {"input": "…", "file_ids": [...]} 可傳送文字並附加最多 10 個已就緒的附件，且不可與 events 合併使用。409 session_input_pending 表示先前的輸入仍在傳遞中：請等待，不要使用新的金鑰重新傳送。'
  groups:
    - title: 路徑參數
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前綴）。
    - title: 標頭
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 選填但建議提供。重試相同輸入時請重複使用相同的金鑰。
    - title: 請求本文
      description: events 或 input/file_ids 擇一。
      fields:
        - name: events
          type: array
          required: false
          description: 剛好一個事件。input.message 以文字或一則 user input_text 訊息攜帶輸入；input.cancel 不攜帶輸入。
        - name: input
          type: string
          required: false
          description: SandBase 擴充功能。非空白文字，最多 256 KiB。
        - name: file_ids
          type: array
          required: false
          description: SandBase 擴充功能。最多 10 個不重複且狀態為 ready 的附件 ID。
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
