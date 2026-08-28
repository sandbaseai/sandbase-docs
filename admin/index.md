---
title: Workspace
description: Manage your SandBase organization, API keys, billing, usage, and limits.
---

# Workspace

Workspace settings control who owns usage, how applications authenticate, and how spending is monitored.

## What you manage

| Area | Use it for |
|---|---|
| [Organizations](/admin/organizations) | Manage the workspace boundary, members, and ownership |
| [API Keys](/getting-started/api-keys) | Create, rotate, and revoke application credentials |
| [Billing](/admin/billing) | Review credits, usage, and payment activity |
| [Rate Limits](/admin/rate-limits) | Understand request limits and safe retry behavior |

## Recommended setup

1. Confirm you are working in the correct organization.
2. Create separate API keys for development, staging, and production.
3. Name keys after their application and environment.
4. Review Activities and billing after the first production requests.
5. Revoke unused keys and investigate unexpected usage promptly.

## Ownership and access

API keys and usage belong to an organization. Switching organizations changes the resources, keys, and billing context visible in the Console. Before changing production configuration, verify the selected organization and coordinate key rotation with the applications that use it.

## Security basics

- store keys in environment variables or a secrets manager
- never paste keys into Agent instructions, source code, screenshots, or support messages
- use a separate key for each application and environment
- revoke a key immediately if it may have been exposed
- monitor Activities for unexpected volume, models, or endpoints
