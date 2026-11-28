---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: Używaj zgodnego z OpenAI Responses API z modelami GPT przez SandBase.
---

# OpenAI Responses {#openai-responses}

Modele GPT obsługują zgodne z OpenAI Responses API pod adresem `POST /v1/responses`.
Używaj `input` do promptów lub treści strukturalnych, a wygenerowane elementy odczytuj z
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

## Zgodność z Chat Completions {#chat-completions-compatibility}

Te same modele GPT obsługują również `POST /v1/chat/completions`. Ten protokół
używa `messages` w żądaniu i `choices` w odpowiedzi, a Responses
używa `input` i `output`. Struktury parametrów nie są wymienne;
wybierz endpoint pasujący do Twojego SDK.

Zgodny format żądania opisuje strona [Chat Completions](./chat-completions),
a pola i limity właściwe dla poszczególnych modeli znajdziesz
w [dokumentacji modeli GPT](https://www.sandbase.ai/models).

## Następne kroki {#next-steps}

- [Dokumentacja Responses API](/api-reference/responses)
- [Dokumentacja Chat Completions API](/api-reference/llm-gateway)
- [Katalog Models](https://www.sandbase.ai/models)
