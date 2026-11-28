---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: Use a Responses API compatível com OpenAI com modelos GPT pela SandBase.
---

# OpenAI Responses {#openai-responses}

Os modelos GPT oferecem suporte à Responses API compatível com OpenAI em `POST /v1/responses`.
Use `input` para prompts ou conteúdo estruturado e leia os itens gerados em
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

## Compatibilidade com Chat Completions {#chat-completions-compatibility}

Os mesmos modelos GPT também oferecem suporte a `POST /v1/chat/completions`. Esse protocolo
usa `messages` na requisição e `choices` na resposta, enquanto a Responses
usa `input` e `output`. As estruturas de parâmetros não são intercambiáveis;
escolha o endpoint que corresponde ao seu SDK.

Consulte [Chat Completions](./chat-completions) para ver o formato de requisição compatível
e as [referências de modelos GPT](https://www.sandbase.ai/models) para
campos e limites específicos de cada modelo.

## Próximos passos {#next-steps}

- [Referência da Responses API](/api-reference/responses)
- [Referência da Chat Completions API](/api-reference/llm-gateway)
- [Catálogo de modelos](https://www.sandbase.ai/models)

