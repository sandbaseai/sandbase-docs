---
i18nSource: 417ea5dc930a8786
title: Skills ve MCP araçları
description: Bir SandBase Agent'ına yeniden kullanılabilir Skills ve uzak MCP araçları verin; her Session'ın hangi sürümleri ve araçları kullanacağını denetleyin.
---

# Skills ve MCP araçları {#skills-and-mcp-tools}

Bir Agent yetenekleri iki yolla kazanır:

- **Skills**, Agent'a bir işi nasıl yapacağını öğretir. Bir Skill, talimatlar ve kaynaklardan oluşan sürümlü bir ZIP paketidir.
- **MCP bağlantıları**, Agent'ın HTTPS üzerinden uzak bir MCP sunucusundaki araçları çağırmasını sağlar; isteğe bağlı olarak bir [Secret](/agents/api-credentials) ile kimlik doğrulanır.

En kullanışlı Agent'lar ikisini birleştirir: bir MCP sunucusu veri getirir veya işlem yapar, bir Skill ise sonuçların nasıl kullanılacağını anlatır.

## Skills {#skills}

1. `name` ve `description` frontmatter alanlarına sahip `SKILL.md` içeren bir klasörü paketleyin ve klasörün kendisini zipleyin (`zip -r release-notes.zip release-notes/`, en fazla 5 MiB). ZIP'in en üst düzeyinde bu klasör bulunmalıdır; ZIP kökündeki bir `SKILL.md` `400 invalid_request` döndürür.
2. Paketi `POST /v1/skills` ile `files` multipart alanı olarak yükleyin. Yanıt bir `skl_` kimliği ve `default_version: "1"` içerir.
3. Skill'e Agent'ın `skills` dizisinde referans verin.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- İlk eklemede `"version": null`, Agent kaydedildiğinde Skill'in geçerli `default_version` değerine çözümlenir. `"2"` gibi bir metin o sürümü açıkça seçer.
- Kaydedilen Agent sürümü sabitler. Skill varsayılanını değiştirmek mevcut Agent'ları veya onların yeni Session'larını yükseltmez. Yükseltmek için Agent'ı açık bir sürümle güncelleyin; mevcut bir bağlama için `null` göndermek sabitlenmiş sürümü korur.
- Yeni bir sürümü `POST /v1/skills/{skill_id}/versions` ile yükleyin ve varsayılanı `default=true` veya `POST /v1/skills/{skill_id}` ile değiştirin.
- Devre dışı bırakılmış bir Skill, ona referans veren Agent'ların yeni Session'larının `400 skill_not_found` ile başarısız olmasına neden olur.

Herkese açık Skills'e [Skills kataloğunda](/api-reference/skills/catalog) da göz atabilirsiniz. Adım adım anlatımın tamamı için [Skills API](/api-reference/skills/) sayfasına bakın.

## Yerleşik SandBase araçları {#built-in-sandbase-tools}

Her yeni Agent, kurulum gerektirmeden SandBase'in kendi araçlarını kullanabilir. Agent, `sandbase_discover`, `sandbase_inspect` ve `sandbase_run` ile katalogda bir model veya API bulur, şemasını ve fiyatını okur ve onu sizin anahtarınızla çağırır. Oluşturma sırasında `mcp_connections` alanını atlarsanız Agent şu varsayılanı alır:

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **Gönderdiğiniz liste varsayılanın yerini alır.** Kendi MCP sunucunuzu ekleyip SandBase araçlarını korumak için yerleşik girdiyi listenize dahil edin.
- **`builtin:sandbase`, `server_label: "sandbase_builtin"` gerektirir.** Başka herhangi bir etiket veya bu etiketin başka bir bağlantıda kullanılması `400` döndürür.
- **Araçsız bir Agent oluşturmak için** `"mcp_connections": []` gönderin.
- **Yerleşik araçlar ücretsizdir.** Yalnızca Agent'ın bu araçlar aracılığıyla çağırdığı modeller ve API'ler için ödeme yaparsınız.

## MCP bağlantıları {#mcp-connections}

1. MCP sunucusu bir Bearer token gerektiriyorsa, tam URL'si için [bir Secret oluşturun](/agents/api-credentials).
2. Sunucuyu `POST /v1/mcp-connections` ile kaydedin:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Bağlantıya Agent'ın `mcp_connections` dizisinde referans verin:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Alan | Anlamı |
|---|---|
| `connection_id` | Kuruluşunuzdaki `mcp_` bağlantı kimliği veya yerleşik SandBase sunucusu için `builtin:sandbase` |
| `server_label` | Bir harfle başlar; harfler, rakamlar, `_` ve `-`; en fazla 64 karakter; Agent içinde benzersiz |
| `allowed_tools` | Atlanırsa veya `null` olursa sunucunun sunduğu tüm araçlara izin verir; `[]` hiçbirine izin vermez; bir liste yalnızca o adlara izin verir (en fazla 256 ad, her biri boş olmayan ve en fazla 128 bayt) |
| `required` | Session'ın bu sunucuyu yüklemesinin zorunlu olup olmadığı |

Bir Agent en fazla 32 bağlantıya referans verebilir. Kuruluş bağlantıları, bir Session başladığında `active` durumda olmalıdır.

### Yerleşik SandBase araçları {#built-in-sandbase-tools-1}

`mcp_connections` olmadan Agent oluşturmak yerleşik SandBase sunucusunu seçer. Bunu kendi sunucunuzla birlikte açıkça korumak için diziye şu girdiyi ekleyin:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Açık bir dizi seçimin tamamının yerini alır; yukarıdaki yalnızca özel sunucu içeren örnek yerleşik sunucuyu hariç tutar. Tüm MCP araçlarını devre dışı bırakmak için `[]` gönderin. Agent güncellemesinde alanı atlamak mevcut seçimi korur; `null` ise `400` döndürür. Yerleşik girdi, MCP bağlantısı veya Secret oluşturmayı gerektirmez. Kullanımdan kaldırılmış `use_sandbase_mcp` alanını göndermeyin.

::: info OpenAI'dan farkı
OpenAI'ın Agents API'si MCP sunucularını satır içinde `tools: [{"type": "mcp", ...}]` olarak tanımlar. SandBase bu biçim için `400` döndürür: sunucuyu bir bağlantı kaynağı olarak kaydedin ve ona `mcp_connections` içinde referans verin. OpenAI SDK'sında `/v1/mcp-connections` veya `/v1/secrets` için yöntem yoktur; bu nedenle bunları `client.post(...)` ile çağırın ve `mcp_connections` değerini `extra_body` (Python) veya istek gövdesi (Node.js) üzerinden iletin. Bkz. [OpenAI uyumluluğu](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Değişiklikler ve çalışan Session'lar {#changes-and-running-sessions}

Her Session başladığında Agent sürümünü, Skill sürümlerini ve MCP bağlantı yapılandırmasını dondurur.

- Bir bağlantıyı değiştirdikten veya Secret'ını yeniledikten sonra yeni Session'lar yeni yapılandırmayı kullanır; mevcut Session'lar kendi anlık görüntülerini korur.
- Bir bağlantıyı devre dışı bırakmak veya Secret'ını iptal etmek yeni Session'ları engeller ve onu kullanan mevcut Session'lara yapılacak sonraki girdileri reddeder. Hâlihazırda çalışan bir araç çağrısı kesintiye uğramaz.

## Token'ları istemlerin dışında tutun {#keep-tokens-out-of-prompts}

Token'ları Secret olarak saklayın. Bunları talimatlara, Session girdisine, metadata'ya veya Skill paketlerine koymayın: bunlar Agent'a veya Session'a erişimi olan herkes tarafından okunabilir.

## Sonraki adımlar {#next-steps}

- [MCP araçları için kimlik bilgileri](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Agent tanımlama](/agents/agent-api)
