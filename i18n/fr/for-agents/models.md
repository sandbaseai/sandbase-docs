---
i18nSource: b95a8cd6f82c3a9a
title: Modèles et tarifs lisibles par l'IA
description: Découvrez les modèles SandBase actuels, leurs capacités, leurs schémas et leurs tarifs via la Models API.
---

# Modèles et tarifs {#models-pricing}

Tous les modèles sont accessibles avec une seule clé API SandBase. La disponibilité, les schémas, les capacités, les limites de contexte
et les tarifs des modèles peuvent évoluer indépendamment les uns des autres.

::: info Utilisez les métadonnées des modèles en direct
Utilisez toujours `GET /v1/models` et `GET /v1/models/{id_or_name}` pour obtenir des données actuelles et faisant foi. Ne supposez pas que tous
les LLM prennent en charge le streaming, la vision, les outils, la sortie structurée ou le cache, et ne copiez pas les champs d'entrée ou
les tarifs d'un modèle vers un autre.
:::

## Réponses du catalogue et du détail {#catalog-and-detail-responses}

`GET /v1/models` renvoie des enregistrements d'identité compatibles OpenAI contenant `id`, `object`, `created` et `owned_by`.
Il omet volontairement les métadonnées SandBase de capacités, de schéma et de tarification.

`GET /v1/models/{id_or_name}` ajoute `unified_schema`, `supported_modes` et `model_card`. Lisez la tarification détaillée dans
`model_card` ; il n'existe pas d'objet `pricing` de premier niveau. Considérez `capability_tags`, `supported_modes` et
`unified_schema` comme propres à chaque modèle.

## Découvrir les modèles {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

L'endpoint de liste prend en charge `q`, `vendor`, `type` et `order` ; il n'est pas paginé et utilise `type=llm` par défaut.
Il renvoie des éléments compatibles OpenAI avec `id`, `object`, `created` et `owned_by`. Utilisez l'`id` renvoyé comme
nom de modèle pour demander les détails ou appeler le modèle.

Pour toute réponse asynchrone `202`, interrogez `GET /v1/run/{id}` avec l'ID renvoyé. Traitez l'ID comme opaque : ne
déduisez pas son format et ne construisez pas d'autre chemin de polling à partir d'un préfixe d'ID ou d'un en-tête de compatibilité.

## Inspecter un modèle {#inspect-one-model}

Les noms de modèles sont qualifiés par le fournisseur et peuvent contenir `/` :

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Avant l'exécution, inspectez :

- `enabled` et `execution_mode`
- `capability_tags` et `supported_modes`
- `unified_schema` pour les champs de requête acceptés
- `model_card` pour la formule de tarification actuelle et les multiplicateurs de tokens ou de cache

## Vérifier le coût réel d'une tâche {#check-actual-task-cost}

Pour une tâche terminée ou en cours, interrogez le coût enregistré au lieu de le recalculer à partir d'un tableau obsolète :

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Consultez la [référence de la Models API](/api-reference/models/) pour les contrats de réponse et le
[Guide des erreurs](/for-agents/errors) pour la forme des réponses et les recommandations de nouvelle tentative.
