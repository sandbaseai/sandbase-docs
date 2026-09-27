---
title: Concurrency limits
description: How many video tasks your organization can run at once, how the limit scales with your account level, and how to handle 429 and 402 on video submissions.
---

# Concurrency limits

Concurrency limits control how many video tasks your organization can run at the same time. Every organization has an account level, and the level sets its concurrency limit. When you reach the limit, new video submissions are rejected with `429` until one of your running tasks finishes. They are not queued.

The limit applies to the whole organization, across all API keys and all video models. It only affects video submissions. Chat completions, image, audio, and embedding requests are never rejected by the concurrency limit.

## How it works

When you submit a video task, SandBase counts the tasks your organization currently has in progress, meaning tasks in the `pending` or `running` state. If that count is already at your limit, the submission is rejected immediately with `429`. No task is created and nothing is charged.

The count covers every in-progress request in your organization, not just video. A streaming chat completion that is still open when you submit a video uses one slot. If the same organization runs long streaming chats and video jobs, account for both when planning capacity.

A slot frees up as soon as a task reaches a final state (`completed`, `failed`, or `timeout`). There is nothing to release on your side. Because slots free up when tasks finish, not on a timer, this `429` is different from a per-minute [rate limit](/guides/rate-limiting). Waiting a fixed interval doesn't guarantee a slot. Wait for one of your own tasks to finish instead.

## Default limits

Every new organization starts at **Bronze**, with a limit of 2 concurrent tasks. Your level increases automatically based on the amount of a single successful top-up.

| Level | Single top-up | Concurrent tasks |
|-------|---------------|------------------|
| Bronze | Default | 2 |
| Silver | $10 or more | 10 |
| Gold | $100 or more | 100 |
| Ultra | $500 or more | 500 |
| Diamond | Contact sales | Unlimited |

- **Single top-up, not a running total.** Two $60 top-ups keep you at Silver. One $100 top-up moves you to Gold.
- **Upgrades only.** A later, smaller top-up never lowers your level.
- **Paid top-ups only.** Promotional credits, sign-up credits, and coupons don't change your level.
- **Takes effect right away.** The new limit applies to your next video submission once the payment succeeds.

## Increasing your limit

The most direct way to raise your limit is a single top-up that reaches the next threshold in the table above.

For more than 500 concurrent tasks, or for a monthly credit line, contact [contact@sandbase.ai](mailto:contact@sandbase.ai) about the **Diamond** level. Diamond has no concurrency limit. It is set up by the SandBase team and is never changed by top-ups.

## Credit check on video submissions

Along with the concurrency check, SandBase estimates the cost of each video task before accepting it. If the estimate is more than your available credit (balance plus any credit line), the submission is rejected with `402`. No task is created and nothing is charged.

- Each submission is checked against your current balance. Tasks still running haven't been charged yet, so leave headroom when you submit several videos at once.
- If a model's price depends on output that only exists after it runs, the cost can't be estimated up front. The submission is accepted and billed normally when the task finishes.

## Handling concurrency errors

### 429: concurrency limit reached

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

No `Retry-After` header is sent. The limit is known in advance, so the most reliable approach is to never exceed it. Cap the number of video tasks you have in flight on the client side, and only submit the next one after a previous one finishes:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

If you still get a `429`, for example because another service in the same organization is submitting too, back off and retry. Use exponential backoff with jitter, and give up after a bounded number of attempts rather than retrying in a tight loop.

### 402: not enough credit for this video

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Don't retry. Top up, or choose a shorter duration or lower resolution that costs less.

### Compatible APIs

Protocol-compatible endpoints return these errors in their own native format. For example, the Volcengine-compatible `/api/v3/contents/generations/tasks` endpoint returns `RateLimitExceeded` for `429` and `AccountOverdueError` for `402`.

## Related

- [Rate limits](/guides/rate-limiting): per-minute request limits
- [Pricing](/guides/billing): credits and top-ups
- [Errors](/api-reference/errors): all error codes
