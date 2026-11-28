---
i18nSource: a86346e2696c732c
title: FAQ
description: Häufige Fragen zum Verbinden von KI-Tools, zum SandBase-Katalog, zu Models, APIs, Agents, Sessions und zur Abrechnung.
---

# Häufig gestellte Fragen {#frequently-asked-questions}

## Was ist SandBase? {#what-is-sandbase}

SandBase hilft Agents, sich mit der realen Welt zu verbinden.

Du kannst fertige Models und APIs nutzen, sie nach der Verbindung unter AI tools aus deinen KI-Tools heraus verwenden oder wiederverwendbare Agents bauen und in Sessions ausführen.

## Für wen ist SandBase gedacht? {#who-is-sandbase-for}

SandBase richtet sich vor allem an drei Gruppen:

- **Nutzer von KI-Tools**, die nützliche Fähigkeiten in Codex, Claude, Cursor oder Kiro wollen
- **Entwickler**, die Models und APIs direkt aufrufen wollen
- **FDEs und Teams**, die wiederverwendbare Agents für Kunden oder interne Workflows bauen

## Wo finde ich die verfügbaren Fähigkeiten? {#where-do-i-browse-capabilities}
Die SandBase-Website listet den Katalog der Fähigkeiten auf:

- [Models](https://www.sandbase.ai/models) und [Bild- und Videomodelle](https://www.sandbase.ai/models/image-video)
- [APIs](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
Je nach Art der Fähigkeit kannst du sie ansehen, testen, installieren, aufrufen oder klonen.

## Was ist AI tools? {#what-is-ai-tools}

**Build → AI tools** in der Console verbindet SandBase mit dem KI-Tool, das du bereits nutzt, etwa Claude Code, Codex, Cursor oder Kiro. Füge `set up https://www.sandbase.ai/SKILL.md` in deinen Agenten ein oder führe `npx -y @sandbaseai/cli@latest connect` aus. Das verbundene Tool kann den SandBase-Katalog aus Models und APIs durchsuchen und ausführen; die Abrechnung läuft über deinen Workspace. Siehe [KI-Tools verbinden](/setup/).

## Was ist Build Agent? {#what-is-build-agent}

In Build Agent definierst und testest du einen Agent.

Ein Agent kombiniert Anweisungen, ein Model, Skills und MCP-Tools zu einem wiederverwendbaren, versionierten Workflow.

## Unterscheidet sich ein Agent von einer API? {#is-an-agent-different-from-an-api}
Ja. Ein Agent ist eine versionierte Konfiguration, die du bearbeitest und testest, und du führst ihn aus, indem du eine Session erstellst. Deine App kann über die [Sessions API](/api-reference/sessions/) Sessions erstellen, während du den Agent weiter bearbeitest.

## Was sind Sessions? {#what-are-sessions}
Eine Session ist eine Ausführung eines Agents mit ihrer Unterhaltung, ihren Tool-Aktivitäten und ihrer Ausgabe.

## Wie gebe ich einem Agent Zugriff auf externe APIs? {#how-do-i-give-an-agent-access-to-external-apis}

Binde das externe System als MCP-Server an und füge es zu den MCP-Verbindungen des Agents hinzu. Braucht der Server ein Bearer-Token, speichere es mit der [Secrets API](/agents/api-credentials#with-the-api) als nur schreibbares Secret, das an diese Server-URL gebunden ist. Token werden nur an diesen Server gesendet und erscheinen nie in Prompts oder in der Agent-Runtime. Siehe [Zugangsdaten für MCP-Tools](/agents/api-credentials).

## Wo finde ich Models? {#where-do-models-live}

Models haben einen eigenen [Katalog](https://www.sandbase.ai/models), weil sie wichtige Bausteine sind.

Du kannst ein Model direkt aufrufen, es aus einem verbundenen KI-Tool heraus nutzen oder in einem Agent verwenden.

## Muss ich Code schreiben? {#do-i-need-to-write-code}

Nicht immer.

[Verbinde dein KI-Tool](/setup/), wenn du Fähigkeiten darin nutzen willst, ohne Code zu schreiben.

Nutze die API-Referenz, wenn du SandBase aus deiner Anwendung aufrufen willst.

Nutze Build Agent, wenn du wiederverwendbare Arbeit in mehreren Schritten brauchst.

## Wie bekomme ich einen API-Schlüssel? {#how-do-i-get-an-api-key}

Öffne die Console, gehe zu **Developer → API Keys** und wähle **New key**.

Verwende den Schlüssel so:

```http
Authorization: Bearer sk-YOUR_KEY
```

## Wie funktioniert die Abrechnung? {#how-does-billing-work}

SandBase verwendet Guthaben und nutzungsbasierte Abrechnung.

Models, APIs, Agents und Runtime-Arbeit können unterschiedlich viel kosten. Aktuelle Nutzung und Preise findest du in der Console.

## Nächste Schritte {#next-steps}

- [Erste Schritte](/getting-started/)
- [Katalog der Models und APIs](https://www.sandbase.ai/models)
- [KI-Tools verbinden](/setup/)
- [Build Agent](/agents/)
- [API-Referenz](/api-reference/)
