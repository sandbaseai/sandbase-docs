---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: Weź udział w AI City Remix
description: Odbierz kredyty AI City Remix, wybierz miasto i Skill, utwórz wideo z lokalnym agentem i prześlij je do weryfikacji.
---

# Weź udział w AI City Remix {#enter-ai-city-remix}

Wybierz Skill i miasto na stronie wydarzenia, a następnie przekaż pełne instrukcje swojemu lokalnemu agentowi. Po utworzeniu filmu agent przesyła wideo, okładkę i szczegóły zgłoszenia, po czym wysyła je do weryfikacji.


## Wymagania wstępne {#prerequisites}

- Konto SandBase.
- Lokalny agent z możliwością wykonywania poleceń i dostępem do plików.
- Folder roboczy na wideo, okładkę i pliki projektu.

Przy pierwszej konfiguracji lokalnej postępuj zgodnie z przewodnikiem [Używanie Skill lokalnie](/guides/skills/local-use).

## 1. Otwórz wydarzenie i odbierz kredyty {#_1-open-the-event-and-claim-credits}

1. Otwórz [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) i przeczytaj aktualny [regulamin wydarzenia](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en).
2. Kliknij „Claim $5 free & create” i zaloguj się, gdy pojawi się taka prośba.
3. System odbiera kredyty wydarzenia i próbuje je automatycznie zrealizować. Sprawdź saldo i status realizacji; jeśli potrzebna jest ponowna próba, użyj akcji realizacji.
4. Po odebraniu kliknij „Create now”, aby otworzyć okno tworzenia.

Terminy odbioru, dostępność i warunki uczestnictwa podano na stronie wydarzenia. Wywołania modeli zużywają kredyty zgodnie z faktycznym użyciem; sprawdzisz je w [Billing](https://www.sandbase.ai/console/billing).

## 2. Skonfiguruj klucz API modelu {#_2-configure-a-model-api-key}

Jeśli Twoje konto nie ma klucza API, którego można użyć, pojawi się okno „Create an API key”.

1. Sprawdź wyświetlony limit wydatków i datę wygaśnięcia, a następnie kliknij „Create API key”.
2. Kliknij „Create with this key”. Nowy klucz zostanie dołączony do pełnych instrukcji przekazywanych agentowi.
3. Wyślij pełne instrukcje agentowi, któremu ufasz, i przechowuj je w prywatnym obszarze roboczym.

W przypadku istniejącego klucza skonfiguruj `SANDBASE_API_KEY` w bezpiecznych ustawieniach lub środowisku wykonawczym lokalnego agenta. Kluczami zarządzasz w [API Keys](https://www.sandbase.ai/console/keys).

## 3. Wybierz Skill i brief {#_3-choose-a-skill-and-brief}

Okno startuje z wybranym oficjalnym Skill, miastem, historią i kierunkiem kreatywnym.

- Rozwiń „Official Skill”, aby przeczytać podsumowanie i szczegóły oraz wybrać podejście wizualne.
- Rozwiń „Creative brief”, aby wyszukać miasto lub wybrać lokalizację na mapie.
- Losuj propozycje lub edytuj bezpośrednio historię i kierunek kreatywny.
- Potwierdź lokalizację na mapie, obsługiwany język i styl wyjścia.

W kwestiach historii, osób i wydarzeń korzystaj ze sprawdzalnych źródeł. Obsługę języków i długości filmu sprawdź w szczegółach wybranego Skill.

## 4. Skopiuj instrukcje i zacznij tworzyć {#_4-copy-the-instructions-and-create}

1. Kliknij „Copy all” w obszarze promptu.
2. Otwórz folder projektu w lokalnym agencie, rozpocznij zadanie i wklej pełne instrukcje.
3. Wyślij je, podaj wymagane dane, skonfiguruj zależności i rozpocznij tworzenie.

Instrukcje zawierają wybrany Skill, brief kreatywny, format metadanych zgłoszenia i autoryzację przesyłania. Przekaż je w całości, aby agent mógł utworzyć i zgłosić pracę.

„Preparing” oznacza, że trwa przygotowywanie dostępu do przesyłania. Użyj „Retry”, aby przygotować go ponownie, lub „Complete brief”, aby uzupełnić brakujące szczegóły.

## 5. Śledź postęp tworzenia {#_5-follow-creation-progress}

Tworzenie może trwać od kilkudziesięciu minut do kilku godzin, zależnie od Skill, modeli i długości wideo, i zużywa kredyty modeli. Nie zatrzymuj agenta i nie pozwól komputerowi przejść w stan uśpienia.

Dodaj do tego samego zadania instrukcje dotyczące budżetu i raportowania postępu:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Zgodnie z aktualnym regulaminem wydarzenia używaj MiniMax M3.1 Flash przez SandBase. Wymagania dotyczące długości, rozdzielczości, napisów i rozmiarów plików znajdziesz na stronie wydarzenia i stronie przesyłania.

## 6. Zgłoś pracę i sprawdź status weryfikacji {#_6-submit-and-check-review-status}

Agent, postępując zgodnie z pełnymi instrukcjami, używa oficjalnego klienta przesyłania, przesyła wideo, okładkę i metadane, a następnie wysyła je do weryfikacji.

Otwórz [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en), aby sprawdzić postęp:

| Status | Następny krok |
|---|---|
| Draft | Ukończ film, prześlij pliki i wyślij do weryfikacji. |
| Pending review | Śledź status weryfikacji. |
| Approved | Otwórz publiczną stronę zgłoszenia i udostępnij ją. |
| Changes requested | Popraw pracę zgodnie z uwagą z weryfikacji i zgłoś ponownie. |

Jeśli masz już gotowy film, wybierz „Upload existing video” na stronie wydarzenia, uzupełnij szczegóły, prześlij wideo i okładkę, a następnie wyślij do weryfikacji.

## 7. Wznów przesyłanie {#_7-resume-an-upload}

Jeśli autoryzacja wygaśnie lub przesyłanie zostanie przerwane, kontynuuj z oryginalnymi plikami:

1. Zachowaj wideo, okładkę, `entry.json` i folder roboczy.
2. Znajdź ten sam szkic w My entries i kliknij „Resume upload”.
3. Skopiuj nowe instrukcje wznowienia do oryginalnego zadania agenta.
4. Poproś agenta o przesłanie i zgłoszenie istniejących plików, a następnie sprawdź status w My entries.

## 8. Udostępnij zgłoszenie {#_8-share-your-entry}

Na stronie zatwierdzonego zgłoszenia kliknij „Share on X”, aby otworzyć wstępnie wypełniony edytor posta. Zawiera on link do zgłoszenia, `#AICityRemix`, `@SandbaseAI` i oficjalny post wydarzenia.

Aby opublikować post z wideo, najpierw kliknij „Download video”, dodaj plik w edytorze X, sprawdź tekst i opublikuj.

## Powiązana dokumentacja {#related-documentation}

- [Używanie Skill lokalnie](/guides/skills/local-use)
- [Podłączanie agenta](/setup/)
- [Konfiguracja kluczy API](/getting-started/api-keys)
