---
i18nSource: 39ce638efc41350d
title: Bild generieren
description: Generiere ein Bild mit der synchronen, OpenAI-Images-kompatiblen API.
aside: false
outline: false
apiReference:
  title: Bild generieren
  operation: Images
  method: POST
  path: /v1/images/generations
  description: Generiere Bilder über den synchronen, OpenAI-Images-kompatiblen Endpunkt von SandBase. Dieser Endpunkt ist von der allgemeinen Modell-API /v1/run getrennt.
  signature: client.images.generate(params)
  groups:
    - title: Request-Body
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: Eines von gpt-image-2, gpt-image-2.5-flare oder gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Textbeschreibung des zu generierenden Bildes.
        - name: n
          type: integer
          required: false
          description: Anzahl der zu generierenden Bilder, sofern unterstützt.
        - name: size
          type: string
          required: false
          description: Vom Modell unterstützte Ausgabeabmessungen.
        - name: quality
          type: string
          required: false
          description: Ausgabequalität, etwa low, medium, high oder auto.
        - name: background
          type: string
          required: false
          description: Hintergrundeinstellung, etwa transparent, opaque oder auto.
        - name: output_format
          type: string
          required: false
          description: Ausgabekodierung, etwa png, webp oder jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Komprimierungsgrad der Ausgabe von 0 bis 100.
        - name: moderation
          type: string
          required: false
          description: Provider-kompatible Moderationseinstellung.
        - name: user
          type: string
          required: false
          description: Provider-kompatible Kennung des Endnutzers.
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
    - title: Nur synchron
      description: stream=true, mode=stream und mode=async werden abgelehnt. Verwende das zurückgegebene data-Array direkt.
    - title: Kompatible Felder
      description: Zusätzliche JSON-Felder werden unverändert weitergeleitet, ihre Unterstützung hängt aber vom Modell und Provider ab.
  errors:
    - status: "400"
      description: Ungültiges JSON, nicht unterstütztes Modell, Streaming-Modus oder ungültige Provider-Anfrage.
    - status: "401"
      description: Fehlender oder ungültiger API-Schlüssel.
    - status: "402"
      description: Ausgabenlimit der Organisation oder des API-Schlüssels erreicht.
    - status: "403"
      description: Der Scope des API-Schlüssels berechtigt nicht zu diesem Endpunkt.
    - status: "404"
      description: Das geroutete Bildmodell ist nicht verfügbar.
    - status: "429"
      description: Rate Limit überschritten.
    - status: "500"
      description: Speichern der Anfrage oder Verarbeitung der Antwort fehlgeschlagen.
    - status: "502"
      description: Der Provider hat eine ungültige native Antwort geliefert.
    - status: "503"
      description: Keine Provider-Route war erfolgreich.
---

<ApiReferencePage />

## Unterstützte Modelle {#supported-models}
Diese OpenAI-Bildmodelle nutzen auf diesem Endpunkt die native Images API. Sende den öffentlichen Modellnamen in `model`:

| `model` | Geeignet für |
| --- | --- |
| `gpt-image-2.5-flare` | Schnelle, hochwertige Generierung und Bearbeitung für die alltägliche kreative Arbeit |
| `gpt-image-2.5-sunburst` | Arbeiten, bei denen visuelle Treue und Präzision am wichtigsten sind |
| `gpt-image-2` | Die vorherige GPT-Image-Generation |

Anfragen sind synchron und liefern die Bilddaten in `data` als `b64_json` oder als URL. Dieser Endpunkt ist vom allgemeinen asynchronen Modell-Endpunkt `/v1/run` getrennt; die Seite jedes Modells im [Modellkatalog](https://www.sandbase.ai/models/image-video) dokumentiert diesen Vertrag und die Preise.

Um Bilder zu bearbeiten, sende `multipart/form-data` mit denselben Modellnamen an [`POST /v1/images/edits`](/api-reference/images/edits).
