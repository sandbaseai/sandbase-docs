---
i18nSource: 8c960d117a998817
title: Modèles d'image et de vidéo
description: Utilisez l'API Run partagée de SandBase pour générer des images et des vidéos de manière asynchrone.
---

# Modèles d'image et de vidéo {#image-and-video-models}

Les modèles d'image et de vidéo utilisent l'API Run asynchrone partagée de SandBase. Soumettez une tâche
avec `POST /v1/run`, puis interrogez `GET /v1/run/{id}` jusqu'à ce que le run atteigne un
statut terminal.

## Soumettre une tâche {#submit-a-task}

Utilisez l'ID de modèle exact indiqué dans [Modèles d'image et de vidéo](https://www.sandbase.ai/models/image-video). Les autres
champs de la requête sont propres au modèle ; ouvrez la référence API du modèle pour connaître ses
entrées requises et ses limites.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

La réponse inclut un `id` opaque et un `status` tel que `pending` ou
`running`.

## Interroger le résultat {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Continuez à interroger jusqu'à ce que `status` vaille `completed`, `failed` ou `timeout`. Les runs
terminés contiennent des sorties propres à la capacité, comme une URL d'image ou de vidéo. Conservez
l'ID du run et considérez la réponse du run comme la source faisant foi pour le statut.

## Callbacks webhook {#webhook-callbacks}

Les tâches asynchrones prises en charge peuvent aussi définir `webhook_url` dans la requête de soumission.
Le callback est une indication de livraison et ne remplace pas le polling ; continuez à
utiliser `GET /v1/run/{id}` et gérez sans risque les callbacks en double ou retardés. Consultez
[Exécuter une capacité](/api-reference/models/run#webhook-callbacks) pour le contrat de callback
commun.

## Les capacités d'API utilisent un chemin déduit de l'URL {#api-capabilities-use-a-url-derived-path}

L'API Run partagée sert à la génération par les modèles. Les capacités d'API du
[catalogue des API](https://www.sandbase.ai/apis) utilisent une
route différente, déduite de l'URL : `GET` ou `POST /v1/api/{vendor}/{upstream_path}`.
Le nom de capacité qualifié par le fournisseur provient de la Models API ou du catalogue des API ; le
champ `model` peut donc être omis d'un corps POST :

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Cette route est destinée aux capacités d'API et ne remplace pas `/v1/run` pour
appeler des modèles d'image ou de vidéo. Si la capacité d'API sélectionnée est asynchrone,
interrogez l'ID de run renvoyé avec `GET /v1/run/{id}`.

## Étapes suivantes {#next-steps}

- [Modèles d'image et de vidéo](https://www.sandbase.ai/models/image-video)
- [Exécuter une capacité](/api-reference/models/run)
- [Obtenir le résultat d'un run](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)
