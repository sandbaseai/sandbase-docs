---
i18nSource: 43d08f60800d37f5
title: Media Assets API
description: Wiederverwendbare Medien-Assets registrieren und ihre aktuellen Metadaten und Download-URLs abrufen.
---

# Media Assets API {#media-assets-api}

Verwende das offiziell kompatible Asset-Protokoll unter `/v1/assets`, um Medien-URLs zu registrieren und eine `asset_url` für
native Videogenerierungsanfragen zu erhalten.

Ein durchgängiges Beispiel, das Medien registriert und die zurückgegebene `asset://`-Referenz mit Seedance verwendet, findest du unter
[Registrierte Medien-Assets verwenden](/api-reference/volcengine-contents-generations#use-registered-media-assets) in der Seedance-Referenz.

## Überblick {#overview}

| Methode | Pfad | Beschreibung |
|--------|------|-------------|
| `POST` | `/v1/assets` | Ein Asset registrieren |
| `GET` | `/v1/assets/{id}` | Asset-Metadaten und eine aktuelle Download-URL abrufen |

## POST /v1/assets {#post-v1-assets}

Registriert eine öffentlich zugängliche Datei-URL in der Asset-Bibliothek und gibt eine `asset_url` zurück, die du in Videogenerierungsanfragen referenzieren kannst.

### Anfrage {#request}

```http
POST /v1/assets
Authorization: Bearer $SANDBASE_API_KEY
Content-Type: application/json
```

```json
{
  "url": "https://example.com/tea-ad.mp4",
  "asset_type": "Video",
  "name": "Tea ad reference video"
}
```

| Feld | Typ | Erforderlich | Beschreibung |
|-------|------|----------|--------------|
| `url` | string | Ja | Öffentlich zugängliche Datei-URL |
| `asset_type` | string | Ja | Asset-Typ: `Image` / `Video` / `Audio` (Groß-/Kleinschreibung beachten) |
| `name` | string | Nein | Optionaler Asset-Name |

### Antwort {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Feld | Beschreibung |
|-------|--------------|
| `id` | Interne Datensatz-ID |
| `asset_url` | Referenzadresse für Videogenerierungsanfragen |
| `asset_type` | Asset-Typ |
| `name` | Asset-Name |
| `created_at` | Erstellungszeitpunkt |

### asset_url verwenden {#using-asset-url}

Übergib die `asset_url` nach der Registrierung an ein Eingabefeld, das im Live-Schema des gewählten Modells eine Asset-Referenz akzeptiert. Die Feldnamen unterscheiden sich je nach Modell, zum Beispiel:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Fehler {#errors}

| HTTP-Status | Beschreibung |
|-------------|--------------|
| 400 | Pflichtfeld fehlt oder ungültiger `asset_type` |
| 502 | Upstream-Registrierung des Assets fehlgeschlagen |
| 500 | Kein Credential verfügbar oder interner Fehler |

---

## GET /v1/assets/{id}

Ruft anhand der externen ID eine signierte Download-URL für ein registriertes Asset ab. Dient zur Vorschau oder zum Herunterladen der zugrunde liegenden Datei.

### Anfrage {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Parameter | Ort | Beschreibung |
|-----------|----------|--------------|
| `id` | path | Die externe ID (der Teil nach `asset://` in `asset_url`) |

### Antwort {#response-1}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "download_url": "https://cdn.example.com/...?X-Tos-Expires=43200",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Feld | Beschreibung |
|-------|--------------|
| `asset_url` | Referenzadresse für die Videogenerierung (dauerhaft) |
| `status` | Vom Anbieter gemeldeter Lifecycle-Status des Assets. Behandle ihn als offenen String. |
| `download_url` | Vom Anbieter zurückgegebene Download-URL; sie kann leer sein, solange das Asset nicht bereit ist |

### Fehler {#errors-1}

| HTTP-Status | Beschreibung |
|-------------|--------------|
| 404 | Asset nicht gefunden oder gehört nicht zu deiner Organisation |
| 502 | Upstream-Abfrage fehlgeschlagen |

---

## Hinweise {#notes}

::: tip Wichtig
- `asset_url` hat das Format `asset://{external_id}` und ist die wiederverwendbare Referenz, die du an unterstützte Modelleingaben übergibst
- Behandle `download_url` als vom Anbieter verwaltet. Ist sie leer oder funktioniert nicht mehr, frage diesen Endpunkt erneut nach dem aktuellen Wert ab
- `asset_type` unterscheidet Groß- und Kleinschreibung: `Image` / `Video` / `Audio`
- Die übermittelte URL muss öffentlich zugänglich sein (die Plattform muss sie abrufen können)
:::
