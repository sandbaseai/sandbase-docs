---
i18nSource: 071e97a48f9c4f4c
title: API 레퍼런스
description: SandBase 모델을 호출하고 Agents, Sessions, Skills, MCP 연결, Secrets, 계정 리소스를 관리합니다.
---

# API 레퍼런스 {#api-reference}

API로 모델을 직접 호출하거나, 재사용할 수 있는 Agent를 정의하고 Session에서 실행하며 Skills와 MCP 도구에 연결할 수 있습니다.

::: tip 모델 추론을 찾고 계신가요?
추론 계약(Chat Completions, Responses, Anthropic Messages, Gemini, Images, Seedance 동영상)은 이 레퍼런스의 **모델 추론** 섹션에 있습니다. 각 모델의 고유 필드와 요금은 [Models 카탈로그](https://www.sandbase.ai/models)의 해당 페이지에서 확인할 수 있습니다.
:::

## 시작점 선택 {#choose-a-starting-point}

| 목표 | 시작 위치 | 다음 단계 |
|---|---|---|
| 재사용 가능한 동작 정의 | [Agents](/api-reference/agents/) | Agent 구성을 생성하고 버전을 관리합니다 |
| Agent 직접 실행 | [Sessions](/api-reference/sessions/) | 입력을 보내고, 이벤트를 스트리밍하고, 기록을 읽습니다 |
| 지침 번들 재사용 | [Skills](/api-reference/skills/) | 버전이 있는 ZIP 번들을 업로드하고 Agent에 연결합니다 |
| 외부 도구 호출 | [MCP 연결](/api-reference/mcp-connections/) | Agent용 원격 HTTPS MCP 서버를 등록합니다 |
| 외부 도구 인증 | [Secrets](/agents/api-credentials#with-the-api) | MCP 연결용 쓰기 전용 Bearer 토큰을 저장합니다 |

## 리소스 수명 주기 {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent**(`agt_`)는 저장되고 버전이 관리되는 구성이며, 생성해도 실행되지 않습니다.
- **Session**(`ses_`)은 Agent 버전 하나를 실행하고 해당 Skills와 MCP 연결을 고정합니다. Session 경로는 `/v1/agents/sessions` 아래에 있습니다.
- **Skill**(`skl_`)은 버전이 있는 지침 번들입니다. **MCP 연결**(`mcp_`)은 원격 도구 서버를 등록하고, **Secret**(`sec_`)은 그 Bearer 토큰을 저장합니다.

## Agents 플랫폼 리소스 규칙 {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, MCP 연결, Secrets는 `https://api.sandbase.ai/v1`에서 제공되며 다음 규칙을 공유합니다.

- `Authorization: Bearer` 또는 `X-API-Key`로 인증합니다. [인증](/api-reference/authentication#agents-platform-resources)을 참고하세요.
- 요청 본문은 최대 1 MiB의 엄격한 JSON이며, 알 수 없는 필드는 400을 반환합니다.
- MCP 연결이나 Secrets를 생성하는 쓰기에는 `Idempotency-Key`가 필요합니다. 다른 쓰기에서는 선택적으로 사용할 수 있습니다.
- 낙관적 동시성 제어에는 `row_version`을 사용합니다. 마지막으로 읽은 값을 보내고, 409를 받으면 다시 읽으세요.
- Agents, Sessions, items, turns, Skills는 커서 페이지네이션(`limit`, `after`, `order`, 응답에 `has_more`와 `last_id` 포함)을 사용합니다. Agent 버전, 첨부 파일, MCP 연결, Secrets는 오프셋 페이지네이션(`limit`, `offset`, 응답에 `total` 포함)을 사용합니다.
- 오류는 `{"error": {"type", "code", "param", "message"}}` 형식을 사용합니다. [Agents 플랫폼 오류](/api-reference/errors#agents-platform-errors)를 참고하세요.

## 인증 {#authentication}

SandBase API 키를 Bearer 토큰으로 보냅니다.

```http
Authorization: Bearer sk-YOUR_KEY
```

키는 불투명한 비밀 값으로 취급하고, 서버에만 보관하며, 브라우저 코드나 로그에 포함하지 마세요. 호환성 세부 사항은 [인증](/api-reference/authentication)을, 공개 오류 엔벨로프는 [오류](/api-reference/errors)를 참고하세요.

## 조직과 사용량 {#organization-and-usage}

플랫폼 리소스는 API 키에 연결된 조직에 속합니다. 지원되는 잔액과 최근 실행 기록은 [Account API](/api-reference/account/)로 확인합니다. 여기에 공개 엔드포인트가 문서화되지 않은 조직 관리와 결제 관리는 Console에서 수행합니다.

## 레퍼런스 형식 {#reference-formats}

- 사이드바에서 작업을 둘러보며 예제와 응답 세부 정보를 확인합니다.
- 기계가 읽을 수 있는 [OpenAPI 명세](/openapi.yaml)를 다운로드합니다.
- 정확한 요청 필드는 [Models 카탈로그](https://www.sandbase.ai/models)의 모델 페이지나 [APIs 카탈로그](https://www.sandbase.ai/apis)의 API 페이지에서 확인합니다.

## 다음 단계 {#next-steps}

- 관리형 Agents가 처음이라면: [Agent 빌드](/agents/)
- 모델 직접 호출: [Chat Completions](/api-reference/llm-gateway) 또는 [Models 카탈로그](https://www.sandbase.ai/models)
