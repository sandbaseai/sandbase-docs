---
i18nSource: d326fdb78ea64bdf
title: 速率限制
description: 通过有上限的重试、随机抖动、队列和考虑幂等性的请求处理，安全应对 SandBase API 速率限制。
---

# 速率限制 {#rate-limits}

SandBase 可以为你的组织分配每分钟请求数上限。该上限由组织内的所有 API 密钥共享，
并按一分钟滑动窗口计数。上游模型提供商也可能返回其自身的
`429 Too Many Requests` 响应。除非 SandBase 已为你的工作负载分配了配额，否则不要硬编码配额。

## 你的组织的限制 {#your-organization-s-limit}
SandBase 不公布固定的每分钟请求数，因为该上限按组织分配。组织内的每个
API 密钥都计入同一个上限，因此创建更多密钥并不能提高它。该上限目前
不会在公开 API 或 Console 中显示。

如果你的工作负载需要有保障或更高的上限，请联系 SandBase 支持团队，并提供组织、应用、
预期稳定速率和预期突发速率。不要围绕未记录在文档中的默认数值来设计生产客户端。

## 处理 429 响应 {#handle-a-429-response}

平台生成的 `/v1/*` 速率限制响应使用扁平结构的错误体：

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

组织上限适用于 `POST /v1/run`、`POST /v1/chat/completions`、`POST /v1/responses`、`POST /v1/messages`、`POST /v1/upload`，以及 Gemini 的 `generateContent`、`streamGenerateContent` 和 `POST /v1beta/interactions` 端点。轮询端点（例如
`GET /v1/run/{id}`）不计入。协议兼容端点会以其自身的错误结构返回相同的 `429`，
例如 Anthropic 或 Google 的错误格式。由提供商发起的响应可能使用兼容端点的错误
格式，并可能包含提供商的速率限制响应头。

不保证返回 `Retry-After` 和剩余配额响应头。如果存在 `Retry-After`，请遵循它。否则，请使用
带随机抖动和最大尝试次数的指数退避。

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

OpenAI SDK 也通过 `max_retries` 支持内置重试。请有意识地在 SDK 重试和应用层重试
循环中二选一，以免重试在多个层级上叠加。

## 只重试安全的操作 {#retry-only-safe-operations}

重复发送推理请求可能会产生第二次生成并带来额外费用。只有在你的
应用接受重新生成时才重试。不要自动重试会改变状态的请求，除非该操作在文档中说明了
幂等性，或你的应用能确认第一次尝试未成功。

对于流式请求，`429` 通常在流开始之前返回。一旦已收到数据，应将断开连接
视为生成被中断，而不是认定为速率限制错误。请根据产品需求保留或丢弃部分输出；
重新开始会产生一次新的生成。

## 控制吞吐量 {#control-throughput}

- 限制并发数，不要一次性放出不受限制的批量请求。
- 将突发任务放入队列，平滑发送速率。
- 避免重复请求，并在隐私和时效性要求允许时缓存可复用的结果。
- 使用不同的密钥来区分归属、控制支出和吊销权限，而不是用来绕过平台限制。
- 记录端点、模型、HTTP 状态码和经过脱敏的错误体，以便排查问题。
- 当工作负载需要分配的或更高的容量上限时，请联系 SandBase 支持团队。

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

并发数与每分钟请求数不是一回事。请根据观测到的延迟和分配给
你的应用的容量同时调整这两者。

::: info 每日免费 API 调用
组织每个 UTC 日的 100 次免费数据 API 调用是一项计费额度，而不是速率限制。超出部分会
按次计费，而不会被拒绝。参见[每日免费 API 调用](/guides/billing#daily-free-api-calls)。
:::

::: tip 视频任务
视频提交还受组织可同时运行的任务数量限制，该数量取决于账户等级。
此时的 `429` 消息为 `organization concurrency limit exceeded`，会在某个运行中的任务结束时解除，而不是按时间解除。参见
[并发限制](/guides/concurrency-limits)。
:::

## 相关指南 {#related-guidance}

- [错误处理](/guides/error-handling)
- [流式输出](/guides/streaming)
- [API 错误参考](/api-reference/errors)
- [API 密钥](/getting-started/api-keys)
