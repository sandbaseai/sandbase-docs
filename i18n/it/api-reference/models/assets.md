---
i18nSource: 43d08f60800d37f5
title: API Media Assets
description: Registra Asset multimediali riutilizzabili e recuperane i metadata correnti e gli URL di download.
---

# API Media Assets {#media-assets-api}

Usa il protocollo Asset compatibile con quello ufficiale, esposto su `/v1/assets`, per registrare URL di file multimediali e ottenere un `asset_url` per
le richieste native di generazione video.

Per un esempio completo che registra file multimediali e usa il riferimento `asset://` restituito con Seedance, vedi
[Usare Asset multimediali registrati](/api-reference/volcengine-contents-generations#use-registered-media-assets) nel riferimento di Seedance.

## Panoramica {#overview}

| Metodo | Percorso | Descrizione |
|--------|------|-------------|
| `POST` | `/v1/assets` | Registra un Asset |
| `GET` | `/v1/assets/{id}` | Ottiene i metadata dell'Asset e un URL di download corrente |

## POST /v1/assets {#post-v1-assets}

Registra nella libreria degli asset l'URL di un file accessibile pubblicamente e restituisce un `asset_url` che puoi referenziare nelle richieste di generazione video.

### Richiesta {#request}

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

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|----------|--------------|
| `url` | string | Sì | URL del file accessibile pubblicamente |
| `asset_type` | string | Sì | Tipo di asset: `Image` / `Video` / `Audio` (distingue maiuscole e minuscole) |
| `name` | string | No | Nome facoltativo dell'asset |

### Risposta {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Campo | Descrizione |
|-------|--------------|
| `id` | ID del record interno |
| `asset_url` | Indirizzo di riferimento usato nelle richieste di generazione video |
| `asset_type` | Tipo di asset |
| `name` | Nome dell'asset |
| `created_at` | Timestamp di creazione |

### Usare asset_url {#using-asset-url}

Dopo la registrazione, passa `asset_url` a un campo di input che accetta un riferimento ad Asset nello schema attuale del modello selezionato. I nomi dei campi variano in base al modello, ad esempio:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Errori {#errors}

| Stato HTTP | Descrizione |
|-------------|--------------|
| 400 | Campo obbligatorio mancante o `asset_type` non valido |
| 502 | Registrazione dell'asset upstream non riuscita |
| 500 | Nessuna credenziale disponibile o errore interno |

---

## GET /v1/assets/{id}

Recupera un URL di download firmato per un asset registrato tramite il suo ID esterno. Serve per l'anteprima o il download del file sottostante.

### Richiesta {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Parametro | Posizione | Descrizione |
|-----------|----------|--------------|
| `id` | path | L'ID esterno (la parte dopo `asset://` in `asset_url`) |

### Risposta {#response-1}

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

| Campo | Descrizione |
|-------|--------------|
| `asset_url` | Indirizzo di riferimento per la generazione video (permanente) |
| `status` | Stato del ciclo di vita dell'Asset riportato dal provider. Trattalo come una stringa aperta. |
| `download_url` | URL di download restituito dal provider; può essere vuoto finché l'Asset non è pronto |

### Errori {#errors-1}

| Stato HTTP | Descrizione |
|-------------|--------------|
| 404 | Asset non trovato o non appartenente alla tua organizzazione |
| 502 | Query upstream non riuscita |

---

## Note {#notes}

::: tip Importante
- `asset_url` ha il formato `asset://{external_id}` ed è il riferimento riutilizzabile da passare agli input dei modelli supportati
- Considera `download_url` gestito dal provider. Se è vuoto o non funziona più, interroga di nuovo questo endpoint per il valore corrente
- `asset_type` distingue maiuscole e minuscole: `Image` / `Video` / `Audio`
- L'URL inviato deve essere accessibile pubblicamente (la piattaforma deve poterlo scaricare)
:::
