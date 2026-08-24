// Structured endpoint data shared by the API Reference pages.
export const generatedApiReferenceSpecs: Record<string, any> = {
  "account/balance": {
    "title": "Get Account Balance",
    "operation": "Account",
    "method": "GET",
    "path": "/v1/account/balance",
    "description": "Return the current USD balance and optional credit settings for the organization resolved from the API key.",
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl https://api.sandbase.ai/v1/account/balance \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"org_id\": \"550e8400-e29b-41d4-a716-446655440000\",\n  \"balance\": \"42.125000\",\n  \"credit_limit\": \"10.000000\",\n  \"alert_threshold\": \"5.000000\"\n}"
    }
  },
  "account/history": {
    "title": "List Account History",
    "operation": "Account",
    "method": "GET",
    "path": "/v1/account/history",
    "description": "List recent organization-scoped execution records, newest first. Error messages are sanitized and stored JSON snapshots are omitted when they cannot be decoded.",
    "groups": [
      {
        "title": "Query parameters",
        "fields": [
          { "name": "model", "type": "string", "required": false, "description": "Exact logical model name." },
          { "name": "api_key_id", "type": "string", "required": false, "description": "Exact API Key resource ID." },
          { "name": "type", "type": "multimodal | llm | api", "required": false, "description": "Execution category; multimodal includes image, video, and audio." },
          { "name": "status", "type": "completed | failure | in_progress", "required": false, "description": "Grouped execution status." },
          { "name": "error_type", "type": "string", "required": false, "description": "Exact error type, or unknown for records without one." },
          { "name": "range", "type": "1h | 24h | 7d | 30d", "required": false, "description": "Rolling created-at range; defaults to 7d." },
          { "name": "page", "type": "integer", "required": false, "description": "Page number, starting at 1." },
          { "name": "page_size", "type": "integer", "required": false, "description": "Items per page from 1 to 100; defaults to 20." },
          { "name": "request_id", "type": "string", "required": false, "description": "Exact organization-scoped execution ID. When set, other filters are ignored and one result is requested." },
          { "name": "time_basis", "type": "created_at | settled_at", "required": false, "description": "Timestamp basis for an explicit window." },
          { "name": "billing_scope", "type": "any | positive | token", "required": false, "description": "Settlement filter; positive and token require time_basis=settled_at." },
          { "name": "start_at", "type": "RFC 3339 timestamp", "required": false, "description": "Inclusive window start, paired with end_at." },
          { "name": "end_at", "type": "RFC 3339 timestamp", "required": false, "description": "Exclusive window end; the window cannot exceed 32 days." },
          { "name": "latency_sample", "type": "positive | terminal_positive", "required": false, "description": "Restrict latency samples to positive values." },
          { "name": "min_latency_ms", "type": "integer", "required": false, "description": "Minimum latency in milliseconds." }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl \"https://api.sandbase.ai/v1/account/history?range=24h&page_size=20\" \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"items\": [\n    {\n      \"id\": \"opaque-task-id\",\n      \"model\": \"openai/gpt-4o\",\n      \"type\": \"llm\",\n      \"execution_mode\": \"sync\",\n      \"status\": \"completed\",\n      \"latency_ms\": 842,\n      \"user_cost\": \"0.001250\",\n      \"prompt_tokens\": 120,\n      \"completion_tokens\": 48,\n      \"total_tokens\": 168,\n      \"cached_tokens\": 0,\n      \"cache_creation_tokens\": 0,\n      \"created_at\": \"2026-08-24T00:00:00Z\",\n      \"completed_at\": \"2026-08-24T00:00:01Z\",\n      \"api_key_prefix\": \"sk-1234567\"\n    }\n  ],\n  \"total\": 1,\n  \"page\": 1,\n  \"page_size\": 20\n}"
    }
  },
  "endpoints/acp": {
    "title": "Invoke Service with ACP",
    "operation": "Endpoints",
    "method": "POST",
    "path": "/v1/endpoints/{endpoint_id}/acp",
    "description": "Experimental ACP-over-HTTP transport. initialize, session/new, and session/cancel return JSON-RPC JSON; session/prompt streams newline-delimited JSON-RPC messages.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          { "name": "endpoint_id", "type": "string", "required": true, "description": "Active Endpoint configured with the acp protocol." }
        ]
      },
      {
        "title": "JSON-RPC request",
        "fields": [
          { "name": "jsonrpc", "type": "string", "required": false, "description": "Use 2.0." },
          { "name": "id", "type": "string | number | null", "required": false, "description": "Client identifier echoed in the response." },
          { "name": "method", "type": "string", "required": true, "description": "initialize, session/new, session/prompt, or session/cancel." },
          { "name": "params", "type": "object", "required": false, "description": "Method-specific parameters. Prompt and cancel require sessionId." }
        ]
      }
    ],
    "examples": [
      {
        "label": "Initialize",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/endpoints/ep_01.../acp -H \"Authorization: Bearer $SANDBASE_API_KEY\" -H \"Content-Type: application/json\" -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}}'"
      },
      {
        "label": "Create session",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/endpoints/ep_01.../acp -H \"Authorization: Bearer $SANDBASE_API_KEY\" -H \"Content-Type: application/json\" -d '{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"session/new\",\"params\":{}}'"
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"jsonrpc\": \"2.0\",\n  \"id\": 2,\n  \"result\": {\n    \"sessionId\": \"sess_01...\"\n  }\n}"
    },
    "notes": [
      { "title": "Prompt streaming", "description": "session/prompt returns application/x-ndjson session/update notifications followed by a final result containing stopReason." },
      { "title": "Experimental transport", "description": "ACP-over-HTTP may change. ACP Session IDs are canonical SandBase Session IDs." }
    ]
  },
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
    "description": "Create a manually triggered or scheduled Deployment from an existing Agent or a declarative runtime definition. JSON and YAML are supported.",
    "groups": [
      {
        "title": "Advanced request body",
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
      },
      {
        "title": "Declarative request body",
        "fields": [
          { "name": "name", "type": "string", "required": true, "description": "Display name for the Deployment." },
          { "name": "runtime", "type": "string", "required": true, "description": "Enabled declarative runtime. This release supports hermes." },
          { "name": "initial_events", "type": "array", "required": true, "description": "At least one valid user.message event." },
          { "name": "model", "type": "string | object", "required": false, "description": "Optional model override for the generated Agent." },
          { "name": "system", "type": "string", "required": false, "description": "Optional system instructions for the generated Agent." },
          { "name": "skills", "type": "array<string> | null", "required": false, "description": "Up to 20 vendor/plugin references." },
          { "name": "schedule", "type": "object | null", "required": false, "description": "Optional cron schedule." },
          { "name": "timeout_policy", "type": "object", "required": false, "description": "Optional hard and inactivity timeout settings." }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/deployments \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"name\": \"Daily customer brief\",\n    \"agent_id\": \"agent_01...\",\n    \"environment_id\": \"env_01...\",\n    \"initial_events\": [{\n      \"type\": \"user.message\",\n      \"content\": [{\"type\":\"text\",\"text\":\"Prepare today’s brief.\"}]\n    }],\n    \"schedule\": {\n      \"type\": \"cron\",\n      \"expression\": \"0 9 * * *\",\n      \"timezone\": \"Asia/Shanghai\"\n    }\n  }'"
      },
      {
        "label": "Declarative YAML",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/deployments -H \"Authorization: Bearer $SANDBASE_API_KEY\" -H \"Content-Type: application/yaml\" --data-binary $'name: Daily customer brief\\nruntime: hermes\\ninitial_events:\\n  - type: user.message\\n    content:\\n      - type: text\\n        text: Prepare today’s brief.'"
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
  "deployments/test-feishu-notification": {
    "title": "Test Feishu Notification",
    "operation": "Deployments",
    "method": "POST",
    "path": "/v1/deployments/{deployment_id}/notifications/feishu/test",
    "description": "Send a fixed SandBase test message to the Feishu webhook already saved on a Deployment. No URL or custom message is accepted.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          { "name": "deployment_id", "type": "string", "required": true, "description": "Deployment identifier." }
        ]
      },
      {
        "title": "Request body",
        "description": "Omit the body or send an empty JSON object.",
        "fields": []
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/deployments/depl_01.../notifications/feishu/test \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{}'"
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"delivered\": true\n}"
    },
    "notes": [
      { "title": "Saved target only", "description": "Configure notification_settings.feishu_webhook_url through the Deployment update API first. The secret URL is never returned." }
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
    "groups": [
      {
        "title": "Request body",
        "schema": "ImageEditParams",
        "fields": [
          { "name": "model", "type": "string", "required": true, "description": "Use gpt-image-2 on this endpoint." },
          { "name": "prompt", "type": "string", "required": true, "description": "Text description of the requested edit." },
          { "name": "image", "type": "file | file[]", "required": true, "description": "One or more source image files. Repeat the multipart field for multiple images." },
          { "name": "mask", "type": "file", "required": false, "description": "Optional mask image for inpainting." },
          { "name": "n", "type": "integer", "required": false, "description": "Number of edited images to return when supported." },
          { "name": "size", "type": "string", "required": false, "description": "Output dimensions supported by the model." },
          { "name": "quality", "type": "string", "required": false, "description": "Output quality supported by the model." },
          { "name": "background", "type": "string", "required": false, "description": "Output background setting." },
          { "name": "input_fidelity", "type": "string", "required": false, "description": "How closely supported models should preserve source-image details." },
          { "name": "output_format", "type": "string", "required": false, "description": "Output encoding such as png, webp, or jpeg." },
          { "name": "output_compression", "type": "integer", "required": false, "description": "Output compression level from 0 to 100." },
          { "name": "user", "type": "string", "required": false, "description": "Provider-compatible end-user identifier." }
        ]
      }
    ],
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
  "assets/upload": {
    "title": "Upload Media",
    "operation": "Assets",
    "method": "POST",
    "path": "/v1/upload",
    "description": "Upload an image, audio, or video file and receive a stored URL for a supported model input.",
    "groups": [
      {
        "title": "Multipart form",
        "fields": [
          { "name": "file", "type": "binary", "required": true, "description": "Image up to 20 MB, audio up to 50 MB, or video up to 500 MB. Supported formats are listed below." },
          { "name": "type", "type": "image | audio | video", "required": false, "description": "Optional category hint. MIME detection from the file still controls validation." }
        ]
      },
      {
        "title": "Supported MIME types",
        "fields": [
          { "name": "Image", "type": "string", "required": false, "description": "image/jpeg, image/png, image/webp, image/gif — maximum 20 MB." },
          { "name": "Audio", "type": "string", "required": false, "description": "audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — maximum 50 MB." },
          { "name": "Video", "type": "string", "required": false, "description": "video/mp4, video/quicktime, video/webm — maximum 500 MB." }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl -X POST https://api.sandbase.ai/v1/upload \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -F \"file=@reference.mp4\" \\\n  -F \"type=video\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"url\": \"https://media.sandbase.ai/uploads/2026/08/550e8400-e29b-41d4-a716-446655440000.mp4\",\n  \"filename\": \"reference.mp4\",\n  \"size\": 1048576,\n  \"type\": \"video/mp4\",\n  \"content_type\": \"video/mp4\"\n}"
    },
    "notes": [
      { "title": "MIME detection", "description": "The server detects the file type from its bytes and filename. The optional type field does not force a MIME type." }
    ]
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
          { "name": "url", "type": "string", "required": true, "description": "Non-empty source URL forwarded to the Asset provider. The provider must be able to fetch it." },
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
      "code": "{\n  \"id\": \"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\n  \"external_id\": \"asset-20260710150403-hx4hf\",\n  \"asset_url\": \"asset://asset-20260710150403-hx4hf\",\n  \"status\": \"Active\",\n  \"asset_type\": \"Video\",\n  \"download_url\": \"https://cdn.example.com/signed-url\",\n  \"created_at\": \"2026-07-10T15:04:03Z\"\n}"
    },
    "notes": [
      { "title": "Provider-managed URL", "description": "The asset:// value is the reusable Asset reference. download_url is provider-managed and can be empty; query this endpoint again for its current value." }
    ]
  },
  "models/embedding": {
    "title": "Embeddings",
    "operation": "Models",
    "method": "POST",
    "path": "/v1/embeddings",
    "description": "OpenAI-compatible vector embeddings API. Input forms, dimensions, encoding, and additional fields remain subject to the selected model and provider.",
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
            "type": "string | string[] | integer[] | integer[][]",
            "required": true,
            "description": "Text, token IDs, or a batch of texts or token-ID arrays to embed"
          },
          {
            "name": "dimensions",
            "type": "integer",
            "required": false,
            "description": "Output vector dimension when supported by the selected model; there is no universal dimension list"
          },
          {
            "name": "encoding_format",
            "type": "string",
            "required": false,
            "description": "Embedding encoding format. Provider support determines whether float or base64 is available"
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "HTTP",
        "language": "http",
        "code": "POST https://api.sandbase.ai/v1/embeddings\nAuthorization: Bearer sk-your-api-key\nContent-Type: application/json\n\n{\"model\":\"alibaba/text-embedding-v4\",\"input\":\"SandBase provides a unified API for AI models, agents, and developer tools.\",\"dimensions\":1024,\"encoding_format\":\"float\"}"
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
    "description": "Get model details by UUID or full logical name. Name lookup returns enabled catalog models; UUID lookup can return a disabled record with enabled set to false. Protocol-ingress-only models are never returned.",
    "groups": [
      {
        "title": "Path parameters",
        "fields": [
          {
            "name": "id_or_name",
            "type": "string",
            "required": true,
            "description": "Model UUID or full logical model name, for example openai/gpt-4o. Names may contain slashes."
          }
        ]
      }
    ],
    "examples": [
      {
        "label": "cURL",
        "language": "bash",
        "code": "curl \"https://api.sandbase.ai/v1/models/openai/gpt-4o\" \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\""
      }
    ],
    "response": {
      "status": "200 OK",
      "code": "{\n  \"id\": \"550e8400-e29b-41d4-a716-446655440000\",\n  \"name\": \"openai/gpt-4o\",\n  \"display_name\": \"GPT-4o\",\n  \"vendor\": \"OpenAI\",\n  \"description\": \"Most capable GPT-4 model with vision...\",\n  \"type\": \"llm\",\n  \"capability_tags\": [\"chat\", \"streaming\", \"vision\", \"tools\", \"json_mode\", \"cache\"],\n  \"skills\": [\"chat\", \"streaming\", \"vision\", \"tools\", \"json_mode\", \"cache\"],\n  \"unified_schema\": {\n    \"type\": \"object\",\n    \"properties\": {\n      \"prompt\": {\n        \"type\": \"string\"\n      }\n    }\n  },\n  \"execution_mode\": \"chat\",\n  \"supported_modes\": [\"chat\"],\n  \"run_count\": 12500,\n  \"sort_order\": 10,\n  \"published_at\": \"2026-07-07T00:00:00Z\",\n  \"vendor_slug\": \"openai\",\n  \"model_slug\": \"gpt-4o\",\n  \"enabled\": true,\n  \"featured\": true,\n  \"created_at\": \"2026-07-07T00:00:00Z\",\n  \"model_card\": {\n    \"base_price\": \"0.000000\",\n    \"prompt_token_price\": \"0.0000025\",\n    \"completion_token_price\": \"0.000010\",\n    \"cache_read_multiplier\": \"0.5\",\n    \"cache_write_multiplier\": \"1.0\",\n    \"cache_write_1h_multiplier\": null,\n    \"reasoning_price\": null,\n    \"price_formula\": \"$input_tokens * 0.0000025 + $output_tokens * 0.000010\",\n    \"markup_ratio\": \"1.0000\",\n    \"readme\": \"Model usage notes...\",\n    \"cover_url\": \"https://...\"\n  },\n  \"examples\": []\n}"
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
      "code": "{\n  \"id\": \"sess_01...\",\n  \"type\": \"session\",\n  \"agent_id\": \"agent_01...\",\n  \"agent_version\": 1,\n  \"agent_version_id\": \"av_01...\",\n  \"agent\": { \"id\": \"agent_01...\", \"type\": \"agent\", \"version\": 1 },\n  \"environment_id\": \"env_01...\",\n  \"source\": \"direct\",\n  \"title\": \"Customer research\",\n  \"status\": \"idle\",\n  \"metadata\": {},\n  \"archived_at\": null,\n  \"created_at\": \"2026-08-03T10:00:00Z\",\n  \"updated_at\": \"2026-08-03T10:00:00Z\"\n}"
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
      "code": "{\n  \"id\": \"sess_01abc...\",\n  \"type\": \"session\",\n  \"status\": \"idle\",\n  \"title\": \"Research task\",\n  \"agent_id\": \"agent_01HqR2k7...\",\n  \"agent_version\": 1,\n  \"agent_version_id\": \"av_01...\",\n  \"agent\": { \"id\": \"agent_01HqR2k7...\", \"type\": \"agent\", \"version\": 1 },\n  \"environment_id\": \"env_01abc...\",\n  \"source\": \"direct\",\n  \"metadata\": { \"user_id\": \"usr_123\", \"task\": \"research\" },\n  \"archived_at\": null,\n  \"created_at\": \"2026-05-29T10:00:00Z\",\n  \"updated_at\": \"2026-05-29T10:05:00Z\"\n}"
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
  "images/generations": {
    "title": "Generate Image",
    "operation": "Images",
    "method": "POST",
    "path": "/v1/images/generations",
    "description": "Generate images through SandBase's synchronous OpenAI Images-compatible endpoint. This endpoint is distinct from the general /v1/run model API.",
    "signature": "client.images.generate(params)",
    "groups": [
      {
        "title": "Request body",
        "schema": "ImageGenerateParams",
        "fields": [
          { "name": "model", "type": "string", "required": true, "description": "Use gpt-image-2 on this endpoint." },
          { "name": "prompt", "type": "string", "required": true, "description": "Text description of the image to generate." },
          { "name": "n", "type": "integer", "required": false, "description": "Number of images to generate when supported." },
          { "name": "size", "type": "string", "required": false, "description": "Output dimensions supported by the model." },
          { "name": "quality", "type": "string", "required": false, "description": "Output quality such as low, medium, high, or auto." },
          { "name": "background", "type": "string", "required": false, "description": "Background setting such as transparent, opaque, or auto." },
          { "name": "output_format", "type": "string", "required": false, "description": "Output encoding such as png, webp, or jpeg." },
          { "name": "output_compression", "type": "integer", "required": false, "description": "Output compression level from 0 to 100." },
          { "name": "moderation", "type": "string", "required": false, "description": "Provider-compatible moderation setting." },
          { "name": "user", "type": "string", "required": false, "description": "Provider-compatible end-user identifier." }
        ]
      }
    ],
    "examples": [
      { "label": "cURL", "language": "bash", "code": "curl https://api.sandbase.ai/v1/images/generations \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"gpt-image-2\",\"prompt\":\"A paper-cut city floating above the clouds\",\"size\":\"1024x1024\"}'" },
      { "label": "Python", "language": "python", "code": "from openai import OpenAI\n\nclient = OpenAI(api_key=\"sk-...\", base_url=\"https://api.sandbase.ai/v1\")\nresult = client.images.generate(\n    model=\"gpt-image-2\",\n    prompt=\"A paper-cut city floating above the clouds\",\n    size=\"1024x1024\",\n)\nprint(result.data[0].b64_json or result.data[0].url)" }
    ],
    "response": { "status": "200 OK", "code": "{\n  \"created\": 1787529600,\n  \"data\": [{\"b64_json\": \"iVBORw0KGgo...\"}],\n  \"usage\": {\n    \"input_tokens\": 12,\n    \"output_tokens\": 4096,\n    \"total_tokens\": 4108,\n    \"input_tokens_details\": {\"text_tokens\": 12, \"image_tokens\": 0}\n  }\n}" },
    "notes": [
      { "title": "Synchronous only", "description": "stream=true, mode=stream, and mode=async are rejected. Use the returned data array directly." },
      { "title": "Compatible fields", "description": "Additional JSON fields are forwarded unchanged, but support remains model- and provider-specific." }
    ],
    "errors": [
      { "status": "400", "description": "Invalid JSON, unsupported model, streaming mode, or provider request." },
      { "status": "401", "description": "Missing or invalid API key." },
      { "status": "402", "description": "Organization or API Key spending limit reached." },
      { "status": "403", "description": "API key scope does not authorize this endpoint." },
      { "status": "404", "description": "The routed image model is unavailable." },
      { "status": "429", "description": "Rate limit exceeded." },
      { "status": "500", "description": "Request persistence or response processing failed." },
      { "status": "502", "description": "The provider returned an invalid native response." },
      { "status": "503", "description": "No provider route succeeded." }
    ]
  },
  "images/edits": {
    "title": "Edit Image",
    "operation": "Images",
    "method": "POST",
    "path": "/v1/images/edits",
    "description": "Edit one or more uploaded images through SandBase's synchronous OpenAI Images-compatible multipart endpoint.",
    "signature": "client.images.edit(params)",
    "groups": [],
    "examples": [
      { "label": "cURL", "language": "bash", "code": "curl https://api.sandbase.ai/v1/images/edits \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -F model=gpt-image-2 \\\n  -F 'prompt=Turn the daytime sky into a starry night' \\\n  -F image=@landscape.png" },
      { "label": "Python", "language": "python", "code": "from openai import OpenAI\n\nclient = OpenAI(api_key=\"sk-...\", base_url=\"https://api.sandbase.ai/v1\")\nwith open(\"landscape.png\", \"rb\") as image:\n    result = client.images.edit(\n        model=\"gpt-image-2\",\n        image=image,\n        prompt=\"Turn the daytime sky into a starry night\",\n    )\nprint(result.data[0].b64_json or result.data[0].url)" }
    ],
    "response": { "status": "200 OK", "code": "{\n  \"created\": 1787529600,\n  \"data\": [{\"b64_json\": \"iVBORw0KGgo...\"}],\n  \"usage\": {\n    \"input_tokens\": 1024,\n    \"output_tokens\": 4096,\n    \"total_tokens\": 5120,\n    \"input_tokens_details\": {\"text_tokens\": 12, \"image_tokens\": 1012}\n  }\n}" },
    "notes": [
      { "title": "Multipart uploads", "description": "Send model, prompt, and image as multipart/form-data. Repeating the image field preserves multiple source files." },
      { "title": "Synchronous only", "description": "stream=true, mode=stream, and mode=async are rejected." }
    ],
    "errors": [
      { "status": "400", "description": "Invalid multipart body, unsupported model, streaming mode, or provider request." },
      { "status": "401", "description": "Missing or invalid API key." },
      { "status": "402", "description": "Organization or API Key spending limit reached." },
      { "status": "403", "description": "API key scope does not authorize this endpoint." },
      { "status": "404", "description": "The routed image-edit model is unavailable." },
      { "status": "429", "description": "Rate limit exceeded." },
      { "status": "500", "description": "Request persistence or response processing failed." },
      { "status": "502", "description": "The provider returned an invalid native response." },
      { "status": "503", "description": "No provider route succeeded." }
    ]
  },
  "inference/responses": {
    "title": "Create Response",
    "operation": "Inference",
    "method": "POST",
    "path": "/v1/responses",
    "description": "Create an OpenAI-compatible model response. SandBase preserves request fields after model mapping, then sanitizes responses to public OpenAI fields.",
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
          { "name": "background", "type": "boolean", "required": false, "description": "Request background execution when supported by the selected provider." },
          { "name": "include", "type": "string[]", "required": false, "description": "Additional public response data to include when supported." },
          { "name": "max_output_tokens", "type": "integer", "required": false, "description": "Maximum generated tokens." },
          { "name": "max_tool_calls", "type": "integer", "required": false, "description": "Maximum built-in tool calls when supported." },
          { "name": "metadata", "type": "object", "required": false, "description": "Request metadata forwarded to the provider." },
          { "name": "parallel_tool_calls", "type": "boolean", "required": false, "description": "Allow supported models to invoke tools in parallel." },
          { "name": "previous_response_id", "type": "string", "required": false, "description": "Previous response to continue when supported by the selected route." },
          { "name": "reasoning", "type": "object", "required": false, "description": "Reasoning configuration for supported models." },
          { "name": "store", "type": "boolean", "required": false, "description": "Request provider-side response storage when supported." },
          { "name": "text", "type": "object", "required": false, "description": "Text output and structured-format configuration." },
          { "name": "tool_choice", "type": "string | object", "required": false, "description": "Controls tool selection." },
          { "name": "tools", "type": "object[]", "required": false, "description": "Tools available to the model." },
          { "name": "truncation", "type": "string", "required": false, "description": "Input truncation behavior." }
        ]
      }
    ],
    "examples": [
      { "label": "cURL", "language": "bash", "code": "curl https://api.sandbase.ai/v1/responses \\\n  -H \"Authorization: Bearer $SANDBASE_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\":\"openai/gpt-5.2\",\"input\":\"Explain immutable infrastructure in one sentence.\"}'" },
      { "label": "Python", "language": "python", "code": "from openai import OpenAI\n\nclient = OpenAI(api_key=\"sk-sb-...\", base_url=\"https://api.sandbase.ai/v1\")\nresponse = client.responses.create(\n    model=\"openai/gpt-5.2\",\n    input=\"Explain immutable infrastructure in one sentence.\",\n)\nprint(response.output_text)" },
      { "label": "TypeScript", "language": "typescript", "code": "import OpenAI from \"openai\";\n\nconst client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: \"https://api.sandbase.ai/v1\" });\nconst response = await client.responses.create({\n  model: \"openai/gpt-5.2\",\n  input: \"Explain immutable infrastructure in one sentence.\",\n});\nconsole.log(response.output_text);" }
    ],
    "response": { "status": "200 OK", "code": "{\n  \"id\": \"resp_01...\",\n  \"object\": \"response\",\n  \"status\": \"completed\",\n  \"model\": \"openai/gpt-5.2\",\n  \"output\": [],\n  \"usage\": {\n    \"input_tokens\": 18,\n    \"output_tokens\": 12,\n    \"total_tokens\": 30,\n    \"input_tokens_details\": {\"cached_tokens\": 0},\n    \"output_tokens_details\": {\"reasoning_tokens\": 0}\n  }\n}" },
    "notes": [
      { "title": "Request compatibility", "description": "SandBase rewrites model to the selected upstream model and preserves other request fields. Provider support still varies." },
      { "title": "Sanitized responses", "description": "Only public OpenAI response fields and token usage are returned. Provider billing, account, routing, and unknown top-level extensions are removed; output item content is preserved." },
      { "title": "Streaming", "description": "Public response.* and error SSE events are sanitized and forwarded. Unknown private events are dropped; malformed data closes the stream rather than forwarding unsafe content." }
    ],
    "errors": [
      { "status": "400", "description": "Invalid JSON, missing model, or an invalid provider request." },
      { "status": "401", "description": "Missing or invalid API key." },
      { "status": "402", "description": "Organization or API Key spending limit reached." },
      { "status": "403", "description": "API key scope or upstream permission rejection." },
      { "status": "413", "description": "The upstream provider rejected the request as too large." },
      { "status": "500", "description": "Prediction lifecycle or organization lookup failed." },
      { "status": "502", "description": "The upstream response could not be safely parsed and sanitized." },
      { "status": "503", "description": "Routing failed or every provider candidate was exhausted." }
    ]
  },
  "inference/chat-completions": {
    "title": "Create Chat Completion",
    "operation": "Inference",
    "method": "POST",
    "path": "/v1/chat/completions",
    "description": "Create an OpenAI-compatible chat completion with any supported SandBase chat model. Provider-compatible fields are preserved when supported by the selected route.",
    "signature": "client.chat.completions.create(params)",
    "groups": [
      {
        "title": "Request body",
        "schema": "ChatCompletionCreateParams",
        "fields": [
          { "name": "model", "type": "string", "required": true, "description": "Model identifier from the Models API." },
          { "name": "messages", "type": "object[]", "required": true, "description": "Conversation messages using roles supported by the selected provider, commonly system, developer, user, assistant, or tool." },
          { "name": "temperature", "type": "number", "required": false, "default": "1", "description": "Sampling temperature from 0 to 2." },
          { "name": "top_p", "type": "number", "required": false, "default": "1", "description": "Nucleus sampling threshold." },
          { "name": "max_tokens", "type": "integer", "required": false, "description": "Maximum number of output tokens." },
          { "name": "stream", "type": "boolean", "required": false, "default": "false", "description": "Return incremental Server-Sent Events." },
          { "name": "stop", "type": "string | string[]", "required": false, "description": "Sequence or sequences that stop generation." },
          { "name": "tools", "type": "object[]", "required": false, "description": "Function definitions available to the model." },
          { "name": "tool_choice", "type": "string | object", "required": false, "default": "auto", "description": "Controls whether and which tool is selected." },
          { "name": "parallel_tool_calls", "type": "boolean", "required": false, "description": "Allow supported models to emit multiple tool calls in one turn." },
          { "name": "user", "type": "string", "required": false, "description": "Provider-compatible end-user identifier." },
          { "name": "response_format", "type": "object", "required": false, "description": "JSON object or JSON Schema output configuration." },
          { "name": "reasoning_effort", "type": "string", "required": false, "description": "Provider-compatible reasoning effort setting." },
          { "name": "reasoning", "type": "object", "required": false, "description": "Reasoning configuration such as effort or max_tokens." },
          { "name": "thinking", "type": "object", "required": false, "description": "Thinking configuration such as type or budget_tokens." },
          { "name": "extra_body", "type": "object", "required": false, "description": "Provider-specific parameters for routes that require protocol translation." },
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
      { "title": "Streaming and tools", "description": "Set stream to true for SSE; the stream ends with data: [DONE]. Add stream_options.include_usage for the final usage chunk. Tool calls and multimodal content follow the OpenAI-compatible schema." },
      { "title": "Provider compatibility", "description": "SandBase preserves additional compatible fields on same-protocol routes. Cross-protocol and provider-specific field support varies; use extra_body where applicable." }
    ],
    "errors": [
      { "status": "400", "description": "Invalid request body or unsupported parameter." },
      { "status": "401", "description": "Missing or invalid API key." },
      { "status": "402", "description": "Organization spending limit reached." },
      { "status": "404", "description": "Model not found or unavailable." },
      { "status": "429", "description": "Rate limit exceeded." },
      { "status": "500", "description": "Request persistence or organization lookup failed." },
      { "status": "502", "description": "The selected provider returned an invalid response." },
      { "status": "503", "description": "No provider route succeeded." }
    ]
  },
  "inference/anthropic-messages": {
    "title": "Create Anthropic Message",
    "operation": "Inference",
    "method": "POST",
    "path": "/v1/messages",
    "description": "Create a message through SandBase's Anthropic-compatible Messages endpoint. SandBase maps the model for the selected provider and preserves compatible request and response fields.",
    "signature": "client.messages.create(params)",
    "groups": [
      {
        "title": "Request headers",
        "fields": [
          { "name": "x-api-key", "type": "string", "required": false, "description": "SandBase API key. Authorization: Bearer is also accepted; x-api-key takes precedence when both are present." },
          { "name": "anthropic-version", "type": "string", "required": false, "default": "2023-06-01", "description": "Anthropic API version forwarded upstream. SandBase supplies 2023-06-01 when omitted." },
          { "name": "anthropic-beta", "type": "string", "required": false, "description": "Comma-separated beta feature identifiers, subject to provider compatibility." }
        ]
      },
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
      { "title": "Transparent protocol", "description": "Except for model mapping and configured provider compatibility rules, SandBase forwards compatible request fields, non-stream responses, and SSE events without protocol translation." },
      { "title": "Beta features", "description": "anthropic-beta is forwarded when present. A candidate's compatibility rules may remove unsupported beta fields or skip that candidate." }
    ],
    "errors": [
      { "status": "400", "description": "Invalid request body or unsupported feature." },
      { "status": "401", "description": "Missing or invalid API key." },
      { "status": "402", "description": "Organization spending limit reached." },
      { "status": "403", "description": "API Key spending limit or organization permission failure." },
      { "status": "404", "description": "Model not found or unavailable." },
      { "status": "413", "description": "The provider rejected the request as too large." },
      { "status": "429", "description": "Provider rate limit exceeded." },
      { "status": "500", "description": "Prediction lifecycle or provider error." },
      { "status": "502", "description": "Upstream stream ended before usable content." },
      { "status": "503", "description": "Routing failed or all provider candidates were unavailable." }
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
