---
i18nSource: 1a980a4dd8761b1b
title: Session 턴 목록
description: Session 턴 기록을 조회합니다.
aside: false
outline: false
apiReference:
  title: Session 턴 목록
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/turns
  description: 커서 페이지네이션으로 Turn을 조회합니다. Turn은 하나의 입력과 그 입력이 촉발한 작업을 상태와 함께 묶은 단위입니다. Turn 하나를 조회하려면 GET /v1/agents/sessions/{session_id}/turns/{turn_id}를 사용하세요.
  groups:
    - title: 경로 파라미터
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사).
    - title: 쿼리 파라미터
      fields:
        - name: limit
          type: integer
          required: false
          description: 1에서 100 사이의 페이지 크기. 범위를 벗어난 값은 400을 반환합니다.
          default: "20"
        - name: after
          type: string
          required: false
          description: 커서. 이전 페이지의 last_id를 전달하세요.
        - name: order
          type: string
          required: false
          description: 생성 시간 기준 asc 또는 desc.
          default: desc
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/turns?order=asc&limit=50" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        page = client.beta.agents.sessions.turns.list("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83", order="asc", limit=50)
        for row in page.data:
            print(row.id)
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
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/turns?order=asc&limit=50",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/turns?order=asc&limit=50', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
---

<ApiReferencePage />
