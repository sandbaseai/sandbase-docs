---
i18nSource: f54be114abbeca64
title: Xóa Session
description: Xóa (lưu trữ) một Session.
aside: false
outline: false
apiReference:
  title: Xóa Session
  operation: Sessions
  method: DELETE
  path: /v1/agents/sessions/{session_id}
  description: Lưu trữ Session. Session không bị xóa vĩnh viễn; lịch sử vẫn đọc được và bạn có thể bỏ lưu trữ sau.
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
        curl -X DELETE https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        result = client.beta.agents.sessions.delete("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83")
        print(result.deleted)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "DELETE",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "object": "agent.session.deleted",
        "deleted": true
      }
---

<ApiReferencePage />
