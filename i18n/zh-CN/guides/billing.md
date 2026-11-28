---
i18nSource: 91c5a0d1b6de6434
title: 定价与用量
description: 查找当前模型定价，查看任务费用，并安全地管理 SandBase 账单。
---

# 定价与用量 {#pricing-and-usage}

SandBase 采用按量付费。模型可用性、价格公式、缓存倍率以及各能力的特定费用都可能各自独立变化，
因此集成方应读取实时元数据，而不是依赖复制下来的价格
表。

## 每日免费 API 调用 {#daily-free-api-calls}

每个组织每个 UTC 日可免费调用 100 次数据 API（搜索、社交媒体、网页抓取、电商、金融）。该
额度由所有符合条件的数据 API 和该组织的所有密钥共享，并在 UTC 00:00 重置。LLM 和
媒体模型不在适用范围内。部分数据 API 也不适用：价格较高或按公式计价的 API，例如部分
批量端点、爬取端点、小红书蒲公英（PGY）以及抖音星图 `kol-*` 路由，从第一次调用起就计费。
要查看某个工具是否适用，请运行 `sandbase_inspect`：适用的工具带有 `pricing.free_quota`，没有该字段的工具始终
计费。

- 额度内的调用不收费，余额为零的组织也可以使用。
- 第 100 次调用之后，符合条件的调用仍可正常使用，并按工具显示的价格逐次计费。不会因为额度用完而被
  拒绝或限流。
- 未用完的次数不会累计到第二天。

在 [SandBase MCP 工具](/setup/)中，`sandbase_inspect` 会用 `pricing.free_quota`
（`daily_limit`、`scope`、`resets`）标记适用的工具。`sandbase_account` 以 `free_api_quota` 返回当日额度，包含
`daily_limit`、`used_today`、`remaining` 和 `resets_at`；当计数暂时不可用时，会省略 `used_today` 和 `remaining`。
运行结算完成后，`sandbase_run` 和 `sandbase_run_get` 会报告 `free_quota_status`：
`free`（由免费额度覆盖）、`overage`（额度用完后计费）或 `degraded`（因额度计数不可用而
未收费）。

## 在 Console 中管理账单 {#manage-billing-in-the-console}

在 **Developer → Billing** 中可以查看余额、购买额度、设置自动充值、兑换优惠券，以及管理组织可用的
账单设置。打开 **Developer → Activities → Usage** 可查看组织级别的请求、token 和费用汇总。

::: info 公开 API 边界
余额、充值、账单导出和组织级用量端点目前不属于受支持的
公开 API。不要自动化 Console 的网络请求，也不要依赖 Console 的内部路由。
:::

## 读取当前模型定价 {#read-current-model-pricing}

首先找到一个已启用的模型：

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

然后请求其完整的模型卡片：

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

列表端点专为发现模型而优化，有意省略了详细的 token、缓存和推理价格。
请从详情响应的 `model_card` 中读取所选模型的详细定价。没有一个通用公式
适用于所有 LLM、媒体模型、嵌入模型或 API 能力。

## 查看单个任务的记录费用 {#check-one-task-s-recorded-cost}

当某个操作返回任务 ID 时，可查询其结算记录：

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

响应会区分当前的 `cost` 与 `estimated_cost`，并报告结算是否已最终完成。在
`settled` 为 `true` 之前，不要将 `cost` 用于账单对账。任务记录是用于运营查询的数据，而不是
会计账本。请使用 **Developer → Activities → Usage** 下提供的账单记录和 CSV 导出
进行对账和保存长期记录。

## 成本控制实践 {#cost-control-practices}

- 在启动新工作负载之前，先获取当前的模型卡片。
- 检查 `capability_tags`、`supported_modes` 和 `unified_schema`；只有在支持所需的输入和输出行为时，
  更便宜的替代方案才有意义。
- 精简不必要的提示词上下文，并在所选模型支持时设置合适的输出 token 上限。
- 缓存行为因模型而异。请查看模型卡片和返回的用量字段，不要假定存在适用于整个提供商的
  折扣。
- 仅为查询任务费用而记录任务 ID；对于异步 `/v1/run` 任务，请记录返回的不透明运行 ID，并且只在状态为 `pending` 或 `running` 时轮询 `GET /v1/run/{id}`。
- 使用 Console 为你的组织提供的支出控制功能。

## 支付错误 {#payment-errors}

当组织无法为请求付费时，API 操作可能返回 HTTP `402`。错误结构因 API
兼容层而异，因此请根据 HTTP 状态码和文档中说明的错误对象进行处理，而不是匹配某个消息
字符串。在 Console 中解决账单问题后，请按照该操作的幂等性和恢复规则进行重试。

视频提交在开始前也会根据其预估费用进行检查。单次充值 $10 或以上
会提升你的账户等级，从而允许同时运行更多视频任务。参见
[并发限制](/guides/concurrency-limits)。

当前的公开接口约定请参见[模型与定价](/for-agents/models)、[任务费用](/api-reference/tasks/cost)和
[错误](/api-reference/errors)。
