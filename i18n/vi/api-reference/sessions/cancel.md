---
i18nSource: d4a2ec314b751b1b
title: Hủy Turn của Session
description: Hủy Turn đang chạy của một Session.
aside: false
outline: false
apiReference:
  title: Hủy Turn của Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: Phần mở rộng của SandBase. Yêu cầu hủy Turn đang chạy. Body có thể rỗng hoặc là {}. Bắt buộc có Idempotency-Key. Nếu Session đang rảnh, lệnh gọi vẫn trả về 202 với accepted là true và không thay đổi gì. Cách tiêu chuẩn thay thế là gửi sự kiện agent.session.input.cancel.
  groups:
    - title: Tham số path
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (tiền tố ses_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: 1-128 ký tự, không có khoảng trắng ở đầu hoặc cuối. Dùng lại cùng key và body khi thử lại; cùng key với body khác sẽ trả về 409.
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
