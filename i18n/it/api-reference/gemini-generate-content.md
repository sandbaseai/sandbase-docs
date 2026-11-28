---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: Chiama SandBase con il protocollo nativo Google Gemini GenerateContent.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Invia una richiesta Gemini nativa e ricevi una risposta compatibile con Gemini. Usa streamGenerateContent per lo streaming.
  groups:
    - title: Parametri di percorso
      fields:
        - name: model
          type: string
          required: true
          description: Nome semplice del modello Google, ad esempio gemini-3.5-flash. SandBase lo risolve come google/{model}.
    - title: Corpo della richiesta
      fields:
        - name: contents
          type: array
          required: false
          description: Contenuti della conversazione Gemini composti da role e parts.
        - name: systemInstruction
          type: object
          required: false
          description: Istruzione di sistema testuale in formato Content di Gemini.
        - name: generationConfig
          type: object
          required: false
          description: Impostazioni di campionamento, lunghezza dell'output, output strutturato e thinking.
        - name: tools
          type: array
          required: false
          description: Dichiarazioni di funzione o configurazione supportata dei tool integrati di Gemini.
        - name: toolConfig
          type: object
          required: false
          description: Policy di function calling di Gemini.
        - name: safetySettings
          type: array
          required: false
          description: Categorie e soglie di sicurezza di Gemini.
        - name: cachedContent
          type: string
          required: false
          description: Risorsa cached-content di Gemini, inoltrata quando supportata.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## Autenticazione {#authentication}

Le richieste compatibili con Google possono passare la API key SandBase in `x-goog-api-key`, `Authorization: Bearer …` o nel parametro di query `key`, in quest'ordine di priorità. Preferisci un header: le credenziali nella query string possono comparire nei log dei proxy e nella cronologia del browser.

## Streaming {#streaming}

Sostituisci il suffisso del metodo con `:streamGenerateContent`. Senza parametri di query, SandBase restituisce oggetti di risposta compatibili con Google come array JSON in streaming. Aggiungi `?alt=sse` per i Server-Sent Events:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Generazione nativa di immagini {#native-image-generation}

Questi modelli di immagini hanno mappature GenerateContent native dedicate:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

La pagina di ogni modello riporta i prezzi per token e il costo per immagine.

Per queste mappature, SandBase inoltra i payload di richiesta e risposta senza convertirli tramite Chat
Completions. In questo modo vengono preservati le parti immagine, le modalità di risposta e i campi definiti dal provider. Usa il nome semplice del modello
nell'URL; ad esempio, `google/gemini-3.1-flash-image` diventa `gemini-3.1-flash-image` nel percorso.
### Modificare un'immagine {#edit-an-image}

Aggiungi l'immagine di origine come parte `inlineData` accanto all'istruzione testuale. Usa il MIME type dei byte che invii:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### Usare il Google Gen AI SDK {#use-the-google-gen-ai-sdk}

Punta l'SDK ufficiale verso SandBase e usa la tua API key SandBase:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

Per lo streaming, chiama `:streamGenerateContent?alt=sse` (SDK: `generate_content_stream`) con lo stesso corpo.

### Gestione della risposta {#response-handling}
Leggi i media generati dalle parti del candidato restituito. Poiché questi modelli usano il passthrough nativo, il casing dei campi
definiti dal provider e i metadati MIME vengono restituiti così come ricevuti. Decodifica il payload base64 e verifica i byte effettivi del media
prima di scegliere un'estensione di file.

## Routing e limiti della traduzione {#routing-and-translation-boundaries}

SandBase seleziona solo i provider che supportano il protocollo Gemini nativo richiesto. Se il modello selezionato non ha una
mappatura nativa compatibile, la richiesta fallisce invece di ripiegare su un provider con un protocollo diverso.

I modelli che usano il percorso GenerateContent tradotto supportano testo, chiamate di funzione e relative risposte, dati inline `image/*`
e riferimenti a immagini HTTP(S) pubbliche. Quel percorso tradotto rifiuta MIME type inline non supportati, Google Files privati o
riferimenti `gs://`, candidati multipli e modalità di risposta non supportate con una risposta `400 INVALID_ARGUMENT` in stile Google.
Le mappature di generazione di immagini elencate sopra usano il passthrough diretto e non sono soggette a questi limiti propri della traduzione;
valida i campi media restituiti in base alla risposta del provider selezionato.
