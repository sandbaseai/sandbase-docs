---
i18nSource: 116348cd4360a3c2
title: 上传 Session 文件
description: 将附件上传到 Session 工作区。
aside: false
outline: false
apiReference:
  title: 上传 Session 文件
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: SandBase 扩展。将一个文件（multipart 字段 file，最大 5 MiB）上传到 Session 工作区。必须提供 Idempotency-Key。支持的扩展名：.txt、.md、.csv、.log、.json、.pdf、.png、.jpg、.jpeg、.webp；内容必须与扩展名一致。文件名可使用字母、数字、空格、点、下划线和连字符。如果传输失败，响应仍为 201，status 为 failed，error_code 为 attachment_unavailable。使用 POST /v1/agents/sessions/{session_id}/events 并通过 file_ids 发送已就绪的文件。
  groups:
    - title: 路径参数
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前缀）。
    - title: 请求头
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1-128 个字符，首尾不能有空白。重试时请复用相同的键和请求体；相同的键搭配不同的请求体会返回 409。
    - title: 请求体
      description: multipart/form-data。
      fields:
        - name: file
          type: file
          required: true
          description: 恰好一个 file 部分。
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
