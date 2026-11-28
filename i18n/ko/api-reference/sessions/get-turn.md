---
i18nSource: d2ed7aef4e21b148
title: Session Turn 조회
description: Session Turn 하나를 조회합니다.
aside: false
outline: false
apiReference:
  title: Session Turn 조회
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/turns/{turn_id}
  description: ID로 Turn 하나를 조회합니다. 알 수 없는 ID는 404를 반환합니다.
  groups:
    - title: 경로 파라미터
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사)입니다.
        - name: turn_id
          type: string
          required: true
          description: Turn 목록에서 얻은 Turn ID입니다.
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
