---
title: Quickstart
description: Start with SandBase through Setup, direct API calls, or Build Agent.
---

# Quickstart

Pick the path that matches what you want to do now.

## Option 1: Use SandBase in your AI tool

Choose this if you use Codex, Claude, Cursor, or Kiro and want more tools inside that app.

1. Open [Setup](https://www.sandbase.ai/console/setup).
2. Choose your AI tool and review its prerequisites.
3. Run the command or import steps shown for that client.
4. Complete authorization, then restart or reload the client if instructed.
5. Verify the SandBase entry and make one safe tool request.

To change what the connected tool can discover, open [Workspace Services](https://www.sandbase.ai/console/setup/installed).

For example, after adding a web search API, you can ask:

> Research this company and give me a sourced customer brief.

Learn more: [Setup](/setup/).

## Option 2: Call a Model or API

Choose this if you are adding one capability to your app.

1. Browse the live [Model Store](https://www.sandbase.ai/models) or [API Store](https://www.sandbase.ai/apis).
2. Open the detail page.
3. Copy the request.
4. Call it with your SandBase API key.

Example Model call:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Summarize this customer feedback."}]
  }'
```

Learn more: [First API Call](/getting-started/first-call).

## Option 3: Build an Agent

Choose this if the work has multiple steps or should be reused.

1. Open [Build Agent](https://www.sandbase.ai/console/agents).
2. Define the Agent instructions.
3. Pick a Model.
4. Add APIs and Skills.
5. Test a run.
6. Publish a selected version as a Service, or create a Schedule.

Learn more: [Build Agent](/agents/).

## What to do next

- [Store](/store/) — find Models, APIs, Agents, and Skills
- [Setup](/setup/) — install capabilities into AI tools
- [Build Agent](/agents/) — create reusable Agents
- [API Reference](/api-reference/) — integrate with code
