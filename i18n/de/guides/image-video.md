---
i18nSource: 8c960d117a998817
title: Bild- und Videomodelle
description: Bilder und Videos asynchron mit der gemeinsamen Run API von SandBase generieren.
---

# Bild- und Videomodelle {#image-and-video-models}

Bild- und Videomodelle verwenden die gemeinsame asynchrone Run API von SandBase. Reiche eine Aufgabe
mit `POST /v1/run` ein und frage dann `GET /v1/run/{id}` ab, bis der Run einen
finalen Status erreicht.

## Eine Aufgabe einreichen {#submit-a-task}

Verwende die exakte Modell-ID aus [Bild- und Videomodelle](https://www.sandbase.ai/models/image-video). Die übrigen
Anfragefelder sind modellspezifisch; die erforderlichen Eingaben und Grenzen findest du in der
API-Referenz des Modells.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

Die Antwort enthält eine opake `id` und einen `status` wie `pending` oder
`running`.

## Das Ergebnis abfragen {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Frage weiter ab, bis `status` den Wert `completed`, `failed` oder `timeout` hat. Abgeschlossene
Runs enthalten fähigkeitsspezifische Ausgaben, etwa eine Bild- oder Video-URL. Bewahre
die Run-ID auf und betrachte die Run-Antwort als verbindlichen Status.

## Webhook-Callbacks {#webhook-callbacks}

Unterstützte asynchrone Aufgaben können in der Einreichungsanfrage auch `webhook_url` setzen.
Der Callback ist ein Zustellungshinweis und ersetzt das Polling nicht; verwende weiterhin
`GET /v1/run/{id}` und behandle doppelte oder verspätete Callbacks sicher. Den gemeinsamen
Callback-Vertrag findest du unter [Eine Capability ausführen](/api-reference/models/run#webhook-callbacks).

## API-Capabilities verwenden einen aus der URL abgeleiteten Pfad {#api-capabilities-use-a-url-derived-path}

Die gemeinsame Run API ist für die Modellgenerierung gedacht. API-Capabilities aus dem
[APIs-Katalog](https://www.sandbase.ai/apis) verwenden eine
andere, aus der URL abgeleitete Route: `GET` oder `POST /v1/api/{vendor}/{upstream_path}`.
Der anbieterqualifizierte Capability-Name stammt aus der Models API oder dem APIs-Katalog, daher kann das
Feld `model` im POST-Body entfallen:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Diese Route ist für API-Capabilities gedacht und ersetzt `/v1/run` nicht, wenn du
Bild- oder Videomodelle aufrufst. Ist die gewählte API-Capability asynchron,
frage die zurückgegebene Run-ID mit `GET /v1/run/{id}` ab.

## Nächste Schritte {#next-steps}

- [Bild- und Videomodelle](https://www.sandbase.ai/models/image-video)
- [Eine Capability ausführen](/api-reference/models/run)
- [Ein Run-Ergebnis abrufen](/api-reference/models/run-get)
- [API-Passthrough](/api-reference/models/api-passthrough)
