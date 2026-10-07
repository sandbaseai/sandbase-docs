---
title: Schedules API
description: Run a pinned Agent version on a cron schedule or on demand, and inspect its Runs.
---
# Schedules API

A Schedule runs one pinned [Agent](/api-reference/agents/) version with a saved input on a cron expression. Every firing, and every manual trigger, creates a Run (`run_` IDs) that creates one [Session](/api-reference/sessions/). Schedule IDs use the `sch_` prefix.

## Schedule operations

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/schedules` | [Create a Schedule](./create) |
| `GET` | `/v1/schedules` | [List Schedules](./list) |
| `GET` | `/v1/schedules/{schedule_id}` | [Get a Schedule](./get) |
| `PATCH` | `/v1/schedules/{schedule_id}` | [Update name, Agent, or input](./update) |
| `PUT` | `/v1/schedules/{schedule_id}/timing` | [Change cron and timezone](./timing) |
| `POST` | `/v1/schedules/{schedule_id}/pause` | [Pause](./lifecycle) |
| `POST` | `/v1/schedules/{schedule_id}/resume` | [Resume](./lifecycle) |
| `POST` | `/v1/schedules/{schedule_id}/archive` | [Archive](./lifecycle) (terminal) |
| `POST` | `/v1/schedules/{schedule_id}/runs` | [Trigger a manual Run](./run) |
| `GET` | `/v1/schedules/{schedule_id}/runs` | [List Runs](./runs) |
| `GET` | `/v1/schedules/{schedule_id}/runs/{run_id}` | [Get a Run](./runs) |
| `POST` | `/v1/schedules/{schedule_id}/runs/{run_id}/cancel` | [Cancel a Run](./runs) |
| `GET` | `/v1/schedules/{schedule_id}/runs/{run_id}/notifications` | [Notification deliveries](#notifications) |
| `GET` | `/v1/schedules/{schedule_id}/notifications` | [Notification targets](#notifications) |
| `PUT` | `/v1/schedules/{schedule_id}/notifications/{channel}` | [Set a target](#notifications) |
| `DELETE` | `/v1/schedules/{schedule_id}/notifications/{channel}` | [Remove a target](#notifications) |

## Timing

`schedule` is `{"cron": "…", "timezone": "…"}`.

- `cron` has five fields: minute, hour, day of month, month, day of week (0-7, where 0 and 7 are Sunday). Lists, ranges, and steps such as `*/15` work. Seconds are not supported.
- When both day of month and day of week are restricted, the Schedule fires when either matches.
- `timezone` is an IANA name such as `Asia/Shanghai` and defaults to `UTC`. Unknown names return 400.
- An expression with no match in the next 366 days returns 400.
- `next_run_at` shows the next firing time in UTC while the Schedule is active.

If the scheduler was unavailable when a firing was due, it creates one Run for the overdue time and then continues from the next future time; missed firings are not replayed one by one.

## Runs

- Scheduled Runs have `trigger_source: "scheduled"` and `scheduled_at`; manual Runs have `trigger_source: "manual"`.
- Only one Run per Schedule can be pending. A manual trigger returns `429 concurrency_limit`; a scheduled firing is recorded as a `skipped` Run with `error_code: "concurrency_limit"`.
- Run `status` values are `pending`, `succeeded`, `failed`, `cancelled`, and `skipped`. `error_code` explains failures, for example `session_creation_rejected`, `execution_failed`, `schedule_configuration_invalid`, or `spending_limit_exceeded`.
- Reading a Schedule Run is read-only; Run status advances in the background.

## Model credentials

Scheduled Runs have no caller, so the Schedule stores a model credential, encrypted, when it is created: `model_provider` from the request, or your calling SandBase API key when you omit it. `PUT …/timing` keeps the stored credential unless you send a new `model_provider`. A manual trigger runs with your calling key unless its body sends `model_provider`.

## Rules that apply to writes

- Creating a Schedule, triggering a Run, and cancelling a Run require `Idempotency-Key`.
- `PATCH`, `PUT …/timing`, `pause`, `resume`, and `archive` require the current `row_version`. A Schedule's `row_version` also advances every time it fires, so read it right before writing.
- Paused Schedules neither fire nor accept manual Runs (409). `archived` is terminal.

## Notifications

Schedules support the same Feishu or Lark bot notifications as Services. See [Services notifications](/api-reference/services/#notifications); replace `/v1/services/{service_id}` with `/v1/schedules/{schedule_id}`.

## Pagination

Schedule and Run lists use offset pagination: `limit` (1-100, default 20) and `offset`.
