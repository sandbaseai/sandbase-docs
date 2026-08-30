---
title: Seedance 2.5 Official
description: Generate Seedance 2.5 video through the official ByteDance task protocol with up to 1080p output.
---

# Seedance 2.5 Official

Use the ByteDance-native Contents Generations task protocol with this exact model identifier:

```text
bytedance/seedance/2.5-official
```

Choose this model when you need up to 1080p output. It supports 480p, 720p, and 1080p generation with text, image,
video, and audio references.

## Create a task

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A cinematic aerial shot over an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

The create response contains the task identifier:

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

## Query the task result

Poll the task every 5 to 10 seconds with the same API key:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

While generation is in progress, `status` is `queued` or `running`. A completed task returns the generated video in
`content.video_url`:

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "content": {
    "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4"
  },
  "usage": {
    "completion_tokens": 108900,
    "total_tokens": 108900
  }
}
```

Stop polling when `status` is `succeeded`, `failed`, `expired`, or `cancelled`. See
[Official Native API](/model-api-reference/official-native-api) for every input workflow, parameter, response field,
status, and error.

## Official ByteDance resources

- [Seedance video generation documentation](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [Create contents generation task API](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Seedance 2.0 prompting guide](https://www.volcengine.com/docs/82379/2222480?lang=en)
- [SandBase webhook behavior for asynchronous model tasks](/api-reference/models/run)
