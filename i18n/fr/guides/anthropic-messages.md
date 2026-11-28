---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: Utilisez avec SandBase les messages, blocs de contenu, outils, la réflexion et le streaming compatibles Anthropic.
---

# Anthropic Messages {#anthropic-messages}

SandBase fournit un endpoint compatible Anthropic à `POST /v1/messages`. Les applications utilisant le SDK d'Anthropic peuvent s'y connecter en changeant la clé API et l'URL de base.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## En-têtes d'authentification et de version {#authentication-and-version-headers}

Utilisez `x-api-key` ou `Authorization: Bearer …`. Si les deux sont fournis, `x-api-key` est prioritaire. L'en-tête facultatif `anthropic-version` est transmis en amont et vaut `2023-06-01` par défaut s'il est omis. Les valeurs facultatives de `anthropic-beta` sont également transmises, sous réserve de compatibilité avec le fournisseur.

## Messages et blocs de contenu {#messages-and-content-blocks}

Les messages utilisent les rôles `user` et `assistant`. Placez l'instruction système dans le champ de premier niveau `system`. Le contenu peut être du texte brut ou un tableau de blocs typés comme `text`, `image`, `tool_use` et `tool_result`.

## Outils et réflexion étendue {#tools-and-extended-thinking}

Ajoutez les définitions d'outils dans `tools` et contrôlez leur sélection avec `tool_choice`. Si le modèle sélectionné le permet, configurez le raisonnement étendu avec `thinking` ; conservez les blocs de réflexion renvoyés lorsque vous poursuivez la conversation.

## Streaming {#streaming}

Définissez `stream: true` pour recevoir des événements SSE au format Anthropic, notamment `message_start`, les événements de bloc de contenu, `message_delta` et `message_stop`. SandBase transmet également les événements keepalive et les événements bêta définis par le fournisseur. Pour rester compatibles avec les évolutions futures, les consommateurs doivent ignorer les types d'événements inconnus et gérer les événements `error` au niveau du protocole.

## Compatibilité {#compatibility}

SandBase associe le nom public du modèle au fournisseur sélectionné. Les autres champs de requête compatibles et les octets de la réponse sont conservés, sauf si ce fournisseur applique une règle de compatibilité explicite qui supprime un champ non pris en charge ou rejette le candidat. Les fonctionnalités bêta propres à un fournisseur peuvent ne pas être disponibles sur tous les modèles. Pour le schéma complet de la requête et de la réponse, consultez [Créer un message Anthropic](/api-reference/anthropic-compat).
