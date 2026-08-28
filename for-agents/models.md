---
title: AI-Readable Models & Pricing
description: Discover current SandBase models, capabilities, schemas, and pricing through the Models API.
---

# Models & Pricing

All models are accessible with one SandBase API key. Model availability, schemas, capabilities, context limits,
and pricing can change independently.

::: warning Use live model metadata
Always use `GET /v1/models` and `GET /v1/models/{id_or_name}` for current, authoritative data. Do not infer that every
LLM supports streaming, vision, tools, structured output, or caching, and do not copy one model's input fields or
pricing to another model.
:::

## Catalog and detail responses

`GET /v1/models` returns OpenAI-compatible identity records containing `id`, `object`, `created`, and `owned_by`.
It intentionally omits SandBase capability, schema, and pricing metadata.

`GET /v1/models/{id_or_name}` adds `unified_schema`, `supported_modes`, and `model_card`. Read detailed pricing from
`model_card`; there is no top-level `pricing` object. Treat `capability_tags`, `supported_modes`, and
`unified_schema` as model-specific.

## Discover models

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

The list endpoint supports `q`, `vendor`, `type`, and `order`; it is not paginated and defaults to `type=llm`.
It returns OpenAI-compatible items with `id`, `object`, `created`, and `owned_by`. Use the returned `id` as the
model name when requesting details or invoking the model.

For any asynchronous `202` response, poll `GET /v1/run/{id}` with the returned ID. Treat the ID as opaque; do not
infer its format or construct a different polling path from an ID prefix or compatibility header.

## Inspect one model

Model names are vendor-qualified and may contain `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.4 \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Before execution, inspect:

- `enabled` and `execution_mode`
- `capability_tags` and `supported_modes`
- `unified_schema` for accepted request fields
- `model_card` for the current pricing formula and token or cache multipliers

## Check actual task cost

For a completed or in-progress task, query the recorded cost instead of recomputing it from a stale table:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

See the [Models API reference](/api-reference/models/) for the response contracts and the
[Error Guide](/for-agents/errors) for response-shape and retry guidance.
