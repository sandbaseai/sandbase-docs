---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: Utilisez avec SandBase les chat completions compatibles OpenAI, le streaming, les outils, les entrées multimodales et la sortie structurée.
---

# Chat Completions {#chat-completions}

SandBase fournit un endpoint Chat Completions compatible OpenAI à `POST /v1/chat/completions`. Les applications existantes basées sur le SDK OpenAI peuvent utiliser SandBase en changeant simplement la clé API et l'URL de base.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Messages et contenu multimodal {#messages-and-multimodal-content}

Envoyez les messages dans l'ordre de la conversation en utilisant les rôles pris en charge par le fournisseur sélectionné, généralement `system`, `developer`, `user`, `assistant` et `tool`. Le texte peut être une chaîne. Les modèles qui prennent en charge la vision acceptent aussi des parties de contenu comme `text` et `image_url`.

## Streaming {#streaming}

Définissez `stream: true` pour recevoir des Server-Sent Events. Lisez chaque événement `data:` dans l'ordre et concaténez `choices[0].delta.content`. Le flux se termine par `data: [DONE]`. Ajoutez `stream_options: {"include_usage": true}` lorsque le fournisseur sélectionné fournit l'utilisation en streaming ; sinon, l'utilisation peut être absente.

## Outils {#tools}

Définissez les fonctions appelables dans `tools`. Lorsque l'assistant renvoie des `tool_calls`, exécutez chaque fonction dans votre application, puis ajoutez un message `tool` contenant le `tool_call_id` correspondant avant de poursuivre.

## Sortie structurée {#structured-output}

Utilisez `response_format` pour demander une réponse sous forme d'objet JSON ou conforme à un JSON Schema. La prise en charge varie selon le modèle : vérifiez les capacités du modèle sélectionné avant de compter sur une application stricte du schéma.

## Paramètres propres au fournisseur {#provider-specific-parameters}

SandBase utilise `model` et `stream` pour le routage. Les autres champs de requête compatibles OpenAI sont conservés lorsque le fournisseur sélectionné utilise le même protocole. Lorsque SandBase traduit entre protocoles, utilisez les champs documentés ou `extra_body` ; la prise en charge varie selon le fournisseur.

## Erreurs et nouvelles tentatives {#errors-and-retries}

Utilisez un backoff borné pour les réponses `429` réessayables et les erreurs serveur transitoires, uniquement lorsque régénérer est sans risque. Ne réessayez pas automatiquement les requêtes mal formées, les échecs d'authentification ou les requêtes dont les effets de bord d'outils ont pu déjà se produire. Consultez [Erreurs et nouvelles tentatives](/guides/error-handling). Pour le schéma complet des champs et des réponses, consultez l'[API Chat Completions](/api-reference/llm-gateway).
