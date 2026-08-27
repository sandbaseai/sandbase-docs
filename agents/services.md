---
title: Services
description: Publish a tested Agent as a stable callable Service.
---

# Services

A **Service** makes a tested Agent callable from an application or AI tool. Service management and invocation use the compatibility path `/v1/endpoints` and `ep_` IDs. Public invocation uses REST or experimental ACP according to its `protocols` setting.

## When to create a Service

Create one when the Agent and its input contract are tested and an external caller needs a stable invocation URL. Keep editing and testing the Agent separately, then update the Service deliberately.

## Invoke a Service

```bash
curl -X POST https://api.sandbase.ai/v1/endpoints/ep_01.../run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":"Prepare a sourced customer brief."}'
```

Omit `session_id` to create a Session, or provide an existing authorized `session_id` to continue it. The response contains the persistent `session_id` and accepted Session events; it does not create a DeploymentRun.

## API compatibility names

| Product | API path name | API prefix |
|---|---|---|
| Service | `endpoint` | `/v1/endpoints` |
| Schedule | Deployment | `/v1/deployments` |

## Next steps

- [Service quickstart](/agents/endpoint-quickstart)
- [Services API](/api-reference/endpoints/)
- [Sessions](/agents/sessions)
- [Schedules](/agents/schedules)
