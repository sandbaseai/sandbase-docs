---
i18nSource: f63049c1cf01130e
title: Fehler und Wiederholungen
description: Fehler der SandBase API einordnen, entscheiden, wann eine Wiederholung sicher ist, und nützliche Diagnosedaten erhalten, ohne Secrets preiszugeben.
---

# Fehler und Wiederholungen {#errors-and-retries}

Behandle Fehler nach HTTP-Status, Endpunktfamilie und Semantik des Vorgangs. SandBase stellt mehrere kompatible Protokolle bereit,
daher gibt es keine einheitliche JSON-Fehlerform für alle Endpunkte.

## Die Fehlerform des Endpunkts lesen {#read-the-endpoint-s-error-shape}

- OpenAI-kompatible Vorgänge liefern normalerweise ein `error`-Objekt mit einer Nachricht und einem Typ.
- Anthropic Messages liefert Anthropic-kompatible Fehler-Envelopes.
- Zentrale Plattformvorgänge können einen flachen `{ "error": "..." }`-Body oder einen dokumentierten ressourcenspezifischen Fehler liefern.
- Google- und anbieternative Vorgänge behalten, wo dokumentiert, die Form ihres kompatiblen Protokolls bei.

Verwende den HTTP-Status und den dokumentierten Body der Antwort. Setze optionale Felder wie `code`, `param` oder
`request_id` nicht voraus, sofern der gewählte Endpunkt sie nicht garantiert. Beispiele findest du in der [API-Fehlerreferenz](/api-reference/errors),
vorgangsspezifische Antworten in der [OpenAPI-Spezifikation](/openapi.yaml).

## Je nach Status entscheiden {#decide-what-to-do-by-status}

| Status | Typische Ursache | Empfohlene Maßnahme |
|---|---|---|
| `400` / `422` | Ungültiger Body, ungültiger Parameter oder nicht unterstützte Modellfähigkeit | Korrigiere die Anfrage, bevor du sie wiederholst. |
| `401` | Fehlende, ungültige, abgelaufene oder widerrufene Zugangsdaten | Ersetze die Zugangsdaten. |
| `402` | Der Abrechnungsstatus lässt die Anfrage nicht zu | Kläre das Kontoguthaben oder die Ausgabensteuerung. |
| `403` | Scope der Zugangsdaten oder Ressourcenzugriff reicht nicht aus | Verwende einen berechtigten Schlüssel oder eine berechtigte Ressource. |
| `404` | Modell, Aufgabe oder Plattformressource wurde nicht gefunden | Prüfe die Kennung und die Organisation. |
| `409` | Konflikt mit dem Ressourcenzustand oder einem gleichzeitigen Vorgang | Lies den aktuellen Zustand und entscheide dann, ob du es erneut versuchst. |
| `429` | SandBase oder ein Upstream-Anbieter hat die Anfrage gedrosselt | Beachte `Retry-After`, falls vorhanden; sonst warte mit Backoff und Jitter. |
| `500` / `502` / `503` / `504` | Interner, Upstream- oder vorübergehender Verfügbarkeitsfehler | Wiederhole nur, wenn die Wiederholung des Vorgangs sicher ist. |

Diese Tabelle ist eine Anleitung zur Behandlung, keine Zusage, dass jeder Endpunkt jeden Status liefert.

## Eine begrenzte Wiederholungsstrategie verwenden {#use-a-bounded-retry-policy}

Verwende bei sicher wiederholbaren Anfragen exponentiellen Backoff mit Jitter, begrenze die Wartezeit und setze ein Gesamtbudget für die Anfrage durch.
Deaktiviere SDK-Wiederholungen, wenn bereits eine äußere Anwendungsschicht wiederholt, oder berücksichtige beim Festlegen des Budgets beide Schichten.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Enthält eine Antwort `Retry-After`, parse und beachte diesen Wert, statt die Ersatzwartezeit zu verwenden. Halte die Strategie
konfigurierbar; die richtige Anzahl an Versuchen und die passende Frist hängen vom Latenz- und Kostenbudget des Aufrufers ab.

## Vor doppelten Nebeneffekten schützen {#protect-against-duplicate-side-effects}

Eine wiederholte Inferenzanfrage erzeugt eine neue Generierung und kann zusätzliche Kosten verursachen. Das ist nur akzeptabel, wenn die
Anwendung irgendeine gültige Antwort braucht und eine Neugenerierung verkraftet.

Sei zurückhaltender bei Vorgängen, die etwas erstellen, aktualisieren, löschen, veröffentlichen, planen oder Arbeit auslösen:

- nutze dokumentierte Idempotenzunterstützung, wenn ein Endpunkt sie anbietet;
- lies andernfalls den aktuellen Zustand, bevor du eine Anfrage mit unklarem Ausgang wiederholst;
- spiele einen Tool-Aufruf nie nur deshalb erneut ab, weil der umgebende Modell-Stream abgebrochen ist;
- speichere eine Client-Vorgangs-ID in deinem eigenen System, wenn du Wiederholungen abgleichen musst.

## Timeouts und Streams getrennt behandeln {#handle-timeouts-and-streams-separately}

Ein Timeout beweist nicht, dass der Server die Verarbeitung der Anfrage beendet hat. Frage vor der Wiederholung eines asynchronen oder zustandsändernden
Vorgangs nach Möglichkeit den dokumentierten Ressourcen- oder Aufgabenstatus ab.

Unterscheide bei Streaming-Antworten einen HTTP-Fehler vor Beginn des Streams von einem Verbindungsabbruch nach einer Teilausgabe.
Nur das normale Abschlusssignal des Protokolls belegt einen vollständigen Stream. Siehe [Streaming-Antworten](/guides/streaming).

## Nützliche und sichere Diagnosedaten protokollieren {#log-useful-safe-diagnostics}

Erfasse:

- Endpunkt und Modellkennung;
- HTTP-Status und, falls vorhanden, den kompatiblen Fehlertyp;
- Anbieter- oder Anfragekennung, falls zurückgegeben;
- Anzahl der Versuche, verstrichene Zeit und ob Antwort-Bytes angekommen sind.

Protokolliere keine API-Schlüssel, Werte von Zugangsdaten, vollständigen sensiblen Prompts oder ungeschwärzten Anbieterantworten. Zeige Nutzern eine kurze,
umsetzbare Meldung und bewahre bereinigte Diagnosedaten für den Betrieb auf.

## Weitere Hinweise {#related-guidance}

- [API-Fehlerreferenz](/api-reference/errors)
- [Rate-Limits](/guides/rate-limiting)
- [Streaming-Antworten](/guides/streaming)
- [Authentifizierung](/api-reference/authentication)
