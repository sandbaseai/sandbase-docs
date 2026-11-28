---
i18nSource: 95410ff7ea741f64
title: Fehlerleitfaden für KI
description: Behandle Fehler der SandBase API nach Endpunktfamilie, HTTP-Status, Wiederholungssicherheit und dokumentiertem Antwortformat.
---

# Fehlerbehandlung für KI-Clients {#error-handling-for-ai-clients}

SandBase stellt kein einheitliches Fehlerschema bereit. Verzweige zuerst nach dem HTTP-Status und parse dann das Antwortformat,
das für die jeweilige Endpunktfamilie dokumentiert ist. Geh nicht davon aus, dass jede Antwort `code`, `param`, `request_id` oder einen
bestimmten Meldungstext enthält.

## Öffentliche Antwortformate {#public-response-shapes}

Die zentrale `/v1/*`-Middleware und mehrere Modell- oder Ressourcen-Endpunkte liefern einen flachen Fehler:

```json
{"error":"organization rate limit exceeded"}
```

Ressourcen der Agents-Plattform (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) liefern ein Objekt im OpenAI-Stil mit einem stabilen `code`. Siehe [Fehler der Agents-Plattform](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

OpenAI-kompatible Gateways behalten ein OpenAI-kompatibles Envelope bei. `POST /v1/messages` behält das
Anthropic-kompatible Envelope bei:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Umgang mit HTTP-Status {#http-status-handling}

| Status | Bedeutung | Aktion des Clients |
|---|---|---|
| `400` | Ungültige Eingabe oder nicht unterstützter Parameter | Korrigiere die Anfrage anhand des Schemas des gewählten Endpunkts und Modells. |
| `401` | Fehlende, ungültige, widerrufene oder abgelaufene Zugangsdaten | Ersetze oder rotiere die Zugangsdaten; nicht unverändert wiederholen. |
| `402` | Die Anfrage kann nicht finanziert werden oder ein Ausgabenlimit wurde erreicht | Kläre Abrechnung oder Schlüssellimits, bevor du es erneut versuchst. |
| `403` | Den Zugangsdaten fehlt die Berechtigung, oder eine Kompatibilitätsschicht bildet einen Ausgabenfehler auf 403 ab | Prüfe das dokumentierte Envelope und verwende einen berechtigten Schlüssel. |
| `404` | Modell oder Ressource nicht gefunden | Prüfe den aktuellen Modellnamen oder die Ressourcen-ID. |
| `409` | Konflikt im Ressourcenzustand | Lies den aktuellen Ressourcenzustand, bevor du entscheidest, ob eine Wiederholung sicher ist. |
| `429` | Anfragelimit der Organisation oder Concurrency-Limit für Videos | Wiederhole mit begrenztem exponentiellem Backoff und Jitter. |
| `500`, `502`, `503`, `504` | Vorübergehender Fehler bei SandBase oder upstream | Wiederhole nur, wenn die Operation gefahrlos erneut ausgeführt werden kann. |

## Meldungen zu Authentifizierung und Rate Limits {#authentication-and-rate-limit-messages}

Zu den dokumentierten Authentifizierungsmeldungen gehören:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Ein Schlüssel mit eingeschränktem Scope, der außerhalb seines Scopes verwendet wird, liefert stattdessen `403` mit einem verschachtelten Body: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Ressourcen der Agents-Plattform liefern denselben `code` in ihrem eigenen Envelope.

Die dokumentierte Rate-Limit-Meldung lautet `organization rate limit exceeded` (das der Organisation zugewiesene Limit für Anfragen pro Minute,
das sich alle ihre API-Schlüssel teilen). Eine `429`-Antwort enthält derzeit keine `Retry-After`- oder
`X-RateLimit-*`-Header, und es gibt keinen veröffentlichten allgemeinen Standardwert für RPM oder Nebenläufigkeit.

## Modelle und Ressourcen nachschlagen {#model-and-resource-lookup}

Verwende `GET /v1/models`, um aktivierte Modell-IDs zu ermitteln, und `GET /v1/models/{id_or_name}`, um ein Modell vor der
Ausführung zu prüfen. Behandle eine Ressourcen-ID als opak und prüfe sie mit der passenden List- oder Get-Operation. Leite aus einem
ID-Präfix keine andere Polling-URL ab.

## Wiederholungsalgorithmus {#retry-algorithm}

Verwende begrenztes exponentielles Backoff mit Jitter:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Wende diese Regeln an:

- wiederhole `429` nach einer vom Client berechneten Wartezeit;
- wiederhole vorübergehende `5xx`-Antworten nur wenige, begrenzte Male;
- wiederhole eine unveränderte `400`-, `401`-, `402`-, `403`- oder `404`-Anfrage nicht;
- prüfe die Idempotenz, bevor du eine Create-, Trigger- oder externe Aktionsanfrage wiederholst;
- behalte Teilausgaben, wenn ein Stream fehlschlägt, und entscheide, ob Fortsetzen oder Neustarten sicher ist;
- gib den endgültigen HTTP-Status und den bereinigten, endpunktspezifischen Fehler an den Aufrufer weiter.

## Fehler der Agents-Plattform {#agents-platform-errors}

Agents, Sessions, Skills, MCP-Verbindungen und Secrets liefern ein einheitliches Envelope. Bei den meisten Codes ist `message` ein fester, unbedenklicher Satz; `invalid_request` kann eine kurze Erklärung enthalten, etwa welche Eingabeform oder Option nicht unterstützt wird. Verzweige nach `code`, nicht nach `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` ist `authentication_error` bei 401, `server_error` bei 5xx und sonst `invalid_request_error`.

| HTTP | `code` | Bedeutung | Vorgehen |
|---|---|---|---|
| 400 | `invalid_request` | Fehlerhafte oder unbekannte Felder, fehlgeschlagene Validierung oder eine nicht unterstützte Option | Anfrage korrigieren; nicht unverändert wiederholen |
| 400 | `skill_not_found` | Ein referenzierter Skill oder eine Version ist nicht verfügbar | `skills` des Agents korrigieren |
| 401 | `unauthorized` | Fehlende, ungültige oder widersprüchliche API-Schlüssel-Header | `Authorization` / `X-API-Key` prüfen |
| 402 | `spending_limit_exceeded` | Ausgabenlimit des Schlüssels oder Guthaben der Organisation aufgebraucht | Credits hinzufügen oder Limit erhöhen |
| 403 | `insufficient_scope` | Der Schlüssel hat einen eingeschränkten Scope und kann keine Agents-Ressourcen nutzen | Einen in der Console erstellten Standardschlüssel verwenden |
| 403 | `org_disabled` | Die Organisation darf keine Agents ausführen | Support kontaktieren |
| 404 | `not_found` | Die Ressource existiert in deiner Organisation nicht | ID prüfen |
| 409 | `conflict` | Veraltete `row_version`, ein Zustand, der die Änderung nicht zulässt, oder ein mit anderem Body wiederverwendeter `Idempotency-Key` | Ressource erneut lesen, dann entscheiden |
| 409 | `session_input_pending` | Eine frühere Eingabe wird noch zugestellt | Warten; nicht mit neuem Schlüssel erneut senden |
| 409 | `session_input_expired` | Annahme der Eingabe abgelaufen | Verlauf prüfen, bevor du erneut sendest |
| 409 | `session_environment_unavailable` | Die Ausführungsumgebung ist nicht verfügbar | Warten oder eine neue Session erstellen |
| 413 | `request_too_large` | Der Request-Body oder die daraus eingefrorene Session-Konfiguration überschreitet das Größenlimit | Kleineren Body senden; nicht unverändert wiederholen |
| 429 | `quota_exceeded` | Agents-Kontingent überschritten | Später erneut versuchen |
| 502 | `executor_rejected`, `executor_contract_error` | Die Ausführungsschicht hat die Anfrage abgelehnt oder unerwartet geantwortet | Agent-Konfiguration prüfen, dann erneut versuchen |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Eine Abhängigkeit ist vorübergehend nicht verfügbar | Mit Backoff und demselben `Idempotency-Key` erneut versuchen |

Auch `skill_runtime_incompatible` kann auftreten; es wird als 503 mit der Meldung `internal error` zurückgegeben.

## Fehler beim Streaming {#streaming-failures}

Nachdem eine Streaming-Antwort begonnen hat, kann ein Fehler im Stream-Format des Protokolls eintreffen statt als neuer
HTTP-Status. Behandle den Stream als unvollständig, schließe ihn, behalte alle Teilinhalte, die die Anwendung braucht, und
wiederhole nur, wenn die Anfrage gefahrlos erneut gesendet werden kann.

## Siehe auch {#see-also}

- [Fehlercodes](/api-reference/errors) — öffentliche Antwortformate und gängige HTTP-Status
- [Rate Limits](/guides/rate-limiting) — Umgang mit 429 und Glätten von Anfragen
- [Fehler und Wiederholungen](/guides/error-handling) — Implementierungsmuster
- [Authentifizierung](/api-reference/authentication) — unterstützte Zugangsdaten und Lebenszyklus von Schlüsseln
