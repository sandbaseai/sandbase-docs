---
i18nSource: 0314b37a870481ae
title: AI가 읽기 쉬운 문서
description: AI 에이전트가 SandBase API를 찾고 사용하는 데 필요한 모든 내용을 한 페이지로 요약했습니다.
---

# AI 친화적 API 개요 {#ai-friendly-api-overview}

::: info Session 계약
Session(`ses_*`)은 저장된 Agent 버전 하나를 실행하며, `POST /v1/agents/sessions`로 직접 생성합니다. 런타임 인스턴스는 내부에서만 사용되며 반환되지 않습니다.
:::

> 사람과 AI 에이전트 모두를 위한 간결한 레퍼런스입니다. LLM 입력에 최적화된 일반 텍스트 버전은 [`llms.txt`](https://www.sandbase.ai/docs/llms.txt)를 참고하세요.

## SandBase란? {#what-is-sandbase}

SandBase는 AI 에이전트 인프라 플랫폼입니다. API 키 하나로 언어, 이미지, 동영상, 오디오, 검색, 데이터 분야의 활성화된 Models와 APIs, 그리고 Agent 워크플로에 접근할 수 있습니다. 고정된 개수에 의존하지 말고 현재 카탈로그를 조회하세요.

## API Base URL {#api-base-url}

```
https://api.sandbase.ai/v1
```

## 인증 {#authentication}

모든 요청에는 Bearer 토큰이 필요합니다.

```
Authorization: Bearer sk-YOUR_KEY
```

키는 [Developer → API Keys](https://www.sandbase.ai/console/keys)에서 발급받으세요.

## 간단한 예시 {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## 핵심 API {#core-apis}

| 메서드 | 경로 | 설명 |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | OpenAI 호환 채팅. 선택적 기능은 선택한 모델에 따라 다름 |
| `POST` | `/v1/messages` | Anthropic 호환 messages API |
| `POST` | `/v1/run` | 모델별 스키마를 사용해 모델 생성 요청 제출 |
| `GET` | `/v1/run/{id}` | 비동기 생성 상태 폴링 및 결과 조회 |
| `GET` | `/v1/models` | 활성화된 논리 모델 목록 조회. 기본값은 LLM 유형 |
| `GET` | `/v1/models/{id_or_name}` | 모델 세부 정보, 스키마, 기능, 가격 조회 |
| `GET` | `/v1/tasks/{task_id}/cost` | 작업 비용 및 사용량 조회 |

## 추가 API 그룹 {#additional-api-groups}

핵심 생성 API 외에도 SandBase는 Agent 수명 주기 관리를 위한 API를 제공합니다. 일반적인 워크플로는 [AI API 가이드](./full)를, 전체 계약은 [OpenAPI 명세](https://www.sandbase.ai/docs/openapi.yaml)를 참고하세요.

| 그룹 | 주요 경로 | 용도 |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | 저장된 Agent 정의 생성 및 버전 관리 |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Agent 실행, 입력 전송, 실시간 이벤트 스트리밍 |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Agent가 마운트하는 버전 관리되는 지침 번들 |
| **MCP Connections 및 Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | 원격 HTTPS MCP 도구와 쓰기 전용 Bearer 토큰 |

Agents 플랫폼 리소스는 `Authorization: Bearer` 또는 `X-API-Key`를 허용하며, 실패 시 `{"error":{"type","code","param","message"}}`를 반환합니다.

## 가격 모델 {#pricing-model}

사용한 만큼 지불합니다. 가격은 모델마다 다르며 이 페이지와 별개로 변경될 수 있습니다.

- **모델 가격**: 선택한 모델의 현재 공식과 단위는 `model_card`에서 확인하세요
- **토큰 가격**: 해당 모델이 명시한 경우 입력, 출력, 캐시, 추론 구성 요소가 포함될 수 있습니다
- **미디어 및 기타 작업**: 요청당, 길이, 해상도 또는 기타 모델별 단위를 사용할 수 있습니다
- **데이터 API**(검색, 소셜, 스크래핑, 이커머스, 금융): 각 조직은 UTC 기준 하루 100회의 무료 호출을 받으며, 이는 대상 데이터 API 전체에서 공유됩니다. 이후 호출은 차단되지 않고 호출당 과금됩니다. MCP에서 대상 도구는 `sandbase_inspect`에 `pricing.free_quota`를 표시하며, `sandbase_account`는 `free_api_quota`(`daily_limit`, `used_today`, `remaining`, `resets_at`)를 반환합니다. [일일 무료 API 호출](/guides/billing#daily-free-api-calls)을 참고하세요.

`GET /v1/models`로 현재 모델 ID를 확인한 다음, 요청을 보내기 전에 `GET /v1/models/{id_or_name}`을 확인하세요. 가격이나 캐시 할인이 제공업체 간에 동일하다고 가정하지 마세요.

작업이 작업 ID를 반환하면 기록된 비용을 확인하세요.

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## 요청 한도 {#rate-limits}

공개된 보편적인 기본 수치는 없습니다. 요청에는 조직에 할당되고 조직의 모든 API 키가 공유하는 선택적 분당 요청 수 한도가
적용됩니다. `429` 응답에는 할당량이나 `Retry-After` 헤더가 포함되지 않으므로, 지터를 적용한 상한이 있는
지수 백오프를 사용하세요. [오류 가이드](./errors)를 참고하세요.

---

## 더 읽어 보기 {#further-reading}

- [AI API 가이드](./full) — 핵심 워크플로, 요청/응답 형식, curl 예시
- [Models 및 가격](./models) — 실시간 모델 조회, 가격, 기능 안내
- [오류 가이드](./errors) — 문서화된 응답 형식, HTTP 처리, 재시도 안전성
- [OpenAPI 명세](https://www.sandbase.ai/docs/openapi.yaml) — 기계가 읽을 수 있는 OpenAPI 3.1

## 일반 텍스트 버전(AI 에이전트용) {#plain-text-versions-for-ai-agents}

| 파일 | URL | 내용 |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | 간단한 요약(약 60줄) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | 확장된 AI용 API 가이드 |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | 기계가 읽을 수 있는 OpenAPI 3.1 명세 |
