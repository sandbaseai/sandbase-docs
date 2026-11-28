---
i18nSource: d4a2ec314b751b1b
title: Отменить ход сессии
description: Отмена текущего хода сессии.
aside: false
outline: false
apiReference:
  title: Отменить ход сессии
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: Расширение SandBase. Запрашивает отмену текущего хода. Тело может быть пустым или {}. Заголовок Idempotency-Key обязателен. Если сессия простаивает, вызов всё равно возвращает 202 с accepted true и ничего не меняет. Стандартная альтернатива — отправить событие agent.session.input.cancel.
  groups:
    - title: Параметры пути
      fields:
        - name: session_id
          type: string
          required: true
          description: ID сессии (префикс ses_).
    - title: Заголовки
      fields:
        - name: Idempotency-Key
          type: string
          required: true
          description: От 1 до 128 символов, без пробелов в начале и в конце. При повторе используйте тот же ключ и то же тело; тот же ключ с другим телом возвращает 409.
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
