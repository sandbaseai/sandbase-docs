---
i18nSource: 3dc57d405dbf561d
title: API 密钥
description: 如何创建、管理和保护用于认证 API 请求的 SandBase API 密钥。
---

# API 密钥 {#api-keys}

API 密钥用于对发往 SandBase 的请求进行认证。本指南介绍如何创建密钥、在请求中使用密钥以及如何保障密钥安全。

## 创建 API 密钥 {#create-an-api-key}

1. 登录 [SandBase Console](https://www.sandbase.ai/console)
2. 打开 **Developer → API Keys**（或直接访问 [API Keys](https://www.sandbase.ai/console/keys)）
3. 点击 **New key**
4. 输入一个具有描述性的 **Name**（例如 "Production Server"、"Local Development"）
5. 可选设置 **Spending limit**（留空表示不限）和 **Expires** 日期（留空表示永不过期）
6. 点击 **Create key**
7. 立即从 **API key created** 提示条中复制密钥，它只会显示一次

::: danger 重要
API 密钥仅在创建时显示一次。如果丢失，你需要重新创建。关闭对话框之前，请先妥善保存密钥。
:::

## 密钥格式 {#key-format}

在 Console 中新创建的 API 密钥以 `sk-` 为前缀，后跟 64 个十六进制字符：

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

现有的 `sk-sb-...` 密钥在过期或被吊销之前仍然有效。不要仅凭前缀来校验
凭据；请始终将完整的值视为不透明的机密信息。

## 认证方式 {#authentication-methods}

SandBase 支持两种在请求中传递 API 密钥的方式：

### Authorization 请求头（推荐） {#authorization-header-recommended}

使用标准的 `Authorization: Bearer` 请求头。这种方式与 OpenAI 和 Anthropic SDK 兼容：

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages：x-api-key 请求头 {#anthropic-messages-x-api-key-header}

`POST /v1/messages` 还接受 Anthropic 原生的 `x-api-key` 请求头：

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
在各模型网关中，只有 `POST /v1/messages` 会读取 `x-api-key`，且当两种支持的请求头同时存在时，它的优先级更高。
[Agents 平台资源](/api-reference/authentication#agents-platform-resources)也接受
`X-API-Key`。其他所有公开端点请使用 Bearer 请求头。
:::

## 密钥权限 {#key-permissions}

SandBase API 密钥的作用范围为**组织级别**：

- 在 Console 中创建的标准密钥可以调用该组织可用的公开 API 资源
- 用量计入拥有该密钥的组织
- 密钥可以设置可选的过期时间和消费上限
- SandBase 签发的凭据（例如 CLI Login 密钥）可能带有受限的权限范围，在范围之外使用时返回 `403`

目前 Console 不支持为标准密钥自选权限范围。CLI Login 密钥会在你连接 AI 工具时创建。API Keys 页面会将它们归入一个可展开的 **CLI Login** 行，且无法像标准密钥那样编辑。SandBase 为你自动创建的密钥会带有 **Auto-created** 标记；这类密钥没有密钥级上限，受账户余额约束。

密钥列表会显示每个密钥的 **Name**、**Key Prefix**、**Spent**、**Limit**、**Expires** 和 **Status**。使用 **Edit** 可修改标准密钥的名称、消费上限或过期时间。

请将每个密钥视为应用凭据，而不是个人密码。人员访问应通过组织成员身份管理，工作负载则使用 API 密钥。

## 环境策略 {#environment-strategy}

为每个应用和环境分别创建密钥：

| 密钥 | 示例名称 | 原因 |
|---|---|---|
| 本地开发 | `research-app-dev` | 轮换时不影响生产环境 |
| 预发布 | `research-app-staging` | 隔离测试用量和事故 |
| 生产 | `research-app-production` | 为生产环境指定明确的负责人并限制暴露面 |
| 临时自动化 | `release-check-2026-08` | 设置过期时间并可单独吊销 |

记录每个密钥的负责人和使用它的部署。轮换时，先部署新密钥并确认请求成功，然后再吊销旧密钥。

## 密钥过期与吊销 {#key-expiration-and-revocation}

### 过期 {#expiration}

创建密钥时，可以选择设置过期日期。密钥过期后将停止工作，请求会返回 `401 Unauthorized` 错误。

未设置过期日期的密钥在被手动吊销之前一直有效。

### 吊销密钥 {#revoking-a-key}

要吊销（停用）密钥：

1. 前往 [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. 找到要吊销的密钥
3. 点击 **Revoke**
4. 确认操作

已吊销的密钥无法再为新请求进行认证。吊销操作无法撤销；如果误吊销了密钥，请创建一个新密钥。

## 安全最佳实践 {#security-best-practices}

### 切勿将密钥提交到版本控制 {#never-commit-keys-to-version-control}

请改用环境变量或密钥管理服务：

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### 为不同环境使用不同的密钥 {#use-separate-keys-for-different-environments}

为开发、预发布和生产环境分别创建密钥。这样，即使开发密钥泄露，也可以在不影响生产环境的情况下将其吊销。

### 定期轮换密钥 {#rotate-keys-regularly}

定期创建新密钥并停用旧密钥。这样可以缩短密钥泄露时的暴露时间窗口。

### 监控活动 {#monitor-activity}

定期查看 **Developer → Activities**，留意请求量或用量的异常激增，这可能意味着密钥已泄露。**Request History** 支持按 API 密钥筛选。

如果密钥已暴露，请立即吊销，创建替代密钥，更新使用它的应用，并检查 Activities 和账单中是否有异常用量。不要等到计划的轮换时间再处理。

### 设置过期日期 {#set-expiration-dates}

对于临时访问（CI/CD 流水线、外包人员访问、演示），请设置过期日期，让密钥到期后自动失效。

## 故障排查 {#troubleshooting}

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| `401 - missing API key` | 请求中未提供密钥 | 添加 `Authorization: Bearer <key>` 请求头 |
| `401 - invalid API key` | 密钥不存在 | 检查是否有拼写错误，并确保包含完整的密钥 |
| `401 - API key has been revoked` | 密钥已在 Console 中被永久吊销 | 创建替代密钥 |
| `401 - API key has expired` | 密钥已超过过期日期 | 创建新密钥或延长过期时间 |
| `402 - API key spending limit exceeded` | 密钥已达到配置的消费上限 | 提高上限或使用另一个有权限的密钥 |
| `403 - insufficient_scope` | 受限凭据无法调用此端点 | 使用有权调用该端点的密钥 |

## 后续步骤 {#next-steps}

- [**首次 API 调用**](/getting-started/first-call)：通过完整的请求/响应演示进行一次详细的 API 调用
- [**认证**](/api-reference/authentication)：支持的请求头、生命周期以及各协议特有的错误
- [**API 参考**](/api-reference/)：完整的端点文档
