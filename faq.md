---
title: FAQ
description: Frequently asked questions about SandBase Setup, Store, Models, APIs, Agents, Services, Schedules, Sessions, and billing.
---

# Frequently Asked Questions

## What is SandBase?

SandBase helps Agents connect to the real world.

You can use ready-made Models and APIs, install them into AI tools with Setup, or build reusable Agents and publish or schedule them.

## Who is SandBase for?

SandBase is mainly for three groups:

- **AI tool users** who want useful capabilities inside Codex, Claude, Cursor, or Kiro
- **builders** who want to call Models and APIs directly
- **FDEs and teams** who build reusable Agents for customers or internal workflows

## What is Store?

Store is where you browse capabilities:

- Models
- APIs
- Agents
- Skills

You can inspect, test, install, call, or clone depending on the kind of capability.

## What is Setup?

Setup installs capabilities into the AI tool you already use.

It manages Models, APIs, and Services. Skills are used inside Build Agent, not usually installed directly as Setup items.

## What is Build Agent?

Build Agent is where you define and test an Agent.

An Agent combines instructions, a Model, APIs, Skills, and credentials into one reusable workflow.

## Is an Agent different from an API?

An Agent can be used like an API after you publish it.

Before publishing, it is a configuration you can edit and test. After publishing, it becomes callable by your app or Setup.

## What are Services?

Services are tested Agents made available outside Build Agent through a stable callable surface. The underlying API resource is an Endpoint.

Use them when your app, your users, or your AI tools need to call an Agent.

## What are Schedules?

Schedules run an existing Agent later or repeatedly.

They do not create Agents from scratch. Build and test the Agent first, then schedule it.

## What are Sessions and DeploymentRuns?

A Session is a persistent Agent interaction and its event history. A Service can create or continue a Session. Each Schedule trigger creates a distinct DeploymentRun (`drun_*`) which links to a new Session when Session creation succeeds.

## What are Environments?

Environments hold private values and runtime settings your Agents need, such as API keys for external tools.

## Where do Models live?

Models are listed separately in Store because they are important building blocks.

You can call a Model directly, add it to Setup, or use it inside an Agent.

## Do I need to write code?

Not always.

Use Setup if you want capabilities inside your AI tool without writing code.

Use API Reference if you want to call SandBase from your application.

Use Build Agent if you want reusable multi-step work.

## How do I get an API key?

Open the Console and go to API Keys.

Use the key as:

```http
Authorization: Bearer sk-YOUR_KEY
```

## How does billing work?

SandBase uses credits and usage-based billing.

Models, APIs, Agents, and runtime work may have different costs. Check the Console for current usage and pricing.

## Next steps

- [Getting Started](/getting-started/)
- [Store](/store/)
- [Setup](/setup/)
- [Build Agent](/agents/)
- [API Reference](/api-reference/)
