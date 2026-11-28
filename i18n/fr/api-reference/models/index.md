---
i18nSource: 3ccdc1071b9be798
title: API Models
description: Découvrez les métadonnées, tarifs, statuts de prise en charge et capacités des modèles SandBase.
---

# API Models {#models-api}

Utilisez l'API Models pour découvrir les modèles avant de choisir un endpoint d'inférence. L'opération de liste est compatible OpenAI et renvoie des fiches d'identité compactes. Récupérez un modèle pour obtenir ses métadonnées SandBase de capacités, de schéma et de tarification.

| Opération | Endpoint | Documentation |
|---|---|---|
| Lister les modèles | `GET /v1/models` | [Lister les modèles](./list) |
| Obtenir un modèle | `GET /v1/models/{id_or_name}` | [Obtenir un modèle](./get) |
| Invoquer une capacité d'API par chemin | `GET/POST /v1/api/{vendor}/{upstream_path}` | [Passthrough d'API](./api-passthrough) |
| Exécuter une capacité de modèle ou d'API | `POST /v1/run` | [Exécuter une capacité](./run) |
| Obtenir un résultat asynchrone | `GET /v1/run/{id}` | [Obtenir le résultat d'une exécution](./run-get) |
| Recevoir un callback asynchrone | `webhook_url` sur `POST /v1/run` | [Callbacks webhook](./run#webhook-callbacks) |
| Parcourir les modèles pris en charge | — | [Catalogue Models](https://www.sandbase.ai/models) |

Pour exécuter un modèle, ouvrez sa page de référence depuis le [catalogue Models](https://www.sandbase.ai/models) ; chaque page indique l'identifiant exact, les champs de requête et les tarifs. Cette page documente la découverte, l'exécuteur de capacités unifié, le passthrough d'API, les Assets et la consultation du coût des tâches.

`GET /v1/models` prend en charge `q`, `vendor`, `type` et `order` ; il n'est pas paginé. Si `type` est omis, la valeur par défaut est `llm`, tandis qu'un `type=` explicitement vide liste tous les types de modèles publics. Le filtre `vendor` est exact et sensible à la casse ; `q` est une recherche de sous-chaîne insensible à la casse. Chaque élément de la liste contient `id`, `object`, `created` et `owned_by`, où `id` est le nom logique du modèle utilisé dans les requêtes.

Les noms de modèles peuvent contenir `/`. Transmettez ces barres obliques comme séparateurs de chemin lors de l'appel à l'endpoint de détail, par exemple `/v1/models/openai/gpt-5.6-luna` ; la route du serveur interprète le reste du chemin comme un seul identifiant logique. Récupérez l'ID actuel via `GET /v1/models` plutôt que de copier un identifiant d'un ancien guide.

Pour une réponse asynchrone `202` d'une API d'inférence, interrogez `GET /v1/run/{id}` avec l'ID opaque renvoyé. Ne déduisez pas de préfixe d'ID et ne construisez pas un autre chemin d'interrogation à partir des en-têtes de compatibilité.
