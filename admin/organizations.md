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
| **Owner** | Full workspace access, including changing member roles. |
| **Admin** | Manage keys and billing, and add or remove non-owner members. |
| **Member** | Use the workspace and its API keys without member-management access. |

## Create a Team Organization

1. Open the account menu at the top right of the Console.
2. Choose **Create Team**, or open **Developer → Team** and select **Create team**.
3. Enter a **Team name**, then select **Create team**.
4. Select **Add member**, enter the **Account email** of an existing SandBase account, and choose a **Workspace role**: **Member** or **Admin**.

An added member must already have a SandBase account. Owners can change member roles; owners and admins can remove
non-owner members.

## Switch Organizations

If you belong to multiple organizations, switch between them in the account menu, or use the **Switch workspace** strip on **Developer → Team**. Your API keys and billing are scoped to the active organization.

## Balance and billing

Each organization has its own balance. Model calls, API calls, Service calls, Schedule-triggered work, and runtime work are charged against this balance. See [Billing](/admin/billing) for details.
