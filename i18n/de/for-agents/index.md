---
i18nSource: 0314b37a870481ae
title: KI-lesbare Dokumentation
description: Alles, was ein KI-Agent braucht, um die SandBase API zu finden und zu nutzen — Zusammenfassung auf einer Seite.
---

# KI-freundlicher API-Überblick {#ai-friendly-api-overview}

::: info Session-Vertrag
Eine Session (`ses_*`) führt eine gespeicherte Agent-Version aus; erstelle sie direkt mit `POST /v1/agents/sessions`. Runtime-Instanzen bleiben intern und werden nie zurückgegeben.
:::

> Eine kompakte Referenz für Menschen und KI-Agenten. Reine Textversionen, die für die Verarbeitung durch LLMs optimiert sind, findest du unter [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## Was ist SandBase? {#what-is-sandbase}

SandBase ist eine Infrastrukturplattform für KI-Agenten. Mit einem API-Schlüssel erreichst du aktivierte Models und APIs für Sprache, Bild, Video, Audio, Suche und Daten sowie Agent-Workflows. Ermittle den aktuellen Katalog, statt dich auf eine feste Anzahl zu verlassen.

## API-Basis-URL {#api-base-url}

```
https://api.sandbase.ai/v1
```

## Authentifizierung {#authentication}

Alle Anfragen erfordern ein Bearer-Token:

```
Authorization: Bearer sk-YOUR_KEY
```

Deinen Schlüssel erhältst du unter [Developer → API Keys](https://www.sandbase.ai/console/keys).

## Kurzes Beispiel {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Zentrale APIs {#core-apis}

| Methode | Route | Beschreibung |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | OpenAI-kompatibler Chat; optionale Fähigkeiten hängen vom gewählten Modell ab |
| `POST` | `/v1/messages` | Anthropic-kompatible Messages API |
| `POST` | `/v1/run` | Eine Modellgenerierung mit dem modellspezifischen Schema einreichen |
| `GET` | `/v1/run/{id}` | Status einer asynchronen Generierung abfragen und Ergebnisse abrufen |
| `GET` | `/v1/models` | Aktivierte logische Modelle auflisten; Standard ist der Typ LLM |
| `GET` | `/v1/models/{id_or_name}` | Modelldetails, Schema, Fähigkeiten und Preise abrufen |
| `GET` | `/v1/tasks/{task_id}/cost` | Kosten und Nutzung einer Aufgabe abrufen |

## Weitere API-Gruppen {#additional-api-groups}

Neben den zentralen Generierungs-APIs bietet SandBase APIs für die Verwaltung des Agent-Lebenszyklus. Häufige Workflows findest du im [KI-API-Leitfaden](./full), den vollständigen Vertrag in der [OpenAPI-Spezifikation](https://www.sandbase.ai/docs/openapi.yaml).

| Gruppe | Wichtige Routen | Zweck |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Gespeicherte Agent-Definitionen erstellen und versionieren |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Einen Agent ausführen, Eingaben senden und Live-Events streamen |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Versionierte Anweisungs-Bundles, die Agents einbinden |
| **MCP-Verbindungen und Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Entfernte HTTPS-MCP-Tools und ihre nur schreibbaren Bearer-Token |

Ressourcen der Agents-Plattform akzeptieren `Authorization: Bearer` oder `X-API-Key` und liefern im Fehlerfall `{"error":{"type","code","param","message"}}`.

## Preismodell {#pricing-model}

Bezahlung nach Nutzung. Die Preise sind modellspezifisch und können sich unabhängig von dieser Seite ändern:

- **Modellpreise**: Lies die aktuelle Formel und die Einheiten des gewählten Modells aus `model_card`
- **Token-Preise**: Können Anteile für Eingabe, Ausgabe, Cache oder Reasoning enthalten, sofern das Modell sie angibt
- **Medien und andere Vorgänge**: Können Einheiten pro Anfrage, nach Dauer, Auflösung oder andere modellspezifische Einheiten verwenden
- **Daten-APIs** (Suche, Social Media, Scraping, E-Commerce, Finanzen): Jede Organisation erhält 100 kostenlose Aufrufe pro UTC-Tag, gemeinsam für alle berechtigten Daten-APIs; danach werden Aufrufe pro Aufruf abgerechnet und nicht blockiert. In MCP zeigen berechtigte Tools `pricing.free_quota` in `sandbase_inspect` an, und `sandbase_account` liefert `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`). Siehe [Tägliche kostenlose API-Aufrufe](/guides/billing#daily-free-api-calls).

Ermittle die aktuelle Modell-ID mit `GET /v1/models` und prüfe dann `GET /v1/models/{id_or_name}`, bevor du eine Anfrage sendest. Geh nicht davon aus, dass Preise oder Cache-Rabatte bei allen Anbietern gleich sind.

Wenn ein Vorgang eine Task-ID zurückgibt, prüfe die erfassten Kosten:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Rate-Limits {#rate-limits}

Es gibt keinen veröffentlichten, allgemein gültigen numerischen Standardwert. Anfragen unterliegen einem optionalen Limit für Anfragen pro Minute,
das deiner Organisation zugewiesen ist und von allen ihren API-Schlüsseln geteilt wird. Eine `429`-Antwort enthält keine Kontingent- oder `Retry-After`-Header; verwende begrenzten
exponentiellen Backoff mit Jitter. Siehe den [Fehlerleitfaden](./errors).

---

## Weiterführende Informationen {#further-reading}

- [KI-API-Leitfaden](./full) — zentrale Workflows, Anfrage- und Antwortformen sowie curl-Beispiele
- [Models und Preise](./models) — Live-Ermittlung von Modellen, Preise und Hinweise zu Fähigkeiten
- [Fehlerleitfaden](./errors) — dokumentierte Antwortformen, HTTP-Behandlung und sichere Wiederholungen
- [OpenAPI-Spezifikation](https://www.sandbase.ai/docs/openapi.yaml) — maschinenlesbares OpenAPI 3.1

## Reine Textversionen (für KI-Agenten) {#plain-text-versions-for-ai-agents}

| Datei | URL | Inhalt |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Kompakte Zusammenfassung (~60 Zeilen) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Ausführlicher API-Leitfaden für KI |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | Maschinenlesbare OpenAPI-3.1-Spezifikation |
