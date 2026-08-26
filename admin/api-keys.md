---
title: API Keys
description: Create and manage API keys for authenticating with the SandBase API.
---

# API Keys

API keys authenticate your requests to the SandBase API. Each key belongs to an organization and can have an optional spending limit.

## Key Format

New SandBase API keys use the prefix `sk-` followed by 64 hexadecimal characters:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Legacy `sk-sb-...` keys remain valid until they expire or are revoked. Treat the complete key as an opaque secret instead of validating it by prefix or length.

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

API key lifecycle operations are currently performed in the Console. Console network requests are internal and are
not part of the supported public API.
