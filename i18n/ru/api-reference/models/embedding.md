---
i18nSource: 6a0957a4943c8b1d
title: Эмбеддинги
description: OpenAI-совместимый API векторных эмбеддингов. Ввод, размерность, кодировка и дополнительные поля зависят от выбранной модели и провайдера.
aside: false
outline: false
apiReference:
  title: Эмбеддинги
  operation: Models
  method: POST
  path: /v1/embeddings
  description: OpenAI-совместимый API векторных эмбеддингов. Формы ввода, размерность, кодировка и дополнительные поля зависят от выбранной модели и провайдера.
  groups:
    - title: Тело запроса
      fields:
        - name: model
          type: string
          required: true
          description: ID модели эмбеддингов, например alibaba/text-embedding-v4
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: Текст, ID токенов или пакет текстов или массивов ID токенов для эмбеддинга
        - name: dimensions
          type: integer
          required: false
          description: Размерность выходного вектора, если выбранная модель это поддерживает; универсального списка размерностей нет
        - name: encoding_format
          type: string
          required: false
          description: Формат кодирования эмбеддинга. Доступность float или base64 зависит от провайдера
  examples:
    - label: HTTP
      language: http
      code: |-
        POST https://api.sandbase.ai/v1/embeddings
        Authorization: Bearer sk-your-api-key
        Content-Type: application/json

        {"model":"alibaba/text-embedding-v4","input":"SandBase provides a unified API for AI models, agents, and developer tools.","dimensions":1024,"encoding_format":"float"}
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(
            api_key="sk-YOUR_KEY",
            base_url="https://api.sandbase.ai/v1",
        )

        response = client.embeddings.create(
            model="alibaba/text-embedding-v4",
            input="SandBase provides a unified API for AI models, agents, and developer tools.",
            dimensions=1024,
            encoding_format="float",
        )

        embedding = response.data[0].embedding
        print(f"Dimensions: {len(embedding)}")
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from 'openai';

        const client = new OpenAI({
          apiKey: 'sk-YOUR_KEY',
          baseURL: 'https://api.sandbase.ai/v1',
        });

        const response = await client.embeddings.create({
          model: 'alibaba/text-embedding-v4',
          input: 'SandBase provides a unified API for AI models, agents, and developer tools.',
          dimensions: 1024,
          encoding_format: 'float',
        });

        console.log(response.data[0].embedding.length);
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "embedding",
            "index": 0,
            "embedding": [0.0123, -0.0045, 0.0312]
          }
        ],
        "model": "alibaba/text-embedding-v4",
        "usage": {
          "prompt_tokens": 16,
          "total_tokens": 16
        }
      }
---

<ApiReferencePage />
