---
title: Platform API Reference
description: Manage SandBase Agents, Sessions, Services, Schedules, Skills, credentials, and account resources.
---

# Platform API Reference

Use the Platform API to define reusable Agents, run stateful work, publish callable services, and schedule repeatable execution.

::: tip Looking for model inference?
Chat, image, video, audio, embedding, and model-specific request schemas live in the [Model API Reference](/model-api-reference/). The Platform API covers managed Agent resources and operations.
:::

## Choose a starting point

| Goal | Start with | What happens next |
|---|---|---|
| Define reusable behavior | [Agents](/api-reference/agents/) | Create and version an Agent configuration |
| Run stateful work directly | [Sessions](/api-reference/sessions/) | Exchange persisted input, output, and tool events |
| Expose an Agent to an application | [Services](/api-reference/endpoints/) | Invoke a stable REST, MCP, or ACP Service that creates or continues a Session |
| Run work later or repeatedly | [Schedules](/api-reference/deployments/) | Trigger a Schedule run and inspect its linked Session |
| Reuse instruction bundles | [Skills](/api-reference/skills/) | Create and attach versioned Skills to Agents |
| Supply private integration values | [Credentials](/api-reference/credentials/) | Keep secrets out of Agent instructions and request bodies |

## Resource lifecycle

```text
Agent + version
├── direct execution ────────────────→ Session ─→ events
├── Service (API path: endpoints) ───→ Session ─→ events
└── Schedule (API resource: Deployment) → DeploymentRun ─→ Session ─→ events
```

- An **Agent** is reusable configuration; creating one does not execute it.
- A **Session** is the durable execution and event history for one interaction.
- A **Service** publishes an Agent behind a stable invocation surface. Calling it creates a new Session or continues an authorized existing Session. Its API path remains `/v1/endpoints` for compatibility.
- A **Schedule** stores repeatable input and optional cron configuration. Its API resource remains `Deployment` at `/v1/deployments` for compatibility. Every trigger creates a distinct `DeploymentRun` and, after successful Session creation, links that run to a Session.
- A **Skill** packages reusable instructions and supporting files. A **Credential** stores a private value required by an Agent capability.

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
- Use the [Model API Reference](/model-api-reference/) for inference endpoints and model-specific schemas.

## Next steps

- New to managed Agents: [Build Agent](/agents/)
- Publish an application service: [Services guide](/agents/services)
- Schedule repeatable work: [Schedules guide](/agents/schedules)
- Call a model directly: [Model API Reference](/model-api-reference/)
