---
i18nSource: b95a8cd6f82c3a9a
title: AI 可读的模型与价格
description: 通过 Models API 发现 SandBase 当前的模型、能力、schema 和价格。
---

# 模型与价格 {#models-pricing}

所有模型都可以通过一个 SandBase API 密钥访问。模型的可用性、schema、能力、上下文限制
和价格都可能独立变化。

::: info 使用实时模型元数据
请始终使用 `GET /v1/models` 和 `GET /v1/models/{id_or_name}` 获取最新的权威数据。不要推断每个
LLM 都支持流式、视觉、工具、结构化输出或缓存，也不要将一个模型的输入字段或
价格套用到另一个模型。
:::

## 目录与详情响应 {#catalog-and-detail-responses}

`GET /v1/models` 返回兼容 OpenAI 的标识记录，包含 `id`、`object`、`created` 和 `owned_by`。
它有意不包含 SandBase 的能力、schema 和价格元数据。

`GET /v1/models/{id_or_name}` 额外返回 `unified_schema`、`supported_modes` 和 `model_card`。详细价格请从
`model_card` 读取；没有顶层的 `pricing` 对象。请将 `capability_tags`、`supported_modes` 和
`unified_schema` 视为模型专属。

## 发现模型 {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

列表端点支持 `q`、`vendor`、`type` 和 `order`；不分页，默认为 `type=llm`。
它返回兼容 OpenAI 的条目，包含 `id`、`object`、`created` 和 `owned_by`。请求详情或调用模型时，
请将返回的 `id` 用作模型名称。

对于任何异步 `202` 响应，请使用返回的 ID 轮询 `GET /v1/run/{id}`。请将该 ID 视为不透明值；
不要推断其格式，也不要根据 ID 前缀或兼容性请求头拼接其他轮询路径。

## 查看单个模型 {#inspect-one-model}

模型名称带有厂商前缀，可能包含 `/`：

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

执行前请检查：

- `enabled` 和 `execution_mode`
- `capability_tags` 和 `supported_modes`
- `unified_schema`，了解可接受的请求字段
- `model_card`，了解当前的计价公式以及 token 或缓存倍率

## 查看实际任务费用 {#check-actual-task-cost}

对于已完成或进行中的任务，请查询记录的费用，而不是根据过时的表格重新计算：

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

响应约定请参阅 [Models API 参考](/api-reference/models/)，
响应结构和重试指导请参阅[错误指南](/for-agents/errors)。
