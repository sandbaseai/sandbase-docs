---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: Wywołuj SandBase przez natywny protokół Google Gemini GenerateContent.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Wyślij natywne żądanie Gemini i otrzymaj odpowiedź zgodną z Gemini. Do strumieniowania użyj streamGenerateContent.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: model
          type: string
          required: true
          description: Sama nazwa modelu Google, np. gemini-3.5-flash. SandBase rozwiązuje ją jako google/{model}.
    - title: Treść żądania
      fields:
        - name: contents
          type: array
          required: false
          description: Treść rozmowy Gemini złożona z role i parts.
        - name: systemInstruction
          type: object
          required: false
          description: Tekstowa instrukcja systemowa w formie Gemini Content.
        - name: generationConfig
          type: object
          required: false
          description: Ustawienia próbkowania, długości wyjścia, ustrukturyzowanego wyjścia i myślenia.
        - name: tools
          type: array
          required: false
          description: Deklaracje funkcji lub obsługiwana konfiguracja wbudowanych narzędzi Gemini.
        - name: toolConfig
          type: object
          required: false
          description: Polityka wywoływania funkcji Gemini.
        - name: safetySettings
          type: array
          required: false
          description: Kategorie i progi bezpieczeństwa Gemini.
        - name: cachedContent
          type: string
          required: false
          description: Zasób zbuforowanej treści Gemini przekazywany dalej, jeśli jest obsługiwany.
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

## Uwierzytelnianie {#authentication}

Żądania zgodne z Google mogą przekazywać klucz API SandBase w `x-goog-api-key`, `Authorization: Bearer …` lub parametrze zapytania `key`, w tej kolejności priorytetu. Preferuj nagłówek: poświadczenia w ciągu zapytania mogą trafić do logów proxy i historii przeglądarki.

## Strumieniowanie {#streaming}

Zastąp sufiks metody przez `:streamGenerateContent`. Bez parametru zapytania SandBase zwraca obiekty odpowiedzi zgodne z Google jako strumieniowaną tablicę JSON. Dodaj `?alt=sse`, aby otrzymać Server-Sent Events:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Natywne generowanie obrazów {#native-image-generation}

Te modele obrazów mają dedykowane natywne mapowania GenerateContent:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

Strona każdego modelu podaje ceny tokenów i koszt jednego obrazu.

W przypadku tych mapowań SandBase przekazuje treść żądania i odpowiedzi bez konwersji przez Chat
Completions. Dzięki temu zachowane są części z obrazami, modalności odpowiedzi i pola zdefiniowane przez dostawcę. W URL używaj samej nazwy modelu;
na przykład `google/gemini-3.1-flash-image` w ścieżce staje się `gemini-3.1-flash-image`.
### Edycja obrazu {#edit-an-image}

Dodaj obraz źródłowy jako część `inlineData` obok instrukcji tekstowej. Użyj typu MIME wysyłanych bajtów:

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

### Korzystanie z Google Gen AI SDK {#use-the-google-gen-ai-sdk}

Skieruj oficjalny SDK na SandBase i użyj klucza API SandBase:

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

Do strumieniowania wywołaj `:streamGenerateContent?alt=sse` (SDK: `generate_content_stream`) z tą samą treścią.

### Obsługa odpowiedzi {#response-handling}
Wygenerowane media odczytaj ze zwróconych części kandydata. Ponieważ te modele używają natywnego przekazywania, wielkość liter pól zdefiniowanych przez dostawcę
i metadane MIME są zwracane w otrzymanej postaci. Zdekoduj ładunek base64 i sprawdź faktyczne bajty mediów
przed wyborem rozszerzenia pliku.

## Granice routingu i tłumaczenia {#routing-and-translation-boundaries}

SandBase wybiera tylko dostawców obsługujących żądany natywny protokół Gemini. Jeśli wybrany model nie ma
zgodnego natywnego mapowania, żądanie kończy się błędem zamiast przełączenia na dostawcę z innym protokołem.

Modele korzystające z tłumaczonej ścieżki GenerateContent obsługują tekst, wywołania funkcji i odpowiedzi na nie, dane inline `image/*`
oraz publiczne odwołania HTTP(S) do obrazów. Ta tłumaczona ścieżka odrzuca nieobsługiwane typy MIME inline, prywatne odwołania Google Files lub
`gs://`, wielu kandydatów oraz nieobsługiwane modalności odpowiedzi, zwracając odpowiedź `400 INVALID_ARGUMENT` w stylu Google.
Wymienione wyżej mapowania generowania obrazów używają surowego przekazywania i nie podlegają ograniczeniom ścieżki tłumaczonej;
weryfikuj zwrócone pola mediów zgodnie z odpowiedzią wybranego dostawcy.
