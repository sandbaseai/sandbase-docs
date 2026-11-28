---
i18nSource: 4bd032d88bac0470
title: Video Seedance (protocollo Volcengine Ark)
description: Genera video Seedance 2.0 e 2.5 tramite il protocollo di task Contents Generations di Volcengine Ark, con input, polling, fatturazione e Asset multimediali.
aside: false
outline: false
apiReference:
  title: Video Seedance
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Invia un task video Seedance. Un invio riuscito restituisce HTTP 200 e un id di task SandBase.
  groups:
    - title: Corpo della richiesta
      fields:
        - name: model
          type: string
          required: true
          description: "Identificatore del modello supportato: bytedance/seedance/2.0-official o bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: Input tipizzati di testo e media facoltativi. La forma degli elementi viene validata dal modello.
        - name: duration
          type: integer
          required: false
          description: Inoltrato al modello senza modifiche. Si applica la validazione del modello.
        - name: resolution
          type: string
          required: false
          description: Inoltrato al modello senza modifiche. Si applica la validazione del modello.
        - name: ratio
          type: string
          required: false
          description: Inoltrato al modello senza modifiche. Si applica la validazione del modello.
        - name: generate_audio
          type: boolean
          required: false
          description: Inoltrato al modello senza modifiche. Richiede l'audio generato quando supportato.
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

## Guida a Seedance {#seedance-guide}

Seedance genera video a partire da testo, fotogrammi di apertura e di chiusura e riferimenti multimodali come immagini, video e
audio. Usalo per qualsiasi cosa, da una semplice clip text-to-video a un'inquadratura diretta che segue un soggetto visivo, un movimento
di camera e una colonna sonora.

La generazione è asincrona. Invia un task, poi interrogalo con polling finché non raggiunge uno stato terminale.

## Scegliere un modello {#choosing-a-model}

| `model` | Ideale per | Risoluzioni di output |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | Consegna in 1080p e la massima risoluzione di output disponibile | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Generazione a costo più basso quando 480p o 720p sono sufficienti | 480p, 720p |

Entrambi i modelli accettano lo stesso input multimodale e supportano i flussi text-to-video, image-to-video e con riferimenti
multimodali con un'unica forma di richiesta. Scegli `2.0-official` quando 480p o 720p ti bastano e vuoi l'opzione
più economica. Scegli `2.5-official` quando ti serve il 1080p.

## Riferimento API {#api-reference}

| Metodo | Percorso |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

L'elenco dei task e l'annullamento o l'eliminazione di un task non sono supportati. Salva l'`id` del task restituito per recuperare il risultato.

Autentica ogni richiesta con la stessa chiave API usata per creare il task:

```
Authorization: Bearer $SANDBASE_API_KEY
```

Il valore di `model` deve corrispondere a uno dei nomi in [Scegliere un modello](#choosing-a-model). Il polling è il modo supportato per
ricevere i risultati; non affidarti a `callback_url` per questo endpoint.

## Guida rapida {#quickstart}

Invia un task:

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

Interroga il task con quell'id ogni 5-10 secondi finché `status` non è `succeeded`, `failed`, `expired` o `cancelled`:

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

Il video generato è disponibile in `content.video_url`.

## Scegliere un flusso di input {#choose-an-input-workflow}

L'API supporta sette flussi di input comuni. Ogni elemento di `content` ha un `type`; la combinazione di tipi di elemento e
ruoli determina il flusso:

| Obiettivo | Combinazione di `content` | Usalo quando |
| --- | --- | --- |
| Da testo a video | Testo | La scena può essere descritta interamente nel prompt |
| Animare un fotogramma iniziale | Testo (facoltativo) + immagine con `first_frame` | Il primo fotogramma deve corrispondere a un'immagine fornita |
| Transizione tra due fotogrammi | Testo (facoltativo) + `first_frame` + `last_frame` | L'inquadratura richiede un inizio e una fine controllati |
| Seguire un riferimento visivo | Testo (facoltativo) + immagine con `reference_image` | Un soggetto, un prodotto, un costume o uno stile visivo devono restare riconoscibili |
| Seguire movimento o linguaggio di camera | Testo (facoltativo) + video con `reference_video` | Movimento, tempi, ritmo di montaggio o movimento di camera provengono da una clip di riferimento |
| Aggiungere un riferimento audio | Testo/immagine/video + audio con `reference_audio` | Dialoghi, musica, voce o sound design devono guidare il risultato |
| Regia multimodale completa | Riferimenti di testo + immagine + video + audio | Asset diversi controllano aspetto, movimento e suono in un'unica inquadratura |

L'audio non può essere usato da solo. Ogni richiesta che include un elemento audio deve includere anche almeno un elemento di testo, immagine o
video.

### Forme degli elementi di content {#content-item-shapes}

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

`role` indica come il modello deve usare l'asset:

| Asset | `role` | Effetto |
| --- | --- | --- |
| Immagine | `first_frame` | Usa l'immagine come fotogramma iniziale |
| Immagine | `last_frame` | Usa l'immagine come fotogramma finale; includi un `first_frame` nella stessa richiesta |
| Immagine | `reference_image` | Fa riferimento a soggetto, composizione, prodotto, costume o stile visivo |
| Video | `reference_video` | Fa riferimento a movimento, lavoro di camera, tempi o ritmo di montaggio |
| Audio | `reference_audio` | Fa riferimento a voce, dialoghi, musica o sound design |

Gli elementi immagine accettano un URL pubblico oppure un valore inline `data:image/...;base64,...`. I riferimenti video e audio devono
usare URL pubblici che il modello può scaricare.

Includere un qualsiasi elemento `video_url` mette la richiesta in modalità video-to-video, che modifica la tariffa per token. Vedi
[Fatturazione](#billing).

## Ricette comuni {#common-recipes}

Gli esempi seguenti mostrano i corpi delle richieste. Puoi inviarli all'endpoint di creazione task mostrato nella [Guida rapida](#quickstart).

### Animare un primo fotogramma {#animate-a-first-frame}

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

### Creare una transizione dal primo all'ultimo fotogramma {#create-a-first-to-last-frame-transition}

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

### Dirigere un'inquadratura con riferimenti di immagine, video e audio {#direct-a-shot-with-image-video-and-audio-references}

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

Usa il prompt per assegnare un compito chiaro a ogni riferimento: ad esempio, “mantieni l'aspetto del prodotto dall'immagine, usa
il movimento di camera del video e segui il ritmo dell'audio.” È più affidabile che chiedere a ogni asset
di controllare l'intero risultato.

## Scrivere un prompt efficace {#writing-an-effective-prompt}

Un prompt pratico di solito segue questo ordine:

1. **Soggetto**: chi o cosa compare nell'inquadratura.
2. **Azione**: cosa cambia o si muove.
3. **Scena**: luogo, ora del giorno, meteo e dettagli circostanti.
4. **Stile visivo**: cinematografico, documentaristico, spot di prodotto, animazione e così via.
5. **Camera**: inquadratura, resa dell'obiettivo, movimento di camera e tagli.
6. **Suono**: dialoghi, ambiente, musica o effetti quando `generate_audio` è attivo.

Indica esplicitamente cosa deve restare stabile. Ad esempio: “L'etichetta del prodotto resta leggibile, la camera fa un solo lento
push-in, nessun cambio di scena, tono ambientale naturale.” Quando ci sono più riferimenti, descrivi quale qualità visiva o di movimento
prendere da ciascuno.

## Opzioni di output {#output-options}

| Parametro | Tipo | Predefinito | Valori |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` non supporta `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` sceglie le proporzioni in base all'input e al prompt |
| `duration` | integer | `5` | Da 4 a 15 secondi, oppure `-1` per lasciare che il modello scelga entro l'intervallo supportato |
| `generate_audio` | boolean | `true` | Genera voce, effetti sonori e musica di sottofondo sincronizzati |
| `seed` | integer | `-1` | Da `-1` a `2^32-1`. Lo stesso prompt e lo stesso seed producono output simili, non identici |
| `watermark` | boolean | `false` | Aggiunge una filigrana "generato con AI" nell'angolo in basso a destra |
| `tools` | array | `[]` | `[{"type": "web_search"}]` abilita la ricerca web durante la pianificazione dell'inquadratura |

### Controllo del task {#task-control}

| Parametro | Tipo | Predefinito | Note |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Timeout del task in secondi, da 3600 a 259200. Un task che lo supera diventa `expired` |
| `service_tier` | string | `default` | Questi modelli non supportano `flex` |
| `safety_identifier` | string | — | Identificatore opaco dell'utente finale, al massimo 64 caratteri. Invia un hash, non dati personali in chiaro |

### Dimensioni del fotogramma {#frame-size}

`resolution` e `ratio` insieme determinano le dimensioni in pixel:

| Risoluzione | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Stato del task {#task-status}

| `status` | Significato | Cosa fare |
| --- | --- | --- |
| `queued` | Accettato, in attesa di avvio | Continua il polling ogni 5-10 secondi |
| `running` | In generazione | Continua il polling |
| `succeeded` | Completato | Scarica `content.video_url` |
| `failed` | Rifiutato dalla revisione dei contenuti, oppure errore del modello | Leggi `error.message`. Modifica il prompt prima di riprovare |
| `expired` | Ha superato `execution_expires_after` | Invialo di nuovo |
| `cancelled` | Terminato prima dell'inizio della generazione | Invialo di nuovo |

### Campi del task {#task-fields}

| Campo | Tipo | Note |
| --- | --- | --- |
| `id` | string | L'id del task restituito all'invio |
| `model` | string | Il valore di `model` che hai inviato |
| `status` | string | Vedi sopra |
| `created_at` | integer | Secondi Unix |
| `updated_at` | integer | Secondi Unix. Uguale a `created_at` finché il task non termina |
| `content` | object | Vuoto finché il task non riesce. Contiene il `video_url` generato |
| `usage` | object | Conteggi di token. Vedi [Fatturazione](#billing) |
| `error` | object | Presente per `failed` ed `expired`. Contiene `code` e `message` |

### Flusso Python completo {#complete-python-flow}

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

## Fatturazione {#billing}

Questi modelli addebitano in base a `usage.completion_tokens`, che il task riporta al termine. La tariffa per token dipende da due
dimensioni:

- **Se l'input include video.** Le richieste video-to-video, cioè con almeno un elemento di `content` di tipo `video_url`, hanno
  una tariffa più bassa rispetto al text-to-video.
- **Risoluzione di output.** Per `2.5-official`, il 1080p costa più di 480p e 720p. La tariffa di `2.0-official` non varia
  con la risoluzione.

`usage` riporta `completion_tokens` e `total_tokens`, che al momento sono uguali. È vuoto mentre il task è in esecuzione.
Consulta la [cronologia dell'account](/api-reference/account/history) per gli addebiti effettivi e la
[guida ai prezzi](/guides/billing) per le tariffe attuali.

## Errori {#errors}

Una richiesta non valida restituisce subito un errore. Un errore in fase di generazione compare nel task dopo il polling. Entrambi usano un
oggetto `error` con un `code` leggibile dalle macchine e un `message` leggibile dalle persone:

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

Passi di ripristino comuni:

| Risultato | Cosa provare |
| --- | --- |
| `400 InvalidParameter` | Controlla nome del modello, contenuti obbligatori, ruoli, risoluzione, durata e URL degli asset |
| Stato del task `failed` con un errore di revisione dei contenuti | Riscrivi il prompt o sostituisci l'asset di riferimento segnalato prima di inviare di nuovo |
| Stato del task `expired` | Invia un nuovo task; valuta un `execution_expires_after` più lungo per clip lunghe o ad alta risoluzione |
| `429 RateLimitExceeded` | Riprova con backoff esponenziale e riduci gli invii simultanei |
| `503 ServiceUnavailable` | Riprova la stessa richiesta dopo una breve attesa |

## Usare Asset multimediali registrati {#use-registered-media-assets}

SandBase espone il protocollo Asset compatibile con quello ufficiale su `/v1/assets`. La richiesta Asset e il riferimento `asset://`
restituito seguono il protocollo ufficiale e il riferimento viene passato senza modifiche nella richiesta nativa Contents
Generations di ByteDance. Sia
`bytedance/seedance/2.5-official` sia `bytedance/seedance/2.0-official` accettano quel riferimento
dove normalmente accettano un URL HTTP(S) pubblico.

Il flusso completo è:

1. Registra un URL multimediale raggiungibile con `POST /v1/assets`.
2. Interroga `GET /v1/assets/{external_id}` finché il provider non segnala che l'Asset è utilizzabile.
3. Inserisci l'`asset_url` restituito in un elemento `content` di Seedance e invia il task di generazione.

### Operazioni Asset compatibili con quelle ufficiali {#official-compatible-asset-operations}

| Metodo | Percorso | Scopo |
| --- | --- | --- |
| `POST` | `/v1/assets` | Registra un URL multimediale raggiungibile e ricevi un riferimento `asset://` compatibile con quello ufficiale |
| `GET` | `/v1/assets/{external_id}` | Legge lo stato del provider e ottiene l'URL corrente di anteprima/download |

Al momento l'API pubblica espone registrazione e consultazione. Gruppi di Asset, elenco, rinomina, aggiornamento ed eliminazione non sono
operazioni pubbliche. Gli Asset appartengono all'organizzazione associata alla chiave API.

### Passo 1: registrare l'Asset {#step-1-register-the-asset}

Invia l'URL raggiungibile a `POST /v1/assets`. `asset_type` distingue maiuscole e minuscole e deve essere `Image`, `Video` o `Audio`:

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

Salva `asset_url` dalla risposta:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Il valore dopo `asset://` è l'`external_id` usato dall'operazione di consultazione compatibile con quella ufficiale.

### Passo 2: verificare la disponibilità {#step-2-check-readiness}

Interroga l'Asset con l'`external_id`, senza il prefisso `asset://`:

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

Considera `status` un valore aperto del provider e non un enum esaustivo. Attendi che il provider segnali uno stato
utilizzabile prima di inviare il task di generazione; un valore comune di disponibilità è `Active`. `download_url` è gestito dal provider e
può essere vuoto durante l'elaborazione. Interroga di nuovo l'Asset quando ti serve un URL di anteprima aggiornato. Nelle richieste Seedance continua a usare
l'`asset_url` persistente invece di copiare `download_url`.

### Passo 3: generare con l'Asset {#step-3-generate-with-the-asset}

Inserisci `asset_url` nel campo URL corrispondente al tipo di media. Questo esempio usa l'immagine registrata come riferimento
visivo:

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

La risposta di creazione restituisce l'`id` del task. Interroga
`GET /api/v3/contents/generations/tasks/{task_id}` come descritto nella pagina del modello selezionato.

### Scegliere elemento di content e ruolo {#choose-the-content-item-and-role}

| Tipo di Asset | `content[].type` | Campo URL | Ruolo supportato | Usalo per |
| --- | --- | --- | --- | --- |
| Immagine | `image_url` | `image_url.url` | `first_frame` | Far iniziare il video esattamente da questo fotogramma |
| Immagine | `image_url` | `image_url.url` | `last_frame` | Terminare su questo fotogramma; includi un `first_frame` nella stessa richiesta |
| Immagine | `image_url` | `image_url.url` | `reference_image` | Preservare soggetto, prodotto, composizione, costume o stile visivo |
| Video | `video_url` | `video_url.url` | `reference_video` | Seguire movimento, tempi, lavoro di camera o ritmo di montaggio |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Seguire voce, dialoghi, musica o sound design |

L'audio non può essere l'unico input. Combina un Asset `reference_audio` con testo, un'immagine o un video. Qualsiasi richiesta che
contiene un `video_url` usa la tariffa video-to-video.

#### Esempio di Asset video {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Esempio di Asset audio {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### URL diretto o riferimento `asset://`? {#direct-url-or-asset-reference}

| Input | Ideale quando | Compromesso |
| --- | --- | --- |
| URL HTTP(S) pubblico | Il media è già ospitato e viene usato una volta | Percorso più rapido, ma l'URL deve restare raggiungibile fino all'invio del task e al recupero da parte del provider |
| Riferimento `asset://` | Il media viene riusato tramite il protocollo Asset ufficiale | Aggiunge un passaggio di registrazione e verifica, poi fornisce un riferimento persistente per i task Seedance successivi |

Per parametri della richiesta, polling, stati dei task e fatturazione, vedi la [Guida a Seedance](#seedance-guide) sopra.

## Risorse ufficiali di ByteDance {#official-bytedance-resources}
- [Documentazione sulla generazione video Seedance](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API per creare un task di contents generation](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Guida ai prompt di Seedance 2.0](https://www.volcengine.com/docs/82379/2222480?lang=en)
