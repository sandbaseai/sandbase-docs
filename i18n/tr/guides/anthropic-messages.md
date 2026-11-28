---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: SandBase ile Anthropic uyumlu mesajları, içerik bloklarını, araçları, düşünmeyi ve akışı kullanın.
---

# Anthropic Messages {#anthropic-messages}

SandBase, `POST /v1/messages` adresinde Anthropic uyumlu bir uç nokta sunar. Anthropic SDK uygulamaları API anahtarını ve temel URL'yi değiştirerek bağlanabilir.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## Kimlik doğrulama ve sürüm başlıkları {#authentication-and-version-headers}

`x-api-key` veya `Authorization: Bearer …` kullanın. İkisi birlikte sağlandığında `x-api-key` önceliklidir. İsteğe bağlı `anthropic-version` başlığı üst akışa iletilir ve atlandığında varsayılan olarak `2023-06-01` kullanılır. İsteğe bağlı `anthropic-beta` değerleri de sağlayıcı uyumluluğuna bağlı olarak iletilir.

## Mesajlar ve içerik blokları {#messages-and-content-blocks}

Mesajlar `user` ve `assistant` rollerini kullanır. Sistem talimatını üst düzey `system` alanına yazın. İçerik düz metin veya `text`, `image`, `tool_use` ve `tool_result` gibi türlendirilmiş bloklardan oluşan bir dizi olabilir.

## Araçlar ve genişletilmiş düşünme {#tools-and-extended-thinking}

Araç tanımlarını `tools` içine ekleyin ve seçimi `tool_choice` ile denetleyin. Seçilen model destekliyorsa genişletilmiş akıl yürütmeyi `thinking` ile yapılandırın; konuşmaya devam ederken döndürülen thinking bloklarını koruyun.

## Akış {#streaming}

`message_start`, içerik bloğu olayları, `message_delta` ve `message_stop` dahil Anthropic tarzı SSE olaylarını almak için `stream: true` ayarlayın. SandBase ayrıca keepalive ve sağlayıcı tanımlı beta olaylarını da iletir. İstemciler ileriye dönük uyumluluk için bilinmeyen olay türlerini yok saymalı ve protokol düzeyindeki `error` olaylarını işlemelidir.

## Uyumluluk {#compatibility}

SandBase, herkese açık model adını seçilen sağlayıcıya eşler. Sağlayıcının desteklenmeyen bir alanı kaldıran veya adayı reddeden açık bir uyumluluk kuralı yoksa diğer uyumlu istek alanları ve yanıt baytları korunur. Sağlayıcıya özgü beta özellikleri her modelde kullanılamayabilir. Eksiksiz istek ve yanıt şeması için [Anthropic Message Oluşturma](/api-reference/anthropic-compat) sayfasına bakın.
