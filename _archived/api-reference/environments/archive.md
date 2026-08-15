---
title: Archive Environment
description: Archive an environment so it can no longer be used for new sessions.
---

# Archive Environment

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v1/environments/{environment_id}/archive</code>
</div>

Archive an environment. Archived environments cannot be used to create new sessions, but existing sessions continue running. Use [Delete](/api-reference/environments/delete) for permanent removal.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `environment_id` | string | ✅ | The environment ID (`env_...`) |

## Request Examples

::: code-group

```python [Python]
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-YOUR_KEY",
    base_url="https://api.sandbase.ai"
)

env = client.beta.environments.archive(
    environment_id="env_011CZkZ9X2dpNyB7HsEFoRfW"
)
print(env.archived_at)
```

```bash [cURL]
curl -X POST https://api.sandbase.ai/v1/environments/env_011CZkZ9X2dpNyB7HsEFoRfW/archive \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

:::

## Response

Returns the [Environment object](/api-reference/environments/create#environment-object) with `archived_at` set.

```json
{
  "id": "env_011CZkZ9X2dpNyB7HsEFoRfW",
  "type": "environment",
  "name": "python-data-analysis",
  "description": "Python environment with data-analysis packages.",
  "config": {
    "type": "cloud",
    "networking": { "type": "unrestricted" },
    "packages": {
      "type": "packages",
      "apt": [], "cargo": [], "gem": [], "go": [], "npm": [],
      "pip": ["pandas", "numpy"]
    }
  },
  "metadata": {},
  "archived_at": "2026-05-29T12:00:00Z",
  "created_at": "2026-05-29T10:00:00Z",
  "updated_at": "2026-05-29T12:00:00Z"
}
```

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 401 | `authentication_error` | Invalid or missing API key |
| 404 | `not_found` | Environment not found |
