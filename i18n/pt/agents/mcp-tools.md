---
i18nSource: 417ea5dc930a8786
title: Skills e ferramentas MCP
description: Dê a um Agent da SandBase Skills reutilizáveis e ferramentas MCP remotas, e controle quais versões e ferramentas cada Session usa.
---

# Skills e ferramentas MCP {#skills-and-mcp-tools}

Um Agent obtém recursos de duas formas:

- **Skills** ensinam o Agent a fazer um trabalho. Uma Skill é um pacote ZIP versionado de instruções e recursos.
- **Conexões MCP** permitem que o Agent chame ferramentas em um servidor MCP remoto via HTTPS, opcionalmente autenticado com um [Secret](/agents/api-credentials).

Os Agents mais úteis combinam os dois: um servidor MCP busca dados ou executa ações, e uma Skill descreve como usar os resultados.

## Skills {#skills}

1. Empacote uma pasta que contenha `SKILL.md` com frontmatter `name` e `description` e compacte a própria pasta (`zip -r release-notes.zip release-notes/`, no máximo 5 MiB). O ZIP deve ter essa pasta no nível superior; um `SKILL.md` na raiz do ZIP retorna `400 invalid_request`.
2. Faça o upload com `POST /v1/skills` no campo multipart `files`. A resposta contém um ID `skl_` e `default_version: "1"`.
3. Referencie-a no array `skills` do Agent.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- No primeiro vínculo, `"version": null` resolve a `default_version` atual da Skill quando o Agent é salvo. Uma string como `"2"` seleciona essa versão explicitamente.
- O Agent salvo fixa a versão. Alterar o padrão da Skill não atualiza Agents existentes nem suas novas Sessions. Atualize o Agent com uma versão explícita para fazer o upgrade; enviar `null` para um vínculo existente mantém a versão fixada.
- Faça o upload de uma nova versão com `POST /v1/skills/{skill_id}/versions` e troque o padrão com `default=true` ou `POST /v1/skills/{skill_id}`.
- Uma Skill desativada faz com que novas Sessions de Agents que a referenciam falhem com `400 skill_not_found`.

Você também pode navegar por Skills públicas no [catálogo de Skills](/api-reference/skills/catalog). Veja a [API de Skills](/api-reference/skills/) para o passo a passo completo.

## Ferramentas SandBase integradas {#built-in-sandbase-tools}

Todo novo Agent pode usar as ferramentas próprias da SandBase, sem configuração. Com `sandbase_discover`, `sandbase_inspect` e `sandbase_run`, o Agent encontra um modelo ou API no catálogo, lê seu schema e preço e o chama com sua chave. Quando você omite `mcp_connections` na criação, o Agent recebe este padrão:

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **A lista que você envia substitui o padrão.** Para adicionar seu próprio servidor MCP e manter as ferramentas SandBase, inclua a entrada integrada na sua lista.
- **`builtin:sandbase` exige `server_label: "sandbase_builtin"`.** Qualquer outro label, ou esse label em outra conexão, retorna `400`.
- **Para criar um Agent sem ferramentas,** envie `"mcp_connections": []`.
- **As ferramentas integradas são gratuitas.** Você paga apenas pelos modelos e APIs que o Agent chama por meio delas.

## Conexões MCP {#mcp-connections}

1. Se o servidor MCP precisar de um token Bearer, [crie um Secret](/agents/api-credentials) para a URL exata dele.
2. Registre o servidor com `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Referencie a conexão no array `mcp_connections` do Agent:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Campo | Significado |
|---|---|
| `connection_id` | ID de conexão `mcp_` na sua organização, ou `builtin:sandbase` para o servidor SandBase integrado |
| `server_label` | Começa com uma letra; letras, dígitos, `_` e `-`; até 64 caracteres; único dentro do Agent |
| `allowed_tools` | Omitido ou `null` permite todas as ferramentas que o servidor oferece; `[]` não permite nenhuma; uma lista permite apenas esses nomes (até 256 nomes, cada um não vazio e com no máximo 128 bytes) |
| `required` | Se a Session deve carregar este servidor |

Um Agent pode referenciar até 32 conexões. As conexões da organização devem estar `active` quando uma Session inicia.

### Ferramentas SandBase integradas {#built-in-sandbase-tools-1}

Criar um Agent sem `mcp_connections` seleciona o servidor SandBase integrado. Para mantê-lo explicitamente junto ao seu próprio servidor, inclua esta entrada no array:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Um array explícito substitui toda a seleção; o exemplo acima, só com o servidor personalizado, exclui o servidor integrado. Envie `[]` para desativar todas as ferramentas MCP. Omitir o campo em uma atualização do Agent preserva a seleção existente; `null` retorna `400`. A entrada integrada não exige criar uma conexão MCP nem um Secret. Não envie o campo descontinuado `use_sandbase_mcp`.

::: info Diferente da OpenAI
A API de Agents da OpenAI declara servidores MCP inline como `tools: [{"type": "mcp", ...}]`. A SandBase retorna `400` para essa forma: registre o servidor como um recurso de conexão e referencie-o em `mcp_connections`. O SDK da OpenAI não tem métodos para `/v1/mcp-connections` ou `/v1/secrets`, então chame-os com `client.post(...)` e passe `mcp_connections` por `extra_body` (Python) ou pelo corpo da requisição (Node.js). Veja [Compatibilidade com a OpenAI](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Alterações e Sessions em execução {#changes-and-running-sessions}

Cada Session congela a versão do Agent, as versões das Skills e a configuração das conexões MCP quando inicia.

- Depois que você substitui uma conexão ou rotaciona seu Secret, novas Sessions usam a nova configuração; Sessions existentes mantêm seu snapshot.
- Desativar uma conexão ou revogar seu Secret bloqueia novas Sessions e rejeita novas entradas em Sessions existentes que a usam. Uma chamada de ferramenta já em execução não é interrompida.

## Mantenha tokens fora dos prompts {#keep-tokens-out-of-prompts}

Armazene tokens como Secrets. Não os coloque em instruções, entradas de Session, metadados ou pacotes de Skill: esses dados podem ser lidos por qualquer pessoa com acesso ao Agent ou à Session.

## Próximos passos {#next-steps}

- [Credenciais para ferramentas MCP](/agents/api-credentials)
- [API de MCP Connections](/api-reference/mcp-connections/)
- [API de Skills](/api-reference/skills/)
- [Definir um Agent](/agents/agent-api)
