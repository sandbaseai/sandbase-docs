---
i18nSource: 3dc57d405dbf561d
title: API 키
description: API 요청 인증에 사용하는 SandBase API 키를 만들고, 관리하고, 안전하게 보호하는 방법입니다.
---

# API 키 {#api-keys}

API 키는 SandBase에 보내는 요청을 인증합니다. 이 가이드에서는 키를 만들고, 요청에 사용하고, 안전하게 보관하는 방법을 다룹니다.

## API 키 만들기 {#create-an-api-key}

1. [SandBase Console](https://www.sandbase.ai/console)에 로그인합니다
2. **Developer → API Keys**를 엽니다(또는 [API Keys](https://www.sandbase.ai/console/keys)로 바로 이동합니다)
3. **New key**를 클릭합니다
4. 용도를 알 수 있는 **Name**을 입력합니다(예: "Production Server", "Local Development")
5. 필요하면 **Spending limit**(비워 두면 무제한)과 **Expires** 날짜(비워 두면 만료 없음)를 설정합니다
6. **Create key**를 클릭합니다
7. **API key created** 배너에서 키를 즉시 복사합니다. 키는 한 번만 표시됩니다

::: danger 중요
API 키는 생성 시 한 번만 표시됩니다. 키를 잃어버리면 새로 만들어야 합니다. 대화 상자를 닫기 전에 안전한 곳에 저장하세요.
:::

## 키 형식 {#key-format}

Console에서 새로 만든 API 키는 `sk-` 접두사 뒤에 16진수 64자가 붙는 형식입니다.

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

기존 `sk-sb-...` 키는 만료되거나 폐기될 때까지 계속 유효합니다. 접두사만으로 자격 증명을 검증하지
마세요. 항상 전체 값을 불투명한 비밀 값으로 취급하세요.

## 인증 방식 {#authentication-methods}

SandBase는 요청에 API 키를 전달하는 두 가지 방식을 지원합니다.

### Authorization 헤더(권장) {#authorization-header-recommended}

표준 `Authorization: Bearer` 헤더를 사용합니다. OpenAI 및 Anthropic SDK와 호환됩니다.

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: x-api-key 헤더 {#anthropic-messages-x-api-key-header}

`POST /v1/messages`는 Anthropic 네이티브 `x-api-key` 헤더도 허용합니다.

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
모델 게이트웨이 중에서는 `POST /v1/messages`만 `x-api-key`를 읽으며, 지원되는 두 헤더가 모두 있으면 이 헤더가
우선합니다. [Agents 플랫폼 리소스](/api-reference/authentication#agents-platform-resources)도
`X-API-Key`를 허용합니다. 그 밖의 모든 공개 엔드포인트에는 Bearer 헤더를 사용하세요.
:::

## 키 권한 {#key-permissions}

SandBase API 키의 범위는 **조직 수준**입니다.

- Console에서 만든 표준 키는 조직에서 사용할 수 있는 공개 API 리소스를 호출할 수 있습니다
- 사용량은 키를 소유한 조직에 청구됩니다
- 키에는 선택적으로 만료일과 지출 한도를 설정할 수 있습니다
- CLI Login 키처럼 SandBase가 발급한 자격 증명은 제한된 범위를 가질 수 있으며, 범위 밖에서는 `403`을 반환합니다

현재 Console에서는 표준 키에 사용자가 범위를 선택하는 기능을 제공하지 않습니다. CLI Login 키는 AI 도구를 연결할 때 생성됩니다. API Keys 페이지에서는 이 키들을 펼칠 수 있는 **CLI Login** 행 하나로 묶어 보여 주며, 표준 키처럼 편집할 수 없습니다. SandBase가 대신 만든 키에는 **Auto-created** 배지가 붙습니다. 이 키에는 키 단위 한도가 없으며 계정 잔액으로 제한됩니다.

키 목록에는 각 키의 **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires**, **Status**가 표시됩니다. 표준 키의 이름, 지출 한도, 만료일을 변경하려면 **Edit**을 사용하세요.

각 키는 개인 비밀번호가 아니라 애플리케이션 자격 증명으로 취급하세요. 사람의 접근에는 조직 멤버십을, 워크로드에는 API 키를 사용하세요.

## 환경별 전략 {#environment-strategy}

애플리케이션과 환경마다 서로 다른 키를 만드세요.

| 키 | 이름 예시 | 이유 |
|---|---|---|
| 로컬 개발 | `research-app-dev` | 프로덕션을 중단하지 않고 순환할 수 있음 |
| 스테이징 | `research-app-staging` | 테스트 사용량과 장애를 분리할 수 있음 |
| 프로덕션 | `research-app-production` | 프로덕션의 소유자를 명확히 하고 노출 범위를 제한함 |
| 임시 자동화 | `release-check-2026-08` | 만료일을 설정하고 독립적으로 폐기할 수 있음 |

각 키의 소유자와 키를 사용하는 배포를 기록해 두세요. 순환할 때는 새 키를 배포하고, 요청이 성공하는지 확인한 뒤에야 이전 키를 폐기하세요.

## 키 만료와 폐기 {#key-expiration-and-revocation}

### 만료 {#expiration}

키를 만들 때 선택적으로 만료일을 설정할 수 있습니다. 만료된 키는 더 이상 작동하지 않으며 요청은 `401 Unauthorized` 오류를 반환합니다.

만료일이 없는 키는 직접 폐기할 때까지 유효합니다.

### 키 폐기 {#revoking-a-key}

키를 폐기(비활성화)하려면 다음을 수행합니다.

1. [Developer → API Keys](https://www.sandbase.ai/console/keys)로 이동합니다
2. 폐기할 키를 찾습니다
3. **Revoke**를 클릭합니다
4. 작업을 확인합니다

폐기된 키로는 새 요청을 인증할 수 없습니다. 폐기는 되돌릴 수 없으므로, 실수로 폐기했다면 새 키를 만드세요.

## 보안 모범 사례 {#security-best-practices}

### 키를 버전 관리 시스템에 커밋하지 마세요 {#never-commit-keys-to-version-control}

대신 환경 변수나 비밀 관리 도구를 사용하세요.

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### 환경별로 다른 키 사용 {#use-separate-keys-for-different-environments}

개발, 스테이징, 프로덕션에 각각 다른 키를 만드세요. 이렇게 하면 유출된 개발용 키를 폐기해도 프로덕션에 영향을 주지 않습니다.

### 정기적으로 키 순환 {#rotate-keys-regularly}

주기적으로 새 키를 만들고 이전 키를 폐기하세요. 키가 유출되었을 때 노출 기간을 줄일 수 있습니다.

### 활동 모니터링 {#monitor-activity}

**Developer → Activities**에서 예상치 못한 요청이나 사용량 급증이 없는지 정기적으로 확인하세요. 키가 유출되었다는 신호일 수 있습니다. **Request History**는 API 키로 필터링할 수 있습니다.

키가 노출되었다면 즉시 폐기하고, 대체 키를 만들고, 키를 사용하는 애플리케이션을 업데이트한 다음, Activities와 결제 내역에서 예상치 못한 사용량을 확인하세요. 예정된 순환 시점까지 기다리지 마세요.

### 만료일 설정 {#set-expiration-dates}

임시 접근(CI/CD 파이프라인, 외부 협력자 접근, 데모)에는 만료일을 설정하여 키가 자동으로 작동을 멈추도록 하세요.

## 문제 해결 {#troubleshooting}

| 오류 | 원인 | 해결 방법 |
|-------|-------|-----|
| `401 - missing API key` | 요청에 키가 없음 | `Authorization: Bearer <key>` 헤더를 추가합니다 |
| `401 - invalid API key` | 키가 존재하지 않음 | 오타가 없는지, 키 전체가 포함되었는지 확인합니다 |
| `401 - API key has been revoked` | Console에서 키가 영구적으로 폐기됨 | 대체 키를 만듭니다 |
| `401 - API key has expired` | 키의 만료일이 지남 | 새 키를 만들거나 만료일을 연장합니다 |
| `402 - API key spending limit exceeded` | 키가 설정된 지출 한도에 도달함 | 한도를 올리거나 권한이 있는 다른 키를 사용합니다 |
| `403 - insufficient_scope` | 범위가 지정된 자격 증명으로 이 엔드포인트를 호출할 수 없음 | 엔드포인트에 권한이 있는 키를 사용합니다 |

## 다음 단계 {#next-steps}

- [**첫 API 호출**](/getting-started/first-call): 요청과 응답 전체를 따라가며 API를 자세히 호출해 봅니다
- [**인증**](/api-reference/authentication): 지원되는 헤더, 수명 주기, 프로토콜별 오류
- [**API 레퍼런스**](/api-reference/): 전체 엔드포인트 문서
