---
i18nSource: 99170a141af66587
title: API de Sessions
description: Execute uma versão salva de um Agent, envie entradas, faça streaming de eventos e leia o histórico da Session.
---

# API de Sessions {#sessions-api}

Uma Session executa uma versão salva de um [Agent](/api-reference/agents/) na nuvem hospedada da SandBase; não há ambiente de execução a escolher. IDs de Session usam o prefixo `ses_`. Sessions são um sub-recurso de Agents: todo caminho começa com `/v1/agents/sessions`.

As operações padrão seguem o protocolo OpenAI Agents (`client.beta.agents.sessions`); veja [Compatibilidade com a OpenAI](/agents/openai-compatibility) para saber o que o SDK oficial pode e não pode fazer. As extensões da SandBase adicionam renomeação, estado de arquivamento, cancelamento, anexos, metadados de arquivos do workspace, artefatos imutáveis e um stream de produto com reconexão.

::: info De onde vêm as Sessions
Você cria uma Session diretamente com `POST /v1/agents/sessions`. A Session informa `source: "direct"` e `source_id: null`.
:::

## Fluxo recomendado {#recommended-flow}

1. [Crie uma Session](./create) para um Agent salvo. A Session congela a versão do Agent selecionada e as conexões MCP, e usa as versões de Skill já fixadas nessa versão do Agent.
2. [Abra o stream de eventos](./stream) com `GET /v1/agents/sessions/{session_id}/events`. O stream é apenas ao vivo, então abra-o antes de enviar a entrada.
3. [Envie a entrada](./send-events) com `POST /v1/agents/sessions/{session_id}/events` e um evento `agent.session.input.message`. A chamada retorna 202.
4. Leia os resultados no stream ou, depois, em [items](./items) e [turns](./turns).

## Operações de Session {#session-operations}

| Método | Caminho | Finalidade |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Criar uma Session](./create) |
| `GET` | `/v1/agents/sessions` | [Listar Sessions](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Obter uma Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Substituir metadados](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Renomear](./rename) com `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Excluir](./delete), o que arquiva a Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Enviar um evento de entrada ou de cancelamento](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Fazer streaming de eventos ao vivo](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Listar items](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Listar turns](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Obter um turn](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Cancelar o turn em execução](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Arquivar](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Desarquivar](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Reconectar](./reconnect) após a queda do stream |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Stream com snapshot seguido de eventos ao vivo](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Fazer upload de um anexo](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Listar anexos](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Baixar um anexo](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Excluir um anexo](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Listar metadados de arquivos do workspace](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Listar artefatos imutáveis](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Baixar um artefato](./download-artifact) |

## Campos de status {#status-fields}

- `status` é o status de execução: `idle`, `in_progress` ou `failed`. Ferramentas function que exigem um resultado do cliente (`requires_action`) ainda não são suportadas; a leitura de uma Session nesse estado retorna `502 executor_contract_error`.
- `lifecycle_status` é `active` ou `archived`. Sessions arquivadas rejeitam entradas, atualizações de metadados e streams. `DELETE` arquiva; `unarchive` restaura.
- `failure` é `null` ou um objeto com `code`, `message`, `action` e, às vezes, `retryable`.

| `failure.code` | Significado | `action` sugerida |
|---|---|---|
| `session_creation_rejected` | A camada de execução rejeitou a Session | `create_new_session` |
| `model_authentication_failed` | O provedor do modelo rejeitou a chave | `create_session_with_updated_model_provider` |
| `model_rate_limited` | O provedor do modelo está limitando a taxa (pode ser repetido) | `retry_later` |
| `model_quota_exceeded` | A conta do modelo não tem cota | `check_model_account` |
| `context_limit_exceeded` | A conversa excede o contexto do modelo | `create_new_session` |
| `environment_connection_timeout` | O ambiente não se conectou a tempo (pode ser repetido) | `retry_later` |
| `runtime_unavailable` | O ambiente de execução não está disponível (pode ser repetido) | `retry_later` |
| `model_request_failed` | A requisição ao modelo não foi concluída | `inspect_history` |
| `model_configuration_rejected` | O modelo ou a camada de execução rejeitou a configuração | `create_session_with_updated_model_provider` |
| `execution_failed` | Falha sem uma causa pública mais específica | `inspect_history` |

Os resultados de listagem também podem conter linhas provisórias com `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` ou `session_snapshot_unavailable` quando uma Session não pode ser lida ao vivo.

## Credenciais de modelo {#model-credentials}

Por padrão, uma Session chama modelos com a mesma chave de API da SandBase que a criou. Envie `model_provider` para escolher explicitamente:

- `{"type": "sandbase"}` usa a chave da chamada. `base_url` não é permitido.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` chama seu próprio endpoint HTTPS compatível com OpenAI. A URL não pode conter credenciais, query nem fragmento, e a SandBase nunca recorre à sua chave da SandBase.

`model_provider` é somente escrita e nunca aparece nas respostas.

## Admissão e erros {#admission-and-errors}

Criar uma Session e enviar entradas verificam a admissão de execução: `402 spending_limit_exceeded` quando o limite da chave ou o saldo da organização se esgota, `403 org_disabled` quando a organização não pode executar Agents e `503 admission_unavailable` quando a verificação não pode ser concluída. Leituras, cancelamento e arquivamento não são bloqueados pelo saldo.

Enviar entradas também pode retornar `409 session_input_pending` (uma entrada anterior ainda está sendo entregue; aguarde e não reenvie com uma nova chave), `409 session_input_expired` (consulte o histórico antes de enviar novamente) ou `409 session_environment_unavailable` (aguarde ou crie uma nova Session). Veja [Erros](/api-reference/errors#agents-platform-errors).

## Paginação {#pagination}

Sessions, items, turns e artefatos usam paginação por cursor (`limit` 1-100, `after`, `order`). Anexos usam paginação por offset (`limit` 1-100, `offset`).

Arquivos do workspace usam paginação `page` / `next`. Veja [Listar arquivos do workspace](./list-workspace-files).
