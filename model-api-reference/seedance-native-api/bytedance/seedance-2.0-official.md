---
title: Seedance 2.0 Official
description: Generate Seedance 2.0 video through the official ByteDance task protocol at 480p or 720p.
---

# Seedance 2.0 Official

Use the ByteDance-native Contents Generations task protocol with this exact model identifier:

```text
bytedance/seedance/2.0-official
```

Choose this lower-priced model when 480p or 720p output is sufficient. It supports text, image, video, and audio
references using the same request structure as Seedance 2.5 Official.

## Create a task

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.0-official",
    "content": [
      {"type": "text", "text": "A cinematic aerial shot over an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

The response contains a task `id`. Poll `GET /api/v3/contents/generations/tasks/{task_id}` until it reaches a terminal
status. See [Official Native API](/model-api-reference/seedance-native-api) for every input workflow, parameter, response,
status, and error.
