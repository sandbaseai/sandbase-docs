---
i18nSource: 0413109dd629d7d7
title: 모델 목록 조회
description: 활성화된 논리 모델을 OpenAI 호환 모델 목록 형식으로 나열합니다.
aside: false
outline: false
apiReference:
  title: 모델 목록 조회
  operation: Models
  method: GET
  path: /v1/models
  description: 활성화된 논리 모델을 OpenAI 호환 모델 목록 형식으로 나열합니다.
  groups:
    - title: 쿼리 매개변수
      fields:
        - name: q
          type: string
          required: false
          description: 모델 이름, 표시 이름, 공급업체, 설명에 대한 퍼지 검색입니다.
        - name: vendor
          type: string
          required: false
          description: "공급업체로 필터링합니다(예: OpenAI 또는 Anthropic)."
        - name: type
          type: string
          required: false
          description: 모델 유형으로 필터링합니다. 기본값은 llm입니다.
        - name: order
          type: string
          required: false
          description: "정렬 순서: sort_order, most-popular, newest, name 중 하나입니다."
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/models" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "id": "openai/gpt-4o",
            "object": "model",
            "created": 1783353600,
            "owned_by": "openai"
          }
        ]
      }
---

<ApiReferencePage />
