---
title: Sandbox Overview and Capabilities
description: Explore Sandbox creation, commands, files, pause and resume, and lifecycle events through the experimental Playground, with clear capability and resource boundaries.
---

# Sandbox overview and capabilities

Sandbox provides isolated environments for running commands, executing code, and reading or writing files. Pause an instance, reconnect to it, and read back a file to verify persistence.

[Quickstart / E2B SDK](./quickstart) · [Open Playground (Experimental)](./playground)

## A five-minute walkthrough

1. Enter an [API key](/getting-started/api-keys) with Sandbox permissions. Connecting only reads templates and instances.
2. Choose an available template, acknowledge the resource notice, and create a short-lived instance.
3. Run the system information or Python example. Watch output and process events alongside the command panel.
4. Write and verify a text file, pause the instance, resume it, and read the same file again.
5. Inspect lifecycle events, metrics, logs, and machine-time evidence. Delete your instance when finished.

Refreshing clears page credentials and local operation history; it does not delete sandboxes. Running instances follow the server timeout. Paused instances may retain resources. Record instance IDs and use your organization tools to reconcile and clean up resources after leaving the page.

## Capabilities and boundaries

| Capability | Playground support |
| --- | --- |
| Create, list, pause, resume, extend timeout, delete | Available; mutation controls apply only to instances created in this page session |
| Commands and text files | Available; commands run for up to 25 seconds, with file editing limited to `/tmp/` and 32 KiB |
| Lifecycle events, logs, metrics, machine time | Availability varies by environment; inspect the returned results |
| AI chat and conversation context | Not integrated; requires model configuration and an Agent workload |
| PTY, application ports, webhooks, template builds | Not available in this interface |
| Snapshots and fork | Not available in this Playground |

Shell interaction is not AI chat. Instance recovery, file persistence, process survival, and conversation continuity are separate things to verify.

## Understanding events

**Sandbox lifecycle** entries are native server events fetched on refresh and may arrive with a delay. **Sandbox process** entries describe process starts and streamed output. **Playground** entries record local request completion or failure; they are not service lifecycle events.

An empty list does not prove zero usage, and missing events do not prove an operation failed. Machine-time evidence is not a final bill. Reconcile instances after a timeout or interrupted connection before trying another create request.

## Template visibility

Templates can be public or private to your organization. Counts are not fixed. Entries without names remain visible, with aliases or IDs used as fallback labels. Your organization’s access and template availability determine which templates you can see and use.
