---
title: Sessions
description: Understand persistent Agent interactions, events, and the Sessions API.
---

# Sessions

A **Session** is one persistent interaction with an Agent. Its public ID begins with `sess_` and remains stable while accepted messages and subsequent Agent events are appended to its event history.

## How Sessions start

- Create one directly with `POST /v1/sessions`.
- Invoke a [Service](/agents/services) without `session_id`.
- Trigger a [Schedule](/agents/schedules); every successful trigger creates a new Session.

A Service can continue only a Session created by that same Service and still matching its Agent-version binding. A Schedule never reuses a Session.

## Sessions and Schedule runs

A Schedule uses a compatibility resource behind the `/v1/deployments` path. Each manual or cron trigger first creates a separate `drun_*` **DeploymentRun** record. A successful trigger links the record to a newly created `session_id`; a failed trigger has no Session and includes an error. The public DeploymentRun object does not expose a `status` field; status filters on list endpoints select trigger outcomes, not the later Agent execution lifecycle.

## Work with a Session

```bash
# Inspect a Session
curl https://api.sandbase.ai/v1/sessions/sess_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# Send another event
curl -X POST https://api.sandbase.ai/v1/sessions/sess_01.../events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"user.message","content":[{"type":"text","text":"Continue the analysis."}]}]}'

# Replay persisted events over SSE
curl -N https://api.sandbase.ai/v1/sessions/sess_01.../events/stream \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Identity summary

| Resource | ID | Meaning |
|---|---|---|
| Agent | `agent_*` | Versioned workflow definition |
| Service | `ep_*` | Stable callable surface |
| Schedule (compatibility resource) | `depl_*` | Repeatable trigger configuration |
| DeploymentRun | `drun_*` | One Schedule trigger and its Session-creation result |
| Session | `sess_*` | Persistent Agent interaction and event history |

## Next steps

- [Services](/agents/services)
- [Schedules](/agents/schedules)
- [Sessions API](/api-reference/sessions/)
- [Schedule runs API](/api-reference/deployments/list-runs)
