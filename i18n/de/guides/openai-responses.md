---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: Nutze die OpenAI-kompatible Responses API mit GPT-Modellen über SandBase.
---

# OpenAI Responses {#openai-responses}

GPT-Modelle unterstützen die OpenAI-kompatible Responses API unter `POST /v1/responses`.
Verwende `input` für Prompts oder strukturierte Inhalte und lies generierte Items aus
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

## Kompatibilität mit Chat Completions {#chat-completions-compatibility}

Dieselben GPT-Modelle unterstützen auch `POST /v1/chat/completions`. Dieses Protokoll
verwendet `messages` in der Anfrage und `choices` in der Antwort, während Responses
`input` und `output` verwendet. Die Parameterstrukturen sind nicht austauschbar;
wähle den Endpoint, der zu deinem SDK passt.

Das kompatible Request-Format findest du unter [Chat Completions](./chat-completions),
modellspezifische Felder und Limits in den [GPT-Modellreferenzen](https://www.sandbase.ai/models).

## Nächste Schritte {#next-steps}

- [Referenz der Responses API](/api-reference/responses)
- [Referenz der Chat Completions API](/api-reference/llm-gateway)
- [Models-Katalog](https://www.sandbase.ai/models)
