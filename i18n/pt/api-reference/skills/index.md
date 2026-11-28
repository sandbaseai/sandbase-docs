---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Envie pacotes de Skills versionados e vincule-os a Agents.
---

# Skills API {#skills-api}

Uma Skill é um pacote ZIP versionado de instruções e recursos que um Agent pode montar. Os IDs de Skill usam o prefixo `skl_`, e os identificadores de versão são strings como `"1"`.

## Operações de Skill {#skill-operations}

| Método | Caminho | Finalidade |
|---|---|---|
| `POST` | `/v1/skills` | [Criar uma Skill](./create) a partir de um upload ZIP |
| `GET` | `/v1/skills` | [Listar Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Obter uma Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Atualizar](./update) a versão padrão, o status ou os metadados |
| `DELETE` | `/v1/skills/{skill_id}` | [Excluir uma Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Baixar o ZIP da versão padrão |
| `GET` | `/v1/skills/{skill_id}/versions` | [Listar versões](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Enviar uma versão](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Obter uma versão](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Baixar o ZIP de uma versão |
| `GET` | `/v1/skills/catalog` | [Navegar pelas Skills públicas](./catalog) |

## Configuração em cinco minutos {#five-minute-setup}

1. Crie uma pasta com um `SKILL.md` cujo frontmatter defina `name` e `description`:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Compacte-a (`zip -r release-notes.zip release-notes/`). O arquivo pode ter no máximo 5 MiB.
3. Envie-o como a única parte multipart `files`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Referencie-a em um Agent com [Atualizar Agent](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Ao vincular uma Skill pela primeira vez, `"version": null` (ou `version` omitido) é resolvido para o `default_version` atual dela no momento em que o Agent é salvo. O Agent salvo contém uma versão explícita. Alterar o padrão da Skill não atualiza um Agent existente. Para atualizar, altere o array `skills` dele com uma versão explícita, como `"2"`; enviar `null` para um vínculo existente mantém a versão fixada. Cada Session usa a versão salva do Agent e informa as Skills resolvidas em `environment.skills`.

Um Agent oferece suporte a até 32 Skills. Os IDs e os nomes das Skills devem ser únicos dentro da seleção.

## Versões {#versions}

- Enviar para `POST /v1/skills/{skill_id}/versions` adiciona a próxima versão. Envie o campo de formulário `default=true` para torná-la a padrão.
- `POST /v1/skills/{skill_id}` com `default_version` troca a versão padrão sem fazer upload.
- `status` é `active` ou `disabled`. Novas Sessions de um Agent que referencia uma Skill desativada falham com `400 skill_not_found`; Sessions que já congelaram uma versão continuam com ela.
- Uma Skill referenciada por qualquer versão de Agent não pode ser excluída (409). Desative-a em vez disso. Removê-la da versão mais recente do Agent não remove as referências nas versões históricas.

## Paginação e erros {#pagination-and-errors}

As listas usam paginação por cursor com `limit` de 0 a 100, `after` e `order`. Os erros usam o [envelope de erro de Agents](/api-reference/errors#agents-platform-errors).

## Baixar um pacote {#download-a-bundle}

Os endpoints de conteúdo retornam `application/zip`, não JSON. Salve a resposta em um arquivo:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Use `/v1/skills/{skill_id}/content` para a versão padrão atual. Para pacotes do catálogo público, use `/v1/skills/catalog/{skill_id}/versions/{version}/content`.

As listas de versões usam os mesmos parâmetros de cursor das listas de Skills. Passe o `last_id` retornado (por exemplo, `skl_…:2`) como `after`; não passe apenas o número da versão.

