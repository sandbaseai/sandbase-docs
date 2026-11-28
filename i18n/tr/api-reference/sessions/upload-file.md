---
i18nSource: 116348cd4360a3c2
title: Session dosyası yükleme
description: Bir Session çalışma alanına ek yükleyin.
aside: false
outline: false
apiReference:
  title: Session dosyası yükleme
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/files
  description: "SandBase uzantısı. Session çalışma alanına bir dosya yükleyin (file multipart alanı, en fazla 5 MiB). Idempotency-Key zorunludur. Desteklenen uzantılar: .txt, .md, .csv, .log, .json, .pdf, .png, .jpg, .jpeg, .webp; içerik uzantıyla eşleşmelidir. Dosya adları harf, rakam, boşluk, nokta, alt çizgi ve kısa çizgi kullanır. Aktarım başarısız olursa yanıt yine de 201 olur; status failed ve error_code attachment_unavailable değerini taşır. Hazır bir dosyayı file_ids kullanarak POST /v1/agents/sessions/{session_id}/events ile gönderin."
  groups:
    - title: Yol parametreleri
      fields:
        - name: session_id
          type: string
          required: true
          description: Session kimliği (ses_ önekli).
    - title: Başlıklar
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1-128 karakter, başında veya sonunda boşluk olmadan. Yeniden denerken aynı anahtarı ve gövdeyi kullanın; aynı anahtarın farklı bir gövdeyle kullanılması 409 döndürür.
    - title: İstek gövdesi
      description: multipart/form-data.
      fields:
        - name: file
          type: file
          required: true
          description: Tam olarak bir file parçası.
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
