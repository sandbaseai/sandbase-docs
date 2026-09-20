---
title: Quickstart
description: Create an AGRouter account, set up an organization, then call a model, try it on the website, or connect an AI tool.
pageClass: quickstart-page
---

# Quickstart

<QuickstartOnboard />

## 1. Create your account {#create-account}

AGRouter uses GitHub or Google. There is no separate email-and-password signup.

1. Open [Create account / Sign in](https://www.agrouter.ai/login){target="_blank"}.
2. Complete the security check, then choose **Sign in with GitHub** or **Sign in with Google**.
3. Approve access in the provider window.
4. Confirm you land in the [Console](https://www.agrouter.ai/console){target="_blank"}.

First login creates your account and a **personal workspace**. You do not need to create an organization before you can try AGRouter.

If a welcome credit appears, you can start without adding a payment method. Treat [Console Credits](https://www.agrouter.ai/console/billing){target="_blank"} as the source of truth for the current balance.

## 2. Create an organization {#create-organization}

API keys, usage, and billing belong to an organization. Stay in the personal workspace if you are evaluating alone. Create a team when several people will share keys and spend.

| Workspace | When to use it |
|---|---|
| **Personal** | Created automatically on first login. One per user. |
| **Team** | Shared members, keys, and balance. Create this for a company or project. |

### 2.1 Create a team {#create-team}

1. Open [Create team](https://www.agrouter.ai/console/members?create=1){target="_blank"}, or use **Create Team** in the Console header menu.
2. Enter a team name, then create the workspace.
3. Confirm the Console header now shows that team as the active organization.
4. Select **Add member** and enter the email of an existing AGRouter account.

An invited person must already have a AGRouter account. If they do not, send them [this page](/getting-started/quickstart) so they can sign in first, then add them.

If you belong to more than one organization, switch in the Console header. Keys and billing follow the **active** organization. See [Organizations](/admin/organizations) for roles.

## 3. Connect AGRouter {#connect}

Pick the path that matches the work you need to do now. You can add the others later. Confirm the active organization first so keys and connected tools land in the right workspace.

### 3.1 Call an API {#call-api}

Choose this if you are adding one capability to your app.

1. Create an [API key](/getting-started/api-keys) in [Console → API Keys](https://www.agrouter.ai/console/keys){target="_blank"}. Copy it immediately; it is shown only once.
2. Filter the Store and open a detail page:
   - [Language models](https://www.agrouter.ai/models){target="_blank"} — filter by provider, capabilities, context, and price
   - [Image and video models](https://www.agrouter.ai/models/image-video){target="_blank"} — filter multimodal models such as text-to-image, image-to-image, text-to-video, and image-to-video
3. Copy the request and call it with your AGRouter API key.

Example Model call:

```bash
export AGROUTER_API_KEY="sk-YOUR_KEY"

curl https://api.agrouter.ai/v1/chat/completions \
  -H "Authorization: Bearer $AGROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Summarize this customer feedback."}]
  }'
```

Learn more: [First API Call](/getting-started/first-call).

### 3.2 Use AGRouter on the website {#use-on-website}

Choose this if you want to try a Model in the browser first — no client install and no code.

1. Sign in, then open the Store:
   - [Language models](https://www.agrouter.ai/models){target="_blank"}
   - [Image and video models](https://www.agrouter.ai/models/image-video){target="_blank"}
2. Filter and open a detail page.
3. Run one request on that page and confirm a result comes back.

Learn more: [Store](/store/).

### 3.3 Use AGRouter in your AI tool {#use-in-ai-tool}

Choose this if you use Codex, Claude, Cursor, Kiro, or another supported client and want Models and Services inside that app.

1. Open [Setup](https://www.agrouter.ai/console/setup){target="_blank"}.
2. Choose your AI tool and review its prerequisites.
3. Run the command or import steps shown for that client.
4. Complete authorization, then restart or reload the client if instructed.
5. Verify the AGRouter entry and make one safe tool request.

To change what the connected tool can discover, open [Workspace Services](https://www.agrouter.ai/console/setup/installed){target="_blank"}.

Learn more: [Connect AI tools](/setup/).

## 4. Confirm it works {#confirm-it-works}

You are ready when all of the following are true:

- The Console header shows the organization you intend to use.
- You completed one path: an API call, a run on the website, or a connected AI tool.
- One request succeeds.

If the request fails, check the active organization, the key, and [Errors](/guides/error-handling). Add credits in [Billing](https://www.agrouter.ai/console/billing){target="_blank"} when the workspace has no remaining balance.

## 5. Billing and usage {#billing-and-usage}

After you sign in, review spend for the active organization:

<QuickstartResources group="ops" />

## 6. What to do next {#next-steps}

<QuickstartResources group="catalog" />

- [API keys](/getting-started/api-keys) — create and rotate organization keys
- [Store](/store/) — try Models on the website
- [Setup](/setup/) — install capabilities into AI tools
- [First API Call](/getting-started/first-call) — call a model from code
