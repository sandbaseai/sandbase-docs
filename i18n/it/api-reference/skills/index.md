---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Carica bundle di Skill con versioni e collegali agli Agent.
---

# Skills API {#skills-api}

Una Skill è un bundle ZIP con versioni, composto da istruzioni e risorse che un Agent può montare. Gli ID delle Skill usano il prefisso `skl_` e gli identificatori di versione sono stringhe come `"1"`.

## Operazioni sulle Skill {#skill-operations}

| Metodo | Percorso | Scopo |
|---|---|---|
| `POST` | `/v1/skills` | [Crea una Skill](./create) da un upload ZIP |
| `GET` | `/v1/skills` | [Elenca le Skill](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Ottieni una Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Aggiorna](./update) versione predefinita, stato o metadati |
| `DELETE` | `/v1/skills/{skill_id}` | [Elimina una Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Scarica lo ZIP della versione predefinita |
| `GET` | `/v1/skills/{skill_id}/versions` | [Elenca le versioni](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Carica una versione](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Ottieni una versione](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Scarica lo ZIP di una versione |
| `GET` | `/v1/skills/catalog` | [Sfoglia le Skill pubbliche](./catalog) |

## Configurazione in cinque minuti {#five-minute-setup}

1. Crea una cartella con un `SKILL.md` il cui frontmatter imposti `name` e `description`:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Comprimila (`zip -r release-notes.zip release-notes/`). L'archivio può pesare al massimo 5 MiB.
3. Caricalo come unica parte multipart `files`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Fai riferimento alla Skill da un Agent con [Update Agent](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Quando colleghi una Skill per la prima volta, `"version": null` (o `version` omesso) si risolve nella sua `default_version` corrente al momento del salvataggio dell'Agent. L'Agent salvato contiene una versione esplicita. Cambiare la versione predefinita della Skill non aggiorna un Agent esistente. Per aggiornarlo, modifica il suo array `skills` con una versione esplicita come `"2"`; inviare `null` per un binding esistente mantiene la versione fissata. Ogni Session usa la versione salvata dell'Agent e riporta le Skill risolte in `environment.skills`.

Un Agent supporta fino a 32 Skill. ID e nomi delle Skill devono essere univoci all'interno della selezione.

## Versioni {#versions}

- Un upload su `POST /v1/skills/{skill_id}/versions` aggiunge la versione successiva. Invia il campo del form `default=true` per renderla predefinita.
- `POST /v1/skills/{skill_id}` con `default_version` cambia la versione predefinita senza upload.
- `status` è `active` o `disabled`. Le nuove Session di un Agent che fa riferimento a una Skill disattivata falliscono con `400 skill_not_found`; le Session che hanno già congelato una versione la mantengono.
- Una Skill referenziata da una qualsiasi versione di un Agent non può essere eliminata (409). Disattivala invece. Rimuoverla dall'ultima versione dell'Agent non rimuove i riferimenti nelle versioni precedenti.

## Paginazione ed errori {#pagination-and-errors}

Gli elenchi usano la paginazione a cursore con `limit` 0-100, `after` e `order`. Gli errori usano l'[envelope di errore degli Agents](/api-reference/errors#agents-platform-errors).

## Scaricare un bundle {#download-a-bundle}

Gli endpoint di contenuto restituiscono `application/zip`, non JSON. Salva la risposta in un file:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Usa `/v1/skills/{skill_id}/content` per la versione predefinita corrente. Per i bundle del catalogo pubblico, usa `/v1/skills/catalog/{skill_id}/versions/{version}/content`.

Gli elenchi delle versioni usano gli stessi parametri di cursore degli elenchi delle Skill. Passa il `last_id` restituito (ad esempio `skl_…:2`) come `after`; non passare il solo numero di versione.
