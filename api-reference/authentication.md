---
title: API Authentication
description: Authenticate SandBase APIs with Bearer tokens and supported protocol-compatible API key headers.
---

# Authentication

SandBase uses API keys to authenticate public API requests. This page covers the supported integration methods and
key-management practices. Console authentication and its internal APIs are not part of the public API contract.

## Authentication Methods

Standard SandBase `/v1/*` endpoints require a Bearer token. Anthropic Messages and Google Gemini-compatible operations also accept their native SDK-compatible API key locations.

### Bearer token

Include the key in the `Authorization` header:

```http
Authorization: Bearer sk-your-api-key
```

This is the standard method used by OpenAI-compatible SDKs.

### Anthropic Messages: x-api-key header

Include the key in the `x-api-key` header:

```http
x-api-key: sk-your-api-key
```

This header is supported only by `POST /v1/messages`. Other public endpoints do not extract it; use Bearer
authentication for Chat Completions, `/v1/run`, and resource APIs.

### Priority

For `POST /v1/messages` only, `x-api-key` takes priority when both headers are present.

### Google Gemini-compatible API keys

Gemini GenerateContent and Interactions operations accept `x-goog-api-key`, `Authorization: Bearer …`, or the `key` query parameter, in that priority order. Prefer a header because query-string credentials can appear in logs and browser history. See [Google Gemini](/api-reference/gemini-generate-content) and [Gemini Interactions](/api-reference/gemini-interactions) for the supported paths.

### Extraction Logic

Standard endpoints read `Authorization: Bearer <key>` only. The Anthropic Messages middleware reads `x-api-key`
first and then falls back to the Bearer header. A missing supported credential returns `401 Unauthorized`.

## API key format

New Console-created API keys have this format:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Component | Description |
|-----------|-------------|
| `sk-` | Standard "secret key" prefix |
| `xxxx...` | 64 hexadecimal characters generated from 32 random bytes |

Legacy `sk-sb-...` keys remain usable until they expire or are revoked. Clients should treat keys as opaque strings
instead of rejecting a credential based on its prefix or length.

::: warning
Never expose your API key in client-side code, public repositories, or logs. Treat it like a password.
:::

## Create API keys

### Via Console

1. Log in to the [SandBase Console](https://www.sandbase.ai/console)
2. Open **Developer → API Keys**
3. Click **New key**
4. Give the key a descriptive name (e.g., "Production Backend", "Development")
5. Copy the key immediately — it won't be shown again

### Key Properties

| Property | Description |
|----------|-------------|
| Name | Human-readable label for identification |
| Organization | The org this key belongs to |
| Enabled | Whether the key is active |
| Spending Limit | Optional per-key spending cap |
| Expires At | Optional expiration date |
| Created At | When the key was created |

Standard Console-created keys use organization-level access to the documented public API. SandBase-issued credentials, such as CLI Login keys, can carry a restricted scope. The Console does not expose user-selected scopes for standard keys.

## Key lifecycle

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

Revoked keys cannot authenticate new requests. The API returns `401 Unauthorized` with the message:

```json
{"error":"API key has been revoked"}
```

### Expiration

Keys can optionally have an expiration date. Expired keys return `401 Unauthorized` with the message:

```json
{"error":"API key has expired"}
```

## Endpoint Authentication Requirements

| Endpoint | Auth Method | Description |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API Key (Bearer) | Chat Completions |
| `POST /v1/responses` | API Key (Bearer) | OpenAI-compatible Responses API |
| `POST /v1/messages` | API Key (Bearer or x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API Key (x-goog-api-key, Bearer, or query key) | Gemini GenerateContent |
| `/v1beta/interactions*` | API Key (x-goog-api-key, Bearer, or query key) | Gemini Interactions |

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
| 402 or protocol-specific 403 | `API key spending limit exceeded` | Key-level spending limit reached; inspect the endpoint's documented error contract |
| 403 | `insufficient_scope` | Scoped key is not authorized for this endpoint |

## Security Best Practices

### Do

- **Store keys in environment variables** — Never hardcode keys in source code
- **Use separate keys per environment** — Different keys for dev, staging, production
- **Set expiration dates** — Choose a rotation interval appropriate for your security policy
- **Monitor usage** — Check the Console for unexpected activity
- **Use standard keys only for workloads that need public API access** — Keep scoped CLI Login credentials in their managed flow

### Don't

- **Don't commit keys to version control** — Add `.env` to `.gitignore`
- **Don't share one key across unrelated applications** — Separate keys make rotation and incident response safer
- **Don't expose keys in client-side code** — Always proxy through your backend
- **Don't log API keys** — Redact keys in application logs

### Environment Variable Example

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
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
