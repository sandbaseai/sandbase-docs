---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Skill lokal verwenden
description: Wähle einen Skill im SandBase Lab, lade sein Paket herunter, richte den Modellzugriff ein und erstelle und speichere ein Projekt mit einem lokalen Agent.
---

# Skill lokal verwenden {#use-a-skill-locally}

Lade einen SandBase-Skill herunter und setze ein Projekt mit einem Agent auf deinem Computer um. Ein Skill enthält Anweisungen, Skripte und Beispiele. Der Agent folgt dem Workflow, der in der `SKILL.md` beschrieben ist.


## 1. Skill auswählen {#_1-choose-a-skill}

1. Öffne [SandBase Lab](https://www.sandbase.ai/lab/).
2. Sieh dir Beispiele wie Videos, Animationen und Karten an. Öffne einen Skill, der zu deinem Projekt passt.
3. Prüfe das Beispiel, die erforderlichen Eingaben, das Ausgabeformat und die unterstützten Sprachen.
4. Speichere das ZIP-Paket über die Download-Aktion des Skills.

Für einen Kartenfilm zur Stadtgeschichte beginnst du mit den Beispielen und Anweisungen von [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Lokalen Arbeitsordner vorbereiten {#_2-prepare-a-local-working-folder}

1. Erstelle einen Projektordner, etwa `my-city-film`.
2. Entpacke das vollständige Skill-ZIP dorthin und behalte Anweisungen, Skripte und Assets bei.
3. Öffne das Projekt in deinem lokalen Agent und gewähre Zugriff auf die Dateien und die Befehle, die der Workflow benötigt.
4. Folge den Installationsanweisungen auf der Skill-Seite oder bitte den Agent, die entpackte `SKILL.md` direkt zu lesen.

Ein Projekt kann diese Struktur haben:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Verwende die konkreten Dateinamen und Ausgabeorte, die der Skill vorgibt.

## 3. SandBase verbinden {#_3-connect-sandbase}

Füge `set up https://www.sandbase.ai/SKILL.md` in deinen Agent ein und bestätige die Browser-Anmeldung, die sich öffnet, oder führe `npx -y @sandbaseai/cli@latest connect` in einem Terminal aus. Starte danach eine neue Agent-Session, damit die SandBase-Tools geladen werden. Dieselben Optionen findest du in der Console unter [Build → AI tools](https://www.sandbase.ai/console/setup).

Den vollständigen Verbindungsablauf findest du unter [KI-Tools verbinden](/setup/).

Wenn die Skripte des Skills `SANDBASE_API_KEY` benötigen:

1. Öffne [API Keys](https://www.sandbase.ai/console/keys) und erstelle oder wähle einen Schlüssel für das Projekt.
2. Konfiguriere ihn über die sicheren Einstellungen deines lokalen Agents oder die Ausführungsumgebung der Skripte.
3. Bitte den Agent zu prüfen, ob der Zugriff eingerichtet ist, und den Skill-Workflow fortzusetzen.

Bewahre den Schlüssel in einer sicheren lokalen Konfiguration auf. Nimm in Ergebnisse, Quelldateien und öffentliche Screenshots nur Projektinformationen auf. Modellnutzung und Guthaben siehst du unter [Billing](https://www.sandbase.ai/console/billing).

## 4. Briefing geben {#_4-provide-a-brief}

Sag dem Agent, welchen Skill er verwenden soll, was entstehen soll, welche Anforderungen an die Ausgabe gelten und wie hoch dein Budget ist. Passe dieses Beispiel an dein Projekt an:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

Der Agent liest die Anweisungen, prüft Abhängigkeiten, verarbeitet Eingaben und generiert oder rendert das Projekt. Füge angeforderte Assets demselben Projekt hinzu und setze die Aufgabe fort.

## 5. Fortschritt verfolgen und Ergebnis prüfen {#_5-follow-progress-and-review-the-result}

Die Dauer hängt vom Skill, den Modellen, den Assets und der Ausgabelänge ab. Videoprojekte können zwischen einigen zehn Minuten und mehreren Stunden dauern. Lass den Agent laufen und den Computer eingeschaltet.

Frag in derselben Unterhaltung nach dem Fortschritt:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Öffne die gelieferten Dateipfade, prüfe Bild, Ton, Untertitel und Inhalt, und speichere die finalen Dateien.

## 6. Projekt überarbeiten {#_6-revise-the-project}

Fordere konkrete Änderungen in der ursprünglichen Aufgabe an und verwende die vorhandenen Assets wieder:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Wird die Ausführung unterbrochen, behalte den Arbeitsordner und bitte den Agent, beim aktuellen Schritt weiterzumachen.

## Nächste Schritte {#next-steps}

- [Bei AI City Remix mitmachen](/guides/skills/ai-city-remix)
- [Deinen Agent verbinden](/setup/)
- [API-Schlüssel konfigurieren](/getting-started/api-keys)
