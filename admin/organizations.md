---
title: Organizations
description: Manage organizations, members, and roles on SandBase.
---

# Organizations

Organizations are the billing and access control unit in SandBase. API keys, balance, usage, and members all belong to an organization.

## Organization Types

| Type | Description |
|------|-------------|
| **Personal** | Auto-created on first login. One per user. |
| **Team** | Manually created. Multiple members with roles. |

## Member Roles

| Role | Permissions |
|------|-------------|
| **Owner** | Full access. Manage members, billing, keys, Setup, and Agents. |
| **Admin** | Manage keys, billing, Setup, and Agents. Cannot remove owner. |
| **Member** | Use API keys only. Read-only dashboard access. |

## Create a Team Organization

1. Go to Console → Settings
2. Click **Create Team**
3. Name your organization
4. Invite members by email

## Switch Organizations

If you belong to multiple organizations, switch between them in the Console header dropdown. Your API keys and billing are scoped to the active organization.

## Balance and billing

Each organization has its own balance. Model calls, API calls, Service calls, Schedule-triggered work, and runtime work are charged against this balance. See [Billing](/admin/billing) for details.
