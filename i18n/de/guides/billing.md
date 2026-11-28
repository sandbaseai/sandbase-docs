---
i18nSource: 91c5a0d1b6de6434
title: Preise und Nutzung
description: Finde aktuelle Modellpreise, prüfe Task-Kosten und verwalte die Abrechnung von SandBase sicher.
---

# Preise und Nutzung {#pricing-and-usage}

SandBase rechnet nutzungsbasiert ab (Pay-as-you-go). Modellverfügbarkeit, Preisformeln, Cache-Multiplikatoren und
funktionsspezifische Gebühren können sich unabhängig voneinander ändern. Integrationen sollten daher Live-Metadaten lesen,
statt sich auf kopierte Preistabellen zu verlassen.

## Tägliche kostenlose API-Aufrufe {#daily-free-api-calls}

Jede Organisation erhält pro UTC-Tag 100 kostenlose Aufrufe von Daten-APIs (Suche, Social, Scraping, E-Commerce, Finanzen). Das
Kontingent teilen sich alle berechtigten Daten-APIs und alle Schlüssel der Organisation, und es wird um 00:00 UTC zurückgesetzt. LLMs und
Medienmodelle sind nicht berechtigt. Auch einige Daten-APIs sind ausgenommen: teurere oder per Formel bepreiste APIs, etwa manche
Batch-Endpunkte, Crawl-Endpunkte, Xiaohongshu PGY und die Douyin-Xingtu-Routen `kol-*`, werden ab dem ersten Aufruf berechnet.
Um ein Tool zu prüfen, führe `sandbase_inspect` aus: Berechtigte Tools haben `pricing.free_quota`, Tools ohne dieses Feld werden immer
berechnet.

- Aufrufe innerhalb des Kontingents werden nicht berechnet, und auch eine Organisation mit Guthaben null kann sie nutzen.
- Nach dem 100. Aufruf funktionieren berechtigte Aufrufe weiter und werden pro Aufruf zu dem Preis berechnet, den das Tool anzeigt. Sie werden
  nicht abgelehnt oder gedrosselt, weil das Kontingent aufgebraucht ist.
- Nicht genutzte Aufrufe verfallen und werden nicht auf den nächsten Tag übertragen.

In den [SandBase-MCP-Tools](/setup/) kennzeichnet `sandbase_inspect` berechtigte Tools mit `pricing.free_quota`
(`daily_limit`, `scope`, `resets`). `sandbase_account` liefert das heutige Kontingent als `free_api_quota` mit
`daily_limit`, `used_today`, `remaining` und `resets_at`; `used_today` und `remaining` fehlen, wenn die Zählung
vorübergehend nicht verfügbar ist. Nach der Abrechnung eines Runs melden `sandbase_run` und `sandbase_run_get` den `free_quota_status`:
`free` (durch das Kontingent abgedeckt), `overage` (nach Aufbrauchen des Kontingents berechnet) oder `degraded` (nicht berechnet,
weil die Kontingentzählung nicht verfügbar war).

## Abrechnung in der Console verwalten {#manage-billing-in-the-console}

Unter **Developer → Billing** siehst du dein Guthaben, kaufst Credits, richtest automatisches Aufladen ein, löst Gutscheine ein und verwaltest die Abrechnungseinstellungen deiner
Organisation. Unter **Developer → Activities → Usage** findest du Zusammenfassungen zu Anfragen, Tokens und Kosten auf Organisationsebene.

::: info Grenze der öffentlichen API
Endpunkte für Guthaben, Aufladen, Abrechnungsexport und organisationsweite Nutzung gehören derzeit nicht zur unterstützten
öffentlichen API. Automatisiere keine Netzwerkanfragen der Console und verlass dich nicht auf interne Console-Routen.
:::

## Aktuelle Modellpreise lesen {#read-current-model-pricing}

Ermittle zuerst ein aktiviertes Modell:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Rufe dann seine vollständige Model Card ab:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Der Listen-Endpunkt ist auf das Auffinden von Modellen ausgelegt und lässt detaillierte Token-, Cache- und Reasoning-Preise bewusst weg.
Lies die detaillierten Preise des gewählten Modells aus `model_card` in der Detailantwort. Es gibt keine allgemeingültige Formel,
die für jedes LLM, Medienmodell, Embedding-Modell oder jede API-Funktion gilt.

## Erfasste Kosten einer Task prüfen {#check-one-task-s-recorded-cost}

Wenn eine Operation eine Task-ID zurückgibt, frage ihren Abrechnungsdatensatz ab:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Die Antwort unterscheidet die aktuellen `cost` von `estimated_cost` und gibt an, ob die Abrechnung endgültig ist. Verwende
`cost` erst für den Abgleich der Abrechnung, wenn `settled` den Wert `true` hat. Task-Datensätze dienen dem operativen Nachschlagen
und sind kein Buchhaltungsjournal. Nutze für den Abgleich und längerfristige Aufzeichnungen die Abrechnungsdatensätze und CSV-Exporte unter **Developer → Activities → Usage**.

## Praktiken zur Kostenkontrolle {#cost-control-practices}

- Rufe die aktuelle Model Card ab, bevor du einen neuen Workload startest.
- Prüfe `capability_tags`, `supported_modes` und `unified_schema`; günstigere Alternativen helfen nur, wenn sie
  das benötigte Ein- und Ausgabeverhalten unterstützen.
- Begrenze unnötigen Prompt-Kontext und setze ein passendes Limit für Ausgabe-Tokens, wenn das gewählte Modell es unterstützt.
- Behandle Caching als modellspezifisch. Prüfe die Model Card und die zurückgegebenen Usage-Felder, statt einen providerweiten
  Rabatt anzunehmen.
- Speichere Task-IDs nur für die Abfrage der Task-Kosten; bei asynchroner `/v1/run`-Arbeit speicherst du die zurückgegebene opake Run-ID und fragst `GET /v1/run/{id}` nur ab, solange der Status `pending` oder `running` ist.
- Nutze die Ausgabenkontrollen, die die Console für deine Organisation bereitstellt.

## Zahlungsfehler {#payment-errors}

Eine API-Operation kann HTTP `402` zurückgeben, wenn die Organisation die Anfrage nicht finanzieren kann. Error-Envelopes unterscheiden sich je nach
API-Kompatibilitätsschicht. Werte daher den HTTP-Status und das dokumentierte Fehlerobjekt aus, statt auf einen bestimmten Meldungstext
zu prüfen. Nachdem du die Abrechnung in der Console geklärt hast, wiederhole die Anfrage gemäß den Idempotenz- und Wiederherstellungsregeln der Operation.

Video-Einreichungen werden vor dem Start außerdem anhand ihrer geschätzten Kosten geprüft. Eine einzelne Aufladung ab 10 $
hebt deine Kontostufe an, sodass mehr Video-Tasks gleichzeitig laufen können. Siehe
[Concurrency-Limits](/guides/concurrency-limits).

Die aktuellen öffentlichen Verträge findest du unter [Modelle und Preise](/for-agents/models), [Task Cost](/api-reference/tasks/cost) und
[Fehler](/api-reference/errors).
