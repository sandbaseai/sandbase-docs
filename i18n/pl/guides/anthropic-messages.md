---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: Używaj w SandBase wiadomości, bloków treści, narzędzi, myślenia i strumieniowania zgodnych z Anthropic.
---

# Anthropic Messages {#anthropic-messages}

SandBase udostępnia endpoint zgodny z Anthropic pod adresem `POST /v1/messages`. Aplikacje korzystające z Anthropic SDK mogą się z nim połączyć po zmianie klucza API i bazowego adresu URL.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## Uwierzytelnianie i nagłówki wersji {#authentication-and-version-headers}

Użyj `x-api-key` lub `Authorization: Bearer …`. Jeśli podano oba, pierwszeństwo ma `x-api-key`. Opcjonalny nagłówek `anthropic-version` jest przekazywany dalej i w razie pominięcia przyjmuje domyślnie wartość `2023-06-01`. Opcjonalne wartości `anthropic-beta` również są przekazywane, o ile pozwala na to zgodność z dostawcą.

## Wiadomości i bloki treści {#messages-and-content-blocks}

Wiadomości używają ról `user` i `assistant`. Instrukcję systemową umieść w polu najwyższego poziomu `system`. Treść może być zwykłym tekstem lub tablicą typowanych bloków, takich jak `text`, `image`, `tool_use` i `tool_result`.

## Narzędzia i rozszerzone myślenie {#tools-and-extended-thinking}

Dodaj definicje narzędzi w `tools` i steruj ich wyborem za pomocą `tool_choice`. Jeśli wybrany model to obsługuje, skonfiguruj rozszerzone rozumowanie za pomocą `thinking`; przy kontynuowaniu rozmowy zachowuj zwrócone bloki myślenia.

## Strumieniowanie {#streaming}

Ustaw `stream: true`, aby otrzymywać zdarzenia SSE w stylu Anthropic, w tym `message_start`, zdarzenia bloków treści, `message_delta` i `message_stop`. SandBase przekazuje też zdarzenia keepalive i zdarzenia beta zdefiniowane przez dostawcę. Ze względu na zgodność z przyszłymi wersjami odbiorcy powinni ignorować nieznane typy zdarzeń i obsługiwać zdarzenia `error` na poziomie protokołu.

## Zgodność {#compatibility}

SandBase mapuje publiczną nazwę modelu na wybranego dostawcę. Pozostałe zgodne pola żądania i bajty odpowiedzi są zachowywane, chyba że dany dostawca ma jawną regułę zgodności, która usuwa nieobsługiwane pole lub odrzuca kandydata. Funkcje beta właściwe dla dostawcy mogą nie być dostępne dla każdego modelu. Pełny schemat żądania i odpowiedzi opisuje strona [Utwórz wiadomość Anthropic](/api-reference/anthropic-compat).
