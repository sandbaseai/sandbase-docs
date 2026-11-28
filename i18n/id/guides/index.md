---
i18nSource: c922bd433deabf32
title: Panduan
description: Panduan praktis untuk menggunakan SandBase Models, APIs, Agents, Setup, penagihan, streaming, dan keandalan produksi.
---

# Panduan {#guides}

Panduan ini membahas pola umum penggunaan SandBase di produksi.

## Memanggil model {#call-models}
| Panduan | Deskripsi |
|-------|-------------|
| [Chat Completions](./chat-completions) | Panggil SandBase melalui protokol chat yang kompatibel dengan OpenAI |
| [OpenAI Responses](./openai-responses) | Panggil model GPT melalui protokol Responses yang kompatibel dengan OpenAI |
| [Anthropic Messages](./anthropic-messages) | Panggil SandBase melalui protokol messages yang kompatibel dengan Anthropic |
| [Google Gemini](../api-reference/gemini-generate-content) | Panggil SandBase melalui protokol GenerateContent yang kompatibel dengan Google Gemini |
| [Gambar dan video](./image-video) | Buat gambar dan video melalui Run API asinkron bersama |
| [Streaming](./streaming) | Streaming output Model yang kompatibel ke aplikasi Anda |
| [Katalog API](https://www.sandbase.ai/apis) | Jelajahi kemampuan API dan endpoint berkualifikasi vendor |

## Menjalankan di produksi {#run-in-production}
| Panduan | Deskripsi |
|-------|-------------|
| [Error dan percobaan ulang](./error-handling) | Klasifikasikan kegagalan dan coba ulang hanya jika operasi aman untuk diulang |
| [Batas rate](./rate-limiting) | Tangani respons 429 dan ratakan lonjakan permintaan |
| [Batas konkurensi](./concurrency-limits) | Berapa banyak tugas yang dapat dijalankan organisasi Anda sekaligus |
| [Harga dan penggunaan](./billing) | Pahami kredit, penggunaan, dan kontrol biaya |

## Tips Singkat {#quick-tips}

- Gunakan [Setup](/setup/) jika pengguna menginginkan tool di dalam Codex, Claude, Cursor, atau Kiro.
- Gunakan [Models](https://www.sandbase.ai/models) atau [APIs](https://www.sandbase.ai/apis) jika aplikasi Anda membutuhkan satu kemampuan.
- Gunakan [Build Agent](/agents/) jika pekerjaan memiliki beberapa langkah atau perlu digunakan ulang.
- Gunakan [Activities](https://www.sandbase.ai/console/activities) di Console untuk meninjau permintaan dan penggunaan secara bersamaan.
