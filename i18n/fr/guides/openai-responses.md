---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: Utilisez l'API Responses compatible OpenAI avec les modèles GPT via SandBase.
---

# OpenAI Responses {#openai-responses}

Les modèles GPT prennent en charge l'API Responses compatible OpenAI à `POST /v1/responses`.
Utilisez `input` pour les prompts ou le contenu structuré et lisez les items générés dans
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

## Compatibilité avec Chat Completions {#chat-completions-compatibility}

Les mêmes modèles GPT prennent aussi en charge `POST /v1/chat/completions`. Ce protocole
utilise `messages` dans la requête et `choices` dans la réponse, tandis que Responses
utilise `input` et `output`. Les structures de paramètres ne sont pas interchangeables ;
choisissez l'endpoint qui correspond à votre SDK.

Consultez [Chat Completions](./chat-completions) pour le format de requête compatible
et les [références des modèles GPT](https://www.sandbase.ai/models) pour les
champs et limites propres à chaque modèle.

## Étapes suivantes {#next-steps}

- [Référence de l'API Responses](/api-reference/responses)
- [Référence de l'API Chat Completions](/api-reference/llm-gateway)
- [Catalogue Models](https://www.sandbase.ai/models)
