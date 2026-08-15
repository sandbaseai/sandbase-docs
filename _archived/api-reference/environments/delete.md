---
title: Delete Environment
description: Permanently delete an environment by ID.
---

# Delete Environment

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#ef4444;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">DELETE</span>
  <code>/v1/environments/{environment_id}</code>
</div>

Permanently delete an environment by ID. Returns a confirmation of the deletion.

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

result = client.beta.environments.delete(
    environment_id="env_011CZkZ9X2dpNyB7HsEFoRfW"
)
print(result.id)    # "env_011CZkZ9X2dpNyB7HsEFoRfW"
print(result.type)  # "environment_deleted"
```

```bash [cURL]
curl -X DELETE https://api.sandbase.ai/v1/environments/env_011CZkZ9X2dpNyB7HsEFoRfW \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

:::

## Response

```json
{
  "id": "env_011CZkZ9X2dpNyB7HsEFoRfW",
  "type": "environment_deleted"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The deleted environment ID |
| `type` | string | Always `"environment_deleted"` |

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 401 | `authentication_error` | Invalid or missing API key |
| 404 | `not_found` | Environment not found |
| 409 | `conflict` | Environment is in use by active sessions |
