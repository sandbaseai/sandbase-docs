---
i18nSource: adfacb669489863e
title: Conta e faturamento
description: Gerencie sua organização SandBase, chaves de API, faturamento, uso e limites.
---

# Conta e faturamento {#account-and-billing}

As configurações da sua organização definem a quem pertence o uso, como as aplicações se autenticam e como os gastos são monitorados.

## O que você gerencia {#what-you-manage}

| Área | Para que serve |
|---|---|
| [Organizações](/admin/organizations) | Gerenciar o limite do workspace, os membros e a titularidade |
| [Chaves de API](/getting-started/api-keys) | Criar, rotacionar e revogar credenciais de aplicações |
| [Faturamento e créditos](/admin/billing) | Consultar o saldo, comprar créditos, configurar a recarga automática e analisar o uso em Activities e Analysis |
| [Preços e uso](/guides/billing) | Consultar os preços dos modelos, as chamadas de API gratuitas diárias e o custo de uma tarefa |
| [Limites de taxa](/guides/rate-limiting) | Entender os limites de requisições e como fazer novas tentativas com segurança |

## Configuração recomendada {#recommended-setup}

1. Confirme que você está trabalhando na organização correta.
2. Crie chaves de API separadas para desenvolvimento, staging e produção.
3. Dê às chaves o nome da aplicação e do ambiente.
4. Revise Activities e o faturamento após as primeiras requisições em produção.
5. Revogue chaves não utilizadas e investigue rapidamente qualquer uso inesperado.

## Titularidade e acesso {#ownership-and-access}

As chaves de API e o uso pertencem a uma organização. Ao trocar de organização, mudam os recursos, as chaves e o contexto de faturamento visíveis no Console. Antes de alterar a configuração de produção, verifique a organização selecionada e coordene a rotação de chaves com as aplicações que as utilizam.

## Noções básicas de segurança {#security-basics}

- armazene as chaves em variáveis de ambiente ou em um gerenciador de segredos
- nunca cole chaves em instruções de Agent, código-fonte, capturas de tela ou mensagens ao suporte
- use uma chave separada para cada aplicação e ambiente
- revogue uma chave imediatamente se ela puder ter sido exposta
- monitore Activities em busca de volume, modelos ou endpoints inesperados
