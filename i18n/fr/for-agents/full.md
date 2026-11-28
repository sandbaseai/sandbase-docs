---
i18nSource: e566962f42a5f6b0
title: Guide de l'API SandBase pour l'IA
description: Guide étendu de l'API SandBase pour les agents d'IA, avec les workflows principaux, des exemples de requêtes et des liens vers la spécification OpenAPI de référence.
---

# Guide de l'API pour l'IA {#ai-api-guide}

::: info Contrat de Session
Une Session (`ses_*`) exécute une version enregistrée d'un Agent et se crée directement avec `POST /v1/agents/sessions`. Les IDs internes de Runtime Session ne sont pas exposés.
:::

> Un guide sur une seule page des workflows d'API les plus courants. Pour le contrat complet lisible par machine, utilisez la [spécification OpenAPI](https://www.sandbase.ai/docs/openapi.yaml). Version texte brut : [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Authentification {#authentication}

Toutes les requêtes exigent :

```
Authorization: Bearer sk-YOUR_KEY
```

URL de base : `https://api.sandbase.ai/v1`

---

## Terminologie {#terminology}

| Terme | Signification |
|------|---------|
| **Task** | Un enregistrement d'exécution facturable pour des opérations comme l'inférence de modèle. Toutes les opérations d'API n'en créent pas. |
| **Run** | Une requête de génération de média via `POST /v1/run`. Peut être synchrone ou asynchrone. Interrogez-la avec `GET /v1/run/{id}`. |
| **Session** | Une exécution d'Agent via `POST /v1/agents/sessions`, qui contient la conversation, l'activité des outils et la sortie. Interrogez-la avec `GET /v1/agents/sessions/{session_id}`. |
> **run ou session** : un « run » de modèle (`/v1/run`) est une tâche de génération de modèle. Une « Session » (`/v1/agents/sessions`) est une exécution d'Agent. Tous les IDs sont opaques et ne doivent pas être analysés.
>
> **task ou run** : un « run » ou une « session » est la requête que vous effectuez ; une « task » est un enregistrement d'exécution facturable. Utilisez
> `GET /v1/tasks/{task_id}/cost` lorsqu'une opération renvoie un ID de tâche. Toutes les opérations d'API ne créent pas de tâche.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

Compatible OpenAI. La prise en charge du streaming, des outils, de la vision, du raisonnement et de la sortie structurée dépend du modèle sélectionné et de son schéma déclaré.

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in one paragraph."}
    ],
    "temperature": 0.7,
    "max_tokens": 500,
    "stream": false
  }'
```

**Réponse :**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "openai/gpt-5.6-luna",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing leverages quantum mechanical phenomena..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113
  }
}
```

> Certaines opérations facturables peuvent renvoyer `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc` ; s'il est présent, utilisez-le pour interroger
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

API Messages compatible Anthropic. Le cache et les autres fonctionnalités facultatives dépendent du modèle sélectionné et du schéma de la requête.

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is SandBase?"}]
  }'
```

**Réponse :**

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "SandBase is an AI agent infrastructure platform..." }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 12, "output_tokens": 64 }
}
```

---

## Génération d'images {#image-generation}

### POST /v1/run {#post-v1-run}

L'endpoint `/v1/run` est un **endpoint de génération unifié** : le champ `model` détermine le type de sortie (image, vidéo ou audio).

> **Comment traiter la réponse :** vérifiez le champ `status`.
> - `"completed"` → les résultats sont dans `outputs`, c'est terminé.
> - `"pending"` ou `"running"` → interrogez `GET /v1/run/{id}` toutes les 2 à 5 s jusqu'à un statut terminal (`completed`, `failed` ou `timeout`).

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bfl/flux-2/flash",
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "aspect_ratio": "1:1"
  }'
```

**Réponse (synchrone) :**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "model": "bfl/flux-2/flash",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/f3d2e8a1-7c4b-4a12-9d2e-123456789abc.png",
    "content_type": "image/png",
    "width": 1024,
    "height": 1024
  }]
}
```

---

## Génération de vidéos {#video-generation}

### POST /v1/run {#post-v1-run-1}

Vérifiez l'`execution_mode` du modèle sélectionné. Lorsque la soumission renvoie `pending` ou `running`, interrogez `GET /v1/run/{id}` jusqu'à un statut terminal.

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kwaivgi/kling-video/v3/standard/text-to-video",
    "prompt": "A drone flying over mountains at golden hour",
    "duration": 5
  }'
```

**Réponse (asynchrone, initiale) :**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Interroger le statut : `GET /v1/run/{id}`**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "completed",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/6a7b9c10-2d3e-4f50-8a61-23456789abcd.mp4",
    "content_type": "video/mp4",
    "duration": 5
  }]
}
```

---

## Audio (synthèse vocale) {#audio-text-to-speech}

### POST /v1/run {#post-v1-run-2}

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seed-speech/tts/2.0",
    "text": "Hello world, this is a test of text to speech."
  }'
```

**Réponse :**

```json
{
  "id": "7b8c0d21-3e4f-5061-9b72-3456789abcde",
  "status": "completed",
  "model": "bytedance/seed-speech/tts/2.0",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/7b8c0d21-3e4f-5061-9b72-3456789abcde.mp3",
    "content_type": "audio/mpeg",
    "duration_seconds": 3.2
  }]
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- DISCOVERY APIs                                           -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Lister les modèles {#list-models}

### GET /v1/models {#get-v1-models}

Renvoie les modèles logiques activés au format de liste de modèles compatible OpenAI. L'endpoint n'est pas paginé et
utilise `type=llm` par défaut. Les capacités détaillées et les tarifs sont volontairement omis.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

La réponse contient `object: "list"` et un tableau `data`. Chaque élément contient `id`, `object`, `created` et
`owned_by` ; utilisez `id` comme nom logique du modèle. Récupérez ce modèle pour obtenir les métadonnées de capacités et de tarifs.

---

## Récupérer un modèle {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

La réponse détaillée ajoute `unified_schema`, `supported_modes` et `model_card`. Les prix détaillés se trouvent dans
`model_card` ; il n'existe pas d'objet `pricing` de premier niveau.

---

## Obtenir le coût d'une tâche {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

Consultez le coût enregistré d'une tâche à l'aide de l'ID de tâche renvoyé par l'opération d'API.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Réponse :**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "settled": true,
  "currency": "USD",
  "cost": "0.000325",
  "estimated_cost": "0.000325",
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113,
    "cached_tokens": 0,
    "cache_creation_tokens": 0,
    "reasoning_tokens": 0
  }
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- PLATFORM APIs                                            -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Conventions de la plateforme Agents {#agents-platform-conventions}

- URL de base `https://api.sandbase.ai/v1`. Envoyez `Authorization: Bearer sk-YOUR_KEY` ou `X-API-Key: sk-YOUR_KEY` (même valeur si les deux sont présents). `OpenAI-Beta` est facultatif ; s'il est envoyé, il doit valoir `agents=v1`. Le SDK OpenAI officiel (`client.beta.agents`, `client.skills`) fonctionne avec `base_url="https://api.sandbase.ai/v1"` ; les différences sont listées dans [Compatibilité OpenAI](/agents/openai-compatibility).

- Les corps sont du JSON strict de 1 MiB au maximum ; les champs inconnus renvoient 400.

- Erreurs : `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Basez votre logique sur `code` ; consultez le [guide des erreurs](./errors#agents-platform-errors).

- `row_version` est le jeton de compare-and-set pour PATCH, archive, restore et rotate. En cas de 409, relisez la ressource.

- Listes à curseur (Agents, Sessions, items, turns, Skills) : `limit` 1-100, `after`, `order` ; réponse `{object:"list", data, has_more, first_id, last_id}`.

- Listes à offset (versions d'Agent, pièces jointes, connexions MCP, Secrets) : `limit`, `offset` ; réponse `{data, total, limit, offset}`.

- IDs : Agent `agt_`, Session `ses_`, Skill `skl_`, connexion MCP `mcp_`, Secret `sec_`, pièce jointe `fil_`. Traitez-les comme opaques.

---

## Agents {#agents}

### POST /v1/agents — Créer un Agent {#post-v1-agents-—-create-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question and cite sources."
  }'
```

Obligatoire : `model`. Facultatifs : `name`, `instructions`, `description`, `runtime_profile` (`codex` par défaut, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Renvoie `201` avec `id` (`agt_`), `version`, `row_version`, `status` et `projection_status` ; démarrez les Sessions lorsque `projection_status` vaut `ready`. Les outils `web_search` doivent utiliser `mode: "disabled"`, et les résultats de fonctions côté client (`requires_action`) ne sont pas pris en charge.

### GET /v1/agents — Lister les Agents {#get-v1-agents-—-list-agents}

Paramètre de requête `status` (`active` par défaut, `archived`, `all`) plus pagination par curseur.

### GET /v1/agents/{agent_id} — Récupérer un Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Mettre à jour un Agent (style SDK) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

Mise à jour partielle de `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. Pas de `row_version` ; crée une nouvelle version.

### PATCH /v1/agents/{agent_id} — Mettre à jour un Agent (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Mêmes champs, plus `description` et `note` ; `row_version` est obligatoire. Un `null` explicite renvoie 400.

### Versions, archivage, restauration, catalogue {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` et `GET /v1/agents/{agent_id}/versions/{version}` lisent des instantanés immuables.

- `POST /v1/agents/{agent_id}/archive` et `POST /v1/agents/{agent_id}/unarchive` reçoivent `{"row_version"}`. `DELETE /v1/agents/{agent_id}` archive également.

- `POST /v1/agents/{agent_id}/restore` reçoit `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` liste les Agents publics ; `POST /v1/agents/catalog/{agent_id}/clone` en copie un dans votre organisation (`201`, nouvel `agt_`).

---

## Sessions {#sessions}

Une Session exécute une version enregistrée d'un Agent. Les chemins se trouvent sous `/v1/agents/sessions`. La version de l'Agent, les versions des Skills et les connexions MCP sont figées à la création.

### POST /v1/agents/sessions — Créer une Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Envoyez `agent_id` (Agent enregistré), `agent` (Agent inline ou surcharges par Session de `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` et `multi_agent`), ou les deux. Facultatifs : `version` (Agents enregistrés uniquement), `title`, `input` (une chaîne, ou un tableau contenant exactement un message utilisateur avec une seule partie `input_text`), `model` ou `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}` ; s'il est omis, c'est votre clé d'appel qui est utilisée). `stream: true` avec un `input` non vide renvoie `201` sous forme de flux Server-Sent Events du premier tour, qui commence par `agent.session.created`. Les Sessions s'exécutent toujours dans le cloud hébergé de SandBase : il n'y a donc pas d'environnement à choisir ; le SDK OpenAI exige néanmoins `environment={"type": "openai_hosted"}`. Renvoie `201` avec `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) et `row_version`.

### GET /v1/agents/sessions/{session_id}/events — Streamer les événements (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Uniquement en direct. Ouvrez-le avant d'envoyer une entrée. `Last-Event-ID` ou `after` renvoie 400 ; les événements ne sont pas rejoués. Les valeurs de `type` des événements commencent par `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — Envoyer une entrée {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Exactement un événement par requête : `agent.session.input.message` ou `agent.session.input.cancel`. Renvoie `202` sans corps. Forme étendue : `{"input": "...", "file_ids": ["fil_..."]}` (jusqu'à 10 pièces jointes prêtes). `409 session_input_pending` signifie qu'une entrée précédente est encore en cours de livraison ; patientez et ne la renvoyez pas avec une nouvelle clé.

### Historique et autres opérations sur les Sessions {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (paramètres de requête `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns` et `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` lisent l'historique.

- `POST /v1/agents/sessions/{session_id}` remplace `metadata` ; `PATCH /v1/agents/sessions/{session_id}` renomme avec `{"title","row_version"}`.

- `POST /v1/agents/sessions/{session_id}/cancel` (exige `Idempotency-Key`) annule le tour en cours.

- `DELETE /v1/agents/sessions/{session_id}` archive ; `POST /v1/agents/sessions/{session_id}/unarchive` restaure.

- `POST /v1/agents/sessions/{session_id}/files` téléverse une pièce jointe (`file` en multipart, 5 MiB, `Idempotency-Key` obligatoire).

- `POST /v1/agents/sessions/{session_id}/reconnect` renvoie `stream_url` pour `GET /v1/agents/sessions/{session_id}/events/stream`, qui envoie `session.snapshot` puis les événements en direct.

---

### Fichiers de l'espace de travail et artefacts de sortie {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` liste les métadonnées des fichiers actuels sous `path` (`/workspace` par défaut). Paramètres de requête `limit` (1-100, 20 par défaut), `order` (`asc` par défaut ou `desc`) et `page` (le curseur `next` précédent). Renvoie `{object:"page", data:[{path,size_bytes}], next, has_more}`. Un curseur invalide oblige à recommencer à la première page.
- `GET /v1/agents/sessions/{session_id}/artifacts` liste les sorties immuables capturées sous `/workspace/outputs/`. Paramètres de requête `limit` (20 par défaut), `order` (`desc` par défaut) et `after` (utilisez `last_id` lorsque `has_more` vaut true).
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` télécharge un artefact complet à l'aide de son ID opaque `art_` renvoyé. Les téléchargements sont limités à 200 MiB ; `Range` n'est pas pris en charge (`416`). Les métadonnées de l'espace de travail, les pièces jointes téléversées et les artefacts capturés sont des ressources distinctes.

---

## Skills, connexions MCP et Secrets {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Créer un Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Une seule partie ZIP `files` (5 MiB). Le ZIP doit contenir un seul dossier de premier niveau contenant `SKILL.md` (frontmatter `name` et `description`), par exemple `zip -r release-notes.zip release-notes/` ; un `SKILL.md` à la racine du ZIP renvoie `400 invalid_request`. Un Skill référencé par une version d'Agent (y compris d'Agents archivés) ne peut pas être supprimé (`409`) ; désactivez-le plutôt avec `POST /v1/skills/{skill_id}` et `{"status": "disabled"}`. Renvoie `201` avec `id` (`skl_`) et `default_version`. Ajoutez des versions avec `POST /v1/skills/{skill_id}/versions` ; listez avec `GET /v1/skills`. Référencez-le depuis un Agent sous la forme `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — Enregistrer un serveur MCP {#post-v1-mcp-connections-—-register-an-mcp-server}

Corps `{"name", "server_url" (HTTPS), "secret_id"?}` ; `Idempotency-Key` obligatoire. Référencez-la dans les `mcp_connections` d'un Agent. La désactiver bloque les nouvelles Sessions et les nouvelles entrées.

### POST /v1/secrets — Stocker un jeton Bearer MCP {#post-v1-secrets-—-store-an-mcp-bearer-token}

Corps `{"name", "kind": "mcp_bearer", "server_url", "token"}` ; `Idempotency-Key` obligatoire. Le jeton est en écriture seule et lié à cette URL exacte. Les Secrets ne sont pas des variables d'environnement. Renouvelez avec `POST /v1/secrets/{secret_id}/rotate` ; révoquez avec `DELETE /v1/secrets/{secret_id}` (204).

---

## Facturation et coûts {#billing-cost}

### Calcul des coûts {#how-costs-are-calculated}

- Lisez la formule de tarification actuelle et les unités du modèle sélectionné dans son `model_card`.
- Les modèles tarifés au token peuvent inclure des composantes d'entrée, de sortie, de cache ou de raisonnement lorsqu'elles sont déclarées.
- Les modèles de médias et les autres modèles peuvent utiliser des unités par requête, par durée, par résolution ou d'autres unités propres au modèle.
- Les API de données (recherche, réseaux sociaux, scraping, e-commerce, finance) incluent 100 appels gratuits par organisation et par jour UTC, partagés entre les API de données éligibles et réinitialisés à 00:00 UTC. Les appels suivants sont facturés à l'appel ; ils ne sont pas rejetés. Les organisations dont le solde est nul peuvent quand même utiliser les appels gratuits.
- Non éligibles : les LLM, les modèles de médias et les API de données plus coûteuses ou tarifées par formule (par exemple certains endpoints batch, crawl, Xiaohongshu PGY et les routes Douyin Xingtu `kol-*`), qui sont facturés dès le premier appel. Pour vérifier, consultez `pricing.free_quota` dans `sandbase_inspect`.
- MCP : `sandbase_inspect` affiche `pricing.free_quota` sur les outils éligibles ; `sandbase_account` renvoie `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`) ; les résultats réglés de `sandbase_run` et `sandbase_run_get` incluent `free_quota_status` (`free`, `overage` ou `degraded`).
- Lorsqu'une opération facturable renvoie un ID de tâche (y compris via l'en-tête de réponse `x-task-id`), utilisez `GET /v1/tasks/{task_id}/cost` pour le règlement et l'utilisation.
- Pour les réponses asynchrones de `POST /v1/run`, interrogez le résultat de la génération avec `GET /v1/run/{id}` ; un ID de run n'est pas un ID de tâche et ne doit pas être envoyé à l'endpoint de coût.

### Contrôle du budget {#budget-control}

- Définissez une limite de dépenses facultative lors de la création ou de la modification d'une clé standard sous [Developer → API Keys](https://www.sandbase.ai/console/keys).
- Surveillez les requêtes et les coûts sous **Developer → Activities → Usage**.
- Consultez le solde et les transactions de crédits sous [Developer → Billing](https://www.sandbase.ai/console/billing).

---

## Voir aussi {#see-also}

- [Modèles et tarifs](./models) : découverte des modèles en direct, capacités et informations tarifaires
- [Guide des erreurs](./errors) : formes de réponse documentées, gestion HTTP et sécurité des nouvelles tentatives
- [Spécification OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) : schéma lisible par machine


## Liaisons de version des Skills d'un Agent {#agent-skill-version-bindings}

L'enregistrement d'un Agent épingle chaque nouvelle référence de Skill à une version explicite. Pour une nouvelle liaison, `version: null` sélectionne la version par défaut au moment de l'enregistrement. Pour une liaison existante, `version: null` conserve la version épinglée. Modifier la version par défaut d'un Skill ne met pas à jour les Agents enregistrés ni les Sessions existantes ; enregistrez une version explicite sur l'Agent pour mettre à jour les futures Sessions.
