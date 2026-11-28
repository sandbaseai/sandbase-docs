---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground (experimentell)
description: Echte SandBase-Sandboxes mit deinem eigenen API-Schlüssel ausprobieren. Erstellen, Befehle ausführen, Dateien nach Pause und Fortsetzen prüfen und Lifecycle-Events einsehen.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

Probiere die Sandbox API mit deinem eigenen Schlüssel aus. Vorgänge verbinden sich mit **sandbox.sandbase.ai** und können Kosten verursachen.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## Dein Schlüssel bleibt unter deiner Kontrolle {#your-key-stays-under-your-control}

- **Nur im Seitenspeicher.** Dieser Playground speichert deinen API-Schlüssel und deine Verbindungstoken weder im Browser-Speicher noch in Cookies, schreibt sie nicht in URLs und erfasst sie weder in der Seitenaktivität noch in Anfragebeispielen.
- **Jederzeit löschbar.** Wähle **Clear key**, um den Schlüssel, die Verbindungstoken und die angezeigte Aktivität zu entfernen, auch während eine Anfrage läuft. Auch durch Neuladen oder Verlassen dieser Seite werden sie gelöscht. Um dich erneut zu verbinden, musst du deinen Schlüssel noch einmal eingeben.
- **Nur für deine Anfragen verwendet.** Dein Schlüssel wird an SandBase übertragen, um die von dir angeforderten Sandbox-Vorgänge zu authentifizieren. Das Leeren dieser Seite widerruft den Schlüssel nicht; widerrufe ihn bei Bedarf unter [Developer → API Keys](https://www.sandbase.ai/console/keys).

Diese Zusagen betreffen den Umgang dieses Playgrounds mit Zugangsdaten. Sie bedeuten nicht, dass Sandbox-Aktivitäten oder dienstseitige Nutzungsdatensätze gelöscht werden. Gib keine Secrets in Befehle oder Dateien ein, deren Inhalte in deiner Sandbox verbleiben können.

## Ressourcen separat aufräumen {#clean-up-resources-separately}

Das Löschen deines Schlüssels bricht weder einen bereits vom Dienst empfangenen Vorgang ab noch löscht es eine Sandbox. Lösche Instanzen, wenn du fertig bist. Ist das Ergebnis einer Erstellung unbekannt, prüfe deine Instanzen, bevor du eine weitere erstellst. Notiere dir alle Instanz-IDs, die du zum Aufräumen brauchst, bevor du diese Seite leerst.

[Überblick und Funktionen](./index) · [Schnellstart / E2B SDK](./quickstart)
