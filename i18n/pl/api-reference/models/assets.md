---
i18nSource: 43d08f60800d37f5
title: Media Assets API
description: Rejestruj multimedialne Assets wielokrotnego użytku i pobieraj ich bieżące metadane oraz URL pobierania.
---

# Media Assets API {#media-assets-api}

Użyj zgodnego z oficjalnym protokołu Asset udostępnionego pod `/v1/assets`, aby rejestrować URL multimediów i uzyskiwać `asset_url` dla
natywnych żądań generowania wideo.

Pełny przykład, w którym multimedia są rejestrowane, a zwrócone odwołanie `asset://` jest używane z Seedance, znajdziesz w sekcji
[Korzystanie z zarejestrowanych Assets multimedialnych](/api-reference/volcengine-contents-generations#use-registered-media-assets) w dokumentacji Seedance.

## Przegląd {#overview}

| Metoda | Ścieżka | Opis |
|--------|------|-------------|
| `POST` | `/v1/assets` | Rejestruje Asset |
| `GET` | `/v1/assets/{id}` | Pobiera metadane Asset i bieżący URL pobierania |

## POST /v1/assets {#post-v1-assets}

Rejestruje publicznie dostępny URL pliku w bibliotece zasobów i zwraca `asset_url`, do którego można odwoływać się w żądaniach generowania wideo.

### Żądanie {#request}

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

| Pole | Typ | Wymagane | Opis |
|-------|------|----------|--------------|
| `url` | string | Tak | Publicznie dostępny URL pliku |
| `asset_type` | string | Tak | Typ Asset: `Image` / `Video` / `Audio` (wielkość liter ma znaczenie) |
| `name` | string | Nie | Opcjonalna nazwa Asset |

### Odpowiedź {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Pole | Opis |
|-------|--------------|
| `id` | Wewnętrzny identyfikator rekordu |
| `asset_url` | Adres odwołania używany w żądaniach generowania wideo |
| `asset_type` | Typ Asset |
| `name` | Nazwa Asset |
| `created_at` | Znacznik czasu utworzenia |

### Używanie asset_url {#using-asset-url}

Po rejestracji przekaż `asset_url` do pola wejściowego, które w aktualnym schemacie wybranego modelu akceptuje odwołanie do Asset. Nazwy pól zależą od modelu, na przykład:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Błędy {#errors}

| Status HTTP | Opis |
|-------------|--------------|
| 400 | Brak wymaganego pola lub nieprawidłowy `asset_type` |
| 502 | Rejestracja Asset u dostawcy nie powiodła się |
| 500 | Brak dostępnego poświadczenia lub błąd wewnętrzny |

---

## GET /v1/assets/{id}

Pobiera podpisany URL pobierania zarejestrowanego Asset na podstawie jego zewnętrznego identyfikatora. Służy do podglądu lub pobrania pliku źródłowego.

### Żądanie {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Parametr | Lokalizacja | Opis |
|-----------|----------|--------------|
| `id` | path | Zewnętrzny identyfikator (część po `asset://` w `asset_url`) |

### Odpowiedź {#response-1}

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

| Pole | Opis |
|-------|--------------|
| `asset_url` | Adres odwołania do generowania wideo (stały) |
| `status` | Status cyklu życia Asset zgłaszany przez dostawcę. Traktuj go jako otwarty ciąg znaków. |
| `download_url` | URL pobierania zwrócony przez dostawcę; może być pusty, dopóki Asset nie jest gotowy |

### Błędy {#errors-1}

| Status HTTP | Opis |
|-------------|--------------|
| 404 | Nie znaleziono Asset lub nie należy on do Twojej organizacji |
| 502 | Zapytanie do dostawcy nie powiodło się |

---

## Uwagi {#notes}

::: tip Ważne
- `asset_url` ma format `asset://{external_id}` i jest odwołaniem wielokrotnego użytku, które przekazujesz do obsługiwanych wejść modeli
- Traktuj `download_url` jako zarządzany przez dostawcę. Jeśli jest pusty lub przestał działać, ponownie wywołaj ten endpoint, aby uzyskać bieżącą wartość
- W `asset_type` wielkość liter ma znaczenie: `Image` / `Video` / `Audio`
- Przesłany URL musi być publicznie dostępny (platforma musi móc go pobrać)
:::
