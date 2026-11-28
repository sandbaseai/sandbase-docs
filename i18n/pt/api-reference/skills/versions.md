---
i18nSource: 096e3c57e599c5ca
title: Enviar versão de Skill
description: Envie uma nova versão de Skill.
aside: false
outline: false
apiReference:
  title: Enviar versão de Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Envia um novo pacote ZIP como a próxima versão (200 OK). A estrutura do ZIP é a mesma de Create Skill (uma pasta de nível superior contendo o SKILL.md). Envie default=true para torná-la a versão padrão. Liste as versões com GET /v1/skills/{skill_id}/versions, leia uma com GET /v1/skills/{skill_id}/versions/{version} e baixe uma com GET /v1/skills/{skill_id}/versions/{version}/content. Os identificadores de versão são strings.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID da Skill (prefixo skl_).
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional, de 1 a 128 bytes, sem espaços no início ou no fim. Quando omitido, o serviço gera um, então uma requisição repetida pode criar uma duplicata. Envie sua própria chave estável para novas tentativas.
    - title: Corpo da requisição
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: Arquivo ZIP, com até 5 MiB.
        - name: default
          type: string
          required: false
          description: true torna esta versão o padrão para associações futuras; false ou omitido mantém o padrão atual. As associações existentes de Agents não são alteradas.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: release-notes-v2" \
          -F "files=@release-notes-v2.zip;type=application/zip" \
          -F "default=true"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with open("release-notes-v2.zip", "rb") as bundle:
            version = client.skills.versions.create(
                "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
                files=[("release-notes-v2.zip", bundle.read(), "application/zip")],
                default=True,
            )
        print(version.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "release-notes-v2",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions",
            headers=headers,
            files={"files": open("release-notes-v2.zip", "rb")},
            data={"default": "true"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('files', new Blob([await readFile('release-notes-v2.zip')], { type: 'application/zip' }), 'release-notes-v2.zip');
        form.append('default', 'true');

        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'release-notes-v2',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "skill.version",
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57:2",
        "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "version": "2",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "created_at": 1791360000
      }
---

<ApiReferencePage />

## Listar e baixar versões {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` aceita `limit` (0 a 100, padrão 20), `order` (`asc` ou `desc`, padrão `desc`) e `after`. A resposta contém `object: "list"`, `data`, `has_more`, `first_id` e `last_id`. Passe `last_id` sem alterações como o próximo `after`; ele é um ID de versão com prefixo da Skill, não o número da versão isolado.

`GET /v1/skills/{skill_id}/versions/{version}` retorna um objeto de versão. O endpoint `/content` correspondente retorna os bytes do ZIP; veja o [exemplo de download](./#download-a-bundle).
