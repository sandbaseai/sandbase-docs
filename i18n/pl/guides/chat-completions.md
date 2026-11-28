---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: "Korzystaj z SandBase przez chat completions zgodne z OpenAI: strumieniowanie, narzędzia, wejście multimodalne i ustrukturyzowane wyjście."
---

# Chat Completions {#chat-completions}

SandBase udostępnia endpoint Chat Completions zgodny z OpenAI pod `POST /v1/chat/completions`. Istniejące aplikacje korzystające z OpenAI SDK mogą używać SandBase po zmianie klucza API i bazowego URL.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Wiadomości i treści multimodalne {#messages-and-multimodal-content}

Wysyłaj wiadomości w kolejności rozmowy, używając ról obsługiwanych przez wybranego dostawcę, zwykle `system`, `developer`, `user`, `assistant` i `tool`. Tekst może być ciągiem znaków. Modele obsługujące obraz przyjmują też części treści, takie jak `text` i `image_url`.

## Strumieniowanie {#streaming}

Ustaw `stream: true`, aby otrzymywać Server-Sent Events. Odczytuj kolejno każde zdarzenie `data:` i łącz `choices[0].delta.content`. Strumień kończy się `data: [DONE]`. Dodaj `stream_options: {"include_usage": true}`, gdy wybrany dostawca przekazuje użycie w strumieniu; w przeciwnym razie użycia może brakować.

## Narzędzia {#tools}

Zdefiniuj wywoływalne funkcje w `tools`. Gdy asystent zwróci `tool_calls`, wykonaj każdą funkcję w swojej aplikacji, a przed kontynuacją dołącz wiadomość `tool` z odpowiednim `tool_call_id`.

## Ustrukturyzowane wyjście {#structured-output}

Użyj `response_format`, aby zażądać odpowiedzi w formie obiektu JSON lub zgodnej z JSON Schema. Obsługa zależy od modelu, więc zanim zaczniesz polegać na ścisłym wymuszaniu schematu, sprawdź możliwości wybranego modelu.

## Parametry specyficzne dla dostawcy {#provider-specific-parameters}

SandBase używa `model` i `stream` do routingu. Dodatkowe pola żądania zgodne z OpenAI są zachowywane, gdy wybrany dostawca korzysta z tego samego protokołu. Gdy SandBase tłumaczy między protokołami, używaj udokumentowanych pól lub `extra_body`; obsługa zależy od dostawcy.

## Błędy i ponowienia {#errors-and-retries}

Stosuj ograniczone wycofywanie dla `429` i przejściowych odpowiedzi serwera, które można ponowić, tylko wtedy, gdy ponowne generowanie jest bezpieczne. Nie ponawiaj automatycznie błędnie sformułowanych żądań, błędów uwierzytelniania ani żądań, których skutki uboczne narzędzi mogły już wystąpić. Zobacz [Błędy i ponowienia](/guides/error-handling). Pełny schemat pól i odpowiedzi znajdziesz w [Chat Completions API](/api-reference/llm-gateway).
