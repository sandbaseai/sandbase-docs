---
title: AI-Readable Models & Pricing
description: Discover current SandBase models, capabilities, schemas, and pricing through the Models API.
---

# Models & Pricing

All models are accessible with one SandBase API key. Model availability, schemas, capabilities, context limits,
and pricing can change independently.

::: warning Use live model metadata
Always use `GET /v1/models` and `GET /v1/models/{name}` for current, authoritative data. Do not infer that every
LLM supports streaming, vision, tools, structured output, or caching, and do not copy one model's input fields or
pricing to another model.
:::

## Catalog and detail responses

`GET /v1/models` returns lightweight catalog fields such as `name`, `vendor`, `type`, `capability_tags`,
`execution_mode`, `context_length`, and `base_price`. It intentionally omits detailed token, cache, and reasoning
prices.

`GET /v1/models/{name}` adds `unified_schema`, `supported_modes`, and `model_card`. Read detailed pricing from
`model_card`; there is no top-level `pricing` object. Treat `capability_tags`, `supported_modes`, and
`unified_schema` as model-specific.

## Discover models

```bash
curl 'https://api.sandbase.ai/v1/models?page=1&pageSize=20&type=llm' \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

The list endpoint supports `q`, `vendor`, `type`, `order`, `page`, and `pageSize` filters. Use the returned model
`name` when requesting details or invoking the model.

## Inspect one model

Model names are vendor-qualified and may contain `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-4o \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
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
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

See the [Models API reference](/api-reference/models/) for the response contracts and the
[Errors reference](/for-agents/errors) for `model_not_found` and validation failures.
