---
i18nSource: 28b1ef75a197824a
title: AI ツールを接続する
description: プロンプト 1 つ、または CLI コマンド 1 つで、Claude Code、Codex、Cursor、Kiro などの AI ツールから SandBase の Models と API のカタログを使えるようにします。
---

# AI ツールを接続する {#connect-ai-tools}

Console の [AI tools](https://www.sandbase.ai/console/setup) ページ（**Build → AI tools**）では、すでに使用している Agent や AI ツールを SandBase に接続できます。接続したツールは、SandBase の Models と API のカタログを検索し、各ツールの入力スキーマと料金を読み取り、実行できます。すべての呼び出しはアクティブなワークスペースに請求されます。

サポートされているクライアントには、Claude Code、Codex、Cursor、Kiro IDE と Kiro CLI、Windsurf、Gemini CLI、OpenCode、Qwen Code、Warp、Amp、Crush、OpenClaw、Hermes、Claude Desktop、ChatGPT があります。最新の一覧は AI tools ページで確認できます。

## クイックスタート: プロンプトを 1 つ貼り付ける {#quick-start-paste-one-prompt}

次の 1 行を Agent に貼り付けます。

```text
set up https://www.sandbase.ai/SKILL.md
```

Agent が SandBase の Skill を読み込み、CLI をインストールし、ブラウザーでのサインインを 1 回承認するよう求めます。API キーを貼り付ける必要はありません。クライアントの設定が完了したと Agent が報告したら、新しいセッションを開始するかアプリを再起動して、`sandbase_*` ツールを読み込みます。

この Skill には、Agent を実行するマシンに Node.js 20 以降が必要です。

## その他の接続方法 {#other-ways-to-connect}

### CLI {#cli}

ターミナルから接続します。`--client` を指定しない場合、CLI は見つかったすべてのサポート対象クライアントを設定します。

```sh
npx -y @sandbaseai/cli@latest connect
```

1 つのクライアントだけを設定するには、その ID（例: `codex`、`claude-code`、`cursor`、`kiro`）を渡します。

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

インストーラースクリプトも同じコマンドを実行します。

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

ローカルの設定を変更せずに、インストーラーが認識するクライアントを一覧表示するには、次を実行します。

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` はブラウザーでの認可を開き、承認したワークスペースの **CLI Login** キーを作成し、SandBase が管理するクライアント設定だけを書き込みます。各クライアントについては、オープンソースの [SandBase CLI](https://github.com/sandbaseai/cli) にドキュメントがあります。

### 手動で設定する MCP クライアント {#mcp-clients-you-configure-by-hand}

サインインしたユーザーは、[AI tools](https://www.sandbase.ai/console/setup) ページの **Other ways to connect** で MCP サーバーのアドレスを確認できます。**Developer → API Keys** の [API キー](/getting-started/api-keys) で認証し、キーはクライアントのシークレット設定に保存してください。

## 接続を確認する {#verify-the-connection}

インストールや認可だけでは、クライアントが接続されたことは確認できません。次の点を確認してください。

- クライアントで SandBase のサーバーまたはコネクタが表示されている
- 新しいセッションで `sandbase_*` ツールを検出できる
- 安全な自然言語のリクエストが 1 つ正常に完了する

CLI で管理しているクライアントでは、再接続や設定の変更後に診断を実行します。

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` はローカルの認証情報、MCP のエントリ、Skill をチェックし、SandBase との通信を 1 回往復させます。最終的なツール呼び出しは、必ずクライアント自体の中で実行してください。

接続したツールによる実行は、コストとともに [Activities](https://www.sandbase.ai/console/activities) に表示されます。

## トラブルシューティング {#troubleshooting}

| 問題 | 確認事項 |
|---|---|
| ツールが表示されない | クライアントの新しいセッションを開始するかアプリを再起動し、`npx -y @sandbaseai/cli doctor --client <client>` を実行してから再試行します。 |
| 認可がない | `connect` を再度実行し、請求先のワークスペースに対するブラウザーでのサインインを承認します。 |
| 呼び出しが HTTP 402 で失敗する | アクティブなワークスペースの [Billing](https://www.sandbase.ai/console/billing) でクレジットを追加します。 |

## 管理された設定を削除する {#remove-the-managed-configuration}

1 つのクライアントについて、SandBase が管理するエントリだけを削除します。

```sh
npx -y @sandbaseai/cli unregister --client codex
```

このコマンドは、SandBase の管理下にあると確認できる設定だけを削除し、関係のないエントリやユーザーが管理するエントリは変更しません。その後、不要であれば **Developer → API Keys** で対応する **CLI Login** キーを失効させてください。

## ソースとサポート {#source-and-support}

- [ソースコード](https://github.com/sandbaseai/cli)
- [npm パッケージ](https://www.npmjs.com/package/@sandbaseai/cli)
- [質問と例](https://github.com/sandbaseai/cli/discussions)
- [バグ報告](https://github.com/sandbaseai/cli/issues/new/choose)

## 次のステップ {#next-steps}

- [Models と API のカタログ](https://www.sandbase.ai/models)
- [Skill のチュートリアル](/guides/skills/)
- [Agent を構築する](/agents/)
