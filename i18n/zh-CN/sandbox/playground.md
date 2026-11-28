---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground（实验性）
description: 使用你自己的 API 密钥试用真实的 SandBase sandbox。创建实例、运行命令、在暂停和恢复后验证文件，并查看生命周期事件。
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

使用你自己的密钥试用 Sandbox API。操作会连接到 **sandbox.sandbase.ai**，并可能产生费用。

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## 你的密钥由你掌控 {#your-key-stays-under-your-control}

- **仅保存在页面内存中。** 此 Playground 不会将你的 API 密钥或连接令牌保存到浏览器存储或 Cookie 中，不会放入 URL，也不会记录在页面活动或请求示例中。
- **随时清除。** 选择 **Clear key** 即可移除密钥、连接令牌和显示的活动记录，即使有请求正在运行也可以。刷新或离开此页面也会清除它们。重新连接时需要再次输入密钥。
- **仅用于你的请求。** 你的密钥会发送给 SandBase，用于认证你所请求的 Sandbox 操作。清除此页面不会吊销密钥；如有需要，请在 [Developer → API Keys](https://www.sandbase.ai/console/keys) 中吊销。

以上承诺仅涵盖此 Playground 对凭据的处理方式，并不意味着 Sandbox 活动或服务端用量记录会被删除。请避免在命令或文件中输入机密信息，因为这些内容可能会保留在你的 sandbox 中。

## 单独清理资源 {#clean-up-resources-separately}

清除密钥不会取消服务已接收的操作，也不会删除 sandbox。用完后请删除实例。如果创建结果未知，请先检查你的实例，再创建新实例。清除此页面之前，请保存清理时需要的实例 ID。

[概览与能力](./index) · [快速入门 / E2B SDK](./quickstart)
