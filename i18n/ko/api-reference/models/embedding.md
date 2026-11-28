---
i18nSource: 6a0957a4943c8b1d
title: 임베딩
description: OpenAI 호환 벡터 임베딩 API입니다. 입력, 차원, 인코딩, 추가 필드는 선택한 모델과 공급자에 따라 다릅니다.
aside: false
outline: false
apiReference:
  title: 임베딩
  operation: Models
  method: POST
  path: /v1/embeddings
  description: OpenAI 호환 벡터 임베딩 API입니다. 입력 형식, 차원, 인코딩, 추가 필드는 선택한 모델과 공급자에 따라 다릅니다.
  groups:
    - title: 요청 본문
      fields:
        - name: model
          type: string
          required: true
          description: "임베딩 모델 ID입니다. 예: alibaba/text-embedding-v4"
        - name: input
          type: string | string[] | integer[] | integer[][]
          required: true
          description: 임베딩할 텍스트, 토큰 ID, 또는 텍스트나 토큰 ID 배열의 배치입니다
        - name: dimensions
          type: integer
          required: false
          description: 선택한 모델이 지원하는 경우의 출력 벡터 차원입니다. 공통 차원 목록은 없습니다
        - name: encoding_format
          type: string
          required: false
          description: 임베딩 인코딩 형식입니다. float 또는 base64 사용 가능 여부는 공급자 지원에 따라 결정됩니다
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
