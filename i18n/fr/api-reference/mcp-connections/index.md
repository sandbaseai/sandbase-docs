---
i18nSource: ee126767f58b111b
title: API MCP Connections
description: Enregistrez des serveurs MCP distants en HTTPS que les Agents peuvent appeler.
---

# API MCP Connections {#mcp-connections-api}

Une connexion MCP enregistre un serveur MCP distant accessible en HTTPS. Les Agents référencent les connexions dans `mcp_connections` ; chaque Session fige la configuration de la connexion à son démarrage. Les ID de connexion utilisent le préfixe `mcp_`. Pour vous authentifier auprès du serveur avec un jeton Bearer, créez d'abord un [Secret](/agents/api-credentials#with-the-api) pour la même URL.

| Méthode | Chemin | Rôle |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Créer une connexion](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Lister les connexions](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Récupérer une connexion](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Remplacer une connexion](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Activer une connexion](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Désactiver une connexion](#disable-a-connection) |

Chaque écriture exige `Idempotency-Key` (1 à 128 octets, sans espace au début ni à la fin). L'objet connexion contient `id`, `name`, `server_url`, `secret_id` (s'il est défini), `status` (`active` ou `disabled`), `row_version`, `created_at` et `updated_at`.

## Créer une connexion {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` est obligatoire et non vide, jusqu'à 128 octets.
- `server_url` doit être en HTTPS, sans informations utilisateur, requête ni fragment (jusqu'à 2048 octets).
- `secret_id` est facultatif. Omettez-le pour un serveur anonyme. S'il est défini, le Secret doit être `active` et son `server_url` doit être exactement égal à ce `server_url`, sinon la requête échoue (409 pour un Secret inactif, 400 pour une URL différente).

Renvoie `201 Created`.

## Lister les connexions {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Pagination par offset avec `data`, `total`, `limit` et `offset`. `limit` vaut 20 par défaut et est plafonné à 200 ; les valeurs manquantes, invalides ou non positives utilisent 20. `offset` vaut 0 par défaut ; les valeurs invalides ou non positives utilisent 0. Avancez du `limit` renvoyé jusqu'à ce que `offset + data.length >= total`. Les ressources désactivées restent visibles dans la liste.

## Récupérer une connexion {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Remplacer une connexion {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` remplace `name`, `server_url` et `secret_id` ensemble ; omettre `secret_id` rend la connexion anonyme. `row_version` est obligatoire et doit correspondre à la valeur actuelle renvoyée par Get Connection. Renvoie `200 OK` avec la connexion mise à jour. Une connexion désactivée reste désactivée après le remplacement, jusqu'à ce que vous l'activiez.

## Activer une connexion {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` est obligatoire et doit être un entier positif correspondant à la ressource actuelle. Renvoie `200 OK` avec la connexion. L'activation conserve le même ID de connexion. Elle ne restaure pas un Secret révoqué ; remplacez d'abord la connexion avec un nouveau Secret actif.

## Désactiver une connexion {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Renvoie `204 No Content` et définit `status` sur `disabled`. Les nouvelles Sessions ne peuvent pas utiliser la connexion, et les Sessions existantes qui l'ont figée refusent toute nouvelle entrée. Un appel d'outil déjà en cours n'est pas interrompu.

## Modifications et Sessions en cours {#changes-and-running-sessions}

Les Sessions figent les paramètres de connexion à leur démarrage. Après le remplacement d'une connexion ou la rotation de son Secret, les nouvelles Sessions utilisent la nouvelle configuration et les Sessions existantes conservent leur instantané. Désactiver la connexion ou révoquer son Secret bloque à la fois les nouvelles Sessions et toute nouvelle entrée dans les Sessions existantes.

## Erreurs et nouvelles tentatives {#errors-and-retries}

Les erreurs utilisent l'[enveloppe d'erreur des Agents](/api-reference/errors#agents-platform-errors). Des champs invalides ou une clé d'idempotence d'écriture manquante renvoient `400 invalid_request` ; une ressource inconnue ou inaccessible renvoie `404 not_found`. Une `row_version` obsolète, un état de cycle de vie incompatible ou la réutilisation d'une clé de création ou de mise à jour avec une entrée différente renvoie `409 conflict`. Relisez la ressource avant d'envoyer une nouvelle mise à jour, et utilisez une nouvelle clé pour chaque nouvelle opération d'écriture.

`created_at` et `updated_at` sont des chaînes d'horodatage RFC 3339.
