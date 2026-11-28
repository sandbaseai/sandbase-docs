---
i18nSource: dab112fdbbc56799
title: Identifiants pour les outils MCP
description: Stockez des jetons Bearer en écriture seule sous forme de Secrets pour que les Agents puissent appeler des serveurs MCP authentifiés.
---

# Identifiants pour les outils MCP {#credentials-for-mcp-tools}

Lorsqu'un serveur MCP exige une authentification, stockez son jeton Bearer en tant que **Secret** et associez ce Secret à une [connexion MCP](/agents/mcp-tools#mcp-connections). L'environnement d'exécution envoie le jeton uniquement à ce serveur.

## Fonctionnement des Secrets {#how-secrets-work}

- `kind` vaut toujours `mcp_bearer` : un jeton Bearer pour un seul serveur MCP.
- Chaque Secret est lié à une `server_url` exacte. Une connexion ne peut l'utiliser que si sa `server_url` correspond. Pour utiliser une autre URL, créez un autre Secret.
- Le jeton est en écriture seule. L'API renvoie le nom, l'URL, le statut et la `row_version` du Secret, jamais le jeton.
- Les Secrets ne sont pas des variables d'environnement. Ils ne sont pas injectés dans le runtime de l'Agent, et les Agents ne peuvent pas les lire.

Les versions précédentes de SandBase stockaient des identifiants propres à un espace de travail ou à un Agent et les injectaient comme variables d'environnement, par exemple `GITHUB_TOKEN`. Ce modèle a été abandonné et ses enregistrements ne sont pas migrés. Recréez les valeurs dont vous avez encore besoin sous forme de Secrets sur des connexions MCP.

## Avec l'API {#with-the-api}
Créez, renouvelez et révoquez les Secrets avec l'API. Ce guide constitue le contrat d'API ; la page Credentials de la Console, ouverte depuis l'éditeur d'Agent, ne fait pas référence pour le comportement des Secrets. Appelez ces endpoints depuis un backend de confiance, jamais depuis du code exécuté dans le navigateur : ils reçoivent une clé API SandBase et un jeton en clair.

| Méthode | Chemin | Rôle |
|---|---|---|
| `POST` | `/v1/secrets` | [Créer un Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [Lister les Secrets](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Récupérer un Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Renouveler le jeton](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Révoquer un Secret](#revoke-a-secret) |

Chaque écriture exige `Idempotency-Key` (1 à 128 octets, sans espace au début ni à la fin). L'objet Secret contient `id` (préfixe `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` et `updated_at`. `status` vaut `pending` pendant le stockage du jeton, `active` lorsqu'il est utilisable et `disabled` après révocation. `created_at` et `updated_at` sont des horodatages RFC 3339 sous forme de chaînes.

### Créer un Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` doit valoir `mcp_bearer`.
- `server_url` doit être une URL HTTPS sans informations utilisateur, requête ni fragment. Le Secret ne fonctionne que pour cette URL exacte.
- `name` et `token` sont obligatoires et non vides. `name` fait au plus 128 octets, `token` au plus 16384 octets et `server_url` au plus 2048 octets.

La réponse est `201 Created`, sans le jeton. Utilisez l'ID `sec_` comme `secret_id` lorsque vous [créez la connexion MCP](/api-reference/mcp-connections/#create-a-connection).

### Lister les Secrets {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Pagination par offset avec `data`, `total`, `limit` et `offset`. `limit` vaut 20 par défaut et est plafonné à 200 ; une valeur absente, invalide ou non positive donne 20. `offset` vaut 0 par défaut ; une valeur invalide ou non positive donne 0. Avancez de la valeur `limit` renvoyée jusqu'à ce que `offset + data.length >= total`. Les Secrets désactivés restent dans la liste.

### Récupérer un Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Renouveler un Secret {#rotate-a-secret}

Définissez `SECRET_ROW_VERSION` sur la dernière `row_version` obtenue avec Récupérer un Secret.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

Le renouvellement remplace le jeton et conserve le même Secret et la même `server_url`. `token` et une `row_version` entière positive sont obligatoires, le Secret doit être `active` et `row_version` doit correspondre à la dernière valeur. Renvoie `201 Created`. Les nouvelles Sessions utilisent le nouveau jeton ; les Sessions déjà démarrées conservent l'identifiant qu'elles ont figé.

### Révoquer un Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Renvoie `204 No Content` et passe `status` à `disabled`. Les connexions qui utilisent ce Secret cessent de fonctionner pour les nouvelles Sessions et pour toute nouvelle entrée dans les Sessions existantes. La révocation est irréversible : créez un nouveau Secret et remplacez la connexion.

### Erreurs et nouvelles tentatives {#errors-and-retries}

Les erreurs utilisent l'[enveloppe d'erreur des Agents](/api-reference/errors#agents-platform-errors). Des champs invalides ou une clé d'idempotence manquante pour une écriture renvoient `400 invalid_request` ; un Secret inconnu ou inaccessible renvoie `404 not_found`. Une `row_version` obsolète, un état de cycle de vie incompatible ou la réutilisation d'une clé de création avec des données différentes renvoient `409 conflict`. Relisez le Secret avant de réessayer et utilisez une nouvelle clé pour chaque nouvelle écriture.

## Sécurité {#security}

- Créez et renouvelez les Secrets depuis un backend de confiance, jamais depuis du code exécuté dans le navigateur.
- Lisez les jetons depuis votre propre coffre de secrets ou votre environnement, comme `$GITHUB_MCP_TOKEN` ci-dessus, plutôt que de les coller dans des scripts.
- N'incluez pas de jetons dans les instructions, l'entrée de Session, les métadonnées ni les bundles de Skills.
- Révoquez un Secret dès que son jeton a pu fuiter, puis créez-en un nouveau et remplacez la connexion.

## Étapes suivantes {#next-steps}

- [Skills et outils MCP](/agents/mcp-tools)
- [API MCP Connections](/api-reference/mcp-connections/)
