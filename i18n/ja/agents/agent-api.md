---
i18nSource: 2ba7f0f41847d04f
title: Agent を定義する
description: Agents API でバージョン管理された Agent を作成・更新します。フィールド、制限、バージョン、アーカイブについて説明します。
---

# Agent を定義する {#define-an-agent}

`POST /v1/agents` で Agent を作成します。API は OpenAI Agents プロトコルに準拠しているため、プレーンな HTTP を使うことも、`base_url="https://api.sandbase.ai/v1"` を指定して OpenAI SDK の `client.beta.agents` を使うこともできます。`OpenAI-Beta` ヘッダーは任意ですが、送信する場合は `agents=v1` である必要があります。SDK でサポートされる内容については [OpenAI 互換性](/agents/openai-compatibility) を参照してください。

## Agent を作成する {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

レスポンスは `201 Created` で、Agent が返されます。内容は `agt_` ID、`version: 1`、`row_version`、`status: "active"`、`projection_status` です。新しいバージョンはバックグラウンドで実行の準備が行われます。`projection_status` が `ready` になってから Session を開始してください。

`Idempotency-Key` は任意です。省略するとサービスが自動生成するため、リトライしたリクエストで 2 つ目の Agent が作成される可能性があります。リトライする場合は独自の安定したキーを送信してください。

## フィールド {#fields}

ボディは厳密な JSON（最大 1 MiB）です。不明なフィールドは 400 を返します。

| フィールド | 必須 | 制限と値 |
|---|---|---|
| `model` | はい | モデル ID（最大 200 文字） |
| `name` | いいえ | 最大 128 文字 |
| `instructions` | いいえ | 最大 256 KiB |
| `description` | いいえ | 最大 4096 文字 |
| `runtime_profile` | いいえ | `codex`（デフォルト）、`claude`、または `mcode` |
| `skills` | いいえ | 最大 32 件の参照。`version: null` を指定した新しいバインディングは、保存時点の現在のデフォルトに固定されます。既存のバインディングは固定済みのバージョンを維持します。アップグレードするには明示的なバージョンを指定してください。[Skills](/agents/mcp-tools#skills) を参照してください |
| `mcp_connections` | いいえ | 最大 32 件の参照。[MCP 接続](/agents/mcp-tools#mcp-connections) を参照してください |
| `tools` | いいえ | 最大 64 個の `function` ツールと、最大 1 個の `web_search` ツール |
| `text` | いいえ | `format.type` は `text` または `json_schema`（object スキーマ）。`verbosity` は `low`、`medium`、または `high` |
| `reasoning` | いいえ | `effort` は `none`、`minimal`、`low`、`medium`、`high`、`xhigh`、または `max`。`summary` は `concise`、`detailed`、または `auto` |
| `service_tier` | いいえ | `auto`（デフォルト）、`default`、`flex`、`priority`、または `fast` |
| `metadata` | いいえ | 最大 16 組の文字列ペア。キーは最大 64 文字、値は最大 512 文字 |
| `note` | いいえ | バージョンに保存される変更メモ |

## 現在の制限 {#current-limits}

- Session を開始するには、`web_search` で `"mode": "disabled"` を指定する必要があります。
- `function` ツールは保存できますが、クライアントがツールの結果を返す必要がある Run（`requires_action`）はまだサポートされていません。その状態の Session は `502 executor_contract_error` を返します。外部の機能は代わりに [MCP 接続](/agents/mcp-tools#mcp-connections) で Agent に提供してください。
- `multi_agent` は省略するか `null` にする必要があります。

## Agent を更新する {#update-an-agent}

更新方法は 2 種類あり、どちらも新しいバージョンを作成します。

- `POST /v1/agents/{agent_id}` は OpenAI SDK 形式の更新です。変更したいフィールドだけを送信します。`row_version` は不要なため、最後に書き込んだ内容が優先されます。この形式では `description` と `note` は受け付けません。
- `PATCH /v1/agents/{agent_id}` は compare-and-set 形式の更新です。最後に読み取った `row_version` が必要で、その間に Agent が変更されていた場合は 409 を返します。明示的な `null` 値は拒否されます。

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## バージョン、アーカイブ、復元 {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` は変更不可のスナップショットを一覧表示し、`GET /v1/agents/{agent_id}/versions/{version}` はその 1 つを読み取ります。
- `POST /v1/agents/{agent_id}/restore` に `{"source_version": 1, "row_version": 3}` を指定すると、以前の設定を新しい現在のバージョンとしてコピーします。
- `POST /v1/agents/{agent_id}/archive` と `/unarchive` は `{"row_version": …}` を受け取ります。アーカイブ済みの Agent は新しい Session を開始できません。
- `DELETE /v1/agents/{agent_id}` は Agent をアーカイブします。Agent が完全に削除されることはありません。

## 次のステップ {#next-steps}

- [Skills と MCP ツール](/agents/mcp-tools)
- [Session で Agent を実行する](/agents/sessions)
- [Agents API リファレンス](/api-reference/agents/)
