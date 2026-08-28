---
title: Build Agent
description: Define, test, publish, and schedule reusable Agents in SandBase.
---

# Build Agent

Build Agent is where you define and test an Agent.

An Agent is a reusable workflow. It can use a Model, instructions, APIs, Skills, and credentials to do real work.

## What an Agent is

An Agent is not just a prompt.

It is a saved configuration that answers four questions:

| Question | Example |
|---|---|
| What should it do? | Research a company and return a sourced report |
| How should it think? | Use a reasoning Model with clear instructions |
| What can it use? | Search API, scrape API, internal Skills |
| How does it run? | Manual test, Service, or Schedule |

## Build first, connect later

SandBase separates building from delivery:

1. **Build Agent** — define and test the Agent.
2. **Services** — expose a tested Agent to an application or another supported client.
3. **Schedules** — run a tested Agent on a timer.
4. **Sessions** — inspect persistent Agent interaction and event history.

This keeps the workflow easy to understand: build the Agent once, then decide how it should be used.

## Agent lifecycle: Draft → Test → Service or Schedule → Session

### 1. Draft

Create an Agent with a clear name, outcome, Model, instructions, and expected output. Add APIs when it needs data or actions, Skills when it needs reusable know-how, and credentials when an API requires authentication.

Start with the smallest useful workflow. A focused Agent is easier to test, observe, and reuse than one broad prompt that tries to do everything.

### 2. Test

Run the draft in the Console with representative input. Inspect the final output, tool calls, timing, errors, and cost. Refine instructions and tools until both successful and failure cases behave predictably.

Do not publish a draft just because one happy-path test succeeded. Test missing input, unavailable tools, empty results, and output-format requirements.

### 3. Publish

Publish a tested Agent version as a Service when an application or another supported client needs a stable callable interface. The Service stays pinned to that version until you deliberately upgrade it, while the Agent can continue to evolve separately.

### 4. Schedule

Create a Schedule when the Agent should run later or repeatedly. Choose the Agent/version, cadence, input, and delivery behavior. A Schedule does not require a Service. Use Schedules for recurring reports, monitoring, synchronization, and routine operations.

### 5. Inspect Sessions

A direct or Service interaction is represented by a Session. Every Schedule trigger creates a separate DeploymentRun record and, on success, a new Session. Inspect Session events for Agent input, output, tool activity, and errors.

## Production checklist

- instructions define the expected result and failure behavior
- only necessary APIs and Skills are enabled
- required credentials are configured in **Developer → Credentials**, rather than copied into prompts or Agent instructions
- representative inputs and failure cases have been tested
- a stable version is published before external use
- scheduled work has an owner and a clear destination
- Sessions and Schedule trigger records are reviewed after launch

## Store Agents

Store Agents are examples and best practices.

You can test a public Agent, but if you need to change it, clone it into your workspace first. The cloned version becomes your Agent.

## Next steps

- [Define an Agent](/agents/agent-api)
- [Tools and credentials](/agents/mcp-tools)
- [Sessions](/agents/sessions)
- [Services](/agents/services)
- [Schedules](/agents/schedules)
