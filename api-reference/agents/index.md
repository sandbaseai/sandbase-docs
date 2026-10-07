---
title: Agents API
description: Create, version, archive, and clone saved Agent configurations.
---
# Agents API

An Agent is a saved, versioned configuration: a model, instructions, a runtime profile, Skills, MCP connections, and output settings. Creating or updating an Agent does not run it. Run it in a [Session](/api-reference/sessions/), deploy a pinned version as a [Service](/api-reference/services/) for on-demand Runs, or as a [Schedule](/api-reference/schedules/) for recurring Runs.

The Agents API follows the OpenAI Agents protocol (`client.beta.agents` in the OpenAI Python SDK). The `OpenAI-Beta` header is optional; when you send it, it must be `agents=v1`. SandBase adds versions, compare-and-set updates, archive and restore, and a public catalog.

## Agent operations

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/agents` | [Create an Agent](./create) at version 1 |
| `GET` | `/v1/agents` | [List Agents](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Get an Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Update an Agent](./update) (SDK-style partial update) |
| `PATCH` | `/v1/agents/{agent_id}` | [Replace with compare-and-set](./replace) on `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Delete](./delete), which archives the Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [Archive an Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Unarchive an Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Restore an earlier version](./restore) as a new version |
| `GET` | `/v1/agents/{agent_id}/versions` | [List versions](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Get one version](./get-version) |
| `GET` | `/v1/agents/catalog` | [Browse the public catalog](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Clone a catalog Agent](./catalog#clone-a-catalog-agent) into your organization |

Agent IDs use the `agt_` prefix. Request bodies are strict JSON up to 1 MiB; unknown fields return 400.

## Versions and updates

- Every effective write (create, update, replace, restore) produces an immutable version. `version` is the current version number.
- `POST /v1/agents/{agent_id}` is the OpenAI SDK update. It needs no `row_version`, so the last writer wins.
- `PATCH /v1/agents/{agent_id}` requires the `row_version` you last read and returns 409 when someone else changed the Agent first. Use it from editors and automation that can run concurrently.
- Services and Schedules pin an Agent version when they are created. New Agent versions do not change them until you update their `agent_version`.
- Each Session freezes the Agent version, Skill versions, and MCP connection configuration it started with.

## Readiness

A newly written version reports `projection_status` while it is prepared for execution. Sessions, Services, and Schedules need an active Agent whose `projection_status` is `ready`; otherwise they return 409. Archived Agents also return 409 for new executions.

## Current limits

- `tools` accepts `function` tools and at most one `web_search` tool. Execution currently requires `web_search.mode` to be `disabled`.
- Function tools can be saved, but Runs that ask the client to return a tool result (`requires_action`) are not supported yet and surface as `502 executor_contract_error`.
- `multi_agent` must be omitted or `null`.

## Pagination

`GET /v1/agents` and the catalog use cursor pagination: `limit` (1-100, default 20), `after`, and `order` (`asc` or `desc`, default `desc`). Responses contain `object: "list"`, `data`, `has_more`, `first_id`, and `last_id`; pass `last_id` as `after` for the next page.

`GET /v1/agents/{agent_id}/versions` uses offset pagination: `limit` and `offset`, with `data`, `total`, `limit`, and `offset` in the response.

## Errors

Errors use the Agents envelope `{"error":{"type","code","param":null,"message"}}`. See [Errors](/api-reference/errors#agents-platform-errors) for the code list.
