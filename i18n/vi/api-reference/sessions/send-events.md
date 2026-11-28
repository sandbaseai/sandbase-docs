---
i18nSource: 57d5d4e3e9e72fe6
title: Gửi input cho Session
description: Gửi một sự kiện input hoặc hủy tới Session.
aside: false
outline: false
apiReference:
  title: Gửi input cho Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: 'Gửi đúng một sự kiện mỗi request: agent.session.input.message hoặc agent.session.input.cancel. Trả về 202 không có body; theo dõi tiến trình trên luồng sự kiện. Dạng mở rộng của SandBase {"input": "…", "file_ids": [...]} gửi văn bản kèm tối đa 10 tệp đính kèm ở trạng thái ready và không thể kết hợp với events. Lỗi 409 session_input_pending nghĩa là input trước đó vẫn đang được chuyển đi: hãy chờ và đừng gửi lại với key mới.'
  groups:
    - title: Tham số path
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (tiền tố ses_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Tùy chọn nhưng nên dùng. Dùng lại cùng key khi thử lại cùng một input.
    - title: Body request
      description: Hoặc events, hoặc input/file_ids.
      fields:
        - name: events
          type: array
          required: false
          description: Đúng một sự kiện. input.message mang input dưới dạng văn bản hoặc một message input_text của người dùng; input.cancel không mang input.
        - name: input
          type: string
          required: false
          description: Phần mở rộng của SandBase. Văn bản không rỗng, tối đa 256 KiB.
        - name: file_ids
          type: array
          required: false
          description: Phần mở rộng của SandBase. Tối đa 10 ID tệp đính kèm khác nhau có status là ready.
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
