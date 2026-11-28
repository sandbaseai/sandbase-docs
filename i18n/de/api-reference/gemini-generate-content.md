---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: SandBase mit dem nativen Google-Gemini-Protokoll GenerateContent aufrufen.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Sendet eine native Gemini-Anfrage und erhält eine Gemini-kompatible Antwort. Verwende streamGenerateContent für Streaming.
  groups:
    - title: Pfadparameter
      fields:
        - name: model
          type: string
          required: true
          description: Reiner Google-Modellname, etwa gemini-3.5-flash. SandBase löst ihn als google/{model} auf.
    - title: Request-Body
      fields:
        - name: contents
          type: array
          required: false
          description: Gemini-Gesprächsinhalte aus role und parts.
        - name: systemInstruction
          type: object
          required: false
          description: System-Anweisung als Text in Gemini-Content-Form.
        - name: generationConfig
          type: object
          required: false
          description: Einstellungen für Sampling, Ausgabelänge, strukturierte Ausgabe und Thinking.
        - name: tools
          type: array
          required: false
          description: Function Declarations oder unterstützte Konfiguration integrierter Gemini-Tools.
        - name: toolConfig
          type: object
          required: false
          description: Richtlinie für Function Calling in Gemini.
        - name: safetySettings
          type: array
          required: false
          description: Gemini-Sicherheitskategorien und Schwellenwerte.
        - name: cachedContent
          type: string
          required: false
          description: Gemini-Ressource für Cached Content, die weitergeleitet wird, sofern unterstützt.
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

## Authentifizierung {#authentication}

Google-kompatible Anfragen können den SandBase-API-Key in `x-goog-api-key`, `Authorization: Bearer …` oder im Query-Parameter `key` übergeben, in dieser Prioritätsreihenfolge. Verwende bevorzugt einen Header: Credentials im Query-String können in Proxy-Logs und im Browserverlauf auftauchen.

## Streaming {#streaming}

Ersetze das Methodensuffix durch `:streamGenerateContent`. Ohne Query-Parameter gibt SandBase Google-kompatible Response-Objekte als gestreamtes JSON-Array zurück. Füge `?alt=sse` für Server-Sent Events hinzu:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Native Bildgenerierung {#native-image-generation}

Diese Bildmodelle haben eigene native GenerateContent-Zuordnungen:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

Jede Modellseite listet die Token-Preise und die Kosten pro Bild auf.

Bei diesen Zuordnungen leitet SandBase Request- und Response-Payloads weiter, ohne sie über Chat
Completions umzuwandeln. So bleiben Bild-Parts, Response-Modalitäten und providerspezifische Felder erhalten. Verwende in der URL
den reinen Modellnamen; zum Beispiel wird `google/gemini-3.1-flash-image` im Pfad zu `gemini-3.1-flash-image`.
### Bild bearbeiten {#edit-an-image}

Füge das Quellbild als `inlineData`-Part neben der Textanweisung hinzu. Verwende den MIME-Typ der gesendeten Bytes:

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

### Google Gen AI SDK verwenden {#use-the-google-gen-ai-sdk}

Richte das offizielle SDK auf SandBase aus und verwende deinen SandBase-API-Key:

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

Für Streaming rufst du `:streamGenerateContent?alt=sse` (SDK: `generate_content_stream`) mit demselben Body auf.

### Umgang mit der Antwort {#response-handling}
Lies die generierten Medien aus den zurückgegebenen Candidate-Parts. Da diese Modelle native Passthrough verwenden, werden providerspezifische
Schreibweisen von Feldern und MIME-Metadaten unverändert zurückgegeben. Dekodiere die Base64-Payload und prüfe die tatsächlichen Medienbytes,
bevor du eine Dateiendung wählst.

## Grenzen von Routing und Übersetzung {#routing-and-translation-boundaries}

SandBase wählt nur Provider aus, die das angeforderte native Gemini-Protokoll unterstützen. Hat das ausgewählte Modell keine
kompatible native Zuordnung, schlägt die Anfrage fehl, statt auf einen Provider mit einem anderen Protokoll auszuweichen.

Modelle, die den übersetzten GenerateContent-Pfad verwenden, unterstützen Text, Function Calls und deren Antworten, Inline-Daten vom Typ `image/*`
und öffentliche HTTP(S)-Bildreferenzen. Dieser übersetzte Pfad lehnt nicht unterstützte Inline-MIME-Typen, private Google-Files- oder
`gs://`-Referenzen, mehrere Candidates und nicht unterstützte Response-Modalitäten mit einer Google-artigen `400 INVALID_ARGUMENT`-Antwort
ab. Die oben aufgeführten Zuordnungen zur Bildgenerierung verwenden Raw Passthrough und unterliegen diesen übersetzungsspezifischen
Grenzen nicht; validiere die zurückgegebenen Medienfelder anhand der Antwort des ausgewählten Providers.
