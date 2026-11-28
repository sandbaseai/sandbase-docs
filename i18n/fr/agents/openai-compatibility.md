---
i18nSource: d637409019c8109d
title: Compatibilité OpenAI
description: Utilisez le SDK officiel OpenAI avec les Agents, Sessions et Skills de SandBase, et découvrez en quoi SandBase diffère de l'OpenAI Agents API.
---

# Compatibilité OpenAI {#openai-compatibility}

Les Agents SandBase implémentent le protocole de l'[OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) pour les Agents, les Sessions, les événements de session, les items, les turns et les Skills. Pour ces ressources, vous pouvez utiliser directement le SDK officiel OpenAI : faites pointer `base_url` vers `https://api.sandbase.ai/v1` et transmettez une clé API SandBase.

Les connexions MCP, les Secrets et les catalogues sont des ressources propres à SandBase. Le SDK ne propose pas de méthodes pour elles ; appelez-les donc en HTTP (ou avec les méthodes génériques `client.post` / `client.get` du SDK).

Versions du SDK vérifiées :

| SDK | Versions | Remarques |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` et `sessions.traces` n'existent pas dans la 3.13.0 |
| openai-node | 7.28.0 (Node.js 26) | Utilisez un dispatcher HTTP/1.1 pour le streaming, voir [ci-dessous](#node-js-and-http-2) |

## Configurer le client {#set-up-the-client}

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],  # your SandBase API key
    base_url="https://api.sandbase.ai/v1",
)
```

```js [Node.js]
// npm install openai@7.28.0 undici
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY, // your SandBase API key
  baseURL: 'https://api.sandbase.ai/v1',
  // HTTP/1.1 keeps the live event stream and the input request on separate connections.
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})
```

:::

Le SDK envoie automatiquement `OpenAI-Beta: agents=v1`. SandBase accepte cette valeur, ou l'absence d'en-tête ; toute autre valeur renvoie `400`.

## Exécuter un Agent de bout en bout {#run-an-agent-end-to-end}

Créez un Agent, créez une Session, ouvrez le flux d'événements en direct, envoyez une entrée et lisez l'historique. Le flux est uniquement en direct : ouvrez-le avant d'envoyer l'entrée.

::: code-group

```python [Python]
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")

agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Keep output brief.",
    metadata={"team": "research"},
)
session = client.beta.agents.sessions.create(
    agent_id=agent.id,
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "Reply with exactly: ok"}]}],
        }],
        idempotency_key="research-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break

for item in client.beta.agents.sessions.items.list(session.id, order="asc", limit=100).data:
    print(item.type, getattr(item, "role", None))

# Clean up: both calls archive the resource.
client.beta.agents.sessions.delete(session.id)
client.beta.agents.delete(agent.id)
```

```js [Node.js]
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})

const agent = await client.beta.agents.create({
  model: 'deepseek/deepseek-v4-flash',
  name: 'Research assistant',
  instructions: 'Keep output brief.',
  metadata: { team: 'research' },
})
const session = await client.beta.agents.sessions.create({
  agent_id: agent.id,
  environment: { type: 'openai_hosted' }, // Required by the SDK types; SandBase always runs in its hosted cloud.
})

const stream = await client.beta.agents.sessions.events.stream(session.id)
const done = (async () => {
  for await (const event of stream) {
    console.log(event.type)
    if (/^agent\.session\.turn\.(completed|failed|cancelled)$/.test(event.type)) break
  }
})()

await client.beta.agents.sessions.events.create(session.id, {
  events: [{ type: 'agent.session.input.message', input: 'Reply with exactly: ok' }],
  'Idempotency-Key': 'research-input-1',
})
await done

const items = await client.beta.agents.sessions.items.list(session.id, { order: 'asc', limit: 100 })
for (const item of items.data) console.log(item.type, item.role)

// Clean up: both calls archive the resource.
await client.beta.agents.sessions.delete(session.id)
await client.beta.agents.delete(agent.id)
```

:::

`events.create` renvoie `202` sans corps. Chaque requête transporte exactement un événement. Réutiliser la même `Idempotency-Key` avec le même corps ne démarre pas de second turn. Pour arrêter le turn en cours, envoyez `{"type": "agent.session.input.cancel"}` comme unique événement.

### Node.js et HTTP/2 {#node-js-and-http-2}

Le `fetch` de Node.js 26 peut négocier HTTP/2 avec l'API SandBase. Dans ce cas, sur une connexion HTTP/2 partagée, `events.create` peut rester bloqué tant que `events.stream` est ouvert sur la même connexion, jusqu'à la fermeture du flux. Le dispatcher `undici` avec `allowH2: false` ci-dessus évite ce problème. Le SDK Python utilise HTTP/1.1 par défaut et ne nécessite aucune modification.

## Skills avec le SDK {#skills-with-the-sdk}

`client.skills` fonctionne comme chez OpenAI, sauf que la suppression d'une seule version de Skill n'est pas disponible. Le ZIP doit contenir un unique dossier de premier niveau contenant `SKILL.md` (`zip -r release-notes.zip release-notes/`). Un `SKILL.md` à la racine du ZIP renvoie `400 invalid_request`.

::: code-group

```python [Python]
with open("release-notes.zip", "rb") as bundle:
    skill = client.skills.create(files=[("release-notes.zip", bundle.read(), "application/zip")])
print(skill.id, skill.default_version)

zip_bytes = client.skills.content.retrieve(skill.id).read()
```

```js [Node.js]
import fs from 'node:fs'

const skill = await client.skills.create({ files: fs.createReadStream('release-notes.zip') })
console.log(skill.id, skill.default_version)

const zip = Buffer.from(await (await client.skills.content.retrieve(skill.id)).arrayBuffer())
```

:::

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` et `skills.delete` fonctionnent également. Un Skill référencé par une version d'Agent ne peut pas être supprimé (`409`) ; définissez plutôt `status` sur `disabled` avec Update Skill.

## Connexions MCP avec le SDK {#mcp-connections-with-the-sdk}

OpenAI déclare les serveurs MCP en ligne avec `tools: [{"type": "mcp", ...}]`. SandBase renvoie `400` pour cette forme. Enregistrez le serveur une fois avec [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) et référencez-le dans le champ `mcp_connections` de l'Agent. Les méthodes de requête génériques et les champs de corps supplémentaires du SDK couvrent ces deux étapes :

::: code-group

```python [Python]
import uuid

connection = client.post(
    "/mcp-connections",
    cast_to=object,
    body={"name": "DeepWiki", "server_url": "https://mcp.deepwiki.com/mcp"},
    options={"headers": {"Idempotency-Key": str(uuid.uuid4())}},  # Use a new key per create; reusing one returns the original (possibly disabled) connection.
)
agent = client.beta.agents.update(
    agent.id,
    extra_body={"mcp_connections": [
        {"connection_id": connection["id"], "server_label": "deepwiki", "allowed_tools": None, "required": False},
    ]},
)
```

```js [Node.js]
const connection = await client.post('/mcp-connections', {
  body: { name: 'DeepWiki', server_url: 'https://mcp.deepwiki.com/mcp' },
  headers: { 'Idempotency-Key': crypto.randomUUID() }, // Use a new key per create; reusing one returns the original (possibly disabled) connection.
})
await client.beta.agents.update(agent.id, {
  mcp_connections: [
    { connection_id: connection.id, server_label: 'deepwiki', allowed_tools: null, required: false },
  ],
})
```

:::

L'appel Node.js transmet `mcp_connections` en JavaScript simple ; en TypeScript, ce champ ne fait pas partie des types du SDK. Les jetons Bearer des serveurs MCP sont stockés sous forme de [Secrets](/agents/api-credentials), et non de vaults OpenAI.

## Environnement d'exécution {#execution-environment}

SandBase exécute chaque Session dans son cloud hébergé ; il n'y a aucun environnement à choisir ni à gérer.

- Les appels HTTP directs omettent `environment`.
- Le SDK OpenAI exige un argument `environment` dans `sessions.create` (Python lève `TypeError` sans lui, et les types Node.js le rendent obligatoire). Transmettez `{"type": "openai_hosted"}` ; SandBase l'accepte. Toute autre valeur, comme `self_hosted`, renvoie `400`.
- Les réponses de Session incluent un objet `environment` pour la compatibilité avec le SDK. Vous n'avez pas besoin de le lire ni d'en tenir compte.

## La compatibilité en un coup d'œil {#compatibility-at-a-glance}

| Domaine | Statut | Détails |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Compatible, avec extensions | Les réponses ajoutent `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections`, etc. `delete` archive l'Agent et renvoie `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Compatible, avec limites | Accepte un `agent_id` enregistré, un `agent` en ligne, ou les deux ; `agent` accepte `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` et `multi_agent`. `stream=True` diffuse le premier turn et nécessite un `input` initial. `update` n'accepte que `metadata`. `delete` archive la Session. |
| `sessions.events.stream` | Compatible | Uniquement en direct, comme chez OpenAI. `Last-Event-ID` ou `?after=` renvoie `400`. |
| `sessions.events.create` | Compatible, avec limites | Exactement un événement `agent.session.input.message` ou `agent.session.input.cancel` par requête ; le message comporte une seule partie utilisateur `input_text` ou une simple chaîne. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Compatible | Pagination par curseur avec `limit` de 1 à 100, `after`, `order`. |
| `client.skills` et `skills.versions` | Compatible, sauf la suppression de version | `skills.versions.delete` renvoie `404`. |
| Enveloppe d'erreur | Compatible | `{"error": {"type", "code", "param", "message"}}` ; les exceptions du SDK l'exposent dans `exc.body`. |
| Versions d'Agent, restore, archive, catalogue, rename/archive/reconnect/files/workspace-files/artifacts de Session | SandBase uniquement | Consultez la référence de l'API [Agents](/api-reference/agents/) et [Sessions](/api-reference/sessions/). |
| Connexions MCP, Secrets | SandBase uniquement | Utilisez HTTP ou `client.post` / `client.get`. |

SandBase expose en HTTP la [liste des artefacts](/api-reference/sessions/list-artifacts) et le [téléchargement de leur contenu](/api-reference/sessions/download-artifact). Les ID d'artefact sont opaques et propres à chaque Session. Cela n'implique pas la prise en charge de toutes les méthodes d'artefact du SDK ; aucun endpoint distinct de métadonnées d'artefact n'est exposé.

### Non pris en charge {#not-supported}

Ces appels du SDK OpenAI échouent avec SandBase. Le message indiqué est le `error.message` réellement renvoyé.

| Appel SDK | Résultat |
|---|---|
| `sessions.create(..., stream=True)` sans `input` initial | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400` : `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` avec un champ autre que `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` et `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 n'a pas de paramètre `agent` et lève `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400` : `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])` ; outils `tool_search`, `programmatic_tool_calling` et `computer_use` | `400 invalid_request`. Seuls les outils `function` et un unique outil `web_search` sont acceptés |
| `events.create` avec un événement `tool_result` ou d'approbation computer-use | `400 invalid_request`. Les Sessions qui atteignent `requires_action` ne sont pas prises en charge |
| `events.create` avec plus d'un événement | `400` : `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 n'a pas `traces`) |
| `beta.agents.vaults` | `404` avec un corps en texte brut (`404 page not found`), et non l'enveloppe d'erreur JSON |
| `skills.versions.delete` | `404 not_found` |

### Différences de champs {#field-differences}

- Les Sessions signalent les échecs dans `failure` (`{code, message, action, retryable?}`), et non dans le champ `error` d'OpenAI. Avec le SDK, `session.error` vaut `None` ; lisez plutôt `session.failure`.
- `required_actions` et `vault_ids` sont toujours des tableaux vides.
- Les horodatages des Agents et des Sessions sont en secondes Unix. Le `created_at` des versions d'Agent, les connexions MCP et les Secrets utilisent des chaînes ISO 8601.
- `402 spending_limit_exceeded` n'a pas de classe d'exception dédiée dans le SDK ; il apparaît comme une `APIStatusError` générique.
- Une méthode non prise en charge sur un chemin connu (par exemple `PUT` sur `/v1/agents`) renvoie `404` avec l'enveloppe d'erreur JSON, et non `405`.

## Étapes suivantes {#next-steps}

- [Sessions](/agents/sessions)
- [Skills et outils MCP](/agents/mcp-tools)
- [Référence de l'API Agents](/api-reference/agents/)
