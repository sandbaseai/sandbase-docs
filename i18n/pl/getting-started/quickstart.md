---
i18nSource: 8cb9626a2127cb8d
title: Szybki start
description: Wybierz, jak chcesz korzystać z SandBase — na platformie, przez API lub z własnym Agentem. Znajdź Skills i Tools, wykonaj kolejne kroki i zacznij od repozytoriów SDK lub CLI.
pageClass: quickstart-page
---

# Szybki start {#quick-start}

## Wybierz, jak chcesz korzystać z SandBase {#connect}

To **trzy alternatywne sposoby rozpoczęcia**, a nie trzy kroki, które trzeba wykonać. We wszystkich używasz tego samego konta i obszaru roboczego SandBase.

<QuickstartPaths />

Potrzebujesz tylko gotowego zadania? [Przeglądaj Tools](#use-tools) lub [wybierz Skill](#use-skills). Publiczne katalogi i dokumentację możesz przeglądać przed zalogowaniem.

### Zacznij od repozytoriów open source {#start-from-the-open-source-repositories}

- **[SandBase — SDK i przykłady](https://github.com/sandbaseai/sandbase)**: klienty Python, TypeScript i Go, przykłady API oraz przepływy pracy hostowanych Agents. Użyj ich, gdy budujesz własną aplikację.
- **[SandBase CLI i MCP](https://github.com/sandbaseai/cli)**: zainstaluj i połącz swoje narzędzie AI albo wyszukuj i uruchamiaj możliwości z terminala. Użyj tego z istniejącym Agentem.

## Zanim zaczniesz: zaloguj się {#create-account}

Zaloguj się przed użyciem Playground, uruchomieniem hostowanego Skilla lub utworzeniem klucza API. Z bezpłatnych narzędzi działających bez konta możesz korzystać od razu. **Jesteś już zalogowany? Pomiń ten krok** i sprawdź, czy menu konta pokazuje obszar roboczy, którego chcesz użyć.

SandBase korzysta z logowania przez GitHub lub Google. Nie ma osobnej rejestracji za pomocą adresu e-mail i hasła.

1. Otwórz [Utwórz konto / Zaloguj się](https://www.sandbase.ai/login){target="_blank"}.
2. Przejdź weryfikację bezpieczeństwa, a następnie wybierz **Sign in with GitHub** lub **Sign in with Google**.
3. Zatwierdź dostęp w oknie dostawcy.
4. Wróć na stronę, z której korzystałeś, lub otwórz [Console](https://www.sandbase.ai/console){target="_blank"}.

Pierwsze logowanie tworzy Twoje konto i **osobisty obszar roboczy**. Aby wypróbować SandBase, nie musisz tworzyć organizacji.

Jeśli pojawi się kredyt powitalny, możesz zacząć bez dodawania metody płatności. Karta **Balance** na pulpicie Console oraz [Billing](https://www.sandbase.ai/console/billing){target="_blank"} pokazują bieżące saldo.

## Na platformie {#use-on-website}

Wybierz tę opcję, jeśli chcesz najpierw wypróbować Model, API lub Agenta w przeglądarce — bez instalowania klienta i bez kodu.

1. Zaloguj się, a następnie otwórz katalog:
   - [Modele językowe](https://www.sandbase.ai/models){target="_blank"}
   - [Modele obrazów i wideo](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Otwórz stronę szczegółów modelu lub API i wybierz **Playground**, jeśli jest dostępny.
3. Wprowadź wymagane dane, np. prompt, obraz, zapytanie wyszukiwania lub URL. Przed uruchomieniem sprawdź wyświetloną cenę.
4. Uruchom żądanie i zobacz zwrócony tekst, dane, obraz, wideo lub status zadania.

Do korzystania z Playground na stronie nie musisz tworzyć osobnego klucza API. Jeśli dana możliwość nie oferuje Playground, użyj jej karty **API** i postępuj zgodnie z opisaną poniżej ścieżką API.

## Przez API {#call-api}

Wybierz tę opcję, jeśli dodajesz jedną możliwość do swojej aplikacji.

1. Użyj ponownie ważnego klucza dla wybranego obszaru roboczego lub utwórz [klucz API](/getting-started/api-keys) w [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} za pomocą **New key**. Skopiuj go od razu; jest wyświetlany tylko raz.
2. Przefiltruj katalog i otwórz stronę szczegółów:
   - [Modele językowe](https://www.sandbase.ai/models){target="_blank"} — filtruj według dostawcy, możliwości, kontekstu i ceny
   - [Modele obrazów i wideo](https://www.sandbase.ai/models/image-video){target="_blank"} — filtruj modele multimodalne, np. text-to-image, image-to-image, text-to-video i image-to-video
   - [APIs](https://www.sandbase.ai/apis){target="_blank"} — filtruj zasoby API według platformy i źródła danych
3. Otwórz kartę **API**, skopiuj przykładowe żądanie i uzupełnij wymagane pola tego endpointu.
4. Zapisz klucz SandBase w zmiennej środowiskowej na serwerze i uruchom żądanie. Nie umieszczaj go w kodzie przeglądarki ani w publicznym repozytorium.
5. Sprawdź odpowiedź. W przypadku zadania asynchronicznego postępuj zgodnie z przykładem odpytywania statusu dla danego endpointu, aż zadanie się zakończy.

Przykładowe wywołanie modelu językowego dla **Bash / zsh** (macOS, Linux lub Windows z WSL). Zastąp przykładowy klucz lokalnie. W innych środowiskach użyj przykładów w Python, TypeScript lub Go z poniższego repozytorium; polecenia powłoki nie są wymienne z PowerShell.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Zacznij od kodu: [SDK i przykłady SandBase na GitHub](https://github.com/sandbaseai/sandbase).

Więcej informacji: [Pierwsze wywołanie API](/getting-started/first-call).

## Z Twoim Agentem {#use-in-ai-tool}

Wybierz tę opcję, jeśli korzystasz z Claude Code, Codex, Cursor, Kiro lub innego obsługiwanego klienta i chcesz mieć w tej aplikacji Models i APIs SandBase.

**Automatyczna konfiguracja lokalna:** klient musi umieć uruchamiać polecenia, a na jego komputerze musi być Node.js 20+ z npm. Jeśli używasz klienta obsługującego tylko czat, postępuj zamiast tego zgodnie z [instrukcjami połączenia dla danego klienta](/setup/).

1. Otwórz [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} w Console.
2. Wklej ten wiersz do czatu asystenta AI, a następnie powiedz mu, co chcesz zbudować. To instrukcja dla czatu, a nie polecenie powłoki:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Zatwierdź logowanie w przeglądarce, które otworzy agent. Nie trzeba wklejać klucza API.
4. Rozpocznij nową sesję lub uruchom aplikację ponownie, aby załadowały się narzędzia SandBase.
5. Poproś agenta o znalezienie i sprawdzenie odpowiedniego narzędzia, a następnie o wykonanie jednego ograniczonego żądania w ramach Twoich uprawnień i budżetu. W pracy programistycznej poproś o zintegrowanie odpowiedzi z projektem oraz podanie polecenia uruchomienia i rzeczywistych wyników testów. Samo wyszukanie narzędzia nie potwierdza działania wywołania API biznesowego.

Wolisz terminal? Uruchom `npx -y @sandbaseai/cli@latest connect`. Polecenie konfiguruje wykryte obsługiwane klienty; aby skonfigurować tylko jeden, użyj `npx -y @sandbaseai/cli@latest connect --client codex` (zastąp `codex` swoim obsługiwanym klientem). Następnie uruchom tego klienta ponownie. Przed płatnym uruchomieniem sprawdź wybrany obszar roboczy.

Możesz na przykład poprosić:

> Znajdź w SandBase API do wyszukiwania publicznych postów na X o agentach AI. Najpierw sprawdź wymagane dane wejściowe i cenę, a przed uruchomieniem podaj mi koszt jednego żądania. Zachowaj w wyniku oryginalne linki do źródeł.

Kod źródłowy i instrukcje instalacji: [SandBase CLI i MCP na GitHub](https://github.com/sandbaseai/cli).

Więcej informacji: [Łączenie narzędzi AI](/setup/).

### Pozwól asystentowi AI pomóc Ci w budowaniu {#start-with-your-agent}

[Skill konfiguracyjny](https://www.sandbase.ai/SKILL.md) prowadzi agenta przez Twoją bieżącą sytuację: brak konta, istniejący klucz API, już połączone narzędzie, istniejący projekt lub nowa funkcja. Sprawdza dane wejściowe i cenę endpointu, pomaga zaimplementować integrację i odróżnia samą konfigurację od zweryfikowanego wywołania i działającej funkcji. Podaj mu swój cel i ewentualny limit wydatków; nie wklejaj klucza do czatu.

Masz już klucz lub projekt? Powiedz o tym; nie musisz zaczynać od nowa. Na przykład: „Mam klucz SandBase. Dodaj do tego projektu sprawdzanie ruchu Similarweb; sprawdź API i najpierw pokaż koszt testu na żywo”. Asystent, który nie może wykonywać poleceń ani ładować narzędzi, potrzebuje [ścieżki konfiguracji dla danego klienta](/setup/).

[Przekaż agentowi Szybki start w formacie Markdown](https://www.sandbase.ai/quickstart.md) lub skorzystaj z poniższych kroków. Zainstalowanie Skilla konfiguracyjnego samo w sobie nie tworzy hostowanego Agenta.

### Opcjonalnie: uruchom hostowanego Agenta w SandBase {#build-agent}

Wybierz tę opcję, jeśli praca ma wiele kroków lub ma być używana wielokrotnie.

1. Otwórz [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} i wybierz **Create**.
2. Wypełnij **Overview** i **Instructions**.
3. Wybierz **Model**.
4. Dodaj Skills i narzędzia MCP w sekcji **Capabilities**, a następnie ustaw **Runtime**.
5. Wybierz **Create & Chat**, aby przetestować Agenta w Session.
6. Wywołuj przetestowaną wersję ze swojej aplikacji zgodnie z kartą **API** Agenta.

Więcej informacji: [Build Agent](/agents/). Aby zrobić to samo z kodu za pomocą oficjalnego OpenAI SDK, zobacz [Zgodność z OpenAI](/agents/openai-compatibility).

## Skills, Tools i inne sposoby budowania {#skills-and-tools}

Wybierz zasób pasujący do zadania. Aby korzystać z API, nie musisz instalować Skilla ani tworzyć hostowanego Agenta.

- **[Tools](https://www.sandbase.ai/tools):** wykonaj konkretne zadanie w gotowym interfejsie, np. sformatuj tekst lub wyszukaj dane publiczne.
- **[Skills](https://www.sandbase.ai/skills):** daj agentowi przepływ pracy wielokrotnego użytku z instrukcjami, skryptami i przykładami.
- **Models i APIs:** wywołuj możliwość z Playground, swojego kodu lub połączonego agenta. Przeglądaj [modele językowe](https://www.sandbase.ai/models), [obrazy i wideo](https://www.sandbase.ai/models/image-video) lub [API danych](https://www.sandbase.ai/apis).
- **[Hostowane Agents](/agents/):** skonfiguruj i uruchom agenta wielokrotnego użytku w SandBase.
- **[Sandboxy](/sandbox/):** zapewnij kodowi izolowane środowisko do wykonywania i pracy z plikami.

### Korzystanie z Tool {#use-tools}

1. Otwórz [Tools](https://www.sandbase.ai/tools) i wybierz zadanie, które chcesz wykonać.
2. Zapoznaj się z wymaganiami narzędzia dotyczącymi danych wejściowych oraz z etykietą ceny lub limitu. Bezpłatne narzędzia pomocnicze mogą działać bez konta; narzędzia danych wymagają zalogowania się do SandBase, a testy modeli mogą wymagać własnego klucza.
3. Wprowadź wymagany tekst, URL, plik lub inne dane, a następnie użyj akcji uruchomienia narzędzia.
4. Sprawdź wynik i, jeśli to możliwe, użyj akcji kopiowania lub pobierania. W przypadku narzędzia danych skorzystaj z powiązanego API i przykładowego żądania, jeśli chcesz zautomatyzować to samo zadanie.

**Bezpłatny dzienny limit jest współdzielony przez obszar roboczy**, a nie przydzielany osobno każdemu narzędziu. Przed uruchomieniem sprawdź uprawnienia i wyświetloną cenę; bezpłatne narzędzie pomocnicze nie sprawia, że wywołanie modelu lub API jest bezpłatne.

### Korzystanie ze Skilla {#use-skills}

1. Otwórz [Skills](https://www.sandbase.ai/skills), wybierz przepływ pracy i zapoznaj się z jego przykładami, wymaganymi danymi wejściowymi i zależnościami.
2. Wybierz jedną z opcji dostępnych na stronie szczegółów Skilla:
   - **Run online:** zaloguj się i uruchom hostowany przykład, jeśli jest dostępny. Śledź postęp i otwórz wynik lub pliki. Sprawdź wyświetlony przydział; dostępność i limity zależą od Skilla.
   - **Install / Download:** zaloguj się, aby pobrać pakiet, jeśli jest dostępny. Rozpakuj cały pakiet do folderu roboczego, a następnie postępuj zgodnie z instrukcjami instalacji lub poproś lokalnego agenta o odczytanie pliku `SKILL.md`.
3. Przy użyciu lokalnym podaj zadanie, dane wejściowe, oczekiwany wynik i limit wydatków. Połącz SandBase, korzystając ze [ścieżki Agenta](#use-in-ai-tool); jeśli skrypty Skilla wymagają klucza, skonfiguruj go w środowisku wykonawczym zamiast wklejać go do czatu.
4. Sprawdź rzeczywisty wynik. Pobranie Skilla lub połączenie agenta nie oznacza, że przepływ pracy został pomyślnie wykonany.

**Skill konfiguracyjny** SandBase łączy Twojego klienta; Skills z katalogu opisują poszczególne przepływy pracy. Przed instalacją sprawdź zależności każdego Skilla i obsługiwanego klienta. Wywołania modeli i API używane przez lokalny przepływ pracy mogą generować opłaty za użycie.

Pełny przewodnik, w tym foldery wejściowe i zapisane wyniki, znajdziesz w sekcji [Lokalne użycie Skilla](/guides/skills/local-use).

## Opcjonalnie: udostępnij zespołowy obszar roboczy {#create-organization}

Klucze API, użycie i rozliczenia należą do organizacji. Jeśli testujesz SandBase samodzielnie, pozostań w osobistym obszarze roboczym. Utwórz zespół, gdy kilka osób będzie współdzielić klucze i wydatki.

| Obszar roboczy | Kiedy go używać |
|---|---|
| **Osobisty** | Tworzony automatycznie przy pierwszym logowaniu. Jeden na użytkownika. |
| **Zespołowy** | Wspólni członkowie, klucze i saldo. Utwórz go dla firmy lub projektu. |

### Tworzenie zespołu {#create-team}

1. Otwórz [Utwórz zespół](https://www.sandbase.ai/console/members?create=1){target="_blank"} lub wybierz **Create Team** w menu konta w prawym górnym rogu Console.
2. Wpisz **Team name**, a następnie wybierz **Create team**.
3. Sprawdź, czy menu konta pokazuje teraz ten zespół jako aktywny obszar roboczy.
4. Na stronie **Developer → Team** wybierz **Add member**, wpisz **Account email** istniejącego konta SandBase i wybierz **Workspace role** (Member lub Admin).

Zaproszona osoba musi już mieć konto SandBase. Jeśli go nie ma, wyślij jej [tę stronę](/getting-started/quickstart), aby najpierw się zalogowała, a potem ją dodaj.

Jeśli należysz do więcej niż jednej organizacji, przełączaj się w menu konta. Klucze i rozliczenia dotyczą **aktywnej** organizacji. Role opisuje strona [Organizacje](/admin/organizations).

## Sprawdź, czy wszystko działa {#confirm-it-works}

Wszystko jest gotowe, gdy spełnione są wszystkie poniższe warunki:

- Menu konta w Console pokazuje organizację, której chcesz używać.
- Ukończyłeś jedną ścieżkę: wywołanie API, uruchomienie na stronie, połączone narzędzie AI lub Agenta.
- Jedno żądanie kończy się powodzeniem.

Jeśli żądanie się nie powiedzie, sprawdź aktywną organizację, klucz i stronę [Błędy](/guides/error-handling). Gdy w obszarze roboczym nie ma już salda, doładuj je w [Billing](https://www.sandbase.ai/console/billing){target="_blank"}.

### Jeśli coś nie działa {#if-you-get-stuck}

| Co widzisz | Co sprawdzić |
| --- | --- |
| Wymagane logowanie | Zaloguj się, wróć na pierwotną stronę i sprawdź aktywny obszar roboczy. |
| Nieprawidłowy klucz lub odmowa dostępu | Upewnij się, że klucz należy do właściwego obszaru roboczego i ma dostęp do endpointu. Dodanie kredytów nie naprawia uprawnień. |
| Niewystarczające saldo lub wyczerpany limit | Przeczytaj odpowiedź: przy problemie z saldem sprawdź Billing, a przy limicie wyświetlony czas odnowienia. |
| Brak narzędzi w Agencie | Rozpocznij nową sesję klienta, a następnie wykonaj kroki diagnostyczne z sekcji [Łączenie narzędzi AI](/setup/). |
| Zadanie nadal trwa | Śledź zwrócony status zadania lub wskaźnik postępu na stronie. Nie wysyłaj wielokrotnie tego samego płatnego żądania. |

## Rozliczenia i użycie {#billing-and-usage}

Po zalogowaniu sprawdź wydatki aktywnej organizacji:

<QuickstartResources group="ops" />

## Co dalej {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — wykonaj zadanie w przeglądarce
- [Skills](https://www.sandbase.ai/skills) — znajdź przepływ pracy agenta wielokrotnego użytku
- [Klucze API](/getting-started/api-keys) — twórz i rotuj klucze organizacji
- [Katalog Models i APIs](https://www.sandbase.ai/models) — wypróbuj Models, APIs i Agents na stronie
- [Łączenie narzędzi AI](/setup/) — udostępnij swojemu narzędziu AI katalog SandBase
- [Build Agent](/agents/) — twórz Agents wielokrotnego użytku
- [API Reference](/api-reference/) — integruj za pomocą kodu
