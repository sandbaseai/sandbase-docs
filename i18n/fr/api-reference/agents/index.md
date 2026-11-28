---
i18nSource: 8524e8b4d6f5ab97
title: API Agents
description: Créez, versionnez, archivez et clonez des configurations d'Agent enregistrées.
---

# API Agents {#agents-api}

Un Agent est une configuration enregistrée et versionnée : un modèle, des instructions, un profil d'exécution, des Skills, des connexions MCP et des paramètres de sortie. Créer ou mettre à jour un Agent ne l'exécute pas. Exécutez-le dans une [Session](/api-reference/sessions/).

L'API Agents suit le protocole OpenAI Agents (`client.beta.agents` dans le SDK Python d'OpenAI). L'en-tête `OpenAI-Beta` est facultatif ; si vous l'envoyez, sa valeur doit être `agents=v1`. SandBase ajoute les versions, les mises à jour compare-and-set, l'archivage et la restauration, ainsi qu'un catalogue public.

## Opérations sur les Agents {#agent-operations}

| Méthode | Chemin | Objet |
|---|---|---|
| `POST` | `/v1/agents` | [Créer un Agent](./create) en version 1 |
| `GET` | `/v1/agents` | [Lister les Agents](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Obtenir un Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Mettre à jour un Agent](./update) (mise à jour partielle à la manière du SDK) |
| `PATCH` | `/v1/agents/{agent_id}` | [Remplacer avec compare-and-set](./replace) sur `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Supprimer](./delete), ce qui archive l'Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [Archiver un Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Désarchiver un Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Restaurer une version antérieure](./restore) en tant que nouvelle version |
| `GET` | `/v1/agents/{agent_id}/versions` | [Lister les versions](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Obtenir une version](./get-version) |
| `GET` | `/v1/agents/catalog` | [Parcourir le catalogue public](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Cloner un Agent du catalogue](./catalog#clone-a-catalog-agent) dans votre organisation |

Les ID d'Agent utilisent le préfixe `agt_`. Les corps de requête sont du JSON strict d'au plus 1 Mio ; les champs inconnus renvoient 400.

## Versions et mises à jour {#versions-and-updates}

- Chaque écriture effective (create, update, replace, restore) produit une version immuable. `version` est le numéro de la version actuelle.
- `POST /v1/agents/{agent_id}` est la mise à jour du SDK OpenAI. Elle ne nécessite pas de `row_version` : la dernière écriture l'emporte.
- `PATCH /v1/agents/{agent_id}` exige le `row_version` que vous avez lu en dernier et renvoie 409 si quelqu'un d'autre a modifié l'Agent entre-temps. Utilisez-le depuis les éditeurs et les automatisations susceptibles de s'exécuter en parallèle.
- Chaque Session fige la version de l'Agent, les versions des Skills et la configuration des connexions MCP avec lesquelles elle a démarré.

## État de préparation {#readiness}

Une version nouvellement écrite indique `projection_status` pendant sa préparation à l'exécution. Les Sessions nécessitent un Agent actif dont le `projection_status` vaut `ready` ; sinon, elles renvoient 409. Les Agents archivés renvoient également 409 pour toute nouvelle exécution.

## Limites actuelles {#current-limits}

- `tools` accepte les outils `function` et au plus un outil `web_search`. L'exécution exige actuellement que `web_search.mode` vaille `disabled`.
- Les outils function peuvent être enregistrés, mais les Runs qui demandent au client de renvoyer un résultat d'outil (`requires_action`) ne sont pas encore pris en charge et se traduisent par `502 executor_contract_error`.
- `multi_agent` doit être omis ou `null`.

## Pagination {#pagination}

`GET /v1/agents` et le catalogue utilisent la pagination par curseur : `limit` (1-100, 20 par défaut), `after` et `order` (`asc` ou `desc`, `desc` par défaut). Les réponses contiennent `object: "list"`, `data`, `has_more`, `first_id` et `last_id` ; passez `last_id` comme `after` pour obtenir la page suivante.

`GET /v1/agents/{agent_id}/versions` utilise la pagination par décalage : `limit` et `offset`, avec `data`, `total`, `limit` et `offset` dans la réponse.

## Erreurs {#errors}

Les erreurs utilisent l'enveloppe Agents `{"error":{"type","code","param":null,"message"}}`. Consultez [Erreurs](/api-reference/errors#agents-platform-errors) pour la liste des codes.
