---
title: Quick Start
description: Choose how to use SandBase — on the platform, through the API, or with your Agent. Find Skills and Tools, follow the steps, and start from the SDK or CLI repositories.
pageClass: quickstart-page
---

# Quick Start

## Choose how you want to use SandBase {#connect}

These are **three alternative ways to start**, not three steps you must complete. Use the same SandBase account and workspace across them.

<QuickstartPaths />

Just need a ready-made task? [Explore Tools](#use-tools) or [choose a Skill](#use-skills). You can browse public catalogs and documentation before signing in.

### Start from the open-source repositories

- **[SandBase — SDKs & examples](https://github.com/sandbaseai/sandbase)**: Python, TypeScript and Go clients, API examples, and hosted Agent workflows. Use this when building your own application.
- **[SandBase CLI & MCP](https://github.com/sandbaseai/cli)**: install and connect your AI tool, or discover and run capabilities from a terminal. Use this with your existing Agent.

## Before you start: sign in {#create-account}

Sign in before using a Playground, running a hosted Skill, or creating an API key. Free tools that work without an account can be used directly. **Already signed in? Skip this step** and check that the account menu shows the workspace you intend to use.

SandBase uses GitHub or Google. There is no separate email-and-password signup.

1. Open [Create account / Sign in](https://www.sandbase.ai/login){target="_blank"}.
2. Complete the security check, then choose **Sign in with GitHub** or **Sign in with Google**.
3. Approve access in the provider window.
4. Return to the page you were using, or open the [Console](https://www.sandbase.ai/console){target="_blank"}.

First login creates your account and a **personal workspace**. You do not need to create an organization before you can try SandBase.

If a welcome credit appears, you can start without adding a payment method. The **Balance** card on the Console Dashboard and [Billing](https://www.sandbase.ai/console/billing){target="_blank"} show the current balance.

## On the platform {#use-on-website}

Choose this if you want to try a Model, API, or Agent in the browser first — no client install and no code.

1. Sign in, then open the catalog:
   - [Language models](https://www.sandbase.ai/models){target="_blank"}
   - [Image and video models](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Open a model or API detail page and select **Playground** where available.
3. Enter the required inputs, such as a prompt, image, search query, or URL. Check the displayed price before running.
4. Run the request and view the returned text, data, image, video, or task status.

You do not need to create a separate API key for the website Playground. If a capability does not offer a Playground, use its **API** tab and follow the API path below.

## Through the API {#call-api}

Choose this if you are adding one capability to your app.

1. Reuse a valid key for your intended workspace, or create an [API key](/getting-started/api-keys) in [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} with **New key**. Copy it immediately; it is shown only once.
2. Filter the catalog and open a detail page:
   - [Language models](https://www.sandbase.ai/models){target="_blank"} — filter by provider, capabilities, context, and price
   - [Image and video models](https://www.sandbase.ai/models/image-video){target="_blank"} — filter multimodal models such as text-to-image, image-to-image, text-to-video, and image-to-video
   - [APIs](https://www.sandbase.ai/apis){target="_blank"} — filter API resources by platform and data source
3. Open the **API** tab, copy the example request, and fill in that endpoint's required fields.
4. Store your SandBase key in a server environment variable and run the request. Do not put it in browser code or a public repository.
5. Check the response. For an asynchronous task, follow the endpoint's status-polling example until it completes.

Example language-model call for **Bash / zsh** (macOS, Linux, or Windows with WSL). Replace the placeholder key locally. For other environments, use the Python, TypeScript, or Go examples in the repository below; shell commands are not interchangeable with PowerShell.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Start from code: [SandBase SDKs & examples on GitHub](https://github.com/sandbaseai/sandbase).

Learn more: [First API Call](/getting-started/first-call).

## With your Agent {#use-in-ai-tool}

Choose this if you use Claude Code, Codex, Cursor, Kiro, or another supported client and want SandBase Models and APIs inside that app.

**For automatic local setup:** your client must be able to run commands, and its machine needs Node.js 20+ with npm. If you use a chat-only client, follow its [client-specific connection instructions](/setup/) instead.

1. Open [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} in the Console.
2. Paste this line into your AI assistant's chat, then tell it what you want to build. This is a chat instruction, not a shell command:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Approve the browser sign-in the agent opens. There is no API key to paste.
4. Start a new session or restart the app so the SandBase tools load.
5. Ask the agent to discover and inspect the relevant tool, then make one bounded request within your authorization and budget. For development, have it integrate the response into your project and provide the run command and actual test results. Discovery alone does not verify a business API call.

Prefer a terminal? Run `npx -y @sandbaseai/cli@latest connect`. It configures supported clients it detects; to configure just one, use `npx -y @sandbaseai/cli@latest connect --client codex` (replace `codex` with your supported client). Restart that client afterwards. Check the selected workspace before a paid run.

For example, you can ask:

> Find a SandBase API for searching public X posts about AI agents. Inspect its required inputs and price first, then tell me the cost of one request before running it. Keep the original source links in the result.

Source and install instructions: [SandBase CLI & MCP on GitHub](https://github.com/sandbaseai/cli).

Learn more: [Connect AI tools](/setup/).

### Let your AI assistant help you build {#start-with-your-agent}

The [setup Skill](https://www.sandbase.ai/SKILL.md) guides your agent through your current situation: no account yet, an existing API key, an already-connected tool, an existing project, or a new feature. It checks the endpoint's inputs and price, helps implement the integration, and distinguishes setup from a verified call and working feature. Tell it your goal and any spending limit; do not paste your key into chat.

Already have a key or a project? Say so; you do not need to start over. For example: “I have a SandBase key. Add a Similarweb traffic lookup to this project; inspect the API and show the live-test cost first.” An assistant that cannot execute commands or load tools needs the [client-specific setup path](/setup/).

[Give your agent the Markdown Quickstart](https://www.sandbase.ai/quickstart.md), or use the steps below. Installing the setup Skill does not itself create a hosted Agent.

### Optional: run a hosted Agent on SandBase {#build-agent}

Choose this if the work has multiple steps or should be reused.

1. Open [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} and select **Create**.
2. Fill in **Overview** and **Instructions**.
3. Pick a **Model**.
4. Add Skills and MCP tools under **Capabilities**, then set **Runtime**.
5. Select **Create & Chat** to test it in a Session.
6. Call the tested version from your app on the Agent's **API** tab.

Learn more: [Build Agent](/agents/). To do the same from code with the official OpenAI SDK, see [OpenAI compatibility](/agents/openai-compatibility).

## Skills, Tools, and other ways to build {#skills-and-tools}

Choose the resource that matches your task. You do not need to install a Skill or create a hosted Agent to use an API.

- **[Tools](https://www.sandbase.ai/tools):** complete a specific task in a ready-made interface, such as formatting text or looking up public data.
- **[Skills](https://www.sandbase.ai/skills):** give an agent a reusable workflow with instructions, scripts, and examples.
- **Models & APIs:** call a capability from a Playground, your code, or a connected agent. Explore [language models](https://www.sandbase.ai/models), [image & video](https://www.sandbase.ai/models/image-video), or [data APIs](https://www.sandbase.ai/apis).
- **[Hosted Agents](/agents/):** configure and run a reusable agent on SandBase.
- **[Sandboxes](/sandbox/):** give code an isolated environment to execute and work with files.

### Use a Tool {#use-tools}

1. Open [Tools](https://www.sandbase.ai/tools) and choose the task you want to complete.
2. Read the tool's input requirements and pricing or quota label. Free utilities can work without an account; data tools require SandBase sign-in to run, and model tests may require your own key.
3. Enter the requested text, URL, file, or other inputs, then use the tool's run action.
4. Review the output and use the copy or download action where provided. For a data tool, use its linked API and request example if you want to automate the same task.

**Free daily quota is shared by the workspace**, not a separate allowance for every tool. Check eligibility and the displayed price before running; a free utility does not make a model or API call free.

### Use a Skill {#use-skills}

1. Open [Skills](https://www.sandbase.ai/skills), choose a workflow, and read its examples, required inputs, and dependencies.
2. Choose one of the options available on that Skill's detail page:
   - **Run online:** sign in and run the hosted example where offered. Follow its progress and open the resulting output or files. Check the displayed allowance; availability and limits vary by Skill.
   - **Install / Download:** sign in to download the package where offered. Extract the complete package into a working folder, then follow its installation instructions or ask your local agent to read its `SKILL.md`.
3. For local use, provide your task, inputs, desired output, and spending limit. Connect SandBase using the [Agent path](#use-in-ai-tool); if the Skill's scripts require a key, configure it in the execution environment instead of pasting it into chat.
4. Review the actual result. Downloading a Skill or connecting your agent does not mean the workflow has run successfully.

The SandBase **setup Skill** connects your client; catalog Skills describe individual workflows. Check each Skill's dependencies and supported client before installing. Model and API calls used by a local workflow can incur usage charges.

See [Use a Skill locally](/guides/skills/local-use) for a complete walkthrough, including input folders and saved deliverables.

## Optional: share a team workspace {#create-organization}

API keys, usage, and billing belong to an organization. Stay in the personal workspace if you are evaluating alone. Create a team when several people will share keys and spend.

| Workspace | When to use it |
|---|---|
| **Personal** | Created automatically on first login. One per user. |
| **Team** | Shared members, keys, and balance. Create this for a company or project. |

### Create a team {#create-team}

1. Open [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"}, or choose **Create Team** in the account menu at the top right of the Console.
2. Enter a **Team name**, then select **Create team**.
3. Confirm the account menu now shows that team as the active workspace.
4. On **Developer → Team**, select **Add member**, enter the **Account email** of an existing SandBase account, and choose the **Workspace role** (Member or Admin).

An invited person must already have a SandBase account. If they do not, send them [this page](/getting-started/quickstart) so they can sign in first, then add them.

If you belong to more than one organization, switch in the account menu. Keys and billing follow the **active** organization. See [Organizations](/admin/organizations) for roles.

## Confirm it works {#confirm-it-works}

You are ready when all of the following are true:

- The Console account menu shows the organization you intend to use.
- You completed one path: an API call, a run on the website, a connected AI tool, or an Agent.
- One request succeeds.

If the request fails, check the active organization, the key, and [Errors](/guides/error-handling). Top up in [Billing](https://www.sandbase.ai/console/billing){target="_blank"} when the workspace has no remaining balance.

### If you get stuck

| What you see | What to check |
| --- | --- |
| Sign-in required | Sign in, return to the original page, and check the active workspace. |
| Invalid key or access denied | Confirm the key belongs to the intended workspace and has access to the endpoint. Adding credits does not fix permissions. |
| Insufficient balance or quota exhausted | Read the response: check Billing for a balance issue, or the displayed reset time for a quota limit. |
| No tools in your Agent | Start a new client session, then follow the diagnostics in [Connect AI tools](/setup/). |
| Task still running | Follow the returned task status or the page's progress indicator. Avoid submitting the same paid request repeatedly. |

## Billing and usage {#billing-and-usage}

After you sign in, review spend for the active organization:

<QuickstartResources group="ops" />

## What to do next {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — complete a task in the browser
- [Skills](https://www.sandbase.ai/skills) — find a reusable agent workflow
- [API keys](/getting-started/api-keys) — create and rotate organization keys
- [Models and APIs catalog](https://www.sandbase.ai/models) — try Models, APIs, and Agents on the website
- [Connect AI tools](/setup/) — give your AI tool the SandBase catalog
- [Build Agent](/agents/) — create reusable Agents
- [API Reference](/api-reference/) — integrate with code
