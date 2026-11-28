---
i18nSource: 04f3657850b71e58
title: Anthropic 메시지 생성
description: SandBase 모델로 Anthropic 호환 메시지를 생성합니다.
aside: false
outline: false
apiReference:
  title: Anthropic 메시지 생성
  operation: Inference
  method: POST
  path: /v1/messages
  description: SandBase의 Anthropic 호환 Messages 엔드포인트로 메시지를 생성합니다. SandBase는 선택한 공급자에 맞게 모델을 매핑하고 호환되는 요청 및 응답 필드를 유지합니다.
  signature: client.messages.create(params)
  groups:
    - title: 요청 헤더
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "SandBase API 키입니다. Authorization: Bearer도 허용되며, 둘 다 있으면 x-api-key가 우선합니다."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: 업스트림으로 전달되는 Anthropic API 버전입니다. 생략하면 SandBase가 2023-06-01을 사용합니다.
        - name: anthropic-beta
          type: string
          required: false
          description: 쉼표로 구분한 베타 기능 식별자이며, 공급자 호환성에 따라 적용됩니다.
    - title: 요청 본문
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Anthropic 호환 모델 식별자입니다.
        - name: messages
          type: object[]
          required: true
          description: 텍스트 또는 타입이 지정된 콘텐츠 블록을 담은 user 및 assistant 메시지입니다.
        - name: max_tokens
          type: integer
          required: true
          description: 최대 출력 토큰 수입니다.
        - name: system
          type: string | object[]
          required: false
          description: 최상위 시스템 지시입니다.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 0~1 사이의 샘플링 temperature입니다.
        - name: top_p
          type: number
          required: false
          description: Nucleus 샘플링 임계값입니다.
        - name: top_k
          type: integer
          required: false
          description: 샘플링을 상위 K개 토큰으로 제한합니다.
        - name: stop_sequences
          type: string[]
          required: false
          description: 생성을 중지하는 사용자 지정 시퀀스입니다.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Anthropic 스타일 Server-Sent Events를 반환합니다.
        - name: metadata
          type: object
          required: false
          description: 선택적 user_id를 포함한 요청 메타데이터입니다.
        - name: tools
          type: object[]
          required: false
          description: 모델이 사용할 수 있는 도구 정의입니다.
        - name: tool_choice
          type: object
          required: false
          description: 도구 선택 동작을 제어합니다.
        - name: thinking
          type: object
          required: false
          description: 지원되는 모델의 확장 사고(extended thinking) 구성입니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: 인증
      description: "x-api-key 또는 Authorization: Bearer를 사용합니다. 둘 다 제공되면 x-api-key가 우선합니다."
    - title: 투명한 프로토콜
      description: 모델 매핑과 구성된 공급자 호환성 규칙을 제외하면, SandBase는 호환되는 요청 필드, 비스트림 응답, SSE 이벤트를 프로토콜 변환 없이 전달합니다.
    - title: 베타 기능
      description: anthropic-beta가 있으면 그대로 전달됩니다. 후보의 호환성 규칙에 따라 지원되지 않는 베타 필드가 제거되거나 해당 후보를 건너뛸 수 있습니다.
  errors:
    - status: "400"
      description: 잘못된 요청 본문 또는 지원되지 않는 기능입니다.
    - status: "401"
      description: API 키가 없거나 유효하지 않습니다.
    - status: "402"
      description: 조직 지출 한도에 도달했습니다.
    - status: "403"
      description: API Key 지출 한도 또는 조직 권한 오류입니다.
    - status: "404"
      description: 모델을 찾을 수 없거나 사용할 수 없습니다.
    - status: "413"
      description: 공급자가 요청이 너무 크다는 이유로 거부했습니다.
    - status: "429"
      description: 공급자 속도 제한을 초과했습니다.
    - status: "500"
      description: 예측 수명 주기 또는 공급자 오류입니다.
    - status: "502"
      description: 사용 가능한 콘텐츠가 나오기 전에 업스트림 스트림이 종료되었습니다.
    - status: "503"
      description: 라우팅에 실패했거나 모든 공급자 후보를 사용할 수 없습니다.
---

<ApiReferencePage />
