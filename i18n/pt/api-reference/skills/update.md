---
i18nSource: 996f166544016111
title: Atualizar Skill
description: Altere a versão padrão, o status ou os metadados de uma Skill.
aside: false
outline: false
apiReference:
  title: Atualizar Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Altera default_version, status ou os metadados de market. row_version é obrigatório quando metadata é enviado; caso contrário, o valor atual é usado.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID da Skill (prefixo skl_).
    - title: Corpo da requisição
      description: Objeto JSON.
      fields:
        - name: default_version
          type: string
          required: false
          description: Padrão usado ao associar esta Skill pela primeira vez sem uma versão explícita. As associações existentes de Agents mantêm as versões fixadas.
        - name: status
          type: string
          required: false
          description: active ou disabled.
        - name: metadata
          type: object | null
          required: false
          description: Metadados de apresentação somente sob o namespace market (até 16 KiB). Exige row_version; substitui o objeto de metadados. Namespaces ou campos desconhecidos retornam 400. Veja o exemplo de metadados abaixo.
        - name: row_version
          type: integer
          required: false
          description: row_version atual obtido em Get Skill. Um valor desatualizado retorna 409 conflict; obrigatório quando metadata está presente.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "default_version": "2"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        skill = client.skills.update("skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", default_version="2")
        print(skill.default_version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            headers=headers,
            json={
                "default_version": "2"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "default_version": "2"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "default_version": "2",
        "latest_version": "2",
        "status": "active",
        "visibility": "private",
        "row_version": 3,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />

## Exemplo de metadados {#metadata-example}

Envie o `row_version` atual junto com o objeto de metadados completo:

```json
{
  "row_version": 3,
  "metadata": {
    "market": {
      "display_name": "Release notes",
      "categories": ["development"],
      "tags": ["releases"],
      "required_endpoints": ["github.issues"],
      "servers": ["github"]
    }
  }
}
```

Os metadados de market descrevem a Skill para exibição. Eles não instalam um servidor, não concedem credenciais nem alteram a seleção de MCP do Agent. `metadata: {}` ou `metadata: null` os limpa; ambos ainda exigem `row_version`.
