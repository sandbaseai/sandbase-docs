---
i18nSource: d2ed7aef4e21b148
title: ดึงข้อมูล Turn ของ Session
description: อ่าน Turn ของ Session หนึ่งรายการ
aside: false
outline: false
apiReference:
  title: ดึงข้อมูล Turn ของ Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/turns/{turn_id}
  description: อ่าน Turn หนึ่งรายการตาม ID หากเป็น ID ที่ไม่รู้จักจะได้ 404
  groups:
    - title: พารามิเตอร์พาธ
      fields:
        - name: session_id
          type: string
          required: true
          description: ID ของ Session (ขึ้นต้นด้วย ses_)
        - name: turn_id
          type: string
          required: true
          description: ID ของ Turn จากรายการ turn
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/turns/turn_… \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        turn = client.beta.agents.sessions.turns.retrieve("turn_…", session_id="ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83")
        print(turn.status)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/turns/turn_…",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/turns/turn_…', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
---

<ApiReferencePage />
