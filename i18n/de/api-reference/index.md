---
i18nSource: 071e97a48f9c4f4c
title: API-Referenz
description: Rufe SandBase-Modelle auf und verwalte Agents, Sessions, Skills, MCP-Verbindungen, Secrets und Kontoressourcen.
---

# API-Referenz {#api-reference}

Mit der API rufst du Modelle direkt auf oder definierst wiederverwendbare Agents, führst sie in Sessions aus und verbindest sie mit Skills und MCP-Tools.

::: tip Suchst du Modellinferenz?
Die Inferenzverträge (Chat Completions, Responses, Anthropic Messages, Gemini, Images und Seedance-Video) findest du im Abschnitt **Modellinferenz** dieser Referenz. Die modellspezifischen Felder und Preise stehen auf der jeweiligen Seite im [Models-Katalog](https://www.sandbase.ai/models).
:::

## Einstiegspunkt wählen {#choose-a-starting-point}

| Ziel | Einstieg | Was danach passiert |
|---|---|---|
| Wiederverwendbares Verhalten definieren | [Agents](/api-reference/agents/) | Eine Agent-Konfiguration erstellen und versionieren |
| Einen Agent direkt ausführen | [Sessions](/api-reference/sessions/) | Eingaben senden, Events streamen und den Verlauf lesen |
| Anweisungspakete wiederverwenden | [Skills](/api-reference/skills/) | Versionierte ZIP-Pakete hochladen und an Agents anhängen |
| Externe Tools aufrufen | [MCP-Verbindungen](/api-reference/mcp-connections/) | Remote-HTTPS-MCP-Server für Agents registrieren |
| Externe Tools authentifizieren | [Secrets](/agents/api-credentials#with-the-api) | Nur schreibbare Bearer-Tokens für MCP-Verbindungen speichern |

## Lebenszyklus der Ressourcen {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- Ein **Agent** (`agt_`) ist eine gespeicherte, versionierte Konfiguration; beim Erstellen wird er nicht ausgeführt.
- Eine **Session** (`ses_`) führt eine Agent-Version aus und friert ihre Skills und MCP-Verbindungen ein. Session-Pfade liegen unter `/v1/agents/sessions`.
- Ein **Skill** (`skl_`) ist ein versioniertes Anweisungspaket. Eine **MCP-Verbindung** (`mcp_`) registriert einen Remote-Tool-Server, und ein **Secret** (`sec_`) speichert dessen Bearer-Token.

## Konventionen für Ressourcen der Agents-Plattform {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, MCP-Verbindungen und Secrets werden unter `https://api.sandbase.ai/v1` bereitgestellt und folgen diesen Regeln:

- Authentifiziere dich mit `Authorization: Bearer` oder `X-API-Key`. Siehe [Authentifizierung](/api-reference/authentication#agents-platform-resources).
- Request-Bodies sind striktes JSON mit bis zu 1 MiB; unbekannte Felder liefern 400.
- Schreibvorgänge, die MCP-Verbindungen oder Secrets erstellen, erfordern einen `Idempotency-Key`. Andere Schreibvorgänge akzeptieren einen.
- Optimistische Nebenläufigkeit nutzt `row_version`: Sende den zuletzt gelesenen Wert und reagiere auf 409, indem du erneut liest.
- Agents, Sessions, Items, Turns und Skills verwenden Cursor-Paginierung (`limit`, `after`, `order`; Antworten enthalten `has_more` und `last_id`). Agent-Versionen, Anhänge, MCP-Verbindungen und Secrets verwenden Offset-Paginierung (`limit`, `offset`; Antworten enthalten `total`).
- Fehler verwenden `{"error": {"type", "code", "param", "message"}}`. Siehe [Fehler der Agents-Plattform](/api-reference/errors#agents-platform-errors).

## Authentifizierung {#authentication}

Sende einen SandBase-API-Key als Bearer-Token:

```http
Authorization: Bearer sk-YOUR_KEY
```

Behandle den Key als undurchsichtiges Secret, halte ihn auf dem Server und füge ihn niemals in Browser-Code oder Logs ein. Details zur Kompatibilität findest du unter [Authentifizierung](/api-reference/authentication), öffentliche Fehler-Envelopes unter [Fehler](/api-reference/errors).

## Organisation und Nutzung {#organization-and-usage}

Plattformressourcen gehören zu der Organisation, die mit dem API-Key verknüpft ist. Mit der [Account API](/api-reference/account/) siehst du das Guthaben und aktuelle Ansichten des Ausführungsverlaufs ein. Organisationsverwaltung und Abrechnung bleiben Workflows in der Console, sofern hier kein öffentlicher Endpoint dokumentiert ist.

## Referenzformate {#reference-formats}

- Durchsuche die Operationen in der Seitenleiste für Beispiele und Antwortdetails.
- Lade die maschinenlesbare [OpenAPI-Spezifikation](/openapi.yaml) herunter.
- Öffne die Seite eines Modells im [Models-Katalog](https://www.sandbase.ai/models) oder die Seite einer API im [APIs-Katalog](https://www.sandbase.ai/apis), um die genauen Request-Felder zu sehen.

## Nächste Schritte {#next-steps}

- Neu bei verwalteten Agents: [Agent erstellen](/agents/)
- Ein Modell direkt aufrufen: [Chat Completions](/api-reference/llm-gateway) oder der [Models-Katalog](https://www.sandbase.ai/models)
