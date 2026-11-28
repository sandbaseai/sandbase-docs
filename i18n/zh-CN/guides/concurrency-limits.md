---
i18nSource: fc051d55a0cfa8bd
title: 并发限制
description: 你的组织可以同时运行多少个任务、上限如何随账户等级提升，以及如何处理视频提交时的 429 和 402。
---

# 并发限制 {#concurrency-limits}

并发限制决定了你的组织可以同时进行多少个任务。每个组织都有一个账户等级，该等级决定其并发上限。达到上限后，下文所列受检查端点上的新提交会被拒绝并返回 `429`，直到你有一个正在运行的任务结束。这些提交不会排队。

该限制适用于整个组织，涵盖所有 API 密钥。哪些提交会被检查取决于端点：

- `POST /v1/run` 以及通过 `/v1/api/{vendor}/...` 发起的 Platform API 调用，会对所有模型类型进行检查，包括图像、音频、LLM 和数据 API 操作。
- 其他端点，例如 Chat Completions、Responses、Messages、OpenAI Images，以及与 Gemini 和 Volcengine 协议兼容的端点，只检查视频提交。

## 工作原理 {#how-it-works}

提交受检查的任务时，SandBase 会统计你的组织当前进行中的任务数，即处于 `pending` 或 `running` 状态的任务。如果该数量已达到上限，提交会立即被拒绝并返回 `429`。不会创建任务，也不会产生费用。

该计数包括组织内所有进行中的请求，而不仅仅是视频。如果在你提交受检查任务时，某个流式聊天补全请求仍处于打开状态，它也会占用一个名额。如果同一组织既运行长时间的流式聊天，又运行视频任务，规划容量时需要把它们全部算进去。

任务一旦进入终态（`completed`、`failed` 或 `timeout`），名额就会立即释放。你无需进行任何释放操作。由于名额是在任务结束时释放，而不是按定时器释放，这种 `429` 与按分钟计算的[速率限制](/guides/rate-limiting)不同。等待固定的时间间隔并不能保证获得名额，请改为等待你自己的某个任务结束。

## 默认限制 {#default-limits}

每个新组织初始为 **Bronze** 等级，上限为 2 个并发任务。等级会根据单笔成功充值的金额自动提升。

| 等级 | 单笔充值 | 并发任务数 |
|-------|---------------|------------------|
| Bronze | 默认 | 2 |
| Silver | $10 或以上 | 10 |
| Gold | $100 或以上 | 100 |
| Platinum | $500 或以上 | 500 |
| Diamond | 联系销售 | 不限 |

- **按单笔充值计算，而非累计金额。** 两笔 $60 的充值仍为 Silver。一笔 $100 的充值即可升至 Gold。
- **只升不降。** 之后金额较小的充值不会降低你的等级。
- **仅限付费充值。** 促销额度、注册赠送额度和优惠券不会改变你的等级。
- **立即生效。** 付款成功后，新的上限即适用于你的下一次视频提交。

## 提高上限 {#increasing-your-limit}

提高上限最直接的方式，是进行一笔达到上表中下一档门槛的单笔充值。

如需 500 个以上的并发任务或按月信用额度，请联系 [contact@sandbase.ai](mailto:contact@sandbase.ai) 咨询 **Diamond** 等级。Diamond 没有并发限制。该等级由 SandBase 团队设置，不会因充值而改变。

## 视频提交的额度检查 {#credit-check-on-video-submissions}

除并发检查外，SandBase 还会在接受每个视频任务之前预估其费用。如果预估费用超过你的可用额度（余额加上信用额度），提交会被拒绝并返回 `402`。不会创建任务，也不会产生费用。

- 每次提交都会与你的当前余额进行比对。仍在运行的任务尚未扣费，因此一次提交多个视频时请预留余量。
- 如果某个模型的价格取决于运行后才产生的输出，则无法预先估算费用。此类提交会被接受，并在任务完成时正常计费。

## 处理并发错误 {#handling-concurrency-errors}

### 429：已达到并发上限 {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

响应不会包含 `Retry-After` 请求头。由于上限是事先已知的，最可靠的做法是始终不超过它。在客户端限制同时进行的视频任务数量，只有在前一个任务结束后才提交下一个：

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

如果仍然收到 `429`（例如同一组织中的另一个服务也在提交任务），请退避后重试。使用带随机抖动的指数退避，并在有限次数的尝试后放弃，而不是在紧密循环中不断重试。

### 402：额度不足以支付此视频 {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

不要重试。请充值，或选择费用更低的较短时长或较低分辨率。

### 兼容 API {#compatible-apis}

协议兼容端点会以各自的原生格式返回这些错误。例如，与 Volcengine 兼容的 `/api/v3/contents/generations/tasks` 端点在 `429` 时返回 `RateLimitExceeded`，在 `402` 时返回 `AccountOverdueError`。

## 相关内容 {#related}

- [速率限制](/guides/rate-limiting)：每分钟请求数限制
- [定价](/guides/billing)：额度与充值
- [错误](/api-reference/errors)：全部错误码
