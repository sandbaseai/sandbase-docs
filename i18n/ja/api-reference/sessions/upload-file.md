---
i18nSource: 116348cd4360a3c2
title: Session ファイルのアップロード
description: Session のワークスペースに添付ファイルをアップロードします。
aside: false
outline: false
apiReference:
  title: Session ファイルのアップロード
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: SandBase 拡張機能です。Session のワークスペースにファイルを 1 つ（multipart フィールド file、最大 5 MiB）アップロードします。Idempotency-Key は必須です。対応する拡張子：.txt、.md、.csv、.log、.json、.pdf、.png、.jpg、.jpeg、.webp。内容は拡張子と一致している必要があります。ファイル名には英字、数字、スペース、ドット、アンダースコア、ハイフンを使用できます。転送に失敗した場合でもレスポンスは 201 で、status は failed、error_code は attachment_unavailable になります。準備完了のファイルは、POST /v1/agents/sessions/{session_id}/events で file_ids を指定して送信します。
  groups:
    - title: パスパラメーター
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ プレフィックス）。
    - title: ヘッダー
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1〜128 文字。先頭と末尾に空白は使用できません。リトライ時は同じキーと同じボディを再利用してください。同じキーで異なるボディを送ると 409 を返します。
    - title: リクエストボディ
      description: multipart/form-data。
      fields:
        - name: file
          type: file
          required: true
          description: file パートを 1 つだけ指定します。
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
