---
title: Pricing and Usage
description: Find current model pricing, inspect task costs, and manage SandBase billing safely.
---

# Pricing and Usage

SandBase uses pay-as-you-go billing. Model availability, price formulas, cache multipliers, and capability-specific
charges can change independently, so integrations should read live metadata instead of relying on copied price
tables.

## Daily free API calls

Every organization gets 100 free data API calls (search, social, scraping, e-commerce, finance) per UTC day. The
allowance is shared by all eligible data APIs and all of the organization's keys, and resets at 00:00 UTC. LLMs and
media models are not eligible.

- Calls within the allowance are not charged, and an organization with a zero balance can still use them.
- After the 100th call, eligible calls keep working and are billed per call at the price the tool shows. They are not
  rejected or rate-limited because the allowance is used up.
- Unused calls do not carry over to the next day.

In the [SandBase MCP tools](/setup/), `sandbase_inspect` marks eligible tools with `pricing.free_quota`
(`daily_limit`, `scope`, `resets`). `sandbase_account` returns today's allowance as `free_api_quota` with
`daily_limit`, `used_today`, `remaining`, and `resets_at`; `used_today` and `remaining` are omitted when the count is
temporarily unavailable. After a run settles, `sandbase_run` and `sandbase_run_get` report `free_quota_status`:
`free` (covered by the allowance), `overage` (billed after the allowance was used up), or `degraded` (not charged
because the allowance count was unavailable).

## Manage billing in the Console

Use **Console → Billing** to view your balance, add credits, and manage the billing settings available to your
organization. Open **Console → Activities → Usage** for organization-level request, token, and cost summaries.

::: info Public API boundary
Balance, top-up, billing export, and organization-wide usage endpoints are not currently part of the supported
public API. Do not automate Console network requests or depend on internal Console routes.
:::

## Read current model pricing

First discover an enabled model:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Then request its full model card:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

The list endpoint is optimized for discovery and intentionally omits detailed token, cache, and reasoning prices.
Read the selected model's detailed pricing from `model_card` in the detail response. There is no universal formula
that applies to every LLM, media model, embedding model, or API capability.

## Check one task's recorded cost

When an operation returns a task ID, query its settlement record:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

The response distinguishes the current `cost` from `estimated_cost` and reports whether settlement is final. Do
not use `cost` for billing reconciliation until `settled` is `true`. Task records are operational lookup data rather
than an accounting ledger. Use the billing records and CSV exports available under **Console → Activities → Usage**
for reconciliation and longer-term records.

## Cost-control practices

- Resolve the current model card before launching a new workload.
- Check `capability_tags`, `supported_modes`, and `unified_schema`; cheaper alternatives are useful only when they
  support the required input and output behavior.
- Limit unnecessary prompt context and set an appropriate output-token limit when the selected model supports it.
- Treat caching as model-specific. Check the model card and returned usage fields instead of assuming a provider-wide
  discount.
- Record task IDs only for the task-cost lookup; for asynchronous `/v1/run` work, record the returned opaque run ID and poll `GET /v1/run/{id}` only while status is `pending` or `running`.
- Use spending controls exposed in the Console for your organization.

## Payment errors

An API operation may return HTTP `402` when the organization cannot fund the request. Error envelopes vary by API
compatibility surface, so handle the HTTP status and documented error object rather than matching one message
string. After resolving billing in the Console, retry according to the operation's idempotency and recovery rules.

Video submissions are also checked against their estimated cost before they start. A single top-up of $10 or more
raises your account level, which allows more video tasks to run at the same time. See
[Concurrency limits](/guides/concurrency-limits).

See [Models and Pricing](/for-agents/models), [Task Cost](/api-reference/tasks/cost), and
[Errors](/api-reference/errors) for the current public contracts.
