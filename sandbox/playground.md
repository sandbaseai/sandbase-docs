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

## Your key stays under your control

- **Page memory only.** This Playground does not save your API key or connection tokens to browser storage or cookies, put them in URLs, or record them in page activity or request examples.
- **Clear at any time.** Select **Clear key** to remove the key, connection tokens, and displayed activity, even while a request is running. Refreshing or leaving this page also clears them. You will need to enter your key again to reconnect.
- **Used only for your requests.** Your key is transmitted to SandBase to authenticate the Sandbox operations you request. Clearing this page does not revoke the key; revoke it in [Console → API Keys](https://www.sandbase.ai/console/keys) if needed.

These promises cover this Playground’s handling of credentials. They do not mean Sandbox activity or service-side usage records are erased. Avoid entering secrets in commands or files, whose contents can remain in your sandbox.

## Clean up resources separately

Clearing your key does not cancel an operation already received by the service or delete a sandbox. Delete instances when finished. If a creation result is unknown, check your instances before creating another. Keep any instance IDs you need for cleanup before clearing this page.

[Overview and capabilities](./index) · [Quickstart / E2B SDK](./quickstart)
