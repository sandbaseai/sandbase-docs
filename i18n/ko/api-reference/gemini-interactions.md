---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: 네이티브 Google 프로토콜로 모델 Interaction을 생성하고, 스트리밍하고, 폴링합니다.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: 네이티브 Google Interaction을 생성합니다. HTTP 200이어도 status를 확인하세요. in_progress 응답은 폴링해야 합니다.
  groups:
    - title: 요청 본문
      fields:
        - name: model
          type: string
          required: true
          description: SandBase 논리 모델 이름입니다.
        - name: input
          type: string | object | array
          required: true
          description: 네이티브 Google Interaction 입력입니다.
        - name: stream
          type: boolean
          required: false
          description: 모델이 지원하는 경우 Google Interactions SSE 이벤트를 반환합니다.
        - name: background
          type: boolean
          required: false
          description: 요청을 영속적으로 제출하고 즉시 폴링할 수 있는 Interaction을 반환합니다. stream과 함께 사용할 수 없습니다.
        - name: previous_interaction_id
          type: string
          required: false
          description: 공급자 어피니티를 유지하면서 업스트림 Interaction에서 이어갑니다.
        - name: store
          type: boolean
          required: false
          description: 업스트림 저장 설정을 변경 없이 전달합니다.
        - name: system_instruction
          type: string
          required: false
          description: 네이티브 시스템 지시입니다.
        - name: tools
          type: array
          required: false
          description: 네이티브 Google 도구 정의입니다.
        - name: generation_config
          type: object
          required: false
          description: 네이티브 생성 구성입니다.
        - name: response_format
          type: object | array
          required: false
          description: 요청하는 응답 형식입니다.
        - name: response_modalities
          type: array
          required: false
          description: 요청하는 출력 모달리티입니다.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## 인증 {#authentication}

`x-goog-api-key`, `Authorization: Bearer …`, `key` 쿼리 매개변수를 이 우선순위대로 사용합니다. 쿼리 문자열의 자격 증명은 로그에 남을 수 있으므로 헤더 사용을 권장합니다.

## 지원 모델 {#supported-models}

Interactions 엔드포인트는 카탈로그 이름이 `google/`로 시작하는 모든 모델에 쓸 수 있는 범용 경로가 아닙니다. 모델에는
Interactions 호환 공급자 매핑이 있어야 합니다. SandBase가 현재 문서화한 호환 모델은 다음과 같습니다.

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

다른 Google 모델은 다른 엔드포인트를 사용합니다. 예를 들어 Nano Banana Pro와 Nano Banana 2는 `/v1beta/interactions`가 아니라
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content)를 사용합니다. 지원되지 않는 모델은 다른 Google 프로토콜로
라우팅되지 않고 실패합니다.

## 성공 응답과 폴링 {#success-and-polling}

성공한 제출은 HTTP `200`을 반환하며, 백그라운드 작업과 제한된 대기 시간이 만료된 동기 요청도 마찬가지입니다. 항상 `status`를 확인하세요.

- `completed`, `failed`, `cancelled`, `incomplete`는 최종 상태입니다.
- `in_progress`는 아직 실행 중입니다. `GET /v1beta/interactions/{id}`를 폴링하세요. 응답의 `Location` 헤더에도 이 경로가 포함될 수 있습니다.
- `requires_action`은 프로토콜 상태이지만, SandBase는 현재 이 상태를 진행하는 데 필요한 도구 확인 엔드포인트를 제공하지 않습니다.

폴링 ID는 `POST`가 반환한 업스트림 Interaction `id`이며 SandBase prediction ID가 아닙니다. Interaction을 생성한 것과 같은 SandBase API 키로 조회해야 합니다.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

최종 상태가 아닌 GET 응답에는 부분 출력과 사용량이 포함되지 않습니다. 최종 응답에는 인라인 이미지, 오디오, 비디오 데이터가 포함될 수 있으며 크기가 수 메가바이트에 이를 수 있습니다. 필요한 미디어는 즉시 다운로드해 저장하세요. 업스트림 보존 기간이 지나면 SandBase는 원본 미디어 바이트 없이 구조와 메타데이터만 담은 손실된 최종 대체 응답만 반환할 수 있습니다.

## 스트리밍 {#streaming}

요청 본문에 `stream: true`를 설정합니다. 응답은 `text/event-stream`이며, 이 프로토콜에서는 `?alt=sse`를 사용하지 않습니다. 이벤트 및 delta 타입은 열려 있어 고정된 허용 목록 없이 전달되므로, 클라이언트는 알 수 없는 값을 허용해야 합니다. 스트리밍 헤더가 기록된 이후의 실패는 다른 HTTP 상태가 아니라 `error` 이벤트로 전달됩니다.

스트리밍 지원 여부는 모델에 따라 다릅니다. 프로토콜이 지원하더라도 업스트림 공급자가 `stream: true`를 거부할 수 있습니다.

## 현재 제한 사항 {#current-limits}

SandBase는 현재 create와 get만 제공합니다.

- Agent Interaction은 거부됩니다. `model`을 사용하세요.
- `background: true`와 `stream: true`는 함께 사용할 수 없습니다.
- Interaction 목록 조회, 삭제, 취소는 제공되지 않습니다.
- URI 전달과 GET 기반 스트림 재연결은 제공되지 않습니다.
- `previous_interaction_id`에는 유효한 공급자 어피니티 매핑과 업스트림 지원이 필요합니다. 어피니티를 사용할 수 없으면 SandBase는 공급자를 조용히 바꾸지 않고 실패합니다.

오류는 Google 형식 `{ "error": { "code", "message", "status" } }`을 사용합니다. HTTP 상태는 안정적인 값으로 취급하세요. `message`에 담긴 정제된 업스트림 텍스트는 바뀔 수 있습니다.
