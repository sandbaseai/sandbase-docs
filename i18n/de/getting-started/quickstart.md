---
i18nSource: 8cb9626a2127cb8d
title: Schnellstart
description: "Wähle, wie du SandBase nutzen willst: auf der Plattform, über die API oder mit deinem Agenten. Finde Skills und Tools, folge den Schritten und starte mit den SDK- oder CLI-Repositories."
pageClass: quickstart-page
---

# Schnellstart {#quick-start}

## Wähle, wie du SandBase nutzen willst {#connect}

Das sind **drei alternative Einstiege**, keine drei Schritte, die du alle durchlaufen musst. Verwende für alle dasselbe SandBase-Konto und denselben Workspace.

<QuickstartPaths />

Du brauchst nur eine fertige Lösung für eine Aufgabe? [Entdecke Tools](#use-tools) oder [wähle einen Skill](#use-skills). Öffentliche Kataloge und die Dokumentation kannst du auch ohne Anmeldung durchsuchen.

### Mit den Open-Source-Repositories starten {#start-from-the-open-source-repositories}

- **[SandBase — SDKs und Beispiele](https://github.com/sandbaseai/sandbase)**: Clients für Python, TypeScript und Go, API-Beispiele und Workflows für gehostete Agents. Nutze es, wenn du deine eigene Anwendung baust.
- **[SandBase CLI und MCP](https://github.com/sandbaseai/cli)**: Installiere und verbinde dein KI-Tool oder finde und führe Capabilities im Terminal aus. Nutze es mit deinem bestehenden Agenten.

## Bevor du anfängst: Anmelden {#create-account}

Melde dich an, bevor du einen Playground nutzt, einen gehosteten Skill ausführst oder einen API-Schlüssel erstellst. Kostenlose Tools, die ohne Konto funktionieren, kannst du direkt verwenden. **Bereits angemeldet? Überspringe diesen Schritt** und prüfe, ob das Kontomenü den gewünschten Workspace anzeigt.

SandBase verwendet GitHub oder Google. Eine separate Registrierung mit E-Mail und Passwort gibt es nicht.

1. Öffne [Konto erstellen / Anmelden](https://www.sandbase.ai/login){target="_blank"}.
2. Schließe die Sicherheitsprüfung ab und wähle dann **Sign in with GitHub** oder **Sign in with Google**.
3. Bestätige den Zugriff im Fenster des Anbieters.
4. Kehre zur zuvor genutzten Seite zurück oder öffne die [Console](https://www.sandbase.ai/console){target="_blank"}.

Bei der ersten Anmeldung werden dein Konto und ein **persönlicher Workspace** angelegt. Du musst keine Organisation erstellen, bevor du SandBase ausprobieren kannst.

Wird dir ein Startguthaben angezeigt, kannst du ohne Zahlungsmethode loslegen. Die Karte **Balance** im Dashboard der Console und [Billing](https://www.sandbase.ai/console/billing){target="_blank"} zeigen das aktuelle Guthaben.

## Auf der Plattform {#use-on-website}

Wähle diesen Weg, wenn du ein Model, eine API oder einen Agent zuerst im Browser ausprobieren willst, ohne Client-Installation und ohne Code.

1. Melde dich an und öffne dann den Katalog:
   - [Sprachmodelle](https://www.sandbase.ai/models){target="_blank"}
   - [Bild- und Videomodelle](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Öffne die Detailseite eines Modells oder einer API und wähle **Playground**, sofern verfügbar.
3. Gib die erforderlichen Eingaben ein, etwa einen Prompt, ein Bild, eine Suchanfrage oder eine URL. Prüfe vor dem Ausführen den angezeigten Preis.
4. Führe die Anfrage aus und sieh dir den zurückgegebenen Text, die Daten, das Bild, das Video oder den Aufgabenstatus an.

Für den Playground auf der Website brauchst du keinen eigenen API-Schlüssel. Bietet eine Capability keinen Playground, nutze ihren Tab **API** und folge dem API-Weg unten.

## Über die API {#call-api}

Wähle diesen Weg, wenn du deiner App eine Capability hinzufügen willst.

1. Verwende einen gültigen Schlüssel für deinen gewünschten Workspace erneut oder erstelle unter [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} mit **New key** einen [API-Schlüssel](/getting-started/api-keys). Kopiere ihn sofort; er wird nur einmal angezeigt.
2. Filtere den Katalog und öffne eine Detailseite:
   - [Sprachmodelle](https://www.sandbase.ai/models){target="_blank"} — filtern nach Anbieter, Fähigkeiten, Kontext und Preis
   - [Bild- und Videomodelle](https://www.sandbase.ai/models/image-video){target="_blank"} — multimodale Modelle wie Text-to-Image, Image-to-Image, Text-to-Video und Image-to-Video filtern
   - [APIs](https://www.sandbase.ai/apis){target="_blank"} — API-Ressourcen nach Plattform und Datenquelle filtern
3. Öffne den Tab **API**, kopiere die Beispielanfrage und fülle die Pflichtfelder dieses Endpunkts aus.
4. Speichere deinen SandBase-Schlüssel in einer Umgebungsvariablen auf dem Server und führe die Anfrage aus. Schreib ihn nicht in Browser-Code oder ein öffentliches Repository.
5. Prüfe die Antwort. Folge bei einer asynchronen Aufgabe dem Polling-Beispiel des Endpunkts, bis sie abgeschlossen ist.

Beispielaufruf eines Sprachmodells für **Bash / zsh** (macOS, Linux oder Windows mit WSL). Ersetze den Platzhalterschlüssel lokal. Für andere Umgebungen verwendest du die Beispiele für Python, TypeScript oder Go im Repository unten; Shell-Befehle sind nicht mit PowerShell austauschbar.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Mit Code starten: [SandBase SDKs und Beispiele auf GitHub](https://github.com/sandbaseai/sandbase).

Mehr erfahren: [Erster API-Aufruf](/getting-started/first-call).

## Mit deinem Agenten {#use-in-ai-tool}

Wähle diesen Weg, wenn du Claude Code, Codex, Cursor, Kiro oder einen anderen unterstützten Client nutzt und SandBase Models und APIs in dieser App haben willst.

**Für die automatische lokale Einrichtung:** Dein Client muss Befehle ausführen können, und auf seinem Rechner muss Node.js 20+ mit npm installiert sein. Nutzt du einen reinen Chat-Client, folge stattdessen den [clientspezifischen Verbindungsanweisungen](/setup/).

1. Öffne [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} in der Console.
2. Füge diese Zeile in den Chat deines KI-Assistenten ein und sag ihm dann, was du bauen willst. Das ist eine Chat-Anweisung, kein Shell-Befehl:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Bestätige die Browser-Anmeldung, die der Agent öffnet. Du musst keinen API-Schlüssel einfügen.
4. Starte eine neue Session oder starte die App neu, damit die SandBase-Tools geladen werden.
5. Bitte den Agenten, das passende Tool zu finden und zu prüfen, und dann eine begrenzte Anfrage innerhalb deiner Berechtigung und deines Budgets auszuführen. Lass ihn bei der Entwicklung die Antwort in dein Projekt integrieren und den Ausführungsbefehl sowie die tatsächlichen Testergebnisse liefern. Das Finden eines Tools allein belegt noch keinen erfolgreichen Aufruf einer Business-API.

Lieber im Terminal? Führe `npx -y @sandbaseai/cli@latest connect` aus. Es konfiguriert die erkannten unterstützten Clients; um nur einen zu konfigurieren, verwende `npx -y @sandbaseai/cli@latest connect --client codex` (ersetze `codex` durch deinen unterstützten Client). Starte diesen Client danach neu. Prüfe vor einem kostenpflichtigen Run den ausgewählten Workspace.

Du kannst zum Beispiel fragen:

> Finde eine SandBase API, mit der sich öffentliche X-Posts über KI-Agenten durchsuchen lassen. Prüfe zuerst die erforderlichen Eingaben und den Preis und nenne mir die Kosten einer Anfrage, bevor du sie ausführst. Behalte im Ergebnis die ursprünglichen Quelllinks bei.

Quellcode und Installationsanleitung: [SandBase CLI und MCP auf GitHub](https://github.com/sandbaseai/cli).

Mehr erfahren: [KI-Tools verbinden](/setup/).

### Lass dir von deinem KI-Assistenten beim Bauen helfen {#start-with-your-agent}

Der [Setup-Skill](https://www.sandbase.ai/SKILL.md) führt deinen Agenten passend zu deiner aktuellen Situation: noch kein Konto, ein vorhandener API-Schlüssel, ein bereits verbundenes Tool, ein bestehendes Projekt oder eine neue Funktion. Er prüft die Eingaben und den Preis des Endpunkts, hilft bei der Umsetzung der Integration und unterscheidet zwischen Einrichtung, verifiziertem Aufruf und funktionierender Funktion. Nenne ihm dein Ziel und ein eventuelles Ausgabenlimit; füge deinen Schlüssel nicht in den Chat ein.

Du hast schon einen Schlüssel oder ein Projekt? Sag es ihm; du musst nicht von vorn anfangen. Zum Beispiel: „Ich habe einen SandBase-Schlüssel. Füge diesem Projekt eine Similarweb-Traffic-Abfrage hinzu; prüfe die API und zeig mir zuerst die Kosten des Live-Tests.“ Ein Assistent, der keine Befehle ausführen oder Tools laden kann, braucht den [clientspezifischen Einrichtungsweg](/setup/).

[Gib deinem Agenten den Markdown-Schnellstart](https://www.sandbase.ai/quickstart.md) oder nutze die Schritte unten. Die Installation des Setup-Skills erstellt noch keinen gehosteten Agent.

### Optional: Einen gehosteten Agent auf SandBase ausführen {#build-agent}

Wähle diesen Weg, wenn die Arbeit mehrere Schritte hat oder wiederverwendet werden soll.

1. Öffne [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} und wähle **Create**.
2. Fülle **Overview** und **Instructions** aus.
3. Wähle ein **Model**.
4. Füge unter **Capabilities** Skills und MCP-Tools hinzu und lege dann die **Runtime** fest.
5. Wähle **Create & Chat**, um den Agent in einer Session zu testen.
6. Rufe die getestete Version über den Tab **API** des Agents aus deiner App auf.

Mehr erfahren: [Build Agent](/agents/). Wie du dasselbe im Code mit dem offiziellen OpenAI SDK machst, steht unter [OpenAI-Kompatibilität](/agents/openai-compatibility).

## Skills, Tools und weitere Bauwege {#skills-and-tools}

Wähle die Ressource, die zu deiner Aufgabe passt. Um eine API zu nutzen, musst du weder einen Skill installieren noch einen gehosteten Agent erstellen.

- **[Tools](https://www.sandbase.ai/tools):** Erledige eine bestimmte Aufgabe in einer fertigen Oberfläche, etwa Text formatieren oder öffentliche Daten nachschlagen.
- **[Skills](https://www.sandbase.ai/skills):** Gib einem Agenten einen wiederverwendbaren Workflow mit Anweisungen, Skripten und Beispielen.
- **Models und APIs:** Rufe eine Capability aus einem Playground, deinem Code oder einem verbundenen Agenten auf. Entdecke [Sprachmodelle](https://www.sandbase.ai/models), [Bild und Video](https://www.sandbase.ai/models/image-video) oder [Daten-APIs](https://www.sandbase.ai/apis).
- **[Gehostete Agents](/agents/):** Konfiguriere einen wiederverwendbaren Agent auf SandBase und führe ihn dort aus.
- **[Sandboxes](/sandbox/):** Gib Code eine isolierte Umgebung, in der er ausgeführt werden und mit Dateien arbeiten kann.

### Ein Tool verwenden {#use-tools}

1. Öffne [Tools](https://www.sandbase.ai/tools) und wähle die Aufgabe, die du erledigen willst.
2. Lies die Eingabeanforderungen des Tools und die Angabe zu Preis oder Kontingent. Kostenlose Hilfsprogramme funktionieren ohne Konto; Daten-Tools erfordern zum Ausführen eine SandBase-Anmeldung, und Modelltests können deinen eigenen Schlüssel erfordern.
3. Gib den verlangten Text, die URL, die Datei oder andere Eingaben ein und starte dann die Ausführung des Tools.
4. Prüfe die Ausgabe und nutze, wo vorhanden, die Aktion zum Kopieren oder Herunterladen. Bei einem Daten-Tool verwendest du die verlinkte API und das Anfragebeispiel, wenn du dieselbe Aufgabe automatisieren willst.

**Das kostenlose Tageskontingent gilt gemeinsam für den Workspace** und ist kein eigenes Kontingent pro Tool. Prüfe vor dem Ausführen die Berechtigung und den angezeigten Preis; ein kostenloses Hilfsprogramm macht einen Modell- oder API-Aufruf nicht kostenlos.

### Einen Skill verwenden {#use-skills}

1. Öffne [Skills](https://www.sandbase.ai/skills), wähle einen Workflow und lies seine Beispiele, erforderlichen Eingaben und Abhängigkeiten.
2. Wähle eine der Optionen, die auf der Detailseite des Skills verfügbar sind:
   - **Run online:** Melde dich an und führe das gehostete Beispiel aus, sofern angeboten. Verfolge den Fortschritt und öffne die erzeugte Ausgabe oder die Dateien. Prüfe das angezeigte Kontingent; Verfügbarkeit und Grenzen unterscheiden sich je nach Skill.
   - **Install / Download:** Melde dich an, um das Paket herunterzuladen, sofern angeboten. Entpacke das vollständige Paket in einen Arbeitsordner und folge dann seiner Installationsanleitung oder bitte deinen lokalen Agenten, die `SKILL.md` zu lesen.
3. Für die lokale Nutzung gibst du deine Aufgabe, die Eingaben, die gewünschte Ausgabe und dein Ausgabenlimit an. Verbinde SandBase über den [Agent-Weg](#use-in-ai-tool); wenn die Skripte des Skills einen Schlüssel brauchen, konfiguriere ihn in der Ausführungsumgebung, statt ihn in den Chat einzufügen.
4. Prüfe das tatsächliche Ergebnis. Das Herunterladen eines Skills oder das Verbinden deines Agenten bedeutet nicht, dass der Workflow erfolgreich gelaufen ist.

Der SandBase-**Setup-Skill** verbindet deinen Client; Katalog-Skills beschreiben einzelne Workflows. Prüfe vor der Installation die Abhängigkeiten und den unterstützten Client jedes Skills. Modell- und API-Aufrufe eines lokalen Workflows können Nutzungsgebühren verursachen.

Eine vollständige Anleitung, inklusive Eingabeordnern und gespeicherten Ergebnissen, findest du unter [Einen Skill lokal verwenden](/guides/skills/local-use).

## Optional: Einen Team-Workspace teilen {#create-organization}

API-Schlüssel, Nutzung und Abrechnung gehören zu einer Organisation. Bleib im persönlichen Workspace, wenn du allein evaluierst. Erstelle ein Team, wenn mehrere Personen Schlüssel und Ausgaben teilen.

| Workspace | Wann verwenden |
|---|---|
| **Persönlich** | Wird bei der ersten Anmeldung automatisch erstellt. Einer pro Nutzer. |
| **Team** | Gemeinsame Mitglieder, Schlüssel und gemeinsames Guthaben. Erstelle ihn für ein Unternehmen oder Projekt. |

### Ein Team erstellen {#create-team}

1. Öffne [Team erstellen](https://www.sandbase.ai/console/members?create=1){target="_blank"} oder wähle **Create Team** im Kontomenü oben rechts in der Console.
2. Gib einen **Team name** ein und wähle dann **Create team**.
3. Prüfe, ob das Kontomenü dieses Team jetzt als aktiven Workspace anzeigt.
4. Wähle unter **Developer → Team** die Option **Add member**, gib die **Account email** eines bestehenden SandBase-Kontos ein und wähle die **Workspace role** (Member oder Admin).

Eine eingeladene Person muss bereits ein SandBase-Konto haben. Hat sie keines, schick ihr [diese Seite](/getting-started/quickstart), damit sie sich zuerst anmeldet, und füge sie dann hinzu.

Gehörst du zu mehr als einer Organisation, wechselst du im Kontomenü. Schlüssel und Abrechnung richten sich nach der **aktiven** Organisation. Rollen sind unter [Organisationen](/admin/organizations) beschrieben.

## Prüfen, ob alles funktioniert {#confirm-it-works}

Du bist startklar, wenn alle folgenden Punkte zutreffen:

- Das Kontomenü der Console zeigt die Organisation, die du verwenden willst.
- Du hast einen Weg abgeschlossen: einen API-Aufruf, einen Run auf der Website, ein verbundenes KI-Tool oder einen Agent.
- Eine Anfrage ist erfolgreich.

Schlägt die Anfrage fehl, prüfe die aktive Organisation, den Schlüssel und [Fehler](/guides/error-handling). Lade unter [Billing](https://www.sandbase.ai/console/billing){target="_blank"} Guthaben auf, wenn der Workspace kein Restguthaben mehr hat.

### Wenn du nicht weiterkommst {#if-you-get-stuck}

| Was du siehst | Was du prüfen solltest |
| --- | --- |
| Anmeldung erforderlich | Melde dich an, kehre zur ursprünglichen Seite zurück und prüfe den aktiven Workspace. |
| Ungültiger Schlüssel oder Zugriff verweigert | Prüfe, ob der Schlüssel zum gewünschten Workspace gehört und Zugriff auf den Endpunkt hat. Guthaben aufzuladen behebt keine Berechtigungsprobleme. |
| Unzureichendes Guthaben oder Kontingent erschöpft | Lies die Antwort: Prüfe bei einem Guthabenproblem Billing, bei einem Kontingentlimit die angezeigte Zeit bis zum Zurücksetzen. |
| Keine Tools in deinem Agenten | Starte eine neue Client-Session und folge dann der Diagnose unter [KI-Tools verbinden](/setup/). |
| Aufgabe läuft noch | Verfolge den zurückgegebenen Aufgabenstatus oder die Fortschrittsanzeige der Seite. Sende dieselbe kostenpflichtige Anfrage nicht wiederholt. |

## Abrechnung und Nutzung {#billing-and-usage}

Nach der Anmeldung kannst du die Ausgaben der aktiven Organisation prüfen:

<QuickstartResources group="ops" />

## Wie es weitergeht {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — eine Aufgabe im Browser erledigen
- [Skills](https://www.sandbase.ai/skills) — einen wiederverwendbaren Agent-Workflow finden
- [API-Schlüssel](/getting-started/api-keys) — Schlüssel der Organisation erstellen und rotieren
- [Katalog der Models und APIs](https://www.sandbase.ai/models) — Models, APIs und Agents auf der Website ausprobieren
- [KI-Tools verbinden](/setup/) — deinem KI-Tool den SandBase-Katalog bereitstellen
- [Build Agent](/agents/) — wiederverwendbare Agents erstellen
- [API-Referenz](/api-reference/) — mit Code integrieren
