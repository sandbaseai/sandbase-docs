---
i18nSource: e4dcecbecc736e53
title: GitHub 儲存庫工作區
description: 將 GitHub 儲存庫複製到 Session 的 /workspace，推送到 Session 分支並開啟 pull request。
---

# GitHub 儲存庫工作區 {#github-repository-workspace}

Session 可以在啟動時就將 GitHub 儲存庫複製到 `/workspace`。Agent 以一般的 `git` 指令處理程式碼，將 commit 推送到保留給該 Session 的分支，並可開啟 pull request 供人員審查。

儲存庫透過 SandBase 的 git 代理存取。GitHub 權杖不會進入 Session。

## 開始之前 {#before-you-start}

組織管理員需在 Console 中完成一次設定：

1. 在 **Console → Integrations** 中連接 GitHub，並選擇此連線可使用的儲存庫。
2. 在 Agent 的 **Integrations** 區段中將連線指派給 Agent。Agent 針對此連線的工具必須包含 **Read code** 才能複製。若要推送，還必須包含 **Commit to a task branch**。
3. 選用：在該指派中選擇 **Workspace repository** 與分支。之後的 Session 會預設複製它。

`repository_id` 是 GitHub 的數字儲存庫 ID。您可以從 `GET https://api.github.com/repos/{owner}/{repo}`（`id` 欄位）或 `github_list_repositories` 工具取得。

## 為每個 Session 選擇儲存庫 {#choose-the-repository-per-session}

建立 Session 時傳送 `github_workspace`：

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

| 欄位 | 必填 | 說明 |
|---|---|---|
| `repository_id` | 是 | 十進位字串。儲存庫必須在 Agent 針對該連線的儲存庫範圍內。 |
| `ref` | 否 | 要簽出的分支。預設為儲存庫的預設分支。 |
| `connection_id` | 否 | 要使用的 GitHub 連線。預設為設有工作區儲存庫的指派，或 Agent 唯一的 GitHub 連線。 |

`github_workspace` 為選用：

- 省略或為 `null`：若 Agent 設有工作區儲存庫，Session 會複製它。否則不會複製任何內容，Session 照常啟動。
- 有傳送：僅在此 Session 中取代 Agent 的預設值。

每個 Session 最多只有一個工作區儲存庫。此選擇在建立 Session 時即固定。

## Session 會取得的內容 {#what-the-session-gets}

- `/workspace` 中 `ref` 的簽出內容，`origin` 指向 git 代理。`git fetch`、`git pull` 與 `git push` 照常運作。
- 以 `sandbase-agents[bot]` 為作者的 commit。
- `SANDBASE_GIT_BRANCH_PREFIX`，例如 `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`。
- `SANDBASE_WORKSPACE_REPOSITORY`，即儲存庫的 `owner/name`。

## 推送規則 {#push-rules}

Agent 只能推送到自己前綴下的分支：

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- 可以再次推送到同一個分支，包括已有開啟中 pull request 的分支。
- 推送到預設分支、其他分支、其他 Session 的前綴或標籤，會在送達 GitHub 前被拒絕。Git 會顯示 `sandbase: only agents/<session>/* branches can be pushed`。
- 代理無法變更 GitHub Actions 工作流程檔案。

只有 Session 推送過的分支才會被視為該 Session 的分支。`github_open_pull_request` 工具接受這類分支，合併範圍限於受管分支的連線也同樣接受。

## 權限依連線而定 {#permissions-follow-the-connection}

每個 git 請求都會依 Agent 目前的指派與連線目前的政策進行檢查。

- 若管理員縮小儲存庫範圍，下一次 fetch 或 push 會被拒絕。
- 若管理員移除 **Commit to a task branch**，下一次 push 會被拒絕。
- 若管理員撤銷連線，下一次 fetch 或 push 會被拒絕。

每個 Session 每分鐘最多可發出 120 個 git 請求。

## 錯誤 {#errors}

| 回應 | 原因 |
|---|---|
| `400 invalid_request`（`param: github_workspace`） | `repository_id` 不是十進位字串、`ref` 不是單純的分支名稱、Agent 沒有 GitHub 連線，或不支援儲存庫的預設分支名稱（請明確設定 `ref`）。 |
| `400 invalid_request` | Agent 有多個 GitHub 連線，但都沒有設定工作區儲存庫。請傳送 `connection_id`。 |
| `403 insufficient_scope` | 儲存庫或連線不在 Agent 的範圍內，或 Agent 的工具未包含 **Read code**。 |

## 後續步驟 {#next-steps}

- [執行 Session](/agents/sessions)
- [Create Session API 參考](/api-reference/sessions/create)
