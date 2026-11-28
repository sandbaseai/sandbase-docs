---
i18nSource: 4191d2eb16a594f5
title: "Sandbox: Überblick und Funktionen"
description: Erstelle Sandboxes mit dem E2B SDK oder der SandBase Console, prüfe Status, Logs und Metriken, und erkunde das separate experimentelle Playground.
---

# Sandbox: Überblick und Funktionen {#sandbox-overview-and-capabilities}

Sandbox stellt isolierte Umgebungen bereit, in denen du Befehle ausführst, Code ausführst und Dateien liest oder schreibst. Pausiere eine Instanz, verbinde dich erneut und lies eine Datei zurück, um die Persistenz zu prüfen.

[Quickstart / E2B SDK](./quickstart) · [Playground öffnen (experimentell)](./playground)

Nutze das [offizielle E2B SDK](./quickstart), um Sandbox in deine Anwendung zu integrieren. Melde dich in der [Sandbox Console](https://www.sandbase.ai/console/sandboxes) an, um Sandboxes zu erstellen und Status, Logs und Metriken der Instanzen einzusehen. Eine Einführung bietet die [Sandbox-Produktübersicht](https://www.sandbase.ai/sandbox). Der Rundgang und die Funktionstabelle unten beschreiben das separate experimentelle Playground.

## Fünf-Minuten-Rundgang durch das Playground {#a-five-minute-playground-walkthrough}

1. Gib einen [API-Schlüssel](/getting-started/api-keys) mit Sandbox-Berechtigungen ein. Beim Verbinden werden nur Templates und Instanzen gelesen.
2. Wähle ein verfügbares Template, bestätige den Ressourcenhinweis und erstelle eine kurzlebige Instanz.
3. Führe das Systeminformations- oder Python-Beispiel aus. Verfolge Ausgabe und Prozess-Events neben dem Befehlsbereich.
4. Schreibe eine Textdatei und prüfe sie, pausiere die Instanz, setze sie fort und lies dieselbe Datei erneut.
5. Sieh dir Lebenszyklus-Events, Metriken, Logs und Nachweise zur Maschinenzeit an. Lösche deine Instanz, wenn du fertig bist.

Ein Neuladen der Seite löscht die Zugangsdaten der Seite und den lokalen Vorgangsverlauf; Sandboxes werden dabei nicht gelöscht. Laufende Instanzen folgen dem Server-Timeout. Pausierte Instanzen können Ressourcen belegen. Notiere die Instanz-IDs und nutze die Tools deiner Organisation, um Ressourcen nach dem Verlassen der Seite abzugleichen und aufzuräumen.

## Funktionen und Grenzen {#capabilities-and-boundaries}

| Funktion | Unterstützung im Playground |
| --- | --- |
| Erstellen, Auflisten, Pausieren, Fortsetzen, Timeout verlängern, Löschen | Verfügbar; ändernde Aktionen gelten nur für Instanzen, die in dieser Seitensitzung erstellt wurden |
| Befehle und Textdateien | Verfügbar; Befehle laufen bis zu 25 Sekunden, die Dateibearbeitung ist auf `/tmp/` und 32 KiB beschränkt |
| Lebenszyklus-Events, Logs, Metriken, Maschinenzeit | Verfügbarkeit hängt von der Umgebung ab; prüfe die zurückgegebenen Ergebnisse |
| KI-Chat und Gesprächskontext | Nicht integriert; erfordert eine Modellkonfiguration und einen Agent-Workload |
| PTY, Anwendungsports, Webhooks, Template-Builds | In dieser Oberfläche nicht verfügbar |
| Snapshots und Fork | In diesem Playground nicht verfügbar |

Shell-Interaktion ist kein KI-Chat. Wiederherstellung von Instanzen, Dateipersistenz, Fortbestehen von Prozessen und Gesprächskontinuität sind getrennte Dinge, die du jeweils prüfen musst.

## Events verstehen {#understanding-events}

Einträge unter **Sandbox lifecycle** sind native Server-Events, die beim Aktualisieren abgerufen werden und verzögert eintreffen können. Einträge unter **Sandbox process** beschreiben Prozessstarts und gestreamte Ausgaben. Einträge unter **Playground** protokollieren den lokalen Abschluss oder Fehlschlag einer Anfrage; sie sind keine Lebenszyklus-Events des Dienstes.

Eine leere Liste beweist keine Nutzung von null, und fehlende Events beweisen nicht, dass ein Vorgang fehlgeschlagen ist. Nachweise zur Maschinenzeit sind keine endgültige Rechnung. Gleiche nach einem Timeout oder einer unterbrochenen Verbindung die Instanzen ab, bevor du eine weitere Create-Anfrage sendest.

## Sichtbarkeit von Templates {#template-visibility}

Templates können öffentlich oder privat für deine Organisation sein. Die Anzahl ist nicht festgelegt. Einträge ohne Namen bleiben sichtbar und verwenden Aliase oder IDs als Ersatzbezeichnung. Welche Templates du sehen und nutzen kannst, hängt vom Zugriff deiner Organisation und der Verfügbarkeit der Templates ab.

## Sandboxes und Agent-Sessions {#sandboxes-and-agent-sessions}

Agents-Sessions laufen in der gehosteten Cloud von SandBase. Sie sind von den Sandbox-Instanzen getrennt, die du mit dem E2B SDK erstellst, und die Agents API stellt keine Sandbox-Instanzen bereit. Siehe [Sessions](/agents/sessions).
