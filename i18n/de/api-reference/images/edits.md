---
i18nSource: a4db28360a2974cd
title: Bild bearbeiten
description: Hochgeladene Bilder mit der synchronen, OpenAI-Images-kompatiblen API bearbeiten.
aside: false
outline: false
apiReference:
  title: Bild bearbeiten
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Bearbeitet ein oder mehrere hochgeladene Bilder über den synchronen, OpenAI-Images-kompatiblen Multipart-Endpunkt von SandBase.
  signature: client.images.edit(params)
  groups:
    - title: Request-Body
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: Eines von gpt-image-2, gpt-image-2.5-flare oder gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Textbeschreibung der gewünschten Bearbeitung.
        - name: image
          type: file | file[]
          required: true
          description: Eine oder mehrere Quellbilddateien. Wiederhole das Multipart-Feld für mehrere Bilder.
        - name: mask
          type: file
          required: false
          description: Optionales Maskenbild für Inpainting.
        - name: n
          type: integer
          required: false
          description: Anzahl der zurückzugebenden bearbeiteten Bilder, sofern unterstützt.
        - name: size
          type: string
          required: false
          description: Vom Modell unterstützte Ausgabeabmessungen.
        - name: quality
          type: string
          required: false
          description: Vom Modell unterstützte Ausgabequalität.
        - name: background
          type: string
          required: false
          description: Einstellung für den Ausgabehintergrund.
        - name: input_fidelity
          type: string
          required: false
          description: Wie genau unterstützte Modelle die Details des Quellbilds beibehalten sollen.
        - name: output_format
          type: string
          required: false
          description: Ausgabekodierung wie png, webp oder jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Kompressionsstufe der Ausgabe von 0 bis 100.
        - name: user
          type: string
          required: false
          description: Anbieterkompatible Endnutzer-Kennung.
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
    - title: Multipart-Uploads
      description: Sende model, prompt und image als multipart/form-data. Wenn du das Feld image wiederholst, bleiben mehrere Quelldateien erhalten.
    - title: Nur synchron
      description: stream=true, mode=stream und mode=async werden abgelehnt.
  errors:
    - status: "400"
      description: Ungültiger Multipart-Body, nicht unterstütztes Modell, Streaming-Modus oder ungültige Anbieteranfrage.
    - status: "401"
      description: Fehlender oder ungültiger API-Schlüssel.
    - status: "402"
      description: Ausgabelimit der Organisation oder des API-Schlüssels erreicht.
    - status: "403"
      description: Der Scope des API-Schlüssels berechtigt nicht zu diesem Endpunkt.
    - status: "404"
      description: Das geroutete Bildbearbeitungsmodell ist nicht verfügbar.
    - status: "429"
      description: Rate-Limit überschritten.
    - status: "500"
      description: Speichern der Anfrage oder Verarbeitung der Antwort fehlgeschlagen.
    - status: "502"
      description: Der Anbieter hat eine ungültige native Antwort zurückgegeben.
    - status: "503"
      description: Keine Anbieterroute war erfolgreich.
---

<ApiReferencePage />

## Unterstützte Modelle {#supported-models}
Diese OpenAI-Bildmodelle verwenden auf diesem Endpunkt und auf [`/v1/images/generations`](/api-reference/images/generations) die native Images API. Sende den öffentlichen Modellnamen in `model`:

| `model` | Geeignet für |
| --- | --- |
| `gpt-image-2.5-flare` | Schnelle, hochwertige Generierung und Bearbeitung für die tägliche kreative Arbeit |
| `gpt-image-2.5-sunburst` | Arbeiten, bei denen visuelle Treue und Präzision am wichtigsten sind |
| `gpt-image-2` | Die vorherige GPT-Image-Generation |

Anfragen sind synchron und liefern Bilddaten in `data` als `b64_json` oder als URL. Dieser Endpunkt ist vom allgemeinen asynchronen Modell-Endpunkt `/v1/run` getrennt; die Seite jedes Modells im [Modellkatalog](https://www.sandbase.ai/models/image-video) dokumentiert diesen Vertrag und die Preise.

Gib `model`, `prompt` und mindestens eine `image`-Datei an. Wiederhole das Feld `image`, um mehrere Quellbilder zu kombinieren oder zu bearbeiten:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
