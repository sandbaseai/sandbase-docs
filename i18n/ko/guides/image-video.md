---
i18nSource: 8c960d117a998817
title: 이미지 및 동영상 모델
description: SandBase의 공유 Run API로 이미지와 동영상을 비동기식으로 생성합니다.
---

# 이미지 및 동영상 모델 {#image-and-video-models}

이미지 및 동영상 모델은 SandBase의 공유 비동기 Run API를 사용합니다. `POST /v1/run`으로
작업을 제출한 다음, Run이 최종 상태에 도달할 때까지 `GET /v1/run/{id}`를
폴링하세요.

## 작업 제출하기 {#submit-a-task}

[이미지 및 동영상 모델](https://www.sandbase.ai/models/image-video)에 있는 정확한 모델 ID를 사용하세요. 나머지
요청 필드는 모델마다 다르므로, 필수 입력과 제한 사항은 해당 모델의 API 레퍼런스를
확인하세요.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

응답에는 불투명한 `id`와 `pending` 또는 `running` 같은 `status`가
포함됩니다.

## 결과 폴링하기 {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`status`가 `completed`, `failed`, `timeout` 중 하나가 될 때까지 폴링을 계속하세요. 완료된
Run에는 이미지나 동영상 URL 같은 기능별 출력이 포함됩니다. Run ID를 보관하고,
Run 응답을 신뢰할 수 있는 상태 정보로 취급하세요.

## Webhook 콜백 {#webhook-callbacks}

지원되는 비동기 작업은 제출 요청에 `webhook_url`을 설정할 수도 있습니다.
콜백은 전달 알림일 뿐 폴링을 대체하지 않습니다. 계속 `GET /v1/run/{id}`를
사용하고, 중복되거나 지연된 콜백을 안전하게 처리하세요. 공통 콜백 계약은
[기능 실행하기](/api-reference/models/run#webhook-callbacks)를 참고하세요.

## API 기능은 URL에서 도출된 경로를 사용합니다 {#api-capabilities-use-a-url-derived-path}

공유 Run API는 모델 생성용입니다. [APIs 카탈로그](https://www.sandbase.ai/apis)의
API 기능은 URL에서 도출된 별도의 경로인 `GET` 또는 `POST /v1/api/{vendor}/{upstream_path}`를 사용합니다.
벤더 접두사가 포함된 기능 이름은 Models API나 APIs 카탈로그에서 가져오므로, POST 본문에서
`model` 필드를 생략할 수 있습니다.

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

이 경로는 API 기능용이며, 이미지나 동영상 모델을 호출할 때 `/v1/run`을 대체하지
않습니다. 선택한 API 기능이 비동기식이라면 반환된 Run ID로 `GET /v1/run/{id}`를 폴링하세요.

## 다음 단계 {#next-steps}

- [이미지 및 동영상 모델](https://www.sandbase.ai/models/image-video)
- [기능 실행하기](/api-reference/models/run)
- [Run 결과 조회하기](/api-reference/models/run-get)
- [API 패스스루](/api-reference/models/api-passthrough)
