---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground (experimental)
description: Prueba sandboxes reales de SandBase con tu propia API key. Créalos, ejecuta comandos, verifica archivos tras pausar y reanudar, e inspecciona los eventos del ciclo de vida.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

Prueba la Sandbox API con tu propia clave. Las operaciones se conectan a **sandbox.sandbase.ai** y pueden generar cargos.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## Tu clave sigue bajo tu control {#your-key-stays-under-your-control}

- **Solo en la memoria de la página.** Este Playground no guarda tu API key ni los tokens de conexión en el almacenamiento del navegador ni en cookies, no los pone en URLs y no los registra en la actividad de la página ni en los ejemplos de solicitudes.
- **Bórrala cuando quieras.** Selecciona **Clear key** para eliminar la clave, los tokens de conexión y la actividad mostrada, incluso mientras se ejecuta una solicitud. Actualizar o abandonar esta página también los borra. Tendrás que volver a introducir tu clave para reconectarte.
- **Se usa solo para tus solicitudes.** Tu clave se transmite a SandBase para autenticar las operaciones de Sandbox que solicites. Borrar esta página no revoca la clave; revócala en [Developer → API Keys](https://www.sandbase.ai/console/keys) si es necesario.

Estas garantías cubren cómo gestiona este Playground las credenciales. No significan que se borre la actividad del Sandbox ni los registros de uso del lado del servicio. Evita introducir secretos en comandos o archivos, cuyo contenido puede permanecer en tu sandbox.

## Limpia los recursos por separado {#clean-up-resources-separately}

Borrar tu clave no cancela una operación que el servicio ya haya recibido ni elimina un sandbox. Elimina las instancias cuando termines. Si no conoces el resultado de una creación, revisa tus instancias antes de crear otra. Guarda los IDs de instancia que necesites para la limpieza antes de borrar esta página.

[Descripción general y capacidades](./index) · [Inicio rápido / E2B SDK](./quickstart)
