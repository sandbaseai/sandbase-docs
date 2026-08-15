---
title: "Morph V3 Fast API Reference"
description: "Morph V3 Fast API reference for SandBase. Use model morph/morph-v3-fast with /v1/chat/completions; view request fields, examples, capabilities, and response format."
aside: false
outline: false
apiReferenceKey: "llm/morph/morph-v3-fast"
apiReferenceJson: "{\"title\":\"Morph V3 Fast\",\"operation\":\"Chat Completions\",\"method\":\"POST\",\"path\":\"/v1/chat/completions\",\"description\":\"Morph's fastest apply model for code edits. ~10,500 tokens/sec with 96% accuracy for rapid code transformations.\",\"groups\":[{\"title\":\"Request body\",\"description\":\"Parameters supported by this model. Values, defaults, and limits are read from the model registry.\",\"fields\":[{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model identifier. Set to morph/morph-v3-fast.\",\"default\":\"morph/morph-v3-fast\"},{\"name\":\"messages\",\"type\":\"array<object>\",\"required\":true,\"description\":\"Conversation messages in system, user, or assistant order.\"},{\"name\":\"max_tokens\",\"type\":\"integer\",\"required\":false,\"description\":\"Maximum number of tokens the model may generate in the response.\",\"constraints\":\"Range: −∞ to 38000\"},{\"name\":\"temperature\",\"type\":\"number\",\"required\":false,\"description\":\"Sampling temperature. Lower values are more deterministic; higher values are more creative.\",\"default\":\"1\",\"constraints\":\"Range: 0 to 2\"},{\"name\":\"stream\",\"type\":\"boolean\",\"required\":false,\"description\":\"When true, returns incremental Server-Sent Events instead of one completed response.\",\"default\":\"false\"},{\"name\":\"stop\",\"type\":\"array<string>\",\"required\":false,\"description\":\"Sequences that stop generation when the model produces one of them.\"}]},{\"title\":\"Response Schema\",\"description\":\"Fields returned by this model API response.\",\"fields\":[{\"name\":\"choices\",\"type\":\"array<object>\",\"required\":true,\"description\":\"Generated completion choices.\"},{\"name\":\"id\",\"type\":\"string\",\"required\":true,\"description\":\"Unique chat completion identifier.\"},{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model that generated the response.\"},{\"name\":\"usage\",\"type\":\"object\",\"required\":false,\"description\":\"Token usage when available.\"}]},{\"title\":\"Model capabilities\",\"fields\":[{\"name\":\"capability_tags\",\"type\":\"array<string>\",\"required\":true,\"description\":\"Capabilities declared by the model registry.\",\"default\":\"chat\"},{\"name\":\"context_length\",\"type\":\"integer\",\"required\":true,\"description\":\"Maximum context window accepted by this model.\",\"default\":\"81920 tokens\"},{\"name\":\"execution_mode\",\"type\":\"string\",\"required\":true,\"description\":\"Execution mode declared by the model registry.\",\"default\":\"sync\"}]}],\"examples\":[{\"label\":\"cURL\",\"language\":\"bash\",\"code\":\"curl -X POST https://api.sandbase.ai/v1/chat/completions \\\\\\n  -H \\\"Authorization: Bearer $SANDBASE_API_KEY\\\" \\\\\\n  -H \\\"Content-Type: application/json\\\" \\\\\\n  -d '{\\n  \\\"model\\\": \\\"morph/morph-v3-fast\\\",\\n  \\\"messages\\\": [\\n    {\\n      \\\"role\\\": \\\"user\\\",\\n      \\\"content\\\": \\\"Describe this product in one sentence.\\\"\\n    }\\n  ]\\n}'\"}],\"response\":{\"status\":\"200 OK\",\"code\":\"{\\n  \\\"id\\\": \\\"chatcmpl_abc123\\\",\\n  \\\"model\\\": \\\"morph/morph-v3-fast\\\",\\n  \\\"choices\\\": [\\n    {\\n      \\\"message\\\": {\\n        \\\"role\\\": \\\"assistant\\\",\\n        \\\"content\\\": \\\"A concise product description.\\\"\\n      }\\n    }\\n  ]\\n}\"}}"
seo:
  modelName: "Morph V3 Fast"
  modelId: "morph/morph-v3-fast"
  vendor: "Morph"
  vendorSlug: "morph"
  modelSlug: "morph-v3-fast"
  protocol: "Chat Completions API"
  endpoint: "/v1/chat/completions"
  publishedAt: "2025-07-07T17:40:02.233Z"
  capabilities: ["chat"]
  category: "LLM Models"
---

<ApiReferencePage />
