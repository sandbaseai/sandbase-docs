---
i18nSource: 99170a141af66587
title: Sessions API
description: Eine gespeicherte Agent-Version ausführen, Eingaben senden, Events streamen und den Session-Verlauf lesen.
---

# Sessions API {#sessions-api}

Eine Session führt eine gespeicherte [Agent](/api-reference/agents/)-Version in der gehosteten Cloud von SandBase aus; es gibt keine Ausführungsumgebung zur Auswahl. Session-IDs verwenden das Präfix `ses_`. Sessions sind eine Unterressource von Agents: Jeder Pfad beginnt mit `/v1/agents/sessions`.

Die Standardvorgänge folgen dem OpenAI-Agents-Protokoll (`client.beta.agents.sessions`); was das offizielle SDK kann und was nicht, steht unter [OpenAI-Kompatibilität](/agents/openai-compatibility). SandBase-Erweiterungen ergänzen Umbenennen, Archivstatus, Abbrechen, Anhänge, Metadaten von Workspace-Dateien, unveränderliche Artefakte und einen wiederverbindbaren Produkt-Stream.

::: info Woher Sessions kommen
Du erstellst eine Session direkt mit `POST /v1/agents/sessions`. Die Session meldet `source: "direct"` und `source_id: null`.
:::

## Empfohlener Ablauf {#recommended-flow}

1. [Erstelle eine Session](./create) für einen gespeicherten Agent. Die Session friert die gewählte Agent-Version und die MCP-Verbindungen ein und verwendet die Skill-Versionen, die bereits an diese Agent-Version gebunden sind.
2. [Öffne den Event-Stream](./stream) mit `GET /v1/agents/sessions/{session_id}/events`. Der Stream ist nur live, öffne ihn also, bevor du Eingaben sendest.
3. [Sende Eingaben](./send-events) mit `POST /v1/agents/sessions/{session_id}/events` und einem `agent.session.input.message`-Event. Der Aufruf liefert 202.
4. Lies die Ergebnisse aus dem Stream oder danach aus [Items](./items) und [Turns](./turns).

## Session-Vorgänge {#session-operations}

| Methode | Pfad | Zweck |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Session erstellen](./create) |
| `GET` | `/v1/agents/sessions` | [Sessions auflisten](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Session abrufen](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Metadaten ersetzen](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Umbenennen](./rename) mit `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Löschen](./delete), wodurch die Session archiviert wird |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Ein Eingabe- oder Abbruch-Event senden](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Live-Events streamen](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Items auflisten](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Turns auflisten](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Einen Turn abrufen](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Laufenden Turn abbrechen](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Archivieren](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Wiederherstellen](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Neu verbinden](./reconnect) nach einem abgebrochenen Stream |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Stream mit Snapshot und anschließenden Live-Events](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Anhang hochladen](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Anhänge auflisten](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Anhang herunterladen](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Anhang löschen](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Metadaten der Workspace-Dateien auflisten](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Unveränderliche Artefakte auflisten](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Artefakt herunterladen](./download-artifact) |

## Statusfelder {#status-fields}

- `status` ist der Ausführungsstatus: `idle`, `in_progress` oder `failed`. Function-Tools, die ein Ergebnis vom Client erfordern (`requires_action`), werden noch nicht unterstützt; das Lesen einer solchen Session liefert `502 executor_contract_error`.
- `lifecycle_status` ist `active` oder `archived`. Archivierte Sessions lehnen Eingaben, Metadaten-Updates und Streams ab. `DELETE` archiviert; `unarchive` stellt wieder her.
- `failure` ist `null` oder ein Objekt mit `code`, `message`, `action` und manchmal `retryable`.

| `failure.code` | Bedeutung | Empfohlene `action` |
|---|---|---|
| `session_creation_rejected` | Die Ausführungsschicht hat die Session abgelehnt | `create_new_session` |
| `model_authentication_failed` | Der Modellanbieter hat den Schlüssel abgelehnt | `create_session_with_updated_model_provider` |
| `model_rate_limited` | Der Modellanbieter drosselt Anfragen (wiederholbar) | `retry_later` |
| `model_quota_exceeded` | Das Modellkonto hat kein Kontingent | `check_model_account` |
| `context_limit_exceeded` | Die Unterhaltung überschreitet den Modellkontext | `create_new_session` |
| `environment_connection_timeout` | Die Umgebung hat sich nicht rechtzeitig verbunden (wiederholbar) | `retry_later` |
| `runtime_unavailable` | Die Ausführungsumgebung ist nicht verfügbar (wiederholbar) | `retry_later` |
| `model_request_failed` | Die Modellanfrage wurde nicht abgeschlossen | `inspect_history` |
| `model_configuration_rejected` | Das Modell oder die Ausführungsschicht hat die Konfiguration abgelehnt | `create_session_with_updated_model_provider` |
| `execution_failed` | Fehler ohne spezifischere öffentliche Ursache | `inspect_history` |

Listenergebnisse können auch Platzhalterzeilen mit `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` oder `session_snapshot_unavailable` enthalten, wenn eine Session nicht live gelesen werden kann.

## Modell-Credentials {#model-credentials}

Standardmäßig ruft eine Session Modelle mit demselben SandBase-API-Schlüssel auf, mit dem sie erstellt wurde. Sende `model_provider`, um explizit zu wählen:

- `{"type": "sandbase"}` verwendet deinen aufrufenden Schlüssel. `base_url` ist nicht erlaubt.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` ruft deinen eigenen OpenAI-kompatiblen HTTPS-Endpunkt auf. Die URL darf keine Zugangsdaten, keine Query und kein Fragment enthalten, und SandBase greift nie auf deinen SandBase-Schlüssel zurück.

`model_provider` ist nur schreibbar und erscheint nie in Antworten.

## Zulassung und Fehler {#admission-and-errors}

Das Erstellen einer Session und das Senden von Eingaben prüfen die Ausführungszulassung: `402 spending_limit_exceeded`, wenn das Schlüssellimit oder das Guthaben der Organisation aufgebraucht ist, `403 org_disabled`, wenn die Organisation keine Agents ausführen darf, und `503 admission_unavailable`, wenn die Prüfung nicht abgeschlossen werden kann. Lesen, Abbrechen und Archivieren werden durch das Guthaben nicht blockiert.

Das Senden von Eingaben kann auch `409 session_input_pending` (eine frühere Eingabe wird noch zugestellt; warte und sende nicht mit einem neuen Schlüssel erneut), `409 session_input_expired` (prüfe den Verlauf, bevor du erneut sendest) oder `409 session_environment_unavailable` (warte oder erstelle eine neue Session) liefern. Siehe [Fehler](/api-reference/errors#agents-platform-errors).

## Paginierung {#pagination}

Sessions, Items, Turns und Artefakte verwenden Cursor-Paginierung (`limit` 1-100, `after`, `order`). Anhänge verwenden Offset-Paginierung (`limit` 1-100, `offset`).

Workspace-Dateien verwenden stattdessen eine Paginierung mit `page` / `next`. Siehe [Workspace-Dateien auflisten](./list-workspace-files).
