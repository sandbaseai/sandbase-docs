---
i18nSource: d560e2374d91a8d6
title: Abrechnung und Guthaben
description: Prüfe das Guthaben deiner SandBase-Organisation, kaufe Guthaben mit Stripe oder Airwallex, richte die automatische Aufladung ein, löse Gutscheine ein und verstehe die Ausgabenkontrollen für API-Keys.
---

# Abrechnung und Guthaben {#billing-and-credits}

Diese Seite beschreibt die Abrechnungsverwaltung in der [SandBase Console](https://www.sandbase.ai/console). Preise und Tipps zur Kostenoptimierung findest du unter [Preise](/guides/billing).

SandBase rechnet unterstützte Workloads über das Guthaben der Organisation ab. Aktuelle Preise, Angebote, Zahlungsanbieter,
Mindestbeträge für Aufladungen und regionale Verfügbarkeit werden in der Console angezeigt und können sich unabhängig von
dieser Anleitung ändern.

## Guthaben {#balance}

Öffne [Developer → Billing](https://www.sandbase.ai/console/billing). Die Seite **Credits** zeigt für die aktive Organisation:

| Eintrag | Bedeutung |
|------|---------------|
| **Available balance** | Für Models und APIs nutzbares Guthaben |
| **Credit limit** | Ausgabenrahmen des Workspace |
| **Current level** | Kontostufe und zugehörige Concurrency |

Dasselbe Guthaben erscheint auf der Karte **Balance** im Console-Dashboard und im Seitenkopf, wenn du angemeldet bist.
Maßgeblich für Aktionen und Checkout-Bedingungen ist die Console; automatisiere nicht ihre internen
Netzwerkanfragen.

## Guthaben kaufen {#buy-credits}

1. Öffne [Billing](https://www.sandbase.ai/console/billing) und prüfe, ob **Credits go to** den Workspace anzeigt, den du aufladen möchtest.
2. Wähle unter **Buy credits** einen vordefinierten Betrag oder gib unter **Custom amount** einen Betrag in USD ein. Der Mindestbetrag steht auf der Seite.
3. Wenn mehrere **Payment provider** angeboten werden, wähle **Stripe** (weltweite Karten und Wallets) oder **Airwallex** (Karten und lokale Zahlungsmethoden).
4. Prüfe in der Vorschau **Pay**, **Bonus** und **Receive**, wähle dann **Continue with Stripe** (oder den gewählten Anbieter) und schließe den gehosteten Checkout ab.
5. Prüfe das aktualisierte Guthaben unter **Credit transactions**, bevor du einen kostenintensiven Workload startest.

SandBase speichert keine Kartendaten; die Zahlungsseite wird vom Anbieter gehostet.

### Bonus für die erste Aufladung {#first-top-up-bonus}

Wenn Konto und Workspace noch nie aufgeladen wurden, zeigt **Current offers** einen Bonus für die erste Aufladung. Die Seite nennt
den Bonusprozentsatz und die Obergrenze. Pro Konto und pro Workspace gilt ein Bonus; bei Erstattungen wird der Bonus
anteilig zurückgebucht. Der Bonus erscheint als eigene Zeile unter **Credit transactions**.

## Automatische Aufladung {#auto-top-up}

**Auto Top-up** lädt das Guthaben mit einer gespeicherten Karte auf, sobald es unter einen Schwellenwert fällt. Derzeit wird nur Stripe
unterstützt, und nur Workspace-Owner und Admins können die Funktion verwalten.

1. Wähle unter **Payment cards** die Option **Add Card** und speichere eine Karte in Stripe.
2. Wähle **Turn on auto top-up** und lege dann **When balance goes below**, **Top-up amount**, optional ein **Monthly limit** sowie die Karte fest.
3. Aktiviere **I authorize these automatic charges** und bestätige.

Ist das Monatslimit erreicht, pausiert die automatische Aufladung bis zum Ende des Kalendermonats (UTC). Automatische Belastungen
erscheinen unter **Credit transactions** mit dem Kanal `Auto top-up · Stripe`.

## Gutschein einlösen {#redeem-a-coupon}

Gib unter **Redeem a coupon** den **Coupon code** ein und wähle **Redeem credit**. Ein Gutschein gilt nur für den aktiven
Workspace, prüfe also zuerst die ausgewählte Organisation.

## Ausgabenkontrollen {#spending-controls}

| Kontrolle | Geltungsbereich | Verhalten |
|---------|-------|----------|
| Finanzierungsgrenze der Organisation | Gesamte Organisation | Verfügbares Guthaben plus ein ggf. konfiguriertes Kreditlimit; eine nicht gedeckte Anfrage kann HTTP 402 zurückgeben |
| Ausgabenlimit pro Key | Pro API-Key | Optionale Obergrenze pro Key, begrenzt durch das Guthaben der Organisation |
| Monatslimit der automatischen Aufladung | Gesamte Organisation | Begrenzt automatische Belastungen pro Kalendermonat (UTC) |

Wie du ein Ausgabenlimit pro Key festlegst, steht unter [API-Keys](/getting-started/api-keys).

## Aktivitäten und Analyse {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) hat zwei Tabs:

- **Request History** listet einzelne Anfragen mit API-Key, Modell, Status, Latenz und Kosten.
- **Usage** zeigt Anfragen und Kosten über 7 oder 30 Tage, **Model APIs by Archived Spend** und **Billing Records**. Beide Tabellen bieten **Export CSV**. Der Export der Abrechnungsdaten enthält eine Spalte **Free Quota**, die Aufrufe markiert, die durch das tägliche Freikontingent abgedeckt sind.

[Developer → Analysis](https://www.sandbase.ai/console/analytics) ergänzt **Overview**, **Cost analysis** und
**Health diagnostics** für die letzten 7 oder 30 vollständigen UTC-Tage.

Öffentliche Preise und Verträge zu Task-Kosten findest du unter [Preise und Nutzung](/guides/billing) und
[Task-Kosten abrufen](/api-reference/tasks/cost).
