---
i18nSource: 06feb27e20f1b7f5
title: 계정 기록 조회
description: API 키가 속한 조직의 최근 실행 기록을 조회합니다.
aside: false
outline: false
apiReference:
  title: 계정 기록 조회
  operation: Account
  method: GET
  path: /v1/account/history
  description: 조직 범위의 최근 실행 기록을 최신순으로 조회합니다. 오류 메시지는 정제되어 반환되며, 저장된 JSON 스냅샷을 디코딩할 수 없으면 생략됩니다.
  groups:
    - title: 쿼리 파라미터
      fields:
        - name: model
          type: string
          required: false
          description: 정확한 논리 모델 이름입니다.
        - name: api_key_id
          type: string
          required: false
          description: 정확한 API Key 리소스 ID입니다.
        - name: type
          type: multimodal | llm | api
          required: false
          description: 실행 카테고리입니다. multimodal은 image, video, audio를 포함합니다.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: 그룹화된 실행 상태입니다.
        - name: error_type
          type: string
          required: false
          description: 정확한 오류 유형입니다. 오류 유형이 없는 기록은 unknown입니다.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: 생성 시각 기준의 이동 범위입니다. 기본값은 7d입니다.
        - name: page
          type: integer
          required: false
          description: 페이지 번호입니다. 1부터 시작합니다.
        - name: page_size
          type: integer
          required: false
          description: 페이지당 항목 수(1~100)입니다. 기본값은 20입니다.
        - name: request_id
          type: string
          required: false
          description: 조직 범위의 정확한 실행 ID입니다. 지정하면 다른 필터는 무시되고 결과 하나만 요청됩니다.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: 명시적 기간에 사용할 타임스탬프 기준입니다.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: 정산 필터입니다. positive와 token은 time_basis=settled_at이 필요합니다.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: 기간 시작 시각(포함)이며 end_at과 함께 사용합니다.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: 기간 종료 시각(미포함)입니다. 기간은 32일을 초과할 수 없습니다.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: 지연 시간 샘플을 양수 값으로 제한합니다.
        - name: min_latency_ms
          type: integer
          required: false
          description: 최소 지연 시간(밀리초)입니다.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: 호환성 검증용으로만 사용됩니다. 타임스탬프는 UTC로 유지되며, 정확한 request_id 조회에서는 이 파라미터가 무시됩니다.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
