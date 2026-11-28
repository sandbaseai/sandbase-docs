---
i18nSource: 57d5d4e3e9e72fe6
title: Отправить ввод в сессию
description: Отправка в сессию одного события ввода или отмены.
aside: false
outline: false
apiReference:
  title: Отправить ввод в сессию
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: 'Отправляйте ровно одно событие за запрос: agent.session.input.message или agent.session.input.cancel. Возвращает 202 без тела; следите за ходом выполнения в потоке событий. Форма расширения SandBase {"input": "…", "file_ids": [...]} отправляет текст вместе с не более чем 10 готовыми вложениями и не может сочетаться с events. Ответ 409 session_input_pending означает, что предыдущий ввод ещё доставляется: подождите и не отправляйте его повторно с новым ключом.'
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
          required: false
          description: Необязательно, но рекомендуется. При повторной отправке того же ввода используйте тот же ключ.
    - title: Тело запроса
      description: Либо events, либо input/file_ids.
      fields:
        - name: events
          type: array
          required: false
          description: Ровно одно событие. input.message передаёт input в виде текста или одного пользовательского сообщения input_text; input.cancel не содержит input.
        - name: input
          type: string
          required: false
          description: Расширение SandBase. Непустой текст до 256 КиБ.
        - name: file_ids
          type: array
          required: false
          description: Расширение SandBase. До 10 различных ID вложений со статусом ready.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-input-1" \
          -H "Content-Type: application/json" \
          -d '{
            "events": [
              {
                "type": "agent.session.input.message",
                "input": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "input_text",
                        "text": "List three notable launches this week."
                      }
                    ]
                  }
                ]
              }
            ]
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        client.beta.agents.sessions.events.create(
            "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            events=[{
                "type": "agent.session.input.message",
                "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
            }],
        )
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-input-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events",
            headers=headers,
            json={
                "events": [
                    {
                        "type": "agent.session.input.message",
                        "input": [
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "input_text",
                                        "text": "List three notable launches this week."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        )
        response.raise_for_status()
        print(response.status_code)  # 202 Accepted, no body
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-input-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "events": [
              {
                "type": "agent.session.input.message",
                "input": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "input_text",
                        "text": "List three notable launches this week."
                      }
                    ]
                  }
                ]
              }
            ]
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(response.status); // 202 Accepted, no body
---

<ApiReferencePage />
