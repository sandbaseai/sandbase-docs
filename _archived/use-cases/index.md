---
title: Site Agent Copilot
description: Design and integrate an AI copilot that can answer questions and operate a web application on behalf of users.
---

# Site Agent Copilot

Turn a web application into an AI-navigable workspace. Users describe what they want; the Agent answers questions, guides them, or completes the task directly in the interface.

This guide combines the product use case, architecture, and implementation path in one place.

## The problem

Users get lost in complex interfaces. They open support tickets for tasks that are only a few clicks away, while traditional chatbots can explain the steps but cannot perform them.

Site Agent Copilot closes that gap. It can:

- answer questions from product knowledge
- navigate pages, click buttons, type, scroll, and select options
- highlight elements and report progress
- complete multi-step workflows with the logged-in user's existing permissions

The Agent operates through the DOM, so the first version does not require a separate backend integration for every product action.

## How it works

```text
Your Web App
├── Chat Widget
└── Frontend Agent — receives instructions and executes DOM actions
         ↕ Session: SSE downstream, POST upstream
SandBase
├── Session lifecycle and event streaming
└── Cloud Agent — reasoning, planning, and knowledge retrieval
```

- **Cloud Agent** thinks, plans, retrieves knowledge, and issues actions.
- **Frontend Agent** runs in the browser and executes those actions.
- **Session** carries commands, results, and page snapshots between them.

The same pattern can later support web, mobile, desktop, or a custom executor. The Cloud Agent remains unchanged while the frontend execution layer adapts to the platform.

## Good use cases

### SaaS onboarding

Replace a static product tour with a conversational guide that adapts to what the user has already configured.

> “Help me set up my workspace.”

The Agent can create a team, invite members, and guide the user through remaining settings.

### Support with page guidance

Instead of only describing where an option lives, the Agent can navigate there and highlight it.

> “Where can I download my invoices?”

The Agent opens Billing, navigates to invoices, and points to the download action.

### Admin and internal tools

Natural language becomes a faster interface for deep menus and repetitive operational work.

> “Set the production log level to debug.”

The Agent finds the setting, changes it, and saves the result.

### Form automation

The Agent can complete multi-page ERP or CRM workflows from one user request.

> “Create an invoice for Acme Corp, $5,000, due in 30 days.”

### Accessibility

Voice or text instructions can help users who cannot easily navigate with a mouse or touchscreen.

## Quick start

### 1. Define the Cloud Agent

Create an Agent with product knowledge and a `frontend_action` tool. The tool should accept an action and parameters such as the target element, value, or path.

```json
{
  "name": "Site Copilot",
  "model": "deepseek/deepseek-v4-flash",
  "tools": [
    {
      "name": "frontend_action",
      "description": "Execute an action in the user's browser",
      "input_schema": {
        "type": "object",
        "required": ["action", "params"],
        "properties": {
          "action": {
            "type": "string",
            "enum": ["click", "input", "navigate", "scroll", "select"]
          },
          "params": { "type": "object" }
        }
      }
    }
  ]
}
```

### 2. Connect the frontend

Add the chat widget and Frontend Agent to the application shell. The frontend opens a session, receives action events, executes them, and returns the result plus an updated page snapshot.

### 3. Add product knowledge

Describe:

- page routes and their purpose
- important forms and fields
- common operations as step-by-step workflows
- validation requirements and UI quirks

Keep descriptions human-readable. Avoid coupling the knowledge base to fragile CSS selectors.

### 4. Test before publishing

Test common happy paths, validation errors, navigation delays, dynamic content, and permissions. Publish the Agent only after its action boundaries are clear.

## Action protocol

| Action | Typical parameters | Purpose |
|---|---|---|
| `click` | target | Click a visible control |
| `input` | target, value | Enter text into a field |
| `navigate` | path | Open a same-origin route |
| `scroll` | direction, amount | Move within the page |
| `select` | target, value | Choose an option |

After every action, return a page snapshot containing the current URL, title, and important interactive elements. The Cloud Agent uses that snapshot to plan the next step.

```json
{
  "url": "/users/create",
  "title": "Create User",
  "elements": [
    { "tag": "input", "aria_label": "Name", "visible": true },
    { "tag": "input", "aria_label": "Email", "visible": true },
    { "tag": "button", "text": "Save", "visible": true }
  ]
}
```

## Execution options

### DOM executor

Use deterministic matching by visible text, accessible label, or a stable selector. It is fast, runs client-side, and works best for predictable interfaces.

### Model-assisted executor

Use a model to interpret more complex or dynamic DOM structures when deterministic matching is not enough. This improves flexibility but adds latency and per-action cost.

### Custom executor

Implement the same action contract for a mobile app, desktop application, canvas UI, or specialized internal system.

## Safety and product boundaries

- Keep actions same-origin unless an external workflow is explicitly designed.
- Respect the permissions of the logged-in user.
- Require confirmation before destructive, financial, or irreversible actions.
- Show progress so users understand what the Agent is doing.
- Prefer stable accessible labels over CSS implementation details.
- Treat the copilot as a supplement to good UX, not a replacement for it.

## Limitations

- Dynamic content may require explicit readiness checks.
- Framework-controlled inputs may need native event dispatching.
- Ambiguous labels reduce deterministic element matching accuracy.
- Long workflows need clear recovery behavior when an intermediate step fails.

## Next steps

- [Define an Agent](/agents/agent-api)
- [Add APIs and Tools](/agents/mcp-tools)
- [Sessions](/agents/sessions)
- [Publish an Agent as a Service](/agents/services)
