---
title: Environments API
description: Configure the high-level runtime environment and credential bindings used by SandBase Agents.
---

# Environments API

An Environment is the versioned runtime configuration bound to an Agent or Service. It stores metadata, runtime configuration, and references to Credentials without exposing their plaintext values.

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

## Create an Environment

```bash
curl -X POST https://api.sandbase.ai/v1/environments \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "research-runtime",
    "config": {"type":"cloud"},
    "scope": "organization",
    "metadata": {"team":"research"}
  }'
```

## Bind Credentials

Credential bindings reference an existing Credential and the environment-variable target exposed to the Agent runtime:

```json
{
  "credential_bindings": [
    {
      "credential_id": "cred_01...",
      "purpose": "GitHub API access",
      "target": "GITHUB_TOKEN"
    }
  ]
}
```

Targets must use uppercase environment-variable syntax. Credential plaintext is never returned by the Environment API. See [Credentials API](/api-reference/credentials/).
