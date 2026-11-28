---
i18nSource: 0ca53876f04eb96d
title: Premier appel d'API
description: "Présentation détaillée de votre premier appel à l'API SandBase : anatomie de la requête, structure de la réponse et streaming."
---

# Premier appel d'API {#first-api-call}

Ce guide détaille l'anatomie d'une requête et d'une réponse de l'API SandBase. À la fin, vous comprendrez chaque champ du corps de la requête, comment lire la réponse et comment utiliser le streaming.

## Avant de commencer {#before-you-start}

Il vous faut une organisation SandBase active, une [clé API](/getting-started/api-keys) et un ID de modèle issu du [catalogue de modèles](https://www.sandbase.ai/models). Exportez la clé pour que les exemples ne placent pas de secrets dans le code source :

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Commencez par une requête sans streaming. Une fois l'authentification et le traitement de la réponse fonctionnels, ajoutez le streaming et une logique de nouvelle tentative adaptée à la production.

## Anatomie d'une requête {#request-anatomy}

Cette présentation utilise la route Chat Completions compatible OpenAI :

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### En-têtes obligatoires {#required-headers}

| En-tête | Valeur | Description |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | Votre clé API SandBase |
| `Content-Type` | `application/json` | Format du corps de la requête |

### Corps de la requête {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### Paramètres du corps {#body-parameters}

| Paramètre | Type | Obligatoire | Description |
|-----------|------|----------|-------------|
| `model` | string | Oui | Un ID de modèle activé renvoyé par `GET /v1/models` (par exemple, `deepseek/deepseek-v4-flash`) |
| `messages` | array | Oui | Historique de la conversation sous forme de tableau d'objets message |
| `temperature` | number | Non | Température d'échantillonnage (0–2). La prise en charge et les valeurs par défaut peuvent varier selon le modèle. |
| `max_tokens` | integer | Non | Nombre maximal de tokens à générer dans la réponse |
| `top_p` | number | Non | Paramètre de nucleus sampling (0–1) |
| `stream` | boolean | Non | Indique s'il faut streamer la réponse. Par défaut : `false` |
| `stop` | string ou array | Non | Séquences d'arrêt : la génération s'arrête lorsqu'elles sont rencontrées |
| `frequency_penalty` | number | Non | Pénalité de répétition compatible avec le fournisseur, lorsqu'elle est prise en charge |
| `presence_penalty` | number | Non | Pénalité de présence compatible avec le fournisseur, lorsqu'elle est prise en charge |

### Rôles des messages {#message-roles}

| Rôle | Rôle fonctionnel |
|------|---------|
| `system` | Définit le comportement et la personnalité de l'assistant |
| `user` | L'entrée de l'utilisateur humain |
| `assistant` | Réponses précédentes de l'assistant (pour les conversations multi-tours) |
| `developer`, `tool` | Rôles supplémentaires compatibles OpenAI, lorsque le modèle et la route sélectionnés les prennent en charge |

## Exemple de requête complète {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## Structure de la réponse {#response-structure}

### Réponse typique sans streaming {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### Explication des champs de la réponse {#response-fields-explained}

| Champ | Description |
|-------|-------------|
| `id` | Identifiant unique de cette complétion |
| `object` | Objet de réponse compatible OpenAI, normalement `"chat.completion"` sur cette route |
| `created` | Horodatage Unix de la génération de la réponse |
| `model` | Le modèle qui a généré la réponse |
| `choices` | Tableau des choix de complétion (généralement un seul) |
| `choices[].index` | Index de ce choix dans le tableau |
| `choices[].message.role` | Rôle renvoyé pour le message généré, normalement `"assistant"` |
| `choices[].message.content` | Le texte généré |
| `choices[].finish_reason` | Raison de l'arrêt de la génération (voir ci-dessous) |
| `usage.prompt_tokens` | Tokens de votre entrée |
| `usage.completion_tokens` | Tokens de la sortie générée |
| `usage.total_tokens` | Somme des tokens du prompt et de la complétion |

### Raisons d'arrêt {#finish-reasons}

Les raisons d'arrêt dépendent du fournisseur. Les valeurs courantes compatibles OpenAI sont notamment :

| Valeur | Signification habituelle |
|-------|---------|
| `stop` | Fin naturelle de la réponse ou séquence d'arrêt rencontrée |
| `length` | Limite `max_tokens` atteinte : la réponse a été tronquée |

Traitez les valeurs inconnues comme une sortie valide du fournisseur plutôt que de rejeter la réponse.

## Réponses en streaming {#streaming-responses}

Pour une sortie en temps réel (comme un chatbot qui écrit), utilisez le streaming. La réponse arrive sous forme de Server-Sent Events (SSE) :

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### Format SSE du streaming {#streaming-sse-format}

Un flux compatible émet généralement des Server-Sent Events comme ceux-ci :

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Points clés :

- consommez les chunks dans l'ordre et concaténez les fragments `delta.content`
- tolérez les chunks ne contenant que des métadonnées, les deltas vides et les champs compatibles fournisseur que vous ne reconnaissez pas
- arrêtez-vous lorsque le flux se ferme ou que son marqueur de fin arrive ; Chat Completions utilise généralement `data: [DONE]`
- ne supposez pas que chaque modèle émet exactement la même forme de premier ou de dernier chunk

## Utiliser le SDK Anthropic {#using-the-anthropic-sdk}

SandBase expose également un endpoint compatible Anthropic à `POST /v1/messages`. Utilisez le SDK Anthropic en modifiant la `base_url` :

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Structure de la réponse Anthropic {#anthropic-response-structure}

L'endpoint compatible Anthropic renvoie une réponse au format Anthropic. Une réponse textuelle typique ressemble à ceci :

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| Champ | Description |
|-------|-------------|
| `id` | ID du message (préfixé par `msg_`) |
| `type` | Type d'objet du message, normalement `"message"` |
| `role` | Rôle du message généré, normalement `"assistant"` |
| `content` | Tableau de blocs de contenu typés ; ne supposez pas que chaque bloc est du texte |
| `model` | Le modèle qui a généré la réponse |
| `stop_reason` | `"end_turn"` (arrêt naturel), `"max_tokens"` (limite atteinte) ou `"stop_sequence"` |
| `usage.input_tokens` | Tokens de votre entrée |
| `usage.output_tokens` | Tokens de la sortie générée |

### Streaming Anthropic {#anthropic-streaming}

Le streaming avec le SDK Anthropic fonctionne de la même manière : passez simplement `stream=True` :

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## Choisir un modèle {#choosing-a-model}

Lorsque vous choisissez un modèle, consultez sa fiche à jour pour connaître sa disponibilité, ses tarifs, sa longueur de contexte, les entrées prises en charge et ses capacités. Ces valeurs évoluent indépendamment : ne vous fiez donc pas à une comparaison de modèles recopiée.

- Parcourez le [catalogue de modèles](https://www.sandbase.ai/models) actuel.
- Ouvrez la page d'un modèle dans le catalogue pour voir ses champs de requête spécifiques.
- Interrogez `GET /v1/models` lorsqu'une intégration a besoin des métadonnées actuelles des modèles par programmation.

Pour les modèles qui partagent la même interface compatible, changer de modèle commence généralement par le paramètre `model`. Revérifiez les capacités et le schéma du modèle sélectionné avant de reprendre des champs facultatifs, des outils, des entrées média ou des paramètres de sortie structurée.

## Étapes suivantes {#next-steps}

Avant la mise en production, définissez des délais d'expiration de requête, ne réessayez que les échecs transitoires avec un backoff exponentiel borné, journalisez les IDs de requête lorsqu'ils sont disponibles et surveillez l'utilisation sans journaliser les prompts ni les clés API.

- [**Référence de l'API**](/api-reference/) : endpoints d'inférence et contrats de l'API Platform
- [**Guide du streaming**](/guides/streaming) : modèles de streaming avancés et gestion des erreurs
- [**Modèles**](https://www.sandbase.ai/models) : découverte des modèles, capacités et tarifs actuels
- [**Erreurs**](/guides/error-handling) : gérer les échecs et les nouvelles tentatives
