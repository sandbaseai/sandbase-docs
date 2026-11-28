---
i18nSource: e4dcecbecc736e53
title: Workspace repositori GitHub
description: Clone repositori GitHub ke /workspace milik Session, push ke branch Session, dan buka pull request.
---

# Workspace repositori GitHub {#github-repository-workspace}

Session dapat dimulai dengan repositori GitHub yang sudah di-clone ke `/workspace`. Agent mengerjakan kode dengan perintah `git` biasa, melakukan push commit ke branch yang dicadangkan untuk Session, dan dapat membuka pull request untuk ditinjau oleh seseorang.

Repositori diakses melalui git proxy SandBase. Tidak ada token GitHub yang masuk ke Session.

## Sebelum memulai {#before-you-start}

Administrator organisasi menyiapkan ini satu kali di console:

1. Hubungkan GitHub di **Console → Integrations** dan pilih repositori yang boleh digunakan oleh koneksi tersebut.
2. Tetapkan koneksi ke Agent di bagian **Integrations** milik Agent. Tool Agent untuk koneksi ini harus mencakup **Read code** agar dapat melakukan clone. Untuk push, tool tersebut juga harus mencakup **Commit to a task branch**.
3. Opsional: pilih **Workspace repository** dan branch pada penetapan tersebut. Session kemudian akan meng-clone-nya secara default.

`repository_id` adalah ID repositori numerik dari GitHub. Anda dapat membacanya dari `GET https://api.github.com/repos/{owner}/{repo}` (field `id`) atau dari tool `github_list_repositories`.

## Memilih repositori per Session {#choose-the-repository-per-session}

Kirim `github_workspace` saat Anda membuat Session:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: fix-login-2026-11-18" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    "github_workspace": {"repository_id": "1195090324", "ref": "main"},
    "input": "Fix the failing login test, push your change and open a pull request."
  }'
```

| Field | Wajib | Arti |
|---|---|---|
| `repository_id` | Ya | String desimal. Repositori harus berada dalam cakupan repositori Agent untuk koneksi tersebut. |
| `ref` | Tidak | Branch yang akan di-checkout. Default-nya branch default repositori. |
| `connection_id` | Tidak | Koneksi GitHub yang akan digunakan. Default-nya penetapan yang memiliki workspace repository, atau satu-satunya koneksi GitHub milik Agent. |

`github_workspace` bersifat opsional:

- Tidak dikirim atau `null`: Session meng-clone workspace repository milik Agent, jika sudah diatur. Jika tidak, tidak ada yang di-clone dan Session dimulai seperti biasa.
- Dikirim: nilai ini menggantikan default Agent hanya untuk Session ini.

Setiap Session memiliki paling banyak satu workspace repository. Pilihan ini ditetapkan saat Session dibuat.

## Yang didapat Session {#what-the-session-gets}

- Checkout `ref` di `/workspace`, dengan `origin` mengarah ke git proxy. `git fetch`, `git pull`, dan `git push` berfungsi seperti biasa.
- Commit dibuat atas nama `sandbase-agents[bot]`.
- `SANDBASE_GIT_BRANCH_PREFIX`, misalnya `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`.
- `SANDBASE_WORKSPACE_REPOSITORY`, yaitu `owner/name` repositori.

## Aturan push {#push-rules}

Agent hanya dapat melakukan push ke branch di bawah prefiksnya sendiri:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- Agent dapat melakukan push ke branch yang sama lagi, termasuk branch yang sudah memiliki pull request terbuka.
- Push ke branch default, branch lain, prefiks Session lain, dan tag ditolak sebelum mencapai GitHub. Git menampilkan `sandbase: only agents/<session>/* branches can be pushed`.
- Proxy tidak dapat mengubah file workflow GitHub Actions.

Hanya branch yang di-push oleh Session yang dianggap sebagai branch Session tersebut. Tool `github_open_pull_request` menerimanya, begitu pula koneksi yang cakupan merge-nya dibatasi ke branch terkelola.

## Izin mengikuti koneksi {#permissions-follow-the-connection}

Setiap permintaan git diperiksa terhadap penetapan Agent saat ini dan kebijakan koneksi saat ini.

- Jika administrator mempersempit cakupan repositori, fetch atau push berikutnya akan ditolak.
- Jika administrator menghapus **Commit to a task branch**, push berikutnya akan ditolak.
- Jika administrator mencabut koneksi, fetch atau push berikutnya akan ditolak.

Setiap Session dapat membuat hingga 120 permintaan git per menit.

## Error {#errors}

| Respons | Penyebab |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` bukan string desimal, `ref` bukan nama branch biasa, Agent tidak memiliki koneksi GitHub, atau nama branch default repositori tidak didukung (atur `ref` secara eksplisit). |
| `400 invalid_request` | Agent memiliki beberapa koneksi GitHub dan tidak ada yang memiliki workspace repository. Kirim `connection_id`. |
| `403 insufficient_scope` | Repositori atau koneksi berada di luar cakupan Agent, atau tool Agent tidak mencakup **Read code**. |

## Langkah berikutnya {#next-steps}

- [Menjalankan Session](/agents/sessions)
- [Referensi API Create Session](/api-reference/sessions/create)
