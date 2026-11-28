---
i18nSource: d4a2ec314b751b1b
title: Membatalkan Turn Session
description: Batalkan Turn Session yang sedang berjalan.
aside: false
outline: false
apiReference:
  title: Membatalkan Turn Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: Ekstensi SandBase. Meminta pembatalan Turn yang sedang berjalan. Body boleh kosong atau {}. Idempotency-Key wajib diisi. Jika Session dalam keadaan idle, panggilan tetap mengembalikan 202 dengan accepted true dan tidak mengubah apa pun. Alternatif standarnya adalah mengirim event agent.session.input.cancel.
  groups:
    - title: Parameter path
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (prefiks ses_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1-128 karakter, tanpa spasi di awal atau akhir. Gunakan kunci dan body yang sama saat mencoba ulang; kunci yang sama dengan body berbeda mengembalikan 409.
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
