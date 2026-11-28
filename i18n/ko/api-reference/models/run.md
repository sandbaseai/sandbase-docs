---
i18nSource: efa205ed7505643c
title: 모델 또는 API 기능 실행
description: 통합 실행 엔드포인트로 SandBase 모델 또는 API 기능을 제출합니다.
aside: false
outline: false
apiReference:
  title: 모델 또는 API 기능 실행
  operation: Models
  method: POST
  path: /v1/run
  description: 활성화된 SandBase 모델 또는 API 기능을 실행합니다. 요청 필드는 기능마다 다르므로, 선택한 기능의 스키마는 SandBase 웹사이트의 모델 또는 API 레퍼런스 페이지를 참고하세요.
  groups:
    - title: 요청 본문
      fields:
        - name: model
          type: string
          required: true
          description: 활성화된 논리 모델 또는 API 기능 식별자입니다.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: 실행 모드 힌트입니다. `auto`는 선택한 기능에 설정된 기본값을 사용하며, 다른 값은 기능이 지원해야 합니다.
        - name: stream
          type: boolean
          required: false
          description: "선택한 기능이 지원하면 스트리밍 출력을 요청합니다. `mode: stream`과 같습니다."
        - name: webhook_url
          type: string
          required: false
          description: 지원되는 비동기 이미지용 선택적 HTTPS 콜백
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## 실행과 결과 {#execution-and-results}

동기 기능은 원래 요청에서 완료된 응답을 반환합니다. 비동기 기능은 불투명 `id`와 함께 `202 Accepted`를 반환하므로, 상태가 종료 상태가 될 때까지 [비동기 실행 조회](./run-get)를 폴링하세요.

기능별 요청 필드와 출력 형식은 선택한 모델 또는 API 작업 페이지에 정의되어 있습니다. 이 필드는 `input` 객체로 감싸지 말고 JSON 본문의 최상위에 보내세요. 모든 기능이 같은 매개변수를 받는다고 가정하지 마세요.

## 웹훅 콜백 {#webhook-callbacks}

`webhook_url`은 지원되는 비동기 이미지, 동영상, 오디오 작업에만 설정하세요. SandBase는 완료 또는 실패 후 최종 실행 이벤트를 HTTPS 엔드포인트로 보냅니다. 콜백은 전달 알림일 뿐 `GET /v1/run/{id}`를 대체하지 않습니다. 정확한 상태는 항상 실행 엔드포인트를 폴링하여 확인하고, 콜백이 지연되거나 중복될 때도 안전하게 재시도하세요. 동기 모델 응답과 제공업체 네이티브 엔드포인트는 이 콜백 필드를 사용하지 않습니다.
