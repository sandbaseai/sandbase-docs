---
i18nSource: 06a65ded83bf9438
title: 워크스페이스 파일 목록 조회
description: 현재 Session 워크스페이스 파일을 경로, 크기, 페이지네이션과 함께 조회합니다. 이 읽기 전용 엔드포인트는 파일 메타데이터를 반환합니다.
aside: false
outline: false
apiReference:
  title: 워크스페이스 파일 목록 조회
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Session 워크스페이스 디렉터리 하나에 있는 현재 파일 경로와 크기를 조회합니다. 메타데이터 전용 목록이며 첨부 파일 기록이나 아티팩트 콘텐츠가 아닙니다. 알 수 없거나 중복된 쿼리 매개변수는 400을 반환합니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사).
    - title: 쿼리 매개변수
      fields:
        - name: path
          type: string
          required: false
          description: 절대 디렉터리 /workspace 또는 그 아래의 정규화된 디렉터리입니다. 최대 4096바이트이며, 경로 탐색, 백슬래시, 후행 슬래시는 허용되지 않습니다.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: 페이지 크기(1~100)입니다.
          default: "20"
        - name: order
          type: string
          required: false
          description: "경로 정렬 순서: asc 또는 desc."
          default: asc
        - name: page
          type: string
          required: false
          description: 이전 응답의 불투명한 next 값입니다. 첫 페이지에서는 생략하고 빈 문자열을 보내지 마세요. path, order, limit은 변경하지 않고 유지합니다.
    - title: 응답 필드
      fields:
        - name: object
          type: string
          required: true
          description: 항상 page입니다.
        - name: data
          type: array
          required: true
          description: 현재 디렉터리의 파일이며, 각각 path와 size_bytes를 포함합니다. 재귀 목록이 아닙니다.
        - name: next
          type: string | null
          required: true
          description: 계속하려면 이 값을 page로 전달합니다. 마지막에는 null입니다.
        - name: has_more
          type: boolean
          required: true
          description: 다음 페이지가 있는지 여부입니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

워크스페이스 조회는 `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` 또는 `workspace_unavailable`을 반환할 수 있습니다. 커서가 유효하지 않으면 첫 페이지부터 다시 시작하세요. 다운로드할 수 있는 생성 결과물은 [Artifacts](./list-artifacts)에서 찾으세요.
