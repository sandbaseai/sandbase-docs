---
title: Schedules
description: Run a pinned Agent version on a cron schedule or on demand, and review every Run and Session.
---

# Schedules

A **Schedule** runs a pinned Agent version with a saved input on a cron expression. Every firing and every manual trigger creates a **Run**, and each Run creates its own Session. Schedule IDs start with `sch_`.

## Create a Schedule

`Idempotency-Key` is required, `input` must be non-empty, and `schedule` sets the `cron` expression and `timezone`.

```bash
curl -X POST https://api.sandbase.ai/v1/schedules \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: daily-digest-schedule" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily digest",
    "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    "input": "Summarize yesterday'"'"'s AI agent news in five bullet points.",
    "schedule": {"cron": "0 9 * * 1-5", "timezone": "Asia/Shanghai"}
  }'
```

- `cron` uses five fields: minute, hour, day of month, month, day of week. Seconds are not supported. An expression with no match in the next 366 days returns 400.
- `timezone` is an IANA name and defaults to `UTC`.
- Omitting `agent_version` pins the Agent's current version at creation time.
- `next_run_at` shows the next firing time in UTC.

## Model credentials for scheduled Runs

Scheduled Runs have no caller, so the Schedule stores a model credential, encrypted, when you create it: the `model_provider` you send, or your calling SandBase API key when you omit it. `PUT /v1/schedules/{schedule_id}/timing` keeps it unless you send a new `model_provider`. If that key is later revoked or runs out of balance, scheduled Runs fail with an `error_code` instead of running.

## Trigger a Run now

```bash
curl -X POST https://api.sandbase.ai/v1/schedules/sch_7e3b1c58-2a9d-5e4f-b6c1-8d0a2f4e6b17/runs \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: daily-digest-manual-1" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize this morning'"'"'s AI agent news."}'
```

The response is **202 Accepted** with a pending Run (`trigger_source: "manual"`). `input`, `model`, and `model_provider` override the saved values for this Run only; send `{}` to use the saved input.

## Change timing or configuration

- `PUT /v1/schedules/{schedule_id}/timing` with `{"row_version": …, "cron": "…", "timezone": "…"}` changes when it fires.
- `PATCH /v1/schedules/{schedule_id}` changes `name`, `description`, `agent_id`, `agent_version`, or `input`.
- `POST /v1/schedules/{schedule_id}/pause`, `/resume`, and `/archive` take `{"row_version": …}`. Paused Schedules neither fire nor accept manual Runs. Archived is permanent.

A Schedule's `row_version` advances every time it fires, so read the Schedule right before you write to it.

## Runs

| Field | Values |
|---|---|
| `trigger_source` | `scheduled` (with `scheduled_at`) or `manual` |
| `status` | `pending`, `succeeded`, `failed`, `cancelled`, or `skipped` |
| `error_code` | Present on failures and skips, for example `execution_failed`, `schedule_configuration_invalid`, or `concurrency_limit` |
| `session_id` | The Session that holds the conversation, once it exists |

- Only one Run per Schedule can be pending. If a firing finds one still pending, it records a `skipped` Run with `error_code: "concurrency_limit"`; a manual trigger returns `429 concurrency_limit`.
- If the scheduler was down when a firing was due, it creates one Run for the overdue time and continues from the next future time. Missed firings are not replayed one by one.
- `GET /v1/schedules/{schedule_id}/runs` lists Runs; `GET /v1/schedules/{schedule_id}/runs/{run_id}` reads one. Reads do not change a Run; status advances in the background.
- Cancel a pending Run with `POST /v1/schedules/{schedule_id}/runs/{run_id}/cancel` (body `{}`, `Idempotency-Key` required).

Schedules support the same Feishu or Lark notifications as [Services](/api-reference/services/#notifications).

## Next steps

- [Schedules API reference](/api-reference/schedules/)
- [Services](/agents/services)
- [Sessions](/agents/sessions)
