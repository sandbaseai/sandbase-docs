---
i18nSource: d560e2374d91a8d6
title: 账单与额度
description: 查看 SandBase 组织余额，通过 Stripe 或 Airwallex 购买额度，设置自动充值，兑换优惠券，并了解 API 密钥消费控制。
---

# 账单与额度 {#billing-and-credits}

本页介绍如何在 [SandBase Console](https://www.sandbase.ai/console) 中管理账单。费率与成本优化请参阅[定价](/guides/billing)。

SandBase 从组织余额中扣除受支持工作负载的费用。当前价格、优惠、支付服务商、
最低充值金额和地区可用性以 Console 中显示的为准，可能会独立于本指南
发生变化。

## 余额 {#balance}

打开 [Developer → Billing](https://www.sandbase.ai/console/billing)。**Credits** 页面显示当前组织的以下信息：

| 项目 | 含义 |
|------|---------------|
| **Available balance** | 可用于 Models 和 API 的余额 |
| **Credit limit** | 工作区的消费额度 |
| **Current level** | 账户等级及其对应的并发数 |

登录后，Console Dashboard 的 **Balance** 卡片和网站顶部也会显示同一余额。
促销活动和结账条款以 Console 为准；请勿对其内部网络请求
进行自动化调用。

## 购买额度 {#buy-credits}

1. 打开 [Billing](https://www.sandbase.ai/console/billing)，确认 **Credits go to** 显示的是你要充值的工作区。
2. 在 **Buy credits** 下选择预设金额，或在 **Custom amount** 中输入美元金额。页面上会显示最低充值金额。
3. 如果提供多个 **Payment provider**，可选择 **Stripe**（全球银行卡和钱包）或 **Airwallex**（银行卡和本地支付方式）。
4. 在预览中核对 **Pay**、**Bonus** 和 **Receive**，然后选择 **Continue with Stripe**（或你选择的服务商），完成托管结账流程。
5. 在启动对成本敏感的工作负载之前，先在 **Credit transactions** 中确认余额已更新。

SandBase 从不存储银行卡信息；支付页面由服务商托管。

### 首充奖励 {#first-top-up-bonus}

如果账户和工作区从未充值过，**Current offers** 中会显示首充奖励。页面会注明
奖励比例及上限。每个账户和每个工作区仅可获得一次奖励，退款时会按比例收回
奖励。奖励会在 **Credit transactions** 中单独列为一行。

## 自动充值 {#auto-top-up}

**Auto Top-up** 会在余额低于阈值时使用已保存的银行卡自动充值。目前仅支持 Stripe，
且只有工作区所有者和管理员可以管理此功能。

1. 在 **Payment cards** 下选择 **Add Card**，在 Stripe 中保存一张银行卡。
2. 选择 **Turn on auto top-up**，然后设置 **When balance goes below**、**Top-up amount**、可选的 **Monthly limit** 以及银行卡。
3. 勾选 **I authorize these automatic charges** 并确认。

达到月度上限后，自动充值会在当月剩余时间内（按 UTC 日历月）停止。自动扣款
会显示在 **Credit transactions** 中，渠道为 `Auto top-up · Stripe`。

## 兑换优惠券 {#redeem-a-coupon}

在 **Redeem a coupon** 下输入 **Coupon code**，然后选择 **Redeem credit**。优惠券仅适用于当前
工作区，请先确认所选组织。

## 消费控制 {#spending-controls}

| 控制项 | 范围 | 行为 |
|---------|-------|----------|
| 组织资金上限 | 整个组织 | 可用余额加上已配置的信用额度；资金不足的请求可能返回 HTTP 402 |
| 密钥消费上限 | 单个 API 密钥 | 可选的单密钥上限，受组织余额约束 |
| 自动充值月度上限 | 整个组织 | 限制每个日历月（UTC）的自动扣款总额 |

如需设置单个密钥的消费上限，请参阅 [API 密钥](/getting-started/api-keys)。

## 活动与分析 {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) 包含两个标签页：

- **Request History** 列出每个请求，包括 API 密钥、模型、状态、延迟和费用。
- **Usage** 显示 7 天或 30 天内的请求数和费用、**Model APIs by Archived Spend** 以及 **Billing Records**。两个表格均支持 **Export CSV**。账单记录导出文件包含 **Free Quota** 列，用于标记由每日免费额度覆盖的调用。

[Developer → Analysis](https://www.sandbase.ai/console/analytics) 提供 **Overview**、**Cost analysis** 和
**Health diagnostics**，覆盖最近 7 天或 30 天的完整 UTC 日。

公开定价和任务费用约定请参阅[定价与用量](/guides/billing)和
[获取任务费用](/api-reference/tasks/cost)。
