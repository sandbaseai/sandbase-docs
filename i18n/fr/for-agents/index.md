---
i18nSource: 0314b37a870481ae
title: Documentation lisible par l'IA
description: Tout ce dont un agent IA a besoin pour découvrir et utiliser l'API SandBase, résumé sur une page.
---

# Présentation de l'API adaptée à l'IA {#ai-friendly-api-overview}

::: info Contrat des Sessions
Une Session (`ses_*`) exécute une version enregistrée d'un Agent ; créez-la directement avec `POST /v1/agents/sessions`. Les instances de runtime restent internes et ne sont jamais renvoyées.
:::

> Une référence concise destinée aussi bien aux humains qu'aux agents IA. Pour des versions en texte brut optimisées pour l'ingestion par des LLM, consultez [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## Qu'est-ce que SandBase ? {#what-is-sandbase}

SandBase est une plateforme d'infrastructure pour agents IA. Une seule clé API donne accès aux Models et API activés couvrant le langage, l'image, la vidéo, l'audio, la recherche et les données, ainsi qu'aux workflows d'Agents. Découvrez le catalogue actuel plutôt que de vous fier à un nombre fixe.

## URL de base de l'API {#api-base-url}

```
https://api.sandbase.ai/v1
```

## Authentification {#authentication}

Toutes les requêtes exigent un jeton Bearer :

```
Authorization: Bearer sk-YOUR_KEY
```

Obtenez votre clé dans [Developer → API Keys](https://www.sandbase.ai/console/keys).

## Exemple rapide {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## API principales {#core-apis}

| Méthode | Route | Description |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | Chat compatible OpenAI ; les capacités facultatives dépendent du modèle sélectionné |
| `POST` | `/v1/messages` | API Messages compatible Anthropic |
| `POST` | `/v1/run` | Soumettre une génération de modèle selon le schéma propre au modèle |
| `GET` | `/v1/run/{id}` | Interroger le statut d'une génération asynchrone et récupérer les résultats |
| `GET` | `/v1/models` | Lister les modèles logiques activés ; type LLM par défaut |
| `GET` | `/v1/models/{id_or_name}` | Obtenir les détails, le schéma, les capacités et les tarifs d'un modèle |
| `GET` | `/v1/tasks/{task_id}/cost` | Obtenir le coût et l'utilisation d'une tâche |

## Autres groupes d'API {#additional-api-groups}

Au-delà des API de génération principales, SandBase fournit des API de gestion du cycle de vie des agents. Consultez le [Guide de l'API pour l'IA](./full) pour les workflows courants et la [spécification OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) pour le contrat complet.

| Groupe | Routes principales | Objet |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Créer et versionner des définitions d'Agents enregistrées |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Exécuter un Agent, envoyer des entrées et diffuser les événements en direct |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Bundles d'instructions versionnés que les Agents montent |
| **MCP Connections et Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Outils MCP HTTPS distants et leurs jetons Bearer en écriture seule |

Les ressources de la plateforme Agents acceptent `Authorization: Bearer` ou `X-API-Key` et renvoient `{"error":{"type","code","param","message"}}` en cas d'échec.

## Modèle de tarification {#pricing-model}

Paiement à l'usage. La tarification est propre à chaque modèle et peut évoluer indépendamment de cette page :

- **Tarification des modèles** : lisez la formule et les unités actuelles du modèle sélectionné dans `model_card`
- **Tarification des tokens** : peut inclure des composantes d'entrée, de sortie, de cache ou de raisonnement lorsque le modèle les déclare
- **Médias et autres opérations** : peuvent utiliser des unités par requête, par durée, par résolution ou d'autres unités propres au modèle
- **API de données** (recherche, réseaux sociaux, scraping, e-commerce, finance) : chaque organisation dispose de 100 appels gratuits par jour UTC, partagés entre les API de données éligibles ; au-delà, les appels sont facturés à l'appel, et non bloqués. Dans MCP, les outils éligibles affichent `pricing.free_quota` dans `sandbase_inspect`, et `sandbase_account` renvoie `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`). Consultez [Appels d'API gratuits quotidiens](/guides/billing#daily-free-api-calls).

Découvrez l'ID de modèle actuel avec `GET /v1/models`, puis inspectez `GET /v1/models/{id_or_name}` avant d'envoyer une requête. Ne supposez pas que les tarifs ou les remises de cache sont identiques d'un fournisseur à l'autre.

Lorsqu'une opération renvoie un ID de tâche, inspectez son coût enregistré :

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Limites de débit {#rate-limits}

Il n'existe pas de valeur numérique par défaut universelle publiée. Les requêtes sont soumises à une limite facultative de requêtes par minute
attribuée à votre organisation et partagée par toutes ses clés API. Une réponse `429` n'inclut pas d'en-têtes de quota ni `Retry-After` ; utilisez un backoff
exponentiel borné avec jitter. Consultez le [Guide des erreurs](./errors).

---

## Pour aller plus loin {#further-reading}

- [Guide de l'API pour l'IA](./full) — workflows principaux, formes des requêtes et réponses, et exemples curl
- [Modèles et tarifs](./models) — découverte des modèles en direct, tarifs et recommandations sur les capacités
- [Guide des erreurs](./errors) — formes de réponse documentées, gestion HTTP et sécurité des nouvelles tentatives
- [Spécification OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — OpenAPI 3.1 lisible par machine

## Versions en texte brut (pour les agents IA) {#plain-text-versions-for-ai-agents}

| Fichier | URL | Contenu |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Résumé compact (~60 lignes) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Guide de l'API détaillé, orienté IA |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | Spécification OpenAPI 3.1 lisible par machine |
