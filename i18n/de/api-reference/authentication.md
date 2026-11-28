---
i18nSource: 5b94f91222d138de
title: API-Authentifizierung
description: Authentifiziere SandBase-APIs mit Bearer-Tokens und unterstützten protokollkompatiblen API-Key-Headern.
---

# Authentifizierung {#authentication}

SandBase authentifiziert Anfragen an die öffentliche API mit API-Keys. Diese Seite beschreibt die unterstützten Integrationsmethoden und
bewährte Praktiken zur Key-Verwaltung. Die Authentifizierung der Console und ihre internen APIs gehören nicht zum öffentlichen API-Vertrag.

## Authentifizierungsmethoden {#authentication-methods}

Standardmäßige SandBase-Endpunkte unter `/v1/*` erfordern ein Bearer-Token. Anthropic Messages und Google-Gemini-kompatible Operationen akzeptieren zusätzlich die API-Key-Positionen ihrer nativen SDKs.

### Bearer-Token {#bearer-token}

Übergib den Key im Header `Authorization`:

```http
Authorization: Bearer sk-your-api-key
```

Das ist die Standardmethode, die OpenAI-kompatible SDKs verwenden.

### Anthropic Messages: Header x-api-key {#anthropic-messages-x-api-key-header}

Übergib den Key im Header `x-api-key`:

```http
x-api-key: sk-your-api-key
```

Dieser Header wird nur von `POST /v1/messages` unterstützt. Andere öffentliche Endpunkte lesen ihn nicht aus; verwende Bearer-Authentifizierung
für Chat Completions, `/v1/run` und Ressourcen-APIs.

### Priorität {#priority}

Nur für `POST /v1/messages` gilt: Sind beide Header vorhanden, hat `x-api-key` Vorrang.

### Google-Gemini-kompatible API-Keys {#google-gemini-compatible-api-keys}

Die Operationen Gemini GenerateContent und Interactions akzeptieren `x-goog-api-key`, `Authorization: Bearer …` oder den Query-Parameter `key`, in dieser Prioritätsreihenfolge. Verwende bevorzugt einen Header, da Credentials im Query-String in Logs und im Browserverlauf auftauchen können. Die unterstützten Pfade findest du unter [Google Gemini](/api-reference/gemini-generate-content) und [Gemini Interactions](/api-reference/gemini-interactions).

### Extraktionslogik {#extraction-logic}

Standard-Endpunkte lesen nur `Authorization: Bearer <key>`. Die Middleware für Anthropic Messages liest zuerst `x-api-key`
und greift dann auf den Bearer-Header zurück. Ressourcen der Agents-Plattform akzeptieren `Authorization: Bearer` oder
`X-API-Key` (siehe unten). Die [Webhook Events API](/api-reference/webhooks) (`/events/webhooks*`) akzeptiert ebenfalls beide
Header und verwendet den Bearer-Header, wenn beide vorhanden sind. Fehlt ein unterstütztes Credential, ergibt das `401 Unauthorized`.

### Ressourcen der Agents-Plattform {#agents-platform-resources}

`/v1/agents*` (einschließlich `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`
und `/v1/skills*` akzeptieren den Key in beiden Headern:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Werden sowohl `Authorization: Bearer` als auch `X-API-Key` gesendet, müssen beide denselben Key enthalten; unterschiedliche Werte ergeben `401 unauthorized`. Wird einer der Header wiederholt, ergibt das ebenfalls 401.
- `OpenAI-Beta` ist optional. Falls vorhanden, muss es `agents=v1` sein.
- Leseanfragen benötigen die Berechtigung `agents.read`, Schreibanfragen `agents.write`. Standard-Keys aus der Console haben beide. Eingeschränkte, von SandBase ausgestellte Keys wie CLI-Login-Keys ergeben `403 insufficient_scope`.
- `402 spending_limit_exceeded` bedeutet, dass das Ausgabenlimit des Keys oder das Guthaben der Organisation aufgebraucht ist.
- Fehler verwenden den [Fehler-Envelope der Agents](/api-reference/errors#agents-platform-errors), nicht die unten gezeigte flache Form `{"error": "…"}`.

## API-Key-Format {#api-key-format}

Neue, in der Console erstellte API-Keys haben dieses Format:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Bestandteil | Beschreibung |
|-----------|-------------|
| `sk-` | Standardpräfix für „Secret Key“ |
| `xxxx...` | 64 Hexadezimalzeichen, erzeugt aus 32 Zufallsbytes |

Ältere `sk-sb-...`-Keys bleiben nutzbar, bis sie ablaufen oder widerrufen werden. Clients sollten Keys als opake Strings behandeln,
statt ein Credential anhand von Präfix oder Länge abzulehnen.

::: warning
Lege deinen API-Key niemals in clientseitigem Code, öffentlichen Repositories oder Logs offen. Behandle ihn wie ein Passwort.
:::

## API-Keys erstellen {#create-api-keys}

### Über die Console {#via-console}

1. Melde dich bei der [SandBase Console](https://www.sandbase.ai/console) an.
2. Öffne **Developer → API Keys**.
3. Klicke auf **New key**.
4. Gib dem Key einen aussagekräftigen Namen (z. B. „Production Backend“, „Development“).
5. Kopiere den Key sofort, denn er wird nicht noch einmal angezeigt.

### Key-Eigenschaften {#key-properties}

| Eigenschaft | Beschreibung |
|----------|-------------|
| Name | Lesbare Bezeichnung zur Identifikation |
| Organization | Die Organisation, zu der dieser Key gehört |
| Enabled | Ob der Key aktiv ist |
| Spending Limit | Optionale Ausgabengrenze pro Key |
| Expires At | Optionales Ablaufdatum |
| Created At | Wann der Key erstellt wurde |

Standard-Keys aus der Console haben Zugriff auf Organisationsebene auf die dokumentierte öffentliche API. Von SandBase ausgestellte Credentials wie CLI-Login-Keys können einen eingeschränkten Scope haben. Die Console bietet für Standard-Keys keine vom Benutzer wählbaren Scopes an.

## Key-Lebenszyklus {#key-lifecycle}

### Rotation {#rotation}

So rotierst du einen Key:

1. Erstelle einen neuen Key in der Console.
2. Stelle deine Anwendung auf den neuen Key um.
3. Prüfe, ob der neue Key in der Produktion funktioniert.
4. Widerrufe den alten Key.

::: tip
Erstelle immer zuerst den neuen Key, bevor du den alten widerrufst, um Ausfallzeiten zu vermeiden.
:::

### Widerruf {#revocation}

Widerrufene Keys können keine neuen Anfragen authentifizieren. Die API gibt `401 Unauthorized` mit dieser Meldung zurück:

```json
{"error":"API key has been revoked"}
```

### Ablauf {#expiration}

Keys können optional ein Ablaufdatum haben. Abgelaufene Keys ergeben `401 Unauthorized` mit dieser Meldung:

```json
{"error":"API key has expired"}
```

## Authentifizierungsanforderungen der Endpunkte {#endpoint-authentication-requirements}

| Endpunkt | Auth-Methode | Beschreibung |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API-Key (Bearer) | Chat Completions |
| `POST /v1/responses` | API-Key (Bearer) | OpenAI-kompatible Responses API |
| `POST /v1/messages` | API-Key (Bearer oder x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API-Key (x-goog-api-key, Bearer oder Query-Key) | Gemini GenerateContent |
| `/v1beta/interactions*` | API-Key (x-goog-api-key, Bearer oder Query-Key) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API-Key (Bearer oder X-API-Key) | Ressourcen der Agents-Plattform |

Die SandBase Console verwendet einen separaten Authentifizierungsablauf im Browser. Ihre internen Anfragen sind keine unterstützten öffentlichen
Endpunkte und dürfen von Integrationen nicht verwendet werden.

## Isolation nach Organisation {#organization-isolation}

API-Keys sind auf eine Organisation beschränkt. Wenn du dich mit einem Key authentifizierst:

- kannst du nur auf Ressourcen deiner Organisation zugreifen,
- werden Nutzung und Abrechnung pro Organisation erfasst.

## Fehlerantworten {#error-responses}

| HTTP-Status | Meldung | Ursache |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | Kein Key angegeben |
| 401 | `invalid API key` | Key nicht in der Datenbank gefunden |
| 401 | `API key has been revoked` | Key wurde deaktiviert |
| 401 | `API key has expired` | Ablaufdatum des Keys überschritten |
| 402 oder protokollspezifisch 403 | `API key spending limit exceeded` | Ausgabenlimit des Keys erreicht; prüfe den dokumentierten Fehlervertrag des Endpunkts |
| 403 | `API key is not authorized for this endpoint` | Eingeschränkter Key an einem Endpunkt außerhalb seines Scopes verwendet |

Diese Meldungen kommen im flachen Body `{"error":"<message>"}`, mit Ausnahme von `403`-Scope-Fehlern. An Modell- und Konto-Endpunkten
verwenden diese `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`;
an Ressourcen der Agents-Plattform verwenden sie den [Fehler-Envelope der Agents](/api-reference/errors#agents-platform-errors) mit
`code` `insufficient_scope`.

## Bewährte Sicherheitspraktiken {#security-best-practices}

### Empfohlen {#do}

- **Keys in Umgebungsvariablen speichern**: Keys niemals fest im Quellcode hinterlegen
- **Separate Keys pro Umgebung verwenden**: Unterschiedliche Keys für Dev, Staging und Produktion
- **Ablaufdaten festlegen**: Ein Rotationsintervall wählen, das zu deiner Sicherheitsrichtlinie passt
- **Nutzung überwachen**: In der Console auf unerwartete Aktivität prüfen
- **Standard-Keys nur für Workloads verwenden, die Zugriff auf die öffentliche API brauchen**: Eingeschränkte CLI-Login-Credentials in ihrem verwalteten Ablauf belassen

### Zu vermeiden {#don-t}

- **Keys nicht in die Versionsverwaltung committen**: `.env` zu `.gitignore` hinzufügen
- **Einen Key nicht für unabhängige Anwendungen teilen**: Separate Keys machen Rotation und Incident Response sicherer
- **Keys nicht in clientseitigem Code offenlegen**: Anfragen immer über dein Backend leiten
- **API-Keys nicht loggen**: Keys in Anwendungslogs schwärzen

### Beispiel für Umgebungsvariablen {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Rate Limiting pro Key {#rate-limiting-by-key}

Anfragelimits werden pro Organisation vergeben und von allen ihren API-Keys geteilt. Mehr Keys zu erstellen erhöht das Limit also nicht.
Die API veröffentlicht weder einen allgemeingültigen numerischen
Standardwert noch Header zum verbleibenden Kontingent.

Details zu Limits und zum Umgang mit 429-Antworten findest du unter [Rate Limiting](/guides/rate-limiting).
