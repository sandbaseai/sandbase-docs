---
title: Billing and credits
description: Review the SandBase organization balance, buy or redeem credits, and understand API-key spending controls.
---

# Billing and credits

This page covers billing management in the [SandBase Console](https://www.sandbase.ai/console). For rates and cost optimization, see [Pricing](/guides/billing).

SandBase bills supported workloads from the organization balance. Current prices, credit offers, payment methods,
minimum top-up amounts, and regional availability are shown in the Console and may change independently of this
guide.

## Balance and credits

Open [Console Credits](https://www.sandbase.ai/console/billing) to view the active organization's available balance,
credit limit, checkout options, coupons, and recent credit transactions. Treat the Console as the source of truth
for promotions and checkout terms; do not automate its internal network requests.

## Add credits

1. Open [Console Credits](https://www.sandbase.ai/console/billing).
2. Under **Buy credits**, enter the USD credit amount.
3. Choose **Continue with Airwallex**, then review and complete the hosted checkout.
4. Confirm the updated balance or transaction status before starting a cost-sensitive workload.

If you have a coupon, redeem it on the same page. A coupon applies to the active workspace, so confirm the selected
organization first.

## Spending Controls

| Control | Scope | Behavior |
|---------|-------|----------|
| Organization funding boundary | Whole org | Available balance plus any configured credit limit; an unfunded request can return HTTP 402 |
| Key spending limit | Per API key | Optional per-key cap, bounded by the org balance |

To set a per-key spending limit, see [API Keys](/getting-started/api-keys).

## Activities and usage

The **Console → Activities** page provides **Request History** and **Usage** tabs. Usage includes request and cost
summaries, model spend, billing records, and the CSV exports currently available in the Console. For public pricing
and task-cost contracts, see [Pricing and Usage](/guides/billing) and [Get Task Cost](/api-reference/tasks/cost).
