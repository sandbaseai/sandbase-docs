---
i18nSource: 39ce638efc41350d
title: Generowanie obrazu
description: Generuje obraz przez synchroniczne API zgodne z OpenAI Images.
aside: false
outline: false
apiReference:
  title: Generowanie obrazu
  operation: Images
  method: POST
  path: /v1/images/generations
  description: Generuje obrazy przez synchroniczny endpoint SandBase zgodny z OpenAI Images. Ten endpoint jest odrębny od ogólnego API modeli /v1/run.
  signature: client.images.generate(params)
  groups:
    - title: Treść żądania
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: "Jeden z: gpt-image-2, gpt-image-2.5-flare lub gpt-image-2.5-sunburst."
        - name: prompt
          type: string
          required: true
          description: Tekstowy opis obrazu do wygenerowania.
        - name: n
          type: integer
          required: false
          description: Liczba obrazów do wygenerowania, jeśli jest obsługiwana.
        - name: size
          type: string
          required: false
          description: Wymiary wyjściowe obsługiwane przez model.
        - name: quality
          type: string
          required: false
          description: Jakość wyjściowa, np. low, medium, high lub auto.
        - name: background
          type: string
          required: false
          description: Ustawienie tła, np. transparent, opaque lub auto.
        - name: output_format
          type: string
          required: false
          description: Kodowanie wyjściowe, np. png, webp lub jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Poziom kompresji wyjściowej od 0 do 100.
        - name: moderation
          type: string
          required: false
          description: Ustawienie moderacji zgodne z dostawcą.
        - name: user
          type: string
          required: false
          description: Identyfikator użytkownika końcowego zgodny z dostawcą.
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
    - title: Tylko synchronicznie
      description: stream=true, mode=stream i mode=async są odrzucane. Korzystaj bezpośrednio ze zwróconej tablicy data.
    - title: Zgodne pola
      description: Dodatkowe pola JSON są przekazywane bez zmian, ale ich obsługa zależy od modelu i dostawcy.
  errors:
    - status: "400"
      description: Nieprawidłowy JSON, nieobsługiwany model, tryb strumieniowy lub żądanie do dostawcy.
    - status: "401"
      description: Brak klucza API lub klucz jest nieprawidłowy.
    - status: "402"
      description: Osiągnięto limit wydatków organizacji lub klucza API.
    - status: "403"
      description: Zakres klucza API nie uprawnia do tego endpointu.
    - status: "404"
      description: Model obrazu, do którego skierowano żądanie, jest niedostępny.
    - status: "429"
      description: Przekroczono limit żądań.
    - status: "500"
      description: Nie udało się zapisać żądania lub przetworzyć odpowiedzi.
    - status: "502"
      description: Dostawca zwrócił nieprawidłową odpowiedź natywną.
    - status: "503"
      description: Żadna trasa dostawcy nie zakończyła się powodzeniem.
---

<ApiReferencePage />

## Obsługiwane modele {#supported-models}
Te modele obrazów OpenAI korzystają na tym endpoincie z natywnego Images API. Podaj publiczną nazwę modelu w `model`:

| `model` | Najlepszy do |
| --- | --- |
| `gpt-image-2.5-flare` | Szybkiego generowania i edycji wysokiej jakości w codziennej pracy kreatywnej |
| `gpt-image-2.5-sunburst` | Pracy, w której najważniejsze są wierność wizualna i precyzja |
| `gpt-image-2` | Poprzednia generacja GPT Image |

Żądania są synchroniczne i zwracają dane obrazu w `data` jako `b64_json` lub URL. Ten endpoint jest odrębny od ogólnego asynchronicznego endpointu modeli `/v1/run`; strona każdego modelu w [katalogu modeli](https://www.sandbase.ai/models/image-video) opisuje ten kontrakt i cennik.

Aby edytować obrazy, wyślij `multipart/form-data` do [`POST /v1/images/edits`](/api-reference/images/edits) z tymi samymi nazwami modeli.
