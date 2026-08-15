---
title: Vision
---

# Vision

Vision capabilities are built into LLM models that support multimodal input. Send images alongside text in the Chat Completions API.

## How to Use

Pass images as content parts in the messages array:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "What's in this image?"},
            {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
        ]
    }]
)
print(response.choices[0].message.content)
```

## Image Input Formats

| Format | Example |
|--------|---------|
| URL | `{"type": "image_url", "image_url": {"url": "https://..."}}` |
| Base64 | `{"type": "image_url", "image_url": {"url": "data:image/png;base64,..."}}` |

## Models with Vision

| Model | Max Images | Notes |
|-------|-----------|-------|
| `gpt-4o` | 20 | Best overall vision |
| `claude-sonnet-4` | 20 | Strong document understanding |
| `gemini-2.5-pro` | 16 | 1M context for long documents |
| `meta/llama-4-maverick` | 8 | Open-weight alternative |

→ [Full capability matrix](/models/capabilities)
