---
i18nSource: 116348cd4360a3c2
title: Session 파일 업로드
description: Session 워크스페이스에 첨부 파일을 업로드합니다.
aside: false
outline: false
apiReference:
  title: Session 파일 업로드
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: "SandBase 확장 기능입니다. Session 워크스페이스에 파일 하나(multipart 필드 file, 최대 5 MiB)를 업로드합니다. Idempotency-Key가 필요합니다. 지원되는 확장자: .txt, .md, .csv, .log, .json, .pdf, .png, .jpg, .jpeg, .webp. 내용은 확장자와 일치해야 합니다. 파일 이름에는 문자, 숫자, 공백, 점, 밑줄, 하이픈을 사용할 수 있습니다. 전송에 실패해도 응답은 201이며, status는 failed, error_code는 attachment_unavailable입니다. 준비된 파일은 file_ids를 사용해 POST /v1/agents/sessions/{session_id}/events로 보내세요."
  groups:
    - title: 경로 파라미터
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사).
    - title: 헤더
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1–128자이며 앞뒤 공백은 허용되지 않습니다. 재시도할 때는 같은 키와 본문을 다시 사용하세요. 같은 키에 다른 본문을 보내면 409를 반환합니다.
    - title: 요청 본문
      description: multipart/form-data.
      fields:
        - name: file
          type: file
          required: true
          description: file 파트가 정확히 하나여야 합니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: upload-q3-report" \
          -F "file=@q3-report.pdf;type=application/pdf"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "upload-q3-report",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files",
            headers=headers,
            files={"file": open("q3-report.pdf", "rb")},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('file', new Blob([await readFile('q3-report.pdf')], { type: 'application/pdf' }), 'q3-report.pdf');

        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'upload-q3-report',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72",
        "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "name": "q3-report.pdf",
        "mime_type": "application/pdf",
        "size_bytes": 482113,
        "status": "ready",
        "created_at": "2026-10-06T08:10:00Z",
        "updated_at": "2026-10-06T08:10:02Z"
      }
---

<ApiReferencePage />
