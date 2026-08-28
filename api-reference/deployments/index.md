---
title: Schedules API
description: Create, manage, trigger, and inspect SandBase Schedules through the compatibility /v1/deployments resource.
---

# Schedules API

A **Schedule** binds an Agent to repeatable `initial_events`, runtime settings, timeout policy, and an optional cron expression. For API compatibility, Schedule resources use the `/v1/deployments` path, `depl_*` IDs, and `Deployment` schema name.

::: info Schedule execution identity
Every trigger creates a durable `drun_*` `DeploymentRun`. A successful trigger associates that record with exactly one newly created `sess_*` Session; a failed trigger has no Session. `DeploymentRun` and Session are separate resources and neither ID substitutes for the other.
:::

## Schedule operations

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/deployments` | Create a Schedule (`Deployment`). |
| `GET` | `/v1/deployments` | List Schedules. |
| `GET` | `/v1/deployments/{deployment_id}` | Get a Schedule and resolved bindings. |
| `PATCH` or `POST` | `/v1/deployments/{deployment_id}` | Update supported fields. |
| `DELETE` | `/v1/deployments/{deployment_id}` | [Permanently delete](./delete) an eligible Schedule. |
| `POST` | `/v1/deployments/{deployment_id}/pause` | Pause scheduled triggers. |
| `POST` | `/v1/deployments/{deployment_id}/unpause` | Resume scheduled triggers. |
| `POST` | `/v1/deployments/{deployment_id}/archive` | Archive a Schedule. |
| `POST` | `/v1/deployments/{deployment_id}/notifications/feishu/test` | Test the saved Feishu notification target. |

## Next steps

- [Create a Schedule](./create)
- [List Schedules](./list)
- [Update a Schedule](./update)
- [Trigger a Schedule](./run)
- [List runs for one Schedule](./list-runs)
- [List runs across all Schedules](./list-all-runs)

## Create example

`name`, `agent_id`, and valid `initial_events` are required. `initial_events` must contain at least one `user.message` event. Runtime binding is resolved by SandBase and is not a public request field.

```bash
curl -X POST https://api.sandbase.ai/v1/deployments \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily customer research",
    "agent_id": "agent_01...",
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

The schedule object requires `type: "cron"`, a valid cron `expression`, and an IANA `timezone`. Omit `schedule` only when the Schedule will be triggered manually.

Alternatively, create a declarative Schedule with `name`, `runtime`, and `initial_events` in JSON or YAML. Declarative Schedules resolve their runtime binding from the runtime definition and use the public REST invocation transport. This release supports the `hermes` runtime. Do not combine `runtime` with `agent_id`.

## Schedule run records

Use `POST /v1/deployments/{deployment_id}/runs` to trigger manually. This is the preferred trigger path. `POST /v1/deployments/{deployment_id}/run` remains a compatibility alias for clients using the older singular path. The request body must be empty or `{}`; input overrides are rejected. The response is a DeploymentRun object with `id`, `type`, `deployment_id`, `agent`, `trigger_context`, nullable `session_id`, nullable `error`, and `created_at`.

List one Schedule's records at `/v1/deployments/{deployment_id}/runs`, or query `/v1/deployment_runs` across all Schedules. Retrieve a known run directly with `/v1/deployment_runs/{drun_id}`. The global list accepts `trigger_type=manual|schedule`, status filters `pending|succeeded|failed`, `has_error`, Agent/Deployment IDs, time bounds, and cursor pagination. These filters select trigger outcomes; the current public `DeploymentRun` object does not include a `status` field. A nested get returns `409 deployment_trigger_in_progress` while the record is pending.

Updates support `name`, `initial_events`, `schedule`, `timeout_policy`, `expected_version`, `agent_binding`, `agent_config`, and `notification_settings`. Changing the Agent binding requires a paused Deployment and the current `expected_version` when applicable.

`notification_settings` accepts exactly one `feishu_webhook_url` on the official `open.feishu.cn` custom-bot path. The URL is encrypted and never returned; detail responses expose only `feishu_webhook_configured`. Send `notification_settings: null` or `feishu_webhook_url: null` to remove it. The test endpoint sends a fixed SandBase message to the saved target and accepts only an absent body or `{}`.
