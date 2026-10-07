---
title: "Site Agent Copilot"
description: "Give your web app an AI assistant that can actually click buttons, fill forms, and navigate pages — not just chat."
---

# Site Agent Copilot

> Turn any web application into an AI-navigable workspace. Users describe what they want; the Agent does it.

## The Problem

Your users get lost in complex UIs. They open support tickets asking "how do I change my billing plan?" when the answer is three clicks away. Traditional chatbots can answer questions but can't *do* anything.

## The Solution

Site Agent Copilot is an AI assistant that lives inside your web app and can:

- **Answer questions** from a knowledge base (pricing, features, how-to)
- **Operate the page** on behalf of users — navigate, click, type, select
- **Guide visually** — highlights elements before clicking, reports progress in chat

No API integration required. No backend changes. The Agent operates through the DOM with the same permissions as the logged-in user.

## How It Looks

```
User: "Help me create a new project"

Agent: Navigating to Projects page...
       ✓ Navigated to /projects
       Clicking "New Project"...
       ✓ Clicked
       Filling in project name...
       ✓ Done

Agent: I've created a blank project for you. 
       Want me to configure the settings too?
```

The user watches their page being operated in real-time, with elements briefly highlighted before each action.

## Architecture

```
┌──────────────────────────────────────────────┐
│  Browser                                      │
│  Chat Widget ←─ SSE ─→ Frontend Agent (DOM)   │
└───────────────────────┬──────────────────────┘
                        │ Session
┌───────────────────────┴──────────────────────┐
│  SandBase Cloud                               │
│  Embed API → Cloud Agent (Hermes + Knowledge) │
└──────────────────────────────────────────────┘
```

- **Cloud Agent** thinks and plans (runs in a sandbox)
- **Frontend Agent** executes DOM actions (runs in browser)
- **Session** connects them (SSE downstream, POST upstream)

## Use Cases

### SaaS Onboarding

Replace static product tours with a conversational guide:
- "Help me set up my workspace" → Agent navigates through setup wizard
- Adapts to what the user already configured vs. what's missing
- Works in any language the LLM supports

### Enterprise Admin Panels

Complex admin UIs with dozens of nested menus:
- "Set the production log level to debug" → Agent finds the right page, changes the dropdown, saves
- Faster than teaching users where every setting lives

### ERP / CRM Form Automation

Multi-step data entry:
- "Create an invoice for Acme Corp, $5,000, due in 30 days" → Agent fills the entire form
- Handles multi-page workflows that span several routes

### Accessibility

Users who can't easily navigate with a mouse:
- Voice input (via STT) → Agent operates the page
- Screen-reader-friendly: the Agent describes what it's doing

### Internal Tools Support

IT help desk for internal tools:
- Employees ask the copilot instead of filing tickets
- Agent either answers directly or performs the action for them

## Getting Started

Full guide: **[Site Agent integration](/guides/site-agent-integration)**

Quick version:

1. Create a SandBase Agent with `frontend_action` tool + knowledge skills
2. Create an Embed Config → get a publishable key
3. Add the widget to your frontend (one React component or one `<script>` tag)
4. Write a knowledge base describing your pages and operations

Time to first working demo: **~30 minutes**.

## Cost

- **Cloud Agent reasoning**: standard SandBase model pricing (e.g., Claude Sonnet 4 at $3/$15 per 1M tokens)
- **Frontend Agent (DOMExecutor)**: free — runs entirely client-side
- **Frontend Agent (PageAgentExecutor)**: ~$0.002 per action step (one LLM call for element location)

A typical 5-step page operation costs $0.01–$0.05 total.

## Limitations

- Only operates same-origin pages (can't navigate to external sites)
- React-controlled inputs may need custom event dispatching
- Dynamic content that loads after navigation needs a brief wait
- Not a replacement for proper UX — use it to supplement, not substitute

## Links

- [Integration Guide](/guides/site-agent-integration) — full technical setup
- [Agent API Reference](/agents/agent-api) — create and configure agents
- [Sessions](/agents/sessions) — persistent interaction and event streaming
- [alibaba/page-agent](https://github.com/alibaba/page-agent) — the DOM execution engine
