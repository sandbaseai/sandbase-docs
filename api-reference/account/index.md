---
title: Account API
description: Inspect the organization balance and recent execution history associated with an API key.
---

# Account API

Account endpoints are read-only and operate on the organization resolved from the Bearer API key.

| Operation | Endpoint |
|---|---|
| [Get balance](./balance) | `GET /v1/account/balance` |
| [List execution history](./history) | `GET /v1/account/history` |

Balance and cost values are exact decimal strings. Keep them as decimal values rather than converting them through
binary floating-point arithmetic.

Execution history is intended for recent operational inspection. Use billing records or exports for long-term
financial reconciliation.

History entries can contain stored request parameters and model output. Restrict access to the API key accordingly,
and do not copy history responses into logs or support tickets without reviewing them for sensitive data.
