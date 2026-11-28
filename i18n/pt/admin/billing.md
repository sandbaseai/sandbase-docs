---
i18nSource: d560e2374d91a8d6
title: Faturamento e créditos
description: Consulte o saldo da organização na SandBase, compre créditos com Stripe ou Airwallex, configure a recarga automática, resgate cupons e entenda os controles de gastos das chaves de API.
---

# Faturamento e créditos {#billing-and-credits}

Esta página aborda o gerenciamento de faturamento no [SandBase Console](https://www.sandbase.ai/console). Para tarifas e otimização de custos, consulte [Preços](/guides/billing).

A SandBase cobra as cargas de trabalho suportadas do saldo da organização. Preços atuais, ofertas, provedores de pagamento,
valores mínimos de recarga e disponibilidade regional são exibidos no Console e podem mudar independentemente deste
guia.

## Saldo {#balance}

Abra [Developer → Billing](https://www.sandbase.ai/console/billing). A página **Credits** mostra, para a organização ativa:

| Item | O que significa |
|------|---------------|
| **Available balance** | Disponível para uso em Models e APIs |
| **Credit limit** | Limite de gastos do workspace |
| **Current level** | O nível da conta e a concorrência correspondente |

O mesmo saldo aparece no card **Balance** do Dashboard do Console e no cabeçalho do site quando você está conectado.
Considere o Console a fonte oficial para promoções e condições de pagamento; não automatize as requisições de rede
internas dele.

## Comprar créditos {#buy-credits}

1. Abra [Billing](https://www.sandbase.ai/console/billing) e confirme que **Credits go to** mostra o workspace que você quer abastecer.
2. Em **Buy credits**, escolha um valor predefinido ou informe um **Custom amount** em USD. A recarga mínima é exibida na página.
3. Se houver mais de um **Payment provider**, escolha **Stripe** (cartões e carteiras digitais globais) ou **Airwallex** (cartões e métodos de pagamento locais).
4. Revise **Pay**, **Bonus** e **Receive** na prévia, selecione **Continue with Stripe** (ou o provedor escolhido) e conclua o checkout hospedado.
5. Confirme o saldo atualizado em **Credit transactions** antes de iniciar uma carga de trabalho sensível a custos.

A SandBase nunca armazena dados de cartão; o provedor hospeda a página de pagamento.

### Bônus da primeira recarga {#first-top-up-bonus}

Quando a conta e o workspace nunca fizeram uma recarga, **Current offers** exibe um bônus de primeira recarga. A página informa
o percentual do bônus e o valor máximo. Vale um bônus por conta e por workspace, e reembolsos recuperam o bônus
proporcionalmente. O bônus aparece como uma linha própria em **Credit transactions**.

## Recarga automática {#auto-top-up}

**Auto Top-up** recarrega o saldo com um cartão salvo quando ele fica abaixo de um limite. No momento, só oferece suporte ao Stripe,
e apenas proprietários e administradores do workspace podem gerenciá-la.

1. Em **Payment cards**, selecione **Add Card** e salve um cartão no Stripe.
2. Selecione **Turn on auto top-up** e defina **When balance goes below**, **Top-up amount**, um **Monthly limit** opcional e o cartão.
3. Marque **I authorize these automatic charges** e confirme.

Quando o limite mensal é atingido, a recarga automática fica suspensa pelo restante do mês do calendário (UTC). As cobranças automáticas
aparecem em **Credit transactions** com o canal `Auto top-up · Stripe`.

## Resgatar um cupom {#redeem-a-coupon}

Informe o **Coupon code** em **Redeem a coupon** e selecione **Redeem credit**. Um cupom vale apenas para o workspace
ativo, então confirme primeiro a organização selecionada.

## Controles de gastos {#spending-controls}

| Controle | Escopo | Comportamento |
|---------|-------|----------|
| Limite de financiamento da organização | Organização inteira | Saldo disponível mais qualquer limite de crédito configurado; uma requisição sem fundos pode retornar HTTP 402 |
| Limite de gastos por chave | Por chave de API | Limite opcional por chave, restrito ao saldo da organização |
| Limite mensal da recarga automática | Organização inteira | Limita as cobranças automáticas por mês do calendário (UTC) |

Para definir um limite de gastos por chave, consulte [Chaves de API](/getting-started/api-keys).

## Atividades e análises {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) tem duas abas:

- **Request History** lista as requisições individuais com chave de API, modelo, status, latência e custo.
- **Usage** mostra requisições e custos em 7 ou 30 dias, **Model APIs by Archived Spend** e **Billing Records**. Ambas as tabelas têm **Export CSV**. A exportação de registros de faturamento inclui uma coluna **Free Quota** que marca as chamadas cobertas pela cota gratuita diária.

[Developer → Analysis](https://www.sandbase.ai/console/analytics) acrescenta **Overview**, **Cost analysis** e
**Health diagnostics** para os últimos 7 ou 30 dias UTC completos.

Para preços públicos e contratos de custo de tarefas, consulte [Preços e uso](/guides/billing) e
[Obter custo da tarefa](/api-reference/tasks/cost).

