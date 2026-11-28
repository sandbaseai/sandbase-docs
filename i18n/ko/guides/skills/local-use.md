---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: 로컬에서 Skill 사용하기
description: SandBase Lab Skill을 선택해 패키지를 다운로드하고, 모델 접근을 설정한 뒤, 로컬 에이전트로 프로젝트를 만들고 저장합니다.
---

# 로컬에서 Skill 사용하기 {#use-a-skill-locally}

SandBase Skill을 다운로드하고 컴퓨터의 에이전트로 프로젝트를 완성합니다. Skill에는 지침, 스크립트, 예제가 들어 있습니다. 에이전트는 `SKILL.md`에 설명된 워크플로를 따릅니다.


## 1. Skill 선택 {#_1-choose-a-skill}

1. [SandBase Lab](https://www.sandbase.ai/lab/)을 엽니다.
2. 비디오, 애니메이션, 지도 같은 예제를 둘러보고 프로젝트에 맞는 Skill을 엽니다.
3. 예제, 필수 입력, 출력 형식, 지원 언어를 확인합니다.
4. Skill 다운로드 기능으로 ZIP 패키지를 저장합니다.

도시 역사 지도 영상을 만든다면 [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time)의 예제와 지침부터 시작하세요.

## 2. 로컬 작업 폴더 준비 {#_2-prepare-a-local-working-folder}

1. `my-city-film` 같은 프로젝트 폴더를 만듭니다.
2. Skill ZIP 전체를 이 폴더에 압축 해제하고 지침, 스크립트, 에셋을 그대로 유지합니다.
3. 로컬 에이전트에서 프로젝트를 열고, 파일과 워크플로에 필요한 명령에 대한 접근 권한을 부여합니다.
4. Skill 페이지의 설치 안내를 따르거나, 압축 해제한 `SKILL.md`를 직접 읽도록 에이전트에게 요청합니다.

프로젝트는 다음과 같은 구조를 사용할 수 있습니다:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Skill이 요구하는 파일 이름과 출력 위치를 그대로 사용하세요.

## 3. SandBase 연결 {#_3-connect-sandbase}

에이전트에 `set up https://www.sandbase.ai/SKILL.md`를 붙여 넣고 열리는 브라우저 로그인을 승인하거나, 터미널에서 `npx -y @sandbaseai/cli@latest connect`를 실행하세요. 그런 다음 SandBase 도구가 로드되도록 새 에이전트 세션을 시작하세요. Console의 [Build → AI tools](https://www.sandbase.ai/console/setup)에서도 같은 옵션을 사용할 수 있습니다.

전체 연결 절차는 [AI 도구 연결](/setup/)을 참고하세요.

Skill의 스크립트에 `SANDBASE_API_KEY`가 필요한 경우:

1. [API Keys](https://www.sandbase.ai/console/keys)를 열고 프로젝트에 사용할 키를 생성하거나 선택합니다.
2. 로컬 에이전트의 보안 설정이나 스크립트 실행 환경에서 키를 설정합니다.
3. 접근 설정이 완료되었는지 확인하고 Skill 워크플로를 계속하도록 에이전트에게 요청합니다.

키는 안전한 로컬 설정에 보관하세요. 결과물, 소스 파일, 공개 스크린샷에는 프로젝트 정보만 포함하세요. 모델 사용량과 잔액은 [Billing](https://www.sandbase.ai/console/billing)에서 확인할 수 있습니다.

## 4. 작업 요청 작성 {#_4-provide-a-brief}

사용할 Skill, 만들 결과물, 출력 요구 사항, 예산을 에이전트에게 알려 주세요. 다음 예시를 프로젝트에 맞게 수정하세요:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

에이전트는 지침을 읽고, 의존성을 확인하고, 입력을 처리한 뒤 프로젝트를 생성하거나 렌더링합니다. 요청받은 에셋은 같은 프로젝트에 추가하고 작업을 계속하세요.

## 5. 진행 상황 확인과 결과 검토 {#_5-follow-progress-and-review-the-result}

소요 시간은 Skill, 모델, 에셋, 출력 길이에 따라 다릅니다. 비디오 프로젝트는 수십 분에서 몇 시간까지 걸릴 수 있습니다. 에이전트를 계속 실행하고 컴퓨터가 절전 모드로 전환되지 않도록 하세요.

같은 대화에서 진행 상황을 물어보세요:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

전달된 파일 경로를 열어 영상, 오디오, 자막, 콘텐츠를 검토하고 최종 파일을 저장하세요.

## 6. 프로젝트 수정 {#_6-revise-the-project}

원래 작업에서 구체적인 변경을 요청하고 기존 에셋을 재사용하세요:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

실행이 중단되면 작업 폴더를 그대로 두고 현재 단계부터 계속하도록 에이전트에게 요청하세요.

## 다음 단계 {#next-steps}

- [AI City Remix 참가하기](/guides/skills/ai-city-remix)
- [에이전트 연결](/setup/)
- [API 키 설정](/getting-started/api-keys)
