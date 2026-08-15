---
title: Billing
description: Manage your organization balance, top up credits, and configure spending controls in the Console.
---

# Billing

This page covers billing management in the [SandBase Console](https://www.sandbase.ai/console). For rates and cost optimization, see [Pricing](/guides/billing).

SandBase uses **pay-as-you-go** pricing — no subscriptions, no monthly fees. You only pay for what you use.

## Free Tier

New accounts receive **$1 in free credits**. No credit card required.

## Top Up

1. Go to **Console → Billing**
2. Click **Add Credits** and enter an amount ($5 minimum)
3. Complete payment
4. Balance updates immediately

## Payment Methods

- Credit/debit card (Visa, Mastercard, Amex)
- Apple Pay / Google Pay

## Spending Controls

| Control | Scope | Behavior |
|---------|-------|----------|
| Organization balance | Whole org | Hard cap — the API returns HTTP 402 when depleted |
| Key spending limit | Per API key | Optional per-key cap, bounded by the org balance |
| Alert threshold | Whole org | Email notification when the balance drops below a set amount |

To set a per-key spending limit, see [API Keys](/admin/api-keys).

## Activities and invoices

The **Console → Activities** page shows request history and usage together. For a breakdown of charges, see [Pricing](/guides/billing#usage-tracking).
