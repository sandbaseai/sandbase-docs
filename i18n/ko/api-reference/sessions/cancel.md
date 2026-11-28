---
i18nSource: d4a2ec314b751b1b
title: Session Turn 취소
description: Session에서 진행 중인 Turn을 취소합니다.
aside: false
outline: false
apiReference:
  title: Session Turn 취소
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: SandBase 확장 기능입니다. 진행 중인 Turn의 취소를 요청합니다. 본문은 비어 있거나 {}일 수 있습니다. Idempotency-Key는 필수입니다. Session이 유휴 상태여도 accepted true와 함께 202를 반환하며 아무것도 변경하지 않습니다. 표준 대안은 agent.session.input.cancel 이벤트를 보내는 것입니다.
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
          required: true
          description: 1~128자이며 앞뒤 공백은 허용되지 않습니다. 재시도할 때는 같은 키와 본문을 재사용하세요. 같은 키에 다른 본문을 보내면 409를 반환합니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-cancel-1" \
          -H "Content-Type: application/json" \
          -d '{}'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-cancel-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel",
            headers=headers,
            json={},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-cancel-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 202 Accepted
    code: |-
      {
        "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "accepted": true
      }
---

<ApiReferencePage />
