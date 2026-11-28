---
i18nSource: 8cb9626a2127cb8d
title: 빠른 시작
description: 플랫폼, API, Agent 중 SandBase를 사용할 방법을 선택하세요. Skills와 Tools를 찾고, 단계를 따라 하고, SDK 또는 CLI 저장소에서 시작할 수 있습니다.
pageClass: quickstart-page
---

# 빠른 시작 {#quick-start}

## SandBase 사용 방법 선택하기 {#connect}

아래는 모두 완료해야 하는 세 단계가 아니라 **세 가지 대안적인 시작 방법**입니다. 어느 방법을 사용하든 같은 SandBase 계정과 워크스페이스를 사용합니다.

<QuickstartPaths />

바로 사용할 수 있는 작업만 필요하신가요? [Tools 둘러보기](#use-tools) 또는 [Skill 선택하기](#use-skills)로 이동하세요. 로그인하기 전에도 공개 카탈로그와 문서를 둘러볼 수 있습니다.

### 오픈소스 저장소에서 시작하기 {#start-from-the-open-source-repositories}

- **[SandBase — SDK 및 예제](https://github.com/sandbaseai/sandbase)**: Python, TypeScript, Go 클라이언트, API 예제, 호스팅 Agent 워크플로가 포함되어 있습니다. 자체 애플리케이션을 만들 때 사용하세요.
- **[SandBase CLI 및 MCP](https://github.com/sandbaseai/cli)**: AI 도구를 설치하고 연결하거나 터미널에서 기능을 찾고 실행합니다. 기존 Agent와 함께 사용하세요.

## 시작하기 전에: 로그인 {#create-account}

Playground를 사용하거나, 호스팅 Skill을 실행하거나, API 키를 만들기 전에 로그인하세요. 계정 없이 동작하는 무료 도구는 바로 사용할 수 있습니다. **이미 로그인했다면 이 단계를 건너뛰고**, 계정 메뉴에 사용하려는 워크스페이스가 표시되는지 확인하세요.

SandBase는 GitHub 또는 Google 계정을 사용합니다. 별도의 이메일·비밀번호 가입은 없습니다.

1. [계정 만들기 / 로그인](https://www.sandbase.ai/login){target="_blank"}을 엽니다.
2. 보안 확인을 완료한 다음 **Sign in with GitHub** 또는 **Sign in with Google**을 선택합니다.
3. 제공업체 창에서 접근을 승인합니다.
4. 사용하던 페이지로 돌아가거나 [Console](https://www.sandbase.ai/console){target="_blank"}을 엽니다.

처음 로그인하면 계정과 **개인 워크스페이스**가 생성됩니다. SandBase를 사용해 보기 전에 조직을 만들 필요는 없습니다.

환영 크레딧이 표시되면 결제 수단을 추가하지 않고 시작할 수 있습니다. Console Dashboard의 **Balance** 카드와 [Billing](https://www.sandbase.ai/console/billing){target="_blank"}에서 현재 잔액을 확인할 수 있습니다.

## 플랫폼에서 사용하기 {#use-on-website}

클라이언트 설치나 코드 없이 브라우저에서 먼저 Model, API, Agent를 사용해 보려면 이 방법을 선택하세요.

1. 로그인한 다음 카탈로그를 엽니다.
   - [언어 모델](https://www.sandbase.ai/models){target="_blank"}
   - [이미지 및 동영상 모델](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. 모델 또는 API 상세 페이지를 열고, 제공되는 경우 **Playground**를 선택합니다.
3. 프롬프트, 이미지, 검색어, URL 등 필수 입력을 입력합니다. 실행하기 전에 표시된 가격을 확인하세요.
4. 요청을 실행하고 반환된 텍스트, 데이터, 이미지, 동영상 또는 작업 상태를 확인합니다.

웹사이트 Playground에는 별도의 API 키가 필요하지 않습니다. Playground를 제공하지 않는 기능이라면 **API** 탭을 사용해 아래 API 방법을 따르세요.

## API로 사용하기 {#call-api}

앱에 기능 하나를 추가하려면 이 방법을 선택하세요.

1. 사용하려는 워크스페이스의 유효한 키를 재사용하거나, [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"}에서 **New key**로 [API 키](/getting-started/api-keys)를 만듭니다. 키는 한 번만 표시되므로 즉시 복사하세요.
2. 카탈로그를 필터링하고 상세 페이지를 엽니다.
   - [언어 모델](https://www.sandbase.ai/models){target="_blank"} — 제공업체, 기능, 컨텍스트, 가격으로 필터링
   - [이미지 및 동영상 모델](https://www.sandbase.ai/models/image-video){target="_blank"} — 텍스트-이미지, 이미지-이미지, 텍스트-동영상, 이미지-동영상 등 멀티모달 모델 필터링
   - [APIs](https://www.sandbase.ai/apis){target="_blank"} — 플랫폼과 데이터 소스별로 API 리소스 필터링
3. **API** 탭을 열고 예시 요청을 복사한 다음, 해당 엔드포인트의 필수 필드를 채웁니다.
4. SandBase 키를 서버 환경 변수에 저장하고 요청을 실행합니다. 브라우저 코드나 공개 저장소에는 키를 넣지 마세요.
5. 응답을 확인합니다. 비동기 작업이라면 완료될 때까지 엔드포인트의 상태 폴링 예시를 따르세요.

**Bash / zsh**(macOS, Linux 또는 WSL을 사용하는 Windows)용 언어 모델 호출 예시입니다. 자리 표시자 키는 로컬에서 바꾸세요. 다른 환경에서는 아래 저장소의 Python, TypeScript, Go 예제를 사용하세요. 셸 명령은 PowerShell과 호환되지 않습니다.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

코드에서 시작하기: [GitHub의 SandBase SDK 및 예제](https://github.com/sandbaseai/sandbase).

자세히 알아보기: [첫 번째 API 호출](/getting-started/first-call).

## Agent와 함께 사용하기 {#use-in-ai-tool}

Claude Code, Codex, Cursor, Kiro 또는 기타 지원 클라이언트를 사용하며 해당 앱 안에서 SandBase Models와 APIs를 사용하려면 이 방법을 선택하세요.

**자동 로컬 설정을 사용하려면** 클라이언트가 명령을 실행할 수 있어야 하고, 해당 머신에 Node.js 20 이상과 npm이 있어야 합니다. 채팅 전용 클라이언트를 사용한다면 [클라이언트별 연결 안내](/setup/)를 따르세요.

1. Console에서 [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"}를 엽니다.
2. 다음 줄을 AI 어시스턴트 채팅에 붙여 넣은 다음, 만들고 싶은 것을 알려 주세요. 이것은 셸 명령이 아니라 채팅 지시문입니다.

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. 에이전트가 여는 브라우저 로그인을 승인합니다. 붙여 넣을 API 키는 없습니다.
4. SandBase 도구가 로드되도록 새 세션을 시작하거나 앱을 다시 시작합니다.
5. 에이전트에게 관련 도구를 찾아 확인하도록 요청한 다음, 권한과 예산 범위 안에서 제한된 요청을 한 번 보내게 하세요. 개발 중이라면 응답을 프로젝트에 통합하고 실행 명령과 실제 테스트 결과를 제공하도록 하세요. 도구를 찾은 것만으로는 비즈니스 API 호출이 검증되지 않습니다.

터미널을 선호하신다면 `npx -y @sandbaseai/cli@latest connect`를 실행하세요. 감지된 지원 클라이언트를 구성합니다. 하나만 구성하려면 `npx -y @sandbaseai/cli@latest connect --client codex`를 사용하세요(`codex`를 사용 중인 지원 클라이언트로 바꾸세요). 그런 다음 해당 클라이언트를 다시 시작하세요. 유료 실행 전에 선택된 워크스페이스를 확인하세요.

예를 들어 다음과 같이 요청할 수 있습니다.

> AI 에이전트에 관한 공개 X 게시물을 검색하는 SandBase API를 찾아 줘. 먼저 필수 입력과 가격을 확인하고, 실행하기 전에 요청 한 번의 비용을 알려 줘. 결과에는 원본 출처 링크를 유지해 줘.

소스 및 설치 안내: [GitHub의 SandBase CLI 및 MCP](https://github.com/sandbaseai/cli).

자세히 알아보기: [AI 도구 연결하기](/setup/).

### AI 어시스턴트와 함께 빌드하기 {#start-with-your-agent}

[설정 Skill](https://www.sandbase.ai/SKILL.md)은 계정이 아직 없는 경우, 기존 API 키가 있는 경우, 이미 연결된 도구가 있는 경우, 기존 프로젝트가 있는 경우, 새 기능을 만드는 경우 등 현재 상황에 맞게 에이전트를 안내합니다. 엔드포인트의 입력과 가격을 확인하고, 통합 구현을 도우며, 설정 완료와 검증된 호출, 동작하는 기능을 구분합니다. 목표와 지출 한도를 알려 주되, 키를 채팅에 붙여 넣지 마세요.

이미 키나 프로젝트가 있다면 그렇다고 말하세요. 처음부터 다시 시작할 필요는 없습니다. 예: “SandBase 키가 있어. 이 프로젝트에 Similarweb 트래픽 조회를 추가해 줘. 먼저 API를 확인하고 실시간 테스트 비용을 보여 줘.” 명령을 실행하거나 도구를 로드할 수 없는 어시스턴트는 [클라이언트별 설정 방법](/setup/)이 필요합니다.

[에이전트에게 Markdown 빠른 시작을 제공](https://www.sandbase.ai/quickstart.md)하거나 아래 단계를 따르세요. 설정 Skill을 설치해도 호스팅 Agent가 생성되지는 않습니다.

### 선택 사항: SandBase에서 호스팅 Agent 실행하기 {#build-agent}

작업이 여러 단계로 이루어지거나 재사용해야 한다면 이 방법을 선택하세요.

1. [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"}를 열고 **Create**를 선택합니다.
2. **Overview**와 **Instructions**를 입력합니다.
3. **Model**을 선택합니다.
4. **Capabilities**에서 Skills와 MCP 도구를 추가한 다음 **Runtime**을 설정합니다.
5. **Create & Chat**을 선택해 Session에서 테스트합니다.
6. Agent의 **API** 탭을 참고해 앱에서 테스트한 버전을 호출합니다.

자세히 알아보기: [Build Agent](/agents/). 공식 OpenAI SDK를 사용해 코드로 같은 작업을 하려면 [OpenAI 호환성](/agents/openai-compatibility)을 참고하세요.

## Skills, Tools 및 기타 빌드 방법 {#skills-and-tools}

작업에 맞는 리소스를 선택하세요. API를 사용하기 위해 Skill을 설치하거나 호스팅 Agent를 만들 필요는 없습니다.

- **[Tools](https://www.sandbase.ai/tools):** 텍스트 서식 지정이나 공개 데이터 조회 같은 특정 작업을 바로 사용할 수 있는 인터페이스에서 완료합니다.
- **[Skills](https://www.sandbase.ai/skills):** 지침, 스크립트, 예제가 포함된 재사용 가능한 워크플로를 에이전트에게 제공합니다.
- **Models 및 APIs:** Playground, 코드 또는 연결된 에이전트에서 기능을 호출합니다. [언어 모델](https://www.sandbase.ai/models), [이미지 및 동영상](https://www.sandbase.ai/models/image-video), [데이터 API](https://www.sandbase.ai/apis)를 둘러보세요.
- **[호스팅 Agents](/agents/):** SandBase에서 재사용 가능한 에이전트를 구성하고 실행합니다.
- **[Sandboxes](/sandbox/):** 코드를 실행하고 파일을 다룰 수 있는 격리된 환경을 제공합니다.

### Tool 사용하기 {#use-tools}

1. [Tools](https://www.sandbase.ai/tools)를 열고 완료하려는 작업을 선택합니다.
2. 도구의 입력 요구 사항과 가격 또는 할당량 표시를 확인합니다. 무료 유틸리티는 계정 없이 동작할 수 있지만, 데이터 도구를 실행하려면 SandBase 로그인이 필요하며 모델 테스트에는 자체 키가 필요할 수 있습니다.
3. 요청된 텍스트, URL, 파일 또는 기타 입력을 입력한 다음 도구의 실행 버튼을 사용합니다.
4. 출력을 검토하고, 제공되는 경우 복사 또는 다운로드 기능을 사용합니다. 데이터 도구에서 같은 작업을 자동화하려면 연결된 API와 요청 예시를 사용하세요.

**무료 일일 할당량은 워크스페이스 전체가 공유**하며, 도구마다 별도로 주어지지 않습니다. 실행하기 전에 대상 여부와 표시된 가격을 확인하세요. 무료 유틸리티라고 해서 모델이나 API 호출이 무료가 되는 것은 아닙니다.

### Skill 사용하기 {#use-skills}

1. [Skills](https://www.sandbase.ai/skills)를 열고 워크플로를 선택한 다음, 예시, 필수 입력, 종속성을 확인합니다.
2. 해당 Skill 상세 페이지에서 제공되는 옵션 중 하나를 선택합니다.
   - **온라인 실행:** 제공되는 경우 로그인한 뒤 호스팅 예시를 실행합니다. 진행 상황을 확인하고 결과 출력이나 파일을 엽니다. 표시된 허용량을 확인하세요. 제공 여부와 한도는 Skill마다 다릅니다.
   - **설치 / 다운로드:** 제공되는 경우 로그인한 뒤 패키지를 다운로드합니다. 전체 패키지를 작업 폴더에 압축 해제한 다음 설치 안내를 따르거나, 로컬 에이전트에게 `SKILL.md`를 읽도록 요청하세요.
3. 로컬에서 사용할 때는 작업, 입력, 원하는 출력, 지출 한도를 제공하세요. [Agent 방법](#use-in-ai-tool)으로 SandBase를 연결하세요. Skill의 스크립트에 키가 필요하면 채팅에 붙여 넣지 말고 실행 환경에서 구성하세요.
4. 실제 결과를 검토합니다. Skill을 다운로드하거나 에이전트를 연결했다고 해서 워크플로가 성공적으로 실행된 것은 아닙니다.

SandBase **설정 Skill**은 클라이언트를 연결하고, 카탈로그 Skill은 개별 워크플로를 설명합니다. 설치하기 전에 각 Skill의 종속성과 지원 클라이언트를 확인하세요. 로컬 워크플로에서 사용하는 모델 및 API 호출에는 사용 요금이 발생할 수 있습니다.

입력 폴더와 저장된 결과물을 포함한 전체 과정은 [로컬에서 Skill 사용하기](/guides/skills/local-use)를 참고하세요.

## 선택 사항: 팀 워크스페이스 공유하기 {#create-organization}

API 키, 사용량, 청구는 조직에 속합니다. 혼자 평가 중이라면 개인 워크스페이스를 계속 사용하세요. 여러 사람이 키와 지출을 공유해야 한다면 팀을 만드세요.

| 워크스페이스 | 사용 시점 |
|---|---|
| **개인** | 처음 로그인할 때 자동으로 생성됩니다. 사용자당 하나입니다. |
| **팀** | 멤버, 키, 잔액을 공유합니다. 회사나 프로젝트용으로 만드세요. |

### 팀 만들기 {#create-team}

1. [팀 만들기](https://www.sandbase.ai/console/members?create=1){target="_blank"}를 열거나, Console 오른쪽 상단의 계정 메뉴에서 **Create Team**을 선택합니다.
2. **Team name**을 입력한 다음 **Create team**을 선택합니다.
3. 계정 메뉴에 해당 팀이 활성 워크스페이스로 표시되는지 확인합니다.
4. **Developer → Team**에서 **Add member**를 선택하고, 기존 SandBase 계정의 **Account email**을 입력한 다음 **Workspace role**(Member 또는 Admin)을 선택합니다.

초대받는 사람은 이미 SandBase 계정이 있어야 합니다. 계정이 없다면 먼저 로그인할 수 있도록 [이 페이지](/getting-started/quickstart)를 보낸 다음 추가하세요.

여러 조직에 속해 있다면 계정 메뉴에서 전환하세요. 키와 청구는 **활성** 조직을 따릅니다. 역할은 [조직](/admin/organizations)을 참고하세요.

## 동작 확인하기 {#confirm-it-works}

다음 조건이 모두 충족되면 준비가 완료된 것입니다.

- Console 계정 메뉴에 사용하려는 조직이 표시됩니다.
- API 호출, 웹사이트에서 실행, AI 도구 연결, Agent 중 한 가지 방법을 완료했습니다.
- 요청 하나가 성공합니다.

요청이 실패하면 활성 조직, 키, [오류](/guides/error-handling)를 확인하세요. 워크스페이스에 잔액이 남아 있지 않으면 [Billing](https://www.sandbase.ai/console/billing){target="_blank"}에서 충전하세요.

### 문제가 생겼다면 {#if-you-get-stuck}

| 표시되는 내용 | 확인할 사항 |
| --- | --- |
| 로그인 필요 | 로그인한 뒤 원래 페이지로 돌아가 활성 워크스페이스를 확인하세요. |
| 잘못된 키 또는 접근 거부 | 키가 의도한 워크스페이스에 속하고 해당 엔드포인트에 접근 권한이 있는지 확인하세요. 크레딧을 추가해도 권한 문제는 해결되지 않습니다. |
| 잔액 부족 또는 할당량 소진 | 응답을 확인하세요. 잔액 문제라면 Billing을, 할당량 한도라면 표시된 초기화 시간을 확인하세요. |
| Agent에 도구가 없음 | 새 클라이언트 세션을 시작한 다음 [AI 도구 연결하기](/setup/)의 진단 안내를 따르세요. |
| 작업이 아직 실행 중 | 반환된 작업 상태나 페이지의 진행률 표시를 확인하세요. 같은 유료 요청을 반복해서 제출하지 마세요. |

## 청구 및 사용량 {#billing-and-usage}

로그인한 후 활성 조직의 지출을 확인하세요.

<QuickstartResources group="ops" />

## 다음 단계 {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — 브라우저에서 작업 완료하기
- [Skills](https://www.sandbase.ai/skills) — 재사용 가능한 에이전트 워크플로 찾기
- [API 키](/getting-started/api-keys) — 조직 키 생성 및 교체
- [Models 및 APIs 카탈로그](https://www.sandbase.ai/models) — 웹사이트에서 Models, APIs, Agents 사용해 보기
- [AI 도구 연결하기](/setup/) — AI 도구에 SandBase 카탈로그 제공하기
- [Build Agent](/agents/) — 재사용 가능한 Agent 만들기
- [API Reference](/api-reference/) — 코드로 통합하기
