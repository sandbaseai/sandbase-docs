---
i18nSource: 28b1ef75a197824a
title: AI 도구 연결
description: 프롬프트 하나나 CLI 명령 하나로 Claude Code, Codex, Cursor, Kiro 등 AI 도구에 SandBase의 Models 및 APIs 카탈로그를 제공합니다.
---

# AI 도구 연결 {#connect-ai-tools}

Console의 [AI tools](https://www.sandbase.ai/console/setup) 페이지(**Build → AI tools**)에서 이미 사용 중인 에이전트나 AI 도구를 SandBase에 연결합니다. 연결된 도구는 SandBase의 Models 및 APIs 카탈로그를 검색하고, 각 도구의 입력 스키마와 가격을 확인하고, 실행할 수 있습니다. 모든 호출은 활성 워크스페이스에 청구됩니다.

지원되는 클라이언트에는 Claude Code, Codex, Cursor, Kiro IDE 및 Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop, ChatGPT가 있습니다. 현재 목록은 AI tools 페이지에서 확인할 수 있습니다.

## 빠른 시작: 프롬프트 하나 붙여넣기 {#quick-start-paste-one-prompt}

에이전트에 다음 한 줄을 붙여넣습니다.

```text
set up https://www.sandbase.ai/SKILL.md
```

에이전트가 SandBase Skill을 읽고 CLI를 설치한 뒤, 브라우저 로그인 한 번을 승인하도록 요청합니다. API 키를 붙여넣을 필요는 없습니다. 에이전트가 클라이언트 구성이 완료되었다고 알리면, `sandbase_*` 도구가 로드되도록 새 세션을 시작하거나 앱을 다시 시작하세요.

Skill을 사용하려면 에이전트를 실행하는 컴퓨터에 Node.js 20 이상이 필요합니다.

## 그 밖의 연결 방법 {#other-ways-to-connect}

### CLI {#cli}

터미널에서 연결합니다. `--client`를 지정하지 않으면 CLI가 찾은 모든 지원 클라이언트를 구성합니다.

```sh
npx -y @sandbaseai/cli@latest connect
```

클라이언트 하나만 구성하려면 `codex`, `claude-code`, `cursor`, `kiro` 같은 ID를 전달합니다.

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

설치 스크립트도 같은 명령을 실행합니다.

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

로컬 구성을 변경하지 않고 설치 프로그램이 인식하는 클라이언트를 나열하려면 다음을 실행합니다.

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect`는 브라우저 인증을 열고, 승인한 워크스페이스에 대한 **CLI Login** 키를 만들며, SandBase가 소유한 클라이언트 구성만 작성합니다. 각 클라이언트에 대한 설명은 오픈 소스 [SandBase CLI](https://github.com/sandbaseai/cli)에 있습니다.

### 직접 구성하는 MCP 클라이언트 {#mcp-clients-you-configure-by-hand}

로그인한 사용자는 [AI tools](https://www.sandbase.ai/console/setup) 페이지의 **Other ways to connect**에서 MCP 서버 주소를 확인할 수 있습니다. **Developer → API Keys**에서 발급한 [API 키](/getting-started/api-keys)로 인증하고, 키는 클라이언트의 비밀 구성에 보관하세요.

## 연결 확인 {#verify-the-connection}

설치나 인증만으로는 클라이언트가 연결되었다고 확신할 수 없습니다. 다음을 확인하세요.

- 클라이언트에서 SandBase 서버 또는 커넥터가 보이는지
- 새 세션에서 `sandbase_*` 도구를 찾을 수 있는지
- 안전한 자연어 요청 하나가 성공적으로 완료되는지

CLI로 관리하는 클라이언트는 재연결하거나 구성을 변경한 뒤 진단을 실행하세요.

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor`는 로컬 자격 증명, MCP 항목, Skill을 확인한 다음 SandBase와 한 번 왕복 통신합니다. 최종 도구 호출은 항상 클라이언트 안에서 직접 수행하세요.

연결된 도구로 실행한 작업은 비용과 함께 [Activities](https://www.sandbase.ai/console/activities)에 표시됩니다.

## 문제 해결 {#troubleshooting}

| 문제 | 확인할 사항 |
|---|---|
| 도구가 보이지 않음 | 새 클라이언트 세션을 시작하거나 앱을 다시 시작하고, `npx -y @sandbaseai/cli doctor --client <client>`를 실행한 뒤 다시 시도합니다. |
| 인증 정보가 없음 | `connect`를 다시 실행하고 비용을 청구할 워크스페이스의 브라우저 로그인을 승인합니다. |
| 호출이 HTTP 402로 실패함 | [Billing](https://www.sandbase.ai/console/billing)에서 활성 워크스페이스에 크레딧을 추가합니다. |

## 관리형 구성 제거 {#remove-the-managed-configuration}

클라이언트 하나에 대해 SandBase가 소유한 항목만 제거합니다.

```sh
npx -y @sandbaseai/cli unregister --client codex
```

이 명령은 SandBase 소유임을 확인할 수 있는 구성만 제거하며, 관련 없는 항목이나 사용자가 관리하는 항목은 그대로 둡니다. 더 이상 필요하지 않다면 **Developer → API Keys**에서 해당 **CLI Login** 키를 폐기하세요.

## 소스와 지원 {#source-and-support}

- [소스 코드](https://github.com/sandbaseai/cli)
- [npm 패키지](https://www.npmjs.com/package/@sandbaseai/cli)
- [질문과 예제](https://github.com/sandbaseai/cli/discussions)
- [버그 신고](https://github.com/sandbaseai/cli/issues/new/choose)

## 다음 단계 {#next-steps}

- [Models 및 APIs 카탈로그](https://www.sandbase.ai/models)
- [Skill 튜토리얼](/guides/skills/)
- [Agent 빌드](/agents/)
