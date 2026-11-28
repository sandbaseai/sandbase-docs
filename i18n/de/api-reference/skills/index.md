---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Versionierte Skill-Pakete hochladen und an Agents anhängen.
---

# Skills API {#skills-api}

Ein Skill ist ein versioniertes ZIP-Paket aus Anweisungen und Ressourcen, das ein Agent einbinden kann. Skill-IDs verwenden das Präfix `skl_`, und Versionsbezeichner sind Strings wie `"1"`.

## Skill-Operationen {#skill-operations}

| Methode | Pfad | Zweck |
|---|---|---|
| `POST` | `/v1/skills` | [Skill erstellen](./create) aus einem ZIP-Upload |
| `GET` | `/v1/skills` | [Skills auflisten](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Skill abrufen](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Aktualisieren](./update): Standardversion, Status oder Metadaten |
| `DELETE` | `/v1/skills/{skill_id}` | [Skill löschen](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | ZIP der Standardversion herunterladen |
| `GET` | `/v1/skills/{skill_id}/versions` | [Versionen auflisten](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Version hochladen](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Version abrufen](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | ZIP einer Version herunterladen |
| `GET` | `/v1/skills/catalog` | [Öffentliche Skills durchsuchen](./catalog) |

## Einrichtung in fünf Minuten {#five-minute-setup}

1. Lege einen Ordner mit einer `SKILL.md` an, deren Frontmatter `name` und `description` setzt:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Packe ihn als ZIP (`zip -r release-notes.zip release-notes/`). Das Archiv darf höchstens 5 MiB groß sein.
3. Lade es als einzelnen Multipart-Teil `files` hoch:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Referenziere es in einem Agent mit [Agent aktualisieren](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Beim ersten Anhängen eines Skills wird `"version": null` (oder ein fehlendes `version`) beim Speichern des Agents zur aktuellen `default_version` aufgelöst. Der gespeicherte Agent enthält eine explizite Version. Eine Änderung der Standardversion des Skills aktualisiert bestehende Agents nicht. Für ein Upgrade aktualisierst du das `skills`-Array mit einer expliziten Version wie `"2"`; `null` für eine bestehende Bindung behält die festgelegte Version bei. Jede Session nutzt die gespeicherte Agent-Version und meldet die aufgelösten Skills in `environment.skills`.

Ein Agent unterstützt bis zu 32 Skills. Skill-IDs und Skill-Namen müssen innerhalb seiner Auswahl eindeutig sein.

## Versionen {#versions}

- Ein Upload an `POST /v1/skills/{skill_id}/versions` fügt die nächste Version hinzu. Sende das Formularfeld `default=true`, um sie zur Standardversion zu machen.
- `POST /v1/skills/{skill_id}` mit `default_version` wechselt die Standardversion ohne Upload.
- `status` ist `active` oder `disabled`. Neue Sessions eines Agents, der einen deaktivierten Skill referenziert, schlagen mit `400 skill_not_found` fehl; Sessions, die bereits eine Version eingefroren haben, behalten sie.
- Ein Skill, den eine beliebige Agent-Version referenziert, kann nicht gelöscht werden (409). Deaktiviere ihn stattdessen. Wenn du ihn aus der neuesten Agent-Version entfernst, bleiben Referenzen in älteren Versionen bestehen.

## Paginierung und Fehler {#pagination-and-errors}

Listen verwenden Cursor-Paginierung mit `limit` 0-100, `after` und `order`. Fehler verwenden das [Agents-Fehler-Envelope](/api-reference/errors#agents-platform-errors).

## Paket herunterladen {#download-a-bundle}

Content-Endpoints geben `application/zip` zurück, kein JSON. Speichere die Antwort in einer Datei:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Verwende `/v1/skills/{skill_id}/content` für die aktuelle Standardversion. Für Pakete aus dem öffentlichen Katalog verwendest du `/v1/skills/catalog/{skill_id}/versions/{version}/content`.

Versionslisten verwenden dieselben Cursor-Parameter wie Skill-Listen. Übergib die zurückgegebene `last_id` (zum Beispiel `skl_…:2`) als `after`; übergib nicht die reine Versionsnummer.
