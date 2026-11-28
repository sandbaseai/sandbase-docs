---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: Bei AI City Remix mitmachen
description: Hol dir AI-City-Remix-Credits, wähle eine Stadt und einen Skill, erstelle mit deinem lokalen Agent ein Video und lade es zur Prüfung hoch.
---

# Bei AI City Remix mitmachen {#enter-ai-city-remix}

Wähle auf der Event-Seite einen Skill und eine Stadt und übergib dann die vollständigen Anweisungen an deinen lokalen Agent. Nach der Erstellung lädt der Agent Video, Cover und Einreichungsdetails hoch und reicht sie zur Prüfung ein.


## Voraussetzungen {#prerequisites}

- Ein SandBase-Konto.
- Ein lokaler Agent mit Befehlsausführung und Dateizugriff.
- Ein Arbeitsordner für Video, Cover und Projektdateien.

Für deine erste lokale Einrichtung folge [Skill lokal verwenden](/guides/skills/local-use).

## 1. Event öffnen und Credits abholen {#_1-open-the-event-and-claim-credits}

1. Öffne [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) und lies die aktuellen [Event-Regeln](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en).
2. Klicke auf „Claim $5 free & create“ und melde dich an, wenn du dazu aufgefordert wirst.
3. Das System holt die Event-Credits ab und versucht, sie automatisch einzulösen. Prüfe Guthaben und Einlösestatus; verwende die Einlöseaktion, falls ein erneuter Versuch nötig ist.
4. Klicke danach auf „Create now“, um den Erstellungsdialog zu öffnen.

Zeitraum, Verfügbarkeit und Teilnahmeberechtigung stehen auf der Event-Seite. Modellaufrufe verbrauchen Credits entsprechend der tatsächlichen Nutzung; du kannst sie unter [Billing](https://www.sandbase.ai/console/billing) prüfen.

## 2. Modell-API-Key konfigurieren {#_2-configure-a-model-api-key}

Wenn dein Konto keinen nutzbaren API-Key hat, zeigt der Ablauf den Dialog „Create an API key“.

1. Prüfe das angezeigte Ausgabenlimit und das Ablaufdatum und klicke dann auf „Create API key“.
2. Klicke auf „Create with this key“. Der neue Key ist in den vollständigen Anweisungen enthalten, die du an den Agent übergibst.
3. Sende die vollständigen Anweisungen an einen Agent, dem du vertraust, und bewahre sie in einem privaten Workspace auf.

Für einen bestehenden Key konfigurierst du `SANDBASE_API_KEY` über die sicheren Einstellungen oder die Ausführungsumgebung deines lokalen Agents. Keys verwaltest du unter [API Keys](https://www.sandbase.ai/console/keys).

## 3. Skill und Briefing wählen {#_3-choose-a-skill-and-brief}

Der Dialog startet mit einem vorausgewählten offiziellen Skill, einer Stadt, einer Story und einer kreativen Richtung.

- Klappe „Official Skill“ auf, um Zusammenfassung und Details zu lesen und einen visuellen Ansatz zu wählen.
- Klappe „Creative brief“ auf, um nach einer Stadt zu suchen oder einen Ort auf der Karte auszuwählen.
- Mische die Vorschläge neu oder bearbeite Story und kreative Richtung direkt.
- Bestätige Kartenposition, unterstützte Sprache und Ausgabestil.

Verwende überprüfbare Quellen für Geschichte, Personen und Ereignisse. In den Details des ausgewählten Skills siehst du, welche Sprachen und Längen unterstützt werden.

## 4. Anweisungen kopieren und erstellen {#_4-copy-the-instructions-and-create}

1. Klicke im Prompt-Bereich auf „Copy all“.
2. Öffne den Projektordner in deinem lokalen Agent, starte eine Aufgabe und füge die vollständigen Anweisungen ein.
3. Sende sie ab, liefere angeforderte Eingaben, konfiguriere Abhängigkeiten und starte die Erstellung.

Die Anweisungen enthalten den ausgewählten Skill, das kreative Briefing, das Format der Einreichungs-Metadaten und die Upload-Autorisierung. Übergib sie vollständig, damit der Agent das Werk erstellen und einreichen kann.

„Preparing“ bedeutet, dass der Upload-Zugang vorbereitet wird. Mit „Retry“ bereitest du ihn erneut vor, mit „Complete brief“ ergänzt du fehlende Details.

## 5. Fortschritt der Erstellung verfolgen {#_5-follow-creation-progress}

Je nach Skill, Modellen und Videolänge kann die Erstellung zwischen einigen zehn Minuten und mehreren Stunden dauern und verbraucht Modell-Credits. Lass den Agent laufen und den Computer wach.

Füge derselben Aufgabe Anweisungen zu Budget und Fortschritt hinzu:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Verwende MiniMax M3.1 Flash über SandBase, wie es die aktuellen Event-Regeln verlangen. Halte dich bei Länge, Auflösung, Untertiteln und Dateigrößen an die Vorgaben der Event- und Upload-Seite.

## 6. Einreichen und Prüfstatus checken {#_6-submit-and-check-review-status}

Der Agent folgt den vollständigen Anweisungen, verwendet den offiziellen Upload-Client, lädt Video, Cover und Metadaten hoch und reicht sie zur Prüfung ein.

Öffne [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en), um den Fortschritt zu prüfen:

| Status | Nächster Schritt |
|---|---|
| Draft | Stelle den Film fertig, lade die Dateien hoch und reiche sie zur Prüfung ein. |
| Pending review | Verfolge den Prüfstatus. |
| Approved | Öffne die öffentliche Seite der Einreichung und teile sie. |
| Changes requested | Überarbeite gemäß dem Prüfhinweis und reiche erneut ein. |

Für einen bereits vorhandenen Film wählst du auf der Event-Seite „Upload existing video“, füllst die Details aus, lädst Video und Cover hoch und reichst zur Prüfung ein.

## 7. Upload fortsetzen {#_7-resume-an-upload}

Wenn die Autorisierung abläuft oder ein Upload unterbrochen wird, mach mit den ursprünglichen Dateien weiter:

1. Behalte Video, Cover, `entry.json` und den Arbeitsordner.
2. Suche denselben Entwurf unter My entries und klicke auf „Resume upload“.
3. Kopiere die neuen Fortsetzungsanweisungen in die ursprüngliche Aufgabe des Agents.
4. Bitte den Agent, die vorhandenen Dateien hochzuladen und einzureichen, und prüfe dann den Status unter My entries.

## 8. Einreichung teilen {#_8-share-your-entry}

Klicke auf der Seite einer genehmigten Einreichung auf „Share on X“, um ein vorausgefülltes Eingabefeld zu öffnen. Es enthält den Link zur Einreichung, `#AICityRemix`, `@SandbaseAI` und den offiziellen Event-Post.

Um einen Video-Post zu veröffentlichen, klicke zuerst auf „Download video“, füge die Datei im X-Eingabefeld hinzu, prüfe den Text und veröffentliche.

## Weitere Dokumentation {#related-documentation}

- [Skill lokal verwenden](/guides/skills/local-use)
- [Deinen Agent verbinden](/setup/)
- [API-Keys konfigurieren](/getting-started/api-keys)
