---
i18nSource: a4db28360a2974cd
title: Modificare un'immagine
description: Modifica immagini caricate con l'API sincrona compatibile con OpenAI Images.
aside: false
outline: false
apiReference:
  title: Modificare un'immagine
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Modifica una o più immagini caricate tramite l'endpoint multipart sincrono di SandBase compatibile con OpenAI Images.
  signature: client.images.edit(params)
  groups:
    - title: Body della richiesta
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: Uno tra gpt-image-2, gpt-image-2.5-flare o gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Descrizione testuale della modifica richiesta.
        - name: image
          type: file | file[]
          required: true
          description: Uno o più file immagine di origine. Ripeti il campo multipart per più immagini.
        - name: mask
          type: file
          required: false
          description: Immagine maschera facoltativa per l'inpainting.
        - name: n
          type: integer
          required: false
          description: Numero di immagini modificate da restituire, se supportato.
        - name: size
          type: string
          required: false
          description: Dimensioni di output supportate dal modello.
        - name: quality
          type: string
          required: false
          description: Qualità di output supportata dal modello.
        - name: background
          type: string
          required: false
          description: Impostazione dello sfondo dell'output.
        - name: input_fidelity
          type: string
          required: false
          description: Quanto fedelmente i modelli supportati devono preservare i dettagli dell'immagine di origine.
        - name: output_format
          type: string
          required: false
          description: Codifica di output, ad esempio png, webp o jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Livello di compressione dell'output da 0 a 100.
        - name: user
          type: string
          required: false
          description: Identificatore dell'utente finale compatibile con il provider.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: Upload multipart
      description: Invia model, prompt e image come multipart/form-data. Ripetendo il campo image vengono mantenuti più file di origine.
    - title: Solo sincrono
      description: stream=true, mode=stream e mode=async vengono rifiutati.
  errors:
    - status: "400"
      description: Body multipart non valido, modello non supportato, modalità streaming o richiesta al provider non valida.
    - status: "401"
      description: API key mancante o non valida.
    - status: "402"
      description: Raggiunto il limite di spesa dell'organizzazione o della API Key.
    - status: "403"
      description: Lo scope della API key non autorizza questo endpoint.
    - status: "404"
      description: Il modello di modifica immagini instradato non è disponibile.
    - status: "429"
      description: Limite di frequenza superato.
    - status: "500"
      description: Persistenza della richiesta o elaborazione della risposta non riuscita.
    - status: "502"
      description: Il provider ha restituito una risposta nativa non valida.
    - status: "503"
      description: Nessuna route del provider è riuscita.
---

<ApiReferencePage />

## Modelli supportati {#supported-models}
Questi modelli di immagini OpenAI usano l'API Images nativa su questo endpoint e su [`/v1/images/generations`](/api-reference/images/generations). Invia il nome pubblico del modello in `model`:

| `model` | Ideale per |
| --- | --- |
| `gpt-image-2.5-flare` | Generazione e modifica rapide e di alta qualità per il lavoro creativo quotidiano |
| `gpt-image-2.5-sunburst` | Lavori in cui fedeltà visiva e precisione contano più di tutto |
| `gpt-image-2` | La generazione precedente di GPT Image |

Le richieste sono sincrone e restituiscono i dati dell'immagine in `data` come `b64_json` o come URL. Questo endpoint è separato dall'endpoint generico asincrono dei modelli `/v1/run`; la pagina di ciascun modello nel [catalogo dei modelli](https://www.sandbase.ai/models/image-video) documenta quel contratto e i relativi prezzi.

Fornisci `model`, `prompt` e almeno un file `image`. Ripeti il campo `image` per comporre o modificare più immagini di origine:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
