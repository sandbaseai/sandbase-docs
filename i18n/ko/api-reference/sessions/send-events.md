---
i18nSource: 57d5d4e3e9e72fe6
title: Session 입력 전송
description: Session에 입력 또는 취소 이벤트 하나를 보냅니다.
aside: false
outline: false
apiReference:
  title: Session 입력 전송
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: '요청마다 정확히 하나의 이벤트(agent.session.input.message 또는 agent.session.input.cancel)를 보냅니다. 본문 없이 202를 반환하며, 진행 상황은 이벤트 스트림에서 확인합니다. SandBase 확장 형식 {"input": "…", "file_ids": [...]}는 준비된 첨부 파일 최대 10개와 함께 텍스트를 보내며 events와 함께 사용할 수 없습니다. 409 session_input_pending은 이전 입력이 아직 전달 중이라는 뜻입니다. 기다리고, 새 키로 다시 보내지 마세요.'
  groups:
    - title: 경로 파라미터
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사)입니다.
    - title: 헤더
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 선택 사항이지만 권장합니다. 같은 입력을 재시도할 때는 같은 키를 재사용하세요.
    - title: 요청 본문
      description: events 또는 input/file_ids 중 하나입니다.
      fields:
        - name: events
          type: array
          required: false
          description: 정확히 하나의 이벤트입니다. input.message는 텍스트 또는 user input_text 메시지 하나로 input을 전달하며, input.cancel은 input을 전달하지 않습니다.
        - name: input
          type: string
          required: false
          description: SandBase 확장 기능입니다. 비어 있지 않은 텍스트이며 최대 256 KiB입니다.
        - name: file_ids
          type: array
          required: false
          description: SandBase 확장 기능입니다. 상태가 ready인 서로 다른 첨부 파일 ID 최대 10개입니다.
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
