---
title: Platform API Reference
description: SandBase Platform API reference for Agents, Sessions, Endpoints, Deployments, Skills, credentials, and account resources.
---

# Platform API Reference

Use the API when you need code-level control.

The Agent execution APIs use four related resources:

1. define versioned **Agents**
2. create stateful **Sessions** and exchange events
3. expose Agents through callable **Endpoints**
4. create a **Schedule** through the Deployments API and inspect DeploymentRuns and linked Sessions

## Common APIs

| Area | Use it for | Start here |
|---|---|---|
| **Account** | Inspect organization balance and recent API execution history | [Account API](/api-reference/account/) |
| **Agents** | Create and version reusable Agent definitions | [Agents API](/api-reference/agents/) |
| **Sessions** | Run an Agent statefully and exchange events | [Sessions API](/api-reference/sessions/) |
| **Endpoints** | Publish and invoke an Agent over REST | [Endpoints API](/api-reference/endpoints/) |
| **Deployments** | Schedule or manually trigger repeatable Agent work | [Deployments API](/api-reference/deployments/) |
| **DeploymentRuns** | Inspect each Deployment trigger and its nullable Session result | [DeploymentRuns](/api-reference/deployments/list-runs) |
| **Skills** | Create and manage reusable Agent instruction bundles | [Skills API](/api-reference/skills/) |

## Authentication

Most API requests use a SandBase API key:

```http
Authorization: Bearer sk-YOUR_KEY
```

Some Anthropic-compatible clients use:

```http
x-api-key: sk-YOUR_KEY
```

Learn more: [Authentication](/api-reference/authentication).

## Resource relationships

- An **Agent** is configuration and does not execute by itself.
- A **Session** is a stateful Agent execution. Input and output are persisted as Session events.
- A **Service** is backed by an Endpoint resource. Calling `POST /v1/endpoints/{id}/run` creates or continues a Session.
- A **Schedule** is managed through a Deployment resource and stores repeatable input with an optional cron expression. Every trigger creates a `drun_*` DeploymentRun and, on success, a new linked Session.

## Next steps

- [Getting Started](/getting-started/)
- [Store](/store/)
- [Setup](/setup/)
- [Build Agent](/agents/)
