---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: Usa la Responses API compatible con OpenAI con modelos GPT a través de SandBase.
---

# OpenAI Responses {#openai-responses}

Los modelos GPT admiten la Responses API compatible con OpenAI en `POST /v1/responses`.
Usa `input` para los prompts o el contenido estructurado y lee los elementos generados en
`output`.

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Compatibilidad con Chat Completions {#chat-completions-compatibility}

Los mismos modelos GPT también admiten `POST /v1/chat/completions`. Ese protocolo
usa `messages` en la solicitud y `choices` en la respuesta, mientras que Responses
usa `input` y `output`. Los formatos de parámetros no son intercambiables;
elige el endpoint que corresponda a tu SDK.

Consulta [Chat Completions](./chat-completions) para ver el formato de solicitud compatible
y las [referencias de modelos GPT](https://www.sandbase.ai/models) para ver
los campos y límites específicos de cada modelo.

## Próximos pasos {#next-steps}

- [Referencia de la Responses API](/api-reference/responses)
- [Referencia de la Chat Completions API](/api-reference/llm-gateway)
- [Catálogo de Models](https://www.sandbase.ai/models)
