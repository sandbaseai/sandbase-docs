---
title: Get Environment
description: Retrieve a specific environment by ID.
---

# Get Environment

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/v1/environments/{environment_id}</code>
</div>

Retrieve a specific environment by ID.

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

env = client.beta.environments.retrieve(
    environment_id="env_011CZkZ9X2dpNyB7HsEFoRfW"
)
print(env.name)
```

```bash [cURL]
curl https://api.sandbase.ai/v1/environments/env_011CZkZ9X2dpNyB7HsEFoRfW \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

:::

## Response

Returns an [Environment object](/api-reference/environments/create#environment-object).

```json
{
  "id": "env_011CZkZ9X2dpNyB7HsEFoRfW",
  "type": "environment",
  "name": "python-data-analysis",
  "description": "Python environment with data-analysis packages.",
  "config": {
    "type": "cloud",
    "networking": {
      "type": "limited",
      "allowed_hosts": ["api.example.com"],
      "allow_mcp_servers": false,
      "allow_package_managers": true
    },
    "packages": {
      "type": "packages",
      "apt": [], "cargo": [], "gem": [], "go": [], "npm": [],
      "pip": ["pandas", "numpy"]
    }
  },
  "metadata": {},
  "archived_at": null,
  "created_at": "2026-05-29T10:00:00Z",
  "updated_at": "2026-05-29T10:00:00Z"
}
```

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 401 | `authentication_error` | Invalid or missing API key |
| 404 | `not_found` | Environment not found |
