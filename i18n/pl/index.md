---
i18nSource: c063864501452a7b
title: Dokumentacja SandBase
description: Twórz bezpośrednio z użyciem Models i APIs albo definiuj Agents wielokrotnego użytku, działające na zarządzanej infrastrukturze.
---

# Dokumentacja SandBase {#sandbase-docs}

Twórz bezpośrednio z użyciem Models i APIs albo definiuj Agents wielokrotnego użytku, działające na zarządzanej infrastrukturze.

SandBase oferuje dwa uzupełniające się sposoby tworzenia aplikacji AI. Zacznij od najmniejszej warstwy, która wystarcza do zadania; w miarę rozwoju aplikacji możesz je łączyć.

## Wybierz sposób budowania {#choose-how-to-build}

| | Models i APIs | Zarządzane Agents |
|---|---|---|
| **Czym jest** | Bezpośredni dostęp do modeli językowych, obrazu, wideo, audio i API zewnętrznych | Wersjonowane konfiguracje Agent wielokrotnego użytku wykonywane przez SandBase |
| **Najlepsze do** | Własnych pętli aplikacji i precyzyjnej kontroli żądań | Pracy wieloetapowej, asynchronicznej lub powtarzalnej |
| **Zarządzasz** | Promptami, orkiestracją, ponowieniami i stanem aplikacji | Definicją Agent, włączonymi możliwościami, danymi wejściowymi i sposobem dostarczania wyników |
| **Zacznij tutaj** | [Models i APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip Jeden klucz API SandBase
Ten sam klucz API może wywoływać Models, APIs i Agents. Przechowuj klucze na serwerze i nigdy nie ujawniaj ich w kodzie przeglądarki.
:::

## Podstawowe pojęcia {#core-concepts}

### Models i APIs {#models-and-apis}

Używaj Models do zadań językowych, obrazowych, wideo i audio. Używaj APIs, gdy aplikacja potrzebuje zewnętrznych danych lub działań. Katalog w serwisie SandBase pokazuje dostępne możliwości, ceny, schematy wejściowe i działające przykłady.

- [Przeglądaj Models](https://www.sandbase.ai/models)
- [Przeglądaj APIs](https://www.sandbase.ai/apis)
- [Wykonaj pierwsze wywołanie API](/getting-started/first-call)
- [Otwórz dokumentację API](/api-reference/)

### Agents {#agents}

Agent to wersjonowana konfiguracja wielokrotnego użytku, zawierająca model, instrukcje, Skills i połączenia MCP. Zdefiniuj go raz, a następnie uruchamiaj w sesjach.

- [Poznaj Agents](/agents/)
- [Zdefiniuj Agent](/agents/agent-api)
- [Dodaj Skills i narzędzia MCP](/agents/mcp-tools)

### Sesje {#sessions}
Sesja (Session) uruchamia jedną wersję Agent. Utwórz ją przez `POST /v1/agents/sessions`, wyślij dane wejściowe, strumieniuj zdarzenia, a potem odczytaj całą rozmowę.

- [Przewodnik po sesjach](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## Pierwsze kroki {#first-steps}

1. Utwórz organizację i [klucz API](/getting-started/api-keys).
2. Wybierz model, API lub Agent z [katalogu](https://www.sandbase.ai/models).
3. Wykonaj bezpośrednie żądanie albo zdefiniuj i przetestuj Agent.
4. Uruchamiaj przetestowany Agent w sesjach ze swojej aplikacji.
5. Przeglądaj sesje, błędy, opóźnienia i koszty w Console.

## Wskazówki operacyjne {#operational-guidance}

- [Strumieniowanie odpowiedzi](/guides/streaming)
- [Obsługa błędów i ponawianie](/guides/error-handling)
- [Limity żądań](/guides/rate-limiting)
- [Rozliczenia i cennik](/guides/billing)
- [Administracja przestrzenią roboczą](/admin/)

## Kolejne kroki {#next-steps}

- Tworzenie z lokalnymi Skills: [samouczki Skill](/guides/skills/)

- Dopiero zaczynasz z SandBase: [Pierwsze kroki](/getting-started/)
- Wywołujesz model lub API: [katalog Models](https://www.sandbase.ai/models) i [katalog APIs](https://www.sandbase.ai/apis)
- API inferencji i Agents: [Dokumentacja API](/api-reference/)
- Budujesz pracę wielokrotnego użytku: [Build Agent](/agents/)
- Łączysz narzędzie AI: [Setup](/setup/)
