---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Sürümlü Skill paketleri yükleyin ve bunları Agents'a ekleyin.
---

# Skills API {#skills-api}

Skill, bir Agent'ın bağlayabileceği talimat ve kaynaklardan oluşan sürümlü bir ZIP paketidir. Skill kimlikleri `skl_` önekini kullanır; sürüm tanımlayıcıları `"1"` gibi dizelerdir.

## Skill işlemleri {#skill-operations}

| Yöntem | Yol | Amaç |
|---|---|---|
| `POST` | `/v1/skills` | ZIP yüklemesinden [Skill oluşturma](./create) |
| `GET` | `/v1/skills` | [Skills'leri listeleme](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Skill alma](./get) |
| `POST` | `/v1/skills/{skill_id}` | Varsayılan sürümü, durumu veya meta verileri [güncelleme](./update) |
| `DELETE` | `/v1/skills/{skill_id}` | [Skill silme](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Varsayılan sürümün ZIP dosyasını indirme |
| `GET` | `/v1/skills/{skill_id}/versions` | [Sürümleri listeleme](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Sürüm yükleme](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Sürüm alma](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Bir sürümün ZIP dosyasını indirme |
| `GET` | `/v1/skills/catalog` | [Herkese açık Skills'lere göz atma](./catalog) |

## Beş dakikada kurulum {#five-minute-setup}

1. Ön bilgisinde (frontmatter) `name` ve `description` ayarlanan bir `SKILL.md` içeren bir klasör oluşturun:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Klasörü sıkıştırın (`zip -r release-notes.zip release-notes/`). Arşiv en fazla 5 MiB olabilir.
3. Arşivi tek multipart parçası `files` olarak yükleyin:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. [Agent Güncelleme](/api-reference/agents/update) ile bir Agent'tan ona başvurun:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Bir Skill ilk kez eklenirken `"version": null` (veya atlanmış bir `version`), Agent kaydedildiğinde Skill'in geçerli `default_version` değerine çözümlenir. Kaydedilen Agent açık bir sürüm içerir. Skill varsayılanını değiştirmek mevcut bir Agent'ı yükseltmez. Yükseltmek için Agent'ın `skills` dizisini `"2"` gibi açık bir sürümle güncelleyin; mevcut bir bağlama için `null` göndermek sabitlenmiş sürümü korur. Her Session kayıtlı Agent sürümünü kullanır ve çözümlenen Skills'leri `environment.skills` içinde bildirir.

Bir Agent en fazla 32 Skill destekler. Skill kimlikleri ve Skill adları seçim içinde benzersiz olmalıdır.

## Sürümler {#versions}

- `POST /v1/skills/{skill_id}/versions` uç noktasına yükleme yapmak bir sonraki sürümü ekler. Varsayılan yapmak için `default=true` form alanını gönderin.
- `default_version` ile `POST /v1/skills/{skill_id}`, yükleme yapmadan varsayılanı değiştirir.
- `status`, `active` veya `disabled` olur. Devre dışı bir Skill'e başvuran bir Agent'ın yeni Sessions'ları `400 skill_not_found` ile başarısız olur; bir sürümü zaten dondurmuş Sessions o sürümü korur.
- Herhangi bir Agent sürümünün başvurduğu bir Skill silinemez (409). Bunun yerine devre dışı bırakın. Skill'i en son Agent sürümünden kaldırmak geçmiş sürümlerdeki referansları kaldırmaz.

## Sayfalama ve hatalar {#pagination-and-errors}

Listeler `limit` 0-100, `after` ve `order` ile imleç tabanlı sayfalama kullanır. Hatalar [Agents hata zarfını](/api-reference/errors#agents-platform-errors) kullanır.

## Paket indirme {#download-a-bundle}

İçerik uç noktaları JSON değil `application/zip` döndürür. Yanıtı bir dosyaya kaydedin:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Geçerli varsayılan sürüm için `/v1/skills/{skill_id}/content` kullanın. Herkese açık katalog paketleri için `/v1/skills/catalog/{skill_id}/versions/{version}/content` kullanın.

Sürüm listeleri, Skill listeleriyle aynı imleç parametrelerini kullanır. Döndürülen `last_id` değerini (örneğin `skl_…:2`) `after` olarak gönderin; yalın sürüm numarasını göndermeyin.
