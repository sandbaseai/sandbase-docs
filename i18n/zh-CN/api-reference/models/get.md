---
i18nSource: 4fe775aff023e881
title: 获取模型
description: 按 UUID 或完整逻辑名称获取模型详情。按名称查询返回已启用的目录模型；按 UUID 查询可能返回 enabled 为 false 的已禁用记录。
aside: false
outline: false
apiReference:
  title: 获取模型
  operation: Models
  method: GET
  path: /v1/models/{id_or_name}
  description: 按 UUID 或完整逻辑名称获取模型详情。按名称查询返回已启用的目录模型；按 UUID 查询可能返回 enabled 为 false 的已禁用记录。仅限协议入口的模型永远不会返回。
  groups:
    - title: 路径参数
      fields:
        - name: id_or_name
          type: string
          required: true
          description: 模型 UUID 或完整逻辑模型名称，例如 openai/gpt-4o。名称中可以包含斜杠。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/models/openai/gpt-4o" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "openai/gpt-4o",
        "display_name": "GPT-4o",
        "vendor": "OpenAI",
        "description": "Most capable GPT-4 model with vision...",
        "type": "llm",
        "capability_tags": ["chat", "streaming", "vision", "tools", "json_mode", "cache"],
        "skills": ["chat", "streaming", "vision", "tools", "json_mode", "cache"],
        "unified_schema": {
          "type": "object",
          "properties": {
            "prompt": {
              "type": "string"
            }
          }
        },
        "execution_mode": "chat",
        "supported_modes": ["chat"],
        "run_count": 12500,
        "sort_order": 10,
        "published_at": "2026-07-07T00:00:00Z",
        "vendor_slug": "openai",
        "model_slug": "gpt-4o",
        "enabled": true,
        "featured": true,
        "created_at": "2026-07-07T00:00:00Z",
        "model_card": {
          "base_price": "0.000000",
          "prompt_token_price": "0.0000025",
          "completion_token_price": "0.000010",
          "cache_read_multiplier": "0.5",
          "cache_write_multiplier": "1.0",
          "cache_write_1h_multiplier": null,
          "reasoning_price": null,
          "price_formula": "$input_tokens * 0.0000025 + $output_tokens * 0.000010",
          "markup_ratio": "1.0000",
          "readme": "Model usage notes...",
          "cover_url": "https://..."
        },
        "examples": []
      }
---

<ApiReferencePage />
