---
i18nSource: 8c960d117a998817
title: 图像与视频模型
description: 使用 SandBase 共享的 Run API 异步生成图像和视频。
---

# 图像与视频模型 {#image-and-video-models}

图像和视频模型使用 SandBase 共享的异步 Run API。使用 `POST /v1/run`
提交任务，然后轮询 `GET /v1/run/{id}`，直到运行达到
终态。

## 提交任务 {#submit-a-task}

请使用[图像与视频模型](https://www.sandbase.ai/models/image-video)中的确切模型 ID。其余
请求字段因模型而异；请打开该模型的 API 参考，了解其
必需输入和限制。

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

响应包含一个不透明的 `id`，以及 `pending` 或
`running` 等 `status`。

## 轮询结果 {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

持续轮询，直到 `status` 为 `completed`、`failed` 或 `timeout`。已完成的
运行包含与能力相关的输出，例如图像或视频 URL。请保留
run ID，并以运行响应作为权威状态。

## Webhook 回调 {#webhook-callbacks}

受支持的异步任务也可以在提交请求中设置 `webhook_url`。
回调只是投递提示，不能替代轮询；请继续
使用 `GET /v1/run/{id}`，并安全地处理重复或延迟的回调。通用回调约定请参阅
[运行能力](/api-reference/models/run#webhook-callbacks)
中的说明。

## API 能力使用由 URL 推导的路径 {#api-capabilities-use-a-url-derived-path}

共享的 Run API 用于模型生成。
[API 目录](https://www.sandbase.ai/apis)中的 API 能力使用
另一种由 URL 推导的路由：`GET` 或 `POST /v1/api/{vendor}/{upstream_path}`。
带厂商前缀的能力名称来自 Models API 或 API 目录，因此 POST 请求体中
可以省略 `model` 字段：

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

此路由用于 API 能力，调用图像或视频模型时
不能用它替代 `/v1/run`。如果所选 API 能力是异步的，
请使用 `GET /v1/run/{id}` 轮询返回的 run ID。

## 后续步骤 {#next-steps}

- [图像与视频模型](https://www.sandbase.ai/models/image-video)
- [运行能力](/api-reference/models/run)
- [获取运行结果](/api-reference/models/run-get)
- [API 透传](/api-reference/models/api-passthrough)
