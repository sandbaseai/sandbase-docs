---
i18nSource: 417ea5dc930a8786
title: Skills と MCP ツール
description: SandBase の Agent に再利用可能な Skill とリモートの MCP ツールを提供し、各 Session で使用するバージョンとツールを制御します。
---

# Skills と MCP ツール {#skills-and-mcp-tools}

Agent に機能を与える方法は 2 つあります。

- **Skills** は、Agent に作業の進め方を教えます。Skill は、指示とリソースをまとめたバージョン管理された ZIP バンドルです。
- **MCP 接続** を使うと、Agent は HTTPS 経由でリモートの MCP サーバーのツールを呼び出せます。必要に応じて [Secret](/agents/api-credentials) で認証できます。

実用的な Agent の多くは両方を組み合わせます。MCP サーバーがデータを取得したりアクションを実行したりし、Skill がその結果の使い方を記述します。

## Skills {#skills}

1. `name` と `description` のフロントマターを含む `SKILL.md` を置いたフォルダーを用意し、そのフォルダー自体を ZIP にします（`zip -r release-notes.zip release-notes/`、最大 5 MiB）。ZIP の最上位にそのフォルダーがある必要があります。ZIP のルートに `SKILL.md` がある場合は `400 invalid_request` を返します。
2. `POST /v1/skills` で multipart フィールド `files` としてアップロードします。レスポンスには `skl_` ID と `default_version: "1"` が含まれます。
3. Agent の `skills` 配列で参照します。

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- 初めて添付するとき、`"version": null` は Agent の保存時点で Skill の現在の `default_version` に解決されます。`"2"` のような文字列を指定すると、そのバージョンを明示的に選択します。
- 保存された Agent はバージョンを固定します。Skill のデフォルトを変更しても、既存の Agent やその新しい Session はアップグレードされません。アップグレードするには、明示的なバージョンを指定して Agent を更新してください。既存のバインディングに `null` を送信すると、固定済みのバージョンが維持されます。
- 新しいバージョンは `POST /v1/skills/{skill_id}/versions` でアップロードし、デフォルトは `default=true` または `POST /v1/skills/{skill_id}` で切り替えます。
- Skill を無効にすると、それを参照する Agent の新しい Session は `400 skill_not_found` で失敗します。

公開 Skill は [Skills カタログ](/api-reference/skills/catalog) でも閲覧できます。詳しい手順は [Skills API](/api-reference/skills/) を参照してください。

## 組み込みの SandBase ツール {#built-in-sandbase-tools}

新しい Agent はすべて、設定なしで SandBase 独自のツールを使用できます。`sandbase_discover`、`sandbase_inspect`、`sandbase_run` を使って、Agent はカタログからモデルや API を探し、そのスキーマと料金を読み取り、あなたのキーで呼び出します。作成時に `mcp_connections` を省略すると、Agent には次のデフォルトが設定されます。

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **送信したリストはデフォルトを置き換えます。** 独自の MCP サーバーを追加しつつ SandBase ツールも残すには、リストに組み込みエントリを含めてください。
- **`builtin:sandbase` には `server_label: "sandbase_builtin"` が必要です。** 他のラベルを指定した場合や、別の接続にこのラベルを指定した場合は `400` を返します。
- **ツールなしで Agent を作成するには、** `"mcp_connections": []` を送信します。
- **組み込みツールは無料です。** 料金は、Agent がそれらを通じて呼び出すモデルと API の分だけです。

## MCP 接続 {#mcp-connections}

1. MCP サーバーで Bearer トークンが必要な場合は、その正確な URL に対して [Secret を作成](/agents/api-credentials) します。
2. `POST /v1/mcp-connections` でサーバーを登録します。

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Agent の `mcp_connections` 配列で接続を参照します。

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| フィールド | 意味 |
|---|---|
| `connection_id` | 組織内の `mcp_` 接続 ID、または組み込み SandBase サーバーの場合は `builtin:sandbase` |
| `server_label` | 英字で始まり、英字、数字、`_`、`-` を使用。最大 64 文字。Agent 内で一意 |
| `allowed_tools` | 省略または `null` の場合はサーバーが提供するすべてのツールを許可し、`[]` は何も許可しません。リストを指定するとその名前のみを許可します（最大 256 個、各名前は空白不可で最大 128 バイト） |
| `required` | Session がこのサーバーを読み込む必要があるかどうか |

Agent は最大 32 件の接続を参照できます。組織の接続は、Session の開始時点で `active` である必要があります。

### 組み込みの SandBase ツール {#built-in-sandbase-tools-1}

`mcp_connections` なしで Agent を作成すると、組み込みの SandBase サーバーが選択されます。独自のサーバーと併せて明示的に残すには、配列に次のエントリを含めてください。

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

明示的な配列は選択全体を置き換えます。上記のカスタムのみの例では組み込みサーバーは含まれません。すべての MCP ツールを無効にするには `[]` を送信します。Agent の更新時にこのフィールドを省略すると既存の選択が維持され、`null` は `400` を返します。組み込みエントリでは MCP 接続や Secret を作成する必要はありません。廃止された `use_sandbase_mcp` フィールドは送信しないでください。

::: info OpenAI との違い
OpenAI の Agents API では、MCP サーバーを `tools: [{"type": "mcp", ...}]` としてインラインで宣言します。SandBase はこの形式に対して `400` を返します。サーバーを接続リソースとして登録し、`mcp_connections` で参照してください。OpenAI SDK には `/v1/mcp-connections` や `/v1/secrets` 用のメソッドがないため、`client.post(...)` で呼び出し、`mcp_connections` は `extra_body`（Python）またはリクエストボディ（Node.js）で渡してください。[OpenAI 互換性](/agents/openai-compatibility#mcp-connections-with-the-sdk) を参照してください。
:::

## 変更と実行中の Session {#changes-and-running-sessions}

各 Session は、開始時に Agent のバージョン、Skill のバージョン、MCP 接続の設定を固定します。

- 接続を置き換えたり Secret をローテーションしたりすると、新しい Session では新しい設定が使われます。既存の Session はスナップショットを保持します。
- 接続を無効にしたり Secret を失効させたりすると、新しい Session はブロックされ、それを使用する既存の Session へのそれ以降の入力は拒否されます。すでに実行中のツール呼び出しは中断されません。

## トークンをプロンプトに含めない {#keep-tokens-out-of-prompts}

トークンは Secret として保存してください。指示、Session の入力、メタデータ、Skill バンドルには含めないでください。これらは Agent や Session にアクセスできる人なら誰でも読み取れます。

## 次のステップ {#next-steps}

- [MCP ツールの認証情報](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Agent を定義する](/agents/agent-api)
