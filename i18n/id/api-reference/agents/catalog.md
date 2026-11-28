---
i18nSource: 1b5099685e9df6ce
title: Katalog Agent
description: Jelajahi Agents publik dan clone salah satunya ke organisasi Anda.
---

# Katalog Agent {#agent-catalog}

Katalog mencantumkan Agents yang dipublikasikan SandBase untuk digunakan ulang. Entri katalog bersifat hanya-baca. Clone salah satunya untuk mendapatkan Agent privat di organisasi Anda yang dapat Anda edit, jalankan, dan deploy.

| Metode | Path | Tujuan |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Mencantumkan Agents publik |
| `GET` | `/v1/agents/catalog/{agent_id}` | Mendapatkan satu Agent publik, opsional pada `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Menyalinnya ke organisasi Anda |

## Mencantumkan Agents katalog {#list-catalog-agents}

Paginasi cursor dengan `limit` (1-100), `after`, dan `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Setiap entri memiliki `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at`, dan `updated_at`.

## Mendapatkan Agent katalog {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` bersifat opsional dan harus berupa bilangan bulat positif. Respons detail menambahkan objek `configuration` hanya-baca (nama, deskripsi, model, instruksi, profil runtime, metadata, tools, teks, reasoning, dan Skills).

## Meng-clone Agent katalog {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

Body menerima `version` opsional (bilangan bulat positif, default ke versi publik saat ini) dan `name` (hingga 128 karakter). Responsnya adalah `201 Created` dengan [objek Agent](./create) lengkap yang memiliki ID `agt_` baru di organisasi Anda. `Idempotency-Key` bersifat opsional; kirim key yang stabil agar percobaan ulang tidak membuat salinan kedua.

Setelah meng-clone, [buat Session](/api-reference/sessions/create) untuk mengujinya.
