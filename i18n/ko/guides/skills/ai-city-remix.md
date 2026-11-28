---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: AI City Remix 참가하기
description: AI City Remix 크레딧을 받고, 도시와 Skill을 선택하고, 로컬 에이전트로 영상을 만든 뒤 심사를 위해 업로드합니다.
---

# AI City Remix 참가하기 {#enter-ai-city-remix}

이벤트 페이지에서 Skill과 도시를 선택한 뒤, 전체 지시를 로컬 에이전트에 넘깁니다. 제작이 끝나면 에이전트가 영상, 커버, 출품 정보를 업로드하고 심사를 위해 제출합니다.


## 사전 요구 사항 {#prerequisites}

- SandBase 계정
- 명령 실행과 파일 접근이 가능한 로컬 에이전트
- 영상, 커버, 프로젝트 파일을 둘 작업 폴더

로컬 환경을 처음 설정한다면 [로컬에서 Skill 사용하기](/guides/skills/local-use)를 따르세요.

## 1. 이벤트를 열고 크레딧 받기 {#_1-open-the-event-and-claim-credits}

1. [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en)를 열고 최신 [이벤트 규칙](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en)을 읽습니다.
2. "Claim $5 free & create"를 클릭하고, 안내가 나오면 로그인합니다.
3. 시스템이 이벤트 크레딧을 받고 자동으로 사용 처리를 시도합니다. 잔액과 사용 처리 상태를 확인하고, 다시 시도해야 하면 사용 처리 버튼을 누르세요.
4. 크레딧을 받은 뒤 "Create now"를 클릭해 제작 대화 상자를 엽니다.

크레딧 수령 기간, 가용 여부, 자격 조건은 이벤트 페이지에 표시됩니다. 모델 호출은 실제 사용량에 따라 크레딧을 사용하며, [Billing](https://www.sandbase.ai/console/billing)에서 확인할 수 있습니다.

## 2. 모델 API 키 구성 {#_2-configure-a-model-api-key}

계정에 사용할 수 있는 API 키가 없으면 "Create an API key" 대화 상자가 표시됩니다.

1. 표시된 지출 상한과 만료일을 확인한 뒤 "Create API key"를 클릭합니다.
2. "Create with this key"를 클릭합니다. 새 키는 에이전트에 넘기는 전체 지시에 포함됩니다.
3. 전체 지시는 신뢰할 수 있는 에이전트에 보내고 비공개 작업 공간에 보관하세요.

기존 키를 사용하려면 로컬 에이전트의 보안 설정이나 실행 환경에서 `SANDBASE_API_KEY`를 구성하세요. 키는 [API Keys](https://www.sandbase.ai/console/keys)에서 관리합니다.

## 3. Skill과 브리프 선택 {#_3-choose-a-skill-and-brief}

대화 상자에는 공식 Skill, 도시, 스토리, 크리에이티브 방향이 미리 선택되어 있습니다.

- "Official Skill"을 펼쳐 요약과 세부 정보를 읽고 시각적 접근 방식을 선택합니다.
- "Creative brief"를 펼쳐 도시를 검색하거나 지도에서 위치를 선택합니다.
- 제안을 섞어 보거나 스토리와 크리에이티브 방향을 직접 편집합니다.
- 지도 위치, 지원 언어, 출력 스타일을 확인합니다.

역사, 인물, 사건에는 검증 가능한 출처를 사용하세요. 언어와 길이 지원 여부는 선택한 Skill의 세부 정보에서 확인하세요.

## 4. 지시를 복사하고 제작 시작 {#_4-copy-the-instructions-and-create}

1. 프롬프트 영역에서 "Copy all"을 클릭합니다.
2. 로컬 에이전트에서 프로젝트 폴더를 열고 작업을 시작한 뒤 전체 지시를 붙여 넣습니다.
3. 지시를 보내고, 요청되는 입력을 제공하고, 의존성을 구성한 뒤 제작을 시작합니다.

지시에는 선택한 Skill, 크리에이티브 브리프, 출품 메타데이터 형식, 업로드 권한이 포함되어 있습니다. 에이전트가 작품을 만들고 제출할 수 있도록 전달 내용을 빠짐없이 유지하세요.

"Preparing"은 업로드 권한을 준비 중이라는 뜻입니다. 다시 준비하려면 "Retry"를, 누락된 세부 정보를 채우려면 "Complete brief"를 사용하세요.

## 5. 제작 진행 상황 확인 {#_5-follow-creation-progress}

제작은 Skill, 모델, 영상 길이에 따라 수십 분에서 몇 시간이 걸릴 수 있으며 모델 크레딧을 사용합니다. 에이전트를 계속 실행해 두고 컴퓨터가 절전 모드로 들어가지 않게 하세요.

같은 작업에 예산과 진행 상황에 관한 지시를 추가합니다.

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

최신 이벤트 규칙에 따라 SandBase를 통해 MiniMax M3.1 Flash를 사용하세요. 길이, 해상도, 자막, 파일 크기는 이벤트 및 업로드 페이지의 요구 사항을 따르세요.

## 6. 제출하고 심사 상태 확인 {#_6-submit-and-check-review-status}

에이전트는 전체 지시에 따라 공식 업로드 클라이언트로 영상, 커버, 메타데이터를 업로드하고 심사를 위해 제출합니다.

[My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en)에서 진행 상황을 확인하세요.

| 상태 | 다음 단계 |
|---|---|
| Draft | 영상을 완성하고 파일을 업로드한 뒤 심사를 위해 제출합니다. |
| Pending review | 심사 상태를 확인합니다. |
| Approved | 공개 출품 페이지를 열고 공유합니다. |
| Changes requested | 심사 메모에 따라 수정한 뒤 다시 제출합니다. |

이미 만든 영상이 있다면 이벤트 페이지에서 "Upload existing video"를 선택하고, 세부 정보를 입력하고, 영상과 커버를 업로드한 뒤 심사를 위해 제출하세요.

## 7. 업로드 재개 {#_7-resume-an-upload}

권한이 만료되었거나 업로드가 중단되면 원래 파일로 이어서 진행합니다.

1. 영상, 커버, `entry.json`, 작업 폴더를 그대로 둡니다.
2. My entries에서 같은 초안을 찾아 "Resume upload"를 클릭합니다.
3. 새로 생성된 재개 지시를 원래 에이전트 작업에 복사합니다.
4. 에이전트에게 기존 파일을 업로드하고 제출하도록 요청한 뒤 My entries에서 상태를 확인합니다.

## 8. 출품작 공유 {#_8-share-your-entry}

승인된 출품 페이지에서 "Share on X"를 클릭하면 내용이 미리 채워진 작성 창이 열립니다. 출품 링크, `#AICityRemix`, `@SandbaseAI`, 공식 이벤트 게시물이 포함됩니다.

영상 게시물을 올리려면 먼저 "Download video"를 클릭하고, X 작성 창에 파일을 추가하고, 텍스트를 검토한 뒤 게시하세요.

## 관련 문서 {#related-documentation}

- [로컬에서 Skill 사용하기](/guides/skills/local-use)
- [에이전트 연결](/setup/)
- [API 키 구성](/getting-started/api-keys)
