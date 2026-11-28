---
i18nSource: 28b1ef75a197824a
title: KI-Tools verbinden
description: Gib Claude Code, Codex, Cursor, Kiro und anderen KI-Tools mit einem Prompt oder einem CLI-Befehl Zugriff auf den SandBase-Katalog mit Models und APIs.
---

# KI-Tools verbinden {#connect-ai-tools}

Die Seite [AI tools](https://www.sandbase.ai/console/setup) in der Console (**Build → AI tools**) verbindet SandBase mit dem Agent oder KI-Tool, das du bereits nutzt. Verbundene Tools können den SandBase-Katalog mit Models und APIs durchsuchen, das Eingabeschema und den Preis jedes Tools lesen und es ausführen. Jeder Aufruf wird dem aktiven Workspace berechnet.

Unterstützte Clients sind unter anderem Claude Code, Codex, Cursor, Kiro IDE und Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop und ChatGPT. Die aktuelle Auswahl steht auf der Seite AI tools.

## Schnellstart: einen Prompt einfügen {#quick-start-paste-one-prompt}

Füge diese Zeile in deinen Agent ein:

```text
set up https://www.sandbase.ai/SKILL.md
```

Der Agent liest den SandBase Skill, installiert die CLI und bittet dich, eine Anmeldung im Browser zu bestätigen. Du fügst keinen API-Key ein. Sobald der Agent meldet, dass der Client konfiguriert ist, starte eine neue Session oder die App neu, damit die `sandbase_*`-Tools geladen werden.

Der Skill benötigt Node.js 20 oder neuer auf dem Rechner, auf dem der Agent läuft.

## Weitere Verbindungswege {#other-ways-to-connect}

### CLI {#cli}

Verbinde dich über ein Terminal. Ohne `--client` konfiguriert die CLI jeden unterstützten Client, den sie findet:

```sh
npx -y @sandbaseai/cli@latest connect
```

Um einen einzelnen Client zu konfigurieren, übergib seine ID, zum Beispiel `codex`, `claude-code`, `cursor` oder `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

Das Installationsskript führt denselben Befehl aus:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

So listest du die Clients auf, die der Installer erkennt, ohne die lokale Konfiguration zu ändern:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` öffnet die Autorisierung im Browser, erstellt einen **CLI Login**-Key für den Workspace, den du bestätigst, und schreibt nur Client-Konfiguration, die SandBase gehört. Die quelloffene [SandBase CLI](https://github.com/sandbaseai/cli) dokumentiert jeden Client.

### Manuell konfigurierte MCP-Clients {#mcp-clients-you-configure-by-hand}

Angemeldete Nutzer sehen die MCP-Serveradresse unter **Other ways to connect** auf der Seite [AI tools](https://www.sandbase.ai/console/setup). Authentifiziere ihn mit einem [API-Key](/getting-started/api-keys) aus **Developer → API Keys** und bewahre den Key in der Secret-Konfiguration des Clients auf.

## Verbindung prüfen {#verify-the-connection}

Installation oder Autorisierung allein belegen nicht, dass ein Client verbunden ist. Prüfe Folgendes:

- der SandBase-Server bzw. Connector ist im Client sichtbar
- die `sandbase_*`-Tools sind in einer neuen Session auffindbar
- eine unbedenkliche Anfrage in natürlicher Sprache wird erfolgreich abgeschlossen

Führe bei CLI-verwalteten Clients nach dem Neuverbinden oder Ändern der Konfiguration die Diagnose aus:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` prüft die lokalen Zugangsdaten, den MCP-Eintrag und den Skill und führt dann einen Roundtrip zu SandBase aus. Den abschließenden Tool-Aufruf führst du immer im Client selbst aus.

Runs verbundener Tools erscheinen mit ihren Kosten unter [Activities](https://www.sandbase.ai/console/activities).

## Fehlerbehebung {#troubleshooting}

| Problem | Was du prüfen solltest |
|---|---|
| Tools erscheinen nicht | Starte eine neue Client-Session oder die App neu, führe `npx -y @sandbaseai/cli doctor --client <client>` aus und versuche es erneut. |
| Autorisierung fehlt | Führe `connect` erneut aus und bestätige die Browser-Anmeldung für den Workspace, der belastet werden soll. |
| Aufrufe schlagen mit HTTP 402 fehl | Lade unter [Billing](https://www.sandbase.ai/console/billing) Guthaben für den aktiven Workspace auf. |

## Verwaltete Konfiguration entfernen {#remove-the-managed-configuration}

Entferne nur den SandBase-Eintrag eines Clients:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

Der Befehl entfernt nur Konfiguration, deren Zugehörigkeit zu SandBase er verifizieren kann, und lässt fremde oder vom Nutzer verwaltete Einträge unverändert. Widerrufe anschließend den zugehörigen **CLI Login**-Key unter **Developer → API Keys**, wenn du ihn nicht mehr brauchst.

## Quellcode und Support {#source-and-support}

- [Quellcode](https://github.com/sandbaseai/cli)
- [npm-Paket](https://www.npmjs.com/package/@sandbaseai/cli)
- [Fragen und Beispiele](https://github.com/sandbaseai/cli/discussions)
- [Fehlerberichte](https://github.com/sandbaseai/cli/issues/new/choose)

## Nächste Schritte {#next-steps}

- [Katalog für Models und APIs](https://www.sandbase.ai/models)
- [Skill-Tutorials](/guides/skills/)
- [Agent erstellen](/agents/)
