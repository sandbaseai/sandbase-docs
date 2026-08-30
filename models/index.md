---
title: Models
description: Browse and call SandBase model APIs, or use Models inside Setup and Build Agent.
---

# Models

Models are the AI engines your app or Agent can use.

SandBase lets you browse Models and APIs, inspect capabilities, copy a working request, and use the same capability inside Setup or Build Agent. Each model page documents the exact identifier, input fields, output shape, and endpoint to call. Browse the separate [API Catalog](/store/apis) for non-model capabilities such as search, scraping, data, and SaaS actions.

## Where Models fit

| Place | How Models are used |
|---|---|
| **Store** | Browse Models and inspect pricing, IDs, and capabilities |
| **Setup** | Add selected Models to your AI tool |
| **Build Agent** | Pick the Model your Agent should use |
| **API Reference** | Call Models directly from your app |

## Model API surfaces

Use the API surface that matches the model category:

| Model category | Endpoint | How it works |
|---|---|---|
| LLMs | `POST /v1/chat/completions` | Send messages and receive a provider-compatible text response. |
| Image models | `POST /v1/run` | Submit an image generation task, then poll `GET /v1/run/{id}` for the result. |
| Video models | `POST /v1/run` | Submit an asynchronous video task, then poll `GET /v1/run/{id}` until it is terminal. |
| Audio and other capabilities | `POST /v1/run` | Use the model-specific fields documented on its API reference page. |
| API Store capabilities | `GET/POST /v1/api/{vendor}/{upstream_path}` | Put the vendor-qualified capability name in the URL; a POST body can omit `model`. |
| Provider-native APIs | Provider-specific endpoint | Use the native protocol and authentication shown in the Official Native API section. |

The shared `/v1/run` endpoint is the standard SandBase interface for image and video models. Requests return an opaque run ID for asynchronous capabilities; keep polling the run endpoint for authoritative status and outputs. See [Run a capability](/api-reference/models/run) and [Get a run result](/api-reference/models/run-get) for the common request and response contract.

API Store capabilities are addressed by URL instead: use [API Passthrough](/api-reference/models/api-passthrough) with `/v1/api/{vendor}/{upstream_path}`. This URL-derived route is separate from model generation through `/v1/run`.

## Call an LLM

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a short customer brief."}]
  }'
```

## Call an image or video model

Image and video models use the same asynchronous Run API. The `model` value is the exact SandBase model ID, while the remaining fields come from that model's reference page.

```bash
# Submit an image or video task
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'

# Poll the returned id until status is completed or failed
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

For model-specific parameters, response fields, limits, and working examples, open the model's API reference from [Supported Models](/models/supported).

## Use a Model in an Agent

In Build Agent, the Model is one part of the Agent.

The Agent can also include APIs, Skills, instructions, and credentials.

## Model capabilities

Different Models support different input and output types.

Examples:

- text in / text out
- image input
- image generation
- audio
- video
- embeddings
- tool calling
- structured output

Check capability details before using a Model in production.

## Next steps

- [Supported Models](/models/supported)
- [Capability Matrix](/models/capabilities)
- [Chat Completions API](/api-reference/llm-gateway)
- [Models API reference](/api-reference/models/)
- [Run a capability](/api-reference/models/run)
- [Browse the Store](/store/)
- [Build Agent](/agents/)
