---
title: Credentials API
description: Create and manage private values injected into SandBase Agent runtimes.
---

# Credentials API

Credentials store API keys, tokens, and other private values used by an Agent at runtime. Values are scoped to your organization and are masked after creation.

::: warning Server-side only
Credential endpoints require a secret SandBase API key. Never call them from browser code or expose credential values in prompts, logs, or source control.
:::

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/credentials` | Create a credential. |
| `GET` | `/v1/credentials` | List all credentials in the organization. |
| `GET` | `/v1/credentials/{credential_id}` | Get masked credential metadata. |
| `PATCH` | `/v1/credentials/{credential_id}` | Update `status`, `strategy`, or `weight`. |
| `POST` | `/v1/credentials/{credential_id}/rotate` | Replace the stored secret value. |

Credentials do not currently have a delete endpoint. Set `status` to `disabled` with `PATCH` when a value must no longer be selected. Disabled records remain visible to list and get operations.

## Create a credential

```bash
curl -X POST https://api.sandbase.ai/v1/credentials \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent_01...",
    "scope": "environment",
    "scope_name": "GITHUB_TOKEN",
    "secret_key": "GITHUB_TOKEN",
    "value": "YOUR_SECRET_VALUE"
  }'
```

Credential IDs use the `sec_` prefix. The plaintext `value` is accepted only on creation or rotation. Retrieval and list responses return masked metadata, never the stored plaintext or encrypted payload. Treat `value_hint` as sensitive metadata because it retains a short prefix and suffix. Credential success responses use the standard `{ "code": 0, "data": ..., "message": "ok" }` envelope.

The only supported selection strategy is `round_robin`, and `weight` must be a positive integer.

`scope`, `scope_name`, and `secret_key` are caller-defined identifiers. SandBase trims their surrounding whitespace and rejects control characters. If `group_key` is omitted, it defaults to `scope_name:secret_key`.

## Rotate a credential

```bash
curl -X POST https://api.sandbase.ai/v1/credentials/sec_01.../rotate \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"value":"YOUR_NEW_SECRET_VALUE"}'
```

Rotation replaces the encrypted value and `value_hint`, resets `failure_count` to `0`, and clears `cooldown_until`. Other metadata is preserved.

For product-level guidance, see [API Credentials](/agents/api-credentials).
