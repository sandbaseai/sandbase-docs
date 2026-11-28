---
i18nSource: a4db28360a2974cd
title: Edytuj obraz
description: Edytuj przesłane obrazy za pomocą synchronicznego API zgodnego z OpenAI Images.
aside: false
outline: false
apiReference:
  title: Edytuj obraz
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Edytuj jeden lub więcej przesłanych obrazów przez synchroniczny endpoint multipart SandBase zgodny z OpenAI Images.
  signature: client.images.edit(params)
  groups:
    - title: Treść żądania
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: "Jeden z: gpt-image-2, gpt-image-2.5-flare lub gpt-image-2.5-sunburst."
        - name: prompt
          type: string
          required: true
          description: Tekstowy opis żądanej edycji.
        - name: image
          type: file | file[]
          required: true
          description: Jeden lub więcej plików obrazów źródłowych. Aby przesłać wiele obrazów, powtórz pole multipart.
        - name: mask
          type: file
          required: false
          description: Opcjonalna maska do inpaintingu.
        - name: n
          type: integer
          required: false
          description: Liczba zwracanych edytowanych obrazów, jeśli jest obsługiwana.
        - name: size
          type: string
          required: false
          description: Wymiary wyjściowe obsługiwane przez model.
        - name: quality
          type: string
          required: false
          description: Jakość wyjściowa obsługiwana przez model.
        - name: background
          type: string
          required: false
          description: Ustawienie tła wyniku.
        - name: input_fidelity
          type: string
          required: false
          description: Jak dokładnie obsługiwane modele mają zachowywać szczegóły obrazu źródłowego.
        - name: output_format
          type: string
          required: false
          description: Kodowanie wyniku, np. png, webp lub jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Poziom kompresji wyniku od 0 do 100.
        - name: user
          type: string
          required: false
          description: Identyfikator użytkownika końcowego zgodny z dostawcą.
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
    - title: Przesyłanie multipart
      description: Wyślij model, prompt i image jako multipart/form-data. Powtarzanie pola image zachowuje wiele plików źródłowych.
    - title: Tylko tryb synchroniczny
      description: stream=true, mode=stream i mode=async są odrzucane.
  errors:
    - status: "400"
      description: Nieprawidłowa treść multipart, nieobsługiwany model, tryb strumieniowy lub żądanie do dostawcy.
    - status: "401"
      description: Brak klucza API lub klucz jest nieprawidłowy.
    - status: "402"
      description: Osiągnięto limit wydatków organizacji lub klucza API.
    - status: "403"
      description: Zakres klucza API nie uprawnia do tego endpointu.
    - status: "404"
      description: Wybrany model edycji obrazów jest niedostępny.
    - status: "429"
      description: Przekroczono limit żądań.
    - status: "500"
      description: Nie udało się zapisać żądania lub przetworzyć odpowiedzi.
    - status: "502"
      description: Dostawca zwrócił nieprawidłową natywną odpowiedź.
    - status: "503"
      description: Żadna trasa dostawcy nie zakończyła się powodzeniem.
---

<ApiReferencePage />

## Obsługiwane modele {#supported-models}
Te modele obrazów OpenAI używają natywnego Images API na tym endpoincie oraz na [`/v1/images/generations`](/api-reference/images/generations). Podaj publiczną nazwę modelu w `model`:

| `model` | Najlepszy do |
| --- | --- |
| `gpt-image-2.5-flare` | Szybkie, wysokiej jakości generowanie i edycja w codziennej pracy kreatywnej |
| `gpt-image-2.5-sunburst` | Zadania, w których najważniejsza jest wierność wizualna i precyzja |
| `gpt-image-2` | Poprzednia generacja GPT Image |

Żądania są synchroniczne i zwracają dane obrazu w `data` jako `b64_json` lub URL. Ten endpoint jest oddzielony od ogólnego asynchronicznego endpointu modeli `/v1/run`; strona każdego modelu w [katalogu modeli](https://www.sandbase.ai/models/image-video) dokumentuje ten kontrakt i cennik.

Podaj `model`, `prompt` oraz co najmniej jeden plik `image`. Powtórz pole `image`, aby łączyć lub edytować wiele obrazów źródłowych:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
