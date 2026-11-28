---
i18nSource: 6f238c169e0f931d
title: 작업 비용 조회
description: 같은 API 키로 생성한 최근 작업의 정산 상태, 최종 비용, 토큰 사용량을 조회합니다.
aside: false
outline: false
apiReference:
  title: 작업 비용 조회
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: 최근 SandBase 작업의 비동기 정산 상태, 최종 비용, 토큰 사용량을 조회합니다.
  groups:
    - title: 경로 파라미터
      fields:
        - name: task_id
          type: string
          required: true
          description: 과금 대상 작업이 반환한 불투명 작업 ID입니다. x-task-id 응답 헤더가 있으면 그 값도 포함됩니다.
    - title: 응답
      fields:
        - name: settled
          type: boolean
          required: true
          description: 최종 비용 정산 완료 여부입니다. 이 값이 true가 되기 전까지 cost는 확정되지 않습니다.
        - name: cost · estimated_cost
          type: string
          required: true
          description: 소수점 여섯 자리의 USD 금액입니다. estimated_cost는 정산 전 최선의 추정 참고값입니다.
        - name: usage
          type: object
          required: true
          description: 작업에 기록된 토큰 수입니다.
        - name: pricing
          type: object
          required: false
          description: "정산 후 할인이 기록된 경우: original_cost, discount_amount, discount_percent, 그리고 선택적인 discount_type입니다. original_cost에서 discount_amount를 빼면 cost와 같습니다."
  examples:
    - label: HTTP
      language: http
      code: "Authorization: Bearer sk-YOUR_API_KEY"
    - label: cURL
      language: bash
      code: |-
        curl -sS \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          "https://api.sandbase.ai/v1/tasks/$TASK_ID/cost" | jq .
  response:
    status: 200 OK
    code: |-
      {
        "id": "f3d2e8a1-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "status": "completed",
        "settled": true,
        "currency": "USD",
        "cost": "0.001234",
        "estimated_cost": "0.001234",
        "usage": {
          "prompt_tokens": 1000,
          "completion_tokens": 200,
          "total_tokens": 1200,
          "cached_tokens": 800,
          "cache_creation_tokens": 0,
          "reasoning_tokens": 0
        }
      }
---

<ApiReferencePage />
