---
i18nSource: ac4e3b9b9eef4c7d
title: API 오류
description: HTTP 상태, 엔드포인트 계열, 문서화된 응답 형식, 재시도 안전성에 따라 SandBase API 오류를 처리합니다.
---

# API 오류 {#api-errors}

SandBase는 표준 HTTP 상태 코드를 사용하지만, 모든 엔드포인트에 공통인 단일 오류 본문을 제공하지는 않습니다. 먼저 HTTP 상태로 분기한 다음, 호출한 엔드포인트에 문서화된 응답 스키마로 파싱하세요. 모든 오류에 `code`, `param`, `message`, `request_id`가 포함된다고 가정하지 마세요.

## 응답 형식 {#response-shapes}

코어 미들웨어와 여러 `/v1/*` 엔드포인트는 평면 구조의 오류를 반환합니다.

```json
{"error":"organization rate limit exceeded"}
```

Agents 플랫폼 리소스(`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`)는 고정된 `code`가 포함된 OpenAI 스타일 객체를 반환합니다. [Agents 플랫폼 오류](#agents-platform-errors)를 참고하세요.

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

웹훅 Events API(`/events/webhooks*`)는 `{"code":<http status>,"message":"..."}`를 반환합니다. [웹훅](/api-reference/webhooks#authentication-and-errors)을 참고하세요.

OpenAI 호환 엔드포인트는 OpenAI 호환 엔벨로프를 유지합니다. `POST /v1/messages`는 Anthropic 호환 엔벨로프를 유지합니다.

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

공개 작업의 정확한 상태 코드와 스키마는 [OpenAPI 명세](/openapi.yaml)를 참고하세요.

## HTTP 상태 처리 {#http-status-handling}

| 상태 | 일반적인 의미 | 클라이언트 조치 |
|---|---|---|
| `400` | 잘못된 입력 또는 지원되지 않는 매개변수 | 엔드포인트와 선택한 모델 스키마에 맞게 요청을 수정합니다. |
| `401` | 자격 증명이 없거나, 잘못되었거나, 폐기되었거나, 만료됨 | 자격 증명을 교체하거나 순환합니다. 변경 없이 재시도하지 마세요. |
| `402` | 요청 비용을 충당할 수 없거나 지출 한도에 도달함 | 재시도 전에 잔액 또는 키 한도 문제를 해결합니다. |
| `403` | 자격 증명에 권한이 없거나, 호환 엔드포인트가 지출 실패를 403으로 매핑함 | 엔드포인트별 엔벨로프를 확인하고 권한이 있는 키를 사용합니다. |
| `404` | 호출자가 모델 또는 리소스를 사용할 수 없음 | 현재 모델 ID 또는 리소스 ID를 확인합니다. |
| `409` | 리소스 상태 충돌 | 최신 상태를 읽은 뒤 재시도가 안전한지 판단합니다. |
| `422` | 의미상 잘못된 리소스 입력 | 문서화된 필드 값을 수정합니다. |
| `429` | 조직 요청 한도 또는 동영상 동시 실행 한도 | 작업을 반복해도 안전하면 횟수 제한이 있는 백오프와 지터를 적용해 재시도합니다. |
| `500`, `502`, `503`, `504` | SandBase 또는 업스트림 장애 | 작업을 반복해도 안전한 경우에만 재시도합니다. |

모든 엔드포인트가 이 표의 모든 상태를 문서화하지는 않습니다. 해당 작업의 OpenAPI 응답 맵이 기준입니다.

## 인증 오류 {#authentication-errors}

문서화된 인증 메시지는 다음과 같습니다.

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

범위가 지정된 키를 범위 밖에서 사용하면 대신 중첩된 본문과 함께 `403`을 반환합니다: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Agents 플랫폼 리소스는 자체 엔벨로프에 같은 `code`를 담아 반환합니다.

표준 엔드포인트에는 `Authorization: Bearer $SANDBASE_API_KEY`를 사용하세요. `POST /v1/messages`는 `x-api-key`도 허용하며, 프로토콜 호환 Google 엔드포인트는 각자 지원하는 키 헤더를 문서화합니다.

폐기된 키는 다시 활성화할 수 없습니다. 대체 키를 만들고, 키를 사용하는 애플리케이션을 업데이트하고, 동작을 확인한 다음, 이전 키에 대한 남은 참조를 제거하세요.

## 요청 한도 {#rate-limits}

`organization rate limit exceeded`(`429`)는 조직이 할당된 분당 요청 한도에 도달했다는 뜻이며, 이 한도는 조직의 모든 API 키가 공유합니다. 프로토콜 호환 엔드포인트는 각자의 엔벨로프로 이 오류를 반환합니다. 한도는 조직별로 할당되므로 SandBase는 공통 수치를 공개하지 않습니다.

응답에 `Retry-After`가 있으면 이를 따르세요. 없으면 횟수 제한이 있는 지수 백오프와 지터를 사용하세요. 요청을 분산하는 패턴은 [요청 한도](/guides/rate-limiting)를 참고하세요.

작업 제출에는 두 가지 검사가 추가로 적용됩니다. `organization concurrency limit exceeded`(`429`)는 조직에서 진행 중인 작업 수가 이미 계정 등급이 허용하는 수에 도달했다는 뜻이며, 실행 중인 작업이 끝나면 해소됩니다. 이 검사는 `POST /v1/run`과 `/v1/api/*`의 모든 모델 유형, 그리고 다른 엔드포인트의 동영상 제출에 적용됩니다. `insufficient credit for estimated video cost`(`402`)는 예상 비용이 잔액과 신용 한도의 합보다 크다는 뜻이므로, 충전한 뒤 재시도하세요. [동시 실행 한도](/guides/concurrency-limits)를 참고하세요.

## 재시도 안전성 {#retry-safety}

다음 순서로 판단하세요.

1. 작업이 이미 외부에서 확인할 수 있는 효과를 냈는지 확인합니다.
2. `400`, `401`, `402`, `403`, `404`, `422` 요청은 변경 없이 재시도하지 않습니다.
3. `409`는 재시도하기 전에 현재 리소스 상태를 읽습니다.
4. `429`와 일시적인 `5xx` 응답은 적은 횟수로 제한하여 재시도합니다.
5. 생성, 트리거, 업로드, 외부 동작 요청을 반복하기 전에 작업이 멱등인지, 또는 애플리케이션이 중복을 정리할 수 있는지 확인합니다.

적절한 지연 시간은 다음과 같습니다.

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Agents 플랫폼 오류 {#agents-platform-errors}

Agents, Sessions, Skills, MCP 연결, Secrets는 하나의 엔벨로프를 반환합니다. 대부분의 코드에서 `message`는 고정된 안전한 문장이며, `invalid_request`에는 어떤 입력 형식이나 옵션이 지원되지 않는지 같은 짧은 설명이 담길 수 있습니다. `message`가 아니라 `code`로 분기하세요.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type`은 401이면 `authentication_error`, 5xx이면 `server_error`, 그 외에는 `invalid_request_error`입니다.

| HTTP | `code` | 의미 | 조치 |
|---|---|---|---|
| 400 | `invalid_request` | 잘못되었거나 알 수 없는 필드, 검증 실패, 지원되지 않는 옵션 | 요청을 수정합니다. 변경 없이 재시도하지 마세요 |
| 400 | `skill_not_found` | 참조한 Skill 또는 버전을 사용할 수 없음 | Agent의 `skills`를 수정합니다 |
| 401 | `unauthorized` | API 키 헤더가 없거나, 잘못되었거나, 충돌함 | `Authorization` / `X-API-Key`를 확인합니다 |
| 402 | `spending_limit_exceeded` | 키 지출 한도 또는 조직 잔액 소진 | 크레딧을 추가하거나 한도를 올립니다 |
| 403 | `insufficient_scope` | 범위가 지정된 키라 Agents 리소스를 사용할 수 없음 | Console에서 만든 표준 키를 사용합니다 |
| 403 | `org_disabled` | 조직에 Agents 실행 권한이 없음 | 지원팀에 문의합니다 |
| 404 | `not_found` | 조직에 해당 리소스가 없음 | ID를 확인합니다 |
| 409 | `conflict` | 오래된 `row_version`, 변경을 허용하지 않는 상태, 또는 다른 본문에 재사용된 `Idempotency-Key` | 리소스를 다시 읽은 뒤 판단합니다 |
| 409 | `session_input_pending` | 이전 입력이 아직 전달 중임 | 기다립니다. 새 키로 다시 보내지 마세요 |
| 409 | `session_input_expired` | 입력 수락 기한이 만료됨 | 다시 보내기 전에 기록을 확인합니다 |
| 409 | `session_environment_unavailable` | 실행 환경을 사용할 수 없음 | 기다리거나 새 Session을 생성합니다 |
| 413 | `request_too_large` | 요청 본문 또는 그로부터 고정된 Session 구성이 크기 제한을 초과함 | 더 작은 본문을 보냅니다. 변경 없이 재시도하지 마세요 |
| 429 | `quota_exceeded` | Agents 할당량 초과 | 나중에 재시도합니다 |
| 502 | `executor_rejected`, `executor_contract_error` | 실행 계층이 요청을 거부했거나 예상치 못한 응답을 반환함 | Agent 구성을 확인한 뒤 재시도합니다 |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | 종속 서비스를 일시적으로 사용할 수 없음 | 백오프를 적용하고 같은 `Idempotency-Key`로 재시도합니다 |

`skill_runtime_incompatible`도 나타날 수 있으며, `internal error` 메시지와 함께 503으로 반환됩니다.

## 스트리밍 실패 {#streaming-failures}

스트림이 시작된 뒤에는 오류가 새 HTTP 응답이 아니라 해당 프로토콜의 스트림 형식으로 전달될 수 있습니다. 스트림을 미완료로 처리하고, 애플리케이션에 필요한 부분 출력을 보존하며, 요청을 다시 생성해도 안전한 경우에만 재시도하세요. 모든 제공업체가 같은 종료 이벤트나 종료 사유를 보낸다고 가정하지 마세요.

## 운영 디버깅 {#operational-debugging}

엔드포인트, HTTP 상태, 선택한 모델 또는 리소스 ID, 타임스탬프, 서버가 반환한 안전한 요청 식별자를 기록하세요. 인증 헤더, API 키, 자격 증명 값, 민감한 프롬프트 내용은 절대 로그에 남기지 마세요.

조직의 요청 기록은 [Developer → Activities](https://www.sandbase.ai/console/activities)에서 확인합니다. 지속되는 장애를 보고할 때는 민감 정보를 제거한 요청 메타데이터와 재현 가능한 최소 요청을 포함하세요.

## 참고 항목 {#see-also}

- [인증](/api-reference/authentication)
- [오류와 재시도](/guides/error-handling)
- [요청 한도](/guides/rate-limiting)
- [AI가 읽을 수 있는 오류 가이드](/for-agents/errors)
