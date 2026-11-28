---
i18nSource: 2ffb24dad49b9c79
title: 비동기 Run 조회
description: SandBase 비동기 모델 또는 API Run을 폴링하여 현재 결과나 최종 결과를 조회합니다.
aside: false
outline: false
apiReference:
  title: 비동기 Run 조회
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: POST /v1/run으로 생성한 비동기 Run의 현재 상태 또는 최종 상태를 조회합니다.
  groups:
    - title: 경로 파라미터
      fields:
        - name: id
          type: string
          required: true
          description: POST /v1/run이 반환한 불투명한 Run 식별자. 반환된 값을 그대로 사용하세요. 특정 접두사는 보장되지 않습니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## 폴링 {#polling}

오래 걸리는 미디어 또는 API 작업은 5–10초마다 폴링하세요. `status`가 `completed`, `failed`, `timeout` 중 하나가 되면 폴링을 중단합니다. 최종 상태가 아닌 응답에는 `outputs`가 없을 수 있습니다. Run ID는 불투명한 값으로 취급하고, 다른 상태 URL을 직접 구성하지 마세요.
