---
i18nSource: 7f46c6a48c4e28b0
title: Список элементов Session
description: Прочитайте историю элементов Session.
aside: false
outline: false
apiReference:
  title: Список элементов Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/items
  description: Возвращает элементы диалога (сообщения, вызовы инструментов и их результаты) с курсорной пагинацией. Используйте этот метод, чтобы получить вывод, созданный, пока поток не был открыт.
  groups:
    - title: Параметры пути
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (префикс ses_).
    - title: Параметры запроса
      fields:
        - name: limit
          type: integer
          required: false
          description: Размер страницы от 1 до 100. Значения вне диапазона возвращают 400.
          default: "20"
        - name: after
          type: string
          required: false
          description: Курсор. Передайте last_id с предыдущей страницы.
        - name: order
          type: string
          required: false
          description: asc или desc по времени создания.
          default: desc
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc&limit=50" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        page = client.beta.agents.sessions.items.list("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83", order="asc", limit=50)
        for row in page.data:
            print(row.id)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc&limit=50",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc&limit=50', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
---

<ApiReferencePage />
