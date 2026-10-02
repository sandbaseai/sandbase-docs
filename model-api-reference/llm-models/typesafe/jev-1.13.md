---
title: "Jev 1.13 API Reference"
description: "Jev 1.13 API reference for SandBase. Use model typesafe/jev-1.13 with /v1/chat/completions; see request and response examples."
aside: false
outline: false
apiReferenceKey: "llm/typesafe/jev-1.13"
apiReferenceJson: "{\"title\":\"Jev 1.13\",\"operation\":\"Chat Completions\",\"method\":\"POST\",\"path\":\"/v1/chat/completions\",\"description\":\"Jev 1.13 is TypeSafe's System One model for structured decisions from state and typed questions.\",\"groups\":[{\"title\":\"Request body\",\"description\":\"Parameters supported by this model. Values, defaults, and limits are read from the model registry.\",\"fields\":[{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model identifier. Set to typesafe/jev-1.13.\",\"default\":\"typesafe/jev-1.13\"},{\"name\":\"questions\",\"type\":\"object\",\"required\":true,\"description\":\"Typed questions evaluated against state.\"},{\"name\":\"state\",\"type\":\"object\",\"required\":true,\"description\":\"State passed to the System One model. The upstream accepts the native TypeSafe state shape.\"}]},{\"title\":\"Response Schema\",\"description\":\"Fields returned by this model API response.\",\"fields\":[{\"name\":\"choices\",\"type\":\"array<object>\",\"required\":true,\"description\":\"Generated completion choices.\"},{\"name\":\"id\",\"type\":\"string\",\"required\":true,\"description\":\"Unique chat completion identifier.\"},{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model that generated the response.\"},{\"name\":\"usage\",\"type\":\"object\",\"required\":false,\"description\":\"Token usage when available.\"}]},{\"title\":\"Model capabilities\",\"fields\":[{\"name\":\"capability_tags\",\"type\":\"array<string>\",\"required\":true,\"description\":\"Capabilities declared by the model registry.\",\"default\":\"decisions\"},{\"name\":\"context_length\",\"type\":\"integer\",\"required\":true,\"description\":\"Maximum context window accepted by this model.\",\"default\":\"32000 tokens\"},{\"name\":\"execution_mode\",\"type\":\"string\",\"required\":true,\"description\":\"Execution mode declared by the model registry.\",\"default\":\"sync\"}]}],\"examples\":[{\"label\":\"cURL\",\"language\":\"bash\",\"code\":\"curl -X POST https://api.sandbase.ai/v1/chat/completions \\\\\\n  -H \\\"Authorization: Bearer $SANDBASE_API_KEY\\\" \\\\\\n  -H \\\"Content-Type: application/json\\\" \\\\\\n  -d '{\\n  \\\"model\\\": \\\"typesafe/jev-1.13\\\",\\n  \\\"messages\\\": [\\n    {\\n      \\\"role\\\": \\\"user\\\",\\n      \\\"content\\\": \\\"Describe this product in one sentence.\\\"\\n    }\\n  ]\\n}'\"}],\"response\":{\"status\":\"200 OK\",\"code\":\"{\\n  \\\"id\\\": \\\"chatcmpl_abc123\\\",\\n  \\\"model\\\": \\\"typesafe/jev-1.13\\\",\\n  \\\"choices\\\": [\\n    {\\n      \\\"message\\\": {\\n        \\\"role\\\": \\\"assistant\\\",\\n        \\\"content\\\": \\\"A concise product description.\\\"\\n      }\\n    }\\n  ]\\n}\"}}"
seo:
  modelName: "Jev 1.13"
  modelId: "typesafe/jev-1.13"
  vendor: "TypeSafe"
  vendorSlug: "typesafe"
  modelSlug: "jev-1.13"
  protocol: "Chat Completions API"
  endpoint: "/v1/chat/completions"
  publishedAt: "2026-09-18T00:01:24Z"
  capabilities: ["decisions"]
  category: "LLM Models"
---

<ApiReferencePage />
