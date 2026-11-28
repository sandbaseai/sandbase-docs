---
i18nSource: d637409019c8109d
title: OpenAI 互換性
description: 公式の OpenAI SDK で SandBase の Agents、Sessions、Skills を利用する方法と、SandBase が OpenAI Agents API と異なる点を説明します。
---

# OpenAI 互換性 {#openai-compatibility}

SandBase Agents は、Agents、Sessions、Session イベント、アイテム、ターン、Skills について [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) プロトコルを実装しています。これらのリソースには公式の OpenAI SDK をそのまま使えます。`base_url` を `https://api.sandbase.ai/v1` に向け、SandBase の API キーを渡してください。

MCP 接続、Secrets、カタログは SandBase 独自のリソースです。SDK にはこれらのメソッドがないため、HTTP で（または SDK の汎用メソッド `client.post` / `client.get` で）呼び出してください。

動作確認済みの SDK バージョン：

| SDK | バージョン | 備考 |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | 3.13.0 には `sessions.update(agent=...)` と `sessions.traces` がありません |
| openai-node | 7.28.0 (Node.js 26) | ストリーミングには HTTP/1.1 ディスパッチャーを使用してください。[後述](#node-js-and-http-2)を参照してください |

## クライアントを設定する {#set-up-the-client}

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],  # your SandBase API key
    base_url="https://api.sandbase.ai/v1",
)
```

```js [Node.js]
// npm install openai@7.28.0 undici
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY, // your SandBase API key
  baseURL: 'https://api.sandbase.ai/v1',
  // HTTP/1.1 keeps the live event stream and the input request on separate connections.
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})
```

:::

SDK は `OpenAI-Beta: agents=v1` を自動で送信します。SandBase はこの値またはヘッダーなしを受け付けます。それ以外の値の場合は `400` が返されます。

## Agent をエンドツーエンドで実行する {#run-an-agent-end-to-end}

Agent を作成し、Session を作成して、ライブイベントストリームを開き、入力を 1 件送信して、履歴を読み取ります。ストリームはライブ専用なので、入力を送信する前に開いてください。

::: code-group

```python [Python]
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")

agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Keep output brief.",
    metadata={"team": "research"},
)
session = client.beta.agents.sessions.create(
    agent_id=agent.id,
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "Reply with exactly: ok"}]}],
        }],
        idempotency_key="research-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break

for item in client.beta.agents.sessions.items.list(session.id, order="asc", limit=100).data:
    print(item.type, getattr(item, "role", None))

# Clean up: both calls archive the resource.
client.beta.agents.sessions.delete(session.id)
client.beta.agents.delete(agent.id)
```

```js [Node.js]
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})

const agent = await client.beta.agents.create({
  model: 'deepseek/deepseek-v4-flash',
  name: 'Research assistant',
  instructions: 'Keep output brief.',
  metadata: { team: 'research' },
})
const session = await client.beta.agents.sessions.create({
  agent_id: agent.id,
  environment: { type: 'openai_hosted' }, // Required by the SDK types; SandBase always runs in its hosted cloud.
})

const stream = await client.beta.agents.sessions.events.stream(session.id)
const done = (async () => {
  for await (const event of stream) {
    console.log(event.type)
    if (/^agent\.session\.turn\.(completed|failed|cancelled)$/.test(event.type)) break
  }
})()

await client.beta.agents.sessions.events.create(session.id, {
  events: [{ type: 'agent.session.input.message', input: 'Reply with exactly: ok' }],
  'Idempotency-Key': 'research-input-1',
})
await done

const items = await client.beta.agents.sessions.items.list(session.id, { order: 'asc', limit: 100 })
for (const item of items.data) console.log(item.type, item.role)

// Clean up: both calls archive the resource.
await client.beta.agents.sessions.delete(session.id)
await client.beta.agents.delete(agent.id)
```

:::

`events.create` はボディなしで `202` を返します。各リクエストにはイベントをちょうど 1 件含めます。同じ `Idempotency-Key` を同じボディで再利用しても、2 回目のターンは開始されません。実行中のターンを停止するには、`{"type": "agent.session.input.cancel"}` を単一のイベントとして送信します。

### Node.js と HTTP/2 {#node-js-and-http-2}

Node.js 26 の `fetch` は SandBase API と HTTP/2 をネゴシエートすることがあります。その場合、共有の HTTP/2 接続上で `events.stream` が開いている間、同じ接続の `events.create` がストリームが閉じるまで停止することがあります。上記の `allowH2: false` を指定した `undici` ディスパッチャーを使うと、この問題を回避できます。Python SDK はデフォルトで HTTP/1.1 を使うため、変更は不要です。

## SDK で Skills を使う {#skills-with-the-sdk}

`client.skills` は OpenAI と同様に動作しますが、Skill の個別バージョンの削除には対応していません。ZIP には、`SKILL.md` を含むトップレベルフォルダーを 1 つだけ入れる必要があります（`zip -r release-notes.zip release-notes/`）。ZIP のルートに `SKILL.md` があると `400 invalid_request` が返されます。

::: code-group

```python [Python]
with open("release-notes.zip", "rb") as bundle:
    skill = client.skills.create(files=[("release-notes.zip", bundle.read(), "application/zip")])
print(skill.id, skill.default_version)

zip_bytes = client.skills.content.retrieve(skill.id).read()
```

```js [Node.js]
import fs from 'node:fs'

const skill = await client.skills.create({ files: fs.createReadStream('release-notes.zip') })
console.log(skill.id, skill.default_version)

const zip = Buffer.from(await (await client.skills.content.retrieve(skill.id)).arrayBuffer())
```

:::

`skills.retrieve`、`skills.list`、`skills.update(default_version=...)`、`skills.versions.create / list / retrieve`、`skills.versions.content.retrieve`、`skills.delete` も使用できます。いずれかの Agent バージョンから参照されている Skill は削除できません（`409`）。代わりに Update Skill で `status` を `disabled` に設定してください。

## SDK で MCP 接続を使う {#mcp-connections-with-the-sdk}

OpenAI では MCP サーバーを `tools: [{"type": "mcp", ...}]` としてインラインで宣言します。SandBase はこの形式に対して `400` を返します。[`POST /v1/mcp-connections`](/api-reference/mcp-connections/) でサーバーを一度登録し、Agent の `mcp_connections` から参照してください。どちらの手順も SDK の汎用リクエストメソッドと追加ボディフィールドで実行できます。

::: code-group

```python [Python]
import uuid

connection = client.post(
    "/mcp-connections",
    cast_to=object,
    body={"name": "DeepWiki", "server_url": "https://mcp.deepwiki.com/mcp"},
    options={"headers": {"Idempotency-Key": str(uuid.uuid4())}},  # Use a new key per create; reusing one returns the original (possibly disabled) connection.
)
agent = client.beta.agents.update(
    agent.id,
    extra_body={"mcp_connections": [
        {"connection_id": connection["id"], "server_label": "deepwiki", "allowed_tools": None, "required": False},
    ]},
)
```

```js [Node.js]
const connection = await client.post('/mcp-connections', {
  body: { name: 'DeepWiki', server_url: 'https://mcp.deepwiki.com/mcp' },
  headers: { 'Idempotency-Key': crypto.randomUUID() }, // Use a new key per create; reusing one returns the original (possibly disabled) connection.
})
await client.beta.agents.update(agent.id, {
  mcp_connections: [
    { connection_id: connection.id, server_label: 'deepwiki', allowed_tools: null, required: false },
  ],
})
```

:::

Node.js の呼び出しでは、プレーンな JavaScript で `mcp_connections` を渡しています。TypeScript では、このフィールドは SDK の型に含まれていません。MCP サーバー用の Bearer トークンは、OpenAI の vault ではなく [Secrets](/agents/api-credentials) として保存されます。

## 実行環境 {#execution-environment}

SandBase はすべての Session をホスト型のクラウドで実行します。選択や管理が必要な環境はありません。

- HTTP で直接呼び出す場合は `environment` を省略します。
- OpenAI SDK では `sessions.create` に `environment` 引数が必須です（Python では省略すると `TypeError` が発生し、Node.js の型でも必須になっています）。`{"type": "openai_hosted"}` を渡すと、SandBase はそれを受け付けます。`self_hosted` など他の値の場合は `400` が返されます。
- Session のレスポンスには、SDK との互換性のために `environment` オブジェクトが含まれます。これを読み取ったり、対応したりする必要はありません。

## 互換性の概要 {#compatibility-at-a-glance}

| 領域 | ステータス | 詳細 |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | 互換（拡張あり） | レスポンスには `status`、`version`、`row_version`、`projection_status`、`runtime_profile`、`skills`、`mcp_connections` などが追加されます。`delete` は Agent をアーカイブし、`agent.deleted` を返します。 |
| `beta.agents.sessions.create / retrieve / update / list / delete` | 互換（制限あり） | 保存済みの `agent_id`、インラインの `agent`、またはその両方を受け付けます。`agent` には `model`、`instructions`、`runtime_profile`、`service_tier`、`tools`、`text`、`reasoning`、`multi_agent` を指定できます。`stream=True` は最初のターンをストリーミングし、初期の `input` が必要です。`update` は `metadata` のみ受け付けます。`delete` は Session をアーカイブします。 |
| `sessions.events.stream` | 互換 | OpenAI と同様にライブ専用です。`Last-Event-ID` または `?after=` を指定すると `400` が返されます。 |
| `sessions.events.create` | 互換（制限あり） | 1 リクエストにつき、`agent.session.input.message` または `agent.session.input.cancel` イベントをちょうど 1 件送信します。メッセージは user の `input_text` パート 1 つ、またはプレーンな文字列です。 |
| `sessions.items.list`、`sessions.turns.list / retrieve` | 互換 | `limit`（1〜100）、`after`、`order` によるカーソルページネーション。 |
| `client.skills` と `skills.versions` | 互換（バージョン削除を除く） | `skills.versions.delete` は `404` を返します。 |
| エラーエンベロープ | 互換 | `{"error": {"type", "code", "param", "message"}}`。SDK の例外では `exc.body` として参照できます。 |
| Agent のバージョン、復元、アーカイブ、カタログ、Session の名前変更/アーカイブ/再接続/ファイル/ワークスペースファイル/成果物 | SandBase のみ | [Agents](/api-reference/agents/) と [Sessions](/api-reference/sessions/) の API リファレンスを参照してください。 |
| MCP 接続、Secrets | SandBase のみ | HTTP または `client.post` / `client.get` を使用してください。 |

SandBase は [成果物の一覧](/api-reference/sessions/list-artifacts) と [コンテンツのダウンロード](/api-reference/sessions/download-artifact) を HTTP で提供しています。成果物 ID は不透明で、Session 単位のスコープです。これは SDK のすべての成果物メソッドへの対応を意味するものではありません。成果物のメタデータ用の個別エンドポイントは公開されていません。

### 非対応 {#not-supported}

以下の OpenAI SDK の呼び出しは SandBase では失敗します。メッセージは実際に返される `error.message` です。

| SDK の呼び出し | 結果 |
|---|---|
| 初期の `input` なしの `sessions.create(..., stream=True)` | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`：`only openai_hosted environment is supported` |
| `model`、`instructions`、`runtime_profile`、`service_tier`、`tools`、`text`、`reasoning`、`multi_agent` 以外のフィールドを含む `sessions.create(..., agent={...})` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400`（openai-python 3.13.0 には `agent` パラメータがなく、`TypeError` が発生します） |
| `agents.create(..., multi_agent={"enabled": True})` | `400`：`multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`、および `tool_search`、`programmatic_tool_calling`、`computer_use` ツール | `400 invalid_request`。受け付けるのは `function` と 1 つの `web_search` ツールのみです |
| `tool_result` または computer-use の承認イベントを含む `events.create` | `400 invalid_request`。`requires_action` に達する Session には対応していません |
| 複数のイベントを含む `events.create` | `400`：`exactly one text input or cancel event is supported per request` |
| `sessions.traces`、`sessions.subagents`、`environments.templates` | `404 not_found`（openai-python 3.13.0 には `traces` がありません） |
| `beta.agents.vaults` | JSON エラーエンベロープではなく、プレーンテキストのボディ（`404 page not found`）で `404` |
| `skills.versions.delete` | `404 not_found` |

### フィールドの違い {#field-differences}

- Session は失敗を OpenAI の `error` ではなく `failure`（`{code, message, action, retryable?}`）で報告します。SDK では `session.error` は `None` になるため、代わりに `session.failure` を読み取ってください。
- `required_actions` と `vault_ids` は常に空の配列です。
- Agent と Session のタイムスタンプは Unix 秒です。Agent バージョンの `created_at`、MCP 接続、Secrets は ISO 8601 文字列を使用します。
- `402 spending_limit_exceeded` には専用の SDK 例外クラスがなく、汎用の `APIStatusError` として扱われます。
- 既知のパスに対する非対応メソッド（たとえば `/v1/agents` への `PUT`）は、`405` ではなく JSON エラーエンベロープ付きの `404` を返します。

## 次のステップ {#next-steps}

- [Sessions](/agents/sessions)
- [Skills と MCP ツール](/agents/mcp-tools)
- [Agents API リファレンス](/api-reference/agents/)
