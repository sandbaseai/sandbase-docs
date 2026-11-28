---
i18nSource: 116348cd4360a3c2
title: 上傳 Session 檔案
description: 將附件上傳到 Session 工作區。
aside: false
outline: false
apiReference:
  title: 上傳 Session 檔案
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: SandBase 擴充功能。將一個檔案（multipart 欄位 file，最大 5 MiB）上傳到 Session 工作區。Idempotency-Key 為必填。支援的副檔名：.txt、.md、.csv、.log、.json、.pdf、.png、.jpg、.jpeg、.webp；內容必須與副檔名相符。檔案名稱可使用字母、數字、空格、句點、底線與連字號。若傳輸失敗，回應仍為 201，但 status 為 failed，error_code 為 attachment_unavailable。使用 POST /v1/agents/sessions/{session_id}/events 並搭配 file_ids 傳送已就緒的檔案。
  groups:
    - title: 路徑參數
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前綴）。
    - title: 標頭
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1 到 128 個字元，開頭與結尾不可有空白。重試時請重複使用相同的金鑰與主體；相同金鑰搭配不同主體會回傳 409。
    - title: 請求主體
      description: multipart/form-data。
      fields:
        - name: file
          type: file
          required: true
          description: 恰好一個 file 部分。
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
