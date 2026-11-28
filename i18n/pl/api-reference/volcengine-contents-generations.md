---
i18nSource: 4bd032d88bac0470
title: Wideo Seedance (protokół Volcengine Ark)
description: "Generuj wideo Seedance 2.0 i 2.5 przez protokół zadań Volcengine Ark Contents Generations: dane wejściowe, odpytywanie, rozliczenia i zasoby multimedialne (Assets)."
aside: false
outline: false
apiReference:
  title: Wideo Seedance
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Przesyła zadanie wideo Seedance. Udane przesłanie zwraca HTTP 200 i identyfikator zadania SandBase.
  groups:
    - title: Treść żądania
      fields:
        - name: model
          type: string
          required: true
          description: "Obsługiwany identyfikator modelu: bytedance/seedance/2.0-official lub bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: Typowane dane tekstowe i opcjonalne multimedia. Kształty elementów są walidowane przez model.
        - name: duration
          type: integer
          required: false
          description: Przekazywane do modelu bez zmian. Obowiązuje walidacja modelu.
        - name: resolution
          type: string
          required: false
          description: Przekazywane do modelu bez zmian. Obowiązuje walidacja modelu.
        - name: ratio
          type: string
          required: false
          description: Przekazywane do modelu bez zmian. Obowiązuje walidacja modelu.
        - name: generate_audio
          type: boolean
          required: false
          description: Przekazywane do modelu bez zmian. Żąda wygenerowania audio, jeśli jest obsługiwane.
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

## Przewodnik po Seedance {#seedance-guide}

Seedance generuje wideo z tekstu, klatek początkowej i końcowej oraz referencji multimodalnych, takich jak obrazy, wideo i
audio. Sprawdza się zarówno przy prostym klipie text-to-video, jak i przy reżyserowanym ujęciu, które podąża za wizualnym obiektem, ruchem
kamery i ścieżką dźwiękową.

Generowanie jest asynchroniczne. Prześlij zadanie, a następnie odpytuj je, aż osiągnie status końcowy.

## Wybór modelu {#choosing-a-model}

| `model` | Najlepszy do | Rozdzielczości wyjściowe |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | Materiałów w 1080p i najwyższej dostępnej rozdzielczości wyjściowej | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Tańszego generowania, gdy wystarczy 480p lub 720p | 480p, 720p |

Oba modele przyjmują te same dane wejściowe multimodalne i obsługują przepływy text-to-video, image-to-video oraz referencji multimodalnych
w jednym kształcie żądania. Wybierz `2.0-official`, gdy 480p lub 720p spełnia Twoje potrzeby i chcesz tańszej
opcji. Wybierz `2.5-official`, gdy potrzebujesz 1080p.

## Dokumentacja API {#api-reference}

| Metoda | Ścieżka |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Wyświetlanie listy zadań oraz anulowanie lub usuwanie zadania nie są obsługiwane. Zapisz zwrócone `id` zadania, aby pobrać wynik.

Uwierzytelniaj każde żądanie tym samym kluczem API, którym utworzono zadanie:

```
Authorization: Bearer $SANDBASE_API_KEY
```

Wartość `model` musi odpowiadać jednej z nazw z sekcji [Wybór modelu](#choosing-a-model). Odpytywanie jest obsługiwanym sposobem
odbierania wyników; nie polegaj na `callback_url` w przypadku tego endpointu.

## Szybki start {#quickstart}

Prześlij zadanie:

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

Odpytuj zadanie o tym identyfikatorze co 5–10 sekund, aż `status` przyjmie wartość `succeeded`, `failed`, `expired` lub `cancelled`:

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

Wygenerowane wideo jest dostępne pod `content.video_url`.

## Wybór przepływu wejściowego {#choose-an-input-workflow}

API obsługuje siedem typowych przepływów wejściowych. Każdy element w `content` ma `type`; kombinacja typów elementów i
ról wybiera przepływ:

| Cel | Kombinacja `content` | Kiedy używać |
| --- | --- | --- |
| Tekst na wideo | Tekst | Scenę da się w całości opisać w prompcie |
| Animacja klatki początkowej | Tekst (opcjonalnie) + obraz z `first_frame` | Pierwsza klatka musi odpowiadać dostarczonemu obrazowi |
| Przejście między dwiema klatkami | Tekst (opcjonalnie) + `first_frame` + `last_frame` | Ujęcie wymaga kontrolowanego początku i końca |
| Podążanie za referencją wizualną | Tekst (opcjonalnie) + obraz z `reference_image` | Obiekt, produkt, kostium lub styl wizualny ma pozostać rozpoznawalny |
| Podążanie za ruchem lub językiem kamery | Tekst (opcjonalnie) + wideo z `reference_video` | Ruch, tempo, rytm montażu lub ruch kamery pochodzą z klipu referencyjnego |
| Dodanie referencji audio | Tekst/obraz/wideo + audio z `reference_audio` | Dialog, muzyka, głos lub udźwiękowienie mają kierować wynikiem |
| Pełna reżyseria multimodalna | Referencje tekstowe + obrazowe + wideo + audio | Różne materiały kontrolują wygląd, ruch i dźwięk w jednym ujęciu |

Audio nie może występować samodzielnie. Każde żądanie zawierające element audio musi zawierać też co najmniej jeden element tekstowy, obrazowy lub
wideo.

### Kształty elementów content {#content-item-shapes}

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

`role` określa, jak model ma użyć materiału:

| Materiał | `role` | Efekt |
| --- | --- | --- |
| Obraz | `first_frame` | Użyj obrazu jako klatki początkowej |
| Obraz | `last_frame` | Użyj obrazu jako klatki końcowej; dołącz `first_frame` w tym samym żądaniu |
| Obraz | `reference_image` | Odwołaj się do obiektu, kompozycji, produktu, kostiumu lub stylu wizualnego |
| Wideo | `reference_video` | Odwołaj się do ruchu, pracy kamery, tempa lub rytmu montażu |
| Audio | `reference_audio` | Odwołaj się do głosu, dialogu, muzyki lub udźwiękowienia |

Elementy obrazowe przyjmują publiczny URL lub wbudowaną wartość `data:image/...;base64,...`. Referencje wideo i audio powinny
używać publicznych URL-i, które model może pobrać.

Dołączenie dowolnego elementu `video_url` przełącza żądanie w tryb video-to-video, co zmienia stawkę za tokeny. Zobacz
[Rozliczenia](#billing).

## Typowe przepisy {#common-recipes}

Poniższe przykłady pokazują treści żądań. Każdą z nich możesz wysłać do endpointu tworzenia zadania pokazanego w sekcji [Szybki start](#quickstart).

### Animacja pierwszej klatki {#animate-a-first-frame}

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

### Przejście od pierwszej do ostatniej klatki {#create-a-first-to-last-frame-transition}

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

### Reżyseria ujęcia z referencjami obrazu, wideo i audio {#direct-a-shot-with-image-video-and-audio-references}

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

W prompcie przypisz każdej referencji jasne zadanie, np. „zachowaj wygląd produktu z obrazu, użyj
ruchu kamery z wideo i podążaj za tempem audio”. To działa pewniej niż proszenie każdego materiału,
by kontrolował cały wynik.

## Pisanie skutecznego promptu {#writing-an-effective-prompt}

Praktyczny prompt zwykle ma taką kolejność:

1. **Obiekt** — kto lub co pojawia się w ujęciu.
2. **Akcja** — co się zmienia lub porusza.
3. **Scena** — miejsce, pora dnia, pogoda i szczegóły otoczenia.
4. **Styl wizualny** — filmowy, dokumentalny, reklama produktu, animacja itd.
5. **Kamera** — kadrowanie, charakter obiektywu, ruch kamery i cięcia.
6. **Dźwięk** — dialog, atmosfera, muzyka lub efekty, gdy włączone jest `generate_audio`.

Wyraźnie określ, co ma pozostać niezmienne. Na przykład: „Etykieta produktu pozostaje czytelna, kamera wykonuje jeden powolny
najazd, bez cięć scen, naturalny dźwięk pomieszczenia”. Gdy jest kilka referencji, opisz, jaką cechę wizualną lub ruchową
wziąć z każdej z nich.

## Opcje wyjścia {#output-options}

| Parametr | Typ | Domyślnie | Wartości |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` nie obsługuje `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` wybiera proporcje na podstawie wejścia i promptu |
| `duration` | integer | `5` | Od 4 do 15 sekund lub `-1`, aby model sam wybrał wartość z obsługiwanego zakresu |
| `generate_audio` | boolean | `true` | Generuje zsynchronizowany głos, efekty dźwiękowe i muzykę w tle |
| `seed` | integer | `-1` | Od `-1` do `2^32-1`. Ten sam prompt i seed dają podobny, ale nie identyczny wynik |
| `watermark` | boolean | `false` | Dodaje znak wodny AI-generated w prawym dolnym rogu |
| `tools` | array | `[]` | `[{"type": "web_search"}]` włącza wyszukiwanie w sieci podczas planowania ujęcia |

### Sterowanie zadaniem {#task-control}

| Parametr | Typ | Domyślnie | Uwagi |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Limit czasu zadania w sekundach, od 3600 do 259200. Zadanie po przekroczeniu limitu otrzymuje status `expired` |
| `service_tier` | string | `default` | Te modele nie obsługują `flex` |
| `safety_identifier` | string | — | Nieprzezroczysty identyfikator użytkownika końcowego, maksymalnie 64 znaki. Wysyłaj skrót (hash), a nie surowe dane osobowe |

### Rozmiar klatki {#frame-size}

`resolution` i `ratio` razem określają wymiary w pikselach:

| Rozdzielczość | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Status zadania {#task-status}

| `status` | Znaczenie | Co zrobić |
| --- | --- | --- |
| `queued` | Przyjęte, czeka na start | Odpytuj dalej co 5–10 sekund |
| `running` | Trwa generowanie | Odpytuj dalej |
| `succeeded` | Gotowe | Pobierz `content.video_url` |
| `failed` | Odrzucone przez moderację treści lub wystąpił błąd modelu | Odczytaj `error.message`. Przed ponowieniem popraw prompt |
| `expired` | Przekroczono `execution_expires_after` | Prześlij ponownie |
| `cancelled` | Zakończone przed rozpoczęciem generowania | Prześlij ponownie |

### Pola zadania {#task-fields}

| Pole | Typ | Uwagi |
| --- | --- | --- |
| `id` | string | Identyfikator zadania zwrócony przy przesłaniu |
| `model` | string | Wysłana wartość `model` |
| `status` | string | Zobacz wyżej |
| `created_at` | integer | Sekundy Unix |
| `updated_at` | integer | Sekundy Unix. Równe `created_at`, dopóki zadanie się nie zakończy |
| `content` | object | Puste, dopóki zadanie nie zakończy się powodzeniem. Zawiera wygenerowany `video_url` |
| `usage` | object | Liczby tokenów. Zobacz [Rozliczenia](#billing) |
| `error` | object | Obecne dla `failed` i `expired`. Zawiera `code` i `message` |

### Pełny przepływ w Pythonie {#complete-python-flow}

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

## Rozliczenia {#billing}

Te modele są rozliczane według `usage.completion_tokens`, które zadanie zgłasza po zakończeniu. Stawka za tokeny zależy od dwóch
czynników:

- **Czy wejście zawiera wideo.** Żądania video-to-video, czyli takie, w których dowolny element `content` ma typ `video_url`, są rozliczane
  według niższej stawki niż text-to-video.
- **Rozdzielczość wyjściowa.** Dla `2.5-official` 1080p kosztuje więcej niż 480p i 720p. Stawka `2.0-official` nie zależy
  od rozdzielczości.

`usage` zawiera `completion_tokens` i `total_tokens`, które obecnie są równe. Podczas działania zadania pole jest puste.
Faktyczne opłaty znajdziesz w [historii konta](/api-reference/account/history), a aktualne stawki w
[przewodniku po cenach](/guides/billing).

## Błędy {#errors}

Nieprawidłowe żądanie od razu zwraca błąd. Błąd z etapu generowania pojawia się w zadaniu podczas odpytywania. Oba używają
obiektu `error` z czytelnym maszynowo `code` i czytelnym dla człowieka `message`:

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

Typowe kroki naprawcze:

| Wynik | Co wypróbować |
| --- | --- |
| `400 InvalidParameter` | Sprawdź nazwę modelu, wymaganą treść, role, rozdzielczość, czas trwania i URL-e materiałów |
| Status zadania `failed` z błędem moderacji treści | Przepisz prompt lub zastąp oznaczony materiał referencyjny przed ponownym przesłaniem |
| Status zadania `expired` | Prześlij nowe zadanie; dla klipów w wysokiej rozdzielczości lub długich rozważ dłuższy `execution_expires_after` |
| `429 RateLimitExceeded` | Ponawiaj z wykładniczym wycofaniem (exponential backoff) i ogranicz liczbę równoległych przesłań |
| `503 ServiceUnavailable` | Ponów to samo żądanie po krótkiej przerwie |

## Korzystanie z zarejestrowanych zasobów multimedialnych (Assets) {#use-registered-media-assets}

SandBase udostępnia zgodny z oficjalnym protokół Asset pod `/v1/assets`. Żądanie Asset i zwracane odwołanie `asset://`
są zgodne z oficjalnym protokołem, a odwołanie jest przekazywane bez zmian w natywnym żądaniu ByteDance Contents
Generations. Zarówno
`bytedance/seedance/2.5-official`, jak i `bytedance/seedance/2.0-official` akceptują to odwołanie
tam, gdzie zwykle przyjmują publiczny URL HTTP(S).

Pełny przepływ wygląda tak:

1. Zarejestruj osiągalny URL multimediów przez `POST /v1/assets`.
2. Odpytuj `GET /v1/assets/{external_id}`, aż dostawca zgłosi, że Asset nadaje się do użycia.
3. Umieść zwrócony `asset_url` w elemencie `content` Seedance i prześlij zadanie generowania.

### Operacje Asset zgodne z oficjalnym protokołem {#official-compatible-asset-operations}

| Metoda | Ścieżka | Przeznaczenie |
| --- | --- | --- |
| `POST` | `/v1/assets` | Rejestruje osiągalny URL multimediów i zwraca zgodne z oficjalnym protokołem odwołanie `asset://` |
| `GET` | `/v1/assets/{external_id}` | Odczytuje status u dostawcy i zwraca bieżący URL podglądu/pobierania |

Publiczne API udostępnia obecnie rejestrację i odczyt. Grupy Asset, listowanie, zmiana nazwy, aktualizacja i usuwanie nie są
operacjami publicznymi. Assets należą do organizacji powiązanej z kluczem API.

### Krok 1: rejestracja Asset {#step-1-register-the-asset}

Wyślij osiągalny URL do `POST /v1/assets`. `asset_type` rozróżnia wielkość liter i musi mieć wartość `Image`, `Video` lub `Audio`:

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

Zapisz `asset_url` z odpowiedzi:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Wartość po `asset://` to `external_id` używany przez zgodną z oficjalnym protokołem operację odczytu.

### Krok 2: sprawdzenie gotowości {#step-2-check-readiness}

Odpytaj Asset za pomocą `external_id`, bez prefiksu `asset://`:

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

Traktuj `status` jako otwartą wartość dostawcy, a nie zamknięty enum. Przed przesłaniem zadania generowania poczekaj, aż dostawca zgłosi stan
nadający się do użycia; typową wartością gotowości jest `Active`. `download_url` jest zarządzany przez dostawcę i
może być pusty podczas przetwarzania. Gdy potrzebujesz aktualnego URL podglądu, odpytaj Asset ponownie. W żądaniach Seedance nadal używaj trwałego
`asset_url` zamiast kopiować `download_url`.

### Krok 3: generowanie z użyciem Asset {#step-3-generate-with-the-asset}

Umieść `asset_url` w polu URL odpowiadającym typowi multimediów. Ten przykład używa zarejestrowanego obrazu jako referencji
wizualnej:

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

Odpowiedź na utworzenie zwraca `id` zadania. Odpytuj
`GET /api/v3/contents/generations/tasks/{task_id}` zgodnie z opisem na stronie wybranego modelu.

### Wybór elementu content i roli {#choose-the-content-item-and-role}

| Typ Asset | `content[].type` | Pole URL | Obsługiwana rola | Zastosowanie |
| --- | --- | --- | --- | --- |
| Obraz | `image_url` | `image_url.url` | `first_frame` | Rozpoczęcie wideo dokładnie od tej klatki |
| Obraz | `image_url` | `image_url.url` | `last_frame` | Zakończenie na tej klatce; dołącz `first_frame` w tym samym żądaniu |
| Obraz | `image_url` | `image_url.url` | `reference_image` | Zachowanie obiektu, produktu, kompozycji, kostiumu lub stylu wizualnego |
| Wideo | `video_url` | `video_url.url` | `reference_video` | Podążanie za ruchem, tempem, pracą kamery lub rytmem montażu |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Podążanie za głosem, dialogiem, muzyką lub udźwiękowieniem |

Audio nie może być jedynym wejściem. Połącz Asset `reference_audio` z tekstem, obrazem lub wideo. Każde żądanie, które
zawiera `video_url`, jest rozliczane według stawki video-to-video.

#### Przykład Asset wideo {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Przykład Asset audio {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### Bezpośredni URL czy odwołanie `asset://`? {#direct-url-or-asset-reference}

| Wejście | Najlepsze, gdy | Kompromis |
| --- | --- | --- |
| Publiczny URL HTTP(S) | Multimedia są już hostowane i używane jednorazowo | Najszybsza ścieżka, ale URL musi pozostać osiągalny do czasu przesłania zadania i pobrania przez dostawcę |
| Odwołanie `asset://` | Multimedia są używane wielokrotnie przez oficjalny protokół Asset | Dodaje krok rejestracji i sprawdzania gotowości, a potem daje trwałe odwołanie dla kolejnych zadań Seedance |

Parametry żądania, odpytywanie, statusy zadań i rozliczenia opisuje [przewodnik po Seedance](#seedance-guide) powyżej.

## Oficjalne zasoby ByteDance {#official-bytedance-resources}
- [Dokumentacja generowania wideo Seedance](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API tworzenia zadania contents generation](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Przewodnik po promptach Seedance 2.0](https://www.volcengine.com/docs/82379/2222480?lang=en)
