---
i18nSource: 06feb27e20f1b7f5
title: 列出账户历史
description: 列出 API 密钥所属组织的近期执行记录。
aside: false
outline: false
apiReference:
  title: 列出账户历史
  operation: Account
  method: GET
  path: /v1/account/history
  description: 列出组织范围内的近期执行记录，按时间倒序排列。错误信息会经过脱敏处理；无法解码的已存储 JSON 快照将被省略。
  groups:
    - title: 查询参数
      fields:
        - name: model
          type: string
          required: false
          description: 精确的逻辑模型名称。
        - name: api_key_id
          type: string
          required: false
          description: 精确的 API 密钥资源 ID。
        - name: type
          type: multimodal | llm | api
          required: false
          description: 执行类别；multimodal 包括图像、视频和音频。
        - name: status
          type: completed | failure | in_progress
          required: false
          description: 分组后的执行状态。
        - name: error_type
          type: string
          required: false
          description: 精确的错误类型；没有错误类型的记录使用 unknown。
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: 按创建时间滚动计算的范围，默认为 7d。
        - name: page
          type: integer
          required: false
          description: 页码，从 1 开始。
        - name: page_size
          type: integer
          required: false
          description: 每页条数，取值 1 到 100，默认为 20。
        - name: request_id
          type: string
          required: false
          description: 组织范围内的精确执行 ID。设置后将忽略其他筛选条件，并只请求一条结果。
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: 显式时间窗口所依据的时间戳类型。
        - name: billing_scope
          type: any | positive | token
          required: false
          description: 结算筛选；positive 和 token 要求 time_basis=settled_at。
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: 时间窗口起点（包含），需与 end_at 搭配使用。
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: 时间窗口终点（不包含）；窗口不能超过 32 天。
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: 仅保留延迟为正值的样本。
        - name: min_latency_ms
          type: integer
          required: false
          description: 最小延迟（毫秒）。
        - name: timezone
          type: IANA time-zone name
          required: false
          description: 仅用于兼容性校验。时间戳始终为 UTC；按 request_id 精确查询时会忽略此参数。
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
