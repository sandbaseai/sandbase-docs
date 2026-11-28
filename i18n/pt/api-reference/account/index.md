---
i18nSource: 3b9b3fc27f878cd5
title: API de Account
description: Consulte o saldo da organização e o histórico recente de execuções associados a uma chave de API.
---

# API de Account {#account-api}

Os endpoints de Account são somente leitura e operam na organização resolvida a partir da chave de API Bearer.

| Operação | Endpoint |
|---|---|
| [Obter saldo](./balance) | `GET /v1/account/balance` |
| [Listar histórico de execuções](./history) | `GET /v1/account/history` |

Valores de saldo e custo são strings decimais exatas. Mantenha-os como valores decimais em vez de convertê-los por
aritmética de ponto flutuante binário.

O histórico de execuções serve para inspeção operacional recente. Use registros de faturamento ou exportações para
conciliação financeira de longo prazo.

A filtragem do histórico usa timestamps UTC brutos. Sem `request_id`, o parâmetro de compatibilidade opcional `timezone` é validado como um nome de fuso horário IANA, mas não transforma os timestamps da resposta; o modo exato por `request_id` o ignora junto com os outros filtros. Valores de `type` desconhecidos não aplicam filtro de tipo de execução; use `multimodal`, `llm` ou `api` para um filtro efetivo. Valores de `range` não suportados voltam para `7d`.

As entradas do histórico podem conter parâmetros de requisição armazenados e saídas de modelos. Restrinja o acesso à chave de API de acordo,
e não copie respostas do histórico em logs ou tickets de suporte sem revisá-las em busca de dados sensíveis.
