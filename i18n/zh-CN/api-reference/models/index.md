---
i18nSource: 3ccdc1071b9be798
title: Models API
description: 查找 SandBase 模型的元数据、价格、支持状态和能力。
---

# Models API {#models-api}

在选择推理端点之前，可以使用 Models API 查找模型。列表操作与 OpenAI 兼容，返回精简的标识记录。获取单个模型可查看 SandBase 的能力、结构和价格元数据。

| 操作 | 端点 | 文档 |
|---|---|---|
| 列出模型 | `GET /v1/models` | [列出模型](./list) |
| 获取单个模型 | `GET /v1/models/{id_or_name}` | [获取模型](./get) |
| 按路径调用 API 能力 | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API 透传](./api-passthrough) |
| 运行模型或 API 能力 | `POST /v1/run` | [运行能力](./run) |
| 获取异步结果 | `GET /v1/run/{id}` | [获取运行结果](./run-get) |
| 接收异步回调 | `POST /v1/run` 上的 `webhook_url` | [Webhook 回调](./run#webhook-callbacks) |
| 浏览支持的模型 | — | [Models 目录](https://www.sandbase.ai/models) |

要运行某个模型，请在 [Models 目录](https://www.sandbase.ai/models)中打开其参考页面；每个页面都会列出确切的标识符、请求字段和价格。本页介绍模型发现、统一能力运行器、API 透传、Assets 以及任务费用查询。

`GET /v1/models` 支持 `q`、`vendor`、`type` 和 `order`，不分页。省略 `type` 时默认为 `llm`，而显式传入空的 `type=` 会列出所有公开模型类型。`vendor` 过滤为精确匹配且区分大小写；`q` 为不区分大小写的子串搜索。每个列表项包含 `id`、`object`、`created` 和 `owned_by`，其中 `id` 是请求中使用的逻辑模型名称。

模型名称中可能包含 `/`。调用详情端点时，请将这些斜杠作为路径分隔符传入，例如 `/v1/models/openai/gpt-5.6-luna`；服务端路由会将剩余路径作为一个逻辑标识符处理。请通过 `GET /v1/models` 获取当前 ID，不要从旧指南中复制标识符。

对于推理 API 返回的异步 `202` 响应，请使用返回的不透明 ID 轮询 `GET /v1/run/{id}`。不要推断 ID 前缀，也不要根据兼容性响应头构造其他轮询路径。
