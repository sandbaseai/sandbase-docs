---
i18nSource: d4a2ec314b751b1b
title: Session Turn cancel करें
description: किसी Session का चल रहा Turn cancel करें।
aside: false
outline: false
apiReference:
  title: Session Turn cancel करें
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: SandBase extension। चल रहे Turn को cancel करने का अनुरोध करें। Body खाली या {} हो सकती है। Idempotency-Key आवश्यक है। यदि Session idle है, तब भी call accepted true के साथ 202 लौटाती है और कुछ नहीं बदलता। मानक विकल्प agent.session.input.cancel event भेजना है।
  groups:
    - title: Path parameters
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ses_ prefix)।
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1-128 characters, शुरुआत या अंत में whitespace नहीं। Retry करते समय वही key और body दोबारा उपयोग करें; अलग body के साथ वही key 409 लौटाती है।
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
