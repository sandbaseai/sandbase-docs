---
i18nSource: 116348cd4360a3c2
title: Tải lên tệp Session
description: Tải một tệp đính kèm lên workspace của Session.
aside: false
outline: false
apiReference:
  title: Tải lên tệp Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: "Phần mở rộng của SandBase. Tải một tệp (trường multipart file, tối đa 5 MiB) lên workspace của Session. Idempotency-Key là bắt buộc. Phần mở rộng được hỗ trợ: .txt, .md, .csv, .log, .json, .pdf, .png, .jpg, .jpeg, .webp; nội dung phải khớp với phần mở rộng. Tên tệp gồm chữ cái, chữ số, dấu cách, dấu chấm, dấu gạch dưới và dấu gạch ngang. Nếu truyền tệp thất bại, phản hồi vẫn là 201 với status failed và error_code attachment_unavailable. Gửi tệp đã sẵn sàng bằng POST /v1/agents/sessions/{session_id}/events với file_ids."
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: session_id
          type: string
          required: true
          description: ID của Session (tiền tố ses_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1-128 ký tự, không có khoảng trắng ở đầu hoặc cuối. Dùng lại cùng key và body khi thử lại; cùng key với body khác sẽ trả về 409.
    - title: Body của request
      description: multipart/form-data.
      fields:
        - name: file
          type: file
          required: true
          description: Đúng một phần file.
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
