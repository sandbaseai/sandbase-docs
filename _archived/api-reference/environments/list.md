---
title: List Environments
description: List environments for your organization with cursor pagination.
---

# List Environments

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/v1/environments</code>
</div>

List environments owned by your organization, ordered most-recently-created first. Returns a page of [Environment objects](/api-reference/environments/create#environment-object) with an opaque cursor for the next page.

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | ❌ | Page size. Default 20, max 100. |
| `page` | string | ❌ | Opaque cursor from a previous response's `next_page`. |
| `include_archived` | boolean | ❌ | Include archived environments. Default `false`. |

## Request Examples

::: code-group

```python [Python]
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-YOUR_KEY",
    base_url="https://api.sandbase.ai"
)

page = client.beta.environments.list(limit=20)
for env in page.data:
    print(f"{env.id} — {env.name}")
```

```bash [cURL]
curl "https://api.sandbase.ai/v1/environments?limit=20" \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

:::

## Response

```json
{
  "data": [
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
  ],
  "next_page": "page_eyJjIjoiMjAyNi0wNS0yOVQxMDowMDowMFoiLCJpIjoiZW52XzAxMSJ9"
}
```

### Pagination

Results are ordered by `created_at` descending (ties broken by `id`). When more results exist, the response includes a `next_page` cursor; pass it back as the `page` parameter. When `next_page` is absent, you've reached the last page.

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Invalid page cursor |
| 401 | `authentication_error` | Invalid or missing API key |
