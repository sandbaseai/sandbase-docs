---
title: "Site Agent integration"
description: Add an AI Copilot to any web application that can navigate pages, click buttons, and fill forms on behalf of users — powered by SandBase Agents.
---

# Site Agent integration

Add an AI Copilot to your web application that understands your product, answers questions, and operates the UI on behalf of users through natural language.

## How It Works

```
Your Web App (browser)
├── Chat Widget          — floating bubble + chat panel
└── Frontend Agent       — receives instructions, executes DOM actions
         ↕  Session (SSE down, POST up)
SandBase Platform
├── Embed API            — session lifecycle, event streaming
└── Cloud Agent (Hermes) — reasoning, planning, knowledge retrieval
```

The architecture separates concerns:

- **Cloud Agent** (runs in SandBase's AgentCore sandbox): thinks, plans, retrieves knowledge, issues action commands
- **Frontend Agent** (runs in the user's browser): receives commands, manipulates the DOM, reports results
- **Session**: the bidirectional channel connecting them — SSE for downstream events, POST for upstream results

The Cloud Agent never touches your backend or database. It operates exclusively through the DOM, with the same permissions as the logged-in user.

---

## Quick Start (5 minutes)

### 1. Create the Cloud Agent

```bash
curl -X POST https://api.sandbase.ai/default/v1/agents \
  -H "Authorization: Bearer $SANDBASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Site Copilot",
    "slug": "site-copilot",
    "model": {"name": "claude-sonnet-4", "max_tokens": 4096},
    "system": "You are a helpful site assistant. Answer user questions from your knowledge base. When the user asks you to perform an action on the page, use the frontend_action tool. After each action you receive a Page Snapshot with the current interactive elements — use it to decide the next step.",
    "tools": [{
      "name": "frontend_action",
      "description": "Execute a DOM action in the user browser. Returns the result and a page snapshot.",
      "input_schema": {
        "type": "object",
        "required": ["action", "params"],
        "properties": {
          "action": {"type": "string", "enum": ["click","input","navigate","scroll","select"]},
          "params": {"type": "object"}
        }
      }
    }],
    "skills": [{
      "type": "knowledge",
      "name": "site-structure",
      "content": "# Pages\n- /dashboard: Main dashboard\n- /users: User list\n- /users/create: Create user form (fields: name, email, role)\n- /settings: App settings\n\n# Operations\n- Create user: navigate /users → click Create → fill form → click Save"
    }]
  }'
```

### 2. Create an Embed Config

```bash
# Create environment
ENV_ID=$(curl -s -X POST https://api.sandbase.ai/default/v1/environments \
  -H "Authorization: Bearer $SANDBASE_KEY" \
  -d '{"name":"copilot-env","config":{"type":"cloud","base_template":"hermes-agent"}}' \
  | jq -r '.id')

# Create embed config → get publishable key
curl -X POST https://api.sandbase.ai/default/v1/embeds \
  -H "Authorization: Bearer $SANDBASE_KEY" \
  -d "{
    \"agent_id\": \"YOUR_AGENT_ID\",
    \"environment_id\": \"$ENV_ID\",
    \"name\": \"Site Copilot\",
    \"title\": \"AI Assistant\",
    \"welcome_message\": \"Hi! I can help you navigate and use this app.\",
    \"theme_color\": \"#6366f1\"
  }"
# → { "publishable_key": "pk-sb-xxxxxxxx" }
```

### 3. Add to Your Frontend

**React:**

```tsx
// .env
VITE_SITE_AGENT_KEY=pk-sb-xxxxxxxx

// layout.tsx
import SiteAgentWidget from './components/site-agent/SiteAgentWidget'

export default function Layout() {
  return (
    <>
      <Outlet />
      <SiteAgentWidget />
    </>
  )
}
```

**Any website (script tag):**

```html
<script
  src="https://cdn.sandbase.ai/site-agent/widget.js"
  data-sandbase-key="pk-sb-xxxxxxxx"
  async
></script>
```

Done. Your site now has an AI assistant in the bottom-right corner.

---

## Action Protocol

The Cloud Agent communicates with the Frontend Agent through a simple JSON protocol:

### Actions

| Action | Params | Description |
|--------|--------|-------------|
| `click` | `{target: "Button text"}` | Click an element by its visible text |
| `input` | `{target: "Label", value: "text"}` | Type into an input field |
| `navigate` | `{path: "/users"}` | Navigate to a route (same-origin only) |
| `scroll` | `{direction: "down", amount: 300}` | Scroll the page |
| `select` | `{target: "Dropdown", value: "option"}` | Select from a dropdown |

### Target Resolution

The `target` field is resolved in order:
1. **Text match** — find an interactive element containing the text
2. **aria-label match** — find by `[aria-label="target"]`
3. **CSS selector** — try as a querySelector string

You can force a strategy with `target_type: "text" | "aria" | "selector"`.

### Page Snapshot

After each action, the Frontend Agent sends back a snapshot of the page:

```json
{
  "url": "/users/create",
  "title": "Create User",
  "elements": [
    {"tag": "input", "aria_label": "Name", "visible": true},
    {"tag": "input", "aria_label": "Email", "visible": true},
    {"tag": "select", "text": "Role", "visible": true},
    {"tag": "button", "text": "Save", "visible": true}
  ]
}
```

The Cloud Agent uses this to decide what to do next.

---

## Execution Engines

The Frontend Agent supports pluggable executors:

### Built-in: DOMExecutor (default)

Zero cost. Matches elements by exact text, aria-label, or CSS selector. Best for stable UIs with predictable element text.

### Built-in: PageAgentExecutor (alibaba/page-agent)

Uses an LLM to understand the DOM structure and intelligently locate elements. Costs ~$0.002 per action step. Best for complex/dynamic pages.

```env
VITE_PAGE_AGENT_ENABLED=true
VITE_PAGE_AGENT_BASE_URL=https://api.sandbase.ai/v1
VITE_PAGE_AGENT_API_KEY=sk-sb-xxx
```

### Custom Executor

Implement the `ActionExecutor` interface:

```typescript
import { use, type ActionExecutor } from '@/lib/site-agent/frontendAgent'

const custom: ActionExecutor = {
  name: 'my-executor',
  async execute(action) {
    // Your logic here
    return 'Action completed'
  },
}
use(custom)
```

---

## Knowledge Base Tips

The quality of the knowledge base directly determines how accurately the Agent operates your UI.

**Do:**
- List all page routes with descriptions
- Describe form fields (name, type, validation)
- Write step-by-step operation guides for common tasks
- Note UI quirks (e.g., "Save button is disabled until all required fields are filled")

**Don't:**
- Include CSS selectors in knowledge (use readable element descriptions instead)
- Describe internal API endpoints (Agent doesn't call APIs)
- Write code examples (Agent operates through DOM, not code)

---

## Security

| Mechanism | Behavior |
|-----------|----------|
| Same-origin only | `navigate` blocked for external URLs |
| Rate limit | Max 2 actions/second |
| Destructive action gate | Pauses for confirmation on delete/remove/revoke |
| Consecutive action limit | Pauses after 20 actions without user interaction |
| Stop button | User can halt execution at any time |

---

## Troubleshooting

**Agent says "Element not found"**
→ The target text doesn't match any visible interactive element. Check your knowledge base — the element text might differ from what you wrote (capitalization, trailing spaces, dynamic text). Switch to PageAgentExecutor for fuzzy matching.

**Widget doesn't appear**
→ Check that `VITE_SITE_AGENT_KEY` is set and the embed config is enabled. The widget hides automatically on `/embed/chat` routes.

**Actions execute but page doesn't update**
→ Likely a React state issue. If using DOMExecutor, dispatching `input`/`change` events may not trigger React's synthetic event system. Use PageAgentExecutor, or implement a custom executor that uses React Testing Library-style utilities.

**Session reconnects constantly**
→ Check that the Agent + Environment are properly configured and the AgentCore sandbox is running. Verify with `GET /embed/v1/config` using your publishable key.
