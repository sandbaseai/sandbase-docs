---
title: Schedules
description: Configure manual or cron-based Agent runs and inspect each Schedule trigger through SandBase Sessions.
---

# Schedules

A **Schedule** stores a pinned Agent version, starting events, and optionally a cron expression. The underlying public API resource keeps the compatibility name **Deployment**, so Schedule operations use `/v1/deployments` and `depl_` IDs.

## Trigger lifecycle

Every manual or cron trigger:

1. creates a new `drun_*` DeploymentRun record;
2. attempts to create exactly one new `sess_*` Session;
3. records either a `session_id` on success or an error when Session creation fails.

The public DeploymentRun object has no `status` field. List endpoints accept `status=pending|succeeded|failed` as trigger-outcome filters, but those filters do not describe the linked Agent Session's execution status. Inspect the linked Session for subsequent Agent events and errors.

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
- [List Schedule runs](/api-reference/deployments/list-runs)
- [Sessions](/agents/sessions)
