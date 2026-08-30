---
title: "Gemini Omni 1.1 Flash Preview Native API Reference"
description: "Gemini Omni 1.1 Flash Preview API reference for SandBase. Use the native Google Gemini Interactions API."
aside: false
outline: false
apiReferenceKey: "llm/google/gemini-omni-1.1-flash-preview"
apiReferenceJson: >-
  {"title":"Gemini Omni 1.1 Flash Preview","operation":"Gemini Interactions","method":"POST","path":"/v1beta/interactions","description":"Google Gemini Omni 1.1 Flash Preview is available through SandBase native Google Gemini Interactions API. Create an interaction, poll its ID, and read the terminal output.","groups":[{"title":"Request body","description":"Create a native Google Interaction. Use background for video generation that should be polled.","fields":[{"name":"model","type":"string","required":true,"description":"Model identifier. Set to google/gemini-omni-1.1-flash-preview.","default":"google/gemini-omni-1.1-flash-preview"},{"name":"input","type":"string | object | array","required":true,"description":"Native Google Interaction input."},{"name":"background","type":"boolean","required":false,"description":"Submit durably and return an immediately pollable Interaction.","default":"true"},{"name":"response_format","type":"object | array","required":false,"description":"Requested output format.","default":"{\"type\":\"video\"}"}]},{"title":"Response Schema","description":"The response contains an Interaction ID. Poll GET /v1beta/interactions/{id} while status is in_progress.","fields":[{"name":"id","type":"string","required":true,"description":"Provider Interaction identifier used for polling."},{"name":"model","type":"string","required":true,"description":"Model that handles the Interaction."},{"name":"object","type":"string","required":true,"description":"Response object type."},{"name":"output","type":"object","required":false,"description":"Terminal output when the Interaction completes."},{"name":"status","type":"string","required":true,"description":"Interaction lifecycle status."},{"name":"usage","type":"object","required":false,"description":"Usage details when available."}]}],"examples":[{"label":"cURL","language":"bash","code":"curl -X POST https://api.sandbase.ai/v1beta/interactions \\\n  -H \"x-goog-api-key: $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n  \"model\": \"google/gemini-omni-1.1-flash-preview\",\n  \"input\": \"Create a short cinematic product video of a red ball rolling across a table.\",\n  \"background\": true,\n  \"response_format\": {\"type\": \"video\"}\n}'"}],"response":{"status":"200 OK","code":"{\n  \"id\": \"job_75b74acd12534b01baba820b\",\n  \"object\": \"interaction\",\n  \"model\": \"google/gemini-omni-1.1-flash-preview\",\n  \"status\": \"in_progress\"\n}"}}
seo:
  modelName: "Gemini Omni 1.1 Flash Preview"
  modelId: "google/gemini-omni-1.1-flash-preview"
  vendor: "Google"
  vendorSlug: "google"
  modelSlug: "gemini-omni-1.1-flash-preview"
  protocol: "Gemini Interactions API"
  endpoint: "/v1beta/interactions"
  publishedAt: "2026-06-30T00:00:00Z"
  capabilities: ["chat"]
  category: "LLM Models"
---

<ApiReferencePage />

## Official Google resources

- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [Gemini Interactions API reference](https://ai.google.dev/api/interactions-api)
- [Interactions API getting started guide](https://ai.google.dev/gemini-api/docs/get-started)
