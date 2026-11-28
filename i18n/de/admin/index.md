---
i18nSource: adfacb669489863e
title: Konto und Abrechnung
description: Verwalte deine SandBase-Organisation, API-Keys, Abrechnung, Nutzung und Limits.
---

# Konto und Abrechnung {#account-and-billing}

Deine Organisationseinstellungen legen fest, wem die Nutzung zugeordnet wird, wie sich Anwendungen authentifizieren und wie Ausgaben überwacht werden.

## Was du verwaltest {#what-you-manage}

| Bereich | Wofür |
|---|---|
| [Organisationen](/admin/organizations) | Workspace-Grenze, Mitglieder und Eigentümerschaft verwalten |
| [API-Keys](/getting-started/api-keys) | Anwendungs-Credentials erstellen, rotieren und widerrufen |
| [Abrechnung und Credits](/admin/billing) | Guthaben prüfen, Credits kaufen, automatisches Aufladen einrichten und die Nutzung unter Activities und Analysis prüfen |
| [Preise und Nutzung](/guides/billing) | Modellpreise, tägliche kostenlose API-Aufrufe und die Kosten einer Aufgabe nachschlagen |
| [Rate Limits](/guides/rate-limiting) | Anfragelimits und sicheres Retry-Verhalten verstehen |

## Empfohlene Einrichtung {#recommended-setup}

1. Prüfe, ob du in der richtigen Organisation arbeitest.
2. Erstelle separate API-Keys für Entwicklung, Staging und Produktion.
3. Benenne Keys nach Anwendung und Umgebung.
4. Prüfe Activities und Abrechnung nach den ersten Produktionsanfragen.
5. Widerrufe ungenutzte Keys und untersuche unerwartete Nutzung umgehend.

## Eigentümerschaft und Zugriff {#ownership-and-access}

API-Keys und Nutzung gehören zu einer Organisation. Wenn du die Organisation wechselst, ändern sich die in der Console sichtbaren Ressourcen, Keys und der Abrechnungskontext. Bevor du die Produktionskonfiguration änderst, prüfe die ausgewählte Organisation und stimme die Key-Rotation mit den Anwendungen ab, die den Key verwenden.

## Sicherheitsgrundlagen {#security-basics}

- Speichere Keys in Umgebungsvariablen oder einem Secrets Manager.
- Füge Keys niemals in Agent-Anweisungen, Quellcode, Screenshots oder Support-Nachrichten ein.
- Verwende für jede Anwendung und Umgebung einen eigenen Key.
- Widerrufe einen Key sofort, wenn er offengelegt worden sein könnte.
- Überwache Activities auf unerwartetes Volumen, unerwartete Modelle oder Endpunkte.
