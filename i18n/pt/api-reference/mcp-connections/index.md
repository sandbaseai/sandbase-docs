---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: Registre servidores MCP remotos via HTTPS que os Agents podem chamar.
---

# MCP Connections API {#mcp-connections-api}

Uma conexão MCP registra um servidor MCP remoto acessível via HTTPS. Os Agents referenciam conexões em `mcp_connections`; cada Session congela a configuração da conexão ao iniciar. Os IDs de conexão usam o prefixo `mcp_`. Para se autenticar no servidor com um Bearer token, crie primeiro um [Secret](/agents/api-credentials#with-the-api) para a mesma URL.

| Método | Caminho | Finalidade |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Criar uma conexão](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Listar conexões](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Obter uma conexão](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Substituir uma conexão](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Ativar uma conexão](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Desativar uma conexão](#disable-a-connection) |

Toda escrita exige `Idempotency-Key` (1 a 128 bytes, sem espaços em branco no início ou no fim). O objeto de conexão tem `id`, `name`, `server_url`, `secret_id` (quando definido), `status` (`active` ou `disabled`), `row_version`, `created_at` e `updated_at`.

## Criar uma conexão {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` é obrigatório e não pode estar em branco, com até 128 bytes.
- `server_url` deve ser HTTPS, sem informações de usuário, query ou fragmento (até 2048 bytes).
- `secret_id` é opcional. Omita-o para um servidor anônimo. Quando definido, o Secret deve estar `active` e seu `server_url` deve ser exatamente igual a este `server_url`; caso contrário, a requisição falha (409 para um Secret inativo, 400 para URLs diferentes).

Retorna `201 Created`.

## Listar conexões {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginação por offset com `data`, `total`, `limit` e `offset`. `limit` tem padrão 20 e máximo 200; valores ausentes, inválidos ou não positivos usam 20. `offset` tem padrão 0; valores inválidos ou não positivos usam 0. Avance pelo `limit` retornado até que `offset + data.length >= total`. Recursos desativados continuam visíveis na lista.

## Obter uma conexão {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Substituir uma conexão {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` substitui `name`, `server_url` e `secret_id` juntos; omitir `secret_id` torna a conexão anônima. `row_version` é obrigatório e deve corresponder ao valor atual retornado por Get Connection. Retorna `200 OK` com a conexão atualizada. Uma conexão desativada continua desativada após a substituição até que você a ative.

## Ativar uma conexão {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` é obrigatório e deve ser um inteiro positivo que corresponda ao recurso atual. Retorna `200 OK` com a conexão. A ativação mantém o mesmo ID de conexão. Ela não restaura um Secret revogado; substitua primeiro a conexão usando um novo Secret ativo.

## Desativar uma conexão {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Retorna `204 No Content` e define `status` como `disabled`. Novas Sessions não podem usar a conexão, e as Sessions existentes que a congelaram rejeitam novos inputs. Uma chamada de ferramenta já em execução não é interrompida.

## Alterações e Sessions em execução {#changes-and-running-sessions}

As Sessions congelam as configurações de conexão ao iniciar. Depois que você substitui uma conexão ou rotaciona o Secret dela, as novas Sessions usam a nova configuração e as Sessions existentes mantêm seu snapshot. Desativar a conexão ou revogar o Secret bloqueia tanto novas Sessions quanto novos inputs nas existentes.

## Erros e novas tentativas {#errors-and-retries}

Os erros usam o [envelope de erro de Agents](/api-reference/errors#agents-platform-errors). Campos inválidos ou a ausência da chave de idempotência em escritas retornam `400 invalid_request`; um recurso desconhecido ou inacessível retorna `404 not_found`. Um `row_version` desatualizado, um estado de ciclo de vida incompatível ou a reutilização de uma chave de criação/atualização com input diferente retorna `409 conflict`. Leia o recurso novamente antes de enviar uma nova atualização e use uma nova chave para cada nova operação de escrita.

`created_at` e `updated_at` são strings de timestamp RFC 3339.

