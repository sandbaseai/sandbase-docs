---
i18nSource: e4dcecbecc736e53
title: GitHub 仓库工作区
description: 将 GitHub 仓库克隆到 Session 的 /workspace，推送到 Session 分支并创建 pull request。
---

# GitHub 仓库工作区 {#github-repository-workspace}

Session 启动时可以预先将 GitHub 仓库克隆到 `/workspace` 中。Agent 使用常规 `git` 命令处理代码，将提交推送到为该 Session 保留的分支，并可创建 pull request 供人工审核。

仓库通过 SandBase 的 git 代理访问。Session 中不会出现任何 GitHub token。

## 开始之前 {#before-you-start}

组织管理员需在控制台中完成一次性设置：

1. 在 **Console → Integrations** 下连接 GitHub，并选择该连接可使用的仓库。
2. 在 Agent 的 **Integrations** 部分将该连接分配给 Agent。该连接下 Agent 的工具必须包含 **Read code** 才能克隆；如需推送，还必须包含 **Commit to a task branch**。
3. 可选：在该分配上选择 **Workspace repository** 和分支。之后 Session 默认克隆该仓库。

`repository_id` 是 GitHub 的数字仓库 ID。可以通过 `GET https://api.github.com/repos/{owner}/{repo}`（`id` 字段）或 `github_list_repositories` 工具获取。

## 为每个 Session 选择仓库 {#choose-the-repository-per-session}

创建 Session 时发送 `github_workspace`：

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

| 字段 | 必填 | 含义 |
|---|---|---|
| `repository_id` | 是 | 十进制字符串。仓库必须在该连接下 Agent 的仓库范围内。 |
| `ref` | 否 | 要检出的分支。默认为仓库的默认分支。 |
| `connection_id` | 否 | 要使用的 GitHub 连接。默认为设置了工作区仓库的分配，或 Agent 唯一的 GitHub 连接。 |

`github_workspace` 为可选项：

- 省略或为 `null`：如果 Agent 设置了工作区仓库，Session 会克隆该仓库；否则不克隆任何内容，Session 照常启动。
- 已发送：仅对本 Session 替换 Agent 的默认设置。

每个 Session 最多只有一个工作区仓库。该选择在创建 Session 时确定，之后不可更改。

## Session 获得的内容 {#what-the-session-gets}

- `/workspace` 中 `ref` 的检出副本，其 `origin` 指向 git 代理。`git fetch`、`git pull` 和 `git push` 均可照常使用。
- 提交作者为 `sandbase-agents[bot]`。
- `SANDBASE_GIT_BRANCH_PREFIX`，例如 `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`。
- `SANDBASE_WORKSPACE_REPOSITORY`，即仓库的 `owner/name`。

## 推送规则 {#push-rules}

Agent 只能推送到自身前缀下的分支：

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- 可以再次推送到同一分支，包括已有打开的 pull request 的分支。
- 推送到默认分支、其他分支、其他 Session 的前缀以及标签的请求，会在到达 GitHub 之前被拒绝。Git 会显示 `sandbase: only agents/<session>/* branches can be pushed`。
- 代理无法修改 GitHub Actions 工作流文件。

只有该 Session 推送过的分支才会被视为该 Session 的分支。`github_open_pull_request` 工具接受这类分支，合并范围仅限托管分支的连接也同样接受。

## 权限随连接而定 {#permissions-follow-the-connection}

每个 git 请求都会根据 Agent 当前的分配和连接当前的策略进行检查。

- 如果管理员缩小了仓库范围，下一次 fetch 或 push 将被拒绝。
- 如果管理员移除了 **Commit to a task branch**，下一次 push 将被拒绝。
- 如果管理员吊销了该连接，下一次 fetch 或 push 将被拒绝。

每个 Session 每分钟最多可发起 120 个 git 请求。

## 错误 {#errors}

| 响应 | 原因 |
|---|---|
| `400 invalid_request`（`param: github_workspace`） | `repository_id` 不是十进制字符串、`ref` 不是普通分支名、Agent 没有 GitHub 连接，或仓库的默认分支名不受支持（请显式设置 `ref`）。 |
| `400 invalid_request` | Agent 有多个 GitHub 连接，但都没有设置工作区仓库。请发送 `connection_id`。 |
| `403 insufficient_scope` | 仓库或连接超出 Agent 的范围，或 Agent 的工具不包含 **Read code**。 |

## 后续步骤 {#next-steps}

- [运行 Session](/agents/sessions)
- [创建 Session API 参考](/api-reference/sessions/create)
