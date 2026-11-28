---
i18nSource: 4fe775aff023e881
title: Pobierz model
description: Pobierz szczegóły modelu według UUID lub pełnej nazwy logicznej. Wyszukiwanie po nazwie zwraca włączone modele z katalogu; wyszukiwanie po UUID może zwrócić wyłączony rekord z enabled ustawionym na false.
aside: false
outline: false
apiReference:
  title: Pobierz model
  operation: Models
  method: GET
  path: /v1/models/{id_or_name}
  description: Pobierz szczegóły modelu według UUID lub pełnej nazwy logicznej. Wyszukiwanie po nazwie zwraca włączone modele z katalogu; wyszukiwanie po UUID może zwrócić wyłączony rekord z enabled ustawionym na false. Modele dostępne wyłącznie przez wejście protokołowe nigdy nie są zwracane.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: id_or_name
          type: string
          required: true
          description: UUID modelu lub pełna logiczna nazwa modelu, na przykład openai/gpt-4o. Nazwy mogą zawierać ukośniki.
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
