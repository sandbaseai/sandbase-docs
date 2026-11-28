---
i18nSource: fc051d55a0cfa8bd
title: Concurrency-Limits
description: Wie viele Tasks deine Organisation gleichzeitig ausführen kann, wie das Limit mit deiner Kontostufe wächst und wie du 429 und 402 bei Video-Übermittlungen behandelst.
---

# Concurrency-Limits {#concurrency-limits}

Concurrency-Limits legen fest, wie viele Tasks deine Organisation gleichzeitig in Bearbeitung haben kann. Jede Organisation hat eine Kontostufe, und die Stufe bestimmt ihr Concurrency-Limit. Ist das Limit erreicht, werden neue Übermittlungen an den unten genannten geprüften Endpoints mit `429` abgelehnt, bis einer deiner laufenden Tasks endet. Sie werden nicht in eine Warteschlange gestellt.

Das Limit gilt für die gesamte Organisation über alle API-Keys hinweg. Welche Übermittlungen geprüft werden, hängt vom Endpoint ab:

- `POST /v1/run` und Platform-API-Aufrufe über `/v1/api/{vendor}/...` werden für jeden Modelltyp geprüft, einschließlich Bild-, Audio-, LLM- und Daten-API-Operationen.
- Andere Endpoints wie Chat Completions, Responses, Messages, OpenAI Images sowie die protokollkompatiblen Gemini- und Volcengine-Endpoints prüfen nur Video-Übermittlungen.

## Funktionsweise {#how-it-works}

Wenn du einen geprüften Task übermittelst, zählt SandBase die Tasks, die deine Organisation gerade in Bearbeitung hat, also Tasks im Zustand `pending` oder `running`. Hat diese Anzahl dein Limit bereits erreicht, wird die Übermittlung sofort mit `429` abgelehnt. Es wird kein Task erstellt und nichts berechnet.

Gezählt wird jede laufende Anfrage deiner Organisation, nicht nur Videos. Eine gestreamte Chat Completion, die beim Übermitteln eines geprüften Tasks noch offen ist, belegt einen Slot. Wenn dieselbe Organisation lange Streaming-Chats und Video-Jobs ausführt, berücksichtige bei der Kapazitätsplanung alle davon.

Ein Slot wird frei, sobald ein Task einen Endzustand erreicht (`completed`, `failed` oder `timeout`). Auf deiner Seite musst du nichts freigeben. Da Slots beim Abschluss von Tasks frei werden und nicht nach einem Timer, unterscheidet sich dieser `429` von einem minutenbasierten [Rate Limit](/guides/rate-limiting). Ein festes Warteintervall garantiert keinen freien Slot. Warte stattdessen, bis einer deiner eigenen Tasks abgeschlossen ist.

## Standardlimits {#default-limits}

Jede neue Organisation beginnt auf der Stufe **Bronze** mit einem Limit von 2 gleichzeitigen Tasks. Deine Stufe steigt automatisch anhand des Betrags einer einzelnen erfolgreichen Aufladung.

| Stufe | Einzelne Aufladung | Gleichzeitige Tasks |
|-------|---------------|------------------|
| Bronze | Standard | 2 |
| Silver | Ab $10 | 10 |
| Gold | Ab $100 | 100 |
| Platinum | Ab $500 | 500 |
| Diamond | Vertrieb kontaktieren | Unbegrenzt |

- **Einzelne Aufladung, keine Summe.** Zwei Aufladungen à $60 halten dich auf Silver. Eine Aufladung über $100 bringt dich auf Gold.
- **Nur Upgrades.** Eine spätere, kleinere Aufladung senkt deine Stufe nie.
- **Nur bezahlte Aufladungen.** Aktionsguthaben, Startguthaben und Gutscheine ändern deine Stufe nicht.
- **Sofort wirksam.** Das neue Limit gilt für deine nächste Video-Übermittlung, sobald die Zahlung erfolgreich war.

## Limit erhöhen {#increasing-your-limit}

Am direktesten erhöhst du dein Limit mit einer einzelnen Aufladung, die die nächste Schwelle in der Tabelle oben erreicht.

Für mehr als 500 gleichzeitige Tasks oder einen monatlichen Kreditrahmen wende dich wegen der Stufe **Diamond** an [contact@sandbase.ai](mailto:contact@sandbase.ai). Diamond hat kein Concurrency-Limit. Die Stufe wird vom SandBase-Team eingerichtet und ändert sich nie durch Aufladungen.

## Guthabenprüfung bei Video-Übermittlungen {#credit-check-on-video-submissions}

Zusätzlich zur Concurrency-Prüfung schätzt SandBase die Kosten jedes Video-Tasks, bevor es ihn annimmt. Übersteigt die Schätzung dein verfügbares Guthaben (Guthaben plus ggf. Kreditrahmen), wird die Übermittlung mit `402` abgelehnt. Es wird kein Task erstellt und nichts berechnet.

- Jede Übermittlung wird gegen dein aktuelles Guthaben geprüft. Noch laufende Tasks sind noch nicht berechnet, also lass Spielraum, wenn du mehrere Videos auf einmal übermittelst.
- Hängt der Preis eines Modells von einer Ausgabe ab, die erst nach der Ausführung existiert, lassen sich die Kosten nicht vorab schätzen. Die Übermittlung wird angenommen und nach Abschluss des Tasks normal abgerechnet.

## Umgang mit Concurrency-Fehlern {#handling-concurrency-errors}

### 429: Concurrency-Limit erreicht {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

Es wird kein `Retry-After`-Header gesendet. Das Limit ist im Voraus bekannt, daher ist es am zuverlässigsten, es nie zu überschreiten. Begrenze clientseitig die Anzahl laufender Video-Tasks und übermittle den nächsten erst, wenn ein vorheriger abgeschlossen ist:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

Erhältst du trotzdem einen `429`, etwa weil ein anderer Dienst derselben Organisation ebenfalls Tasks übermittelt, warte und versuche es erneut. Verwende exponentiellen Backoff mit Jitter und gib nach einer begrenzten Anzahl von Versuchen auf, statt in einer engen Schleife zu wiederholen.

### 402: nicht genug Guthaben für dieses Video {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Nicht wiederholen. Lade Guthaben auf oder wähle eine kürzere Dauer oder geringere Auflösung, die weniger kostet.

### Kompatible APIs {#compatible-apis}

Protokollkompatible Endpoints geben diese Fehler in ihrem eigenen nativen Format zurück. Der Volcengine-kompatible Endpoint `/api/v3/contents/generations/tasks` liefert zum Beispiel `RateLimitExceeded` für `429` und `AccountOverdueError` für `402`.

## Verwandte Themen {#related}

- [Rate Limits](/guides/rate-limiting): Request-Limits pro Minute
- [Preise](/guides/billing): Guthaben und Aufladungen
- [Fehler](/api-reference/errors): alle Fehlercodes
