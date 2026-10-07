---
title: Define an Agent
description: Create and update a versioned Agent with the Agents API, including fields, limits, versions, and archive.
---

# Define an Agent

Create an Agent with `POST /v1/agents`. The API follows the OpenAI Agents protocol, so you can use plain HTTP or the OpenAI SDK's `client.beta.agents` with `base_url="https://api.sandbase.ai/v1"`. The `OpenAI-Beta` header is optional; if you send it, it must be `agents=v1`. See [OpenAI compatibility](/agents/openai-compatibility) for what the SDK supports.

## Create an Agent

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

The response is `201 Created` with the Agent: an `agt_` ID, `version: 1`, `row_version`, `status: "active"`, and `projection_status`. A new version is prepared for execution in the background; start Sessions once `projection_status` is `ready`.

`Idempotency-Key` is optional. When you omit it the service generates one, so a retried request can create a second Agent. Send your own stable key when you retry.

## Fields

The body is strict JSON (up to 1 MiB). Unknown fields return 400.

| Field | Required | Limits and values |
|---|---|---|
| `model` | Yes | Model ID, up to 200 characters |
| `name` | No | Up to 128 characters |
| `instructions` | No | Up to 256 KiB |
| `description` | No | Up to 4096 characters |
| `runtime_profile` | No | `codex` (default), `claude`, or `mcode` |
| `skills` | No | `[{"skill_id": "skl_…", "version": null}]`; see [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | No | Up to 32 references; see [MCP connections](/agents/mcp-tools#mcp-connections) |
| `tools` | No | Up to 64 `function` tools and at most one `web_search` tool |
| `text` | No | `format.type` `text` or `json_schema` (object schema); `verbosity` `low`, `medium`, or `high` |
| `reasoning` | No | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, or `max`; `summary` `concise`, `detailed`, or `auto` |
| `service_tier` | No | `auto` (default), `default`, `flex`, `priority`, or `fast` |
| `metadata` | No | Up to 16 string pairs; keys up to 64 and values up to 512 characters |
| `note` | No | Change note stored on the version |

## Current limits

- `web_search` must use `"mode": "disabled"` for Sessions, Services, and Schedules to start.
- `function` tools can be saved, but Runs that need the client to return a tool result (`requires_action`) are not supported yet. A Session in that state returns `502 executor_contract_error`. Give the Agent external capabilities through [MCP connections](/agents/mcp-tools#mcp-connections) instead.
- `multi_agent` must be omitted or `null`.

## Update an Agent

There are two update forms. Both create a new version.

- `POST /v1/agents/{agent_id}` is the OpenAI SDK update. Send only the fields you want to change. No `row_version` is needed, so the last writer wins. `description` and `note` are not accepted in this form.
- `PATCH /v1/agents/{agent_id}` is the compare-and-set update. It requires the `row_version` you last read and returns 409 if the Agent changed in the meantime. Explicit `null` values are rejected.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Versions, archive, and restore

- `GET /v1/agents/{agent_id}/versions` lists immutable snapshots; `GET /v1/agents/{agent_id}/versions/{version}` reads one.
- `POST /v1/agents/{agent_id}/restore` with `{"source_version": 1, "row_version": 3}` copies an earlier configuration into a new current version.
- `POST /v1/agents/{agent_id}/archive` and `/unarchive` take `{"row_version": …}`. Archived Agents cannot start new Sessions, Services, or Schedules.
- `DELETE /v1/agents/{agent_id}` archives the Agent. Agents are never hard-deleted.

## Next steps

- [Skills and MCP tools](/agents/mcp-tools)
- [Run the Agent in a Session](/agents/sessions)
- [Agents API reference](/api-reference/agents/)
