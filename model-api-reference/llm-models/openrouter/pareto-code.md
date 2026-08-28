---
title: "Pareto Code Router API Reference"
description: "Pareto Code Router API reference for SandBase. Use model openrouter/pareto-code with /v1/chat/completions; view request fields, examples, capabilities, and response fo."
aside: false
outline: false
apiReferenceKey: "llm/openrouter/pareto-code"
apiReferenceJson: "{\"title\":\"Pareto Code Router\",\"operation\":\"Chat Completions\",\"method\":\"POST\",\"path\":\"/v1/chat/completions\",\"description\":\"The Pareto Router maintains a tiered shortlist of strong coding models, ranked by Artificial Analysis coding percentiles. Set min_coding_score between 0 and 1 on the pareto-router plugin to control how strong a coder you need; higher scores select stronger (and typically more expensive) models. If you omit min_coding_score, the router defaults to the High tier.\",\"groups\":[{\"title\":\"Request body\",\"description\":\"Parameters supported by this model. Values, defaults, and limits are read from the model registry.\",\"fields\":[{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model identifier. Set to openrouter/pareto-code.\",\"default\":\"openrouter/pareto-code\"},{\"name\":\"messages\",\"type\":\"array<object>\",\"required\":true,\"description\":\"Conversation messages in system, user, or assistant order.\"},{\"name\":\"max_tokens\",\"type\":\"integer\",\"required\":false,\"description\":\"Maximum number of tokens the model may generate in the response.\",\"constraints\":\"Range: −∞ to 2000000\"},{\"name\":\"temperature\",\"type\":\"number\",\"required\":false,\"description\":\"Sampling temperature. Lower values are more deterministic; higher values are more creative.\",\"default\":\"1\",\"constraints\":\"Range: 0 to 2\"},{\"name\":\"stream\",\"type\":\"boolean\",\"required\":false,\"description\":\"When true, returns incremental Server-Sent Events instead of one completed response.\",\"default\":\"false\"}]},{\"title\":\"Response Schema\",\"description\":\"Fields returned by this model API response.\",\"fields\":[{\"name\":\"choices\",\"type\":\"array<object>\",\"required\":true,\"description\":\"Generated completion choices.\"},{\"name\":\"id\",\"type\":\"string\",\"required\":true,\"description\":\"Unique chat completion identifier.\"},{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model that generated the response.\"},{\"name\":\"usage\",\"type\":\"object\",\"required\":false,\"description\":\"Token usage when available.\"}]},{\"title\":\"Model capabilities\",\"fields\":[{\"name\":\"capability_tags\",\"type\":\"array<string>\",\"required\":true,\"description\":\"Capabilities declared by the model registry.\",\"default\":\"chat\"},{\"name\":\"context_length\",\"type\":\"integer\",\"required\":true,\"description\":\"Maximum context window accepted by this model.\",\"default\":\"2000000 tokens\"},{\"name\":\"execution_mode\",\"type\":\"string\",\"required\":true,\"description\":\"Execution mode declared by the model registry.\",\"default\":\"sync\"}]}],\"examples\":[{\"label\":\"cURL\",\"language\":\"bash\",\"code\":\"curl -X POST https://api.sandbase.ai/v1/chat/completions \\\\\\n  -H \\\"Authorization: Bearer $SANDBASE_API_KEY\\\" \\\\\\n  -H \\\"Content-Type: application/json\\\" \\\\\\n  -d '{\\n  \\\"model\\\": \\\"openrouter/pareto-code\\\",\\n  \\\"messages\\\": [\\n    {\\n      \\\"role\\\": \\\"user\\\",\\n      \\\"content\\\": \\\"Describe this product in one sentence.\\\"\\n    }\\n  ]\\n}'\"}],\"response\":{\"status\":\"200 OK\",\"code\":\"{\\n  \\\"id\\\": \\\"chatcmpl_abc123\\\",\\n  \\\"model\\\": \\\"openrouter/pareto-code\\\",\\n  \\\"choices\\\": [\\n    {\\n      \\\"message\\\": {\\n        \\\"role\\\": \\\"assistant\\\",\\n        \\\"content\\\": \\\"A concise product description.\\\"\\n      }\\n    }\\n  ]\\n}\"}}"
seo:
  modelName: "Pareto Code Router"
  modelId: "openrouter/pareto-code"
  vendor: "Openrouter"
  vendorSlug: "openrouter"
  modelSlug: "pareto-code"
  protocol: "Chat Completions API"
  endpoint: "/v1/chat/completions"
  publishedAt: "2026-04-21T05:05:00.602Z"
  capabilities: ["chat"]
  category: "LLM Models"
---

<ApiReferencePage />
