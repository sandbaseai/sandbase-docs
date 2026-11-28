---
i18nSource: dab112fdbbc56799
title: MCP 工具凭据
description: 将只写的 Bearer token 存储为 Secret，使 Agent 能够调用需要认证的 MCP 服务器。
---

# MCP 工具凭据 {#credentials-for-mcp-tools}

当 MCP 服务器需要认证时，将其 Bearer token 存储为 **Secret**，并将该 Secret 关联到 [MCP 连接](/agents/mcp-tools#mcp-connections)。执行环境只会把该 token 发送给对应的服务器。

## Secret 的工作方式 {#how-secrets-work}

- `kind` 始终为 `mcp_bearer`：即某个 MCP 服务器的 Bearer token。
- 每个 Secret 绑定一个确切的 `server_url`。只有 `server_url` 匹配的连接才能使用它。如需用于其他 URL，请另建一个 Secret。
- token 只写不读。API 返回 Secret 的名称、URL、状态和 `row_version`，从不返回 token。
- Secret 不是环境变量。它们不会注入 Agent 运行时，Agent 也无法读取。

早期版本的 SandBase 会存储工作区级或 Agent 级凭据，并将其作为 `GITHUB_TOKEN` 等环境变量注入。该模式已停用，相关记录不会迁移。请将仍需要的值在 MCP 连接上重新创建为 Secret。

## 通过 API 操作 {#with-the-api}
使用 API 创建、轮换和吊销 Secret。本指南即为 API 契约；从 Agent 编辑器打开的 Console 凭据页面不作为 Secret 行为的参考。请从受信任的后端调用这些端点，切勿在浏览器代码中调用：它们需要 SandBase API 密钥和明文 token。

| 方法 | 路径 | 用途 |
|---|---|---|
| `POST` | `/v1/secrets` | [创建 Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [列出 Secret](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [获取 Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [轮换 token](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [吊销 Secret](#revoke-a-secret) |

所有写操作都需要 `Idempotency-Key`（1-128 字节，首尾不能有空白）。Secret 对象包含 `id`（`sec_` 前缀）、`name`、`kind`、`server_url`、`status`、`row_version`、`created_at` 和 `updated_at`。`status` 在 token 存储过程中为 `pending`，可用时为 `active`，吊销后为 `disabled`。`created_at` 和 `updated_at` 为 RFC 3339 时间戳字符串。

### 创建 Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` 必须为 `mcp_bearer`。
- `server_url` 必须是 HTTPS，且不含用户信息、查询参数或片段。该 Secret 仅适用于这个确切的 URL。
- `name` 和 `token` 为必填项且不能为空。`name` 最长 128 字节，`token` 最长 16384 字节，`server_url` 最长 2048 字节。

响应为 `201 Created`，不包含 token。[创建 MCP 连接](/api-reference/mcp-connections/#create-a-connection)时，将 `sec_` ID 用作 `secret_id`。

### 列出 Secret {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

采用偏移分页，返回 `data`、`total`、`limit` 和 `offset`。`limit` 默认为 20，上限为 200；缺失、无效或非正数时使用 20。`offset` 默认为 0；无效或非正数时使用 0。按返回的 `limit` 递增，直到 `offset + data.length >= total`。已禁用的 Secret 仍会出现在列表中。

### 获取 Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### 轮换 Secret {#rotate-a-secret}

将 `SECRET_ROW_VERSION` 设置为通过获取 Secret 得到的最新 `row_version`。

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

轮换会替换 token，但保留同一个 Secret 和 `server_url`。`token` 和正整数 `row_version` 为必填项，Secret 必须处于 `active` 状态，且 `row_version` 必须与最新值一致。返回 `201 Created`。新的 Session 使用新 token；已启动的 Session 继续使用其冻结时的凭据。

### 吊销 Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

返回 `204 No Content`，并将 `status` 设为 `disabled`。使用该 Secret 的连接对新 Session 以及现有 Session 的后续输入都将失效。吊销无法撤销：请创建新的 Secret 并替换连接。

### 错误与重试 {#errors-and-retries}

错误使用 [Agents 错误信封](/api-reference/errors#agents-platform-errors)格式。字段无效或写操作缺少幂等键时返回 `400 invalid_request`；Secret 不存在或无权访问时返回 `404 not_found`。`row_version` 过期、生命周期状态不兼容，或以不同输入复用创建键时返回 `409 conflict`。重试前请重新读取 Secret，并为每次新的写操作使用新的键。

## 安全 {#security}

- 从受信任的后端创建和轮换 Secret，切勿在浏览器代码中操作。
- 像上文的 `$GITHUB_MCP_TOKEN` 那样，从自己的密钥存储或环境中读取 token，而不是将其粘贴到脚本中。
- 不要将 token 写入指令、Session 输入、元数据或 Skill 包中。
- 一旦 token 可能泄露，立即吊销对应的 Secret，然后新建一个并替换连接。

## 后续步骤 {#next-steps}

- [Skills 与 MCP 工具](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
