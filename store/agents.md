---
title: Agents
description: Browse public Agent examples, clone them into your organization, test them in a Session, and deploy your copy as a Service or Schedule.
---

# Agents

Store Agents are working examples.

They show a useful pattern: which Model to use, which Skills and MCP tools help, and how the workflow is shaped.

## What you can do with a Store Agent

You can:

- inspect the configuration
- clone it into your organization
- customize your copy in Build Agent
- test your copy in a Session
- deploy your version as a Service for application access
- deploy your version as a Schedule for recurring work

## Public Agent vs your Agent

A public Agent is a starting point. It comes from the [Agent catalog](/api-reference/agents/catalog) and is read-only.

Your Agent is the clone you own, edit, test, and deploy as a Service or Schedule.

If you need to change the instructions, model, Skills, MCP connections, or output format, clone the public Agent first with `POST /v1/agents/catalog/{agent_id}/clone`.

## Next steps

- [Build Agent](/agents/)
- [Services](/agents/services)
- [Schedules](/agents/schedules)
- [Sessions](/agents/sessions)
