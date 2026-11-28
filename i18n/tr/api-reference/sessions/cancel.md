---
i18nSource: d4a2ec314b751b1b
title: Session Turunu İptal Et
description: Bir Session'ın devam eden turunu iptal edin.
aside: false
outline: false
apiReference:
  title: Session Turunu İptal Et
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: SandBase uzantısı. Devam eden turun iptal edilmesini ister. Gövde boş veya {} olabilir. Idempotency-Key zorunludur. Session boştaysa çağrı yine accepted true ile 202 döndürür ve hiçbir şeyi değiştirmez. Standart alternatif, bir agent.session.input.cancel olayı göndermektir.
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
          description: 1-128 karakter, başta veya sonda boşluk olmadan. Yeniden denerken aynı anahtarı ve gövdeyi kullanın; aynı anahtar farklı bir gövdeyle 409 döndürür.
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
