---
i18nSource: b5cf676d897d17a3
title: 응답 생성
description: 스트리밍과 도구 사용 요청을 포함하여 OpenAI 호환 모델 응답을 생성합니다.
aside: false
outline: false
apiReference:
  title: 응답 생성
  operation: Inference
  method: POST
  path: /v1/responses
  description: OpenAI 호환 모델 응답을 생성합니다. SandBase는 모델 매핑 후 요청 필드를 그대로 유지하고, 응답은 공개 OpenAI 필드만 남도록 정리합니다.
  signature: client.responses.create(params)
  groups:
    - title: 요청 본문
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Models API의 모델 식별자입니다.
        - name: input
          type: string | object[]
          required: false
          description: 텍스트, 메시지 항목 또는 선택한 모델과 제공업체가 지원하는 기타 입력입니다.
        - name: instructions
          type: string
          required: false
          description: 응답에 대한 시스템 또는 개발자 지침입니다.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: OpenAI 호환 Server-Sent Events를 반환합니다.
        - name: background
          type: boolean
          required: false
          description: 선택한 제공업체가 지원하면 백그라운드 실행을 요청합니다.
        - name: include
          type: string[]
          required: false
          description: 지원되는 경우 포함할 추가 공개 응답 데이터입니다.
        - name: max_output_tokens
          type: integer
          required: false
          description: 최대 생성 토큰 수입니다.
        - name: max_tool_calls
          type: integer
          required: false
          description: 지원되는 경우 최대 내장 도구 호출 수입니다.
        - name: metadata
          type: object
          required: false
          description: 제공업체에 전달되는 요청 메타데이터입니다.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: 지원되는 모델이 도구를 병렬로 호출하도록 허용합니다.
        - name: previous_response_id
          type: string
          required: false
          description: 선택한 라우트가 지원하는 경우 이어서 진행할 이전 응답입니다.
        - name: reasoning
          type: object
          required: false
          description: 지원되는 모델의 추론 설정입니다.
        - name: store
          type: boolean
          required: false
          description: 지원되는 경우 제공업체 측 응답 저장을 요청합니다.
        - name: text
          type: object
          required: false
          description: 텍스트 출력 및 구조화 형식 설정입니다.
        - name: tool_choice
          type: string | object
          required: false
          description: 도구 선택을 제어합니다.
        - name: tools
          type: object[]
          required: false
          description: 모델이 사용할 수 있는 도구입니다.
        - name: truncation
          type: string
          required: false
          description: 입력 잘라내기 동작입니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: 요청 호환성
      description: SandBase는 model을 선택된 업스트림 모델로 바꾸고 다른 요청 필드는 유지합니다. 제공업체별 지원 범위는 여전히 다릅니다.
    - title: 정리된 응답
      description: 공개 OpenAI 응답 필드와 토큰 사용량만 반환됩니다. 제공업체 결제, 계정, 라우팅 정보와 알 수 없는 최상위 확장 필드는 제거되며, 출력 항목 내용은 유지됩니다.
    - title: 스트리밍
      description: 공개 response.* 및 error SSE 이벤트는 정리된 뒤 전달됩니다. 알 수 없는 비공개 이벤트는 삭제되며, 형식이 잘못된 데이터가 있으면 안전하지 않은 내용을 전달하지 않고 스트림을 닫습니다.
  errors:
    - status: "400"
      description: 잘못된 JSON, model 누락 또는 잘못된 제공업체 요청입니다.
    - status: "401"
      description: API 키가 없거나 잘못되었습니다.
    - status: "402"
      description: 조직 또는 API 키 지출 한도에 도달했습니다.
    - status: "403"
      description: API 키 범위 또는 업스트림 권한에 의해 거부되었습니다.
    - status: "413"
      description: 업스트림 제공업체가 요청이 너무 크다는 이유로 거부했습니다.
    - status: "500"
      description: 예측 수명 주기 또는 조직 조회에 실패했습니다.
    - status: "502"
      description: 업스트림 응답을 안전하게 파싱하고 정리할 수 없습니다.
    - status: "503"
      description: 라우팅에 실패했거나 모든 제공업체 후보가 소진되었습니다.
---

<ApiReferencePage />
