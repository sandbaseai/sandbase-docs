---
i18nSource: adfacb669489863e
title: Cuenta y facturación
description: Administra tu organización de SandBase, las claves de API, la facturación, el uso y los límites.
---

# Cuenta y facturación {#account-and-billing}

La configuración de tu organización determina a quién pertenece el uso, cómo se autentican las aplicaciones y cómo se supervisa el gasto.

## Qué administras {#what-you-manage}

| Área | Para qué sirve |
|---|---|
| [Organizaciones](/admin/organizations) | Administrar el límite del espacio de trabajo, los miembros y la propiedad |
| [Claves de API](/getting-started/api-keys) | Crear, rotar y revocar las credenciales de las aplicaciones |
| [Facturación y créditos](/admin/billing) | Revisar el saldo, comprar créditos, configurar la recarga automática y revisar el uso en Activities y Analysis |
| [Precios y uso](/guides/billing) | Consultar los precios de los modelos, las llamadas gratuitas diarias a la API y el costo de una tarea |
| [Límites de velocidad](/guides/rate-limiting) | Entender los límites de solicitudes y cómo reintentar de forma segura |

## Configuración recomendada {#recommended-setup}

1. Confirma que estás trabajando en la organización correcta.
2. Crea claves de API distintas para desarrollo, staging y producción.
3. Nombra las claves según su aplicación y entorno.
4. Revisa Activities y la facturación después de las primeras solicitudes en producción.
5. Revoca las claves que no uses e investiga cuanto antes cualquier uso inesperado.

## Propiedad y acceso {#ownership-and-access}

Las claves de API y el uso pertenecen a una organización. Al cambiar de organización cambian los recursos, las claves y el contexto de facturación visibles en la Console. Antes de modificar la configuración de producción, verifica la organización seleccionada y coordina la rotación de claves con las aplicaciones que las usan.

## Seguridad básica {#security-basics}

- guarda las claves en variables de entorno o en un gestor de secretos
- nunca pegues claves en las instrucciones de un Agent, en el código fuente, en capturas de pantalla ni en mensajes de soporte
- usa una clave distinta para cada aplicación y entorno
- revoca una clave de inmediato si pudo haber quedado expuesta
- supervisa Activities para detectar volumen, modelos o endpoints inesperados
