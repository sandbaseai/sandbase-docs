// Structured endpoint data shared by the API Reference pages.
export const generatedApiReferenceSpecs: Record<string, any> = {
  "deployments/archive": {
    "title": "Archive Deployment",
    "operation": "Deployments",
    "method": "POST",
    "path": "/v1/deployments/{deployment_id}/archive",
    "description": "Archive a Deployment that should no longer be triggered.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "deployment_id",
            "type": "string",
            "required": true,
            "description": "Identifier for deployment id."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/deployments/depl_01.../archive \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ]
  },
  "deployments/create": {
    "title": "Create Deployment",
    "operation": "Deployments",
    "method": "POST",
    "path": "/v1/deployments",
    "description": "Create a manually triggered or scheduled Agent Deployment.",
    "groups": [
      {
        "title": "Request body",
        "fields": [
          {
            "name": "name",
            "type": "string",
            "required": true,
            "description": "Display name for the Deployment."
          },
          {
            "name": "agent_id",
            "type": "string",
            "required": true,
            "description": "Agent to run."
          },
          {
            "name": "environment_id",
            "type": "string",
            "required": false,
            "description": "Optional Environment override. Omit to resolve the Agent-owned Environment."
          },
          {
            "name": "initial_events",
            "type": "array",
            "required": true,
            "description": "At least one valid user.message event."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/deployments \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"name\": \"Daily customer brief\",\n    \"agent_id\": \"agent_01...\",\n    \"environment_id\": \"env_01...\",\n    \"initial_events\": [{\n      \"type\": \"user.message\",\n      \"content\": [{\"type\":\"text\",\"text\":\"Prepare today’s brief.\"}]\n    }],\n    \"schedule\": {\n      \"type\": \"cron\",\n      \"expression\": \"0 9 * * *\",\n      \"timezone\": \"Asia/Shanghai\"\n    }\n  }'"
      }
    ]
  },
  "deployments/get": {
    "title": "Get Deployment",
    "operation": "Deployments",
    "method": "GET",
    "path": "/v1/deployments/{deployment_id}",
    "description": "Retrieve one Deployment and its resolved Agent and Environment bindings.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "deployment_id",
            "type": "string",
            "required": true,
            "description": "Identifier for deployment id."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl https://api.sandbase.ai/v1/deployments/depl_01... \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ]
  },
  "deployments/get-run": {
    "title": "Get DeploymentRun",
    "operation": "Deployments",
    "method": "GET",
    "path": "/v1/deployments/{deployment_id}/runs/{drun_id}",
    "description": "Retrieve one durable DeploymentRun owned by the requested Deployment.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "deployment_id",
            "type": "string",
            "required": true,
            "description": "Deployment that owns the DeploymentRun."
          },
          {
            "name": "drun_id",
            "type": "string",
            "required": true,
            "description": "DeploymentRun identifier beginning with drun_."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl https://api.sandbase.ai/v1/deployments/depl_01.../runs/drun_01... \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"drun_01...\",\n  \"type\": \"deployment_run\",\n  \"deployment_id\": \"depl_01...\",\n  \"agent\": {\"id\":\"agent_01...\",\"type\":\"agent\",\"version\":1},\n  \"trigger_context\": {\"type\":\"manual\"},\n  \"session_id\": \"sess_01...\",\n  \"error\": null,\n  \"created_at\": \"2026-08-04T09:00:00Z\"\n}"
    },
    "errors": [
      {
        "status": 404,
        "type": "not_found",
            "description": "The DeploymentRun does not exist or does not belong to the Deployment."
      },
      {
        "status": 409,
        "type": "deployment_trigger_in_progress",
        "description": "The DeploymentRun has not resolved yet."
      }
    ]
  },
  "deployments/list-runs": {
    "title": "List DeploymentRuns",
    "operation": "Deployments",
    "method": "GET",
    "path": "/v1/deployments/{deployment_id}/runs",
    "description": "List durable DeploymentRun records for one Deployment.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "deployment_id",
            "type": "string",
            "required": true,
            "description": "Identifier for deployment id."
          }
        ]
      },
      {
        "title": "Query parameters",
        "fields": [
          {
            "name": "limit",
            "type": "integer",
            "required": false,
            "default": "20",
            "description": "Page size from 1 to 1000. Pass it explicitly when following nested-list cursors."
          },
          {
            "name": "page",
            "type": "string",
            "required": false,
            "description": "Opaque cursor returned in the previous response's next_page field."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl \"https://api.sandbase.ai/v1/deployments/depl_01.../runs?limit=20\" \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "notes": [
      {
        "title": "Nested-list pagination",
        "description": "Set limit explicitly. A full page includes next_page; because the current endpoint detects cursors from page fullness, following the final full-page cursor can return an empty page."
      }
    ]
  },
  "deployments/list": {
    "title": "List Deployments",
    "operation": "Deployments",
    "method": "GET",
    "path": "/v1/deployments",
    "description": "List Deployments in the current organization.",
    "groups": [
      {
        "title": "Query parameters",
        "fields": [
          { "name": "agent_id", "type": "string", "required": false, "description": "Filter by owning Agent ID." },
          { "name": "status", "type": "string[]", "required": false, "description": "Repeat to include active and/or paused Deployments." },
          { "name": "include_archived", "type": "boolean", "required": false, "default": "false", "description": "Include archived Deployments." },
          { "name": "created_at[gte]", "type": "string · RFC 3339", "required": false, "description": "Return Deployments created at or after this timestamp." },
          { "name": "created_at[lte]", "type": "string · RFC 3339", "required": false, "description": "Return Deployments created at or before this timestamp." },
          { "name": "limit", "type": "integer", "required": false, "default": "20", "description": "Number of Deployments to return, from 1 to 100." },
          { "name": "page", "type": "string", "required": false, "description": "Opaque cursor from a previous response's next_page field." }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl \"https://api.sandbase.ai/v1/deployments?limit=20\" \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ]
  },
  "deployments/pause": {
    "title": "Pause Deployment",
    "operation": "Deployments",
    "method": "POST",
    "path": "/v1/deployments/{deployment_id}/pause",
    "description": "Pause scheduled triggers for a Deployment.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "deployment_id",
            "type": "string",
            "required": true,
            "description": "Identifier for deployment id."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/deployments/depl_01.../pause \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ]
  },
  "deployments/run": {
    "title": "Trigger Deployment",
    "operation": "Deployments",
    "method": "POST",
    "path": "/v1/deployments/{deployment_id}/runs",
    "description": "Create a durable DeploymentRun and attempt to create exactly one new Session.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "deployment_id",
            "type": "string",
            "required": true,
            "description": "Identifier for deployment id."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/deployments/depl_01.../runs \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Idempotency-Key: daily-acme-2026-08-03\" \\\n  -d '{}'"
      }
    ]
  },
  "deployments/unpause": {
    "title": "Unpause Deployment",
    "operation": "Deployments",
    "method": "POST",
    "path": "/v1/deployments/{deployment_id}/unpause",
    "description": "Resume scheduled triggers for a paused Deployment.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "deployment_id",
            "type": "string",
            "required": true,
            "description": "Identifier for deployment id."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/deployments/depl_01.../unpause \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ]
  },
  "deployments/update": {
    "title": "Update Deployment",
    "operation": "Deployments",
    "method": "PATCH",
    "path": "/v1/deployments/{deployment_id}",
    "description": "Update mutable Deployment settings and bindings.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "deployment_id",
            "type": "string",
            "required": true,
            "description": "Identifier for deployment id."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X PATCH https://api.sandbase.ai/v1/deployments/depl_01... \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"name\": \"Weekday customer brief\",\n    \"schedule\": {\"type\":\"cron\",\"expression\":\"0 9 * * 1-5\",\"timezone\":\"Asia/Shanghai\"}\n  }'"
      }
    ]
  },
  "models/audio": {
    "title": "Audio (TTS/STT)",
    "operation": "Models",
    "method": "POST",
    "path": "/v1/run",
    "description": "Run a text-to-speech or speech-to-text model. Asynchronous audio models may include webhook_url for a task callback.",
    "groups": [],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/run \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"bytedance/seed-speech/tts/2.0\",\"text\":\"Hello, welcome to SandBase!\"}'"
      },
      {
        "label": "Python",
        "language": "python",
        "code": "response = client.post(\"/v1/run\", json={\n    \"model\": \"bytedance/seed-speech/tts/2.0\",\n    \"text\": \"Hello, welcome to SandBase!\"\n})\nprint(response.json()[\"outputs\"][0][\"url\"])"
      }
    ],
    "response": { "status": "200 OK", "code": "{\n  \"id\": \"run_01...\",\n  \"status\": \"completed\",\n  \"outputs\": [{ \"url\": \"https://media.sandbase.ai/audio/output.mp3\" }]\n}" }
  },
  "assets/create": {
    "title": "Register Asset",
    "operation": "Assets",
    "method": "POST",
    "path": "/v1/assets",
    "description": "Register a publicly accessible media URL and receive a persistent asset:// reference.",
    "groups": [
      {
        "title": "Request body",
        "fields": [
          { "name": "url", "type": "string", "required": true, "description": "Publicly accessible media URL." },
          { "name": "asset_type", "type": "Image | Video | Audio", "required": true, "description": "Case-sensitive asset type." },
          { "name": "name", "type": "string", "required": false, "description": "Optional display name." }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/assets \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"url\": \"https://example.com/tea-ad.mp4\",\n    \"asset_type\": \"Video\",\n    \"name\": \"Tea ad reference video\"\n  }'"
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\n  \"asset_url\": \"asset://asset-20260710150403-hx4hf\",\n  \"asset_type\": \"Video\",\n  \"name\": \"Tea ad reference video\",\n  \"created_at\": \"2026-07-10T15:04:03Z\"\n}"
    }
  },
  "assets/get": {
    "title": "Get Asset",
    "operation": "Assets",
    "method": "GET",
    "path": "/v1/assets/{asset_id}",
    "description": "Retrieve Asset metadata and a temporary signed download URL.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          { "name": "asset_id", "type": "string", "required": true, "description": "External Asset ID, without the asset:// prefix." }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"external_id\": \"asset-20260710150403-hx4hf\",\n  \"asset_url\": \"asset://asset-20260710150403-hx4hf\",\n  \"status\": \"Active\",\n  \"asset_type\": \"Video\",\n  \"download_url\": \"https://cdn.example.com/signed-url\"\n}"
    },
    "notes": [
      { "title": "Expiration", "description": "The asset:// reference is persistent. The signed download_url expires after 12 hours; call this endpoint again to refresh it." }
    ]
  },
  "models/embedding": {
    "title": "Embeddings",
    "operation": "Models",
    "method": "POST",
    "path": "/v1/embeddings",
    "description": "OpenAI-compatible embeddings API reference for SandBase. Generate vectors for semantic search, RAG, clustering, and classification.",
    "groups": [
      {
        "title": "Request body",
        "fields": [
          {
            "name": "model",
            "type": "string",
            "required": true,
            "description": "Embedding model ID, for example alibaba/text-embedding-v4"
          },
          {
            "name": "input",
            "type": "string or string[]",
            "required": true,
            "description": "Text or list of texts to embed"
          },
          {
            "name": "dimensions",
            "type": "integer",
            "required": false,
            "description": "Output vector dimension when supported"
          },
          {
            "name": "encoding_format",
            "type": "string",
            "required": false,
            "description": "Embedding encoding format. float is supported"
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "HTTP",
        "language": "http",
        "code": "POST https://api.sandbase.ai/v1/embeddings\nAuthorization: Bearer sk-sb-your-api-key\nContent-Type: application/json"
      },
      {
        "label": "Python",
        "language": "python",
        "code": "from openai import OpenAI\n\nclient = OpenAI(\n    api_key=\"sk-sb-YOUR_KEY\",\n    base_url=\"https://api.sandbase.ai/v1\",\n)\n\nresponse = client.embeddings.create(\n    model=\"alibaba/text-embedding-v4\",\n    input=\"SandBase provides a unified API for AI models, agents, and developer tools.\",\n    dimensions=1024,\n    encoding_format=\"float\",\n)\n\nembedding = response.data[0].embedding\nprint(f\"Dimensions: {len(embedding)}\")"
      },
      {
        "label": "TypeScript",
        "language": "typescript",
        "code": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: 'sk-sb-YOUR_KEY',\n  baseURL: 'https://api.sandbase.ai/v1',\n});\n\nconst response = await client.embeddings.create({\n  model: 'alibaba/text-embedding-v4',\n  input: 'SandBase provides a unified API for AI models, agents, and developer tools.',\n  dimensions: 1024,\n  encoding_format: 'float',\n});\n\nconsole.log(response.data[0].embedding.length);"
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"object\": \"list\",\n  \"data\": [\n    {\n      \"object\": \"embedding\",\n      \"index\": 0,\n      \"embedding\": [0.0123, -0.0045, 0.0312]\n    }\n  ],\n  \"model\": \"alibaba/text-embedding-v4\",\n  \"usage\": {\n    \"prompt_tokens\": 16,\n    \"total_tokens\": 16\n  }\n}"
    }
  },
  "models/get": {
    "title": "Get Model",
    "operation": "Models",
    "method": "GET",
    "path": "/v1/models/{id_or_name}",
    "description": "Get detailed information about a model. This endpoint accepts either a model ID or the full model name, and returns the model card, unified schema, and skills in one response.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "id_or_name",
            "type": "string",
            "required": false,
            "description": "Model ID, for example model01abc..., or model name, for example openai/gpt-4o."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl \"https://api.sandbase.ai/v1/models/{id_or_name}\" \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"model_01abc...\",\n  \"name\": \"openai/gpt-4o\",\n  \"display_name\": \"GPT-4o\",\n  \"vendor\": \"OpenAI\",\n  \"description\": \"Most capable GPT-4 model with vision...\",\n  \"type\": \"llm\",\n  \"capability_tags\": [\"chat\", \"streaming\", \"vision\", \"tools\", \"json_mode\", \"cache\"],\n  \"skills\": [\"chat\", \"streaming\", \"vision\", \"tools\", \"json_mode\", \"cache\"],\n  \"unified_schema\": {\n    \"type\": \"object\",\n    \"properties\": {\n      \"prompt\": {\n        \"type\": \"string\"\n      }\n    }\n  },\n  \"execution_mode\": \"chat\",\n  \"supported_modes\": [\"chat\"],\n  \"published_at\": \"2026-07-07T00:00:00Z\",\n  \"vendor_slug\": \"openai\",\n  \"model_slug\": \"gpt-4o\",\n  \"enabled\": true,\n  \"featured\": true,\n  \"model_card\": {\n    \"base_price\": \"0.000000\",\n    \"prompt_token_price\": \"0.0000025\",\n    \"completion_token_price\": \"0.000010\",\n    \"cache_read_multiplier\": \"0.5\",\n    \"cache_write_multiplier\": \"1.0\",\n    \"reasoning_price\": null,\n    \"price_formula\": \"$input_tokens * 0.0000025 + $output_tokens * 0.000010\",\n    \"markup_ratio\": \"1.0000\",\n    \"readme\": \"Model usage notes...\",\n    \"cover_url\": \"https://...\"\n  },\n  \"examples\": []\n}"
    }
  },
  "models/image": {
    "title": "Image Generation",
    "operation": "Models",
    "method": "POST",
    "path": "/v1/run",
    "description": "Generate images using AI models like FLUX, Stable Diffusion, DALL-E, and more.",
    "groups": [
      {
        "title": "Request body",
        "fields": [
          {
            "name": "model",
            "type": "string",
            "required": true,
            "description": "Current model identifier, for example bfl/flux-1/schnell."
          },
          {
            "name": "prompt",
            "type": "string",
            "required": true,
            "description": "Text description of the image"
          },
          {
            "name": "aspect_ratio",
            "type": "string",
            "required": false,
            "description": "Output aspect ratio. Flux 1 Schnell defaults to 16:9."
          },
          {
            "name": "guidance_scale",
            "type": "number",
            "required": false,
            "description": "Prompt guidance strength from 1 to 20."
          },
          {
            "name": "output_format",
            "type": "jpeg | png",
            "required": false,
            "description": "Output image format. Flux 1 Schnell defaults to jpeg."
          },
          {
            "name": "mode",
            "type": "string",
            "required": false,
            "description": "Set to async only when the selected model supports asynchronous execution"
          },
          {
            "name": "webhook_url",
            "type": "string",
            "required": false,
            "description": "Public HTTPS callback URL for this async task only"
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/run \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"bfl/flux-1/schnell\",\"prompt\":\"A futuristic city at sunset\",\"aspect_ratio\":\"1:1\"}'"
      },
      {
        "label": "Python",
        "language": "python",
        "code": "response = client.post(\"/v1/run\", json={\n    \"model\": \"bfl/flux-1/schnell\",\n    \"prompt\": \"A futuristic city at sunset, cyberpunk style\",\n    \"aspect_ratio\": \"1:1\"\n})\nprint(response.json()[\"outputs\"][0][\"url\"])"
      }
    ],
    "response": { "status": "200 OK", "code": "{\n  \"id\": \"run_01...\",\n  \"status\": \"completed\",\n  \"outputs\": [{ \"url\": \"https://media.sandbase.ai/images/output.png\" }]\n}" }
  },
  "models/list": {
    "title": "List Models",
    "operation": "Models",
    "method": "GET",
    "path": "/v1/models",
    "description": "List enabled logical models in the OpenAI-compatible model-list format.",
    "groups": [
      {
        "title": "Query parameters",
        "fields": [
          {
            "name": "q",
            "type": "string",
            "required": false,
            "description": "Fuzzy search over model name, display name, vendor, and description."
          },
          {
            "name": "vendor",
            "type": "string",
            "required": false,
            "description": "Filter by vendor, for example OpenAI or Anthropic."
          },
          {
            "name": "type",
            "type": "string",
            "required": false,
            "description": "Filter by model type. Defaults to llm."
          },
          {
            "name": "order",
            "type": "string",
            "required": false,
            "description": "Sort order: sort_order, most-popular, newest, or name."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl \"https://api.sandbase.ai/v1/models\" \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"object\": \"list\",\n  \"data\": [\n    {\n      \"id\": \"openai/gpt-4o\",\n      \"object\": \"model\",\n      \"created\": 1783353600,\n      \"owned_by\": \"openai\"\n    }\n  ]\n}"
    }
  },
  "models/video": {
    "title": "Video Generation",
    "operation": "Models",
    "method": "POST",
    "path": "/v1/run",
    "description": "Generate videos using AI models. Video generation is asynchronous — you submit a request and poll for results.",
    "groups": [
      {
        "title": "Request body",
        "fields": [
          {
            "name": "model",
            "type": "string",
            "required": true,
            "description": "Current model identifier, for example kwaivgi/kling-video/3.0/turbo/standard/text-to-video."
          },
          {
            "name": "prompt",
            "type": "string",
            "required": true,
            "description": "Text description of the video"
          },
          {
            "name": "duration",
            "type": "number",
            "required": false,
            "description": "Video duration in seconds"
          },
          {
            "name": "image_url",
            "type": "string",
            "required": false,
            "description": "Reference image for image-to-video"
          },
          {
            "name": "webhook_url",
            "type": "string",
            "required": false,
            "description": "Public HTTPS callback URL for this async task only"
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/run \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"kwaivgi/kling-video/3.0/turbo/standard/text-to-video\",\"prompt\":\"A cat playing piano\",\"duration\":5}'"
      },
      {
        "label": "Python",
        "language": "python",
        "code": "# 1. Submit generation request\nresponse = client.post(\"/v1/run\", json={\n    \"model\": \"kwaivgi/kling-video/3.0/turbo/standard/text-to-video\",\n    \"prompt\": \"A cat playing piano\",\n    \"duration\": 5,\n    \"webhook_url\": \"https://hooks.example.com/sandbase/task?token=opaque-token\"\n})\ngeneration_id = response.json()[\"id\"]\n\n# 2. SandBase posts the terminal event to webhook_url.\n# You may still poll the existing result endpoint as a fallback.\nimport time\nwhile True:\n    result = client.get(f\"/v1/run/{generation_id}\").json()\n    if result[\"status\"] in (\"completed\", \"failed\", \"timeout\"):\n        print(result)\n        break\n    time.sleep(5)"
      }
    ],
    "response": { "status": "202 Accepted", "code": "{\n  \"id\": \"run_01...\",\n  \"status\": \"pending\",\n  \"model\": \"kwaivgi/kling-video/3.0/turbo/standard/text-to-video\"\n}" }
  },
  "sessions/archive": {
    "title": "Archive Session",
    "operation": "Sessions",
    "method": "POST",
    "path": "/v1/sessions/{session_id}/archive",
    "description": "Archive a Session while preserving its record.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "session_id",
            "type": "string",
            "required": true,
            "description": "Identifier for session id."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/sessions/sess_01.../archive \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ]
  },
  "sessions/create": {
    "title": "Create Session",
    "operation": "Sessions",
    "method": "POST",
    "path": "/v1/sessions",
    "description": "Create a stateful execution of an Agent in an Environment.",
    "groups": [
      {
        "title": "Request body",
        "fields": [
          {
            "name": "agent",
            "type": "string",
            "required": true,
            "description": "Agent ID used by this Session."
          },
          {
            "name": "environment_id",
            "type": "string",
            "required": false,
            "description": "Optional authorized Session override. Omit to use the Agent-owned Environment."
          },
          {
            "name": "title",
            "type": "string",
            "required": false,
            "description": "Human-readable Session title."
          },
          {
            "name": "metadata",
            "type": "object",
            "required": false,
            "description": "Application metadata returned with the Session."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/sessions \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"agent\": \"agent_01...\",\n    \"environment_id\": \"env_01...\",\n    \"title\": \"Customer research\"\n  }'"
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"sess_01...\",\n  \"type\": \"session\",\n  \"agent_id\": \"agent_01...\",\n  \"agent_version\": 1,\n  \"environment_id\": \"env_01...\",\n  \"title\": \"Customer research\",\n  \"status\": \"idle\",\n  \"metadata\": {},\n  \"archived_at\": null,\n  \"created_at\": \"2026-08-03T10:00:00Z\",\n  \"updated_at\": \"2026-08-03T10:00:00Z\"\n}"
    }
  },
  "sessions/get": {
    "title": "Get Session",
    "operation": "Sessions",
    "method": "GET",
    "path": "/v1/sessions/{session_id}",
    "description": "Retrieve a session by ID, including current status and agent reference.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "session_id",
            "type": "string",
            "required": true,
            "description": "The session ID (sess...)"
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "Python",
        "language": "python",
        "code": "from anthropic import Anthropic\n\nclient = Anthropic(\n    api_key=\"sk-sb-YOUR_KEY\",\n    base_url=\"https://api.sandbase.ai\"\n)\n\nsession = client.beta.sessions.retrieve(\n    session_id=\"sess_01abc...\"\n)\nprint(f\"Status: {session.status}\")"
      },
      {
        "label": "TypeScript",
        "language": "typescript",
        "code": "const session = await client.beta.sessions.retrieve('sess_01abc...');\nconsole.log(`Status: ${session.status}`);"
      },
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl https://api.sandbase.ai/v1/sessions/sess_01abc... \\\n  -H \"Authorization: Bearer sk-sb-YOUR_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"sess_01abc...\",\n  \"type\": \"session\",\n  \"status\": \"idle\",\n  \"title\": \"Research task\",\n  \"agent_id\": \"agent_01HqR2k7...\",\n  \"agent_version\": 1,\n  \"environment_id\": \"env_01abc...\",\n  \"metadata\": { \"user_id\": \"usr_123\", \"task\": \"research\" },\n  \"archived_at\": null,\n  \"created_at\": \"2026-05-29T10:00:00Z\",\n  \"updated_at\": \"2026-05-29T10:05:00Z\"\n}"
    }
  },
  "sessions/list-events": {
    "title": "List Events",
    "operation": "Sessions",
    "method": "GET",
    "path": "/v1/sessions/{session_id}/events",
    "description": "List the event history of a session.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "session_id",
            "type": "string",
            "required": true,
            "description": "The session ID (sess...)"
          }
        ]
      },
      {
        "title": "Event object",
        "fields": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "Event ID (sevt...)"
          },
          {
            "name": "type",
            "type": "string",
            "required": false,
            "description": "Event type (see below)"
          },
          {
            "name": "content",
            "type": "object[]",
            "required": false,
            "description": "Typed content blocks carried by the event."
          },
          {
            "name": "stop_reason",
            "type": "object | null",
            "required": false,
            "description": "Reason execution stopped, when present."
          },
          {
            "name": "model_used",
            "type": "string | null",
            "required": false,
            "description": "Model used to produce the event, when applicable."
          },
          {
            "name": "tokens_in",
            "type": "integer",
            "required": false,
            "description": "Input tokens for this event (0 when N/A)"
          },
          {
            "name": "tokens_out",
            "type": "integer",
            "required": false,
            "description": "Output tokens for this event (0 when N/A)"
          },
          {
            "name": "duration_ms",
            "type": "integer | null",
            "required": false,
            "description": "Processing duration in milliseconds, when measured."
          },
          {
            "name": "processed_at",
            "type": "string | null",
            "required": false,
            "description": "RFC 3339 processing timestamp, when available."
          },
          {
            "name": "created_at",
            "type": "string",
            "required": false,
            "description": "RFC 3339 timestamp"
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "Python",
        "language": "python",
        "code": "from anthropic import Anthropic\n\nclient = Anthropic(\n    api_key=\"sk-sb-YOUR_KEY\",\n    base_url=\"https://api.sandbase.ai\"\n)\n\npage = client.beta.sessions.events.list(session_id=\"sess_01abc...\")\nfor event in page.data:\n    print(f\"{event.type}: {event.id}\")"
      },
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl \"https://api.sandbase.ai/v1/sessions/sess_01abc.../events\" \\\n  -H \"Authorization: Bearer sk-sb-YOUR_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"data\": [\n    {\n      \"id\": \"sevt_01abc...\",\n      \"type\": \"user.message\",\n      \"content\": [{ \"type\": \"text\", \"text\": \"Where is my order #1234?\" }],\n      \"stop_reason\": null,\n      \"model_used\": null,\n      \"tokens_in\": 0,\n      \"tokens_out\": 0,\n      \"duration_ms\": null,\n      \"processed_at\": \"2026-05-29T10:00:00Z\",\n      \"created_at\": \"2026-05-29T10:00:00Z\"\n    },\n    {\n      \"id\": \"sevt_02def...\",\n      \"type\": \"agent.message\",\n      \"content\": [{ \"type\": \"text\", \"text\": \"Let me look up order #1234 for you.\" }],\n      \"stop_reason\": null,\n      \"model_used\": \"claude-sonnet-4\",\n      \"tokens_in\": 1200,\n      \"tokens_out\": 80,\n      \"duration_ms\": 1840,\n      \"processed_at\": \"2026-05-29T10:00:02Z\",\n      \"created_at\": \"2026-05-29T10:00:02Z\"\n    }\n  ]\n}"
    }
  },
  "sessions/list": {
    "title": "List Sessions",
    "operation": "Sessions",
    "method": "GET",
    "path": "/v1/sessions",
    "description": "List Agent Sessions for your organization with filtering and cursor pagination.",
    "groups": [
      {
        "title": "Query parameters",
        "fields": [
          {
            "name": "agent_id",
            "type": "string",
            "required": false,
            "description": "Filter Sessions created with this Agent ID"
          },
          {
            "name": "agent_version",
            "type": "integer",
            "required": false,
            "description": "Filter by Agent version. Only applies when agent_id is also set."
          },
          {
            "name": "include_archived",
            "type": "boolean",
            "required": false,
            "description": "Include archived Sessions. Default false."
          },
          {
            "name": "created_at[gte]",
            "type": "string",
            "required": false,
            "description": "Only Sessions created at or after this RFC 3339 time."
          },
          {
            "name": "created_at[lte]",
            "type": "string",
            "required": false,
            "description": "Only Sessions created at or before this RFC 3339 time."
          },
          {
            "name": "limit",
            "type": "integer",
            "required": false,
            "description": "Page size. Default 20, max 100."
          },
          {
            "name": "page",
            "type": "string",
            "required": false,
            "description": "Opaque cursor from a previous response's next_page field."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "Python",
        "language": "python",
        "code": "from anthropic import Anthropic\n\nclient = Anthropic(\n    api_key=\"sk-sb-YOUR_KEY\",\n    base_url=\"https://api.sandbase.ai\"\n)\n\npage = client.beta.sessions.list(agent_id=\"agent_01HqR2k7...\", limit=20)\nfor session in page.data:\n    print(f\"{session.id} — {session.status} — {session.title}\")"
      },
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl \"https://api.sandbase.ai/v1/sessions?agent_id=agent_01HqR2k7...&created_at%5Bgte%5D=2026-05-01T00%3A00%3A00Z&limit=20\" \\\n  -H \"Authorization: Bearer sk-sb-YOUR_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"data\": [\n    {\n      \"id\": \"sess_01abc...\",\n      \"type\": \"session\",\n      \"status\": \"idle\",\n      \"title\": \"Research task\",\n      \"agent_id\": \"agent_01HqR2k7...\",\n      \"agent_version\": 1,\n      \"environment_id\": \"env_01abc...\",\n      \"metadata\": {},\n      \"archived_at\": null,\n      \"created_at\": \"2026-05-29T10:00:00Z\",\n      \"updated_at\": \"2026-05-29T10:02:00Z\"\n    }\n  ],\n  \"next_page\": \"page_eyJjIjoiMjAyNi0wNS0yOVQxMDowMDowMFoiLCJpIjoic2Vzc18wMSJ9\"\n}"
    }
  },
  "sessions/send-events": {
    "title": "Send Session Events",
    "operation": "Sessions",
    "method": "POST",
    "path": "/v1/sessions/{session_id}/events",
    "description": "Send a message or interrupt event to a Session.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "session_id",
            "type": "string",
            "required": true,
            "description": "Identifier for session id."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/sessions/sess_01.../events \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"events\": [{\n      \"type\": \"user.message\",\n      \"content\": [{\"type\": \"text\", \"text\": \"Summarize this account.\"}]\n    }]\n  }'"
      }
    ]
  },
  "sessions/stream": {
    "title": "Stream Events",
    "operation": "Sessions",
    "method": "GET",
    "path": "/v1/sessions/{session_id}/events/stream",
    "description": "Replay persisted Session Events, then follow newly persisted Events via Server-Sent Events (SSE).",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "session_id",
            "type": "string",
            "required": true,
            "description": "The session ID (sess...)"
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "TEXT",
        "language": "text",
        "code": "session.status_running\n  -> agent.tool_use -> agent.tool_result   (zero or more)\n  -> agent.message                         (zero or more)\nsession.status_idle (stop_reason: end_turn)"
      },
      {
        "label": "Python",
        "language": "python",
        "code": "from anthropic import Anthropic\n\nclient = Anthropic(\n    api_key=\"sk-sb-YOUR_KEY\",\n    base_url=\"https://api.sandbase.ai\"\n)\n\nfor event in client.beta.sessions.events.stream(session_id=\"sess_01abc...\"):\n    if event.type == \"agent.message\":\n        for block in event.content:\n            print(block.text, end=\"\")\n    elif event.type == \"session.status_idle\":\n        print(f\"\\n[done: {event.stop_reason.type}]\")\n        break"
      },
      {
        "label": "Raw SSE",
        "language": "python",
        "code": "import json, httpx\n\nwith httpx.stream(\"GET\",\n    \"https://api.sandbase.ai/v1/sessions/sess_01abc.../events/stream\",\n    headers={\"Authorization\": \"Bearer sk-sb-YOUR_KEY\"}\n) as response:\n    for line in response.iter_lines():\n        if line.startswith(\"data: \"):\n            event = json.loads(line[6:])\n            if \"type\" in event:\n                print(event[\"type\"])"
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "id: sevt_01...\ndata: {\"id\":\"sevt_01...\",\"type\":\"session.status_running\",\"processed_at\":\"2026-05-29T10:00:00Z\",\"created_at\":\"2026-05-29T10:00:00Z\"}\n\n: heartbeat\n\nid: sevt_02...\ndata: {\"id\":\"sevt_02...\",\"type\":\"agent.tool_use\",\"content\":{\"name\":\"web_search\",\"input\":{\"query\":\"order 1234\"}},\"processed_at\":\"2026-05-29T10:00:01Z\",\"created_at\":\"2026-05-29T10:00:01Z\"}\n\nid: sevt_03...\ndata: {\"id\":\"sevt_03...\",\"type\":\"agent.message\",\"content\":[{\"type\":\"text\",\"text\":\"Your order #1234 shipped yesterday.\"}],\"processed_at\":\"2026-05-29T10:00:03Z\",\"created_at\":\"2026-05-29T10:00:03Z\"}"
    }
  },
  "skills/create": {
    "title": "Create Skill",
    "operation": "Skills",
    "method": "POST",
    "path": "/v1/skills",
    "description": "Create a reusable Skill resource from an uploaded bundle or Git source.",
    "groups": [
      {
        "title": "Request body",
        "fields": [
          {
            "name": "name",
            "type": "string",
            "required": true,
            "description": "Display name, up to 100 characters."
          },
          {
            "name": "description",
            "type": "string",
            "required": false,
            "description": "Description, up to 1,000 characters."
          },
          {
            "name": "categories",
            "type": "string[]",
            "required": false,
            "description": "Category labels."
          },
          {
            "name": "skill_file_url",
            "type": "string",
            "required": false,
            "description": "URL returned by /v1/skills/files. Required when git_url is absent."
          },
          {
            "name": "git_url",
            "type": "string",
            "required": false,
            "description": "Git source URL. Required when skill_file_url is absent."
          },
          {
            "name": "preview_image_urls",
            "type": "string[]",
            "required": false,
            "description": "Preview image URLs."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/skills \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"name\": \"release-notes\",\n    \"description\": \"Draft concise release notes\",\n    \"categories\": [\"writing\"],\n    \"skill_file_url\": \"https://media.sandbase.ai/_private/.../release-notes.zip\"\n  }'"
      }
    ],
    "response": {
      "status": "201 Created",
      "code": "{\n  \"id\": \"550e8400-e29b-41d4-a716-446655440000\",\n  \"name\": \"acme/release-notes\",\n  \"display_name\": \"release-notes\",\n  \"vendor_slug\": \"acme\",\n  \"plugin_slug\": \"release-notes\",\n  \"icon_url\": \"\",\n  \"preview_urls\": [],\n  \"created_at\": \"2026-08-03T10:00:00Z\"\n}"
    }
  },
  "skills/delete": {
    "title": "Delete Skill",
    "operation": "Skills",
    "method": "DELETE",
    "path": "/v1/skills/{skill_id}",
    "description": "Soft-delete a Skill owned by the current organization.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "skill_id",
            "type": "string",
            "required": true,
            "description": "Skill UUID."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X DELETE https://api.sandbase.ai/v1/skills/550e8400-e29b-41d4-a716-446655440000 \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"550e8400-e29b-41d4-a716-446655440000\",\n  \"deleted\": true\n}"
    }
  },
  "skills/get": {
    "title": "Get Skill",
    "operation": "Skills",
    "method": "GET",
    "path": "/v1/skills/{skill_id}",
    "description": "Retrieve one Skill and its source metadata.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "skill_id",
            "type": "string",
            "required": true,
            "description": "Skill UUID."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl https://api.sandbase.ai/v1/skills/550e8400-e29b-41d4-a716-446655440000 \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"550e8400-e29b-41d4-a716-446655440000\",\n  \"name\": \"acme/release-notes\",\n  \"display_name\": \"release-notes\",\n  \"vendor_slug\": \"acme\",\n  \"plugin_slug\": \"release-notes\",\n  \"description\": \"Draft concise release notes\",\n  \"categories\": [\"writing\"],\n  \"icon_url\": \"\",\n  \"preview_urls\": [],\n  \"skill_file_url\": \"https://media.sandbase.ai/_private/.../release-notes.zip\",\n  \"git_url\": \"\",\n  \"created_at\": \"2026-08-03T10:00:00Z\",\n  \"updated_at\": \"2026-08-03T10:00:00Z\"\n}"
    }
  },
  "skills/list": {
    "title": "List Skills",
    "operation": "Skills",
    "method": "GET",
    "path": "/v1/skills",
    "description": "List Skills owned by the current organization.",
    "groups": [
      {
        "title": "Query parameters",
        "fields": [
          {
            "name": "page",
            "type": "integer",
            "required": false,
            "description": "Page number. Default 1. Values below 1 are normalized to 1."
          },
          {
            "name": "page_size",
            "type": "integer",
            "required": false,
            "description": "Items per page. The server applies its configured maximum."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl \"https://api.sandbase.ai/v1/skills?page=1&page_size=20\" \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"data\": [\n    {\n      \"id\": \"550e8400-e29b-41d4-a716-446655440000\",\n      \"name\": \"acme/release-notes\",\n      \"display_name\": \"release-notes\",\n      \"vendor_slug\": \"acme\",\n      \"plugin_slug\": \"release-notes\",\n      \"description\": \"Draft concise release notes\",\n      \"icon_url\": \"\",\n      \"preview_urls\": [],\n      \"created_at\": \"2026-08-03T10:00:00Z\",\n      \"updated_at\": \"2026-08-03T10:00:00Z\"\n    }\n  ],\n  \"total\": 1,\n  \"page\": 1,\n  \"page_size\": 20\n}"
    }
  },
  "skills/update": {
    "title": "Update Skill",
    "operation": "Skills",
    "method": "PUT",
    "path": "/v1/skills/{skill_id}",
    "description": "Update Skill metadata or replace its uploaded bundle.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "skill_id",
            "type": "string",
            "required": true,
            "description": "Skill UUID."
          }
        ]
      },
      {
        "title": "Request body",
        "fields": [
          {
            "name": "name",
            "type": "string",
            "required": false,
            "description": "Replacement display name, up to 100 characters. An omitted value becomes empty."
          },
          {
            "name": "description",
            "type": "string",
            "required": false,
            "description": "Replacement description, up to 1,000 characters. An omitted value becomes empty."
          },
          {
            "name": "categories",
            "type": "string[]",
            "required": false,
            "description": "Replacement category list. An omitted value becomes empty."
          },
          {
            "name": "skill_file_url",
            "type": "string",
            "required": false,
            "description": "Replacement uploaded Skill bundle URL."
          },
          {
            "name": "preview_image_urls",
            "type": "string[]",
            "required": false,
            "description": "Replacement preview image list."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X PUT https://api.sandbase.ai/v1/skills/550e8400-e29b-41d4-a716-446655440000 \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"name\": \"release-notes\",\n    \"description\": \"Draft release notes with a concise changelog\",\n    \"categories\": [\"writing\", \"product\"]\n  }'"
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"550e8400-e29b-41d4-a716-446655440000\",\n  \"name\": \"acme/release-notes\",\n  \"display_name\": \"release-notes\",\n  \"vendor_slug\": \"acme\",\n  \"plugin_slug\": \"release-notes\",\n  \"description\": \"Draft release notes with a concise changelog\",\n  \"categories\": [\"writing\", \"product\"],\n  \"icon_url\": \"\",\n  \"preview_urls\": [],\n  \"skill_file_url\": \"https://media.sandbase.ai/_private/.../release-notes.zip\",\n  \"git_url\": \"\",\n  \"created_at\": \"2026-08-03T10:00:00Z\",\n  \"updated_at\": \"2026-08-03T10:05:00Z\"\n}"
    }
  },
  "inference/responses": {
    "title": "Create Response",
    "operation": "Inference",
    "method": "POST",
    "path": "/v1/responses",
    "description": "Create an OpenAI-compatible model response. Request fields beyond model and stream are forwarded when supported by the selected provider.",
    "signature": "client.responses.create(params)",
    "groups": [
      {
        "title": "Request body",
        "schema": "ResponseCreateParams",
        "fields": [
          { "name": "model", "type": "string", "required": true, "description": "Model identifier from the Models API." },
          { "name": "input", "type": "string | object[]", "required": false, "description": "Text, message items, or other input supported by the selected model and provider." },
          { "name": "instructions", "type": "string", "required": false, "description": "System or developer instruction for the response." },
          { "name": "stream", "type": "boolean", "required": false, "default": "false", "description": "Return OpenAI-compatible Server-Sent Events." },
          { "name": "tools", "type": "object[]", "required": false, "description": "Tools available to the model." }
        ]
      }
    ],
    "examples": [
      { "label": "cURL", "language": "bash", "code": "curl https://api.sandbase.ai/v1/responses \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"openai/gpt-5.2\",\"input\":\"Explain immutable infrastructure in one sentence.\"}'" },
      { "label": "Python", "language": "python", "code": "from openai import OpenAI\n\nclient = OpenAI(api_key=\"sk-sb-...\", base_url=\"https://api.sandbase.ai/v1\")\nresponse = client.responses.create(\n    model=\"openai/gpt-5.2\",\n    input=\"Explain immutable infrastructure in one sentence.\",\n)\nprint(response.output_text)" },
      { "label": "TypeScript", "language": "typescript", "code": "import OpenAI from \"openai\";\n\nconst client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: \"https://api.sandbase.ai/v1\" });\nconst response = await client.responses.create({\n  model: \"openai/gpt-5.2\",\n  input: \"Explain immutable infrastructure in one sentence.\",\n});\nconsole.log(response.output_text);" }
    ],
    "response": { "status": "200 OK", "code": "{\n  \"id\": \"resp_01...\",\n  \"object\": \"response\",\n  \"status\": \"completed\",\n  \"model\": \"openai/gpt-5.2\",\n  \"output\": []\n}" },
    "notes": [
      { "title": "Transparent compatibility", "description": "SandBase uses model and stream for routing and forwards other supported fields to the selected provider. Available fields and output items can vary by model and provider." },
      { "title": "Streaming", "description": "Set stream to true to receive OpenAI-compatible Responses API Server-Sent Events." }
    ],
    "errors": [
      { "status": "400", "description": "Invalid JSON, missing model, or an invalid provider request." },
      { "status": "401", "description": "Missing or invalid API key." },
      { "status": "402", "description": "Organization spending limit reached." },
      { "status": "404", "description": "Model not found or unavailable." },
      { "status": "429", "description": "Rate limit exceeded." }
    ]
  },
  "inference/chat-completions": {
    "title": "Create Chat Completion",
    "operation": "Inference",
    "method": "POST",
    "path": "/v1/chat/completions",
    "description": "Create an OpenAI-compatible chat completion with any supported SandBase chat model.",
    "signature": "client.chat.completions.create(params)",
    "groups": [
      {
        "title": "Request body",
        "schema": "ChatCompletionCreateParams",
        "fields": [
          { "name": "model", "type": "string", "required": true, "description": "Model identifier from the Models API." },
          { "name": "messages", "type": "object[]", "required": true, "description": "Conversation messages in system, user, assistant, or tool order." },
          { "name": "temperature", "type": "number", "required": false, "default": "1", "description": "Sampling temperature from 0 to 2." },
          { "name": "top_p", "type": "number", "required": false, "default": "1", "description": "Nucleus sampling threshold." },
          { "name": "max_tokens", "type": "integer", "required": false, "description": "Maximum number of output tokens." },
          { "name": "stream", "type": "boolean", "required": false, "default": "false", "description": "Return incremental Server-Sent Events." },
          { "name": "stop", "type": "string | string[]", "required": false, "description": "Sequence or sequences that stop generation." },
          { "name": "tools", "type": "object[]", "required": false, "description": "Function definitions available to the model." },
          { "name": "tool_choice", "type": "string | object", "required": false, "default": "auto", "description": "Controls whether and which tool is selected." },
          { "name": "response_format", "type": "object", "required": false, "description": "JSON object or JSON Schema output configuration." },
          { "name": "n", "type": "integer", "required": false, "default": "1", "description": "Number of completion choices to generate." },
          { "name": "presence_penalty", "type": "number", "required": false, "default": "0", "description": "Presence penalty from -2 to 2." },
          { "name": "frequency_penalty", "type": "number", "required": false, "default": "0", "description": "Frequency penalty from -2 to 2." },
          { "name": "stream_options", "type": "object", "required": false, "description": "Streaming options such as include_usage." }
        ]
      }
    ],
    "examples": [
      { "label": "cURL", "language": "bash", "code": "curl https://api.sandbase.ai/v1/chat/completions \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"deepseek/deepseek-v4-flash\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}'" },
      { "label": "Python", "language": "python", "code": "from openai import OpenAI\n\nclient = OpenAI(api_key=\"sk-sb-...\", base_url=\"https://api.sandbase.ai/v1\")\nresponse = client.chat.completions.create(\n    model=\"deepseek/deepseek-v4-flash\",\n    messages=[{\"role\": \"user\", \"content\": \"Hello\"}],\n)\nprint(response.choices[0].message.content)" },
      { "label": "TypeScript", "language": "typescript", "code": "import OpenAI from \"openai\";\n\nconst client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: \"https://api.sandbase.ai/v1\" });\nconst response = await client.chat.completions.create({\n  model: \"deepseek/deepseek-v4-flash\",\n  messages: [{ role: \"user\", content: \"Hello\" }],\n});\nconsole.log(response.choices[0].message.content);" }
    ],
    "response": { "status": "200 OK", "code": "{\n  \"id\": \"chatcmpl_01...\",\n  \"object\": \"chat.completion\",\n  \"model\": \"deepseek/deepseek-v4-flash\",\n  \"choices\": [{\n    \"index\": 0,\n    \"message\": { \"role\": \"assistant\", \"content\": \"Hello! How can I help?\" },\n    \"finish_reason\": \"stop\"\n  }],\n  \"usage\": { \"prompt_tokens\": 8, \"completion_tokens\": 7, \"total_tokens\": 15 }\n}" },
    "notes": [
      { "title": "Streaming and tools", "description": "Set stream to true for SSE. Tool calls and multimodal content follow the OpenAI-compatible schema; detailed workflows live in the Chat Completions guide." },
      { "title": "Model support", "description": "Optional capabilities depend on the selected model. Inspect model metadata before using tools, vision, or strict structured output." }
    ],
    "errors": [
      { "status": "400", "description": "Invalid request body or unsupported parameter." },
      { "status": "401", "description": "Missing or invalid API key." },
      { "status": "404", "description": "Model not found or unavailable." },
      { "status": "429", "description": "Rate limit exceeded." }
    ]
  },
  "inference/anthropic-messages": {
    "title": "Create Anthropic Message",
    "operation": "Inference",
    "method": "POST",
    "path": "/v1/messages",
    "description": "Create a message through SandBase's Anthropic-compatible Messages endpoint.",
    "signature": "client.messages.create(params)",
    "groups": [
      {
        "title": "Request body",
        "schema": "MessageCreateParams",
        "fields": [
          { "name": "model", "type": "string", "required": true, "description": "Anthropic-compatible model identifier." },
          { "name": "messages", "type": "object[]", "required": true, "description": "User and assistant messages containing text or typed content blocks." },
          { "name": "max_tokens", "type": "integer", "required": true, "description": "Maximum number of output tokens." },
          { "name": "system", "type": "string | object[]", "required": false, "description": "Top-level system instruction." },
          { "name": "temperature", "type": "number", "required": false, "default": "1", "description": "Sampling temperature from 0 to 1." },
          { "name": "top_p", "type": "number", "required": false, "description": "Nucleus sampling threshold." },
          { "name": "top_k", "type": "integer", "required": false, "description": "Limit sampling to the top K tokens." },
          { "name": "stop_sequences", "type": "string[]", "required": false, "description": "Custom sequences that stop generation." },
          { "name": "stream", "type": "boolean", "required": false, "default": "false", "description": "Return Anthropic-style Server-Sent Events." },
          { "name": "metadata", "type": "object", "required": false, "description": "Request metadata, including an optional user_id." },
          { "name": "tools", "type": "object[]", "required": false, "description": "Tool definitions available to the model." },
          { "name": "tool_choice", "type": "object", "required": false, "description": "Controls tool selection behavior." },
          { "name": "thinking", "type": "object", "required": false, "description": "Extended thinking configuration for supported models." }
        ]
      }
    ],
    "examples": [
      { "label": "cURL", "language": "bash", "code": "curl https://api.sandbase.ai/v1/messages \\\n  -H \"x-api-key: $SANDBASE_API_KEY\" \\\n  -H \"anthropic-version: 2023-06-01\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"anthropic/claude-sonnet-4\",\"max_tokens\":256,\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}'" },
      { "label": "Python", "language": "python", "code": "from anthropic import Anthropic\n\nclient = Anthropic(api_key=\"sk-sb-...\", base_url=\"https://api.sandbase.ai\")\nmessage = client.messages.create(\n    model=\"anthropic/claude-sonnet-4\",\n    max_tokens=256,\n    messages=[{\"role\": \"user\", \"content\": \"Hello\"}],\n)\nprint(message.content[0].text)" },
      { "label": "TypeScript", "language": "typescript", "code": "import Anthropic from \"@anthropic-ai/sdk\";\n\nconst client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: \"https://api.sandbase.ai\" });\nconst message = await client.messages.create({\n  model: \"anthropic/claude-sonnet-4\",\n  max_tokens: 256,\n  messages: [{ role: \"user\", content: \"Hello\" }],\n});\nconsole.log(message.content);" }
    ],
    "response": { "status": "200 OK", "code": "{\n  \"id\": \"msg_01...\",\n  \"type\": \"message\",\n  \"role\": \"assistant\",\n  \"model\": \"anthropic/claude-sonnet-4\",\n  \"content\": [{ \"type\": \"text\", \"text\": \"Hello! How can I help?\" }],\n  \"stop_reason\": \"end_turn\",\n  \"usage\": { \"input_tokens\": 8, \"output_tokens\": 7 }\n}" },
    "notes": [
      { "title": "Authentication", "description": "Use x-api-key or Authorization: Bearer. When both are provided, x-api-key takes precedence." },
      { "title": "Compatibility", "description": "Content blocks, tool use, thinking, and streaming follow the Anthropic-compatible schema. Availability depends on the selected model." }
    ],
    "errors": [
      { "status": "400", "description": "Invalid request body or unsupported feature." },
      { "status": "401", "description": "Missing or invalid API key." },
      { "status": "404", "description": "Model not found or unavailable." },
      { "status": "429", "description": "Rate limit exceeded." }
    ]
  },
  "tasks/cost": {
    "title": "Get Task Cost",
    "operation": "Tasks",
    "method": "GET",
    "path": "/v1/tasks/{task_id}/cost",
    "description": "Retrieve the asynchronous settlement status, final cost, and token usage for a recent SandBase task.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "task_id",
            "type": "string",
            "required": true,
            "description": "Opaque task ID returned by a billable operation, including an x-task-id response header when present."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "HTTP",
        "language": "http",
        "code": "Authorization: Bearer sk-sb-YOUR_API_KEY"
      },
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -sS \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  \"https://api.sandbase.ai/v1/tasks/$TASK_ID/cost\" | jq ."
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"f3d2e8a1-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\n  \"status\": \"completed\",\n  \"settled\": true,\n  \"currency\": \"USD\",\n  \"cost\": \"0.001234\",\n  \"estimated_cost\": \"0.001234\",\n  \"usage\": {\n    \"prompt_tokens\": 1000,\n    \"completion_tokens\": 200,\n    \"total_tokens\": 1200,\n    \"cached_tokens\": 800,\n    \"cache_creation_tokens\": 0,\n    \"reasoning_tokens\": 0\n  }\n}"
    }
  }
}
