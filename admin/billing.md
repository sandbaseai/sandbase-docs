---
title: Billing
description: Manage your organization balance, top up credits, and configure spending controls in the Console.
---

# Billing

This page covers billing management in the [SandBase Console](https://www.sandbase.ai/console). For rates and cost optimization, see [Pricing](/guides/billing).

SandBase bills supported workloads from the organization balance. Current prices, credit offers, payment methods,
minimum top-up amounts, and regional availability are shown in the Console and may change independently of this
guide.

## Balance and credits

Open **Console → Billing** to view the current organization balance and the credit or payment options available to
your account. Treat the Console as the source of truth for promotions and checkout terms; do not automate its
internal network requests.

## Add credits

1. Go to **Console → Billing**
2. Choose **Add Credits** when it is available for your organization
3. Review the amount, payment method, fees, and terms shown in checkout
4. Confirm the resulting balance before starting a cost-sensitive workload

## Spending Controls

| Control | Scope | Behavior |
|---------|-------|----------|
| Organization balance | Whole org | Hard cap — the API returns HTTP 402 when depleted |
| Key spending limit | Per API key | Optional per-key cap, bounded by the org balance |
| Alert threshold | Whole org | Notification behavior shown in the current Console |

To set a per-key spending limit, see [API Keys](/getting-started/api-keys).

## Activities and invoices

The **Console → Activities** page shows request history and usage together. For public pricing and task-cost
contracts, see [Pricing and Usage](/guides/billing) and [Get Task Cost](/api-reference/tasks/cost).
