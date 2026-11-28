---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: 注册可供 Agent 调用的远程 HTTPS MCP 服务器。
---

# MCP Connections API {#mcp-connections-api}

MCP 连接用于注册一个可通过 HTTPS 访问的远程 MCP 服务器。Agent 在 `mcp_connections` 中引用连接；每个 Session 会在启动时冻结连接配置。连接 ID 使用 `mcp_` 前缀。如需使用 Bearer 令牌向服务器进行身份验证，请先为同一 URL 创建一个 [Secret](/agents/api-credentials#with-the-api)。

| 方法 | 路径 | 用途 |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [创建连接](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [列出连接](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [获取连接](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [替换连接](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [启用连接](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [禁用连接](#disable-a-connection) |

所有写操作都需要 `Idempotency-Key`（1-128 字节，不能有首尾空白）。连接对象包含 `id`、`name`、`server_url`、`secret_id`（设置时）、`status`（`active` 或 `disabled`）、`row_version`、`created_at` 和 `updated_at`。

## 创建连接 {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` 为必填项且不能为空，最多 128 字节。
- `server_url` 必须是 HTTPS，且不能包含用户信息、查询参数或片段（最多 2048 字节）。
- `secret_id` 为可选项。匿名服务器可省略。设置时，该 Secret 必须为 `active`，且其 `server_url` 必须与此 `server_url` 完全一致，否则请求失败（Secret 未激活返回 409，URL 不匹配返回 400）。

返回 `201 Created`。

## 列出连接 {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

基于偏移量分页，返回 `data`、`total`、`limit` 和 `offset`。`limit` 默认为 20，上限为 200；缺失、无效或非正值时使用 20。`offset` 默认为 0；无效或非正值时使用 0。按返回的 `limit` 递增，直到 `offset + data.length >= total`。已禁用的资源仍会显示在列表中。

## 获取连接 {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## 替换连接 {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` 会同时替换 `name`、`server_url` 和 `secret_id`；省略 `secret_id` 会使连接变为匿名连接。`row_version` 为必填项，且必须与 Get Connection 返回的当前值一致。返回 `200 OK` 及更新后的连接。已禁用的连接在替换后仍保持禁用，直到你启用它。

## 启用连接 {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` 为必填项，必须是与当前资源一致的正整数。返回 `200 OK` 及该连接。启用后连接 ID 保持不变。启用不会恢复已吊销的 Secret；请先用新的有效 Secret 替换该连接。

## 禁用连接 {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

返回 `204 No Content`，并将 `status` 设为 `disabled`。新 Session 无法使用该连接，已冻结该连接的现有 Session 会拒绝后续输入。已在运行的工具调用不会被中断。

## 变更与运行中的 Session {#changes-and-running-sessions}

Session 在启动时冻结连接设置。替换连接或轮换其 Secret 后，新 Session 使用新配置，现有 Session 保留其快照。禁用连接或吊销其 Secret 会同时阻止新 Session 和现有 Session 的后续输入。

## 错误与重试 {#errors-and-retries}

错误使用 [Agents 错误结构](/api-reference/errors#agents-platform-errors)。字段无效或写操作缺少幂等键时返回 `400 invalid_request`；资源不存在或无权访问时返回 `404 not_found`。`row_version` 已过期、生命周期状态不兼容，或以不同输入复用创建/更新的键，会返回 `409 conflict`。发起新的更新前请重新读取资源，并为每个新的写操作使用新的键。

`created_at` 和 `updated_at` 是 RFC 3339 时间戳字符串。
