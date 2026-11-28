---
i18nSource: 6a0957a4943c8b1d
title: Embeddings
description: OpenAI 互換のベクトル埋め込み API です。入力、次元数、エンコーディング、追加フィールドは、選択したモデルとプロバイダーに依存します。
aside: false
outline: false
apiReference:
  title: Embeddings
  operation: Models
  method: POST
  path: /v1/embeddings
  description: OpenAI 互換のベクトル埋め込み API です。入力形式、次元数、エンコーディング、追加フィールドは、選択したモデルとプロバイダーに依存します。
  groups:
    - title: リクエストボディ
      fields:
        - name: model
          type: string
          required: true
          description: "埋め込みモデル ID（例: alibaba/text-embedding-v4）"
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: 埋め込むテキスト、トークン ID、またはテキストやトークン ID 配列のバッチ
        - name: dimensions
          type: integer
          required: false
          description: 選択したモデルが対応している場合の出力ベクトルの次元数。共通の次元数リストはありません
        - name: encoding_format
          type: string
          required: false
          description: 埋め込みのエンコーディング形式。float と base64 のどちらが使えるかはプロバイダーの対応状況によります
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
