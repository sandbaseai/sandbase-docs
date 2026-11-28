---
i18nSource: c063864501452a7b
title: SandBase Docs
description: Baue direkt mit Models und APIs, oder definiere wiederverwendbare Agents, die auf verwalteter Infrastruktur laufen.
---

# SandBase Docs {#sandbase-docs}

Baue direkt mit Models und APIs, oder definiere wiederverwendbare Agents, die auf verwalteter Infrastruktur laufen.

SandBase bietet zwei sich ergänzende Wege, KI-Anwendungen zu bauen. Beginne mit der kleinsten Oberfläche, die zur Aufgabe passt; wenn die Anwendung wächst, kannst du beide kombinieren.

## Wähle deinen Weg {#choose-how-to-build}

| | Models und APIs | Managed Agents |
|---|---|---|
| **Was es ist** | Direkter Zugriff auf Sprach-, Bild-, Video- und Audiomodelle sowie Drittanbieter-APIs | Wiederverwendbare, versionierte Agent-Konfigurationen, die SandBase ausführt |
| **Geeignet für** | Eigene Anwendungsschleifen und feingranulare Kontrolle über Anfragen | Mehrstufige, asynchrone oder wiederholbare Arbeit |
| **Du verwaltest** | Prompts, Orchestrierung, Wiederholungen und Anwendungszustand | Agent-Definition, aktivierte Funktionen, Eingaben und Auslieferungsverhalten |
| **Hier starten** | [Models und APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip Ein SandBase-API-Schlüssel
Mit demselben API-Schlüssel rufst du Models, APIs und Agents auf. Bewahre Schlüssel auf dem Server auf und gib sie niemals im Browser-Code preis.
:::

## Kernkonzepte {#core-concepts}

### Models und APIs {#models-and-apis}

Nutze Models für Sprach-, Bild-, Video- und Audio-Workloads. Nutze APIs, wenn die Anwendung externe Daten oder Aktionen braucht. Der Katalog auf der SandBase-Website zeigt verfügbare Funktionen, Preise, Eingabeschemas und funktionierende Beispiele.

- [Models durchsuchen](https://www.sandbase.ai/models)
- [APIs durchsuchen](https://www.sandbase.ai/apis)
- [Ersten API-Aufruf ausführen](/getting-started/first-call)
- [API-Referenz öffnen](/api-reference/)

### Agents {#agents}

Ein Agent ist eine wiederverwendbare, versionierte Konfiguration aus einem Model, Anweisungen, Skills und MCP-Verbindungen. Du definierst ihn einmal und führst ihn dann in Sessions aus.

- [Agents verstehen](/agents/)
- [Agent definieren](/agents/agent-api)
- [Skills und MCP-Tools hinzufügen](/agents/mcp-tools)

### Sessions {#sessions}
Eine Session führt eine Agent-Version aus. Erstelle sie mit `POST /v1/agents/sessions`, sende Eingaben, streame Events und lies anschließend die vollständige Unterhaltung.

- [Sessions-Guide](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## Erste Schritte {#first-steps}

1. Erstelle eine Organisation und einen [API-Schlüssel](/getting-started/api-keys).
2. Wähle ein Model, eine API oder einen Agent aus dem [Katalog](https://www.sandbase.ai/models).
3. Sende eine direkte Anfrage oder definiere und teste einen Agent.
4. Führe den getesteten Agent aus deiner Anwendung heraus in Sessions aus.
5. Prüfe Sessions, Fehler, Latenz und Kosten in der Console.

## Hinweise für den Betrieb {#operational-guidance}

- [Streaming-Antworten](/guides/streaming)
- [Fehlerbehandlung und Wiederholungen](/guides/error-handling)
- [Rate Limiting](/guides/rate-limiting)
- [Abrechnung und Preise](/guides/billing)
- [Workspace-Verwaltung](/admin/)

## Nächste Schritte {#next-steps}

- Mit lokalen Skills arbeiten: [Skill-Tutorials](/guides/skills/)

- Neu bei SandBase: [Erste Schritte](/getting-started/)
- Ein Model oder eine API aufrufen: [Models-Katalog](https://www.sandbase.ai/models) und [APIs-Katalog](https://www.sandbase.ai/apis)
- Inferenz- und Agent-APIs: [API-Referenz](/api-reference/)
- Wiederverwendbare Arbeit bauen: [Build Agent](/agents/)
- Ein KI-Tool verbinden: [Setup](/setup/)
