---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: SandBase 언어 및 비전 모델로 OpenAI 호환 채팅 완성을 생성합니다.
aside: false
outline: false
apiReference:
  title: 채팅 완성 생성
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: 지원되는 모든 SandBase 채팅 모델로 OpenAI 호환 채팅 완성을 생성합니다. 선택한 라우트가 지원하는 경우 제공업체 호환 필드가 그대로 유지됩니다.
  signature: client.chat.completions.create(params)
  groups:
    - title: 요청 본문
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Models API의 모델 식별자입니다.
        - name: messages
          type: object[]
          required: true
          description: 선택한 제공업체가 지원하는 역할을 사용하는 대화 메시지입니다. 일반적으로 system, developer, user, assistant 또는 tool입니다.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 샘플링 온도(0~2)입니다.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: 뉴클리어스 샘플링 임계값입니다.
        - name: max_tokens
          type: integer
          required: false
          description: 최대 출력 토큰 수입니다.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: 증분 Server-Sent Events를 반환합니다.
        - name: stop
          type: string | string[]
          required: false
          description: 생성을 중단할 시퀀스(하나 또는 여러 개)입니다.
        - name: tools
          type: object[]
          required: false
          description: 모델이 사용할 수 있는 함수 정의입니다.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: 도구 선택 여부와 선택할 도구를 제어합니다.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: 지원되는 모델이 한 턴에 여러 도구 호출을 생성하도록 허용합니다.
        - name: user
          type: string
          required: false
          description: 제공업체 호환 최종 사용자 식별자입니다.
        - name: response_format
          type: object
          required: false
          description: JSON 객체 또는 JSON Schema 출력 설정입니다.
        - name: reasoning_effort
          type: string
          required: false
          description: 제공업체 호환 추론 강도 설정입니다.
        - name: reasoning
          type: object
          required: false
          description: effort 또는 max_tokens 같은 추론 설정입니다.
        - name: thinking
          type: object
          required: false
          description: type 또는 budget_tokens 같은 thinking 설정입니다.
        - name: extra_body
          type: object
          required: false
          description: 프로토콜 변환이 필요한 라우트를 위한 제공업체별 파라미터입니다.
        - name: n
          type: integer
          required: false
          default: "1"
          description: 생성할 완성 선택지 수입니다.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: 존재 페널티(-2~2)입니다.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: 빈도 페널티(-2~2)입니다.
        - name: stream_options
          type: object
          required: false
          description: include_usage 같은 스트리밍 옵션입니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: 스트리밍과 도구
      description: "SSE를 사용하려면 stream을 true로 설정하세요. 스트림은 data: [DONE]으로 끝납니다. 마지막 사용량 청크를 받으려면 stream_options.include_usage를 추가하세요. 도구 호출과 멀티모달 콘텐츠는 OpenAI 호환 스키마를 따릅니다."
    - title: 제공업체 호환성
      description: SandBase는 동일 프로토콜 라우트에서 추가 호환 필드를 그대로 유지합니다. 프로토콜 간 필드와 제공업체별 필드 지원은 다를 수 있으므로, 해당되는 경우 extra_body를 사용하세요.
  errors:
    - status: "400"
      description: 잘못된 요청 본문 또는 지원되지 않는 파라미터입니다.
    - status: "401"
      description: API 키가 없거나 유효하지 않습니다.
    - status: "402"
      description: 조직 지출 한도에 도달했습니다.
    - status: "404"
      description: 모델을 찾을 수 없거나 사용할 수 없습니다.
    - status: "429"
      description: 속도 제한을 초과했습니다.
    - status: "500"
      description: 요청 저장 또는 조직 조회에 실패했습니다.
    - status: "502"
      description: 선택한 제공업체가 유효하지 않은 응답을 반환했습니다.
    - status: "503"
      description: 성공한 제공업체 라우트가 없습니다.
---

<ApiReferencePage />
