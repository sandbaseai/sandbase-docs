---
title: Agent Catalog
description: Browse public Agents and clone one into your organization.
---
# Agent Catalog

The catalog lists Agents that SandBase publishes for reuse. Catalog entries are read-only. Clone one to get a private Agent in your organization that you can edit, run, and deploy.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v1/agents/catalog` | List public Agents |
| `GET` | `/v1/agents/catalog/{agent_id}` | Get one public Agent, optionally at `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Copy it into your organization |

## List catalog Agents

Cursor pagination with `limit` (1-100), `after`, and `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Each entry has `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at`, and `updated_at`.

## Get a catalog Agent

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` is optional and must be a positive integer. The detail response adds a read-only `configuration` object (name, description, model, instructions, runtime profile, metadata, tools, text, reasoning, and Skills).

## Clone a catalog Agent

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

The body accepts optional `version` (positive integer, defaults to the current public version) and `name` (up to 128 characters). The response is `201 Created` with a full [Agent object](./create) that has a new `agt_` ID in your organization. `Idempotency-Key` is optional; send a stable key so a retry does not create a second copy.

After cloning, [create a Session](/api-reference/sessions/create) to test it, then deploy it as a [Service](/api-reference/services/) or [Schedule](/api-reference/schedules/).
