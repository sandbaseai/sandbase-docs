---
title: Billing and credits
description: Review the SandBase organization balance, buy credits with Stripe or Airwallex, set up auto top-up, redeem coupons, and understand API-key spending controls.
---

# Billing and credits

This page covers billing management in the [SandBase Console](https://www.sandbase.ai/console). For rates and cost optimization, see [Pricing](/guides/billing).

SandBase bills supported workloads from the organization balance. Current prices, offers, payment providers,
minimum top-up amounts, and regional availability are shown in the Console and may change independently of this
guide.

## Balance

Open [Developer → Billing](https://www.sandbase.ai/console/billing). The **Credits** page shows the active organization's:

| Item | What it means |
|------|---------------|
| **Available balance** | Ready to use across Models and APIs |
| **Credit limit** | Workspace spending allowance |
| **Current level** | The account tier and its concurrency |

The same balance appears on the Console Dashboard **Balance** card and in the site header when you are signed in.
Treat the Console as the source of truth for promotions and checkout terms; do not automate its internal network
requests.

## Buy credits

1. Open [Billing](https://www.sandbase.ai/console/billing) and confirm **Credits go to** shows the workspace you want to fund.
2. Under **Buy credits**, choose a preset amount or enter a **Custom amount** in USD. The minimum top-up is shown on the page.
3. If more than one **Payment provider** is offered, choose **Stripe** (global cards and wallets) or **Airwallex** (cards and local payment methods).
4. Review **Pay**, **Bonus**, and **Receive** in the preview, then select **Continue with Stripe** (or the provider you chose) and complete the hosted checkout.
5. Confirm the updated balance under **Credit transactions** before starting a cost-sensitive workload.

SandBase never stores card details; the provider hosts the payment page.

### First top-up bonus

When the account and workspace have never topped up, **Current offers** shows a first top-up bonus. The page states
the bonus percentage and its cap. One bonus applies per account and per workspace, and refunds reclaim the bonus
proportionally. The bonus appears as its own row in **Credit transactions**.

## Auto top-up

**Auto Top-up** refills the balance with a saved card when it drops below a threshold. It currently supports Stripe
only, and only workspace owners and admins can manage it.

1. Under **Payment cards**, select **Add Card** and save a card in Stripe.
2. Select **Turn on auto top-up**, then set **When balance goes below**, **Top-up amount**, an optional **Monthly limit**, and the card.
3. Check **I authorize these automatic charges** and confirm.

Once the monthly limit is reached, auto top-up stops for the rest of the calendar month (UTC). Automatic charges
appear in **Credit transactions** with the channel `Auto top-up · Stripe`.

## Redeem a coupon

Enter the **Coupon code** under **Redeem a coupon**, then select **Redeem credit**. A coupon applies to the active
workspace only, so confirm the selected organization first.

## Spending controls

| Control | Scope | Behavior |
|---------|-------|----------|
| Organization funding boundary | Whole org | Available balance plus any configured credit limit; an unfunded request can return HTTP 402 |
| Key spending limit | Per API key | Optional per-key cap, bounded by the org balance |
| Auto top-up monthly limit | Whole org | Caps automatic charges per calendar month (UTC) |

To set a per-key spending limit, see [API Keys](/getting-started/api-keys).

## Activities and Analysis

[Developer → Activities](https://www.sandbase.ai/console/activities) has two tabs:

- **Request History** lists individual requests with API key, model, status, latency, and cost.
- **Usage** shows requests and cost over 7 or 30 days, **Model APIs by Archived Spend**, and **Billing Records**. Both tables have **Export CSV**. The billing-records export includes a **Free Quota** column that marks calls covered by the daily free quota.

[Developer → Analysis](https://www.sandbase.ai/console/analytics) adds **Overview**, **Cost analysis**, and
**Health diagnostics** for the last 7 or 30 complete UTC days.

For public pricing and task-cost contracts, see [Pricing and Usage](/guides/billing) and
[Get Task Cost](/api-reference/tasks/cost).
