---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: Execute um Agent em uma Session, faça streaming dos eventos, leia o histórico, anexe arquivos e trate falhas.
---

# Sessions {#sessions}

Uma **Session** executa uma versão salva de um Agent na nuvem hospedada do SandBase; você não escolhe um ambiente de execução. O ID dela começa com `ses_`, e todos os caminhos de Session ficam em `/v1/agents/sessions`. A Session congela a versão do Agent, as versões das Skills e a configuração das conexões MCP com que foi iniciada.

## Como as Sessions começam {#how-sessions-start}

Crie uma Session com `POST /v1/agents/sessions`. A Session informa `source: "direct"`.

## Executar uma Session {#run-a-session}

O stream de eventos nativo é **apenas ao vivo**: os eventos não são reenviados após uma desconexão. Abra-o antes de enviar o input e leia o histórico a partir de items ou turns.

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

O mesmo fluxo com o SDK oficial de Python da OpenAI. Abra o stream primeiro, envie o input a partir de outra thread e pare no evento terminal do turn. Consulte [Compatibilidade com a OpenAI](/agents/openai-compatibility) para a versão em Node.js e as diferenças do SDK.

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

Cada envio carrega exatamente um evento. `input` é uma string de texto ou um array com exatamente uma mensagem de usuário que tem exatamente uma parte `input_text`: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Qualquer outro formato retorna `400 invalid_request`. Para interromper o turn em execução, envie `{"type": "agent.session.input.cancel"}` ou chame `POST /v1/agents/sessions/{session_id}/cancel` com um `Idempotency-Key`. Cancelar uma Session ociosa ainda retorna `202 {"accepted": true}` e não altera nada. Você também pode passar um primeiro `input` ao criar a Session. `stream: true` na criação não é suportado.

## Status e falhas {#status-and-failures}

| Campo | Valores | Significado |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Estado de execução da Session |
| `lifecycle_status` | `active`, `archived` | Se a Session aceita input |
| `failure` | `null` ou `{code, message, action, retryable?}` | Motivo público de uma falha e a próxima etapa sugerida |

`failure.action` indica o que fazer: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` ou `create_session_with_updated_model_provider`. Consulte a [tabela de códigos de falha](/api-reference/sessions/#status-fields).

Function tools que pedem um resultado ao cliente (`requires_action`) ainda não são suportadas; ler uma Session nesse estado retorna `502 executor_contract_error`.

Se um envio retornar `409 session_input_pending`, um input anterior ainda está sendo entregue. Aguarde e leia a Session; não reenvie com um novo `Idempotency-Key`, ou o input pode ser executado duas vezes.

## Arquivar {#archive}

`DELETE /v1/agents/sessions/{session_id}` arquiva uma Session; as Sessions não são excluídas definitivamente. `POST /v1/agents/sessions/{session_id}/archive` e `/unarchive` recebem `{"row_version": …}`. Sessions arquivadas mantêm o histórico, mas rejeitam input, atualizações de metadata e streams.

## Anexos {#attachments}

Envie um arquivo para o workspace da Session com `POST /v1/agents/sessions/{session_id}/files` (campo multipart `file`, até 5 MiB, `Idempotency-Key` obrigatório). Os tipos suportados são `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` e `.webp`. Quando o `status` do arquivo for `ready`, envie-o junto com até outros nove:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Reconexão de clientes {#reconnecting-clients}

Clientes no estilo navegador que precisam de uma visão consistente após uma queda de conexão podem chamar `POST /v1/agents/sessions/{session_id}/reconnect`. Ele retorna a Session e uma `stream_url` para `GET /v1/agents/sessions/{session_id}/events/stream`, que envia primeiro um `session.snapshot` e depois os eventos ao vivo e `heartbeat`. Se esse stream emitir `stream.interrupted`, reconecte novamente em vez de reenviar o input.

## Repositório do GitHub {#github-repository}

Envie `github_workspace` na criação para clonar um repositório do GitHub em `/workspace` e permitir que o Agent faça push para as próprias branches da Session. Consulte [Workspace de repositório do GitHub](/agents/github-workspace).

## Credenciais de modelo {#model-credentials}

Uma Session chama os modelos com a API key que a criou, a menos que você envie `model_provider`. Use `{"type": "custom", "base_url": "https://…", "api_key": "…"}` para executar com seu próprio endpoint HTTPS compatível com a OpenAI. `model_provider` é somente escrita.

## IDs {#ids}

| Prefixo | Recurso |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | Conexão MCP |
| `sec_` | Secret |
| `fil_` | Anexo de Session |

Trate os IDs como strings opacas.

## Próximos passos {#next-steps}

- [Referência da API de Sessions](/api-reference/sessions/)
- [Compatibilidade com a OpenAI](/agents/openai-compatibility)

## Arquivos do workspace e artifacts gerados {#workspace-files-and-generated-artifacts}

Estes três recursos têm finalidades diferentes:

| Recurso | Use para | Paginação |
|---|---|---|
| [Anexos](/api-reference/sessions/list-files) | Arquivos que você enviou e pode referenciar no input com um `file_id` | `limit` / `offset` |
| [Arquivos do workspace](/api-reference/sessions/list-workspace-files) | Caminhos e tamanhos atuais dos arquivos em um diretório do workspace | `page` / `next` |
| [Artifacts](/api-reference/sessions/list-artifacts) | Saídas geradas imutáveis disponíveis para download | `after` / `last_id` |

Liste os artifacts para obter um ID `art_` e passe exatamente esse ID para [Download Artifact](/api-reference/sessions/download-artifact). Um caminho do workspace ou o `file_id` de um anexo não o substitui. A listagem do workspace retorna apenas metadados e não é uma API de download de caminhos arbitrários. Os artifacts podem ser baixados como arquivos completos de até 200 MiB; downloads parciais com `Range` não são suportados.

