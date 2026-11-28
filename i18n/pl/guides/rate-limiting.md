---
i18nSource: d326fdb78ea64bdf
title: Limity żądań
description: Bezpiecznie obsługuj limity żądań API SandBase dzięki ograniczonym ponowieniom, losowemu rozrzutowi, kolejkom i obsłudze żądań z uwzględnieniem idempotencji.
---

# Limity żądań {#rate-limits}

SandBase może przypisać Twojej organizacji limit żądań na minutę. Jest on współdzielony przez wszystkie klucze API w organizacji
i liczony w jednominutowym oknie przesuwnym. Dostawcy modeli upstream mogą też zwracać własne
odpowiedzi `429 Too Many Requests`. Nie zakodowuj na sztywno limitu, chyba że SandBase przypisał go do Twojego obciążenia.

## Limit Twojej organizacji {#your-organization-s-limit}
SandBase nie publikuje jednej stałej liczby żądań na minutę, ponieważ limit jest przypisywany każdej organizacji osobno. Każdy
klucz API w organizacji wlicza się do tego samego limitu, więc tworzenie kolejnych kluczy go nie podnosi. Limit nie jest
obecnie widoczny w publicznym API ani w Console.

Jeśli Twoje obciążenie wymaga gwarantowanego lub wyższego limitu, skontaktuj się z pomocą techniczną SandBase i podaj organizację, aplikację,
oczekiwane stałe tempo i oczekiwane tempo w szczytach. Nie projektuj klienta produkcyjnego wokół nieudokumentowanej domyślnej wartości liczbowej.

## Obsługa odpowiedzi 429 {#handle-a-429-response}

Generowane przez platformę odpowiedzi limitu żądań `/v1/*` używają płaskiej treści błędu:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

Limit organizacji dotyczy `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload` oraz endpointów Gemini `generateContent`, `streamGenerateContent` i `POST /v1beta/interactions`. Endpointy odpytywania, takie jak
`GET /v1/run/{id}`, nie są wliczane. Endpointy zgodne z protokołami zwracają ten sam `429` we własnej kopercie błędu,
np. w kształcie błędu Anthropic lub Google. Odpowiedź pochodząca od dostawcy może używać kształtu błędu zgodnego endpointu
i zawierać nagłówki limitów żądań dostawcy.

Nagłówki `Retry-After` i pozostałego limitu nie są gwarantowane. Jeśli `Retry-After` jest obecny, zastosuj się do niego. W przeciwnym razie używaj
wykładniczego wycofania z losowym rozrzutem (jitter) i maksymalną liczbą prób.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

SDK OpenAI obsługuje też wbudowane ponawianie przez `max_retries`. Świadomie wybierz albo ponawianie w SDK, albo pętlę ponawiania w aplikacji,
aby ponowienia nie mnożyły się między warstwami.

## Ponawiaj tylko bezpieczne operacje {#retry-only-safe-operations}

Powtórzone żądanie inferencji może utworzyć drugą generację i wygenerować dodatkowy koszt. Ponawiaj je tylko wtedy, gdy Twoja
aplikacja akceptuje ponowne generowanie. Nie ponawiaj automatycznie żądania zmieniającego stan, chyba że operacja ma udokumentowaną
idempotencję albo aplikacja potrafi wykazać, że pierwsza próba się nie powiodła.

W żądaniach strumieniowych `429` zwykle przychodzi przed rozpoczęciem strumienia. Gdy dane już zaczęły napływać, traktuj rozłączenie
jako przerwaną generację, a nie błąd limitu żądań. Zachowaj lub odrzuć częściowe wyjście zgodnie z
wymaganiami produktu; ponowne rozpoczęcie tworzy nową generację.

## Kontrola przepustowości {#control-throughput}

- Ograniczaj równoległość zamiast wypuszczać naraz nieograniczoną partię.
- Kolejkuj pracę o charakterze skokowym i wygładzaj tempo wysyłania.
- Unikaj zduplikowanych żądań i buforuj wyniki wielokrotnego użytku, jeśli pozwalają na to wymagania prywatności i aktualności.
- Używaj osobnych kluczy do określenia właściciela, kontroli wydatków i unieważniania, a nie do obchodzenia limitów platformy.
- Na potrzeby diagnostyki zapisuj endpoint, model, status HTTP i oczyszczoną treść błędu.
- Skontaktuj się z pomocą techniczną SandBase, gdy obciążenie wymaga przypisanego lub wyższego limitu przepustowości.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

Równoległość to nie to samo co liczba żądań na minutę. Dostrajaj oba parametry na podstawie obserwowanych opóźnień i przepustowości przypisanej
do Twojej aplikacji.

::: info Dzienne darmowe wywołania API
100 darmowych wywołań API danych na dobę UTC dla organizacji to pula rozliczeniowa, a nie limit żądań. Wywołania ponad pulę są
rozliczane za każde wywołanie, a nie odrzucane. Zobacz [Dzienne darmowe wywołania API](/guides/billing#daily-free-api-calls).
:::

::: tip Zadania wideo
Zgłoszenia wideo są też ograniczone liczbą zadań, które Twoja organizacja może uruchomić jednocześnie, zależnie od poziomu konta.
Taki `429` zawiera komunikat `organization concurrency limit exceeded` i ustępuje, gdy zakończy się trwające zadanie, a nie po upływie określonego czasu. Zobacz
[Limity równoległości](/guides/concurrency-limits).
:::

## Powiązane materiały {#related-guidance}

- [Obsługa błędów](/guides/error-handling)
- [Strumieniowanie](/guides/streaming)
- [Dokumentacja błędów API](/api-reference/errors)
- [Klucze API](/getting-started/api-keys)
