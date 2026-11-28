---
i18nSource: 2ba7f0f41847d04f
title: Définir un Agent
description: "Créez et mettez à jour un Agent versionné avec l'API Agents : champs, limites, versions et archivage."
---

# Définir un Agent {#define-an-agent}

Créez un Agent avec `POST /v1/agents`. L'API suit le protocole OpenAI Agents : vous pouvez donc utiliser du HTTP simple ou `client.beta.agents` du SDK OpenAI avec `base_url="https://api.sandbase.ai/v1"`. L'en-tête `OpenAI-Beta` est facultatif ; si vous l'envoyez, il doit valoir `agents=v1`. Consultez [Compatibilité OpenAI](/agents/openai-compatibility) pour savoir ce que le SDK prend en charge.

## Créer un Agent {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

La réponse est `201 Created` avec l'Agent : un ID `agt_`, `version: 1`, `row_version`, `status: "active"` et `projection_status`. Une nouvelle version est préparée pour l'exécution en arrière-plan ; démarrez des Sessions dès que `projection_status` vaut `ready`.

`Idempotency-Key` est facultatif. Si vous l'omettez, le service en génère un ; une requête réessayée peut alors créer un second Agent. Envoyez votre propre clé stable lorsque vous réessayez.

## Champs {#fields}

Le corps est du JSON strict (1 MiB au maximum). Les champs inconnus renvoient 400.

| Champ | Obligatoire | Limites et valeurs |
|---|---|---|
| `model` | Oui | ID de modèle, 200 caractères au maximum |
| `name` | Non | 128 caractères au maximum |
| `instructions` | Non | 256 KiB au maximum |
| `description` | Non | 4096 caractères au maximum |
| `runtime_profile` | Non | `codex` (par défaut), `claude` ou `mcode` |
| `skills` | Non | 32 références au maximum. Une nouvelle liaison avec `version: null` fige la version par défaut actuelle lors de l'enregistrement ; les liaisons existantes conservent leur version figée. Indiquez une version explicite pour mettre à niveau ; consultez [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | Non | 32 références au maximum ; consultez [Connexions MCP](/agents/mcp-tools#mcp-connections) |
| `tools` | Non | Jusqu'à 64 outils `function` et au plus un outil `web_search` |
| `text` | Non | `format.type` `text` ou `json_schema` (schéma de type object) ; `verbosity` `low`, `medium` ou `high` |
| `reasoning` | Non | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh` ou `max` ; `summary` `concise`, `detailed` ou `auto` |
| `service_tier` | Non | `auto` (par défaut), `default`, `flex`, `priority` ou `fast` |
| `metadata` | Non | Jusqu'à 16 paires de chaînes ; clés de 64 caractères et valeurs de 512 caractères au maximum |
| `note` | Non | Note de modification enregistrée sur la version |

## Limites actuelles {#current-limits}

- `web_search` doit utiliser `"mode": "disabled"` pour que les Sessions puissent démarrer.
- Les outils `function` peuvent être enregistrés, mais les Runs qui exigent que le client renvoie un résultat d'outil (`requires_action`) ne sont pas encore pris en charge. Une Session dans cet état renvoie `502 executor_contract_error`. Donnez plutôt des capacités externes à l'Agent via des [connexions MCP](/agents/mcp-tools#mcp-connections).
- `multi_agent` doit être omis ou `null`.

## Mettre à jour un Agent {#update-an-agent}

Il existe deux formes de mise à jour. Les deux créent une nouvelle version.

- `POST /v1/agents/{agent_id}` est la mise à jour du SDK OpenAI. Envoyez uniquement les champs à modifier. Aucun `row_version` n'est nécessaire : la dernière écriture l'emporte. `description` et `note` ne sont pas acceptés sous cette forme.
- `PATCH /v1/agents/{agent_id}` est la mise à jour compare-and-set. Elle exige le `row_version` que vous avez lu en dernier et renvoie 409 si l'Agent a changé entre-temps. Les valeurs `null` explicites sont refusées.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Versions, archivage et restauration {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` liste les instantanés immuables ; `GET /v1/agents/{agent_id}/versions/{version}` en lit un.
- `POST /v1/agents/{agent_id}/restore` avec `{"source_version": 1, "row_version": 3}` copie une configuration antérieure dans une nouvelle version actuelle.
- `POST /v1/agents/{agent_id}/archive` et `/unarchive` prennent `{"row_version": …}`. Les Agents archivés ne peuvent pas démarrer de nouvelles Sessions.
- `DELETE /v1/agents/{agent_id}` archive l'Agent. Les Agents ne sont jamais supprimés définitivement.

## Étapes suivantes {#next-steps}

- [Skills et outils MCP](/agents/mcp-tools)
- [Exécuter l'Agent dans une Session](/agents/sessions)
- [Référence de l'API Agents](/api-reference/agents/)
