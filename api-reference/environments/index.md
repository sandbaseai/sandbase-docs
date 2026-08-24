---
title: Environments API
description: Configure the high-level runtime environment and credential bindings used by SandBase Agents.
---

# Environments API

An Environment is a mutable, non-versioned runtime configuration used by an Agent or Service. Updates modify the resource in place. It stores metadata, runtime configuration, and references to Credentials without exposing their plaintext values.

::: info Resource boundary
The public Environment API manages configuration resources only. It does not expose lower-level runtime instances, process execution, filesystems, pause/resume controls, or sandbox lifecycle APIs.
:::

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/environments` | Create an Environment. |
| `GET` | `/v1/environments` | List Environments with cursor pagination. |
| `GET` | `/v1/environments/{environment_id}` | Retrieve one Environment. |
| `PATCH` | `/v1/environments/{environment_id}` | Update configuration, metadata, or credential bindings. |
| `DELETE` | `/v1/environments/{environment_id}` | Delete an Environment when allowed. |
| `POST` | `/v1/environments/{environment_id}/archive` | Archive an Environment while preserving its record. |

`POST /v1/environments/{environment_id}` is retained as a compatibility alias for `PATCH`. New integrations should use `PATCH`.

Lists are ordered newest first. Use the opaque `next_page` value as the next request's `page` parameter. `include_archived=true` includes archived records; other values behave as false. Invalid cursors return `400`, while limits above 100 are clamped to 100.

Deletion returns `{ "id": "env_...", "type": "environment_deleted" }`. It returns `409 Conflict` for a managed
Environment or one referenced by active Sessions; archive an Environment when its record should be retained.

Updates are partial and in place. `{}` is accepted as a no-op. A JSON `null` for `name` or `description` preserves the current value, while `metadata: null` or `credential_bindings: null` clears that field. Archived Environments return `403`; managed Environments and Agent-owned runtime changes return `409`.

## Create an Environment

```bash
curl -X POST https://api.sandbase.ai/v1/environments \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "research-runtime",
    "config": {"type":"cloud"},
    "metadata": {"team":"research"}
  }'
```

## Bind Credentials

Credential bindings reference an existing Credential and the environment-variable target exposed to the Agent runtime:

```json
{
  "credential_bindings": [
    {
      "credential_id": "sec_01...",
      "purpose": "GitHub API access",
      "target": "GITHUB_TOKEN"
    }
  ]
}
```

Targets must be unique, use uppercase environment-variable syntax, and must not begin with `SANDBASE_`. Each Credential must be active and belong to the caller's organization; otherwise creation or update returns `422`. Credential plaintext is never returned by the Environment API. See [Credentials API](/api-reference/credentials/).
