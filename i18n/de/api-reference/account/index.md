---
i18nSource: 3b9b3fc27f878cd5
title: Account API
description: Guthaben der Organisation und den aktuellen Ausführungsverlauf eines API-Schlüssels einsehen.
---

# Account API {#account-api}

Account-Endpunkte sind schreibgeschützt und arbeiten mit der Organisation, die aus dem Bearer-API-Schlüssel ermittelt wird.

| Vorgang | Endpunkt |
|---|---|
| [Guthaben abrufen](./balance) | `GET /v1/account/balance` |
| [Ausführungsverlauf auflisten](./history) | `GET /v1/account/history` |

Guthaben- und Kostenwerte sind exakte Dezimal-Strings. Behalte sie als Dezimalwerte bei, statt sie über
binäre Gleitkommaarithmetik umzurechnen.

Der Ausführungsverlauf ist für die Prüfung des laufenden Betriebs der letzten Zeit gedacht. Für die langfristige
Finanzabstimmung verwendest du Abrechnungsdatensätze oder Exporte.

Die Verlaufsfilterung verwendet rohe UTC-Zeitstempel. Ohne `request_id` wird der optionale Kompatibilitätsparameter `timezone` als IANA-Zeitzonenname validiert, verändert aber die Zeitstempel der Antwort nicht; der exakte `request_id`-Modus ignoriert ihn zusammen mit den anderen Filtern. Unbekannte `type`-Werte wenden keinen Filter nach Ausführungstyp an; verwende `multimodal`, `llm` oder `api` für einen wirksamen Filter. Nicht unterstützte `range`-Werte fallen auf `7d` zurück.

Verlaufseinträge können gespeicherte Anfrageparameter und Modellausgaben enthalten. Beschränke den Zugriff auf den API-Schlüssel entsprechend
und kopiere Verlaufsantworten nicht in Logs oder Support-Tickets, ohne sie vorher auf sensible Daten zu prüfen.
