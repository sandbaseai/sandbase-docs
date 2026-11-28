---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Przesyłaj wersjonowane pakiety Skills i dołączaj je do Agentów.
---

# Skills API {#skills-api}

Skill to wersjonowany pakiet ZIP z instrukcjami i zasobami, który Agent może zamontować. Identyfikatory Skills mają prefiks `skl_`, a identyfikatory wersji to ciągi znaków, na przykład `"1"`.

## Operacje na Skills {#skill-operations}

| Metoda | Ścieżka | Przeznaczenie |
|---|---|---|
| `POST` | `/v1/skills` | [Utworzenie Skill](./create) z przesłanego pliku ZIP |
| `GET` | `/v1/skills` | [Lista Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Pobranie Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Aktualizacja](./update) wersji domyślnej, statusu lub metadanych |
| `DELETE` | `/v1/skills/{skill_id}` | [Usunięcie Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Pobranie pliku ZIP wersji domyślnej |
| `GET` | `/v1/skills/{skill_id}/versions` | [Lista wersji](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Przesłanie wersji](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Pobranie wersji](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Pobranie pliku ZIP wersji |
| `GET` | `/v1/skills/catalog` | [Przeglądanie publicznych Skills](./catalog) |

## Konfiguracja w pięć minut {#five-minute-setup}

1. Utwórz folder z plikiem `SKILL.md`, którego frontmatter ustawia `name` i `description`:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Spakuj go (`zip -r release-notes.zip release-notes/`). Archiwum może mieć najwyżej 5 MiB.
3. Prześlij je jako jedyną część multipart o nazwie `files`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Odwołaj się do niego w Agencie za pomocą [Aktualizacji Agenta](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Przy pierwszym dołączaniu Skill `"version": null` (lub pominięte `version`) wskazuje bieżące `default_version` w momencie zapisania Agenta. Zapisany Agent zawiera jawną wersję. Zmiana wersji domyślnej Skill nie aktualizuje istniejącego Agenta. Aby go zaktualizować, zmień tablicę `skills` z jawną wersją, na przykład `"2"`; przesłanie `null` dla istniejącego powiązania zachowuje przypiętą wersję. Każda Session używa zapisanej wersji Agenta i zgłasza ustalone Skills w `environment.skills`.

Agent obsługuje do 32 Skills. Identyfikatory i nazwy Skills muszą być unikalne w ramach wyboru.

## Wersje {#versions}

- Przesłanie do `POST /v1/skills/{skill_id}/versions` dodaje kolejną wersję. Wyślij pole formularza `default=true`, aby ustawić ją jako domyślną.
- `POST /v1/skills/{skill_id}` z `default_version` przełącza wersję domyślną bez przesyłania pliku.
- `status` ma wartość `active` lub `disabled`. Nowe Sessions Agenta, który odwołuje się do wyłączonego Skill, kończą się błędem `400 skill_not_found`; Sessions, które już zamroziły wersję, zachowują ją.
- Skill, do którego odwołuje się dowolna wersja Agenta, nie może zostać usunięty (409). Zamiast tego go wyłącz. Usunięcie go z najnowszej wersji Agenta nie usuwa odwołań w wersjach historycznych.

## Paginacja i błędy {#pagination-and-errors}

Listy używają paginacji kursorowej z `limit` 0-100, `after` i `order`. Błędy używają [koperty błędów Agents](/api-reference/errors#agents-platform-errors).

## Pobieranie pakietu {#download-a-bundle}

Endpointy treści zwracają `application/zip`, a nie JSON. Zapisz odpowiedź do pliku:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Dla bieżącej wersji domyślnej użyj `/v1/skills/{skill_id}/content`. Dla pakietów z publicznego katalogu użyj `/v1/skills/catalog/{skill_id}/versions/{version}/content`.

Listy wersji używają tych samych parametrów kursora co listy Skills. Przekaż zwrócone `last_id` (na przykład `skl_…:2`) jako `after`; nie przekazuj samego numeru wersji.
