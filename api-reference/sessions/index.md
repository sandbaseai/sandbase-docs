---
title: Sessions API
description: Create an Agent Session, send input, and inspect its event history.
---

# Sessions API

A Session is a stateful execution of an [Agent](/api-reference/agents/). You can include the first event in Create Session, then send later events to continue the Session.

::: info Session identity contract
The public `session_id` identifies one persistent Session across Direct Session and Service (Endpoint) entry points. Every Schedule (Deployment) trigger creates a separate `drun_*` DeploymentRun and, when Session creation succeeds, links it to one new Session. Runtime replacement and migration are internal and never change the public Session identity.
:::

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/sessions` | [Create a Session](./create) |
| `GET` | `/v1/sessions` | [List Sessions](./list) |
| `GET` | `/v1/sessions/{session_id}` | [Get a Session](./get) |
| `POST` | `/v1/sessions/{session_id}` | [Update a Session](./update) |
| `DELETE` | `/v1/sessions/{session_id}` | [Delete a Session](./delete) |
| `POST` | `/v1/sessions/{session_id}/events` | [Send events](./send-events) |
| `GET` | `/v1/sessions/{session_id}/events` | [List persisted events](./list-events) |
| `GET` | `/v1/sessions/{session_id}/events/stream` | [Replay events as SSE](./stream) |
| `POST` | `/v1/sessions/{session_id}/archive` | [Archive a Session](./archive) |

## Basic flow

1. Create a Session with an Agent; SandBase resolves its Agent-owned Environment. Optionally pass an authorized `environment_id` override.
2. Include the first `user.message` in `initial_events`, or send it later through the events endpoint.
3. Poll the event list, or replay persisted events through the SSE endpoint.
4. Archive the Session when it should no longer accept new events. History remains readable.

Session updates shallow-merge `metadata`: a null property value removes that key. Agent `tools` and `mcp_servers` overrides are full-array replacements, while the pinned Agent version and Environment remain immutable.

::: warning Recover an uncertain initial delivery
If native runtime delivery returns `502` with a top-level `session_id`, the delivery outcome is unknown. Open that Session and inspect or stream its Events before taking another action. Do not blindly create a new Session and resend the message.
:::

Archive keeps Session history readable and rejects new events with `409 session_archived`. Delete permanently removes the Session and its persisted events.

## Filtering and updates

List Sessions with repeated `statuses` parameters to select one or more of `idle`, `running`, `rescheduling`, or `terminated`. Cursor responses include `next_page` only when another page exists.

The `source` field records how the Session was created: `direct`, `endpoint`, `deployment`, or `store_trial` for a Service store trial.

`POST /v1/sessions/{session_id}` can update the title, metadata, and Session-local `agent.tools` or `agent.mcp_servers` overrides. It never changes the pinned Agent version. Successful deletion returns the deleted Session ID with `type: "session_deleted"`.
