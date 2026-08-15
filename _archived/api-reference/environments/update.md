---
title: Update Environment
description: Update an existing environment's configuration.
---

# Update Environment

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v1/environments/{environment_id}</code>
</div>

Update an environment. Omitted fields preserve their existing values.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `environment_id` | string | ✅ | The environment ID (`env_...`) |

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | ❌ | Updated name. Omit to preserve. |
| `description` | string | ❌ | Updated description. Omit to preserve. |
| `config` | object | ❌ | Updated configuration. Omitted nested fields preserve their existing values. |
| `metadata` | object | ❌ | Metadata patch. Set a key to `null` or empty string to delete it. Omit to preserve. |

::: tip Field preservation
Within `config`, omitted fields preserve the existing value. For example, sending only `networking` leaves `packages` unchanged. To clear a package list, send an empty array for that manager.
:::

## Request Examples

::: code-group

```python [Python]
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-YOUR_KEY",
    base_url="https://api.sandbase.ai"
)

env = client.beta.environments.update(
    environment_id="env_011CZkZ9X2dpNyB7HsEFoRfW",
    config={
        "type": "cloud",
        "packages": { "type": "packages", "pip": ["pandas", "numpy", "scikit-learn"] }
    }
)
print(env.updated_at)
```

```bash [cURL]
curl -X POST https://api.sandbase.ai/v1/environments/env_011CZkZ9X2dpNyB7HsEFoRfW \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "type": "cloud",
      "packages": { "type": "packages", "pip": ["pandas", "numpy", "scikit-learn"] }
    }
  }'
```

:::

## Response

Returns the updated [Environment object](/api-reference/environments/create#environment-object).

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
      "pip": ["pandas", "numpy", "scikit-learn"]
    }
  },
  "metadata": {},
  "archived_at": null,
  "created_at": "2026-05-29T10:00:00Z",
  "updated_at": "2026-05-29T11:00:00Z"
}
```

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Invalid config or field values |
| 401 | `authentication_error` | Invalid or missing API key |
| 404 | `not_found` | Environment not found |
