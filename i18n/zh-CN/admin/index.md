---
i18nSource: adfacb669489863e
title: 账户与账单
description: 管理 SandBase 组织、API 密钥、账单、用量和限制。
---

# 账户与账单 {#account-and-billing}

组织设置决定用量归属、应用的认证方式以及支出的监控方式。

## 管理内容 {#what-you-manage}

| 领域 | 用途 |
|---|---|
| [组织](/admin/organizations) | 管理工作区边界、成员和所有权 |
| [API 密钥](/getting-started/api-keys) | 创建、轮换和吊销应用凭据 |
| [账单与额度](/admin/billing) | 查看余额、购买额度、设置自动充值，并在 Activities 和 Analysis 中查看用量 |
| [定价与用量](/guides/billing) | 查询模型定价、每日免费 API 调用次数以及单个任务的费用 |
| [速率限制](/guides/rate-limiting) | 了解请求限制和安全的重试方式 |

## 推荐设置 {#recommended-setup}

1. 确认当前所在的组织正确。
2. 为开发、预发布和生产环境分别创建 API 密钥。
3. 按应用和环境为密钥命名。
4. 首批生产请求发出后，查看 Activities 和账单。
5. 及时吊销不再使用的密钥，并排查异常用量。

## 所有权与访问 {#ownership-and-access}

API 密钥和用量归属于组织。切换组织会改变 Console 中可见的资源、密钥和账单上下文。修改生产配置前，请先核对所选组织，并与使用该密钥的应用协调好密钥轮换。

## 安全基础 {#security-basics}

- 将密钥存储在环境变量或密钥管理服务中
- 切勿将密钥粘贴到 Agent 指令、源代码、截图或支持消息中
- 每个应用和环境使用独立的密钥
- 密钥可能已泄露时立即吊销
- 在 Activities 中监控异常的请求量、模型或端点
