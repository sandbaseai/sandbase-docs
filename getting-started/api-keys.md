---
title: API keys
description: How to create, manage, and secure your SandBase API keys for authenticating API requests.
---

# API keys

API keys authenticate your requests to SandBase. This guide covers how to create keys, use them in requests, and keep them secure.

## Creating an API Key

1. Log in to the [SandBase Console](https://www.sandbase.ai/console)
2. Navigate to **API Keys** in the sidebar (or go to [console/keys](https://www.sandbase.ai/console/keys) directly)
3. Click **Create API Key**
4. Enter a descriptive name (e.g., "Production Server", "Local Development")
5. Click **Create**
6. Copy the key immediately — it will only be displayed once

::: danger Important
Your API key is shown only once at creation time. If you lose it, you'll need to create a new one. Store it securely before closing the dialog.
:::

## Key format

New API keys created in the Console use the `sk-` prefix followed by 64 hexadecimal characters:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Existing `sk-sb-...` keys remain valid until they expire or are revoked. Do not use the prefix alone to validate a
credential; always treat the complete value as an opaque secret.

## Authentication Methods

SandBase supports two ways to pass your API key in requests:

### Authorization Header (Recommended)

Use the standard `Authorization: Bearer` header. This is compatible with the OpenAI and Anthropic SDKs:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v3", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: x-api-key header

`POST /v1/messages` also accepts the native Anthropic `x-api-key` header:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-4-20250514", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Only `POST /v1/messages` reads `x-api-key`, and it takes priority when both supported headers are present. Use the
Bearer header for every other public endpoint.
:::

## Key Permissions

SandBase API keys are scoped at the **organization level**:

- A standard key can call public API resources available to the organization
- Usage is billed to the organization that owns the key
- A key can have an optional expiration and spending limit
- SandBase-issued credentials can be restricted to a specific scope; a scoped credential returns `403` outside that scope

Treat each key as an application credential rather than a personal password. Use organization membership for human access and API keys for workloads.

## Environment strategy

Create a different key for every application and environment:

| Key | Example name | Why |
|---|---|---|
| Local development | `research-app-dev` | Rotate without interrupting production |
| Staging | `research-app-staging` | Isolate test usage and incidents |
| Production | `research-app-production` | Give production a clear owner and limited exposure |
| Temporary automation | `release-check-2026-08` | Set an expiration and revoke independently |

Record the owner and deployment that consumes each key. During rotation, deploy the new key, verify successful requests, and only then revoke the old key.

## Key Expiration and Revocation

### Expiration

When creating a key, you can optionally set an expiration date. Once expired, the key will stop working and requests will return a `401 Unauthorized` error.

Keys without an expiration date remain valid until manually revoked.

### Revoking a Key

To revoke (disable) a key:

1. Go to [Console → API Keys](https://www.sandbase.ai/console/keys)
2. Find the key you want to revoke
3. Click the **Revoke** button
4. Confirm the action

Revoked keys cannot authenticate new requests. Revocation cannot be undone — create a new key if you revoke one by mistake.

## Security Best Practices

### Never commit keys to version control

Use environment variables or a secrets manager instead:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Use separate keys for different environments

Create distinct keys for development, staging, and production. This way you can revoke a compromised development key without affecting production.

### Rotate keys regularly

Periodically create new keys and retire old ones. This limits the window of exposure if a key is leaked.

### Monitor activity

Check **Console → Activities** regularly for unexpected request or usage spikes, which could indicate a compromised key.

If a key is exposed, revoke it immediately, create a replacement, update the consuming application, and inspect Activities and billing for unexpected usage. Do not wait for a scheduled rotation.

### Set expiration dates

For temporary access (CI/CD pipelines, contractor access, demos), set an expiration date so the key automatically stops working.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `401 - missing API key` | No key provided in request | Add an `Authorization: Bearer <key>` header |
| `401 - invalid API key` | Key doesn't exist | Check for typos and ensure the full key is included |
| `401 - API key has been revoked` | Key was disabled in the console | Create a new key |
| `401 - API key has expired` | Key passed its expiration date | Create a new key or extend expiration |
| `402 - API key spending limit exceeded` | Key reached its configured spending limit | Raise the limit or use another authorized key |
| `403 - insufficient_scope` | A scoped credential cannot call this endpoint | Use a key authorized for the endpoint |

## Next Steps

- [**First API Call**](/getting-started/first-call) — Make a detailed API call with full request/response walkthrough
- [**API Reference**](/api-reference/) — Complete endpoint documentation
