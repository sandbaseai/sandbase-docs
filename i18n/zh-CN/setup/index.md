---
i18nSource: 28b1ef75a197824a
title: 连接 AI 工具
description: 只需一条提示词或一条 CLI 命令，即可让 Claude Code、Codex、Cursor、Kiro 等 AI 工具使用 SandBase 的 Models 和 API 目录。
---

# 连接 AI 工具 {#connect-ai-tools}

Console 中的 [AI tools](https://www.sandbase.ai/console/setup) 页面（**Build → AI tools**）可将 SandBase 连接到你正在使用的 Agent 或 AI 工具。连接后的工具可以搜索 SandBase 的 Models 和 API 目录，读取每个工具的输入结构和价格，并运行它们。每次调用都计入当前工作区的费用。

支持的客户端包括 Claude Code、Codex、Cursor、Kiro IDE 和 Kiro CLI、Windsurf、Gemini CLI、OpenCode、Qwen Code、Warp、Amp、Crush、OpenClaw、Hermes、Claude Desktop 和 ChatGPT。完整的最新列表请查看 AI tools 页面。

## 快速开始：粘贴一条提示词 {#quick-start-paste-one-prompt}

将下面这行粘贴到你的 Agent 中：

```text
set up https://www.sandbase.ai/SKILL.md
```

Agent 会读取 SandBase Skill、安装 CLI，并请你批准一次浏览器登录。你无需粘贴 API 密钥。当 Agent 报告客户端已配置完成后，请开启新会话或重启应用，以加载 `sandbase_*` 工具。

该 Skill 要求运行 Agent 的机器上安装 Node.js 20 或更高版本。

## 其他连接方式 {#other-ways-to-connect}

### CLI {#cli}

在终端中连接。不指定 `--client` 时，CLI 会配置它找到的所有受支持客户端：

```sh
npx -y @sandbaseai/cli@latest connect
```

如需只配置一个客户端，请传入其 id，例如 `codex`、`claude-code`、`cursor` 或 `kiro`：

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

安装脚本运行的是同一条命令：

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

如需在不修改本地配置的情况下列出安装程序可识别的客户端：

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` 会打开浏览器授权，为你批准的工作区创建一个 **CLI Login** 密钥，并且只写入属于 SandBase 的客户端配置。开源的 [SandBase CLI](https://github.com/sandbaseai/cli) 提供了每个客户端的说明文档。

### 手动配置 MCP 客户端 {#mcp-clients-you-configure-by-hand}

已登录用户可以在 [AI tools](https://www.sandbase.ai/console/setup) 页面的 **Other ways to connect** 下看到 MCP 服务器地址。使用 **Developer → API Keys** 中的 [API 密钥](/getting-started/api-keys)进行认证，并将密钥保存在客户端的机密配置中。

## 验证连接 {#verify-the-connection}

仅完成安装或授权并不能证明客户端已连接。请确认：

- 客户端中可以看到 SandBase 服务器或连接器
- 在新会话中可以发现 `sandbase_*` 工具
- 一条安全的自然语言请求能够成功完成

对于由 CLI 管理的客户端，在重新连接或更改配置后运行诊断：

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` 会检查本地凭据、MCP 条目和 Skill，然后与 SandBase 进行一次往返通信。最终的工具调用请务必在客户端内完成。

连接的工具发起的运行会连同费用一起显示在 [Activities](https://www.sandbase.ai/console/activities) 中。

## 故障排查 {#troubleshooting}

| 问题 | 检查项 |
|---|---|
| 工具未出现 | 开启新的客户端会话或重启应用，运行 `npx -y @sandbaseai/cli doctor --client <client>`，然后重试。 |
| 缺少授权 | 再次运行 `connect`，并为你要计费的工作区批准浏览器登录。 |
| 调用失败并返回 HTTP 402 | 在 [Billing](https://www.sandbase.ai/console/billing) 中为当前工作区充值。 |

## 移除托管配置 {#remove-the-managed-configuration}

仅移除某个客户端中属于 SandBase 的条目：

```sh
npx -y @sandbaseai/cli unregister --client codex
```

该命令只会移除能确认归属于 SandBase 的配置，不会改动无关条目或用户自行管理的条目。之后如果不再需要，请在 **Developer → API Keys** 下吊销对应的 **CLI Login** 密钥。

## 源代码与支持 {#source-and-support}

- [源代码](https://github.com/sandbaseai/cli)
- [npm 包](https://www.npmjs.com/package/@sandbaseai/cli)
- [问题与示例](https://github.com/sandbaseai/cli/discussions)
- [Bug 报告](https://github.com/sandbaseai/cli/issues/new/choose)

## 后续步骤 {#next-steps}

- [Models 和 APIs 目录](https://www.sandbase.ai/models)
- [Skill 教程](/guides/skills/)
- [构建 Agent](/agents/)
