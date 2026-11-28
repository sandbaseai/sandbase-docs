---
i18nSource: a86346e2696c732c
title: FAQ
description: AI 도구 연결, SandBase 카탈로그, Models, APIs, Agents, Sessions, 청구에 관해 자주 묻는 질문입니다.
---

# 자주 묻는 질문 {#frequently-asked-questions}

## SandBase란 무엇인가요? {#what-is-sandbase}

SandBase는 Agent가 실제 세계와 연결되도록 돕습니다.

바로 사용할 수 있는 Models와 APIs를 사용하거나, AI tools에서 연결한 뒤 AI 도구에서 사용하거나, 재사용 가능한 Agent를 만들어 Session에서 실행할 수 있습니다.

## SandBase는 누구를 위한 서비스인가요? {#who-is-sandbase-for}

SandBase는 주로 세 그룹을 위한 서비스입니다.

- Codex, Claude, Cursor, Kiro 안에서 유용한 기능을 사용하려는 **AI 도구 사용자**
- Models와 APIs를 직접 호출하려는 **빌더**
- 고객이나 내부 워크플로를 위해 재사용 가능한 Agent를 만드는 **FDE와 팀**

## 기능은 어디에서 둘러볼 수 있나요? {#where-do-i-browse-capabilities}
SandBase 웹사이트에 기능 카탈로그가 있습니다.

- [Models](https://www.sandbase.ai/models)와 [이미지 및 동영상 모델](https://www.sandbase.ai/models/image-video)
- [APIs](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
기능 종류에 따라 확인, 테스트, 설치, 호출, 복제할 수 있습니다.

## AI tools란 무엇인가요? {#what-is-ai-tools}

Console의 **Build → AI tools**는 Claude Code, Codex, Cursor, Kiro처럼 이미 사용 중인 AI 도구를 SandBase에 연결합니다. 에이전트에 `set up https://www.sandbase.ai/SKILL.md`를 붙여 넣거나 `npx -y @sandbaseai/cli@latest connect`를 실행하세요. 연결된 도구는 SandBase의 Models 및 APIs 카탈로그를 검색하고 실행할 수 있으며, 비용은 워크스페이스에 청구됩니다. [AI 도구 연결하기](/setup/)를 참고하세요.

## Build Agent란 무엇인가요? {#what-is-build-agent}

Build Agent는 Agent를 정의하고 테스트하는 곳입니다.

Agent는 지침, Model, Skills, MCP 도구를 하나의 재사용 가능하고 버전 관리되는 워크플로로 결합합니다.

## Agent는 API와 다른가요? {#is-an-agent-different-from-an-api}
네. Agent는 편집하고 테스트하는 버전 관리되는 구성이며, Session을 생성해 실행합니다. Agent를 계속 편집하는 동안에도 앱에서 [Sessions API](/api-reference/sessions/)로 Session을 생성할 수 있습니다.

## Session이란 무엇인가요? {#what-are-sessions}
Session은 대화, 도구 활동, 출력을 포함한 Agent 실행 한 번입니다.

## Agent가 외부 API에 접근하려면 어떻게 하나요? {#how-do-i-give-an-agent-access-to-external-apis}

외부 시스템을 MCP 서버로 연결하고 Agent의 MCP 연결에 추가하세요. 서버에 Bearer 토큰이 필요하면 [Secrets API](/agents/api-credentials#with-the-api)를 사용해 해당 서버 URL에 바인딩된 쓰기 전용 Secret으로 저장하세요. 토큰은 해당 서버로만 전송되며 프롬프트나 Agent 런타임에는 나타나지 않습니다. [MCP 도구용 자격 증명](/agents/api-credentials)을 참고하세요.

## Models는 어디에 있나요? {#where-do-models-live}

Models는 중요한 구성 요소이므로 별도의 [카탈로그](https://www.sandbase.ai/models)가 있습니다.

Model은 직접 호출하거나, 연결된 AI 도구에서 사용하거나, Agent 안에서 사용할 수 있습니다.

## 코드를 작성해야 하나요? {#do-i-need-to-write-code}

항상 그런 것은 아닙니다.

코드를 작성하지 않고 AI 도구 안에서 기능을 사용하려면 [AI 도구를 연결](/setup/)하세요.

애플리케이션에서 SandBase를 호출하려면 API Reference를 사용하세요.

재사용 가능한 다단계 작업이 필요하면 Build Agent를 사용하세요.

## API 키는 어떻게 발급받나요? {#how-do-i-get-an-api-key}

Console을 열고 **Developer → API Keys**로 이동한 다음 **New key**를 선택하세요.

키는 다음과 같이 사용합니다.

```http
Authorization: Bearer sk-YOUR_KEY
```

## 청구는 어떻게 이루어지나요? {#how-does-billing-work}

SandBase는 크레딧과 사용량 기반 청구를 사용합니다.

Models, APIs, Agents, 런타임 작업은 비용이 서로 다를 수 있습니다. 현재 사용량과 가격은 Console에서 확인하세요.

## 다음 단계 {#next-steps}

- [시작하기](/getting-started/)
- [Models 및 APIs 카탈로그](https://www.sandbase.ai/models)
- [AI 도구 연결하기](/setup/)
- [Build Agent](/agents/)
- [API Reference](/api-reference/)
