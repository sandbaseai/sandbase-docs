---
i18nSource: ac4e3b9b9eef4c7d
title: API-Fehler
description: Behandle SandBase-API-Fehler nach HTTP-Status, Endpoint-Familie, dokumentiertem Antwortformat und Retry-Sicherheit.
---

# API-Fehler {#api-errors}

SandBase verwendet Standard-HTTP-Statuscodes, stellt aber keinen einheitlichen Fehler-Body bereit. Verzweige zuerst nach dem HTTP-Status und parse dann das Antwortschema, das für den aufgerufenen Endpoint dokumentiert ist. Setze nicht voraus, dass jeder Fehler `code`, `param`, `message` oder `request_id` enthält.

## Antwortformate {#response-shapes}

Die Core-Middleware und mehrere `/v1/*`-Endpoints geben einen flachen Fehler zurück:

```json
{"error":"organization rate limit exceeded"}
```

Ressourcen der Agents-Plattform (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) geben ein Objekt im OpenAI-Stil mit einem stabilen `code` zurück. Siehe [Fehler der Agents-Plattform](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Die Webhook-Events-API (`/events/webhooks*`) gibt `{"code":<http status>,"message":"..."}` zurück. Siehe [Webhooks](/api-reference/webhooks#authentication-and-errors).

OpenAI-kompatible Endpoints behalten ein OpenAI-kompatibles Envelope bei. `POST /v1/messages` behält ein Anthropic-kompatibles Envelope bei:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Die genauen Statuscodes und Schemas einer öffentlichen Operation findest du in der [OpenAPI-Spezifikation](/openapi.yaml).

## Umgang mit HTTP-Statuscodes {#http-status-handling}

| Status | Typische Bedeutung | Aktion im Client |
|---|---|---|
| `400` | Ungültige Eingabe oder nicht unterstützter Parameter | Korrigiere die Anfrage anhand des Endpoint- und Modellschemas. |
| `401` | Fehlende, ungültige, widerrufene oder abgelaufene Zugangsdaten | Ersetze oder rotiere die Zugangsdaten; nicht unverändert wiederholen. |
| `402` | Die Anfrage kann nicht finanziert werden oder ein Ausgabenlimit wurde erreicht | Kläre Guthaben oder Key-Limit, bevor du es erneut versuchst. |
| `403` | Den Zugangsdaten fehlt die Berechtigung, oder ein Kompatibilitäts-Endpoint bildet einen Finanzierungsfehler auf 403 ab | Prüfe das endpointspezifische Envelope und verwende einen berechtigten Key. |
| `404` | Modell oder Ressource ist für den Aufrufer nicht verfügbar | Prüfe die aktuelle Modell- oder Ressourcen-ID. |
| `409` | Konflikt im Ressourcenzustand | Lies den aktuellen Zustand, bevor du entscheidest, ob ein Retry sicher ist. |
| `422` | Semantisch ungültige Ressourceneingabe | Korrigiere die dokumentierten Feldwerte. |
| `429` | Request-Limit der Organisation oder Video-Concurrency-Limit | Wiederhole mit begrenztem Backoff und Jitter, wenn die Operation sicher wiederholbar ist. |
| `500`, `502`, `503`, `504` | Fehler bei SandBase oder Upstream | Nur wiederholen, wenn die Operation sicher wiederholbar ist. |

Nicht jeder Endpoint dokumentiert jeden Status dieser Tabelle. Maßgeblich ist die OpenAPI-Response-Map der jeweiligen Operation.

## Authentifizierungsfehler {#authentication-errors}

Zu den dokumentierten Authentifizierungsmeldungen gehören:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Ein eingeschränkter Key, der außerhalb seines Geltungsbereichs verwendet wird, liefert stattdessen `403` mit einem verschachtelten Body: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Ressourcen der Agents-Plattform geben denselben `code` in ihrem eigenen Envelope zurück.

Verwende `Authorization: Bearer $SANDBASE_API_KEY` für Standard-Endpoints. `POST /v1/messages` akzeptiert zusätzlich `x-api-key`; protokollkompatible Google-Endpoints dokumentieren ihre eigenen unterstützten Key-Header.

Ein widerrufener Key kann nicht wieder aktiviert werden. Erstelle einen Ersatz, aktualisiere die nutzende Anwendung, prüfe sie und entferne dann alle verbleibenden Verweise auf den alten Key.

## Rate Limits {#rate-limits}

`organization rate limit exceeded` (`429`) bedeutet, dass deine Organisation ihr zugewiesenes Limit an Anfragen pro Minute erreicht hat, das sich alle ihre API-Keys teilen. Protokollkompatible Endpoints geben den Fehler in ihrem eigenen Envelope zurück. SandBase veröffentlicht keinen einheitlichen Zahlenwert, da das Limit pro Organisation zugewiesen wird.

Wenn eine Antwort `Retry-After` enthält, halte dich daran. Andernfalls verwende begrenzten exponentiellen Backoff mit Jitter. Muster zum Glätten von Anfragen findest du unter [Rate Limits](/guides/rate-limiting).

Für Task-Übermittlungen gibt es zwei zusätzliche Prüfungen. `organization concurrency limit exceeded` (`429`) bedeutet, dass deine Organisation bereits so viele laufende Tasks hat, wie ihre Kontostufe erlaubt; der Fehler verschwindet, sobald ein laufender Task endet. Das gilt für jeden Modelltyp auf `POST /v1/run` und `/v1/api/*` sowie für Video-Übermittlungen auf anderen Endpoints. `insufficient credit for estimated video cost` (`402`) bedeutet, dass die geschätzten Kosten dein Guthaben plus Kreditrahmen übersteigen; lade vor einem Retry Guthaben auf. Siehe [Concurrency-Limits](/guides/concurrency-limits).

## Sichere Retries {#retry-safety}

Gehe in dieser Reihenfolge vor:

1. Stelle fest, ob die Operation bereits eine extern sichtbare Wirkung erzeugt hat.
2. Wiederhole eine unveränderte `400`-, `401`-, `402`-, `403`-, `404`- oder `422`-Anfrage nicht.
3. Lies bei `409` den aktuellen Ressourcenzustand, bevor du es erneut versuchst.
4. Wiederhole `429` und vorübergehende `5xx`-Antworten nur wenige, begrenzte Male.
5. Bevor du eine Anfrage zum Erstellen, Auslösen, Hochladen oder für eine externe Aktion wiederholst, stelle sicher, dass die Operation idempotent ist oder deine Anwendung Duplikate abgleichen kann.

Eine geeignete Wartezeit ist:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Fehler der Agents-Plattform {#agents-platform-errors}

Agents, Sessions, Skills, MCP-Verbindungen und Secrets geben ein einheitliches Envelope zurück. Bei den meisten Codes ist `message` ein fester, unbedenklicher Satz; `invalid_request` kann eine kurze Erklärung enthalten, etwa welche Eingabeform oder Option nicht unterstützt wird. Verzweige nach `code`, nicht nach `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` ist `authentication_error` bei 401, `server_error` bei 5xx und sonst `invalid_request_error`.

| HTTP | `code` | Bedeutung | Vorgehen |
|---|---|---|---|
| 400 | `invalid_request` | Fehlerhafte oder unbekannte Felder, fehlgeschlagene Validierung oder eine nicht unterstützte Option | Anfrage korrigieren; nicht unverändert wiederholen |
| 400 | `skill_not_found` | Ein referenzierter Skill oder eine Version ist nicht verfügbar | `skills` des Agents korrigieren |
| 401 | `unauthorized` | Fehlende, ungültige oder widersprüchliche API-Key-Header | `Authorization` / `X-API-Key` prüfen |
| 402 | `spending_limit_exceeded` | Ausgabenlimit des Keys oder Guthaben der Organisation erschöpft | Guthaben aufladen oder Limit erhöhen |
| 403 | `insufficient_scope` | Der Key ist eingeschränkt und kann keine Agents-Ressourcen nutzen | Einen Standard-Key aus der Console verwenden |
| 403 | `org_disabled` | Die Organisation darf keine Agents ausführen | Support kontaktieren |
| 404 | `not_found` | Die Ressource existiert in deiner Organisation nicht | ID prüfen |
| 409 | `conflict` | Veraltete `row_version`, ein Zustand, der die Änderung nicht zulässt, oder ein `Idempotency-Key`, der mit einem anderen Body wiederverwendet wurde | Ressource erneut lesen, dann entscheiden |
| 409 | `session_input_pending` | Eine frühere Eingabe wird noch zugestellt | Warten; nicht mit neuem Key erneut senden |
| 409 | `session_input_expired` | Die Annahme der Eingabe ist abgelaufen | Verlauf prüfen, bevor du erneut sendest |
| 409 | `session_environment_unavailable` | Die Ausführungsumgebung ist nicht verfügbar | Warten oder eine neue Session erstellen |
| 413 | `request_too_large` | Der Request-Body oder die daraus eingefrorene Session-Konfiguration überschreitet das Größenlimit | Kleineren Body senden; nicht unverändert wiederholen |
| 429 | `quota_exceeded` | Agents-Kontingent überschritten | Später erneut versuchen |
| 502 | `executor_rejected`, `executor_contract_error` | Die Ausführungsschicht hat die Anfrage abgelehnt oder unerwartet geantwortet | Agent-Konfiguration prüfen, dann erneut versuchen |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Eine Abhängigkeit ist vorübergehend nicht verfügbar | Mit Backoff und demselben `Idempotency-Key` erneut versuchen |

Auch `skill_runtime_incompatible` kann auftreten; der Code wird als 503 mit der Meldung `internal error` zurückgegeben.

## Fehler beim Streaming {#streaming-failures}

Nachdem ein Stream begonnen hat, kann ein Fehler im Stream-Format des jeweiligen Protokolls statt als neue HTTP-Antwort eintreffen. Behandle den Stream als unvollständig, behalte benötigte Teilausgaben und wiederhole nur, wenn eine erneute Generierung sicher ist. Gehe nicht davon aus, dass jeder Anbieter dasselbe abschließende Event oder denselben Finish Reason sendet.

## Fehlersuche im Betrieb {#operational-debugging}

Protokolliere Endpoint, HTTP-Status, ausgewähltes Modell bzw. Ressourcen-ID, Zeitstempel und jede unbedenkliche Request-Kennung, die der Server zurückgibt. Protokolliere niemals Authorization-Header, API-Keys, Zugangsdaten oder sensible Prompt-Inhalte.

Unter [Developer → Activities](https://www.sandbase.ai/console/activities) siehst du den Request-Verlauf der Organisation. Wenn du einen dauerhaften Fehler meldest, füge bereinigte Request-Metadaten und die kleinste reproduzierbare Anfrage bei.

## Siehe auch {#see-also}

- [Authentifizierung](/api-reference/authentication)
- [Fehler und Retries](/guides/error-handling)
- [Rate Limits](/guides/rate-limiting)
- [KI-lesbarer Fehlerleitfaden](/for-agents/errors)
