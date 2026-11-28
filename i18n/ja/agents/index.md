---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: 再利用可能でバージョン管理された Agent を定義、テストし、SandBase の Session で実行します。
---

# Build Agent {#build-agent}

Build Agent では、Agent を定義してテストし、その実行方法を決めます。

Agent は、保存されバージョン管理される設定です。Model、instructions、ランタイムプロファイル、Skills、外部ツールへの MCP 接続で構成されます。Agent を保存しても実行はされません。

## Agent とは {#what-an-agent-is}

| 問い | 設定する場所 |
|---|---|
| 何をするのか | `instructions` |
| どのモデルが処理するのか | `model`。[Models API](/api-reference/models/) のモデル ID |
| 何ができるのか | [Skills](/agents/mcp-tools#skills)。バージョン管理された指示のバンドル |
| どの外部ツールを呼び出せるのか | [MCP 接続](/agents/mcp-tools#mcp-connections)。サーバーがトークンを必要とする場合は[認証情報](/agents/api-credentials)も使用 |
| どのように実行するのか | [Session](/agents/sessions) 内で実行 |

実質的な変更を加えるたびに、変更不可の新しいバージョンが作成されます。バージョンはいつでも一覧表示でき、以前のバージョンに戻すこともできます。

## Agent の実行方法 {#how-an-agent-runs}

Agent は [Session](/agents/sessions) 内で実行します。Session は `ses_` リソースで、入力を送信し、イベントをストリーミングで受け取ります。対話的な会話、テスト実行、アプリケーションからの呼び出しのいずれにも使えます。各 Session は開始時の Agent バージョンを固定するため、既存の Session に影響を与えずに Agent の編集を続けられます。

## Agent のライフサイクル: 下書き → Session でテスト → アプリから実行 → Session を確認 {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. 下書き {#_1-draft}

Console の **Build → Agents** で、または [`POST /v1/agents`](/agents/agent-api) で Agent を作成します。最小限の有用なワークフローから始め、Skills と MCP 接続は instructions で必要になったときだけ追加してください。

### 2. Session でテスト {#_2-test-in-a-session}

Agent 用の Session を作成し、代表的な入力を送信して、出力、ツールの動作、エラーを確認します。正常系だけでなく、入力の欠落、利用できないツール、空の結果、出力形式の要件もテストしてください。

### 3. アプリから実行 {#_3-run-from-your-app}

テスト済みの Agent に対して、[Sessions API](/api-reference/sessions/) を使ってアプリケーションから Session を作成します。

### 4. Session を確認 {#_4-inspect-sessions}

Sessions API で各 Session の items と turns を読み取り、会話全体、ツールの動作、エラーを確認します。

## 本番環境のチェックリスト {#production-checklist}

- `model` に、Models API の現行のモデル ID を使っている。
- 動作が知らないうちに変わってはならない場合、Skills のバージョンを固定している。
- MCP 接続では `allowed_tools` を使い、Agent が必要とするツールだけを公開している。
- トークンは [Secret](/agents/api-credentials) として保存し、instructions、入力、メタデータに書き込んでいない。
- Session の作成時に `Idempotency-Key` を送信し、リトライでは同じキーを再利用している。
- 起動後に Session のステータスとエラーを確認している。

## カタログの Agent {#catalog-agents}

公開の [Agent カタログ](/api-reference/agents/catalog)には、SandBase が公開している Agent が掲載されています。カタログの Agent は読み取れますが、変更するにはまず `POST /v1/agents/catalog/{agent_id}/clone` で組織にクローンしてください。クローンは、あなたが所有し実行できる新しいプライベートな Agent になります。

::: tip OpenAI SDK の使用
Agents、Sessions、Skills は OpenAI Agents API に準拠しているため、公式の OpenAI SDK を `base_url="https://api.sandbase.ai/v1"` で使用できます。検証済みの例と相違点については、[OpenAI 互換性](/agents/openai-compatibility)を参照してください。
:::

## 次のステップ {#next-steps}

- [Agent を定義する](/agents/agent-api)
- [OpenAI 互換性](/agents/openai-compatibility)
- [Skills と MCP ツール](/agents/mcp-tools)
- [Sessions](/agents/sessions)
