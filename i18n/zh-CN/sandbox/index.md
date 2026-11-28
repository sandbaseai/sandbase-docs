---
i18nSource: 4191d2eb16a594f5
title: Sandbox 概览与能力
description: 使用 E2B SDK 或 SandBase Console 创建沙箱，查看状态、日志和指标，并体验独立的实验性 Playground。
---

# Sandbox 概览与能力 {#sandbox-overview-and-capabilities}

Sandbox 提供隔离环境，用于运行命令、执行代码以及读写文件。你可以暂停实例、重新连接，并读回文件以验证持久化。

[快速入门 / E2B SDK](./quickstart) · [打开 Playground（实验性）](./playground)

使用[官方 E2B SDK](./quickstart) 将 Sandbox 集成到你的应用中。登录 [Sandbox Console](https://www.sandbase.ai/console/sandboxes) 可创建沙箱，并查看实例状态、日志和指标。产品介绍请参见 [Sandbox 产品概览](https://www.sandbase.ai/sandbox)。下面的演练和支持情况表介绍的是独立的实验性 Playground。

## 五分钟 Playground 演练 {#a-five-minute-playground-walkthrough}

1. 输入一个具有 Sandbox 权限的 [API 密钥](/getting-started/api-keys)。连接操作只会读取模板和实例。
2. 选择一个可用模板，确认资源提示，然后创建一个短时实例。
3. 运行系统信息或 Python 示例。在命令面板旁查看输出和进程事件。
4. 写入并验证一个文本文件，暂停实例，再恢复实例，然后再次读取同一文件。
5. 查看生命周期事件、指标、日志和机器时长记录。完成后删除你的实例。

刷新页面会清除页面中的凭据和本地操作历史，但不会删除沙箱。运行中的实例遵循服务器端超时设置。已暂停的实例可能仍会占用资源。请记录实例 ID，并在离开页面后使用你的组织工具核对和清理资源。

## 能力与边界 {#capabilities-and-boundaries}

| 能力 | Playground 支持情况 |
| --- | --- |
| 创建、列出、暂停、恢复、延长超时、删除 | 可用；变更类操作仅适用于在本页面会话中创建的实例 |
| 命令与文本文件 | 可用；命令最长运行 25 秒，文件编辑仅限 `/tmp/` 且不超过 32 KiB |
| 生命周期事件、日志、指标、机器时长 | 可用性因环境而异；请检查返回的结果 |
| AI 对话与对话上下文 | 未集成；需要模型配置和 Agent 工作负载 |
| PTY、应用端口、webhook、模板构建 | 此界面中不可用 |
| 快照与 fork | 此 Playground 中不可用 |

Shell 交互不是 AI 对话。实例恢复、文件持久化、进程存活和对话连续性需要分别验证。

## 理解事件 {#understanding-events}

**Sandbox lifecycle** 条目是刷新时获取的原生服务端事件，可能会有延迟。**Sandbox process** 条目描述进程启动和流式输出。**Playground** 条目记录本地请求的完成或失败，它们不是服务的生命周期事件。

列表为空并不能证明用量为零，缺少事件也不能证明操作失败。机器时长记录不是最终账单。在超时或连接中断后，请先核对实例，再尝试发起新的创建请求。

## 模板可见性 {#template-visibility}

模板可以是公开的，也可以是你的组织私有的。数量并不固定。没有名称的条目仍会显示，并以别名或 ID 作为备用标签。你能看到和使用哪些模板，取决于你的组织的访问权限和模板的可用性。

## 沙箱与 Agent Session {#sandboxes-and-agent-sessions}

Agent Session 在 SandBase 托管云中运行。它们与你通过 E2B SDK 创建的 Sandbox 实例相互独立，Agents API 也不会暴露 Sandbox 实例。参见 [Sessions](/agents/sessions)。
