---
i18nSource: d326fdb78ea64bdf
title: Rate Limits
description: Behandle Rate Limits der SandBase API sicher mit begrenzten Wiederholungen, Jitter, Warteschlangen und idempotenzbewusster Anfrageverarbeitung.
---

# Rate Limits {#rate-limits}

SandBase kann deiner Organisation ein Limit für Anfragen pro Minute zuweisen. Alle API-Schlüssel der Organisation teilen es,
und gezählt wird über ein gleitendes Fenster von einer Minute. Auch vorgelagerte Modell-Provider können eigene
`429 Too Many Requests`-Antworten liefern. Codiere kein Kontingent fest, solange SandBase deinem Workload keines zugewiesen hat.

## Das Limit deiner Organisation {#your-organization-s-limit}
SandBase veröffentlicht keinen festen Wert für Anfragen pro Minute, weil das Limit pro Organisation zugewiesen wird. Jeder
API-Schlüssel der Organisation zählt auf dasselbe Limit, zusätzliche Schlüssel erhöhen es also nicht. Das Limit wird derzeit
weder in der öffentlichen API noch in der Console angezeigt.

Braucht dein Workload ein garantiertes oder höheres Limit, wende dich an den SandBase-Support und nenne Organisation, Anwendung,
erwartete Dauerrate und erwartete Spitzenrate. Entwirf keinen Produktions-Client um einen undokumentierten numerischen Standardwert herum.

## Eine 429-Antwort behandeln {#handle-a-429-response}

Von der Plattform erzeugte Rate-Limit-Antworten unter `/v1/*` verwenden einen flachen Fehler-Body:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

Das Organisationslimit gilt für `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload` sowie die Gemini-Endpunkte `generateContent`, `streamGenerateContent` und `POST /v1beta/interactions`. Polling-Endpunkte wie
`GET /v1/run/{id}` werden nicht gezählt. Protokollkompatible Endpunkte liefern dasselbe `429` in ihrem eigenen Error-Envelope,
etwa im Fehlerformat von Anthropic oder Google. Eine vom Provider stammende Antwort kann das Fehlerformat des kompatiblen Endpunkts
verwenden und Rate-Limit-Header des Providers enthalten.

`Retry-After` und Header zum verbleibenden Kontingent sind nicht garantiert. Ist `Retry-After` vorhanden, halte dich daran. Andernfalls verwende
exponentielles Backoff mit Jitter und einer maximalen Anzahl an Versuchen.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Das OpenAI SDK unterstützt über `max_retries` auch eingebaute Wiederholungen. Entscheide dich bewusst entweder für SDK-Wiederholungen oder für eine
Wiederholungsschleife in der Anwendung, damit sich Wiederholungen nicht über mehrere Ebenen vervielfachen.

## Nur sichere Operationen wiederholen {#retry-only-safe-operations}

Eine wiederholte Inferenzanfrage kann eine zweite Generierung erzeugen und zusätzliche Kosten verursachen. Wiederhole sie nur, wenn deine
Anwendung eine erneute Generierung akzeptiert. Wiederhole eine zustandsändernde Anfrage nicht automatisch, es sei denn, die Operation dokumentiert
Idempotenz oder deine Anwendung kann nachweisen, dass der erste Versuch nicht erfolgreich war.

Bei Streaming-Anfragen kommt ein `429` normalerweise an, bevor der Stream beginnt. Sind bereits Bytes eingetroffen, behandle einen Verbindungsabbruch
als unterbrochene Generierung, statt einen Rate-Limit-Fehler anzunehmen. Behalte oder verwirf Teilausgaben je nach
Produktanforderungen; ein Neustart erzeugt eine neue Generierung.

## Durchsatz steuern {#control-throughput}

- Begrenze die Nebenläufigkeit, statt einen unbegrenzten Batch auf einmal abzuschicken.
- Stelle stoßweise anfallende Arbeit in eine Warteschlange und glätte die Senderate.
- Vermeide doppelte Anfragen und cache wiederverwendbare Ergebnisse, wenn Datenschutz- und Aktualitätsanforderungen es zulassen.
- Nutze separate Schlüssel für Zuständigkeit, Ausgabenkontrolle und Widerruf, nicht zum Umgehen von Plattformlimits.
- Protokolliere Endpunkt, Modell, HTTP-Status und bereinigten Fehler-Body für die Fehlersuche.
- Wende dich an den SandBase-Support, wenn ein Workload ein zugewiesenes oder höheres Kapazitätslimit braucht.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

Nebenläufigkeit ist nicht dasselbe wie Anfragen pro Minute. Stimme beides auf die beobachtete Latenz und die Kapazität ab, die
deiner Anwendung zugewiesen ist.

::: info Tägliche kostenlose API-Aufrufe
Die 100 kostenlosen Daten-API-Aufrufe pro UTC-Tag sind ein Abrechnungskontingent der Organisation, kein Rate Limit. Aufrufe darüber hinaus werden
pro Aufruf berechnet statt abgelehnt. Siehe [Tägliche kostenlose API-Aufrufe](/guides/billing#daily-free-api-calls).
:::

::: tip Video-Tasks
Video-Einreichungen sind außerdem dadurch begrenzt, wie viele Tasks deine Organisation abhängig von ihrer Kontostufe gleichzeitig ausführen kann.
Dieses `429` meldet `organization concurrency limit exceeded` und löst sich auf, sobald eine laufende Task endet, nicht nach Zeitablauf. Siehe
[Concurrency-Limits](/guides/concurrency-limits).
:::

## Weiterführende Hinweise {#related-guidance}

- [Fehlerbehandlung](/guides/error-handling)
- [Streaming](/guides/streaming)
- [API-Fehlerreferenz](/api-reference/errors)
- [API-Schlüssel](/getting-started/api-keys)
