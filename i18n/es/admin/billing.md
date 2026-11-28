---
i18nSource: d560e2374d91a8d6
title: Facturación y créditos
description: Revisa el saldo de la organización en SandBase, compra créditos con Stripe o Airwallex, configura la recarga automática, canjea cupones y entiende los controles de gasto de las claves de API.
---

# Facturación y créditos {#billing-and-credits}

Esta página explica la gestión de la facturación en la [SandBase Console](https://www.sandbase.ai/console). Para tarifas y optimización de costos, consulta [Precios](/guides/billing).

SandBase factura las cargas de trabajo compatibles con cargo al saldo de la organización. Los precios actuales, las ofertas, los proveedores de pago,
los importes mínimos de recarga y la disponibilidad regional se muestran en la Console y pueden cambiar con independencia de esta
guía.

## Saldo {#balance}

Abre [Developer → Billing](https://www.sandbase.ai/console/billing). La página **Credits** muestra, para la organización activa:

| Elemento | Qué significa |
|------|---------------|
| **Available balance** | Disponible para usar en Models y APIs |
| **Credit limit** | Margen de gasto del espacio de trabajo |
| **Current level** | El nivel de la cuenta y su concurrencia |

El mismo saldo aparece en la tarjeta **Balance** del Dashboard de la Console y en el encabezado del sitio cuando inicias sesión.
Considera la Console como la fuente de verdad para promociones y condiciones de pago; no automatices sus solicitudes de red
internas.

## Comprar créditos {#buy-credits}

1. Abre [Billing](https://www.sandbase.ai/console/billing) y confirma que **Credits go to** muestra el espacio de trabajo que quieres recargar.
2. En **Buy credits**, elige un importe predefinido o introduce un **Custom amount** en USD. La recarga mínima se indica en la página.
3. Si se ofrece más de un **Payment provider**, elige **Stripe** (tarjetas y monederos globales) o **Airwallex** (tarjetas y métodos de pago locales).
4. Revisa **Pay**, **Bonus** y **Receive** en la vista previa, selecciona **Continue with Stripe** (o el proveedor que elegiste) y completa el pago alojado.
5. Confirma el saldo actualizado en **Credit transactions** antes de iniciar una carga de trabajo sensible al costo.

SandBase nunca almacena los datos de la tarjeta; el proveedor aloja la página de pago.

### Bono de primera recarga {#first-top-up-bonus}

Si la cuenta y el espacio de trabajo nunca se han recargado, **Current offers** muestra un bono de primera recarga. La página indica
el porcentaje del bono y su tope. Se aplica un bono por cuenta y por espacio de trabajo, y los reembolsos recuperan el bono
de forma proporcional. El bono aparece como una fila propia en **Credit transactions**.

## Recarga automática {#auto-top-up}

**Auto Top-up** recarga el saldo con una tarjeta guardada cuando baja de un umbral. Por ahora solo admite Stripe,
y solo los propietarios y administradores del espacio de trabajo pueden gestionarla.

1. En **Payment cards**, selecciona **Add Card** y guarda una tarjeta en Stripe.
2. Selecciona **Turn on auto top-up** y configura **When balance goes below**, **Top-up amount**, un **Monthly limit** opcional y la tarjeta.
3. Marca **I authorize these automatic charges** y confirma.

Cuando se alcanza el límite mensual, la recarga automática se detiene durante el resto del mes natural (UTC). Los cargos automáticos
aparecen en **Credit transactions** con el canal `Auto top-up · Stripe`.

## Canjear un cupón {#redeem-a-coupon}

Introduce el **Coupon code** en **Redeem a coupon** y selecciona **Redeem credit**. Un cupón se aplica solo al espacio de trabajo
activo, así que confirma primero la organización seleccionada.

## Controles de gasto {#spending-controls}

| Control | Alcance | Comportamiento |
|---------|-------|----------|
| Límite de fondos de la organización | Toda la organización | Saldo disponible más cualquier límite de crédito configurado; una solicitud sin fondos puede devolver HTTP 402 |
| Límite de gasto por clave | Por clave de API | Tope opcional por clave, limitado por el saldo de la organización |
| Límite mensual de recarga automática | Toda la organización | Limita los cargos automáticos por mes natural (UTC) |

Para configurar un límite de gasto por clave, consulta [Claves de API](/getting-started/api-keys).

## Actividades y análisis {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) tiene dos pestañas:

- **Request History** enumera las solicitudes individuales con clave de API, modelo, estado, latencia y costo.
- **Usage** muestra solicitudes y costo de los últimos 7 o 30 días, **Model APIs by Archived Spend** y **Billing Records**. Ambas tablas tienen **Export CSV**. La exportación de registros de facturación incluye una columna **Free Quota** que marca las llamadas cubiertas por la cuota gratuita diaria.

[Developer → Analysis](https://www.sandbase.ai/console/analytics) añade **Overview**, **Cost analysis** y
**Health diagnostics** para los últimos 7 o 30 días UTC completos.

Para los precios públicos y los contratos de costo de tareas, consulta [Precios y uso](/guides/billing) y
[Obtener el costo de una tarea](/api-reference/tasks/cost).
