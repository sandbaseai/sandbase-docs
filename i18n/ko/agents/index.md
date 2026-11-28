---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: 재사용 가능하고 버전이 관리되는 Agent를 정의하고, 테스트하고, SandBase Session에서 실행합니다.
---

# Build Agent {#build-agent}

Build Agent에서는 Agent를 정의하고 테스트한 뒤 실행 방식을 결정합니다.

Agent는 저장되고 버전이 관리되는 구성으로, 모델, 지시, 런타임 프로필, Skill, 외부 도구에 대한 MCP 연결로 이루어집니다. Agent를 저장한다고 해서 실행되지는 않습니다.

## Agent의 구성 {#what-an-agent-is}

| 질문 | 위치 |
|---|---|
| 무엇을 해야 하나요? | `instructions` |
| 어떤 모델이 작업하나요? | `model`, [Models API](/api-reference/models/)의 모델 ID |
| 무엇을 할 줄 아나요? | [Skill](/agents/mcp-tools#skills), 버전이 관리되는 지시 번들 |
| 어떤 외부 도구를 호출할 수 있나요? | [MCP 연결](/agents/mcp-tools#mcp-connections), 서버에 토큰이 필요하면 [자격 증명](/agents/api-credentials)과 함께 사용 |
| 어떻게 실행되나요? | [Session](/agents/sessions)에서 실행 |

실제로 적용되는 변경마다 변경 불가능한 새 버전이 생성됩니다. 언제든지 버전 목록을 조회하고 이전 버전을 복원할 수 있습니다.

## Agent 실행 방식 {#how-an-agent-runs}

Agent는 [Session](/agents/sessions)에서 실행합니다. Session은 입력을 보내고 이벤트를 스트리밍으로 받는 `ses_` 리소스로, 대화형 대화, 테스트 실행, 애플리케이션 호출에 모두 사용합니다. 각 Session은 시작할 때의 Agent 버전을 고정하므로, 기존 Session에 영향을 주지 않고 Agent를 계속 편집할 수 있습니다.

## Agent 수명 주기: 초안 작성 → Session에서 테스트 → 앱에서 실행 → Session 검토 {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. 초안 작성 {#_1-draft}

Console의 **Build → Agents**에서 또는 [`POST /v1/agents`](/agents/agent-api)로 Agent를 생성합니다. 가장 작은 유용한 워크플로부터 시작하고, Skill과 MCP 연결은 지시에 필요할 때만 추가하세요.

### 2. Session에서 테스트 {#_2-test-in-a-session}

Agent용 Session을 만들고 대표적인 입력을 보낸 뒤 출력, 도구 활동, 오류를 확인합니다. 정상 경로뿐 아니라 입력 누락, 사용할 수 없는 도구, 빈 결과, 출력 형식 요구 사항도 테스트하세요.

### 3. 앱에서 실행 {#_3-run-from-your-app}

[Sessions API](/api-reference/sessions/)를 사용해 애플리케이션에서 테스트를 마친 Agent의 Session을 생성합니다.

### 4. Session 검토 {#_4-inspect-sessions}

Sessions API로 각 Session의 items와 turns를 읽어 전체 대화, 도구 활동, 오류를 검토합니다.

## 프로덕션 체크리스트 {#production-checklist}

- `model`은 Models API의 최신 모델 ID를 사용합니다.
- 동작이 예고 없이 바뀌면 안 되는 경우 Skill을 특정 버전에 고정합니다.
- MCP 연결은 `allowed_tools`로 Agent에 필요한 도구만 노출합니다.
- 토큰은 [Secret](/agents/api-credentials)으로 저장하고, 지시, 입력, 메타데이터에 절대 쓰지 않습니다.
- Session 생성 시 `Idempotency-Key`를 보내고, 재시도할 때 같은 키를 재사용합니다.
- 실행 후 Session 상태와 오류를 확인합니다.

## 카탈로그 Agent {#catalog-agents}

공개 [Agent 카탈로그](/api-reference/agents/catalog)에는 SandBase가 게시한 Agent가 나열됩니다. 카탈로그 Agent는 읽을 수 있지만, 변경하려면 먼저 `POST /v1/agents/catalog/{agent_id}/clone`으로 조직에 복제해야 합니다. 복제본은 사용자가 소유하고 실행할 수 있는 새로운 비공개 Agent입니다.

::: tip OpenAI SDK 사용하기
Agent, Session, Skill은 OpenAI Agents API를 따르므로, 공식 OpenAI SDK를 `base_url="https://api.sandbase.ai/v1"`과 함께 사용할 수 있습니다. 검증된 예시와 차이점은 [OpenAI 호환성](/agents/openai-compatibility)을 참고하세요.
:::

## 다음 단계 {#next-steps}

- [Agent 정의하기](/agents/agent-api)
- [OpenAI 호환성](/agents/openai-compatibility)
- [Skill과 MCP 도구](/agents/mcp-tools)
- [Session](/agents/sessions)
