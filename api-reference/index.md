---
title: API Reference
description: Call SandBase models and manage Agents, Sessions, Skills, MCP connections, Secrets, and account resources.
---

# API Reference

Use the API to call models directly, or to define reusable Agents, run them in Sessions, and connect them to Skills and MCP tools.

::: tip Looking for model inference?
The inference contracts (Chat Completions, Responses, Anthropic Messages, Gemini, Images, and Seedance video) are in the **Model inference** section of this reference. Each model's own fields and pricing are on its page in the [Models catalog](https://www.sandbase.ai/models).
:::

## Choose a starting point

| Goal | Start with | What happens next |
|---|---|---|
| Define reusable behavior | [Agents](/api-reference/agents/) | Create and version an Agent configuration |
| Run an Agent directly | [Sessions](/api-reference/sessions/) | Send input, stream events, and read history |
| Reuse instruction bundles | [Skills](/api-reference/skills/) | Upload versioned ZIP bundles and attach them to Agents |
| Call external tools | [MCP Connections](/api-reference/mcp-connections/) | Register remote HTTPS MCP servers for Agents |
| Authenticate external tools | [Secrets](/agents/api-credentials#with-the-api) | Store write-only Bearer tokens for MCP connections |

## Resource lifecycle

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- An **Agent** (`agt_`) is a saved, versioned configuration; creating one does not execute it.
- A **Session** (`ses_`) runs one Agent version and freezes its Skills and MCP connections. Session paths live under `/v1/agents/sessions`.
- A **Skill** (`skl_`) is a versioned instruction bundle. An **MCP connection** (`mcp_`) registers a remote tool server, and a **Secret** (`sec_`) stores its Bearer token.

## Conventions for Agents platform resources

Agents, Sessions, Skills, MCP connections, and Secrets are served under `https://api.sandbase.ai/v1` and share these rules:

- Authenticate with `Authorization: Bearer` or `X-API-Key`. See [Authentication](/api-reference/authentication#agents-platform-resources).
- Request bodies are strict JSON up to 1 MiB; unknown fields return 400.
- Writes that create MCP connections or Secrets require an `Idempotency-Key`. Other writes accept one.
- Optimistic concurrency uses `row_version`: send the value you last read, and handle 409 by reading again.
- Agents, Sessions, items, turns, and Skills use cursor pagination (`limit`, `after`, `order`; responses have `has_more` and `last_id`). Agent versions, attachments, MCP connections, and Secrets use offset pagination (`limit`, `offset`; responses have `total`).
- Errors use `{"error": {"type", "code", "param", "message"}}`. See [Agents platform errors](/api-reference/errors#agents-platform-errors).

## Authentication

Send a SandBase API key as a Bearer token:

```http
Authorization: Bearer sk-YOUR_KEY
```

Treat the key as an opaque secret, keep it on the server, and never include it in browser code or logs. See [Authentication](/api-reference/authentication) for compatibility details and [Errors](/api-reference/errors) for public error envelopes.

## Organization and usage

Platform resources belong to the organization associated with the API key. Use the [Account API](/api-reference/account/) to inspect the supported balance and recent execution-history views. Organization administration and billing management remain Console workflows unless a public endpoint is documented here.

## Reference formats

- Browse operations from the sidebar for examples and response details.
- Download the machine-readable [OpenAPI specification](/openapi.yaml).
- Open a model's page in the [Models catalog](https://www.sandbase.ai/models) or an API's page in the [APIs catalog](https://www.sandbase.ai/apis) for its exact request fields.

## Next steps

- New to managed Agents: [Build Agent](/agents/)
- Call a model directly: [Chat Completions](/api-reference/llm-gateway) or the [Models catalog](https://www.sandbase.ai/models)
