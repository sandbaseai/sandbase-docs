---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: Gespeicherte Agent-Konfigurationen erstellen, versionieren, archivieren und klonen.
---

# Agents API {#agents-api}

Ein Agent ist eine gespeicherte, versionierte Konfiguration: ein Modell, Anweisungen, ein Runtime-Profil, Skills, MCP-Verbindungen und Ausgabeeinstellungen. Beim Erstellen oder Aktualisieren wird ein Agent nicht ausgeführt. Ausgeführt wird er in einer [Session](/api-reference/sessions/).

Die Agents API folgt dem OpenAI-Agents-Protokoll (`client.beta.agents` im OpenAI Python SDK). Der Header `OpenAI-Beta` ist optional; wenn du ihn sendest, muss er `agents=v1` lauten. SandBase ergänzt Versionen, Compare-and-Set-Updates, Archivieren und Wiederherstellen sowie einen öffentlichen Katalog.

## Agent-Operationen {#agent-operations}

| Methode | Pfad | Zweck |
|---|---|---|
| `POST` | `/v1/agents` | [Agent erstellen](./create) in Version 1 |
| `GET` | `/v1/agents` | [Agents auflisten](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Agent abrufen](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Agent aktualisieren](./update) (partielles Update im SDK-Stil) |
| `PATCH` | `/v1/agents/{agent_id}` | [Mit Compare-and-Set ersetzen](./replace) anhand von `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Löschen](./delete), wodurch der Agent archiviert wird |
| `POST` | `/v1/agents/{agent_id}/archive` | [Agent archivieren](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Archivierung aufheben](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Frühere Version wiederherstellen](./restore) als neue Version |
| `GET` | `/v1/agents/{agent_id}/versions` | [Versionen auflisten](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Eine Version abrufen](./get-version) |
| `GET` | `/v1/agents/catalog` | [Öffentlichen Katalog durchsuchen](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Katalog-Agent klonen](./catalog#clone-a-catalog-agent) in deine Organisation |

Agent-IDs verwenden das Präfix `agt_`. Request-Bodies sind striktes JSON mit bis zu 1 MiB; unbekannte Felder liefern 400.

## Versionen und Updates {#versions-and-updates}

- Jeder wirksame Schreibvorgang (create, update, replace, restore) erzeugt eine unveränderliche Version. `version` ist die aktuelle Versionsnummer.
- `POST /v1/agents/{agent_id}` ist das Update des OpenAI SDK. Es benötigt kein `row_version`, daher gewinnt der letzte Schreibvorgang.
- `PATCH /v1/agents/{agent_id}` erfordert die zuletzt gelesene `row_version` und gibt 409 zurück, wenn jemand anderes den Agent zuvor geändert hat. Nutze es in Editoren und Automatisierungen, die parallel laufen können.
- Jede Session friert die Agent-Version, die Skill-Versionen und die MCP-Verbindungskonfiguration ein, mit denen sie gestartet wurde.

## Bereitschaft {#readiness}

Eine neu geschriebene Version meldet `projection_status`, während sie für die Ausführung vorbereitet wird. Sessions benötigen einen aktiven Agent, dessen `projection_status` `ready` ist; andernfalls geben sie 409 zurück. Auch archivierte Agents liefern 409 für neue Ausführungen.

## Aktuelle Einschränkungen {#current-limits}

- `tools` akzeptiert `function`-Tools und höchstens ein `web_search`-Tool. Für die Ausführung muss `web_search.mode` derzeit `disabled` sein.
- Function-Tools lassen sich speichern, aber Runs, die den Client zur Rückgabe eines Tool-Ergebnisses auffordern (`requires_action`), werden noch nicht unterstützt und erscheinen als `502 executor_contract_error`.
- `multi_agent` muss weggelassen werden oder `null` sein.

## Paginierung {#pagination}

`GET /v1/agents` und der Katalog verwenden Cursor-Paginierung: `limit` (1-100, Standard 20), `after` und `order` (`asc` oder `desc`, Standard `desc`). Antworten enthalten `object: "list"`, `data`, `has_more`, `first_id` und `last_id`; übergib `last_id` als `after` für die nächste Seite.

`GET /v1/agents/{agent_id}/versions` verwendet Offset-Paginierung: `limit` und `offset`, mit `data`, `total`, `limit` und `offset` in der Antwort.

## Fehler {#errors}

Fehler verwenden das Agents-Envelope `{"error":{"type","code","param":null,"message"}}`. Die Liste der Codes findest du unter [Fehler](/api-reference/errors#agents-platform-errors).
