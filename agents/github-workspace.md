---
title: GitHub repository workspace
description: Clone a GitHub repository into a Session's /workspace, push to Session branches, and open pull requests.
---

# GitHub repository workspace

A Session can start with a GitHub repository already cloned into `/workspace`. The Agent works on the code with ordinary `git` commands, pushes its commits to branches reserved for the Session, and can open a pull request for a person to review.

The repository is reached through SandBase's git proxy. No GitHub token enters the Session.

## Before you start

An organization administrator sets this up once in the console:

1. Connect GitHub under **Console → Integrations** and choose the repositories the connection may use.
2. Assign the connection to the Agent in the Agent's **Integrations** section. The Agent's tools for this connection must include **Read code** to clone. To push, they must also include **Commit to a task branch**.
3. Optional: choose a **Workspace repository** and branch on that assignment. Sessions then clone it by default.

The `repository_id` is GitHub's numeric repository ID. You can read it from `GET https://api.github.com/repos/{owner}/{repo}` (the `id` field) or from the `github_list_repositories` tool.

## Choose the repository per Session

Send `github_workspace` when you create the Session:

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

| Field | Required | Meaning |
|---|---|---|
| `repository_id` | Yes | Decimal string. The repository must be within the Agent's repository scope for that connection. |
| `ref` | No | Branch to check out. Defaults to the repository's default branch. |
| `connection_id` | No | Which GitHub connection to use. Defaults to the assignment that has a workspace repository, or to the Agent's only GitHub connection. |

`github_workspace` is optional:

- Omitted or `null`: the Session clones the Agent's workspace repository, if one is set. Otherwise nothing is cloned and the Session starts as usual.
- Sent: it replaces the Agent's default for this Session only.

Each Session has at most one workspace repository. The choice is fixed when the Session is created.

## What the Session gets

- A checkout of `ref` in `/workspace`, with `origin` pointing at the git proxy. `git fetch`, `git pull` and `git push` work as usual.
- Commits authored as `sandbase-agents[bot]`.
- `SANDBASE_GIT_BRANCH_PREFIX`, for example `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, the repository's `owner/name`.

## Push rules

The Agent can push only to branches under its own prefix:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- It can push to the same branch again, including a branch that already has an open pull request.
- Pushes to the default branch, other branches, other Sessions' prefixes, and tags are rejected before they reach GitHub. Git shows `sandbase: only agents/<session>/* branches can be pushed`.
- The proxy cannot change GitHub Actions workflow files.

Only a branch the Session pushed is treated as the Session's branch. The `github_open_pull_request` tool accepts it, and so does a connection whose merge scope is limited to managed branches.

## Permissions follow the connection

Every git request is checked against the Agent's current assignment and the connection's current policy.

- If an administrator narrows the repository scope, the next fetch or push is refused.
- If an administrator removes **Commit to a task branch**, the next push is refused.
- If an administrator revokes the connection, the next fetch or push is refused.

Each Session can make up to 120 git requests per minute.

## Errors

| Response | Cause |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` is not a decimal string, `ref` is not a plain branch name, the Agent has no GitHub connection, or the repository's default branch name is not supported (set `ref` explicitly). |
| `400 invalid_request` | The Agent has several GitHub connections and none of them has a workspace repository. Send `connection_id`. |
| `403 insufficient_scope` | The repository or connection is outside the Agent's scope, or the Agent's tools do not include **Read code**. |

## Next steps

- [Run Sessions](/agents/sessions)
- [Create Session API reference](/api-reference/sessions/create)
