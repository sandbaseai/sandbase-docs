---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: 通过原生 Google 协议创建、流式获取和轮询模型 Interactions。
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: 创建原生 Google Interaction。即使返回 HTTP 200 也要检查 status；in_progress 响应必须轮询。
  groups:
    - title: 请求体
      fields:
        - name: model
          type: string
          required: true
          description: SandBase 逻辑模型名称。
        - name: input
          type: string | object | array
          required: true
          description: 原生 Google Interaction 输入。
        - name: stream
          type: boolean
          required: false
          description: 模型支持时返回 Google Interactions SSE 事件。
        - name: background
          type: boolean
          required: false
          description: 持久化提交并返回可立即轮询的 Interaction。不能与 stream 同时使用。
        - name: previous_interaction_id
          type: string
          required: false
          description: 在保持提供商亲和的前提下，从某个上游 Interaction 继续。
        - name: store
          type: boolean
          required: false
          description: 原样转发上游存储偏好。
        - name: system_instruction
          type: string
          required: false
          description: 原生系统指令。
        - name: tools
          type: array
          required: false
          description: 原生 Google 工具定义。
        - name: generation_config
          type: object
          required: false
          description: 原生生成配置。
        - name: response_format
          type: object | array
          required: false
          description: 请求的响应格式。
        - name: response_modalities
          type: array
          required: false
          description: 请求的输出模态。
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## 认证 {#authentication}

使用 `x-goog-api-key`、`Authorization: Bearer …` 或 `key` 查询参数，优先级依次递减。建议使用请求头，因为查询字符串中的凭据可能会被记录到日志中。

## 支持的模型 {#supported-models}

Interactions 端点并不是所有目录名称以 `google/` 开头的模型都能使用的通用路由。模型必须具有兼容 Interactions 的提供商映射。SandBase 目前文档化的兼容模型如下：

- Gemini Omni Flash Preview：`google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview：`google/gemini-omni-1.1-flash-preview`

其他 Google 模型使用其他端点。例如，Nano Banana Pro 和 Nano Banana 2 使用 [`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content)，而不是 `/v1beta/interactions`。不受支持的模型会直接失败，而不会通过其他 Google 协议路由。

## 成功与轮询 {#success-and-polling}

提交成功时返回 HTTP `200`，包括后台任务以及在限定等待时间内未完成的同步请求。请始终检查 `status`：

- `completed`、`failed`、`cancelled` 和 `incomplete` 为终态。
- `in_progress` 表示仍在运行。请轮询 `GET /v1beta/interactions/{id}`；响应的 `Location` 请求头中也可能包含该路径。
- `requires_action` 是协议定义的状态，但 SandBase 目前尚未提供推进该状态所需的工具确认端点。

轮询 ID 是 `POST` 返回的上游 Interaction `id`，而不是 SandBase 的 prediction ID。必须使用创建该 Interaction 的同一个 SandBase API 密钥来获取它。

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

非终态的 GET 响应不包含部分输出和用量。终态响应可能包含内联的图像、音频或视频数据，大小可达数 MB。请及时下载并保存所需媒体：上游保留期过后，SandBase 只能返回包含结构和元数据的有损终态回退结果，而不包含原始媒体字节。

## 流式输出 {#streaming}

在请求体中设置 `stream: true`。响应为 `text/event-stream`；该协议不使用 `?alt=sse`。事件和 delta 类型是开放的，转发时不使用固定的允许列表，因此客户端应能容忍未知值。流式响应头一旦写出，失败会以 `error` 事件的形式返回，而不是使用其他 HTTP 状态码。

是否支持流式输出取决于模型。即使协议支持 `stream: true`，上游提供商也可能拒绝。

## 当前限制 {#current-limits}

SandBase 目前仅提供创建和获取操作：

- 不接受 Agent Interactions；请使用 `model`。
- `background: true` 和 `stream: true` 不能同时使用。
- 未提供 Interaction 的列出、删除和取消操作。
- 未提供 URI 交付和基于 GET 的流重连。
- `previous_interaction_id` 需要有效的提供商亲和映射以及上游支持。亲和映射不可用时，SandBase 会直接失败，而不会悄然切换提供商。

错误使用 Google 信封格式 `{ "error": { "code", "message", "status" } }`。HTTP 状态码是稳定的；`message` 中经过清理的上游文本可能会变化。
