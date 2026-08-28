---
title: Schedules
description: Run an Agent manually or on a cron schedule and inspect every trigger.
---

# Schedules

A **Schedule** stores repeatable Agent input and optionally a cron expression. The underlying API resource is a **Deployment**, so Schedule operations use `/v1/deployments`.

## Trigger lifecycle

Every manual or cron trigger:

1. creates a new `drun_*` DeploymentRun record;
2. attempts to create exactly one new `sess_*` Session;
3. resolves the DeploymentRun to `succeeded` with `session_id`, or `failed` with an error.

DeploymentRun may briefly be `pending`. Its terminal status describes the Session-creation attempt; inspect the linked Session for Agent execution and events.

## Trigger manually

```bash
curl -X POST https://api.sandbase.ai/v1/deployments/depl_01.../runs \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Manual triggers do not accept input overrides; the Schedule's `initial_events` are used.

## Inspect trigger records

```bash
curl "https://api.sandbase.ai/v1/deployment_runs?deployment_id=depl_01...&trigger_type=schedule" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Use `trigger_type=manual|schedule` and `status=pending|succeeded|failed` filters. Retrieve the returned `session_id` through the Sessions API after a successful trigger.

## Next steps

- [Schedules API](/api-reference/deployments/)
- [Trigger a Schedule](/api-reference/deployments/run)
- [List DeploymentRuns](/api-reference/deployments/list-runs)
- [Sessions](/agents/sessions)
