---
title: Sessions
description: Run an Agent in a Session, stream its events, read history, attach files, and handle failures.
---

# Sessions

A **Session** runs one saved Agent version in SandBase's hosted cloud; you do not choose an execution environment. Its ID starts with `ses_`, and all Session paths live under `/v1/agents/sessions`. The Session freezes the Agent version, Skill versions, and MCP connection configuration it started with.

## How Sessions start

- Create one directly with `POST /v1/agents/sessions`. The Session reports `source: "direct"`.
- Invoke a [Service](/agents/services). Each Run creates its own Session with `source: "service"` and `source_id` set to the `svc_` ID.
- Let a [Schedule](/agents/schedules) fire or trigger it manually. Each Run creates its own Session with `source: "schedule"`.

## Run a Session

The native event stream is **live-only**: events are not replayed after a disconnect. Open it before you send input, and read history from items or turns.

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

The same flow with the official OpenAI Python SDK. Open the stream first, send input from another thread, and stop at the terminal turn event. See [OpenAI compatibility](/agents/openai-compatibility) for the Node.js version and the SDK differences.

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

Each send carries exactly one event. `input` is a text string, or an array with exactly one user message that has exactly one `input_text` part: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Any other shape returns `400 invalid_request`. To stop the running turn, send `{"type": "agent.session.input.cancel"}` or call `POST /v1/agents/sessions/{session_id}/cancel` with an `Idempotency-Key`. Cancelling an idle Session still returns `202 {"accepted": true}` and changes nothing. You can also pass a first `input` when you create the Session. `stream: true` on create is not supported.

## Status and failures

| Field | Values | Meaning |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Execution state of the Session |
| `lifecycle_status` | `active`, `archived` | Whether the Session accepts input |
| `failure` | `null` or `{code, message, action, retryable?}` | Public reason for a failure and the suggested next step |

`failure.action` tells you what to do: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account`, or `create_session_with_updated_model_provider`. See the [failure code table](/api-reference/sessions/#status-fields).

Function tools that ask the client for a result (`requires_action`) are not supported yet; reading such a Session returns `502 executor_contract_error`.

If a send returns `409 session_input_pending`, earlier input is still being delivered. Wait and read the Session; do not resend with a new `Idempotency-Key`, or the input could run twice.

## Archive

`DELETE /v1/agents/sessions/{session_id}` archives a Session; Sessions are not hard-deleted. `POST /v1/agents/sessions/{session_id}/archive` and `/unarchive` take `{"row_version": …}`. Archived Sessions keep their history but reject input, metadata updates, and streams.

## Attachments

Upload a file into the Session workspace with `POST /v1/agents/sessions/{session_id}/files` (multipart field `file`, up to 5 MiB, `Idempotency-Key` required). Supported types are `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg`, and `.webp`. When the file's `status` is `ready`, send it with up to nine others:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Reconnecting clients

Browser-style clients that need a consistent view after a dropped connection can call `POST /v1/agents/sessions/{session_id}/reconnect`. It returns the Session and a `stream_url` for `GET /v1/agents/sessions/{session_id}/events/stream`, which sends a `session.snapshot` first and then live events and `heartbeat`. If that stream emits `stream.interrupted`, reconnect again instead of resending input.

## Model credentials

A Session calls models with the API key that created it unless you send `model_provider`. Use `{"type": "custom", "base_url": "https://…", "api_key": "…"}` to run against your own OpenAI-compatible HTTPS endpoint. `model_provider` is write-only.

## IDs

| Prefix | Resource |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `svc_` | Service |
| `sch_` | Schedule |
| `run_` | Service or Schedule Run |
| `skl_` | Skill |
| `mcp_` | MCP connection |
| `sec_` | Secret |
| `fil_` | Session attachment |

Treat IDs as opaque strings.

## Next steps

- [Sessions API reference](/api-reference/sessions/)
- [OpenAI compatibility](/agents/openai-compatibility)
- [Services](/agents/services)
- [Schedules](/agents/schedules)
