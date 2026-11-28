---
i18nSource: 335b45fb98c53890
title: Réponses en streaming
description: Streamez la sortie des modèles SandBase avec les SDK compatibles OpenAI ou Anthropic et gérez les résultats partiels en toute sécurité.
---

# Réponses en streaming {#streaming-responses}

Le streaming renvoie la sortie du modèle au fur et à mesure qu'elle est disponible. SandBase conserve le format d'événement de l'API compatible que vous
appelez : OpenAI Chat Completions utilise des Server-Sent Events (SSE) contenant uniquement des données, tandis qu'Anthropic Messages utilise des événements SSE nommés.

Utilisez un SDK officiel compatible lorsque c'est possible. Il gère le découpage des événements, les arguments incrémentaux des appels d'outils et la
fin du protocole de manière plus sûre que si vous découpiez vous-même le texte brut de la réponse.

## OpenAI Chat Completions {#openai-chat-completions}

Définissez `stream: true` sur `POST /v1/chat/completions`.

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

Les chunks compatibles OpenAI placent le texte incrémental dans `choices[0].delta.content`. Les arguments des appels d'outils, lorsque le modèle
sélectionné les prend en charge, arrivent sous forme de fragments de chaîne dans `delta.tool_calls` ; concaténez les fragments par index de choix et d'appel
d'outil avant d'analyser le JSON complet. Le flux se termine normalement par `data: [DONE]`.

Ne supposez pas que chaque fournisseur renvoie l'utilisation des tokens dans un flux. Si le modèle sélectionné prend en charge
`stream_options.include_usage` d'OpenAI, l'utilisation peut apparaître vers la fin ; sinon, utilisez la réponse sans streaming ou le
flux de coût de tâche applicable.

## Anthropic Messages {#anthropic-messages}

Utilisez le SDK Anthropic avec `POST /v1/messages`. L'assistant de streaming du SDK assemble les événements nommés et les blocs de contenu.

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

Les flux Anthropic bruts utilisent des noms d'événements comme `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` et `message_stop`. Le texte est transporté par des blocs `text_delta`. L'entrée des outils utilise
des blocs JSON incrémentaux qui doivent être assemblés avant l'analyse.

## Gérer les interruptions et les annulations {#handle-interruption-and-cancellation}

Une erreur HTTP renvoyée avant le début du streaming utilise le corps d'erreur normal de l'endpoint. Une fois la réponse commencée,
une panne réseau peut laisser un texte partiel sans événement final. Ne considérez la sortie comme complète qu'après le
signal de fin normal du protocole.

- Séparez la sortie partielle de l'état validé de l'application.
- Bornez les délais de connexion et d'inactivité dans votre propre client ou proxy en fonction de la charge de travail.
- Utilisez le mécanisme d'annulation du SDK ou un `AbortController` en JavaScript lorsque l'utilisateur arrête la génération.
- N'ajoutez pas automatiquement un flux réessayé à une sortie partielle ; une nouvelle tentative est une nouvelle génération.
- Évitez la mise en mémoire tampon des SSE dans les reverse proxies que vous contrôlez.

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

Lorsque vous lisez des SSE bruts, analysez des trames d'événements complètes séparées par des lignes vides. Les chunks réseau ne correspondent pas un à un
aux événements SSE, et un caractère UTF-8 peut s'étendre sur plusieurs chunks. Utilisez un décodeur de texte en streaming et conservez toute trame incomplète
jusqu'à l'arrivée de nouveaux octets.

## Ressources associées {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Gestion des erreurs](/guides/error-handling)
- [Limites de débit](/guides/rate-limiting)
