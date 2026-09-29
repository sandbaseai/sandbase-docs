---
title: Sandbox Playground (Experimental)
description: Try real SandBase sandboxes with your own API key. Create, run commands, verify files after pause and resume, and inspect lifecycle events.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground

Try the Sandbox API with your own key. Operations connect to **sandbox.sandbase.ai** and may incur charges.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## Credentials and resources

Your API key and connection tokens stay in page memory. They are never saved to browser storage, URLs, or request examples. The same-origin docs proxy forwards requests to the fixed Sandbox domain without a shared platform key or credential logging.

Leaving or refreshing this page does not delete resources. Delete your instances before clearing credentials. If a creation result is unknown, reconcile the attempt marker before creating another instance.

[Overview and capabilities](./index) · [Quickstart / E2B SDK](./quickstart)
