---
title: "Gemini Omni Flash Preview API Reference"
description: "Gemini Omni Flash Preview API reference for SandBase. Use model google/gemini-omni-flash-preview with /v1/chat/completions; view request fields, examples, capabilities..."
aside: false
outline: false
apiReferenceKey: "llm/google/gemini-omni-flash-preview"
apiReferenceJson: "{\"title\":\"Gemini Omni Flash Preview\",\"operation\":\"Chat Completions\",\"method\":\"POST\",\"path\":\"/v1/chat/completions\",\"description\":\"第三方供应商提供的 Gemini Omni Flash Preview 模型。\",\"groups\":[{\"title\":\"Request body\",\"description\":\"Parameters supported by this model. Values, defaults, and limits are read from the model registry.\",\"fields\":[{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model identifier. Set to google/gemini-omni-flash-preview.\",\"default\":\"google/gemini-omni-flash-preview\"}]},{\"title\":\"Response Schema\",\"description\":\"Fields returned by this model API response.\",\"fields\":[{\"name\":\"choices\",\"type\":\"array<object>\",\"required\":true,\"description\":\"Generated completion choices.\"},{\"name\":\"id\",\"type\":\"string\",\"required\":true,\"description\":\"Unique chat completion identifier.\"},{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model that generated the response.\"},{\"name\":\"usage\",\"type\":\"object\",\"required\":false,\"description\":\"Token usage when available.\"}]},{\"title\":\"Model capabilities\",\"fields\":[{\"name\":\"capability_tags\",\"type\":\"array<string>\",\"required\":true,\"description\":\"Capabilities declared by the model registry.\",\"default\":\"chat\"},{\"name\":\"execution_mode\",\"type\":\"string\",\"required\":true,\"description\":\"Execution mode declared by the model registry.\",\"default\":\"sync\"}]}],\"examples\":[{\"label\":\"cURL\",\"language\":\"bash\",\"code\":\"curl -X POST https://api.sandbase.ai/v1/chat/completions \\\\\\n  -H \\\"Authorization: Bearer $SANDBASE_API_KEY\\\" \\\\\\n  -H \\\"Content-Type: application/json\\\" \\\\\\n  -d '{\\n  \\\"model\\\": \\\"google/gemini-omni-flash-preview\\\",\\n  \\\"messages\\\": [\\n    {\\n      \\\"role\\\": \\\"user\\\",\\n      \\\"content\\\": \\\"Describe this product in one sentence.\\\"\\n    }\\n  ]\\n}'\"}],\"response\":{\"status\":\"200 OK\",\"code\":\"{\\n  \\\"id\\\": \\\"chatcmpl_abc123\\\",\\n  \\\"model\\\": \\\"google/gemini-omni-flash-preview\\\",\\n  \\\"choices\\\": [\\n    {\\n      \\\"message\\\": {\\n        \\\"role\\\": \\\"assistant\\\",\\n        \\\"content\\\": \\\"A concise product description.\\\"\\n      }\\n    }\\n  ]\\n}\"}}"
seo:
  modelName: "Gemini Omni Flash Preview"
  modelId: "google/gemini-omni-flash-preview"
  vendor: "Google"
  vendorSlug: "google"
  modelSlug: "gemini-omni-flash-preview"
  protocol: "Chat Completions API"
  endpoint: "/v1/chat/completions"
  publishedAt: ""
  capabilities: ["chat"]
  category: "LLM Models"
---

<ApiReferencePage />
