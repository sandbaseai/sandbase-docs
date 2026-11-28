---
i18nSource: 5b94f91222d138de
title: API 认证
description: 使用 Bearer token 以及受支持的协议兼容 API 密钥请求头对 SandBase API 进行认证。
---

# 认证 {#authentication}

SandBase 使用 API 密钥对公开 API 请求进行认证。本页介绍支持的接入方式和密钥管理实践。Console 的认证方式及其内部 API 不属于公开 API 契约。

## 认证方式 {#authentication-methods}

标准 SandBase `/v1/*` 端点要求使用 Bearer token。Anthropic Messages 和 Google Gemini 兼容操作还接受各自原生 SDK 所使用的 API 密钥位置。

### Bearer token {#bearer-token}

在 `Authorization` 请求头中携带密钥：

```http
Authorization: Bearer sk-your-api-key
```

这是兼容 OpenAI 的 SDK 所使用的标准方式。

### Anthropic Messages：x-api-key 请求头 {#anthropic-messages-x-api-key-header}

在 `x-api-key` 请求头中携带密钥：

```http
x-api-key: sk-your-api-key
```

此请求头仅适用于 `POST /v1/messages`。其他公开端点不会读取它；Chat Completions、`/v1/run` 和资源类 API 请使用 Bearer 认证。

### 优先级 {#priority}

仅对于 `POST /v1/messages`，两个请求头同时存在时以 `x-api-key` 为准。

### Google Gemini 兼容的 API 密钥 {#google-gemini-compatible-api-keys}

Gemini GenerateContent 和 Interactions 操作接受 `x-goog-api-key`、`Authorization: Bearer …` 或 `key` 查询参数，优先级依次递减。建议使用请求头，因为查询字符串中的凭据可能出现在日志和浏览器历史记录中。支持的路径请参阅 [Google Gemini](/api-reference/gemini-generate-content) 和 [Gemini Interactions](/api-reference/gemini-interactions)。

### 提取逻辑 {#extraction-logic}

标准端点只读取 `Authorization: Bearer <key>`。Anthropic Messages 中间件先读取 `x-api-key`，再回退到 Bearer 请求头。Agents 平台资源接受 `Authorization: Bearer` 或 `X-API-Key`（见下文）。[webhook Events API](/api-reference/webhooks)（`/events/webhooks*`）同样接受这两种请求头，两者同时存在时使用 Bearer 请求头。缺少受支持的凭据时返回 `401 Unauthorized`。

### Agents 平台资源 {#agents-platform-resources}

`/v1/agents*`（包括 `/v1/agents/sessions*`）、`/v1/mcp-connections*`、`/v1/secrets*` 和 `/v1/skills*` 接受通过以下任一请求头传递密钥：

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- 如果同时发送 `Authorization: Bearer` 和 `X-API-Key`，二者必须携带相同的密钥；值不同时返回 `401 unauthorized`。重复发送任一请求头同样返回 401。
- `OpenAI-Beta` 为可选项。如果提供，其值必须为 `agents=v1`。
- 读请求需要 `agents.read` 权限，写请求需要 `agents.write` 权限。在 Console 中创建的标准密钥同时拥有这两项权限。SandBase 签发的限定范围密钥（例如 CLI Login 密钥）会返回 `403 insufficient_scope`。
- `402 spending_limit_exceeded` 表示密钥的支出上限已用尽或组织余额不足。
- 失败响应使用 [Agents 错误信封](/api-reference/errors#agents-platform-errors)格式，而不是下文所示的扁平 `{"error": "…"}` 格式。

## API 密钥格式 {#api-key-format}

在 Console 中新建的 API 密钥格式如下：

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| 组成部分 | 说明 |
|-----------|-------------|
| `sk-` | 标准“secret key”前缀 |
| `xxxx...` | 由 32 个随机字节生成的 64 个十六进制字符 |

旧版 `sk-sb-...` 密钥在过期或被吊销之前仍可使用。客户端应将密钥视为不透明字符串，不要根据前缀或长度拒绝凭据。

::: warning
切勿在客户端代码、公开仓库或日志中暴露 API 密钥。请像对待密码一样对待它。
:::

## 创建 API 密钥 {#create-api-keys}

### 通过 Console {#via-console}

1. 登录 [SandBase Console](https://www.sandbase.ai/console)
2. 打开 **Developer → API Keys**
3. 点击 **New key**
4. 为密钥取一个描述性名称（例如“Production Backend”“Development”）
5. 立即复制密钥，之后将不再显示

### 密钥属性 {#key-properties}

| 属性 | 说明 |
|----------|-------------|
| 名称 | 便于识别的可读标签 |
| 组织 | 该密钥所属的组织 |
| 启用 | 密钥是否处于启用状态 |
| 支出上限 | 可选的单个密钥支出上限 |
| 过期时间 | 可选的过期日期 |
| 创建时间 | 密钥的创建时间 |

在 Console 中创建的标准密钥以组织级权限访问已文档化的公开 API。SandBase 签发的凭据（例如 CLI Login 密钥）可能带有受限范围。Console 不提供为标准密钥自选范围的功能。

## 密钥生命周期 {#key-lifecycle}

### 轮换 {#rotation}

轮换密钥的步骤：

1. 在 Console 中创建新密钥
2. 更新应用以使用新密钥
3. 确认新密钥在生产环境中正常工作
4. 吊销旧密钥

::: tip
务必先创建新密钥再吊销旧密钥，以免服务中断。
:::

### 吊销 {#revocation}

已吊销的密钥无法再认证新请求。API 返回 `401 Unauthorized`，消息如下：

```json
{"error":"API key has been revoked"}
```

### 过期 {#expiration}

密钥可以设置过期日期。已过期的密钥返回 `401 Unauthorized`，消息如下：

```json
{"error":"API key has expired"}
```

## 端点认证要求 {#endpoint-authentication-requirements}

| 端点 | 认证方式 | 说明 |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API 密钥（Bearer） | Chat Completions |
| `POST /v1/responses` | API 密钥（Bearer） | 兼容 OpenAI 的 Responses API |
| `POST /v1/messages` | API 密钥（Bearer 或 x-api-key） | Anthropic Messages |
| `/v1beta/models/*` | API 密钥（x-goog-api-key、Bearer 或查询参数 key） | Gemini GenerateContent |
| `/v1beta/interactions*` | API 密钥（x-goog-api-key、Bearer 或查询参数 key） | Gemini Interactions |
| `/v1/agents*`、`/v1/mcp-connections*`、`/v1/secrets*`、`/v1/skills*` | API 密钥（Bearer 或 X-API-Key） | Agents 平台资源 |

SandBase Console 使用独立的浏览器认证流程。其内部请求不是受支持的公开端点，集成方不得使用。

## 组织隔离 {#organization-isolation}

API 密钥的作用范围限定在组织内。使用密钥认证时：

- 只能访问属于你所在组织的资源
- 用量和账单按组织统计

## 错误响应 {#error-responses}

| HTTP 状态码 | 消息 | 原因 |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | 未提供密钥 |
| 401 | `invalid API key` | 数据库中找不到该密钥 |
| 401 | `API key has been revoked` | 密钥已被禁用 |
| 401 | `API key has expired` | 密钥已过期 |
| 402 或协议特定的 403 | `API key spending limit exceeded` | 已达到密钥级支出上限；请查阅该端点文档中的错误契约 |
| 403 | `API key is not authorized for this endpoint` | 限定范围的密钥被用于其范围之外的端点 |

除 `403` 范围错误外，这些消息都以扁平的 `{"error":"<message>"}` 响应体返回。在模型和账户端点上，范围错误使用 `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`；在 Agents 平台资源上，则使用 `code` 为 `insufficient_scope` 的 [Agents 错误信封](/api-reference/errors#agents-platform-errors)。

## 安全最佳实践 {#security-best-practices}

### 建议 {#do}

- **将密钥存储在环境变量中**：切勿在源代码中硬编码密钥
- **为每个环境使用独立的密钥**：开发、预发布和生产环境使用不同的密钥
- **设置过期日期**：根据安全策略选择合适的轮换周期
- **监控用量**：在 Console 中检查异常活动
- **仅为需要访问公开 API 的工作负载使用标准密钥**：限定范围的 CLI Login 凭据应保留在其托管流程中

### 禁止 {#don-t}

- **不要将密钥提交到版本控制**：将 `.env` 加入 `.gitignore`
- **不要在不相关的应用之间共用一个密钥**：独立的密钥让轮换和事故响应更安全
- **不要在客户端代码中暴露密钥**：始终通过后端代理请求
- **不要在日志中记录 API 密钥**：在应用日志中对密钥进行脱敏

### 环境变量示例 {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## 按密钥的速率限制 {#rate-limiting-by-key}

请求限制按组织分配，由该组织的所有 API 密钥共享，因此创建更多密钥并不会提高限制。API 不公布通用的默认数值，也不提供剩余配额响应头。

关于限制详情和 429 响应的处理方式，请参阅[速率限制](/guides/rate-limiting)。
