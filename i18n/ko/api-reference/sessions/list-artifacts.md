---
i18nSource: 270917aea416aa76
title: Session 아티팩트 목록 조회
description: 캡처된 Session 출력 아티팩트를 커서 페이지네이션, 불투명 ID, 파일 크기, 다운로드 링크와 함께 나열합니다.
aside: false
outline: false
apiReference:
  title: Session 아티팩트 목록 조회
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: 이 Session에서 생성된 변경 불가능한 출력을 나열합니다. 아티팩트 ID는 Session 범위의 불투명 핸들이므로, 반환된 ID를 그대로 다운로드 엔드포인트에 전달하세요. 알 수 없거나 중복된 쿼리 매개변수는 400을 반환합니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사).
    - title: 쿼리 매개변수
      fields:
        - name: limit
          type: integer
          required: false
          description: 1에서 100 사이의 페이지 크기입니다. 잘못된 값은 400을 반환합니다.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc 또는 desc.
          default: desc
        - name: after
          type: string
          required: false
          description: 이전 페이지에서 last_id로 반환된 아티팩트 ID입니다. 이어서 조회할 때는 같은 order를 유지하세요.
    - title: 아티팩트 객체
      fields:
        - name: object
          type: string
          required: true
          description: 항상 agent.session.artifact입니다.
        - name: id
          type: string
          required: true
          description: 불투명 art_ 핸들입니다. 직접 만들거나 디코딩하지 마세요.
        - name: session_id
          type: string
          required: true
          description: 소유 Session ID입니다.
        - name: path
          type: string
          required: true
          description: /workspace/outputs/ 아래의 생성된 출력 경로입니다.
        - name: size_bytes
          type: integer
          required: true
          description: 아티팩트 크기(바이트)입니다.
        - name: created_at
          type: integer
          required: true
          description: 생성 타임스탬프(Unix 초)입니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

예제의 핸들은 예시일 뿐입니다. [아티팩트 다운로드](./download-artifact)에는 직접 보낸 요청이 반환한 `id`를 사용하세요. `has_more`가 true이면 다음 페이지를 위해 `after=last_id`를 보냅니다. 목록이 비어 있으면 `first_id`와 `last_id`는 null입니다. 아티팩트 메타데이터를 조회하는 별도 GET 엔드포인트는 제공되지 않습니다.
