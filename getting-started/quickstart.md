---
title: Quickstart
description: Create a SandBase account, set up an organization, then call an API, try it on the website, connect an AI tool, or build an Agent.
pageClass: quickstart-page
---

# Quickstart

<QuickstartOnboard />

## 1. Create your account {#create-account}

SandBase uses GitHub or Google. There is no separate email-and-password signup.

1. Open [Create account / Sign in](https://www.sandbase.ai/login){target="_blank"}.
2. Complete the security check, then choose **Sign in with GitHub** or **Sign in with Google**.
3. Approve access in the provider window.
4. Confirm you land in the [Console](https://www.sandbase.ai/console){target="_blank"}.

First login creates your account and a **personal workspace**. You do not need to create an organization before you can try SandBase.

If a welcome credit appears, you can start without adding a payment method. The **Balance** card on the Console Dashboard and [Billing](https://www.sandbase.ai/console/billing){target="_blank"} show the current balance.

## 2. Create an organization {#create-organization}

API keys, usage, and billing belong to an organization. Stay in the personal workspace if you are evaluating alone. Create a team when several people will share keys and spend.

| Workspace | When to use it |
|---|---|
| **Personal** | Created automatically on first login. One per user. |
| **Team** | Shared members, keys, and balance. Create this for a company or project. |

### 2.1 Create a team {#create-team}

1. Open [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"}, or choose **Create Team** in the account menu at the top right of the Console.
2. Enter a **Team name**, then select **Create team**.
3. Confirm the account menu now shows that team as the active workspace.
4. On **Developer → Team**, select **Add member**, enter the **Account email** of an existing SandBase account, and choose the **Workspace role** (Member or Admin).

An invited person must already have a SandBase account. If they do not, send them [this page](/getting-started/quickstart) so they can sign in first, then add them.

If you belong to more than one organization, switch in the account menu. Keys and billing follow the **active** organization. See [Organizations](/admin/organizations) for roles.

## 3. Connect SandBase {#connect}

Pick the path that matches the work you need to do now. You can add the others later. Confirm the active organization first so keys and connected tools land in the right workspace.

### 3.1 Call an API {#call-api}

Choose this if you are adding one capability to your app.

1. Create an [API key](/getting-started/api-keys) in [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} with **New key**. Copy it immediately; it is shown only once.
2. Filter the Store and open a detail page:
   - [Language models](https://www.sandbase.ai/models){target="_blank"} — filter by provider, capabilities, context, and price
   - [Image and video models](https://www.sandbase.ai/models/image-video){target="_blank"} — filter multimodal models such as text-to-image, image-to-image, text-to-video, and image-to-video
   - [APIs](https://www.sandbase.ai/apis){target="_blank"} — filter API resources by platform and data source
3. Copy the request and call it with your SandBase API key.

Example Model call:

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Summarize this customer feedback."}]
  }'
```

Learn more: [First API Call](/getting-started/first-call).

### 3.2 Use SandBase on the website {#use-on-website}

Choose this if you want to try a Model, API, or Agent in the browser first — no client install and no code.

1. Sign in, then open the Store:
   - [Language models](https://www.sandbase.ai/models){target="_blank"}
   - [Image and video models](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Filter and open a detail page.
3. Run one request on that page and confirm a result comes back.

Learn more: [Store](/store/).

### 3.3 Use SandBase in your AI tool {#use-in-ai-tool}

Choose this if you use Claude Code, Codex, Cursor, Kiro, or another supported client and want SandBase Models and APIs inside that app.

1. Open [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} in the Console.
2. Paste this line into your agent:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Approve the browser sign-in the agent opens. There is no API key to paste.
4. Start a new session or restart the app so the SandBase tools load.
5. Make one safe tool request.

Prefer a terminal? Run `npx -y @sandbaseai/cli@latest connect`. The connected tool can search the whole catalog and runs are billed to the active workspace.

For example, you can ask:

> Research this company and give me a sourced customer brief.

Learn more: [Connect AI tools](/setup/).

### 3.4 Build an Agent {#build-agent}

Choose this if the work has multiple steps or should be reused.

1. Open [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} and select **Create**.
2. Fill in **Overview** and **Instructions**.
3. Pick a **Model**.
4. Add Skills and MCP tools under **Capabilities**, then set **Runtime**.
5. Select **Create & Chat** to test it in a Session.
6. Call the tested version from your app on the Agent's **API** tab, or deploy it as a Service or Schedule.

Learn more: [Build Agent](/agents/). To do the same from code with the official OpenAI SDK, see [OpenAI compatibility](/agents/openai-compatibility).

## 4. Confirm it works {#confirm-it-works}

You are ready when all of the following are true:

- The Console account menu shows the organization you intend to use.
- You completed one path: an API call, a run on the website, a connected AI tool, or an Agent.
- One request succeeds.

If the request fails, check the active organization, the key, and [Errors](/guides/error-handling). Top up in [Billing](https://www.sandbase.ai/console/billing){target="_blank"} when the workspace has no remaining balance.

## 5. Billing and usage {#billing-and-usage}

After you sign in, review spend for the active organization:

<QuickstartResources group="ops" />

## 6. What to do next {#next-steps}

<QuickstartResources group="catalog" />

- [API keys](/getting-started/api-keys) — create and rotate organization keys
- [Store](/store/) — try Models, APIs, and Agents on the website
- [Connect AI tools](/setup/) — give your AI tool the SandBase catalog
- [Build Agent](/agents/) — create reusable Agents
- [API Reference](/api-reference/) — integrate with code
