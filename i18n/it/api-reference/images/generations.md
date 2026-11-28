---
i18nSource: 39ce638efc41350d
title: Genera immagine
description: Genera un'immagine con l'API sincrona compatibile con OpenAI Images.
aside: false
outline: false
apiReference:
  title: Genera immagine
  operation: Images
  method: POST
  path: /v1/images/generations
  description: Genera immagini tramite l'endpoint sincrono di SandBase compatibile con OpenAI Images. Questo endpoint è distinto dall'API generale dei modelli /v1/run.
  signature: client.images.generate(params)
  groups:
    - title: Corpo della richiesta
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: Uno tra gpt-image-2, gpt-image-2.5-flare o gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Descrizione testuale dell'immagine da generare.
        - name: n
          type: integer
          required: false
          description: Numero di immagini da generare, se supportato.
        - name: size
          type: string
          required: false
          description: Dimensioni di output supportate dal modello.
        - name: quality
          type: string
          required: false
          description: Qualità di output, ad esempio low, medium, high o auto.
        - name: background
          type: string
          required: false
          description: Impostazione dello sfondo, ad esempio transparent, opaque o auto.
        - name: output_format
          type: string
          required: false
          description: Codifica di output, ad esempio png, webp o jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Livello di compressione dell'output da 0 a 100.
        - name: moderation
          type: string
          required: false
          description: Impostazione di moderazione compatibile con il provider.
        - name: user
          type: string
          required: false
          description: Identificatore dell'utente finale compatibile con il provider.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: Solo sincrono
      description: stream=true, mode=stream e mode=async vengono rifiutati. Usa direttamente l'array data restituito.
    - title: Campi compatibili
      description: I campi JSON aggiuntivi vengono inoltrati senza modifiche, ma il supporto dipende dal modello e dal provider.
  errors:
    - status: "400"
      description: JSON non valido, modello non supportato, modalità streaming o richiesta al provider non valida.
    - status: "401"
      description: Chiave API mancante o non valida.
    - status: "402"
      description: Raggiunto il limite di spesa dell'organizzazione o dell'API Key.
    - status: "403"
      description: L'ambito della chiave API non autorizza questo endpoint.
    - status: "404"
      description: Il modello di immagini instradato non è disponibile.
    - status: "429"
      description: Limite di frequenza superato.
    - status: "500"
      description: Salvataggio della richiesta o elaborazione della risposta non riuscita.
    - status: "502"
      description: Il provider ha restituito una risposta nativa non valida.
    - status: "503"
      description: Nessuna route del provider è andata a buon fine.
---

<ApiReferencePage />

## Modelli supportati {#supported-models}
Questi modelli di immagini OpenAI usano la Images API nativa su questo endpoint. Invia il nome pubblico del modello in `model`:

| `model` | Ideale per |
| --- | --- |
| `gpt-image-2.5-flare` | Generazione e modifica rapide e di alta qualità per il lavoro creativo quotidiano |
| `gpt-image-2.5-sunburst` | Lavori in cui fedeltà visiva e precisione contano di più |
| `gpt-image-2` | La generazione precedente di GPT Image |

Le richieste sono sincrone e restituiscono i dati dell'immagine in `data` come `b64_json` o come URL. Questo endpoint è separato dall'endpoint generale asincrono dei modelli `/v1/run`; la pagina di ciascun modello nel [catalogo dei modelli](https://www.sandbase.ai/models/image-video) documenta quel contratto e i relativi prezzi.

Per modificare immagini, invia `multipart/form-data` a [`POST /v1/images/edits`](/api-reference/images/edits) con gli stessi nomi di modello.
