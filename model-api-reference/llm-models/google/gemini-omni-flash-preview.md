---
title: "Gemini Omni Flash Preview API Reference"
description: "Gemini Omni Flash Preview API reference for SandBase. Use model google/gemini-omni-flash-preview with /v1beta/interactions; see request and response examples."
aside: false
outline: false
apiReferenceKey: "llm/google/gemini-omni-flash-preview"
apiReferenceJson: "{\"title\":\"Gemini Omni Flash Preview\",\"operation\":\"Gemini Interactions\",\"method\":\"POST\",\"path\":\"/v1beta/interactions\",\"description\":\"Google Gemini Omni Flash Preview is a multimodal video-generation model available through SandBase. Use the Google Gemini Interactions protocol for native video requests.\",\"groups\":[{\"title\":\"Request body\",\"description\":\"Create a native Google Interaction. Use background for video generation that should be polled.\",\"fields\":[{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model identifier. Set to google/gemini-omni-flash-preview.\",\"default\":\"google/gemini-omni-flash-preview\"},{\"name\":\"input\",\"type\":\"string | object | array\",\"required\":true,\"description\":\"Native Google Interaction input.\"},{\"name\":\"background\",\"type\":\"boolean\",\"required\":false,\"description\":\"Submit durably and return an immediately pollable Interaction.\",\"default\":\"true\"},{\"name\":\"response_format\",\"type\":\"object | array\",\"required\":false,\"description\":\"Requested output format.\",\"default\":\"{\\\"type\\\":\\\"video\\\"}\"}]},{\"title\":\"Response Schema\",\"description\":\"The response contains an Interaction ID. Poll GET /v1beta/interactions/{id} while status is in_progress.\",\"fields\":[{\"name\":\"id\",\"type\":\"string\",\"required\":true,\"description\":\"Provider Interaction identifier used for polling.\"},{\"name\":\"model\",\"type\":\"string\",\"required\":true,\"description\":\"Model that handles the Interaction.\"},{\"name\":\"object\",\"type\":\"string\",\"required\":true,\"description\":\"Response object type.\"},{\"name\":\"output\",\"type\":\"object\",\"required\":false,\"description\":\"Terminal output when the Interaction completes.\"},{\"name\":\"status\",\"type\":\"string\",\"required\":true,\"description\":\"Interaction lifecycle status.\"},{\"name\":\"usage\",\"type\":\"object\",\"required\":false,\"description\":\"Usage details when available.\"}]},{\"title\":\"Model capabilities\",\"fields\":[{\"name\":\"capability_tags\",\"type\":\"array<string>\",\"required\":true,\"description\":\"Capabilities declared by the model registry.\",\"default\":\"chat\"},{\"name\":\"execution_mode\",\"type\":\"string\",\"required\":true,\"description\":\"Execution mode declared by the model registry.\",\"default\":\"sync\"}]}],\"examples\":[{\"label\":\"cURL\",\"language\":\"bash\",\"code\":\"curl -X POST https://api.sandbase.ai/v1beta/interactions \\\\\\n  -H \\\"x-goog-api-key: $SANDBASE_API_KEY\\\" \\\\\\n  -H \\\"Content-Type: application/json\\\" \\\\\\n  -d '{\\n  \\\"model\\\": \\\"google/gemini-omni-flash-preview\\\",\\n  \\\"input\\\": \\\"A red ball rolls across a table, 3 seconds.\\\",\\n  \\\"background\\\": true,\\n  \\\"response_format\\\": {\\n    \\\"type\\\": \\\"video\\\"\\n  }\\n}'\\n\\n# Poll the Interaction while it is in progress\\ncurl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \\\\\\n  -H \\\"x-goog-api-key: $SANDBASE_API_KEY\\\"\"}],\"response\":{\"status\":\"200 OK\",\"code\":\"{\\n  \\\"id\\\": \\\"job_75b74acd12534b01baba820b\\\",\\n  \\\"object\\\": \\\"interaction\\\",\\n  \\\"model\\\": \\\"google/gemini-omni-flash-preview\\\",\\n  \\\"status\\\": \\\"in_progress\\\"\\n}\"}}"
seo:
  modelName: "Gemini Omni Flash Preview"
  modelId: "google/gemini-omni-flash-preview"
  vendor: "Google"
  vendorSlug: "google"
  modelSlug: "gemini-omni-flash-preview"
  protocol: "Gemini Interactions API"
  endpoint: "/v1beta/interactions"
  publishedAt: "2026-06-30T00:00:00Z"
  capabilities: ["chat"]
  category: "LLM Models"
---

<ApiReferencePage />
