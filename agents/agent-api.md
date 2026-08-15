---
title: Define an Agent
description: Configure a SandBase Agent with a model, instructions, APIs, Skills, and API credentials.
---

# Define an Agent

An Agent starts as a configuration.

You define what it should do, which Model it should use, and which capabilities it can access.

## Minimal Agent shape

```yaml
name: customer-research
model: deepseek/deepseek-v4-flash
instructions: |
  Research a company and return a concise customer brief.
tools:
  - web_search
  - page_scraping
skills:
  - sandbase/research-report
credentials:
  - SERPER_API_KEY
```

The exact UI can change, but the idea stays the same:

- **Model** decides how the Agent thinks.
- **Instructions** tell it what outcome to produce.
- **APIs** connect it to real-world data and actions.
- **Skills** give it reusable know-how.
- **Credentials** keep API keys and other secrets outside the prompt. SandBase supplies them to the runtime as environment variables.

## Test before publishing

Run the Agent from the Console first.

Each run keeps the input, output, tool calls, errors, and trace together so you can debug it.

## Publish only when it works

When the Agent is tested, publish it as a callable Service, or create a Schedule for recurring work.

## Next steps

- [Tools and credentials](/agents/mcp-tools)
- [Sessions](/agents/sessions)
- [Services](/agents/services)
- [Schedules](/agents/schedules)
