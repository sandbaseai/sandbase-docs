---
title: Authentication
description: Authenticate public SandBase API requests with Bearer tokens or the x-api-key header.
---

# Authentication

SandBase uses API keys to authenticate public API requests. This page covers the supported integration methods and
key-management practices. Console authentication and its internal APIs are not part of the public API contract.

## Authentication Methods

SandBase supports two methods for passing your API key:

### Method 1: Bearer Token

Include the key in the `Authorization` header:

```http
Authorization: Bearer sk-sb-your-api-key
```

This is the standard method used by OpenAI-compatible SDKs.

### Method 2: x-api-key Header

Include the key in the `x-api-key` header:

```http
x-api-key: sk-sb-your-api-key
```

This is the method used by Anthropic-compatible SDKs.

### Priority

When both headers are present, `x-api-key` takes priority. This allows the Anthropic SDK (which sends `x-api-key`) to work correctly even if a proxy adds a `Bearer` token.

### Extraction Logic

The API key is extracted from the request in this order:

1. `x-api-key` header (if present)
2. `Authorization: Bearer <key>` header
3. If neither is found → `401 Unauthorized`

## API Key Format

SandBase API keys follow a consistent format:

```
sk-sb-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Component | Description |
|-----------|-------------|
| `sk-` | Standard "secret key" prefix |
| `sb-` | SandBase identifier |
| `xxxx...` | 32+ character random string |

::: warning
Never expose your API key in client-side code, public repositories, or logs. Treat it like a password.
:::

## Creating API Keys

### Via Console

1. Log in to the [SandBase Console](https://www.sandbase.ai/console)
2. Navigate to **Settings → API Keys**
3. Click **Create New Key**
4. Give the key a descriptive name (e.g., "Production Backend", "Development")
5. Copy the key immediately — it won't be shown again

### Key Properties

| Property | Description |
|----------|-------------|
| Name | Human-readable label for identification |
| Key Hash | Stored hash (the plaintext key is never stored) |
| Organization | The org this key belongs to |
| Enabled | Whether the key is active |
| Expires At | Optional expiration date |
| Created At | When the key was created |

## Key Lifecycle

### Rotation

To rotate a key:

1. Create a new key in the Console
2. Update your application to use the new key
3. Verify the new key works in production
4. Revoke the old key

::: tip
Always create the new key before revoking the old one to avoid downtime.
:::

### Revocation

Revoked keys immediately stop working. Any request using a revoked key receives:

```json
{
  "code": 401,
  "message": "API key has been revoked"
}
```

### Expiration

Keys can optionally have an expiration date. Expired keys return:

```json
{
  "code": 401,
  "message": "API key has expired"
}
```

## Endpoint Authentication Requirements

| Endpoint | Auth Method | Description |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API Key (Bearer or x-api-key) | LLM Gateway |
| `POST /v1/embeddings` | API Key (Bearer or x-api-key) | Text embeddings |
| `POST /v1/messages` | API Key (Bearer or x-api-key) | Anthropic Messages |

The SandBase Console uses a separate browser authentication flow. Its internal requests are not supported public
endpoints and must not be used by integrations.

## Organization Isolation

API keys are scoped to an organization. When you authenticate with a key:

- You can only access resources belonging to your organization
- Usage and billing are tracked per organization

## Error Responses

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | No key provided |
| 401 | `invalid API key` | Key not found in database |
| 401 | `API key has been revoked` | Key was disabled |
| 401 | `API key has expired` | Key past expiration date |

## Security Best Practices

### Do

- **Store keys in environment variables** — Never hardcode keys in source code
- **Use separate keys per environment** — Different keys for dev, staging, production
- **Set expiration dates** — Rotate keys periodically (every 90 days recommended)
- **Monitor usage** — Check the Console for unexpected activity
- **Use the minimum scope needed** — Create keys with appropriate permissions

### Don't

- **Don't commit keys to version control** — Add `.env` to `.gitignore`
- **Don't share keys between team members** — Each developer should have their own key
- **Don't expose keys in client-side code** — Always proxy through your backend
- **Don't log API keys** — Redact keys in application logs

### Environment Variable Example

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-sb-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Rate Limiting by Key

An API key may have an optional per-key RPM cap. Every request is also subject to the current platform-wide RPM
protection, so creating more keys does not bypass the global limit. The API does not publish a universal numeric
default or remaining-quota headers.

See [Rate Limiting](/guides/rate-limiting) for details on limits and handling 429 responses.
