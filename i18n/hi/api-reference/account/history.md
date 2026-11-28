---
i18nSource: 06feb27e20f1b7f5
title: Account history list करें
description: API key के organization के हाल के execution records list करें।
aside: false
outline: false
apiReference:
  title: Account history list करें
  operation: Account
  method: GET
  path: /v1/account/history
  description: Organization-scoped हाल के execution records list करें, सबसे नए पहले। Error messages sanitize किए जाते हैं, और संग्रहीत JSON snapshots decode न हो पाने पर छोड़ दिए जाते हैं।
  groups:
    - title: Query parameters
      fields:
        - name: model
          type: string
          required: false
          description: सटीक logical model नाम।
        - name: api_key_id
          type: string
          required: false
          description: सटीक API Key resource ID।
        - name: type
          type: multimodal | llm | api
          required: false
          description: Execution श्रेणी; multimodal में image, video और audio शामिल हैं।
        - name: status
          type: completed | failure | in_progress
          required: false
          description: समूहित execution status।
        - name: error_type
          type: string
          required: false
          description: सटीक error type, या बिना error type वाले records के लिए unknown।
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: created-at की rolling range; default 7d।
        - name: page
          type: integer
          required: false
          description: Page संख्या, 1 से शुरू।
        - name: page_size
          type: integer
          required: false
          description: प्रति page items, 1 से 100 तक; default 20।
        - name: request_id
          type: string
          required: false
          description: सटीक organization-scoped execution ID। सेट होने पर अन्य filters अनदेखे होते हैं और एक result माँगा जाता है।
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: स्पष्ट window के लिए timestamp आधार।
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Settlement filter; positive और token के लिए time_basis=settled_at आवश्यक है।
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Window की शुरुआत (शामिल), end_at के साथ।
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Window का अंत (शामिल नहीं); window 32 दिनों से अधिक नहीं हो सकती।
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Latency samples को केवल positive values तक सीमित करें।
        - name: min_latency_ms
          type: integer
          required: false
          description: Milliseconds में न्यूनतम latency।
        - name: timezone
          type: IANA time-zone name
          required: false
          description: केवल compatibility validation। Timestamps UTC में ही रहते हैं; सटीक request_id lookup इस parameter को अनदेखा करता है।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
