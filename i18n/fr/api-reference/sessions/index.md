---
i18nSource: 99170a141af66587
title: API Sessions
description: Exécutez une version enregistrée d'un Agent, envoyez des entrées, diffusez des événements et lisez l'historique des Sessions.
---

# API Sessions {#sessions-api}

Une Session exécute une version enregistrée d'un [Agent](/api-reference/agents/) dans le cloud hébergé de SandBase ; il n'y a pas d'environnement d'exécution à choisir. Les ID de Session utilisent le préfixe `ses_`. Les Sessions sont une sous-ressource des Agents : chaque chemin commence par `/v1/agents/sessions`.

Les opérations standard suivent le protocole OpenAI Agents (`client.beta.agents.sessions`) ; consultez [Compatibilité OpenAI](/agents/openai-compatibility) pour savoir ce que le SDK officiel peut faire ou non. Les extensions SandBase ajoutent le renommage, l'état d'archivage, l'annulation, les pièces jointes, les métadonnées des fichiers du workspace, les artefacts immuables et un flux produit auquel vous pouvez vous reconnecter.

::: info Origine des Sessions
Vous créez une Session directement avec `POST /v1/agents/sessions`. La Session indique `source: "direct"` et `source_id: null`.
:::

## Flux recommandé {#recommended-flow}

1. [Créez une Session](./create) pour un Agent enregistré. La Session fige la version d'Agent et les connexions MCP sélectionnées, et utilise les versions de Skills déjà figées dans cette version d'Agent.
2. [Ouvrez le flux d'événements](./stream) avec `GET /v1/agents/sessions/{session_id}/events`. Le flux est uniquement en direct : ouvrez-le donc avant d'envoyer une entrée.
3. [Envoyez une entrée](./send-events) avec `POST /v1/agents/sessions/{session_id}/events` et un événement `agent.session.input.message`. L'appel renvoie 202.
4. Lisez les résultats dans le flux, ou ensuite dans les [items](./items) et les [tours](./turns).

## Opérations sur les Sessions {#session-operations}

| Méthode | Chemin | Objet |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Créer une Session](./create) |
| `GET` | `/v1/agents/sessions` | [Lister les Sessions](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Récupérer une Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Remplacer les métadonnées](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Renommer](./rename) avec `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Supprimer](./delete), ce qui archive la Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Envoyer un événement d'entrée ou d'annulation](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Diffuser les événements en direct](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Lister les items](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Lister les tours](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Récupérer un tour](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Annuler le tour en cours](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Archiver](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Désarchiver](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Se reconnecter](./reconnect) après une coupure du flux |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Flux instantané puis direct](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Téléverser une pièce jointe](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Lister les pièces jointes](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Télécharger une pièce jointe](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Supprimer une pièce jointe](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Lister les métadonnées des fichiers du workspace](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Lister les artefacts immuables](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Télécharger un artefact](./download-artifact) |

## Champs de statut {#status-fields}

- `status` est le statut d'exécution : `idle`, `in_progress` ou `failed`. Les outils de fonction qui exigent un résultat côté client (`requires_action`) ne sont pas encore pris en charge ; la lecture d'une telle Session renvoie `502 executor_contract_error`.
- `lifecycle_status` vaut `active` ou `archived`. Les Sessions archivées refusent les entrées, les mises à jour de métadonnées et les flux. `DELETE` archive ; `unarchive` restaure.
- `failure` vaut `null` ou un objet avec `code`, `message`, `action` et parfois `retryable`.

| `failure.code` | Signification | `action` suggérée |
|---|---|---|
| `session_creation_rejected` | La couche d'exécution a refusé la Session | `create_new_session` |
| `model_authentication_failed` | Le fournisseur du modèle a refusé la clé | `create_session_with_updated_model_provider` |
| `model_rate_limited` | Le fournisseur du modèle applique une limite de débit (peut être réessayé) | `retry_later` |
| `model_quota_exceeded` | Le compte du modèle n'a plus de quota | `check_model_account` |
| `context_limit_exceeded` | La conversation dépasse le contexte du modèle | `create_new_session` |
| `environment_connection_timeout` | L'environnement ne s'est pas connecté à temps (peut être réessayé) | `retry_later` |
| `runtime_unavailable` | L'environnement d'exécution est indisponible (peut être réessayé) | `retry_later` |
| `model_request_failed` | La requête au modèle n'a pas abouti | `inspect_history` |
| `model_configuration_rejected` | Le modèle ou la couche d'exécution a refusé la configuration | `create_session_with_updated_model_provider` |
| `execution_failed` | Échec sans cause publique plus précise | `inspect_history` |

Les résultats de liste peuvent aussi contenir des lignes de substitution avec `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` ou `session_snapshot_unavailable` lorsqu'une Session ne peut pas être lue en direct.

## Identifiants du modèle {#model-credentials}

Par défaut, une Session appelle les modèles avec la même clé API SandBase que celle qui l'a créée. Envoyez `model_provider` pour choisir explicitement :

- `{"type": "sandbase"}` utilise votre clé d'appel. `base_url` n'est pas autorisé.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` appelle votre propre endpoint HTTPS compatible OpenAI. L'URL ne peut contenir ni identifiants, ni query, ni fragment, et SandBase ne se rabat jamais sur votre clé SandBase.

`model_provider` est en écriture seule et n'apparaît jamais dans les réponses.

## Admission et erreurs {#admission-and-errors}

La création d'une Session et l'envoi d'une entrée vérifient l'admission à l'exécution : `402 spending_limit_exceeded` lorsque la limite de la clé ou le solde de l'organisation est épuisé, `403 org_disabled` lorsque l'organisation ne peut pas exécuter d'Agents, et `503 admission_unavailable` lorsque la vérification ne peut pas aboutir. Les lectures, l'annulation et l'archivage ne sont pas bloqués par le solde.

L'envoi d'une entrée peut aussi renvoyer `409 session_input_pending` (une entrée précédente est encore en cours de livraison ; attendez, et ne la renvoyez pas avec une nouvelle clé), `409 session_input_expired` (consultez l'historique avant de renvoyer) ou `409 session_environment_unavailable` (attendez ou créez une nouvelle Session). Consultez [Erreurs](/api-reference/errors#agents-platform-errors).

## Pagination {#pagination}

Les Sessions, les items, les tours et les artefacts utilisent une pagination par curseur (`limit` de 1 à 100, `after`, `order`). Les pièces jointes utilisent une pagination par offset (`limit` de 1 à 100, `offset`).

Les fichiers du workspace utilisent plutôt une pagination `page` / `next`. Consultez [Lister les fichiers du workspace](./list-workspace-files).
