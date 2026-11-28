---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: 创建、版本化、归档和克隆已保存的 Agent 配置。
---

# Agents API {#agents-api}

Agent 是一份已保存、带版本的配置，包括模型、指令、运行时配置、Skills、MCP 连接和输出设置。创建或更新 Agent 并不会运行它。请在 [Session](/api-reference/sessions/) 中运行 Agent。

Agents API 遵循 OpenAI Agents 协议（即 OpenAI Python SDK 中的 `client.beta.agents`）。`OpenAI-Beta` 请求头为可选项；如果发送，其值必须为 `agents=v1`。SandBase 在此基础上增加了版本管理、比较并设置（compare-and-set）更新、归档与恢复，以及公开目录。

## Agent 操作 {#agent-operations}

| 方法 | 路径 | 用途 |
|---|---|---|
| `POST` | `/v1/agents` | [创建 Agent](./create)，版本为 1 |
| `GET` | `/v1/agents` | [列出 Agents](./list) |
| `GET` | `/v1/agents/{agent_id}` | [获取 Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [更新 Agent](./update)（SDK 风格的部分更新） |
| `PATCH` | `/v1/agents/{agent_id}` | 基于 `row_version` [以比较并设置方式替换](./replace) |
| `DELETE` | `/v1/agents/{agent_id}` | [删除](./delete)，即归档该 Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [归档 Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [取消归档 Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | 将[早期版本恢复](./restore)为新版本 |
| `GET` | `/v1/agents/{agent_id}/versions` | [列出版本](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [获取单个版本](./get-version) |
| `GET` | `/v1/agents/catalog` | [浏览公开目录](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | 将[目录中的 Agent 克隆](./catalog#clone-a-catalog-agent)到你的组织 |

Agent ID 使用 `agt_` 前缀。请求体为严格 JSON，最大 1 MiB；未知字段会返回 400。

## 版本与更新 {#versions-and-updates}

- 每次有效写入（create、update、replace、restore）都会生成一个不可变版本。`version` 为当前版本号。
- `POST /v1/agents/{agent_id}` 是 OpenAI SDK 的更新方式。它不需要 `row_version`，因此以最后一次写入为准。
- `PATCH /v1/agents/{agent_id}` 要求提供你上次读取到的 `row_version`；如果其他人已先修改了该 Agent，则返回 409。可能并发运行的编辑器和自动化流程应使用此方式。
- 每个 Session 会冻结其启动时使用的 Agent 版本、Skill 版本和 MCP 连接配置。

## 就绪状态 {#readiness}

新写入的版本在准备执行期间会通过 `projection_status` 报告状态。Sessions 需要一个处于 active 状态且 `projection_status` 为 `ready` 的 Agent，否则返回 409。已归档的 Agents 在发起新的执行时同样返回 409。

## 当前限制 {#current-limits}

- `tools` 接受 `function` 工具以及至多一个 `web_search` 工具。目前执行时要求 `web_search.mode` 为 `disabled`。
- 可以保存 function 工具，但需要客户端返回工具结果（`requires_action`）的 Runs 暂不支持，会返回 `502 executor_contract_error`。
- `multi_agent` 必须省略或为 `null`。

## 分页 {#pagination}

`GET /v1/agents` 和目录使用游标分页：`limit`（1-100，默认 20）、`after` 和 `order`（`asc` 或 `desc`，默认 `desc`）。响应包含 `object: "list"`、`data`、`has_more`、`first_id` 和 `last_id`；将 `last_id` 作为 `after` 传入即可获取下一页。

`GET /v1/agents/{agent_id}/versions` 使用偏移分页：参数为 `limit` 和 `offset`，响应包含 `data`、`total`、`limit` 和 `offset`。

## 错误 {#errors}

错误使用 Agents 错误结构 `{"error":{"type","code","param":null,"message"}}`。错误码列表请参阅[错误](/api-reference/errors#agents-platform-errors)。
