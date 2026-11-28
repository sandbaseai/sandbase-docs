---
i18nSource: 5b94f91222d138de
title: API 인증
description: Bearer 토큰과 지원되는 프로토콜 호환 API 키 헤더로 SandBase API를 인증합니다.
---

# 인증 {#authentication}

SandBase는 API 키로 공개 API 요청을 인증합니다. 이 페이지에서는 지원되는 연동 방식과
키 관리 방법을 다룹니다. Console 인증과 그 내부 API는 공개 API 계약에 포함되지 않습니다.

## 인증 방식 {#authentication-methods}

표준 SandBase `/v1/*` 엔드포인트에는 Bearer 토큰이 필요합니다. Anthropic Messages와 Google Gemini 호환 작업은 각 네이티브 SDK와 호환되는 API 키 위치도 허용합니다.

### Bearer 토큰 {#bearer-token}

`Authorization` 헤더에 키를 포함합니다.

```http
Authorization: Bearer sk-your-api-key
```

OpenAI 호환 SDK에서 사용하는 표준 방식입니다.

### Anthropic Messages: x-api-key 헤더 {#anthropic-messages-x-api-key-header}

`x-api-key` 헤더에 키를 포함합니다.

```http
x-api-key: sk-your-api-key
```

이 헤더는 `POST /v1/messages`에서만 지원됩니다. 다른 공개 엔드포인트는 이 헤더를 읽지 않으므로, Chat Completions, `/v1/run`, 리소스 API에는
Bearer 인증을 사용하세요.

### 우선순위 {#priority}

`POST /v1/messages`에 한해, 두 헤더가 모두 있으면 `x-api-key`가 우선합니다.

### Google Gemini 호환 API 키 {#google-gemini-compatible-api-keys}

Gemini GenerateContent 및 Interactions 작업은 `x-goog-api-key`, `Authorization: Bearer …`, `key` 쿼리 매개변수를 이 우선순위대로 허용합니다. 쿼리 문자열의 자격 증명은 로그와 브라우저 기록에 남을 수 있으므로 헤더 사용을 권장합니다. 지원되는 경로는 [Google Gemini](/api-reference/gemini-generate-content)와 [Gemini Interactions](/api-reference/gemini-interactions)를 참고하세요.

### 추출 로직 {#extraction-logic}

표준 엔드포인트는 `Authorization: Bearer <key>`만 읽습니다. Anthropic Messages 미들웨어는 `x-api-key`를
먼저 읽고, 없으면 Bearer 헤더를 사용합니다. Agents 플랫폼 리소스는 `Authorization: Bearer` 또는
`X-API-Key`를 허용합니다(아래 참고). [webhook Events API](/api-reference/webhooks)(`/events/webhooks*`)도 두 헤더를
모두 허용하며, 둘 다 있으면 Bearer 헤더를 사용합니다. 지원되는 자격 증명이 없으면 `401 Unauthorized`를 반환합니다.

### Agents 플랫폼 리소스 {#agents-platform-resources}

`/v1/agents*`(`/v1/agents/sessions*` 포함), `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`는 두 헤더 중 어느 쪽으로든 키를 받습니다.

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- `Authorization: Bearer`와 `X-API-Key`를 모두 보내는 경우 같은 키여야 하며, 값이 다르면 `401 unauthorized`를 반환합니다. 같은 헤더를 반복해도 401을 반환합니다.
- `OpenAI-Beta`는 선택 사항입니다. 보내는 경우 값은 `agents=v1`이어야 합니다.
- 읽기 요청에는 `agents.read` 권한이, 쓰기 요청에는 `agents.write` 권한이 필요합니다. Console에서 만든 표준 키에는 두 권한이 모두 있습니다. CLI Login 키처럼 SandBase가 발급한 범위 제한 키는 `403 insufficient_scope`를 반환합니다.
- `402 spending_limit_exceeded`는 키의 지출 한도 또는 조직 잔액이 소진되었음을 뜻합니다.
- 실패 응답은 아래의 단순한 `{"error": "…"}` 형식이 아니라 [Agents 오류 형식](/api-reference/errors#agents-platform-errors)을 사용합니다.

## API 키 형식 {#api-key-format}

Console에서 새로 만든 API 키는 다음 형식입니다.

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| 구성 요소 | 설명 |
|-----------|-------------|
| `sk-` | 표준 "secret key" 접두사 |
| `xxxx...` | 32바이트 난수로 생성한 16진수 64자 |

기존 `sk-sb-...` 키는 만료되거나 폐기될 때까지 계속 사용할 수 있습니다. 클라이언트는 접두사나 길이로 자격 증명을 거부하지 말고
키를 불투명한 문자열로 취급해야 합니다.

::: warning
API 키를 클라이언트 측 코드, 공개 저장소, 로그에 절대 노출하지 마세요. 비밀번호처럼 다루세요.
:::

## API 키 생성 {#create-api-keys}

### Console에서 생성 {#via-console}

1. [SandBase Console](https://www.sandbase.ai/console)에 로그인합니다
2. **Developer → API Keys**를 엽니다
3. **New key**를 클릭합니다
4. 키에 알아보기 쉬운 이름을 지정합니다(예: "Production Backend", "Development")
5. 키를 즉시 복사합니다. 다시 표시되지 않습니다

### 키 속성 {#key-properties}

| 속성 | 설명 |
|----------|-------------|
| Name | 식별용 이름 |
| Organization | 키가 속한 조직 |
| Enabled | 키 활성화 여부 |
| Spending Limit | 선택적인 키별 지출 상한 |
| Expires At | 선택적인 만료일 |
| Created At | 키 생성 시각 |

Console에서 만든 표준 키는 문서화된 공개 API에 대해 조직 수준 접근 권한을 가집니다. CLI Login 키처럼 SandBase가 발급한 자격 증명은 제한된 범위를 가질 수 있습니다. Console에서는 표준 키의 범위를 사용자가 선택할 수 없습니다.

## 키 수명 주기 {#key-lifecycle}

### 교체 {#rotation}

키를 교체하려면 다음과 같이 합니다.

1. Console에서 새 키를 만듭니다
2. 애플리케이션이 새 키를 사용하도록 업데이트합니다
3. 프로덕션에서 새 키가 동작하는지 확인합니다
4. 이전 키를 폐기합니다

::: tip
다운타임을 피하려면 항상 이전 키를 폐기하기 전에 새 키를 먼저 만드세요.
:::

### 폐기 {#revocation}

폐기된 키로는 새 요청을 인증할 수 없습니다. API는 다음 메시지와 함께 `401 Unauthorized`를 반환합니다.

```json
{"error":"API key has been revoked"}
```

### 만료 {#expiration}

키에는 선택적으로 만료일을 지정할 수 있습니다. 만료된 키는 다음 메시지와 함께 `401 Unauthorized`를 반환합니다.

```json
{"error":"API key has expired"}
```

## 엔드포인트별 인증 요구 사항 {#endpoint-authentication-requirements}

| 엔드포인트 | 인증 방식 | 설명 |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API 키(Bearer) | Chat Completions |
| `POST /v1/responses` | API 키(Bearer) | OpenAI 호환 Responses API |
| `POST /v1/messages` | API 키(Bearer 또는 x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API 키(x-goog-api-key, Bearer 또는 쿼리 key) | Gemini GenerateContent |
| `/v1beta/interactions*` | API 키(x-goog-api-key, Bearer 또는 쿼리 key) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API 키(Bearer 또는 X-API-Key) | Agents 플랫폼 리소스 |

SandBase Console은 별도의 브라우저 인증 흐름을 사용합니다. Console의 내부 요청은 지원되는 공개
엔드포인트가 아니므로 연동에 사용하면 안 됩니다.

## 조직 격리 {#organization-isolation}

API 키는 조직 범위로 제한됩니다. 키로 인증하면 다음이 적용됩니다.

- 자신의 조직에 속한 리소스에만 접근할 수 있습니다
- 사용량과 결제는 조직별로 집계됩니다

## 오류 응답 {#error-responses}

| HTTP 상태 | 메시지 | 원인 |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | 키가 제공되지 않음 |
| 401 | `invalid API key` | 데이터베이스에서 키를 찾을 수 없음 |
| 401 | `API key has been revoked` | 키가 비활성화됨 |
| 401 | `API key has expired` | 키의 만료일이 지남 |
| 402 또는 프로토콜별 403 | `API key spending limit exceeded` | 키 수준 지출 한도에 도달함. 해당 엔드포인트의 문서화된 오류 계약을 확인하세요 |
| 403 | `API key is not authorized for this endpoint` | 범위 제한 키를 범위 밖의 엔드포인트에 사용함 |

이 메시지는 `403` 범위 오류를 제외하고 단순한 `{"error":"<message>"}` 본문으로 전달됩니다. 모델 및 계정
엔드포인트에서는 범위 오류가 `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`를 사용하고,
Agents 플랫폼 리소스에서는 `code`가 `insufficient_scope`인 [Agents 오류 형식](/api-reference/errors#agents-platform-errors)을
사용합니다.

## 보안 모범 사례 {#security-best-practices}

### 권장 사항 {#do}

- **키는 환경 변수에 저장합니다**: 소스 코드에 키를 하드코딩하지 마세요
- **환경마다 별도의 키를 사용합니다**: 개발, 스테이징, 프로덕션에 서로 다른 키를 사용합니다
- **만료일을 설정합니다**: 보안 정책에 맞는 교체 주기를 정하세요
- **사용량을 모니터링합니다**: Console에서 예상치 못한 활동이 있는지 확인합니다
- **표준 키는 공개 API 접근이 필요한 워크로드에만 사용합니다**: 범위 제한 CLI Login 자격 증명은 해당 관리 흐름 안에서만 사용하세요

### 금지 사항 {#don-t}

- **키를 버전 관리에 커밋하지 마세요**: `.env`를 `.gitignore`에 추가합니다
- **관련 없는 애플리케이션 간에 키 하나를 공유하지 마세요**: 키를 분리하면 교체와 사고 대응이 더 안전합니다
- **클라이언트 측 코드에 키를 노출하지 마세요**: 항상 백엔드를 거쳐 프록시합니다
- **API 키를 로그에 남기지 마세요**: 애플리케이션 로그에서 키를 마스킹합니다

### 환경 변수 예시 {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## 키별 속도 제한 {#rate-limiting-by-key}

요청 한도는 조직 단위로 할당되며 조직의 모든 API 키가 공유하므로, 키를 더 만들어도 한도가
늘어나지 않습니다. API는 공통 숫자 기본값이나
남은 할당량 헤더를 공개하지 않습니다.

한도와 429 응답 처리에 대한 자세한 내용은 [속도 제한](/guides/rate-limiting)을 참고하세요.
