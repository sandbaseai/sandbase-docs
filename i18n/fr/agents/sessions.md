---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: Exécutez un Agent dans une Session, suivez ses événements en streaming, lisez l'historique, joignez des fichiers et gérez les échecs.
---

# Sessions {#sessions}

Une **Session** exécute une version enregistrée d'Agent dans le cloud hébergé de SandBase ; vous ne choisissez pas d'environnement d'exécution. Son ID commence par `ses_`, et tous les chemins de Session se trouvent sous `/v1/agents/sessions`. La Session fige la version d'Agent, les versions de Skills et la configuration des connexions MCP avec lesquelles elle a démarré.

## Démarrage des Sessions {#how-sessions-start}

Créez une Session avec `POST /v1/agents/sessions`. La Session indique `source: "direct"`.

## Exécuter une Session {#run-a-session}

Le flux d'événements natif est **uniquement en direct** : les événements ne sont pas rejoués après une déconnexion. Ouvrez-le avant d'envoyer une entrée, et lisez l'historique à partir des items ou des turns.

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Le même flux avec le SDK Python officiel d'OpenAI. Ouvrez d'abord le flux, envoyez l'entrée depuis un autre thread et arrêtez-vous à l'événement final du turn. Consultez [Compatibilité OpenAI](/agents/openai-compatibility) pour la version Node.js et les différences du SDK.

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

Chaque envoi transporte exactement un événement. `input` est une chaîne de texte, ou un tableau contenant exactement un message utilisateur avec exactement une partie `input_text` : `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Toute autre forme renvoie `400 invalid_request`. Pour arrêter le turn en cours, envoyez `{"type": "agent.session.input.cancel"}` ou appelez `POST /v1/agents/sessions/{session_id}/cancel` avec une `Idempotency-Key`. L'annulation d'une Session inactive renvoie quand même `202 {"accepted": true}` et ne modifie rien. Vous pouvez aussi transmettre un premier `input` lors de la création de la Session. `stream: true` à la création n'est pas pris en charge.

## Statut et échecs {#status-and-failures}

| Champ | Valeurs | Signification |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | État d'exécution de la Session |
| `lifecycle_status` | `active`, `archived` | Indique si la Session accepte des entrées |
| `failure` | `null` ou `{code, message, action, retryable?}` | Raison publique d'un échec et étape suivante suggérée |

`failure.action` vous indique quoi faire : `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` ou `create_session_with_updated_model_provider`. Consultez le [tableau des codes d'échec](/api-reference/sessions/#status-fields).

Les outils de fonction qui demandent un résultat au client (`requires_action`) ne sont pas encore pris en charge ; la lecture d'une telle Session renvoie `502 executor_contract_error`.

Si un envoi renvoie `409 session_input_pending`, une entrée précédente est encore en cours de livraison. Patientez et lisez la Session ; ne renvoyez pas l'entrée avec une nouvelle `Idempotency-Key`, sinon elle pourrait s'exécuter deux fois.

## Archivage {#archive}

`DELETE /v1/agents/sessions/{session_id}` archive une Session ; les Sessions ne sont jamais supprimées définitivement. `POST /v1/agents/sessions/{session_id}/archive` et `/unarchive` acceptent `{"row_version": …}`. Les Sessions archivées conservent leur historique mais refusent les entrées, les mises à jour de métadonnées et les flux.

## Pièces jointes {#attachments}

Téléversez un fichier dans l'espace de travail de la Session avec `POST /v1/agents/sessions/{session_id}/files` (champ multipart `file`, jusqu'à 5 Mio, `Idempotency-Key` obligatoire). Les types pris en charge sont `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` et `.webp`. Lorsque le `status` du fichier vaut `ready`, envoyez-le avec jusqu'à neuf autres fichiers :

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Reconnexion des clients {#reconnecting-clients}

Les clients de type navigateur qui ont besoin d'une vue cohérente après une perte de connexion peuvent appeler `POST /v1/agents/sessions/{session_id}/reconnect`. Cet appel renvoie la Session et une `stream_url` pour `GET /v1/agents/sessions/{session_id}/events/stream`, qui envoie d'abord un `session.snapshot`, puis les événements en direct et des `heartbeat`. Si ce flux émet `stream.interrupted`, reconnectez-vous au lieu de renvoyer l'entrée.

## Dépôt GitHub {#github-repository}

Envoyez `github_workspace` à la création pour cloner un dépôt GitHub dans `/workspace` et permettre à l'Agent de pousser vers ses propres branches de Session. Consultez [Espace de travail de dépôt GitHub](/agents/github-workspace).

## Identifiants de modèle {#model-credentials}

Une Session appelle les modèles avec la clé API qui l'a créée, sauf si vous envoyez `model_provider`. Utilisez `{"type": "custom", "base_url": "https://…", "api_key": "…"}` pour l'exécuter sur votre propre endpoint HTTPS compatible OpenAI. `model_provider` est en écriture seule.

## ID {#ids}

| Préfixe | Ressource |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | Connexion MCP |
| `sec_` | Secret |
| `fil_` | Pièce jointe de Session |

Traitez les ID comme des chaînes opaques.

## Étapes suivantes {#next-steps}

- [Référence de l'API Sessions](/api-reference/sessions/)
- [Compatibilité OpenAI](/agents/openai-compatibility)

## Fichiers de l'espace de travail et artefacts générés {#workspace-files-and-generated-artifacts}

Ces trois ressources ont des usages différents :

| Ressource | Usage | Pagination |
|---|---|---|
| [Pièces jointes](/api-reference/sessions/list-files) | Fichiers que vous avez téléversés et que vous pouvez référencer dans une entrée avec un `file_id` | `limit` / `offset` |
| [Fichiers de l'espace de travail](/api-reference/sessions/list-workspace-files) | Chemins et tailles actuels des fichiers d'un répertoire de l'espace de travail | `page` / `next` |
| [Artefacts](/api-reference/sessions/list-artifacts) | Sorties générées immuables, disponibles au téléchargement | `after` / `last_id` |

Listez les artefacts pour obtenir un ID `art_`, puis transmettez cet ID exact à [Download Artifact](/api-reference/sessions/download-artifact). Un chemin de l'espace de travail ou un `file_id` de pièce jointe ne peut pas le remplacer. La liste de l'espace de travail ne renvoie que des métadonnées et n'est pas une API de téléchargement de chemins arbitraires. Les artefacts peuvent être téléchargés sous forme de fichiers complets jusqu'à 200 Mio ; les téléchargements partiels avec `Range` ne sont pas pris en charge.
