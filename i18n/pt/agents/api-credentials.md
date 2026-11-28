---
i18nSource: dab112fdbbc56799
title: Credenciais para ferramentas MCP
description: Armazene tokens Bearer somente de escrita como Secrets para que os Agents possam chamar servidores MCP autenticados.
---

# Credenciais para ferramentas MCP {#credentials-for-mcp-tools}

Quando um servidor MCP exige autenticação, armazene o token Bearer dele como um **Secret** e associe o Secret a uma [conexão MCP](/agents/mcp-tools#mcp-connections). O ambiente de execução envia o token somente para esse servidor.

## Como os Secrets funcionam {#how-secrets-work}

- `kind` é sempre `mcp_bearer`: um token Bearer para um servidor MCP.
- Cada Secret fica vinculado a um `server_url` exato. Uma conexão só pode usá-lo quando o `server_url` dela corresponde. Para usar outra URL, crie outro Secret.
- O token é somente de escrita. A API retorna o nome, a URL, o status e o `row_version` do Secret, nunca o token.
- Secrets não são variáveis de ambiente. Eles não são injetados no runtime do Agent, e os Agents não conseguem lê-los.

Versões anteriores do SandBase armazenavam credenciais com escopo de workspace ou de Agent e as injetavam como variáveis de ambiente, como `GITHUB_TOKEN`. Esse modelo foi descontinuado e seus registros não são migrados. Recrie os valores de que você ainda precisa como Secrets em conexões MCP.

## Pela API {#with-the-api}
Crie, rotacione e revogue Secrets pela API. Este guia é o contrato da API; a página Credentials do Console, aberta a partir do editor de Agent, não é a referência para o comportamento dos Secrets. Chame estes endpoints a partir de um backend confiável, nunca de código no navegador: eles recebem uma chave de API do SandBase e um token em texto puro.

| Método | Caminho | Finalidade |
|---|---|---|
| `POST` | `/v1/secrets` | [Criar um Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [Listar Secrets](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Obter um Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Rotacionar o token](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Revogar um Secret](#revoke-a-secret) |

Toda escrita exige `Idempotency-Key` (1 a 128 bytes, sem espaços no início ou no fim). O objeto Secret tem `id` (prefixo `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at` e `updated_at`. `status` é `pending` enquanto o token está sendo armazenado, `active` quando ele pode ser usado e `disabled` após a revogação. `created_at` e `updated_at` são strings de timestamp RFC 3339.

### Criar um Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` deve ser `mcp_bearer`.
- `server_url` deve ser HTTPS, sem informações de usuário, query ou fragmento. O Secret só funciona para essa URL exata.
- `name` e `token` são obrigatórios e não podem estar em branco. `name` tem até 128 bytes, `token` até 16384 bytes e `server_url` até 2048 bytes.

A resposta é `201 Created`, sem o token. Use o ID `sec_` como `secret_id` ao [criar a conexão MCP](/api-reference/mcp-connections/#create-a-connection).

### Listar Secrets {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginação por offset com `data`, `total`, `limit` e `offset`. `limit` tem padrão 20 e máximo 200; valores ausentes, inválidos ou não positivos usam 20. `offset` tem padrão 0; valores inválidos ou não positivos usam 0. Avance pelo `limit` retornado até que `offset + data.length >= total`. Secrets desativados continuam na lista.

### Obter um Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Rotacionar um Secret {#rotate-a-secret}

Defina `SECRET_ROW_VERSION` com o `row_version` mais recente retornado por Obter um Secret.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

A rotação substitui o token e mantém o mesmo Secret e o mesmo `server_url`. `token` e um `row_version` inteiro positivo são obrigatórios, o Secret precisa estar `active` e o `row_version` precisa corresponder ao valor mais recente. Retorna `201 Created`. Novas Sessions usam o novo token; Sessions que já começaram mantêm a credencial que congelaram.

### Revogar um Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Retorna `204 No Content` e define `status` como `disabled`. As conexões que usam o Secret deixam de funcionar para novas Sessions e para novas entradas em Sessions existentes. A revogação não pode ser desfeita: crie um novo Secret e substitua a conexão.

### Erros e novas tentativas {#errors-and-retries}

Os erros usam o [envelope de erro de Agents](/api-reference/errors#agents-platform-errors). Campos inválidos ou a ausência da chave de idempotência em uma escrita retornam `400 invalid_request`; um Secret desconhecido ou inacessível retorna `404 not_found`. Um `row_version` desatualizado, um estado de ciclo de vida incompatível ou a reutilização de uma chave de criação com uma entrada diferente retornam `409 conflict`. Leia o Secret novamente antes de tentar de novo e use uma nova chave para cada nova escrita.

## Segurança {#security}

- Crie e rotacione Secrets a partir de um backend confiável, nunca de código no navegador.
- Leia os tokens do seu próprio armazenamento de segredos ou do ambiente, como em `$GITHUB_MCP_TOKEN` acima, em vez de colá-los em scripts.
- Mantenha os tokens fora de instruções, entradas de Session, metadados e pacotes de Skill.
- Revogue um Secret assim que o token dele puder ter vazado; depois, crie um novo e substitua a conexão.

## Próximos passos {#next-steps}

- [Skills e ferramentas MCP](/agents/mcp-tools)
- [API de conexões MCP](/api-reference/mcp-connections/)
