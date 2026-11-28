---
i18nSource: c063864501452a7b
title: SandBase 문서
description: Models와 APIs로 직접 구축하거나, 관리형 인프라에서 실행되는 재사용 가능한 Agent를 정의하세요.
---

# SandBase 문서 {#sandbase-docs}

Models와 APIs로 직접 구축하거나, 관리형 인프라에서 실행되는 재사용 가능한 Agent를 정의하세요.

SandBase는 AI 애플리케이션을 구축하는 두 가지 상호 보완적인 방법을 제공합니다. 작업에 맞는 가장 작은 범위부터 시작하고, 애플리케이션이 커지면 두 방법을 함께 사용할 수 있습니다.

## 구축 방식 선택 {#choose-how-to-build}

| | Models와 APIs | 관리형 Agents |
|---|---|---|
| **개요** | 언어, 이미지, 비디오, 오디오, 서드파티 API에 직접 접근 | SandBase가 실행하는 재사용 가능하고 버전 관리되는 Agent 설정 |
| **적합한 용도** | 커스텀 애플리케이션 루프와 세밀한 요청 제어 | 여러 단계로 이루어지거나, 비동기이거나, 반복 가능한 작업 |
| **직접 관리하는 것** | 프롬프트, 오케스트레이션, 재시도, 애플리케이션 상태 | Agent 정의, 활성화된 기능, 입력, 결과 전달 방식 |
| **시작하기** | [Models와 APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip 하나의 SandBase API 키
같은 API 키로 Models, APIs, Agents를 모두 호출할 수 있습니다. 키는 서버에 보관하고 브라우저 코드에 절대 노출하지 마세요.
:::

## 핵심 개념 {#core-concepts}

### Models와 APIs {#models-and-apis}

언어, 이미지, 비디오, 오디오 워크로드에는 Models를 사용하세요. 애플리케이션에 외부 데이터나 작업이 필요하면 APIs를 사용하세요. SandBase 웹사이트의 카탈로그에서 사용 가능한 기능, 가격, 입력 스키마, 실행 가능한 예제를 확인할 수 있습니다.

- [Models 둘러보기](https://www.sandbase.ai/models)
- [APIs 둘러보기](https://www.sandbase.ai/apis)
- [첫 API 호출하기](/getting-started/first-call)
- [API 레퍼런스 열기](/api-reference/)

### Agents {#agents}

Agent는 Model, 지침, Skills, MCP 연결을 포함하는 재사용 가능하고 버전 관리되는 설정입니다. 한 번 정의한 뒤 Session에서 실행하세요.

- [Agents 이해하기](/agents/)
- [Agent 정의하기](/agents/agent-api)
- [Skills와 MCP 도구 추가하기](/agents/mcp-tools)

### Sessions {#sessions}
Session은 Agent 버전 하나를 실행합니다. `POST /v1/agents/sessions`로 생성하고, 입력을 보내고, 이벤트를 스트리밍한 뒤 전체 대화를 읽을 수 있습니다.

- [Sessions 가이드](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## 첫 단계 {#first-steps}

1. 조직과 [API 키](/getting-started/api-keys)를 만듭니다.
2. [카탈로그](https://www.sandbase.ai/models)에서 Model, API 또는 Agent를 선택합니다.
3. 직접 요청을 보내거나 Agent를 정의하고 테스트합니다.
4. 테스트한 Agent를 애플리케이션에서 Session으로 실행합니다.
5. Console에서 Session, 오류, 지연 시간, 비용을 검토합니다.

## 운영 가이드 {#operational-guidance}

- [응답 스트리밍](/guides/streaming)
- [오류 처리와 재시도](/guides/error-handling)
- [속도 제한](/guides/rate-limiting)
- [결제와 가격](/guides/billing)
- [워크스페이스 관리](/admin/)

## 다음 단계 {#next-steps}

- 로컬 Skills로 만들기: [Skill 튜토리얼](/guides/skills/)

- SandBase가 처음이라면: [시작하기](/getting-started/)
- Model 또는 API 호출: [Models 카탈로그](https://www.sandbase.ai/models)와 [APIs 카탈로그](https://www.sandbase.ai/apis)
- 추론 및 Agent API: [API 레퍼런스](/api-reference/)
- 재사용 가능한 작업 구축: [Build Agent](/agents/)
- AI 도구 연결: [설정](/setup/)
