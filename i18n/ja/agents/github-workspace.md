---
i18nSource: e4dcecbecc736e53
title: GitHub リポジトリのワークスペース
description: GitHub リポジトリを Session の /workspace にクローンし、Session ブランチにプッシュして、プルリクエストを作成します。
---

# GitHub リポジトリのワークスペース {#github-repository-workspace}

Session は、GitHub リポジトリが `/workspace` にクローンされた状態で開始できます。Agent は通常の `git` コマンドでコードを操作し、Session 用に予約されたブランチにコミットをプッシュして、レビュー用のプルリクエストを作成できます。

リポジトリには SandBase の git プロキシ経由でアクセスします。GitHub トークンが Session に入ることはありません。

## 始める前に {#before-you-start}

組織の管理者が Console で一度だけ次の設定を行います。

1. **Console → Integrations** で GitHub を接続し、その接続で使用できるリポジトリを選択します。
2. Agent の **Integrations** セクションで、接続を Agent に割り当てます。クローンするには、この接続に対する Agent のツールに **Read code** が含まれている必要があります。プッシュするには、**Commit to a task branch** も含まれている必要があります。
3. 任意: その割り当てで **Workspace repository** とブランチを選択します。以降、Session はデフォルトでそのリポジトリをクローンします。

`repository_id` は GitHub の数値のリポジトリ ID です。`GET https://api.github.com/repos/{owner}/{repo}`（`id` フィールド）または `github_list_repositories` ツールで確認できます。

## Session ごとにリポジトリを選択する {#choose-the-repository-per-session}

Session の作成時に `github_workspace` を送信します。

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

| フィールド | 必須 | 意味 |
|---|---|---|
| `repository_id` | はい | 10 進数の文字列です。リポジトリは、その接続における Agent のリポジトリスコープ内にある必要があります。 |
| `ref` | いいえ | チェックアウトするブランチです。デフォルトはリポジトリのデフォルトブランチです。 |
| `connection_id` | いいえ | 使用する GitHub 接続です。デフォルトは、ワークスペースリポジトリが設定された割り当て、または Agent の唯一の GitHub 接続です。 |

`github_workspace` は任意です。

- 省略または `null`: Agent にワークスペースリポジトリが設定されていれば、Session はそれをクローンします。設定されていなければ何もクローンせず、通常どおり Session が開始します。
- 送信した場合: この Session に限り、Agent のデフォルトを置き換えます。

各 Session のワークスペースリポジトリは最大 1 つです。この選択は Session の作成時に確定します。

## Session で利用できるもの {#what-the-session-gets}

- `/workspace` にある `ref` のチェックアウト。`origin` は git プロキシを指します。`git fetch`、`git pull`、`git push` は通常どおり使えます。
- `sandbase-agents[bot]` を作成者とするコミット。
- `SANDBASE_GIT_BRANCH_PREFIX`。例: `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`。
- `SANDBASE_WORKSPACE_REPOSITORY`。リポジトリの `owner/name` です。

## プッシュのルール {#push-rules}

Agent がプッシュできるのは、自身のプレフィックス配下のブランチだけです。

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- 同じブランチには、すでにプルリクエストが開いているブランチも含めて、繰り返しプッシュできます。
- デフォルトブランチ、その他のブランチ、他の Session のプレフィックス、タグへのプッシュは、GitHub に届く前に拒否されます。Git には `sandbase: only agents/<session>/* branches can be pushed` と表示されます。
- プロキシ経由で GitHub Actions のワークフローファイルを変更することはできません。

Session のブランチとして扱われるのは、その Session がプッシュしたブランチだけです。`github_open_pull_request` ツールはこのブランチを受け付けます。マージスコープが管理対象ブランチに限定された接続も同様です。

## 権限は接続に従う {#permissions-follow-the-connection}

すべての git リクエストは、Agent の現在の割り当てと接続の現在のポリシーに照らしてチェックされます。

- 管理者がリポジトリスコープを狭めると、次のフェッチまたはプッシュは拒否されます。
- 管理者が **Commit to a task branch** を削除すると、次のプッシュは拒否されます。
- 管理者が接続を取り消すと、次のフェッチまたはプッシュは拒否されます。

各 Session は 1 分あたり最大 120 回の git リクエストを送信できます。

## エラー {#errors}

| レスポンス | 原因 |
|---|---|
| `400 invalid_request`（`param: github_workspace`） | `repository_id` が 10 進数の文字列でない、`ref` が単純なブランチ名でない、Agent に GitHub 接続がない、またはリポジトリのデフォルトブランチ名がサポートされていない（`ref` を明示的に指定してください）。 |
| `400 invalid_request` | Agent に複数の GitHub 接続があり、どれにもワークスペースリポジトリが設定されていません。`connection_id` を送信してください。 |
| `403 insufficient_scope` | リポジトリまたは接続が Agent のスコープ外であるか、Agent のツールに **Read code** が含まれていません。 |

## 次のステップ {#next-steps}

- [Session を実行する](/agents/sessions)
- [Create Session API リファレンス](/api-reference/sessions/create)
