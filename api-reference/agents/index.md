---
title: Agents API
description: Create and manage versioned Agent definitions.
---

# Agents API

An Agent is a reusable, versioned definition containing a model, instructions, tools, and Skills. Creating or updating an Agent does not run it. Use a [Session](/api-reference/sessions/) for an interactive execution, a [Service backed by an Endpoint](/api-reference/endpoints/) for a stable callable surface, or a [Schedule](/api-reference/deployments/) for recurring work. Schedules are managed through the Deployments API.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/agents` | [Create an Agent](./create) |
| `GET` | `/v1/agents` | [List Agents](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Get an Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Update an Agent](./update) and create a version |
| `POST` | `/v1/agents/{agent_id}/archive` | [Archive an Agent](./archive) |
| `GET` | `/v1/agents/{agent_id}/versions` | [List versions](./versions) |

All endpoints are organization-scoped and require a SandBase API key.

## Lifecycle

1. Create an Agent and save its `id`.
2. Update it with the current `version` to prevent concurrent overwrites.
3. Pin a Session, Endpoint, or Deployment to a version when reproducibility matters.
4. Archive the Agent when it should no longer be used for new Sessions.
