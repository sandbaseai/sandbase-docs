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

The response contains a task `id`. Poll `GET /api/v3/contents/generations/tasks/{task_id}` until it reaches a terminal
status. See [Official Native API](/model-api-reference/seedance-native-api) for every input workflow, parameter, response,
status, and error.
