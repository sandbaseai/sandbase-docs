---
i18nSource: 2ba7f0f41847d04f
title: 定義 Agent
description: 使用 Agents API 建立並更新具版本控管的 Agent，包含欄位、限制、版本與封存。
---

# 定義 Agent {#define-an-agent}

使用 `POST /v1/agents` 建立 Agent。此 API 遵循 OpenAI Agents 協定，因此您可以使用一般 HTTP，或搭配 `base_url="https://api.sandbase.ai/v1"` 使用 OpenAI SDK 的 `client.beta.agents`。`OpenAI-Beta` 標頭為選用；若有傳送，值必須是 `agents=v1`。SDK 支援的功能請參閱 [OpenAI 相容性](/agents/openai-compatibility)。

## 建立 Agent {#create-an-agent}

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

回應為 `201 Created`，內容是該 Agent：包含 `agt_` ID、`version: 1`、`row_version`、`status: "active"` 與 `projection_status`。新版本會在背景準備執行；待 `projection_status` 變為 `ready` 後即可啟動 Session。

`Idempotency-Key` 為選用。省略時服務會自動產生一組，因此重試的請求可能會建立第二個 Agent。重試時請傳送您自己的固定金鑰。

## 欄位 {#fields}

請求主體必須是嚴格的 JSON（最大 1 MiB）。未知欄位會回傳 400。

| 欄位 | 必填 | 限制與可用值 |
|---|---|---|
| `model` | 是 | 模型 ID，最多 200 個字元 |
| `name` | 否 | 最多 128 個字元 |
| `instructions` | 否 | 最多 256 KiB |
| `description` | 否 | 最多 4096 個字元 |
| `runtime_profile` | 否 | `codex`（預設）、`claude` 或 `mcode` |
| `skills` | 否 | 最多 32 個參照。`version: null` 的新繫結會在儲存時固定為當下的預設版本；既有繫結則保留其已固定的版本。若要升級，請指定明確版本；請參閱 [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | 否 | 最多 32 個參照；請參閱 [MCP 連線](/agents/mcp-tools#mcp-connections) |
| `tools` | 否 | 最多 64 個 `function` 工具，以及最多一個 `web_search` 工具 |
| `text` | 否 | `format.type` 為 `text` 或 `json_schema`（物件 schema）；`verbosity` 為 `low`、`medium` 或 `high` |
| `reasoning` | 否 | `effort` 為 `none`、`minimal`、`low`、`medium`、`high`、`xhigh` 或 `max`；`summary` 為 `concise`、`detailed` 或 `auto` |
| `service_tier` | 否 | `auto`（預設）、`default`、`flex`、`priority` 或 `fast` |
| `metadata` | 否 | 最多 16 組字串鍵值；鍵最多 64 個字元，值最多 512 個字元 |
| `note` | 否 | 儲存在該版本上的變更說明 |

## 目前的限制 {#current-limits}

- `web_search` 必須使用 `"mode": "disabled"`，Session 才能啟動。
- `function` 工具可以儲存，但尚不支援需要用戶端回傳工具結果（`requires_action`）的 Run。處於該狀態的 Session 會回傳 `502 executor_contract_error`。請改用 [MCP 連線](/agents/mcp-tools#mcp-connections) 為 Agent 提供外部能力。
- `multi_agent` 必須省略或設為 `null`。

## 更新 Agent {#update-an-agent}

更新有兩種形式，兩者都會建立新版本。

- `POST /v1/agents/{agent_id}` 是 OpenAI SDK 的更新方式。只需傳送要變更的欄位。不需要 `row_version`，因此以最後寫入者為準。此形式不接受 `description` 與 `note`。
- `PATCH /v1/agents/{agent_id}` 是比較並設定（compare-and-set）的更新方式。必須提供您最後讀取到的 `row_version`，若 Agent 在此期間已被變更則回傳 409。明確的 `null` 值會被拒絕。

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## 版本、封存與還原 {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` 會列出不可變的快照；`GET /v1/agents/{agent_id}/versions/{version}` 讀取單一快照。
- 以 `{"source_version": 1, "row_version": 3}` 呼叫 `POST /v1/agents/{agent_id}/restore`，會將較早的設定複製為新的目前版本。
- `POST /v1/agents/{agent_id}/archive` 與 `/unarchive` 接受 `{"row_version": …}`。已封存的 Agent 無法啟動新的 Session。
- `DELETE /v1/agents/{agent_id}` 會封存該 Agent。Agent 永遠不會被實際刪除。

## 後續步驟 {#next-steps}

- [Skills 與 MCP 工具](/agents/mcp-tools)
- [在 Session 中執行 Agent](/agents/sessions)
- [Agents API 參考](/api-reference/agents/)
