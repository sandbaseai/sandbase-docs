---
i18nSource: 417ea5dc930a8786
title: Skills 与 MCP 工具
description: 为 SandBase Agent 提供可复用的 Skills 和远程 MCP 工具，并控制每个 Session 使用的版本和工具。
---

# Skills 与 MCP 工具 {#skills-and-mcp-tools}

Agent 通过两种方式获得能力：

- **Skills** 教会 Agent 如何完成某项工作。Skill 是一个带版本的 ZIP 包，包含指令和资源。
- **MCP 连接**让 Agent 通过 HTTPS 调用远程 MCP 服务器上的工具，可选择使用 [Secret](/agents/api-credentials) 进行认证。

大多数实用的 Agent 会同时使用两者：MCP 服务器负责获取数据或执行操作，Skill 则说明如何使用这些结果。

## Skills {#skills}

1. 打包一个包含 `SKILL.md`（带 `name` 和 `description` frontmatter）的文件夹，并压缩该文件夹本身（`zip -r release-notes.zip release-notes/`，最大 5 MiB）。ZIP 的顶层必须是该文件夹；若 `SKILL.md` 位于 ZIP 根目录，会返回 `400 invalid_request`。
2. 使用 `POST /v1/skills` 上传，multipart 字段名为 `files`。响应包含一个 `skl_` ID 和 `default_version: "1"`。
3. 在 Agent 的 `skills` 数组中引用它。

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- 首次绑定时，`"version": null` 会在保存 Agent 时解析为该 Skill 当前的 `default_version`。`"2"` 这样的字符串则明确选择该版本。
- 保存后的 Agent 会固定版本。修改 Skill 的默认版本不会升级已有的 Agent 或它们的新 Session。如需升级，请用明确的版本更新 Agent；对已有绑定发送 `null` 会保留其固定版本。
- 使用 `POST /v1/skills/{skill_id}/versions` 上传新版本，并通过 `default=true` 或 `POST /v1/skills/{skill_id}` 切换默认版本。
- 如果 Skill 被停用，引用它的 Agent 在创建新 Session 时会失败并返回 `400 skill_not_found`。

你也可以在 [Skills 目录](/api-reference/skills/catalog)中浏览公开的 Skills。完整流程请参阅 [Skills API](/api-reference/skills/)。

## SandBase 内置工具 {#built-in-sandbase-tools}

每个新 Agent 都能直接使用 SandBase 自带的工具，无需任何配置。通过 `sandbase_discover`、`sandbase_inspect` 和 `sandbase_run`，Agent 可以在目录中查找模型或 API，读取其 schema 和价格，并使用你的密钥调用。创建时若省略 `mcp_connections`，Agent 会获得以下默认配置：

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **你发送的列表会替换默认配置。** 如需添加自己的 MCP 服务器并保留 SandBase 工具，请在列表中包含内置条目。
- **`builtin:sandbase` 要求 `server_label: "sandbase_builtin"`。** 使用其他标签，或在其他连接上使用该标签，都会返回 `400`。
- **如需创建不带工具的 Agent，** 请发送 `"mcp_connections": []`。
- **内置工具免费。** 你只需为 Agent 通过它们调用的模型和 API 付费。

## MCP 连接 {#mcp-connections}

1. 如果 MCP 服务器需要 Bearer 令牌，请为其确切 URL [创建 Secret](/agents/api-credentials)。
2. 使用 `POST /v1/mcp-connections` 注册服务器：

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. 在 Agent 的 `mcp_connections` 数组中引用该连接：

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| 字段 | 含义 |
|---|---|
| `connection_id` | 你组织中的 `mcp_` 连接 ID，或表示 SandBase 内置服务器的 `builtin:sandbase` |
| `server_label` | 以字母开头；可包含字母、数字、`_` 和 `-`；最多 64 个字符；在同一 Agent 内唯一 |
| `allowed_tools` | 省略或为 `null` 时允许服务器提供的所有工具；`[]` 表示不允许任何工具；列表则只允许其中列出的名称（最多 256 个名称，每个非空且不超过 128 字节） |
| `required` | Session 是否必须加载该服务器 |

一个 Agent 最多可引用 32 个连接。Session 启动时，组织内的连接必须处于 `active` 状态。

### SandBase 内置工具 {#built-in-sandbase-tools-1}

创建 Agent 时不传 `mcp_connections`，会选择 SandBase 内置服务器。如需在自己的服务器之外显式保留它，请在数组中包含以下条目：

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

显式数组会替换整个选择；上面仅含自定义服务器的示例不包含内置服务器。发送 `[]` 可禁用所有 MCP 工具。更新 Agent 时省略该字段会保留现有选择；传 `null` 会返回 `400`。内置条目无需创建 MCP 连接或 Secret。请勿发送已废弃的 `use_sandbase_mcp` 字段。

::: info 与 OpenAI 的差异
OpenAI 的 Agents API 以内联方式声明 MCP 服务器，即 `tools: [{"type": "mcp", ...}]`。SandBase 对这种形式返回 `400`：请将服务器注册为连接资源，并在 `mcp_connections` 中引用。OpenAI SDK 没有 `/v1/mcp-connections` 或 `/v1/secrets` 的方法，因此请使用 `client.post(...)` 调用它们，并通过 `extra_body`（Python）或请求体（Node.js）传入 `mcp_connections`。参阅 [OpenAI 兼容性](/agents/openai-compatibility#mcp-connections-with-the-sdk)。
:::

## 变更与运行中的 Session {#changes-and-running-sessions}

每个 Session 在启动时会冻结其 Agent 版本、Skill 版本和 MCP 连接配置。

- 替换连接或轮换其 Secret 后，新 Session 会使用新配置；已有 Session 保留其快照。
- 停用连接或吊销其 Secret 会阻止新 Session 启动，并拒绝使用它的已有 Session 的后续输入。正在执行的工具调用不会被中断。

## 不要在提示词中放置令牌 {#keep-tokens-out-of-prompts}

请将令牌存储为 Secret。不要将其放入 instructions、Session 输入、metadata 或 Skill 包中：任何能访问该 Agent 或 Session 的人都能读取这些内容。

## 后续步骤 {#next-steps}

- [MCP 工具的凭据](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [定义 Agent](/agents/agent-api)
