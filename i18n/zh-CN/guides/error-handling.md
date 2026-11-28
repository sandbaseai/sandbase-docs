---
i18nSource: f63049c1cf01130e
title: 错误与重试
description: 对 SandBase API 失败进行分类，判断何时可以安全重试，并在不泄露密钥的前提下保留有用的诊断信息。
---

# 错误与重试 {#errors-and-retries}

请根据 HTTP 状态码、端点类别和操作语义处理错误。SandBase 提供多种兼容协议，
因此并非所有端点都共享同一种错误 JSON 结构。

## 读取端点的错误结构 {#read-the-endpoint-s-error-shape}

- 兼容 OpenAI 的操作通常返回包含 message 和 type 的 `error` 对象。
- Anthropic Messages 返回兼容 Anthropic 的错误信封。
- 核心平台操作可能返回扁平的 `{ "error": "..." }` 响应体，或文档中说明的资源专属错误。
- Google 及服务商原生操作会在文档说明的情况下保留其兼容协议的结构。

请使用响应的 HTTP 状态码和文档中说明的响应体。除非所选端点保证提供，否则不要依赖 `code`、`param` 或
`request_id` 等可选字段。示例请参阅 [API 错误参考](/api-reference/errors)，
各操作的具体响应请参阅 [OpenAPI 规范](/openapi.yaml)。

## 按状态码决定处理方式 {#decide-what-to-do-by-status}

| 状态码 | 常见原因 | 建议操作 |
|---|---|---|
| `400` / `422` | 请求体或参数无效，或模型不支持该能力 | 修正请求后再重试。 |
| `401` | 凭据缺失、无效、过期或已吊销 | 更换凭据。 |
| `402` | 账单状态不允许该请求 | 处理账户余额或消费控制问题。 |
| `403` | 凭据权限范围或资源访问权限不足 | 使用已授权的密钥或资源。 |
| `404` | 未找到模型、任务或平台资源 | 核实标识符和组织。 |
| `409` | 资源状态冲突或并发操作冲突 | 读取当前状态，再决定是否重试。 |
| `429` | SandBase 或上游服务商限制了该请求 | 如有 `Retry-After` 请遵循；否则使用带抖动的退避。 |
| `500` / `502` / `503` / `504` | 内部、上游或临时可用性故障 | 仅在重复该操作安全时重试。 |

此表是处理指南，并不保证每个端点都会返回所有这些状态码。

## 使用有上限的重试策略 {#use-a-bounded-retry-policy}

对于可以安全重复的请求，请使用带抖动的指数退避，限制最大延迟，并设定总请求预算。
如果外层应用已经有重试，请禁用 SDK 重试，或在设定预算时将两层重试都考虑在内。

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

当响应包含 `Retry-After` 时，请解析并遵循它，而不是使用备用延迟。保持策略
可配置；合适的尝试次数和截止时间取决于调用方的延迟和成本预算。

## 防止重复的副作用 {#protect-against-duplicate-side-effects}

重复推理请求会产生新的生成结果，并可能产生额外费用。只有当
应用只需任一有效答案且能容忍重新生成时，才可以这样做。

对于创建、更新、删除、发布、调度或触发工作的操作，请更加谨慎：

- 端点提供幂等支持时，请按文档使用；
- 否则在重复一个结果不明确的请求之前，先读取当前状态；
- 不要仅因外层模型流断开就重放工具调用；
- 需要对账重试时，在你自己的系统中保留客户端操作 ID。

## 分别处理超时和流 {#handle-timeouts-and-streams-separately}

超时并不能证明服务端已停止处理该请求。在重试异步或会改变状态的
操作之前，尽可能查询其文档中说明的资源或任务状态。

对于流式响应，请区分流开始前的 HTTP 错误与输出部分内容后的断开。
只有协议中正常的终止信号才能证明流已完整。参阅[流式响应](/guides/streaming)。

## 记录有用且安全的诊断信息 {#log-useful-safe-diagnostics}

记录：

- 端点和模型标识符；
- HTTP 状态码以及兼容的错误类型（如有）；
- 服务商或请求标识符（如有返回）；
- 尝试次数、耗时，以及是否收到任何响应字节。

不要记录 API 密钥、凭据值、完整的敏感提示词或未脱敏的服务商响应。向用户展示简洁、
可操作的提示，同时为运维人员保留经过脱敏的诊断信息。

## 相关指南 {#related-guidance}

- [API 错误参考](/api-reference/errors)
- [速率限制](/guides/rate-limiting)
- [流式响应](/guides/streaming)
- [认证](/api-reference/authentication)
