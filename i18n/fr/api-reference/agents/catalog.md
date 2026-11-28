---
i18nSource: 1b5099685e9df6ce
title: Catalogue d'Agents
description: Parcourez les Agents publics et clonez-en un dans votre organisation.
---

# Catalogue d'Agents {#agent-catalog}

Le catalogue liste les Agents que SandBase publie pour être réutilisés. Les entrées du catalogue sont en lecture seule. Clonez-en une pour obtenir un Agent privé dans votre organisation, que vous pouvez modifier, exécuter et déployer.

| Méthode | Chemin | Objet |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Lister les Agents publics |
| `GET` | `/v1/agents/catalog/{agent_id}` | Obtenir un Agent public, éventuellement à `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Le copier dans votre organisation |

## Lister les Agents du catalogue {#list-catalog-agents}

Pagination par curseur avec `limit` (1-100), `after` et `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Chaque entrée contient `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` et `updated_at`.

## Obtenir un Agent du catalogue {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` est facultatif et doit être un entier positif. La réponse détaillée ajoute un objet `configuration` en lecture seule (nom, description, modèle, instructions, profil d'exécution, métadonnées, outils, texte, raisonnement et Skills).

## Cloner un Agent du catalogue {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

Le corps accepte les champs facultatifs `version` (entier positif, par défaut la version publique actuelle) et `name` (128 caractères maximum). La réponse est `201 Created` avec un [objet Agent](./create) complet doté d'un nouvel ID `agt_` dans votre organisation. `Idempotency-Key` est facultatif ; envoyez une clé stable pour qu'une nouvelle tentative ne crée pas de seconde copie.

Après le clonage, [créez une Session](/api-reference/sessions/create) pour le tester.
