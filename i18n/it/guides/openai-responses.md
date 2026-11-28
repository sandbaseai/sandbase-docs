---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: Usa la Responses API compatibile con OpenAI con i modelli GPT tramite SandBase.
---

# OpenAI Responses {#openai-responses}

I modelli GPT supportano la Responses API compatibile con OpenAI su `POST /v1/responses`.
Usa `input` per i prompt o i contenuti strutturati e leggi gli elementi generati da
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

## Compatibilità con Chat Completions {#chat-completions-compatibility}

Gli stessi modelli GPT supportano anche `POST /v1/chat/completions`. Quel protocollo
usa `messages` nella richiesta e `choices` nella risposta, mentre Responses
usa `input` e `output`. Gli envelope dei parametri non sono intercambiabili:
scegli l'endpoint adatto al tuo SDK.

Vedi [Chat Completions](./chat-completions) per il formato di richiesta compatibile
e i [riferimenti dei modelli GPT](https://www.sandbase.ai/models) per
i campi e i limiti specifici di ciascun modello.

## Passaggi successivi {#next-steps}

- [Riferimento della Responses API](/api-reference/responses)
- [Riferimento della Chat Completions API](/api-reference/llm-gateway)
- [Catalogo dei modelli](https://www.sandbase.ai/models)
