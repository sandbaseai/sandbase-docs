---
i18nSource: 1b5099685e9df6ce
title: Agent 目录
description: 浏览公开 Agents，并将其克隆到你的组织。
---

# Agent 目录 {#agent-catalog}

目录列出了 SandBase 发布、可供复用的 Agents。目录条目为只读。克隆某个条目后，你的组织中会得到一个私有 Agent，可以对其进行编辑、运行和部署。

| 方法 | 路径 | 用途 |
|---|---|---|
| `GET` | `/v1/agents/catalog` | 列出公开 Agents |
| `GET` | `/v1/agents/catalog/{agent_id}` | 获取单个公开 Agent，可通过 `?version=` 指定版本 |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | 将其复制到你的组织 |

## 列出目录中的 Agents {#list-catalog-agents}

使用游标分页，参数为 `limit`（1-100）、`after` 和 `order`。

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

每个条目包含 `id`、`object: "agent"`、`visibility: "public"`、`version`、`name`、`description`、`model`、`created_at` 和 `updated_at`。

## 获取目录中的 Agent {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` 为可选参数，必须是正整数。详情响应额外包含只读的 `configuration` 对象（名称、描述、模型、指令、运行时配置、元数据、工具、文本、推理和 Skills）。

## 克隆目录中的 Agent {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

请求体可包含可选的 `version`（正整数，默认为当前公开版本）和 `name`（最多 128 个字符）。响应为 `201 Created`，返回完整的 [Agent 对象](./create)，并在你的组织中分配新的 `agt_` ID。`Idempotency-Key` 为可选项；发送一个固定的键，可避免重试时创建第二个副本。

克隆完成后，[创建 Session](/api-reference/sessions/create) 进行测试。
