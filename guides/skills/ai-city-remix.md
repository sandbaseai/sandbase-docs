---
agentDoc: ai-city-remix-agent-en
title: Enter AI City Remix
description: Claim AI City Remix credits, choose a city and Skill, create a video with your local agent, and upload it for review.
---

# Enter AI City Remix

Choose a Skill and city on the event page, then hand the complete instructions to your local agent. After creation, the agent uploads the video, cover, and entry details and submits them for review.


## Prerequisites

- A SandBase account.
- A local agent with command execution and file access.
- A working folder for the video, cover, and project files.

For your first local setup, follow [Use a Skill locally](/guides/skills/local-use).

## 1. Open the event and claim credits

1. Open [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) and read the current [event rules](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en).
2. Click “Claim $5 free & create” and sign in when prompted.
3. The system claims event credits and attempts to redeem them automatically. Check the balance and redemption status; use the redemption action if a retry is needed.
4. After claiming, click “Create now” to open the creation dialog.

Claim dates, availability, and eligibility are shown on the event page. Model calls use credits according to actual usage; review them in [Billing](https://www.sandbase.ai/console/billing).

## 2. Configure a model API key

If your account has no usable API key, the flow shows a “Create an API key” dialog.

1. Review the displayed spending cap and expiry, then click “Create API key”.
2. Click “Create with this key”. The new key is included in the full instructions handed to the agent.
3. Send the complete instructions to an agent you trust and keep them in a private workspace.

For an existing key, configure `SANDBASE_API_KEY` through your local agent's secure settings or execution environment. Manage keys in [API Keys](https://www.sandbase.ai/console/keys).

## 3. Choose a Skill and brief

The dialog starts with an official Skill, city, story, and creative direction selected.

- Expand “Official Skill” to read the summary and details and choose a visual approach.
- Expand “Creative brief” to search for a city or select a location on the map.
- Shuffle suggestions or edit the story and creative direction directly.
- Confirm the map location, supported language, and output style.

Use verifiable sources for history, people, and events. Check the selected Skill's details for language and duration support.

## 4. Copy the instructions and create

1. Click “Copy all” in the prompt area.
2. Open the project folder in your local agent, start a task, and paste the full instructions.
3. Send them, provide any requested inputs, configure dependencies, and begin creation.

The instructions contain the selected Skill, creative brief, entry metadata format, and upload authorization. Keep the complete handoff so the agent can create and submit the work.

“Preparing” means upload access is being prepared. Use “Retry” to prepare it again, or “Complete brief” to fill in missing details.

## 5. Follow creation progress

Creation may take tens of minutes to hours, depending on the Skill, models, and video length, and uses model credits. Keep the agent running and the computer awake.

Add budget and progress instructions to the same task:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Use MiniMax M3.1 Flash through SandBase as required by the current event rules. Follow the event and upload page requirements for duration, resolution, subtitles, and file sizes.

## 6. Submit and check review status

The agent follows the full instructions to use the official upload client, upload the video, cover, and metadata, and submit for review.

Open [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) to check progress:

| Status | Next step |
|---|---|
| Draft | Complete the film, upload the files, and submit for review. |
| Pending review | Follow the review status. |
| Approved | Open the public entry page and share it. |
| Changes requested | Revise according to the review note and submit again. |

For an existing film, select “Upload existing video” on the event page, fill in the details, upload the video and cover, and submit for review.

## 7. Resume an upload

If authorization expires or an upload is interrupted, continue with the original files:

1. Keep the video, cover, `entry.json`, and working folder.
2. Find the same draft in My entries and click “Resume upload”.
3. Copy the fresh resume instructions to the original agent task.
4. Ask the agent to upload and submit the existing files, then check the status in My entries.

## 8. Share your entry

On an approved entry page, click “Share on X” to open a prefilled composer. It includes the entry link, `#AICityRemix`, `@SandbaseAI`, and the official event post.

To publish a video post, click “Download video” first, add the file in the X composer, review the text, and publish.

## Related documentation

- [Use a Skill locally](/guides/skills/local-use)
- [Connect your agent](/setup/)
- [Configure API keys](/getting-started/api-keys)
