---
i18nSource: 3dc57d405dbf561d
title: API-Keys
description: So erstellst, verwaltest und schützt du deine SandBase-API-Keys zur Authentifizierung von API-Anfragen.
---

# API-Keys {#api-keys}

API-Keys authentifizieren deine Anfragen an SandBase. Diese Anleitung zeigt, wie du Keys erstellst, in Anfragen verwendest und sicher aufbewahrst.

## API-Key erstellen {#create-an-api-key}

1. Melde dich in der [SandBase Console](https://www.sandbase.ai/console) an
2. Öffne **Developer → API Keys** (oder direkt [API Keys](https://www.sandbase.ai/console/keys))
3. Klicke auf **New key**
4. Gib einen aussagekräftigen **Name** ein (z. B. „Production Server“, „Local Development“)
5. Lege optional ein **Spending limit** (leer bedeutet unbegrenzt) und ein **Expires**-Datum fest (leer bedeutet kein Ablauf)
6. Klicke auf **Create key**
7. Kopiere den Key sofort aus dem Banner **API key created** – er wird nur einmal angezeigt

::: danger Wichtig
Dein API-Key wird nur einmal beim Erstellen angezeigt. Wenn du ihn verlierst, musst du einen neuen erstellen. Bewahre ihn sicher auf, bevor du den Dialog schließt.
:::

## Key-Format {#key-format}

Neue API-Keys aus der Console verwenden das Präfix `sk-`, gefolgt von 64 Hexadezimalzeichen:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Bestehende `sk-sb-...`-Keys bleiben gültig, bis sie ablaufen oder widerrufen werden. Validiere Zugangsdaten nicht allein
anhand des Präfixes; behandle den vollständigen Wert immer als undurchsichtiges Secret.

## Authentifizierungsmethoden {#authentication-methods}

SandBase unterstützt zwei Wege, deinen API-Key in Anfragen zu übergeben:

### Authorization-Header (empfohlen) {#authorization-header-recommended}

Verwende den Standard-Header `Authorization: Bearer`. Er ist mit den SDKs von OpenAI und Anthropic kompatibel:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: x-api-key-Header {#anthropic-messages-x-api-key-header}

`POST /v1/messages` akzeptiert zusätzlich den nativen Anthropic-Header `x-api-key`:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Unter den Modell-Gateways liest nur `POST /v1/messages` den Header `x-api-key`, und er hat Vorrang, wenn beide unterstützten Header
vorhanden sind. [Ressourcen der Agents-Plattform](/api-reference/authentication#agents-platform-resources) akzeptieren ebenfalls
`X-API-Key`. Verwende für alle anderen öffentlichen Endpoints den Bearer-Header.
:::

## Key-Berechtigungen {#key-permissions}

SandBase-API-Keys gelten auf **Organisationsebene**:

- Ein Standard-Key aus der Console kann die öffentlichen API-Ressourcen aufrufen, die der Organisation zur Verfügung stehen
- Die Nutzung wird der Organisation berechnet, der der Key gehört
- Ein Key kann optional ein Ablaufdatum und ein Ausgabenlimit haben
- Von SandBase ausgestellte Zugangsdaten, etwa CLI-Login-Keys, können einen eingeschränkten Scope haben und außerhalb davon `403` zurückgeben

Die Console bietet derzeit keine benutzerdefinierten Scopes für Standard-Keys. CLI-Login-Keys werden erstellt, wenn du ein KI-Tool verbindest. Die Seite API Keys fasst sie in einer aufklappbaren Zeile **CLI Login** zusammen, und sie lassen sich nicht wie Standard-Keys bearbeiten. Keys, die SandBase für dich erstellt, tragen das Badge **Auto-created**; sie haben kein Limit auf Key-Ebene und sind durch das Kontoguthaben begrenzt.

Die Key-Liste zeigt für jeden Key **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** und **Status**. Mit **Edit** änderst du Name, Ausgabenlimit oder Ablaufdatum eines Standard-Keys.

Behandle jeden Key als Zugangsdaten einer Anwendung, nicht als persönliches Passwort. Nutze die Mitgliedschaft in der Organisation für den Zugriff von Personen und API-Keys für Workloads.

## Strategie für Umgebungen {#environment-strategy}

Erstelle für jede Anwendung und jede Umgebung einen eigenen Key:

| Key | Beispielname | Grund |
|---|---|---|
| Lokale Entwicklung | `research-app-dev` | Rotation ohne Unterbrechung der Produktion |
| Staging | `research-app-staging` | Testnutzung und Vorfälle isolieren |
| Produktion | `research-app-production` | Klare Verantwortung und begrenzte Angriffsfläche für die Produktion |
| Temporäre Automatisierung | `release-check-2026-08` | Ablaufdatum setzen und unabhängig widerrufen |

Notiere Verantwortliche und Deployment, die jeden Key nutzen. Bei einer Rotation deployst du den neuen Key, prüfst erfolgreiche Anfragen und widerrufst erst dann den alten Key.

## Ablauf und Widerruf von Keys {#key-expiration-and-revocation}

### Ablauf {#expiration}

Beim Erstellen eines Keys kannst du optional ein Ablaufdatum festlegen. Nach Ablauf funktioniert der Key nicht mehr, und Anfragen liefern den Fehler `401 Unauthorized`.

Keys ohne Ablaufdatum bleiben gültig, bis sie manuell widerrufen werden.

### Key widerrufen {#revoking-a-key}

So widerrufst (deaktivierst) du einen Key:

1. Öffne [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. Suche den Key, den du widerrufen möchtest
3. Klicke auf **Revoke**
4. Bestätige die Aktion

Widerrufene Keys können keine neuen Anfragen authentifizieren. Ein Widerruf lässt sich nicht rückgängig machen – erstelle einen neuen Key, falls du versehentlich einen widerrufst.

## Best Practices für Sicherheit {#security-best-practices}

### Keys niemals in die Versionsverwaltung committen {#never-commit-keys-to-version-control}

Verwende stattdessen Umgebungsvariablen oder einen Secrets Manager:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Separate Keys für verschiedene Umgebungen verwenden {#use-separate-keys-for-different-environments}

Erstelle eigene Keys für Entwicklung, Staging und Produktion. So kannst du einen kompromittierten Entwicklungs-Key widerrufen, ohne die Produktion zu beeinträchtigen.

### Keys regelmäßig rotieren {#rotate-keys-regularly}

Erstelle regelmäßig neue Keys und mustere alte aus. Das verkürzt den Zeitraum, in dem ein geleakter Key missbraucht werden kann.

### Aktivität überwachen {#monitor-activity}

Prüfe regelmäßig **Developer → Activities** auf unerwartete Spitzen bei Anfragen oder Nutzung, die auf einen kompromittierten Key hinweisen können. **Request History** lässt sich nach API-Key filtern.

Wurde ein Key offengelegt, widerrufe ihn sofort, erstelle einen Ersatz, aktualisiere die nutzende Anwendung und prüfe Activities und Abrechnung auf unerwartete Nutzung. Warte nicht auf eine geplante Rotation.

### Ablaufdaten festlegen {#set-expiration-dates}

Lege für temporären Zugriff (CI/CD-Pipelines, Zugriff für externe Dienstleister, Demos) ein Ablaufdatum fest, damit der Key automatisch nicht mehr funktioniert.

## Fehlerbehebung {#troubleshooting}

| Fehler | Ursache | Lösung |
|-------|-------|-----|
| `401 - missing API key` | In der Anfrage wurde kein Key übergeben | Füge einen Header `Authorization: Bearer <key>` hinzu |
| `401 - invalid API key` | Der Key existiert nicht | Prüfe auf Tippfehler und stelle sicher, dass der vollständige Key enthalten ist |
| `401 - API key has been revoked` | Der Key wurde in der Console dauerhaft widerrufen | Erstelle einen Ersatz-Key |
| `401 - API key has expired` | Das Ablaufdatum des Keys ist überschritten | Erstelle einen neuen Key oder verlängere den Ablauf |
| `402 - API key spending limit exceeded` | Der Key hat sein konfiguriertes Ausgabenlimit erreicht | Erhöhe das Limit oder verwende einen anderen berechtigten Key |
| `403 - insufficient_scope` | Eingeschränkte Zugangsdaten können diesen Endpoint nicht aufrufen | Verwende einen für den Endpoint berechtigten Key |

## Nächste Schritte {#next-steps}

- [**Erster API-Aufruf**](/getting-started/first-call) – Ein ausführlicher API-Aufruf mit vollständiger Erklärung von Request und Response
- [**Authentifizierung**](/api-reference/authentication) – Unterstützte Header, Lebenszyklus und protokollspezifische Fehler
- [**API-Referenz**](/api-reference/) – Vollständige Dokumentation aller Endpoints
