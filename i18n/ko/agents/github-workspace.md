---
i18nSource: e4dcecbecc736e53
title: GitHub 저장소 워크스페이스
description: GitHub 저장소를 Session의 /workspace에 클론하고, Session 브랜치에 푸시하고, 풀 리퀘스트를 엽니다.
---

# GitHub 저장소 워크스페이스 {#github-repository-workspace}

Session은 GitHub 저장소가 `/workspace`에 이미 클론된 상태로 시작할 수 있습니다. Agent는 일반적인 `git` 명령으로 코드를 작업하고, Session 전용 브랜치에 커밋을 푸시하며, 사람이 검토할 수 있도록 풀 리퀘스트를 열 수 있습니다.

저장소에는 SandBase의 git 프록시를 통해 접근합니다. GitHub 토큰은 Session에 들어가지 않습니다.

## 시작하기 전에 {#before-you-start}

조직 관리자가 Console에서 한 번만 설정하면 됩니다.

1. **Console → Integrations**에서 GitHub를 연결하고, 연결이 사용할 수 있는 저장소를 선택합니다.
2. Agent의 **Integrations** 섹션에서 연결을 Agent에 할당합니다. 클론하려면 이 연결에 대한 Agent 도구에 **Read code**가 포함되어야 합니다. 푸시하려면 **Commit to a task branch**도 포함되어야 합니다.
3. 선택 사항: 해당 할당에서 **Workspace repository**와 브랜치를 선택합니다. 그러면 Session이 기본적으로 이 저장소를 클론합니다.

`repository_id`는 GitHub의 숫자형 저장소 ID입니다. `GET https://api.github.com/repos/{owner}/{repo}`(`id` 필드) 또는 `github_list_repositories` 도구에서 확인할 수 있습니다.

## Session별 저장소 선택 {#choose-the-repository-per-session}

Session을 생성할 때 `github_workspace`를 보냅니다.

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: fix-login-2026-11-18" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    "github_workspace": {"repository_id": "1195090324", "ref": "main"},
    "input": "Fix the failing login test, push your change and open a pull request."
  }'
```

| 필드 | 필수 | 의미 |
|---|---|---|
| `repository_id` | 예 | 10진수 문자열입니다. 저장소는 해당 연결에 대한 Agent의 저장소 범위 안에 있어야 합니다. |
| `ref` | 아니요 | 체크아웃할 브랜치입니다. 기본값은 저장소의 기본 브랜치입니다. |
| `connection_id` | 아니요 | 사용할 GitHub 연결입니다. 기본값은 워크스페이스 저장소가 설정된 할당이거나, Agent의 유일한 GitHub 연결입니다. |

`github_workspace`는 선택 사항입니다.

- 생략하거나 `null`인 경우: Agent에 워크스페이스 저장소가 설정되어 있으면 Session이 이를 클론합니다. 설정되어 있지 않으면 아무것도 클론하지 않고 평소처럼 Session이 시작됩니다.
- 보낸 경우: 이 Session에 한해 Agent의 기본값을 대체합니다.

각 Session에는 워크스페이스 저장소가 최대 하나만 있습니다. 선택은 Session 생성 시점에 고정됩니다.

## Session에 제공되는 항목 {#what-the-session-gets}

- `/workspace`에 `ref`가 체크아웃되며, `origin`은 git 프록시를 가리킵니다. `git fetch`, `git pull`, `git push`는 평소처럼 동작합니다.
- 커밋 작성자는 `sandbase-agents[bot]`입니다.
- `SANDBASE_GIT_BRANCH_PREFIX`, 예: `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, 저장소의 `owner/name`.

## 푸시 규칙 {#push-rules}

Agent는 자신의 접두사 아래에 있는 브랜치에만 푸시할 수 있습니다.

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- 이미 열린 풀 리퀘스트가 있는 브랜치를 포함해 같은 브랜치에 다시 푸시할 수 있습니다.
- 기본 브랜치, 다른 브랜치, 다른 Session의 접두사, 태그로의 푸시는 GitHub에 도달하기 전에 거부됩니다. Git에는 `sandbase: only agents/<session>/* branches can be pushed`가 표시됩니다.
- 프록시는 GitHub Actions 워크플로 파일을 변경할 수 없습니다.

Session이 푸시한 브랜치만 Session의 브랜치로 취급됩니다. `github_open_pull_request` 도구는 이 브랜치를 허용하며, 병합 범위가 관리형 브랜치로 제한된 연결도 마찬가지입니다.

## 권한은 연결을 따릅니다 {#permissions-follow-the-connection}

모든 git 요청은 Agent의 현재 할당과 연결의 현재 정책을 기준으로 확인됩니다.

- 관리자가 저장소 범위를 좁히면 다음 fetch 또는 push가 거부됩니다.
- 관리자가 **Commit to a task branch**를 제거하면 다음 push가 거부됩니다.
- 관리자가 연결을 해제하면 다음 fetch 또는 push가 거부됩니다.

각 Session은 분당 최대 120개의 git 요청을 보낼 수 있습니다.

## 오류 {#errors}

| 응답 | 원인 |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id`가 10진수 문자열이 아니거나, `ref`가 일반 브랜치 이름이 아니거나, Agent에 GitHub 연결이 없거나, 저장소의 기본 브랜치 이름이 지원되지 않습니다(`ref`를 명시적으로 설정하세요). |
| `400 invalid_request` | Agent에 GitHub 연결이 여러 개 있지만 어느 것에도 워크스페이스 저장소가 설정되어 있지 않습니다. `connection_id`를 보내세요. |
| `403 insufficient_scope` | 저장소나 연결이 Agent의 범위를 벗어나거나, Agent의 도구에 **Read code**가 포함되어 있지 않습니다. |

## 다음 단계 {#next-steps}

- [Session 실행](/agents/sessions)
- [Session 생성 API 레퍼런스](/api-reference/sessions/create)
