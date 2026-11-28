---
i18nSource: 95410ff7ea741f64
title: AI가 읽을 수 있는 오류 가이드
description: 엔드포인트 계열, HTTP 상태, 재시도 안전성, 문서화된 응답 형식에 따라 SandBase API 오류를 처리합니다.
---

# AI 클라이언트를 위한 오류 처리 {#error-handling-for-ai-clients}

SandBase는 하나의 범용 오류 스키마를 제공하지 않습니다. 먼저 HTTP 상태로 분기한 다음, 엔드포인트 계열별로 문서화된
응답 형식을 파싱하세요. 모든 응답에 `code`, `param`, `request_id` 또는
특정 메시지 문자열이 포함되어 있다고 가정하지 마세요.

## 공개 응답 형식 {#public-response-shapes}

핵심 `/v1/*` 미들웨어와 여러 모델 또는 리소스 엔드포인트는 평면 오류를 반환합니다:

```json
{"error":"organization rate limit exceeded"}
```

Agents 플랫폼 리소스(`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`)는 안정적인 `code`가 포함된 OpenAI 스타일 객체를 반환합니다. [Agents 플랫폼 오류](#agents-platform-errors)를 참고하세요:

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

OpenAI 호환 게이트웨이는 OpenAI 호환 엔벨로프를 유지합니다. `POST /v1/messages`는
Anthropic 호환 엔벨로프를 유지합니다:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## HTTP 상태 처리 {#http-status-handling}

| 상태 | 의미 | 클라이언트 조치 |
|---|---|---|
| `400` | 잘못된 입력 또는 지원되지 않는 파라미터 | 선택한 엔드포인트와 모델 스키마에 맞게 요청을 수정합니다. |
| `401` | 자격 증명이 없거나, 유효하지 않거나, 폐기되었거나, 만료됨 | 자격 증명을 교체하거나 갱신합니다. 변경 없이 재시도하지 마세요. |
| `402` | 요청 비용을 충당할 수 없거나 지출 한도에 도달함 | 재시도하기 전에 결제 또는 키 한도 문제를 해결합니다. |
| `403` | 자격 증명에 권한이 없거나, 호환 인터페이스가 지출 실패를 403으로 매핑함 | 문서화된 엔벨로프를 확인하고 권한이 있는 키를 사용합니다. |
| `404` | 모델 또는 리소스를 찾을 수 없음 | 현재 모델 이름이나 리소스 ID를 확인합니다. |
| `409` | 리소스 상태 충돌 | 재시도가 안전한지 판단하기 전에 최신 리소스 상태를 읽습니다. |
| `429` | 조직 요청 한도 또는 비디오 동시 실행 한도 | 상한이 있는 지수 백오프와 지터로 재시도합니다. |
| `500`, `502`, `503`, `504` | SandBase 또는 업스트림의 일시적 장애 | 작업을 반복해도 안전한 경우에만 재시도합니다. |

## 인증 및 속도 제한 메시지 {#authentication-and-rate-limit-messages}

문서화된 인증 메시지는 다음과 같습니다:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

범위가 지정된 키를 범위 밖에서 사용하면 대신 중첩된 본문과 함께 `403`을 반환합니다: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Agents 플랫폼 리소스는 자체 엔벨로프에서 같은 `code`를 반환합니다.

문서화된 속도 제한 메시지는 `organization rate limit exceeded`입니다(조직에 할당된 분당 요청 수
한도이며, 조직의 모든 API 키가 공유합니다). 현재 `429` 응답에는 `Retry-After` 또는
`X-RateLimit-*` 헤더가 포함되지 않으며, 공개된 범용 RPM 또는 동시 실행 기본값은 없습니다.

## 모델 및 리소스 조회 {#model-and-resource-lookup}

활성화된 모델 ID를 확인하려면 `GET /v1/models`를, 실행 전에 모델을 살펴보려면 `GET /v1/models/{id_or_name}`을
사용하세요. 리소스 ID는 불투명한 값으로 취급하고 해당 목록 또는 조회 작업으로 확인하세요. ID 접두사로
다른 폴링 URL을 구성하지 마세요.

## 재시도 알고리즘 {#retry-algorithm}

상한이 있는 지수 백오프와 지터를 사용하세요:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

다음 규칙을 적용하세요:

- `429`는 클라이언트가 계산한 지연 후 재시도합니다.
- 일시적인 `5xx` 응답은 제한된 적은 횟수만 재시도합니다.
- 변경하지 않은 `400`, `401`, `402`, `403`, `404` 요청은 재시도하지 않습니다.
- 생성, 트리거, 외부 작업 요청을 반복하기 전에 멱등성을 확인합니다.
- 스트림이 실패하면 부분 출력을 보존하고, 계속할지 다시 시작할지 안전성을 판단합니다.
- 최종 HTTP 상태와 정제된 엔드포인트별 오류를 호출자에게 전달합니다.

## Agents 플랫폼 오류 {#agents-platform-errors}

Agent, Session, Skill, MCP 연결, Secret은 하나의 엔벨로프를 반환합니다. 대부분의 코드에서 `message`는 고정된 안전한 문장이며, `invalid_request`에는 어떤 입력 형식이나 옵션이 지원되지 않는지 같은 짧은 설명이 포함될 수 있습니다. `message`가 아니라 `code`로 분기하세요.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type`은 401이면 `authentication_error`, 5xx이면 `server_error`, 그 외에는 `invalid_request_error`입니다.

| HTTP | `code` | 의미 | 조치 |
|---|---|---|---|
| 400 | `invalid_request` | 형식이 잘못되었거나 알 수 없는 필드, 검증 실패 또는 지원되지 않는 옵션 | 요청을 수정합니다. 변경 없이 재시도하지 마세요 |
| 400 | `skill_not_found` | 참조한 Skill 또는 버전을 사용할 수 없음 | Agent의 `skills`를 수정합니다 |
| 401 | `unauthorized` | API 키 헤더가 없거나, 유효하지 않거나, 충돌함 | `Authorization` / `X-API-Key`를 확인합니다 |
| 402 | `spending_limit_exceeded` | 키 지출 한도 또는 조직 잔액 소진 | 크레딧을 추가하거나 한도를 올립니다 |
| 403 | `insufficient_scope` | 범위가 지정된 키라 Agents 리소스를 사용할 수 없음 | Console에서 생성한 표준 키를 사용합니다 |
| 403 | `org_disabled` | 조직이 Agent를 실행할 수 없음 | 지원팀에 문의합니다 |
| 404 | `not_found` | 조직에 리소스가 존재하지 않음 | ID를 확인합니다 |
| 409 | `conflict` | 오래된 `row_version`, 변경을 허용하지 않는 상태, 또는 다른 본문으로 재사용된 `Idempotency-Key` | 리소스를 다시 읽은 뒤 판단합니다 |
| 409 | `session_input_pending` | 이전 입력이 아직 전달 중 | 기다립니다. 새 키로 다시 보내지 마세요 |
| 409 | `session_input_expired` | 입력 수락이 만료됨 | 다시 보내기 전에 기록을 확인합니다 |
| 409 | `session_environment_unavailable` | 실행 환경을 사용할 수 없음 | 기다리거나 새 Session을 생성합니다 |
| 413 | `request_too_large` | 요청 본문 또는 이로부터 고정된 Session 설정이 크기 제한을 초과함 | 더 작은 본문을 보냅니다. 변경 없이 재시도하지 마세요 |
| 429 | `quota_exceeded` | Agents 할당량 초과 | 나중에 재시도합니다 |
| 502 | `executor_rejected`, `executor_contract_error` | 실행 계층이 요청을 거부했거나 예상치 못한 응답을 반환함 | Agent 설정을 확인한 뒤 재시도합니다 |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | 의존 서비스를 일시적으로 사용할 수 없음 | 백오프와 같은 `Idempotency-Key`로 재시도합니다 |

`skill_runtime_incompatible`도 나타날 수 있으며, `internal error` 메시지와 함께 503으로 반환됩니다.

## 스트리밍 실패 {#streaming-failures}

스트리밍 응답이 시작된 후에는 실패가 새 HTTP 상태가 아니라 프로토콜의 스트림 형식으로
전달될 수 있습니다. 스트림을 불완전한 것으로 간주해 닫고, 애플리케이션에 필요한 부분 콘텐츠를 보존한 뒤,
요청을 반복해도 안전한 경우에만 재시도하세요.

## 함께 보기 {#see-also}

- [오류 코드](/api-reference/errors) — 공개 응답 형식과 일반적인 HTTP 상태
- [속도 제한](/guides/rate-limiting) — 429 처리와 요청 평활화
- [오류와 재시도](/guides/error-handling) — 구현 패턴
- [인증](/api-reference/authentication) — 지원되는 자격 증명과 키 수명 주기
