---
title: Deployments API
description: Create, manage, trigger, and inspect SandBase Deployments.
---

# Deployments API

A Deployment binds an Agent to repeatable `initial_events`, Runtime Environment settings, timeout policy, and an optional cron schedule. In the product, a Deployment is presented as a **Schedule**.

::: info Deployment execution identity
Every trigger creates a durable `drun_*` DeploymentRun. A successful trigger associates that record with exactly one newly created `sess_*` Session; a failed trigger has no Session. DeploymentRun and Session are separate resources and neither ID substitutes for the other.
:::

## Management endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/deployments` | Create a Deployment. |
| `GET` | `/v1/deployments` | List Deployments. |
| `GET` | `/v1/deployments/{deployment_id}` | Get a Deployment and resolved bindings. |
| `PATCH` or `POST` | `/v1/deployments/{deployment_id}` | Update supported fields. |
| `DELETE` | `/v1/deployments/{deployment_id}` | [Permanently delete](./delete) an eligible Deployment. |
| `POST` | `/v1/deployments/{deployment_id}/pause` | Pause scheduled triggers. |
| `POST` | `/v1/deployments/{deployment_id}/unpause` | Resume scheduled triggers. |
| `POST` | `/v1/deployments/{deployment_id}/archive` | Archive a Deployment. |

## Next steps

- [Create a Deployment](./create)
- [List Deployments](./list)
- [Update a Deployment](./update)
- [Trigger a Deployment](./run)
- [List DeploymentRuns](./list-runs)

## Create example

`name`, `agent_id`, and valid `initial_events` are required. `initial_events` must contain at least one `user.message` event. `environment_id` is optional; omit it to resolve the Agent-owned Environment.

```bash
curl -X POST https://api.sandbase.ai/v1/deployments \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily customer research",
    "agent_id": "agent_01...",
    "environment_id": "env_01...",
    "initial_events": [{
      "type": "user.message",
      "content": [{"type":"text","text":"Prepare the daily customer brief."}]
    }],
    "schedule": {
      "type": "cron",
      "expression": "0 9 * * *",
      "timezone": "Asia/Shanghai"
    }
  }'
```

The schedule object requires `type: "cron"`, a valid cron `expression`, and an IANA `timezone`. Omit `schedule` only when the Deployment will be triggered manually.

## DeploymentRun records

Use `POST /v1/deployments/{deployment_id}/runs` to trigger manually. The request body must be empty or `{}`; input overrides are rejected. The response is a DeploymentRun object with `id`, `type`, `deployment_id`, `agent`, `trigger_context`, nullable `session_id`, nullable `error`, and `created_at`.

List one Deployment's records at `/v1/deployments/{deployment_id}/runs`, or query `/v1/deployment_runs` across Deployments. The global list accepts `trigger_type=manual|schedule`, status filters `pending|succeeded|failed`, `has_error`, Agent/Deployment IDs, time bounds, and cursor pagination. These filters select trigger outcomes; the current public DeploymentRun object does not include a `status` field. A nested get returns `409 deployment_trigger_in_progress` while the record is pending.

Updates support `name`, `initial_events`, `schedule`, `timeout_policy`, `expected_version`, `agent_binding`, `agent_config`, and `notification_settings`. Changing the Agent binding requires a paused Deployment and the current `expected_version` when applicable.
