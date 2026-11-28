---
i18nSource: fb62188053fb216d
title: API 패스스루
description: 활성화된 카탈로그 API 기능을 벤더 접두사가 포함된 경로로 호출합니다.
aside: false
outline: false
apiReference:
  title: API 패스스루
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: vendor/upstream_path라는 이름의 활성화된 카탈로그 기능을 찾아 통합 SandBase 파이프라인으로 JSON 객체를 실행합니다. GET을 사용하는 기능에서는 GET도 지원됩니다.
  groups:
    - title: 경로 파라미터
      fields:
        - name: vendor
          type: string
          required: true
          description: 기능 이름의 첫 번째 세그먼트.
        - name: upstream_path
          type: string
          required: true
          description: 나머지 경로
          including literal slash-separated segments when present.: null
    - title: 요청 본문
      fields:
        - name: model
          type: string
          required: false
          description: 생략하면 URL에서 도출된 vendor/path 식별자를 사용합니다. 지정하는 경우
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: 선택한 기능의 실시간 스키마에 정의된 필드.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

URL은 `vendor/upstream_path`라는 이름의 활성화된 모델로 해석됩니다. [Models API](./)가 반환하는 벤더 접두사가 포함된 정확한 이름을 사용하세요. 중첩된 기능 이름은 퍼센트 인코딩된 슬래시가 아니라 경로 세그먼트 그대로 유지됩니다.

POST는 JSON 객체만 허용합니다. 빈 POST 본문도 허용되며, URL에서 도출된 모델을 담은 객체와 동일하게 동작합니다. GET은 빈 본문을 사용합니다. 응답 필드와 동기/비동기 동작은 선택한 기능에 따라 다릅니다. 비동기 결과는 `GET /v1/run/{id}`로 폴링하세요.
