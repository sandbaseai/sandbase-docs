---
i18nSource: faccf5122e785ea0
title: Session 아티팩트 다운로드
description: ID로 캡처된 Session 아티팩트를 다운로드합니다. 전체 파일 다운로드 한도, 지원되는 응답 유형, Range 동작을 설명합니다.
aside: false
outline: false
apiReference:
  title: Session 아티팩트 다운로드
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Session 아티팩트 목록 조회에서 받은 ID로 변경 불가능한 아티팩트 전체를 다운로드합니다. 최대 200 MiB 파일까지 지원됩니다. 쿼리 매개변수는 허용되지 않으며, Range 요청은 접근 검증 후 416을 반환합니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사).
        - name: artifact_id
          type: string
          required: true
          description: 이 Session 아티팩트 목록이 반환한 불투명 art_ ID 그대로입니다. 첨부 파일 ID와 워크스페이스 경로는 허용되지 않습니다.
    - title: 응답 헤더
      fields:
        - name: Content-Type
          type: string
          required: true
          description: 파일 확장자로 추론한 미디어 유형 또는 application/octet-stream입니다.
        - name: Content-Disposition
          type: string
          required: true
          description: 아티팩트 파일 이름이 포함된 attachment입니다.
        - name: Content-Length
          type: integer
          required: true
          description: 전체 파일 크기(바이트)입니다.
        - name: Cache-Control
          type: string
          required: true
          description: no-store.
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

성공 응답은 JSON이 아니라 파일 바이트입니다. 파일 전체를 다운로드하세요. 부분 전송과 이어받기용 Range 다운로드는 지원되지 않습니다. 사용할 수 없는 아티팩트는 `404`를 반환하고, 아티팩트 서비스를 사용할 수 없으면 `executor_unavailable`을 반환합니다.
