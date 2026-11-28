---
i18nSource: 258f8ff4bb1ed96f
title: Organizações
description: Gerencie organizações, membros e funções no SandBase.
---

# Organizações {#organizations}

As organizações são a unidade de cobrança e controle de acesso no SandBase. API keys, saldo, uso e membros pertencem a uma organização.

## Tipos de organização {#organization-types}

| Tipo | Descrição |
|------|-------------|
| **Pessoal** | Criada automaticamente no primeiro login. Uma por usuário. |
| **Equipe** | Criada manualmente. Vários membros com funções. |

## Funções dos membros {#member-roles}

| Função | Permissões |
|------|-------------|
| **Owner** | Acesso total ao workspace, incluindo a alteração de funções dos membros. |
| **Admin** | Gerencia chaves e cobrança, e adiciona ou remove membros que não são owners. |
| **Member** | Usa o workspace e suas API keys sem acesso ao gerenciamento de membros. |

## Criar uma organização de equipe {#create-a-team-organization}

1. Abra o menu da conta no canto superior direito do Console.
2. Escolha **Create Team** ou abra **Developer → Team** e selecione **Create team**.
3. Informe um **Team name** e selecione **Create team**.
4. Selecione **Add member**, informe o **Account email** de uma conta SandBase existente e escolha um **Workspace role**: **Member** ou **Admin**.

O membro adicionado precisa já ter uma conta SandBase. Owners podem alterar as funções dos membros; owners e admins podem remover
membros que não são owners.

## Alternar entre organizações {#switch-organizations}

Se você pertence a várias organizações, alterne entre elas no menu da conta ou use a faixa **Switch workspace** em **Developer → Team**. Suas API keys e a cobrança ficam restritas à organização ativa.

## Saldo e cobrança {#balance-and-billing}

Cada organização tem seu próprio saldo. Chamadas de modelos, chamadas de API, Sessions de Agents e trabalho de runtime são cobrados desse saldo. Consulte [Cobrança](/admin/billing) para mais detalhes.

