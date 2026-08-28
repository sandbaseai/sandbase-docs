---
title: Tools and credentials
description: Give a SandBase Agent the capabilities and API credentials it needs.
---

# Tools and credentials

APIs give your Agent access to real-world data and actions.

Choose capabilities in the Agent builder. SandBase handles how supported capabilities are made available to the runtime.

## What to add

Add tools when your Agent needs to:

- search the web
- read pages
- call a SaaS API
- fetch social or business data
- create or transform media
- trigger an external workflow

## Add a capability

1. Browse **APIs** or **Skills** in Store.
2. Open the Agent draft.
3. Add only the capabilities required by its instructions.
4. Add the required values under **Developer → Credentials**. SandBase resolves matching credentials when the Agent runs.
5. Test the Agent and inspect its Session events and tool activity.

Protocol-level integration details are documented in the [API Reference](/api-reference/), not required for the normal Agent-building flow.

## Skills vs APIs

APIs do things.

Skills teach the Agent how to do a job.

For example:

- Web Search API: fetch search results
- Research Skill: decide how to search, compare sources, and write the report

Most useful Agents use both.

## API credentials

Credentials are private values used to authenticate an API, such as `GITHUB_TOKEN`, `SLACK_WEBHOOK`, or `SERPER_API_KEY`.

- call them **credentials** in the Console and documentation
- store them outside prompts and Agent instructions
- treat the value as write-only after saving; the Console and public API return masked metadata rather than the stored value
- do not paste secret values into prompts, Agent instructions, or test input

## Next steps

- [APIs](/store/apis)
- [Skills](/store/skills)
- [API Credentials](/agents/api-credentials)
- [Define an Agent](/agents/agent-api)
- [Sessions](/agents/sessions)
