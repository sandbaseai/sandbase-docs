---
i18nSource: 4bd032d88bac0470
title: Seedance-Video (Volcengine-Ark-Protokoll)
description: Generiere Seedance-2.0- und -2.5-Videos über das Task-Protokoll Contents Generations von Volcengine Ark, einschließlich Eingaben, Polling, Abrechnung und Medien-Assets.
aside: false
outline: false
apiReference:
  title: Seedance-Video
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Reicht eine Seedance-Video-Task ein. Eine erfolgreiche Einreichung liefert HTTP 200 und eine SandBase-Task-ID.
  groups:
    - title: Request-Body
      fields:
        - name: model
          type: string
          required: true
          description: "Unterstützte Modell-ID: bytedance/seedance/2.0-official oder bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: Typisierte Text- und optionale Medieneingaben. Die Form der Einträge validiert das Modell.
        - name: duration
          type: integer
          required: false
          description: Wird unverändert an das Modell weitergeleitet. Es gilt die Validierung des Modells.
        - name: resolution
          type: string
          required: false
          description: Wird unverändert an das Modell weitergeleitet. Es gilt die Validierung des Modells.
        - name: ratio
          type: string
          required: false
          description: Wird unverändert an das Modell weitergeleitet. Es gilt die Validierung des Modells.
        - name: generate_audio
          type: boolean
          required: false
          description: Wird unverändert an das Modell weitergeleitet. Fordert generiertes Audio an, sofern unterstützt.
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Seedance-Guide {#seedance-guide}

Seedance generiert Videos aus Text, Start- und Endbildern sowie multimodalen Referenzen wie Bildern, Videos und
Audio. Damit erstellst du alles vom einfachen Text-zu-Video-Clip bis zur inszenierten Einstellung, die einem visuellen Motiv, einer Kamerabewegung
und einem Soundtrack folgt.

Die Generierung ist asynchron. Reiche eine Task ein und frage sie dann ab, bis sie einen Endstatus erreicht.

## Modell auswählen {#choosing-a-model}

| `model` | Geeignet für | Ausgabeauflösungen |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | Auslieferung in 1080p und höchste verfügbare Ausgabeauflösung | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Günstigere Generierung, wenn 480p oder 720p ausreicht | 480p, 720p |

Beide Modelle akzeptieren dieselben multimodalen Eingaben und unterstützen Text-zu-Video, Bild-zu-Video und multimodale Referenz-Workflows
in einer einheitlichen Anfrageform. Wähle `2.0-official`, wenn 480p oder 720p genügt und du die günstigere
Option möchtest. Wähle `2.5-official`, wenn du 1080p brauchst.

## API-Referenz {#api-reference}

| Methode | Pfad |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Das Auflisten von Tasks sowie das Abbrechen oder Löschen einer Task werden nicht unterstützt. Speichere die zurückgegebene Task-`id`, um das Ergebnis abzurufen.

Authentifiziere jede Anfrage mit demselben API-Schlüssel, mit dem die Task erstellt wurde:

```
Authorization: Bearer $SANDBASE_API_KEY
```

Der Wert von `model` muss einem der Namen unter [Modell auswählen](#choosing-a-model) entsprechen. Polling ist der unterstützte Weg, um
Ergebnisse zu erhalten; verlass dich bei diesem Endpunkt nicht auf `callback_url`.

## Quickstart {#quickstart}

Reiche eine Task ein:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

Frage die Task mit dieser ID alle 5 bis 10 Sekunden ab, bis `status` den Wert `succeeded`, `failed`, `expired` oder `cancelled` hat:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

Das generierte Video steht unter `content.video_url` bereit.

## Eingabe-Workflow wählen {#choose-an-input-workflow}

Die API unterstützt sieben gängige Eingabe-Workflows. Jeder Eintrag in `content` hat einen `type`; die Kombination aus Eintragstypen und
Rollen bestimmt den Workflow:

| Ziel | Kombination in `content` | Verwende es, wenn |
| --- | --- | --- |
| Text zu Video | Text | Sich die Szene vollständig im Prompt beschreiben lässt |
| Startbild animieren | Text (optional) + Bild mit `first_frame` | Das erste Bild einem vorgegebenen Bild entsprechen muss |
| Übergang zwischen zwei Bildern | Text (optional) + `first_frame` + `last_frame` | Die Einstellung einen kontrollierten Anfang und ein kontrolliertes Ende braucht |
| Einer visuellen Referenz folgen | Text (optional) + Bild mit `reference_image` | Ein Motiv, Produkt, Kostüm oder visueller Stil erkennbar bleiben soll |
| Bewegung oder Kamerasprache folgen | Text (optional) + Video mit `reference_video` | Bewegung, Timing, Schnittrhythmus oder Kamerabewegung aus einem Referenzclip stammen |
| Audioreferenz hinzufügen | Text/Bild/Video + Audio mit `reference_audio` | Dialog, Musik, Stimme oder Sounddesign das Ergebnis lenken sollen |
| Vollständige multimodale Regie | Text- + Bild- + Video- + Audioreferenzen | Verschiedene Assets in einer Einstellung Aussehen, Bewegung und Ton steuern |

Audio kann nicht allein stehen. Jede Anfrage mit einem Audioeintrag muss auch mindestens einen Text-, Bild- oder Videoeintrag
enthalten.

### Form der Content-Einträge {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` legt fest, wie das Modell das Asset verwenden soll:

| Asset | `role` | Wirkung |
| --- | --- | --- |
| Bild | `first_frame` | Das Bild als Startbild verwenden |
| Bild | `last_frame` | Das Bild als Endbild verwenden; in derselben Anfrage ein `first_frame` angeben |
| Bild | `reference_image` | Motiv, Komposition, Produkt, Kostüm oder visuellen Stil referenzieren |
| Video | `reference_video` | Bewegung, Kameraarbeit, Timing oder Schnittrhythmus referenzieren |
| Audio | `reference_audio` | Stimme, Dialog, Musik oder Sounddesign referenzieren |

Bildeinträge akzeptieren entweder eine öffentliche URL oder einen Inline-Wert `data:image/...;base64,...`. Video- und Audioreferenzen sollten
öffentliche URLs verwenden, die das Modell herunterladen kann.

Sobald ein `video_url`-Eintrag enthalten ist, läuft die Anfrage im Video-zu-Video-Modus, was den Token-Tarif ändert. Siehe
[Abrechnung](#billing).

## Gängige Rezepte {#common-recipes}

Die folgenden Beispiele zeigen Request-Bodys. Sende sie an den Endpunkt zum Erstellen von Tasks, der im [Quickstart](#quickstart) gezeigt wird.

### Startbild animieren {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### Übergang vom Start- zum Endbild erstellen {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### Einstellung mit Bild-, Video- und Audioreferenzen inszenieren {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

Weise jeder Referenz im Prompt eine klare Aufgabe zu, zum Beispiel: „Übernimm das Aussehen des Produkts aus dem Bild, verwende
die Kamerabewegung aus dem Video und folge dem Tempo des Audios.“ Das ist zuverlässiger, als jedes Asset
das gesamte Ergebnis steuern zu lassen.

## Einen wirksamen Prompt schreiben {#writing-an-effective-prompt}

Ein praxistauglicher Prompt folgt meist dieser Reihenfolge:

1. **Motiv**: wer oder was in der Einstellung zu sehen ist.
2. **Aktion**: was sich verändert oder bewegt.
3. **Szene**: Ort, Tageszeit, Wetter und Details der Umgebung.
4. **Visueller Stil**: filmisch, dokumentarisch, Produktwerbung, Animation und so weiter.
5. **Kamera**: Bildausschnitt, Objektivwirkung, Kamerabewegung und Schnitte.
6. **Ton**: Dialog, Atmo, Musik oder Effekte, wenn `generate_audio` aktiviert ist.

Benenne ausdrücklich, was stabil bleiben muss. Zum Beispiel: „Das Produktetikett bleibt lesbar, die Kamera fährt einmal langsam
heran, keine Szenenschnitte, natürlicher Raumklang.“ Wenn mehrere Referenzen vorhanden sind, beschreibe, welche visuelle oder Bewegungsqualität
aus welcher Referenz übernommen werden soll.

## Ausgabeoptionen {#output-options}

| Parameter | Typ | Standard | Werte |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` unterstützt kein `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` wählt ein Seitenverhältnis anhand von Eingabe und Prompt |
| `duration` | integer | `5` | 4 bis 15 Sekunden, oder `-1`, damit das Modell innerhalb des unterstützten Bereichs wählt |
| `generate_audio` | boolean | `true` | Synchrone Stimme, Soundeffekte und Hintergrundmusik generieren |
| `seed` | integer | `-1` | `-1` bis `2^32-1`. Gleicher Prompt und Seed ergeben ähnliche, aber nicht identische Ausgaben |
| `watermark` | boolean | `false` | Ein Wasserzeichen „KI-generiert“ in der unteren rechten Ecke hinzufügen |
| `tools` | array | `[]` | `[{"type": "web_search"}]` aktiviert die Websuche bei der Planung der Einstellung |

### Task-Steuerung {#task-control}

| Parameter | Typ | Standard | Hinweise |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Task-Timeout in Sekunden, von 3600 bis 259200. Eine Task, die diese Zeit überschreitet, wird `expired` |
| `service_tier` | string | `default` | Diese Modelle unterstützen kein `flex` |
| `safety_identifier` | string | — | Opake Kennung des Endnutzers, höchstens 64 Zeichen. Sende einen Hash, keine personenbezogenen Rohdaten |

### Bildgröße {#frame-size}

`resolution` und `ratio` bestimmen zusammen die Pixelmaße:

| Auflösung | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Task-Status {#task-status}

| `status` | Bedeutung | Vorgehen |
| --- | --- | --- |
| `queued` | Angenommen, wartet auf den Start | Weiter alle 5 bis 10 Sekunden abfragen |
| `running` | Wird generiert | Weiter abfragen |
| `succeeded` | Fertig | `content.video_url` herunterladen |
| `failed` | Von der Inhaltsprüfung abgelehnt, oder das Modell hat einen Fehler gemeldet | `error.message` lesen. Prompt vor einem neuen Versuch anpassen |
| `expired` | Hat `execution_expires_after` überschritten | Erneut einreichen |
| `cancelled` | Vor Beginn der Generierung beendet | Erneut einreichen |

### Task-Felder {#task-fields}

| Feld | Typ | Hinweise |
| --- | --- | --- |
| `id` | string | Die beim Einreichen zurückgegebene Task-ID |
| `model` | string | Der von dir gesendete Wert von `model` |
| `status` | string | Siehe oben |
| `created_at` | integer | Unix-Sekunden |
| `updated_at` | integer | Unix-Sekunden. Entspricht `created_at`, bis die Task abgeschlossen ist |
| `content` | object | Leer, bis die Task erfolgreich ist. Enthält die generierte `video_url` |
| `usage` | object | Token-Anzahlen. Siehe [Abrechnung](#billing) |
| `error` | object | Vorhanden bei `failed` und `expired`. Enthält `code` und `message` |

### Vollständiger Python-Ablauf {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## Abrechnung {#billing}

Diese Modelle rechnen nach `usage.completion_tokens` ab, das die Task bei Abschluss meldet. Der Token-Tarif hängt von zwei
Faktoren ab:

- **Ob die Eingabe ein Video enthält.** Video-zu-Video-Anfragen, also Anfragen mit einem `content`-Eintrag vom Typ `video_url`, werden
  zu einem niedrigeren Tarif abgerechnet als Text-zu-Video.
- **Ausgabeauflösung.** Bei `2.5-official` wird 1080p höher abgerechnet als 480p und 720p. Der Tarif von `2.0-official` hängt nicht
  von der Auflösung ab.

`usage` meldet `completion_tokens` und `total_tokens`, die derzeit gleich sind. Solange die Task läuft, ist es leer.
Die tatsächlichen Kosten findest du in deinem [Kontoverlauf](/api-reference/account/history), die aktuellen Tarife im
[Preis-Guide](/guides/billing).

## Fehler {#errors}

Eine ungültige Anfrage liefert sofort einen Fehler. Ein Fehler während der Generierung erscheint beim Polling in der Task. Beide verwenden ein
`error`-Objekt mit einem maschinenlesbaren `code` und einer menschenlesbaren `message`:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

Gängige Schritte zur Behebung:

| Ergebnis | Lösungsansatz |
| --- | --- |
| `400 InvalidParameter` | Modellname, erforderliche Inhalte, Rollen, Auflösung, Dauer und Asset-URLs prüfen |
| Task-Status `failed` mit einem Fehler der Inhaltsprüfung | Prompt umschreiben oder das beanstandete Referenz-Asset ersetzen, bevor du erneut einreichst |
| Task-Status `expired` | Neue Task einreichen; für hochauflösende oder lange Clips ein längeres `execution_expires_after` erwägen |
| `429 RateLimitExceeded` | Mit exponentiellem Backoff erneut versuchen und gleichzeitige Einreichungen reduzieren |
| `503 ServiceUnavailable` | Dieselbe Anfrage nach kurzer Wartezeit wiederholen |

## Registrierte Medien-Assets verwenden {#use-registered-media-assets}

SandBase stellt unter `/v1/assets` das offiziell kompatible Asset-Protokoll bereit. Die Asset-Anfrage und die zurückgegebene `asset://`-Referenz
folgen dem offiziellen Protokoll, und die Referenz wird in der nativen ByteDance-Contents-Generations-Anfrage unverändert
durchgereicht. Sowohl
`bytedance/seedance/2.5-official` als auch `bytedance/seedance/2.0-official` akzeptieren diese Referenz
überall dort, wo sie sonst eine öffentliche HTTP(S)-URL akzeptieren.

Der vollständige Ablauf:

1. Registriere eine erreichbare Medien-URL mit `POST /v1/assets`.
2. Frage `GET /v1/assets/{external_id}` ab, bis der Provider meldet, dass das Asset nutzbar ist.
3. Setze die zurückgegebene `asset_url` in einen Seedance-`content`-Eintrag und reiche die Generierungs-Task ein.

### Offiziell kompatible Asset-Operationen {#official-compatible-asset-operations}

| Methode | Pfad | Zweck |
| --- | --- | --- |
| `POST` | `/v1/assets` | Eine erreichbare Medien-URL registrieren und eine offiziell kompatible `asset://`-Referenz erhalten |
| `GET` | `/v1/assets/{external_id}` | Den Provider-Status lesen und die aktuelle Vorschau-/Download-URL abrufen |

Die öffentliche API bietet derzeit Registrierung und Abfrage. Asset-Gruppen, Auflisten, Umbenennen, Aktualisieren und Löschen sind
keine öffentlichen Operationen. Assets gehören zu der Organisation, die mit dem API-Schlüssel verknüpft ist.

### Schritt 1: Asset registrieren {#step-1-register-the-asset}

Sende die erreichbare URL an `POST /v1/assets`. `asset_type` unterscheidet Groß- und Kleinschreibung und muss `Image`, `Video` oder `Audio` sein:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

Speichere `asset_url` aus der Antwort:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Der Wert nach `asset://` ist die `external_id`, die die offiziell kompatible Abfrageoperation verwendet.

### Schritt 2: Bereitschaft prüfen {#step-2-check-readiness}

Frage das Asset mit der `external_id` ab, ohne das Präfix `asset://`:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Behandle `status` als offenen Provider-Wert und nicht als abschließende Enum. Warte, bis der Provider einen nutzbaren
Zustand meldet, bevor du die Generierungs-Task einreichst; ein üblicher Bereit-Wert ist `Active`. `download_url` wird vom Provider verwaltet und
kann während der Verarbeitung leer sein. Frage das Asset erneut ab, wenn du eine aktuelle Vorschau-URL brauchst. Verwende in Seedance-Anfragen weiterhin die dauerhafte
`asset_url`, statt `download_url` zu kopieren.

### Schritt 3: Mit dem Asset generieren {#step-3-generate-with-the-asset}

Setze `asset_url` in das URL-Feld, das zum Medientyp passt. Dieses Beispiel verwendet das registrierte Bild als visuelle
Referenz:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

Die Create-Antwort liefert eine Task-`id`. Frage
`GET /api/v3/contents/generations/tasks/{task_id}` ab, wie auf der Seite des gewählten Modells beschrieben.

### Content-Eintrag und Rolle wählen {#choose-the-content-item-and-role}

| Asset-Typ | `content[].type` | URL-Feld | Unterstützte Rolle | Verwendung |
| --- | --- | --- | --- | --- |
| Bild | `image_url` | `image_url.url` | `first_frame` | Das Video genau mit diesem Bild beginnen |
| Bild | `image_url` | `image_url.url` | `last_frame` | Mit diesem Bild enden; in derselben Anfrage ein `first_frame` angeben |
| Bild | `image_url` | `image_url.url` | `reference_image` | Motiv, Produkt, Komposition, Kostüm oder visuellen Stil beibehalten |
| Video | `video_url` | `video_url.url` | `reference_video` | Bewegung, Timing, Kameraarbeit oder Schnittrhythmus folgen |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Stimme, Dialog, Musik oder Sounddesign folgen |

Audio kann nicht die einzige Eingabe sein. Kombiniere ein `reference_audio`-Asset mit Text, einem Bild oder einem Video. Jede Anfrage, die
eine `video_url` enthält, wird zum Video-zu-Video-Tarif abgerechnet.

#### Beispiel für ein Video-Asset {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Beispiel für ein Audio-Asset {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### Direkte URL oder `asset://`-Referenz? {#direct-url-or-asset-reference}

| Eingabe | Am besten, wenn | Abwägung |
| --- | --- | --- |
| Öffentliche HTTP(S)-URL | Das Medium bereits gehostet ist und einmal verwendet wird | Schnellster Weg, aber die URL muss bis zur Einreichung der Task und zum Abruf durch den Provider erreichbar bleiben |
| `asset://`-Referenz | Das Medium über das offizielle Asset-Protokoll wiederverwendet wird | Erfordert einen zusätzlichen Schritt für Registrierung und Bereitschaft, liefert dann aber eine dauerhafte Referenz für spätere Seedance-Tasks |

Zu Request-Parametern, Polling, Task-Status und Abrechnung siehe den [Seedance-Guide](#seedance-guide) oben.

## Offizielle Ressourcen von ByteDance {#official-bytedance-resources}
- [Dokumentation zur Seedance-Videogenerierung](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API zum Erstellen von Contents-Generation-Tasks](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Seedance-2.0-Prompting-Guide](https://www.volcengine.com/docs/82379/2222480?lang=en)
