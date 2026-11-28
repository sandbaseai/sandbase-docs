---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: Definiere, teste und führe wiederverwendbare, versionierte Agents in SandBase-Sessions aus.
---

# Build Agent {#build-agent}

In Build Agent definierst und testest du einen Agent und legst dann fest, wie er ausgeführt wird.

Ein Agent ist eine gespeicherte, versionierte Konfiguration: ein Modell, Anweisungen, ein Laufzeitprofil, Skills und MCP-Verbindungen zu externen Tools. Das Speichern eines Agents führt ihn nicht aus.

## Was ein Agent ist {#what-an-agent-is}

| Frage | Wo es festgelegt wird |
|---|---|
| Was soll er tun? | `instructions` |
| Welches Modell erledigt die Arbeit? | `model`, eine Modell-ID aus der [Models API](/api-reference/models/) |
| Was kann er? | [Skills](/agents/mcp-tools#skills), versionierte Anweisungs-Bundles |
| Welche externen Tools kann er aufrufen? | [MCP-Verbindungen](/agents/mcp-tools#mcp-connections), mit [Credentials](/agents/api-credentials), wenn der Server ein Token benötigt |
| Wie wird er ausgeführt? | In einer [Session](/agents/sessions) |

Jede wirksame Änderung erzeugt eine neue, unveränderliche Version. Du kannst Versionen jederzeit auflisten und eine frühere wiederherstellen.

## Wie ein Agent ausgeführt wird {#how-an-agent-runs}

Du führst einen Agent in einer [Session](/agents/sessions) aus. Eine Session ist eine `ses_`-Ressource, an die du Eingaben sendest und von der du Events streamst, ob für eine interaktive Unterhaltung, einen Testlauf oder einen Aufruf aus deiner Anwendung. Jede Session friert die Agent-Version ein, mit der sie gestartet wurde. So kannst du den Agent weiter bearbeiten, ohne bestehende Sessions zu verändern.

## Agent-Lebenszyklus: Entwurf → In einer Session testen → Aus deiner App ausführen → Sessions prüfen {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. Entwurf {#_1-draft}

Erstelle einen Agent in der Console unter **Build → Agents** oder mit [`POST /v1/agents`](/agents/agent-api). Beginne mit dem kleinsten sinnvollen Workflow und füge Skills und MCP-Verbindungen erst hinzu, wenn die Anweisungen sie benötigen.

### 2. In einer Session testen {#_2-test-in-a-session}

Erstelle eine Session für den Agent, sende repräsentative Eingaben und lies Ausgabe, Tool-Aktivität und Fehler. Teste fehlende Eingaben, nicht verfügbare Tools, leere Ergebnisse und Anforderungen an das Ausgabeformat, nicht nur den Idealfall.

### 3. Aus deiner App ausführen {#_3-run-from-your-app}

Erstelle mit der [Sessions API](/api-reference/sessions/) aus deiner Anwendung Sessions für den getesteten Agent.

### 4. Sessions prüfen {#_4-inspect-sessions}

Lies die Items und Turns jeder Session mit der Sessions API, um die vollständige Unterhaltung, Tool-Aktivität und Fehler zu prüfen.

## Checkliste für die Produktion {#production-checklist}

- `model` verwendet eine aktuelle Modell-ID aus der Models API.
- Skills sind auf eine Version gepinnt, wenn sich das Verhalten nicht unbemerkt ändern darf.
- MCP-Verbindungen stellen über `allowed_tools` nur die Tools bereit, die der Agent braucht.
- Tokens werden als [Secrets](/agents/api-credentials) gespeichert und nie in Anweisungen, Eingaben oder Metadaten geschrieben.
- Beim Erstellen von Sessions wird ein `Idempotency-Key` gesendet, und Retries verwenden ihn erneut.
- Session-Status und Fehler werden nach dem Start geprüft.

## Katalog-Agents {#catalog-agents}

Der öffentliche [Agent-Katalog](/api-reference/agents/catalog) listet Agents auf, die SandBase veröffentlicht hat. Du kannst einen Katalog-Agent lesen. Um ihn zu ändern, klonst du ihn zuerst mit `POST /v1/agents/catalog/{agent_id}/clone` in deine Organisation. Der Klon ist ein neuer privater Agent, der dir gehört und den du ausführen kannst.

::: tip OpenAI SDK verwenden
Agents, Sessions und Skills folgen der OpenAI Agents API, daher funktioniert das offizielle OpenAI SDK mit `base_url="https://api.sandbase.ai/v1"`. Verifizierte Beispiele und Unterschiede findest du unter [OpenAI-Kompatibilität](/agents/openai-compatibility).
:::

## Nächste Schritte {#next-steps}

- [Agent definieren](/agents/agent-api)
- [OpenAI-Kompatibilität](/agents/openai-compatibility)
- [Skills und MCP-Tools](/agents/mcp-tools)
- [Sessions](/agents/sessions)
