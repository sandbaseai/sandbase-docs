---
i18nSource: 071e97a48f9c4f4c
title: API リファレンス
description: SandBase のモデルを呼び出し、Agents、Sessions、Skills、MCP 接続、Secrets、アカウントのリソースを管理します。
---

# API リファレンス {#api-reference}

API を使うと、モデルを直接呼び出したり、再利用可能な Agent を定義して Session で実行し、Skills や MCP ツールに接続したりできます。

::: tip モデル推論をお探しですか？
推論の仕様（Chat Completions、Responses、Anthropic Messages、Gemini、Images、Seedance の動画）は、このリファレンスの **Model inference** セクションにあります。各モデル固有のフィールドと料金は、[Models カタログ](https://www.sandbase.ai/models) の各モデルのページに記載されています。
:::

## 始め方を選ぶ {#choose-a-starting-point}

| 目的 | 最初に見るページ | 次のステップ |
|---|---|---|
| 再利用可能な動作を定義する | [Agents](/api-reference/agents/) | Agent の設定を作成し、バージョン管理します |
| Agent を直接実行する | [Sessions](/api-reference/sessions/) | 入力を送信し、イベントをストリーミングし、履歴を読み取ります |
| 指示のバンドルを再利用する | [Skills](/api-reference/skills/) | バージョン管理された ZIP バンドルをアップロードし、Agent に添付します |
| 外部ツールを呼び出す | [MCP Connections](/api-reference/mcp-connections/) | Agent 用にリモートの HTTPS MCP サーバーを登録します |
| 外部ツールを認証する | [Secrets](/agents/api-credentials#with-the-api) | MCP 接続用に書き込み専用の Bearer トークンを保存します |

## リソースのライフサイクル {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent**（`agt_`）は、保存されバージョン管理される設定です。作成しても実行はされません。
- **Session**（`ses_`）は 1 つの Agent バージョンを実行し、その Skills と MCP 接続を固定します。Session のパスは `/v1/agents/sessions` の下にあります。
- **Skill**（`skl_`）は、バージョン管理された指示のバンドルです。**MCP 接続**（`mcp_`）はリモートのツールサーバーを登録し、**Secret**（`sec_`）はその Bearer トークンを保存します。

## Agents プラットフォームのリソースの規約 {#conventions-for-agents-platform-resources}

Agents、Sessions、Skills、MCP 接続、Secrets は `https://api.sandbase.ai/v1` で提供され、次のルールが共通で適用されます。

- `Authorization: Bearer` または `X-API-Key` で認証します。[認証](/api-reference/authentication#agents-platform-resources) を参照してください。
- リクエストボディは最大 1 MiB の厳密な JSON で、不明なフィールドは 400 を返します。
- MCP 接続または Secret を作成する書き込みには `Idempotency-Key` が必要です。その他の書き込みでも指定できます。
- 楽観的同時実行制御には `row_version` を使用します。最後に読み取った値を送信し、409 が返された場合は再度読み取ってください。
- Agents、Sessions、items、turns、Skills はカーソルページネーション（`limit`、`after`、`order`。レスポンスには `has_more` と `last_id`）を使用します。Agent のバージョン、添付、MCP 接続、Secrets はオフセットページネーション（`limit`、`offset`。レスポンスには `total`）を使用します。
- エラーは `{"error": {"type", "code", "param", "message"}}` を使用します。[Agents プラットフォームのエラー](/api-reference/errors#agents-platform-errors) を参照してください。

## 認証 {#authentication}

SandBase の API キーを Bearer トークンとして送信します。

```http
Authorization: Bearer sk-YOUR_KEY
```

キーは不透明なシークレットとして扱い、サーバー側に保管し、ブラウザーのコードやログには決して含めないでください。互換性の詳細は [認証](/api-reference/authentication)、公開されているエラーエンベロープは [エラー](/api-reference/errors) を参照してください。

## 組織と使用量 {#organization-and-usage}

プラットフォームのリソースは、API キーに関連付けられた組織に属します。サポートされている残高と最近の実行履歴は [Account API](/api-reference/account/) で確認できます。組織の管理と請求管理は、ここに公開エンドポイントが記載されていない限り、Console で行います。

## リファレンスの形式 {#reference-formats}

- サイドバーから操作を参照すると、例とレスポンスの詳細を確認できます。
- 機械可読な [OpenAPI 仕様](/openapi.yaml) をダウンロードできます。
- 正確なリクエストフィールドは、[Models カタログ](https://www.sandbase.ai/models) の各モデルのページ、または [APIs カタログ](https://www.sandbase.ai/apis) の各 API のページで確認できます。

## 次のステップ {#next-steps}

- マネージド Agent を初めて使う場合: [Agent を構築する](/agents/)
- モデルを直接呼び出す場合: [Chat Completions](/api-reference/llm-gateway) または [Models カタログ](https://www.sandbase.ai/models)
