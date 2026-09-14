---
title: 快速上手
description: 注册 SandBase 账号、创建组织，然后调用 API、在官网试用、接入 AI 工具，或搭建 Agent。
pageClass: quickstart-page
prev: false
next: false
---

# 快速上手

<QuickstartOnboard locale="zh" />

## 1. 注册账号 {#create-account}

SandBase 使用 GitHub 或 Google 登录，没有单独的邮箱密码注册。

1. 打开 [注册 / 登录](https://www.sandbase.ai/login){target="_blank"}。
2. 完成安全验证，然后选择 **Sign in with GitHub** 或 **Sign in with Google**。
3. 在授权窗口中确认访问。
4. 确认进入 [Console](https://www.sandbase.ai/console){target="_blank"}。

第一次登录会自动创建账号和 **personal workspace**。试用前不必先建组织。

如果出现欢迎额度，可以先不绑卡就开始。当前余额以 [Console Credits](https://www.sandbase.ai/console/billing){target="_blank"} 为准。

## 2. 创建组织 {#create-organization}

API Key、用量和账单都属于组织。一个人试用时，留在 personal workspace 即可。多人要共享 Key 和花费时，再创建团队。

| 工作区 | 适用场景 |
|---|---|
| **Personal** | 第一次登录自动创建，每个用户一个。 |
| **Team** | 共享成员、Key 和余额。公司或项目用这个。 |

### 2.1 创建团队 {#create-team}

1. 打开 [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"}，或在 Console 顶部菜单选择 **Create Team**。
2. 输入团队名称，创建 workspace。
3. 确认 Console 顶部已切换到这个团队作为当前组织。
4. 选择 **Add member**，填入对方已有 SandBase 账号的邮箱。

被邀请的人必须先有 SandBase 账号。如果还没有，把 [这个页面](/getting-started/quickstart-cn) 发给他们，让他们先登录，再添加。

如果你属于多个组织，在 Console 顶部切换。Key 和账单跟随 **当前选中的** 组织。角色说明见 [Organizations](/admin/organizations)。

## 3. 接入 SandBase {#connect}

按现在要做的事选一条路径，其他路径以后再加。先确认当前组织，避免 Key 和已连接的工具落到错误的 workspace。

### 3.1 调用 API {#call-api}

适合给自己的应用增加一项能力。

1. 在 [Console → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} 创建 [API key](/getting-started/api-keys)。立刻复制，密钥只显示一次。
2. 在 Store 里筛选能力，打开详情页：
   - [大语言模型](https://www.sandbase.ai/models){target="_blank"} — 按提供商、能力、上下文和价格筛选
   - [图像 / 视频模型](https://www.sandbase.ai/models/image-video){target="_blank"} — 筛选文生图、图生图、文生视频、图生视频等多模态模型
   - [APIs](https://www.sandbase.ai/apis){target="_blank"} — 按平台和数据源筛选 API 资源
3. 复制请求，用你的 SandBase API key 调用。

Model 调用示例：

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Summarize this customer feedback."}]
  }'
```

了解更多：[First API Call](/getting-started/first-call)。

### 3.2 在官网使用 {#use-on-website}

适合先在网站上试用，还不写代码、也不接 AI 客户端。

1. 登录后打开 Store：
   - [大语言模型](https://www.sandbase.ai/models){target="_blank"}
   - [图像 / 视频模型](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. 筛选并打开详情页。
3. 在页面上发起一次请求，确认返回结果。

了解更多：[Store](/store/)。

### 3.3 在 AI 中使用 {#use-in-ai-tool}

适合已经在用 Codex、Claude、Cursor、Kiro 或其他受支持客户端，希望在这个应用里直接使用 Models、APIs 和 Services。

1. 打开 [Setup](https://www.sandbase.ai/console/setup){target="_blank"}。
2. 选择你的 AI 工具，并查看它的前置条件。
3. 按页面提示运行命令或完成导入。
4. 完成授权；如有提示，重启或重新加载客户端。
5. 确认出现 SandBase 条目，并发起一次安全的工具请求。

要调整已连接工具能发现哪些能力，打开 [Workspace Services](https://www.sandbase.ai/console/setup/installed){target="_blank"}。

例如，接入网页搜索 API 后，可以这样问：

> 调研这家公司，并给出有来源的客户简报。

了解更多：[Connect AI tools](/setup/)。

### 3.4 搭建 Agent {#build-agent}

适合多步骤、需要复用的工作。

1. 打开 [Build Agent](https://www.sandbase.ai/console/agents){target="_blank"}。
2. 编写 Agent 指令。
3. 选择 Model。
4. 添加 APIs 和 Skills。
5. 测试一次运行。
6. 把选定版本发布为 Service，或创建 Schedule。

了解更多：[Build Agent](/agents/)。

## 4. 确认已可用 {#confirm-it-works}

同时满足下面几点，就可以开始用了：

- Console 顶部显示的是你打算使用的组织。
- 完成了其中一种接入：API 调用、官网试用、AI 工具，或 Agent。
- 一次请求成功。

如果失败，检查当前组织、Key，以及 [Errors](/guides/error-handling)。workspace 没有余额时，到 [账单和充值](https://www.sandbase.ai/console/billing){target="_blank"} 充值。

## 5. 账单和用量 {#billing-and-usage}

登录后，在当前组织下查看花费和用量：

<QuickstartResources locale="zh" group="ops" />

## 6. 接下来可以看 {#next-steps}

<QuickstartResources locale="zh" group="catalog" />

- [API keys](/getting-started/api-keys) — 创建和轮换组织 Key
- [Store](/store/) — 在官网试用 Models、APIs 和 Agents
- [Setup](/setup/) — 把能力装进 AI 工具
- [Build Agent](/agents/) — 创建可复用的 Agent
- [API Reference](/api-reference/) — 用代码接入
