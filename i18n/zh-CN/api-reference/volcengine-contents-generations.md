---
i18nSource: 4bd032d88bac0470
title: Seedance 视频（火山引擎方舟协议）
description: 通过火山引擎方舟 Contents Generations 任务协议生成 Seedance 2.0 和 2.5 视频，涵盖输入、轮询、计费和媒体 Asset。
aside: false
outline: false
apiReference:
  title: Seedance 视频
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: 提交 Seedance 视频任务。提交成功时返回 HTTP 200 及 SandBase 任务 id。
  groups:
    - title: 请求体
      fields:
        - name: model
          type: string
          required: true
          description: 支持的模型标识符：bytedance/seedance/2.0-official 或 bytedance/seedance/2.5-official。
        - name: content
          type: array
          required: true
          description: 带类型的文本及可选的媒体输入。各项的结构由模型校验。
        - name: duration
          type: integer
          required: false
          description: 原样转发给模型，由模型进行校验。
        - name: resolution
          type: string
          required: false
          description: 原样转发给模型，由模型进行校验。
        - name: ratio
          type: string
          required: false
          description: 原样转发给模型，由模型进行校验。
        - name: generate_audio
          type: boolean
          required: false
          description: 原样转发给模型。在支持时请求生成音频。
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Seedance 指南 {#seedance-guide}

Seedance 可以根据文本、首尾帧以及图像、视频、音频等多模态参考生成视频。无论是简单的文生视频片段，
还是需要遵循特定视觉主体、运镜和配乐的导演级镜头，
都可以使用它。

生成过程是异步的。先提交任务，然后轮询，直到任务进入终止状态。

## 选择模型 {#choosing-a-model}

| `model` | 适用场景 | 输出分辨率 |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | 1080p 交付及最高可用输出分辨率 | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | 480p 或 720p 已足够时的低成本生成 | 480p, 720p |

两个模型接受相同的多模态输入，并在同一种请求结构中支持文生视频、图生视频和多模态参考
工作流。当 480p 或 720p 满足需求且你希望选择价格更低的方案时，选择 `2.0-official`。
需要 1080p 时，选择 `2.5-official`。

## API 参考 {#api-reference}

| 方法 | 路径 |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

不支持列出任务，也不支持取消或删除任务。请保存返回的任务 `id` 以获取结果。

每个请求都要使用创建任务时的同一个 API 密钥进行身份验证：

```
Authorization: Bearer $SANDBASE_API_KEY
```

`model` 的值必须是[选择模型](#choosing-a-model)中列出的名称之一。轮询是获取结果的受支持方式；
此端点请勿依赖 `callback_url`。

## 快速入门 {#quickstart}

提交任务：

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

使用该 id 每 5 到 10 秒轮询一次任务，直到 `status` 变为 `succeeded`、`failed`、`expired` 或 `cancelled`：

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

生成的视频可通过 `content.video_url` 获取。

## 选择输入工作流 {#choose-an-input-workflow}

该 API 支持七种常见的输入工作流。`content` 中的每一项都有一个 `type`；各项类型与
角色的组合决定了所用的工作流：

| 目标 | `content` 组合 | 适用情况 |
| --- | --- | --- |
| 文生视频 | 文本 | 场景完全可以用提示词描述 |
| 让首帧动起来 | 文本（可选）+ 带 `first_frame` 的图像 | 第一帧必须与提供的图像一致 |
| 两帧之间过渡 | 文本（可选）+ `first_frame` + `last_frame` | 镜头需要可控的开头和结尾 |
| 遵循视觉参考 | 文本（可选）+ 带 `reference_image` 的图像 | 主体、产品、服装或视觉风格需要保持可辨识 |
| 遵循动作或镜头语言 | 文本（可选）+ 带 `reference_video` 的视频 | 动作、节奏、剪辑韵律或运镜来自参考片段 |
| 添加音频参考 | 文本/图像/视频 + 带 `reference_audio` 的音频 | 对白、音乐、人声或音效设计应引导生成结果 |
| 完整多模态导演 | 文本 + 图像 + 视频 + 音频参考 | 在同一个镜头中由不同素材分别控制外观、动作和声音 |

音频不能单独使用。每个包含音频项的请求还必须至少包含一个文本、图像或视频
项。

### 内容项结构 {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` 指明模型应如何使用该素材：

| 素材 | `role` | 效果 |
| --- | --- | --- |
| 图像 | `first_frame` | 将该图像用作开场帧 |
| 图像 | `last_frame` | 将该图像用作结尾帧；同一请求中需包含 `first_frame` |
| 图像 | `reference_image` | 参考主体、构图、产品、服装或视觉风格 |
| 视频 | `reference_video` | 参考动作、运镜、节奏或剪辑韵律 |
| 音频 | `reference_audio` | 参考人声、对白、音乐或音效设计 |

图像项接受公开 URL 或内联的 `data:image/...;base64,...` 值。视频和音频参考应
使用模型可以下载的公开 URL。

只要包含任何 `video_url` 项，请求就会进入视频生视频模式，从而改变 token 费率。参见
[计费](#billing)。

## 常用示例 {#common-recipes}

以下示例展示的是请求体。可将其中任意一个发送到[快速入门](#quickstart)中所示的创建任务端点。

### 让首帧动起来 {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### 创建首帧到尾帧的过渡 {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### 使用图像、视频和音频参考导演镜头 {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

在提示词中为每个参考分配明确的任务，例如：“保留图像中的产品外观，使用
视频中的运镜，并遵循音频的节奏。”这比让每个素材都去控制整个结果
更可靠。

## 编写有效的提示词 {#writing-an-effective-prompt}

实用的提示词通常遵循以下顺序：

1. **主体**：镜头中出现的人或物。
2. **动作**：发生了什么变化或运动。
3. **场景**：地点、时间、天气和周边细节。
4. **视觉风格**：电影感、纪录片、产品广告、动画等。
5. **镜头**：构图、镜头质感、运镜和剪辑。
6. **声音**：启用 `generate_audio` 时的对白、环境音、音乐或音效。

明确说明哪些内容必须保持稳定。例如：“产品标签始终清晰可读，镜头缓慢推进一次，
不切换场景，保留自然的室内底噪。”当存在多个参考时，请说明从每个参考中提取哪种视觉或动作
特征。

## 输出选项 {#output-options}

| 参数 | 类型 | 默认值 | 取值 |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`、`720p`、`1080p`。`2.0-official` 不支持 `1080p` |
| `ratio` | string | `adaptive` | `16:9`、`9:16`、`4:3`、`3:4`、`1:1`、`21:9`、`adaptive`。`adaptive` 会根据输入和提示词选择比例 |
| `duration` | integer | `5` | 4 到 15 秒，或 `-1`，由模型在支持的范围内自行选择 |
| `generate_audio` | boolean | `true` | 生成同步的人声、音效和背景音乐 |
| `seed` | integer | `-1` | `-1` 到 `2^32-1`。相同的提示词和 seed 会生成相似但不完全相同的输出 |
| `watermark` | boolean | `false` | 在右下角添加 AI 生成水印 |
| `tools` | array | `[]` | `[{"type": "web_search"}]` 会在规划镜头时启用网页搜索 |

### 任务控制 {#task-control}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | 任务超时时间（秒），取值 3600 到 259200。超时的任务会变为 `expired` |
| `service_tier` | string | `default` | 这些模型不支持 `flex` |
| `safety_identifier` | string | — | 不透明的终端用户标识符，最多 64 个字符。请发送哈希值，而不是原始个人数据 |

### 画面尺寸 {#frame-size}

`resolution` 与 `ratio` 共同决定像素尺寸：

| 分辨率 | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## 任务状态 {#task-status}

| `status` | 含义 | 处理方式 |
| --- | --- | --- |
| `queued` | 已接受，等待开始 | 继续每 5 到 10 秒轮询一次 |
| `running` | 生成中 | 继续轮询 |
| `succeeded` | 已完成 | 下载 `content.video_url` |
| `failed` | 被内容审核拒绝，或模型出错 | 读取 `error.message`。重试前调整提示词 |
| `expired` | 运行时间超过 `execution_expires_after` | 重新提交 |
| `cancelled` | 在生成开始前结束 | 重新提交 |

### 任务字段 {#task-fields}

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 提交时返回的任务 id |
| `model` | string | 你发送的 `model` 值 |
| `status` | string | 见上文 |
| `created_at` | integer | Unix 秒 |
| `updated_at` | integer | Unix 秒。任务完成前与 `created_at` 相同 |
| `content` | object | 任务成功前为空。包含生成的 `video_url` |
| `usage` | object | token 计数。参见[计费](#billing) |
| `error` | object | 状态为 `failed` 和 `expired` 时出现。包含 `code` 和 `message` |

### 完整的 Python 流程 {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## 计费 {#billing}

这些模型按 `usage.completion_tokens` 计费，该值在任务完成时报告。token 费率取决于两个
维度：

- **输入是否包含视频。** 视频生视频请求（即包含任何 `video_url` 类型 `content` 项的请求）的费率
  低于文生视频。
- **输出分辨率。** 对于 `2.5-official`，1080p 的费率高于 480p 和 720p。`2.0-official` 的费率不随
  分辨率变化。

`usage` 报告 `completion_tokens` 和 `total_tokens`，二者目前相等。任务运行期间为空。
实际扣费请查看你的[账户历史](/api-reference/account/history)，当前费率请参见
[定价指南](/guides/billing)。

## 错误 {#errors}

无效请求会立即返回错误。生成过程中的错误会在轮询时出现在任务中。两者都使用
`error` 对象，其中包含机器可读的 `code` 和人类可读的 `message`：

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

常见的恢复步骤：

| 结果 | 尝试的操作 |
| --- | --- |
| `400 InvalidParameter` | 检查模型名称、必需内容、角色、分辨率、时长和素材 URL |
| 任务状态为 `failed` 且为内容审核错误 | 重写提示词或替换被标记的参考素材后再提交 |
| 任务状态为 `expired` | 提交新任务；对于高分辨率或较长的片段，可考虑设置更长的 `execution_expires_after` |
| `429 RateLimitExceeded` | 使用指数退避重试，并减少并发提交 |
| `503 ServiceUnavailable` | 短暂等待后重试同一请求 |

## 使用已注册的媒体 Asset {#use-registered-media-assets}

SandBase 在 `/v1/assets` 提供与官方兼容的 Asset 协议。Asset 请求和返回的 `asset://`
引用均遵循官方协议，且该引用会原样传入原生 ByteDance Contents
Generations 请求。
`bytedance/seedance/2.5-official` 和 `bytedance/seedance/2.0-official` 在通常接受公开 HTTP(S) URL 的位置
都接受该引用。

完整工作流如下：

1. 使用 `POST /v1/assets` 注册一个可访问的媒体 URL。
2. 查询 `GET /v1/assets/{external_id}`，直到提供商报告该 Asset 可用。
3. 将返回的 `asset_url` 放入 Seedance 的 `content` 项中，然后提交生成任务。

### 与官方兼容的 Asset 操作 {#official-compatible-asset-operations}

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `POST` | `/v1/assets` | 注册一个可访问的媒体 URL，并获取与官方兼容的 `asset://` 引用 |
| `GET` | `/v1/assets/{external_id}` | 读取提供商状态，并获取当前的预览/下载 URL |

公开 API 目前仅提供注册和查询。Asset 分组、列出、重命名、更新和删除
不是公开操作。Asset 归属于 API 密钥所关联的组织。

### 第 1 步：注册 Asset {#step-1-register-the-asset}

将可访问的 URL 发送到 `POST /v1/assets`。`asset_type` 区分大小写，必须为 `Image`、`Video` 或 `Audio`：

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

保存响应中的 `asset_url`：

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

`asset://` 之后的值即为与官方兼容的查询操作所使用的 `external_id`。

### 第 2 步：检查是否就绪 {#step-2-check-readiness}

使用不带 `asset://` 前缀的 `external_id` 查询 Asset：

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

请将 `status` 视为提供商定义的开放取值，而不是穷举的枚举。在提交生成任务之前，请等待提供商报告
可用状态；常见的就绪值为 `Active`。`download_url` 由提供商管理，
在处理期间可能为空。需要当前预览 URL 时，请再次查询 Asset。在 Seedance 请求中请继续使用持久的
`asset_url`，而不是复制 `download_url`。

### 第 3 步：使用 Asset 生成 {#step-3-generate-with-the-asset}

将 `asset_url` 放入与媒体类型对应的 URL 字段中。此示例将已注册的图像用作视觉
参考：

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

创建响应会返回任务 `id`。按照所选模型页面中的说明轮询
`GET /api/v3/contents/generations/tasks/{task_id}`。

### 选择内容项和角色 {#choose-the-content-item-and-role}

| Asset 类型 | `content[].type` | URL 字段 | 支持的角色 | 用途 |
| --- | --- | --- | --- | --- |
| 图像 | `image_url` | `image_url.url` | `first_frame` | 让视频从这一帧开始 |
| 图像 | `image_url` | `image_url.url` | `last_frame` | 以这一帧结束；同一请求中需包含 `first_frame` |
| 图像 | `image_url` | `image_url.url` | `reference_image` | 保留主体、产品、构图、服装或视觉风格 |
| 视频 | `video_url` | `video_url.url` | `reference_video` | 遵循动作、节奏、运镜或剪辑韵律 |
| 音频 | `audio_url` | `audio_url.url` | `reference_audio` | 遵循人声、对白、音乐或音效设计 |

音频不能作为唯一输入。请将 `reference_audio` Asset 与文本、图像或视频组合使用。任何
包含 `video_url` 的请求都按视频生视频费率计费。

#### 视频 Asset 示例 {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### 音频 Asset 示例 {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### 直接使用 URL 还是 `asset://` 引用？ {#direct-url-or-asset-reference}

| 输入 | 适用情况 | 权衡 |
| --- | --- | --- |
| 公开 HTTP(S) URL | 媒体已托管且只使用一次 | 路径最快，但 URL 必须在任务提交和提供商拉取期间保持可访问 |
| `asset://` 引用 | 通过官方 Asset 协议复用媒体 | 多了注册和就绪检查步骤，之后可为后续 Seedance 任务提供持久引用 |

请求参数、轮询、任务状态和计费请参见上文的 [Seedance 指南](#seedance-guide)。

## ByteDance 官方资源 {#official-bytedance-resources}
- [Seedance 视频生成文档](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [创建内容生成任务 API](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Seedance 2.0 提示词指南](https://www.volcengine.com/docs/82379/2222480?lang=en)
