---
i18nSource: fc051d55a0cfa8bd
title: Limity współbieżności
description: Ile zadań Twoja organizacja może uruchomić jednocześnie, jak limit rośnie wraz z poziomem konta i jak obsługiwać błędy 429 i 402 przy zgłoszeniach wideo.
---

# Limity współbieżności {#concurrency-limits}

Limity współbieżności określają, ile zadań Twoja organizacja może mieć jednocześnie w toku. Każda organizacja ma poziom konta, a poziom wyznacza jej limit współbieżności. Po osiągnięciu limitu nowe zgłoszenia w sprawdzanych endpointach wymienionych poniżej są odrzucane z kodem `429`, dopóki jedno z działających zadań się nie zakończy. Nie trafiają do kolejki.

Limit dotyczy całej organizacji i wszystkich jej kluczy API. To, które zgłoszenia są sprawdzane, zależy od endpointu:

- `POST /v1/run` oraz wywołania Platform API przez `/v1/api/{vendor}/...` są sprawdzane dla każdego typu modelu, w tym operacji graficznych, audio, LLM i API danych.
- Inne endpointy, takie jak Chat Completions, Responses, Messages, OpenAI Images oraz endpointy zgodne z protokołami Gemini i Volcengine, sprawdzają tylko zgłoszenia wideo.

## Jak to działa {#how-it-works}

Gdy zgłaszasz sprawdzane zadanie, SandBase liczy zadania, które Twoja organizacja ma obecnie w toku, czyli zadania w stanie `pending` lub `running`. Jeśli ta liczba już osiągnęła limit, zgłoszenie jest natychmiast odrzucane z kodem `429`. Zadanie nie jest tworzone i nic nie jest pobierane.

Liczba obejmuje każde żądanie w toku w organizacji, nie tylko wideo. Strumieniowane uzupełnienie czatu, które jest wciąż otwarte w chwili zgłoszenia sprawdzanego zadania, zajmuje jedno miejsce. Jeśli ta sama organizacja prowadzi długie strumieniowane czaty i zadania wideo, uwzględnij je wszystkie przy planowaniu przepustowości.

Miejsce zwalnia się, gdy tylko zadanie osiągnie stan końcowy (`completed`, `failed` lub `timeout`). Po Twojej stronie nie trzeba niczego zwalniać. Ponieważ miejsca zwalniają się po zakończeniu zadań, a nie według zegara, ten błąd `429` różni się od minutowego [limitu żądań](/guides/rate-limiting). Odczekanie stałego czasu nie gwarantuje wolnego miejsca. Zamiast tego poczekaj, aż zakończy się jedno z Twoich zadań.

## Domyślne limity {#default-limits}

Każda nowa organizacja zaczyna od poziomu **Bronze** z limitem 2 równoczesnych zadań. Poziom rośnie automatycznie w zależności od kwoty pojedynczego udanego doładowania.

| Poziom | Pojedyncze doładowanie | Równoczesne zadania |
|-------|---------------|------------------|
| Bronze | Domyślny | 2 |
| Silver | $10 lub więcej | 10 |
| Gold | $100 lub więcej | 100 |
| Platinum | $500 lub więcej | 500 |
| Diamond | Kontakt z działem sprzedaży | Bez limitu |

- **Liczy się pojedyncze doładowanie, a nie suma.** Dwa doładowania po $60 pozostawiają Cię na poziomie Silver. Jedno doładowanie $100 przenosi Cię na poziom Gold.
- **Tylko podwyższanie.** Późniejsze, mniejsze doładowanie nigdy nie obniża poziomu.
- **Tylko płatne doładowania.** Kredyty promocyjne, kredyty za rejestrację i kupony nie zmieniają poziomu.
- **Działa od razu.** Nowy limit obowiązuje od następnego zgłoszenia wideo po udanej płatności.

## Zwiększanie limitu {#increasing-your-limit}

Najprostszy sposób na podniesienie limitu to pojedyncze doładowanie, które osiąga kolejny próg z powyższej tabeli.

Jeśli potrzebujesz więcej niż 500 równoczesnych zadań lub miesięcznej linii kredytowej, napisz na [contact@sandbase.ai](mailto:contact@sandbase.ai) w sprawie poziomu **Diamond**. Diamond nie ma limitu współbieżności. Konfiguruje go zespół SandBase i doładowania nigdy go nie zmieniają.

## Sprawdzanie kredytu przy zgłoszeniach wideo {#credit-check-on-video-submissions}

Oprócz sprawdzania współbieżności SandBase szacuje koszt każdego zadania wideo przed jego przyjęciem. Jeśli szacunek przekracza dostępny kredyt (saldo plus ewentualna linia kredytowa), zgłoszenie jest odrzucane z kodem `402`. Zadanie nie jest tworzone i nic nie jest pobierane.

- Każde zgłoszenie jest porównywane z bieżącym saldem. Zadania, które wciąż działają, nie zostały jeszcze rozliczone, więc przy zgłaszaniu kilku filmów naraz zostaw zapas.
- Jeśli cena modelu zależy od wyniku, który istnieje dopiero po uruchomieniu, kosztu nie da się oszacować z góry. Zgłoszenie jest przyjmowane i rozliczane normalnie po zakończeniu zadania.

## Obsługa błędów współbieżności {#handling-concurrency-errors}

### 429: osiągnięto limit współbieżności {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

Nagłówek `Retry-After` nie jest wysyłany. Limit jest znany z góry, więc najpewniejszym podejściem jest nigdy go nie przekraczać. Ogranicz po stronie klienta liczbę zadań wideo w toku i zgłaszaj kolejne dopiero po zakończeniu poprzedniego:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

Jeśli mimo to otrzymasz `429`, na przykład dlatego, że zadania zgłasza też inna usługa w tej samej organizacji, odczekaj i ponów próbę. Stosuj wykładnicze wycofywanie z losowym opóźnieniem i zrezygnuj po ograniczonej liczbie prób zamiast ponawiać w ciasnej pętli.

### 402: za mało kredytu na to wideo {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Nie ponawiaj. Doładuj konto albo wybierz krótszy czas trwania lub niższą rozdzielczość, które kosztują mniej.

### Zgodne API {#compatible-apis}

Endpointy zgodne z protokołami zwracają te błędy we własnym, natywnym formacie. Na przykład endpoint zgodny z Volcengine `/api/v3/contents/generations/tasks` zwraca `RateLimitExceeded` dla `429` i `AccountOverdueError` dla `402`.

## Powiązane {#related}

- [Limity żądań](/guides/rate-limiting): minutowe limity żądań
- [Cennik](/guides/billing): kredyty i doładowania
- [Błędy](/api-reference/errors): wszystkie kody błędów
