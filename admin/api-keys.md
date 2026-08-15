---
title: API Keys
description: Create and manage API keys for authenticating with the SandBase API.
---

# API Keys

API keys authenticate your requests to the SandBase API. Each key belongs to an organization and can have an optional spending limit.

## Key Format

SandBase API keys use the prefix `sk-sb-`:

```
sk-sb-abc123def456...
```

## Create a Key

1. Go to [Console → API Keys](https://www.sandbase.ai/console/keys)
2. Click **Create API Key**
3. Name your key (e.g., "Production", "Development")
4. Optionally set a spending limit
5. Copy the key — it won't be shown again

## Key Properties

| Property | Description |
|----------|-------------|
| Name | Human-readable label |
| Spending Limit | Maximum USD this key can spend (optional, capped by org balance) |

::: info
A key grants access to **all models** available to the organization. There is no per-model or per-endpoint restriction on individual keys — scope and access are managed at the organization level. The only per-key control is an optional spending limit.
:::

## Security Best Practices

- Never commit keys to version control
- Use environment variables: `SANDBASE_API_KEY`
- Create separate keys for development and production
- Set spending limits on development keys
- Revoke keys immediately if compromised

## Revoke a Key

Revoking a key is permanent and cannot be undone. All requests using the revoked key will immediately return 401.

1. Go to Console → API Keys
2. Click the delete icon next to the key
3. Confirm revocation

## API

- [Create Key](/api-reference/) — `POST /default/v1/keys`
- [List Keys](/api-reference/) — `GET /default/v1/keys`
- [Revoke Key](/api-reference/) — `DELETE /default/v1/keys/:id`
