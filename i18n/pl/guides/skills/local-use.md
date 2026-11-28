---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Lokalne użycie Skill
description: Wybierz Skill z SandBase Lab, pobierz jego pakiet, skonfiguruj dostęp do modeli oraz utwórz i zapisz projekt z lokalnym agentem.
---

# Lokalne użycie Skill {#use-a-skill-locally}

Pobierz Skill SandBase i zrealizuj projekt z agentem na swoim komputerze. Skill zawiera instrukcje, skrypty i przykłady. Agent postępuje zgodnie z przepływem opisanym w pliku `SKILL.md`.


## 1. Wybierz Skill {#_1-choose-a-skill}

1. Otwórz [SandBase Lab](https://www.sandbase.ai/lab/).
2. Przeglądaj przykłady, takie jak filmy, animacje i mapy. Otwórz Skill pasujący do Twojego projektu.
3. Zapoznaj się z przykładem, wymaganymi danymi wejściowymi, formatem wyjściowym i obsługiwanymi językami.
4. Użyj akcji pobierania Skill, aby zapisać pakiet ZIP.

W przypadku filmu-mapy o historii miasta zacznij od przykładów i instrukcji dla [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Przygotuj lokalny folder roboczy {#_2-prepare-a-local-working-folder}

1. Utwórz folder projektu, np. `my-city-film`.
2. Rozpakuj do niego całe archiwum ZIP Skill, zachowując instrukcje, skrypty i zasoby.
3. Otwórz projekt w lokalnym agencie i przyznaj dostęp do jego plików oraz poleceń wymaganych przez przepływ.
4. Postępuj zgodnie z instrukcjami instalacji na stronie Skill lub poproś agenta o bezpośrednie przeczytanie rozpakowanego pliku `SKILL.md`.

Projekt może mieć taką strukturę:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Używaj konkretnych nazw plików i lokalizacji wyjściowych wymaganych przez Skill.

## 3. Połącz SandBase {#_3-connect-sandbase}

Wklej do agenta `set up https://www.sandbase.ai/SKILL.md` i zatwierdź logowanie w przeglądarce, które się otworzy, albo uruchom w terminalu `npx -y @sandbaseai/cli@latest connect`. Następnie rozpocznij nową sesję agenta, aby załadować narzędzia SandBase. Te same opcje są dostępne w Console w [Build → AI tools](https://www.sandbase.ai/console/setup).

Pełny przepływ połączenia opisuje [Łączenie narzędzi AI](/setup/).

Jeśli skrypty Skill wymagają `SANDBASE_API_KEY`:

1. Otwórz [API Keys](https://www.sandbase.ai/console/keys) i utwórz lub wybierz klucz dla projektu.
2. Skonfiguruj go w bezpiecznych ustawieniach lokalnego agenta lub w środowisku wykonywania skryptów.
3. Poproś agenta o sprawdzenie, czy dostęp jest skonfigurowany, i kontynuuj przepływ Skill.

Przechowuj klucz w bezpiecznej konfiguracji lokalnej. W materiałach wynikowych, plikach źródłowych i publicznych zrzutach ekranu umieszczaj tylko informacje o projekcie. Zużycie modeli i saldo sprawdzisz w [Billing](https://www.sandbase.ai/console/billing).

## 4. Przekaż brief {#_4-provide-a-brief}

Powiedz agentowi, którego Skill użyć, co utworzyć, jakie są wymagania wyjściowe i jaki masz budżet. Dostosuj ten przykład do swojego projektu:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

Agent czyta instrukcje, sprawdza zależności, przetwarza dane wejściowe i generuje lub renderuje projekt. Dodaj wszelkie wymagane zasoby do tego samego projektu i kontynuuj zadanie.

## 5. Śledź postęp i sprawdź wynik {#_5-follow-progress-and-review-the-result}

Czas trwania zależy od Skill, modeli, zasobów i długości wyniku. Projekty wideo mogą zająć od kilkudziesięciu minut do kilku godzin. Nie zatrzymuj agenta i nie usypiaj komputera.

Pytaj o postęp w tej samej rozmowie:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Otwórz dostarczone ścieżki plików, sprawdź obraz, dźwięk, napisy i treść, a następnie zapisz pliki końcowe.

## 6. Popraw projekt {#_6-revise-the-project}

Poproś o konkretne zmiany w ramach pierwotnego zadania i wykorzystaj istniejące zasoby:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Jeśli wykonanie zostanie przerwane, zachowaj folder roboczy i poproś agenta o kontynuowanie od bieżącego kroku.

## Kolejne kroki {#next-steps}

- [Weź udział w AI City Remix](/guides/skills/ai-city-remix)
- [Połącz swojego agenta](/setup/)
- [Skonfiguruj klucze API](/getting-started/api-keys)
