---
title: "Gemini Omni 1.1 Flash Preview Native API Reference"
description: "Use Google Gemini Omni 1.1 Flash Preview through SandBase's native Gemini Interactions API. Submit a background interaction, then poll its status and result."
aside: false
outline: false
---

# Gemini Omni 1.1 Flash Preview

`google/gemini-omni-1.1-flash-preview` is available through SandBase's native
[Google Gemini Interactions API](/api-reference/gemini-interactions). The protocol
keeps the provider-style interaction lifecycle: create an interaction, poll its
ID, and read the terminal output.

## Create an interaction

Use `background: true` for generation that may take longer than a synchronous
request. The `model` value must be the exact SandBase model ID.

```bash
curl -X POST https://api.sandbase.ai/v1beta/interactions \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-omni-1.1-flash-preview",
    "input": "Create a short cinematic product video of a red ball rolling across a table.",
    "background": true,
    "response_format": {"type": "video"}
  }'
```

The response contains an opaque provider interaction ID:

```json
{
  "id": "job_75b74acd12534b01baba820b",
  "object": "interaction",
  "model": "google/gemini-omni-1.1-flash-preview",
  "status": "in_progress"
}
```

## Poll for the result

Poll the same ID until `status` is `completed`, `failed`, `cancelled`, or
`incomplete`:

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Completed interactions can include inline video data and usage details. Persist
media promptly because upstream retention may expire. For authentication,
streaming behavior, status semantics, and error handling, see the complete
[Gemini Interactions reference](/api-reference/gemini-interactions).

## Current limits

- SandBase exposes create and get for this native interaction.
- `background: true` and `stream: true` cannot be combined.
- Interaction list, delete, cancel, URI delivery, and GET-based stream
  reconnection are not exposed.
- The model ID is case-sensitive; use it exactly as shown above.
