---
i18nSource: 258f8ff4bb1ed96f
title: Organizasyonlar
description: SandBase'de organizasyonları, üyeleri ve rolleri yönetin.
---

# Organizasyonlar {#organizations}

Organizasyonlar, SandBase'de faturalandırma ve erişim denetimi birimidir. API anahtarları, bakiye, kullanım ve üyelerin tümü bir organizasyona aittir.

## Organizasyon Türleri {#organization-types}

| Tür | Açıklama |
|------|-------------|
| **Personal** | İlk girişte otomatik oluşturulur. Kullanıcı başına bir tane. |
| **Team** | Elle oluşturulur. Rollere sahip birden fazla üye. |

## Üye Rolleri {#member-roles}

| Rol | İzinler |
|------|-------------|
| **Owner** | Üye rollerini değiştirme dahil tam çalışma alanı erişimi. |
| **Admin** | Anahtarları ve faturalandırmayı yönetir, sahip olmayan üyeleri ekleyip çıkarır. |
| **Member** | Çalışma alanını ve API anahtarlarını kullanır, üye yönetimi erişimi yoktur. |

## Team Organizasyonu Oluşturma {#create-a-team-organization}

1. Console'un sağ üst köşesindeki hesap menüsünü açın.
2. **Create Team** seçeneğini seçin veya **Developer → Team** sayfasını açıp **Create team** seçeneğini seçin.
3. Bir **Team name** girin, ardından **Create team** seçeneğini seçin.
4. **Add member** seçeneğini seçin, mevcut bir SandBase hesabının **Account email** değerini girin ve bir **Workspace role** seçin: **Member** veya **Admin**.

Eklenen üyenin önceden bir SandBase hesabı olmalıdır. Sahipler üye rollerini değiştirebilir; sahipler ve yöneticiler
sahip olmayan üyeleri kaldırabilir.

## Organizasyonlar Arasında Geçiş {#switch-organizations}

Birden fazla organizasyona üyeyseniz hesap menüsünden aralarında geçiş yapın veya **Developer → Team** sayfasındaki **Switch workspace** şeridini kullanın. API anahtarlarınız ve faturalandırmanız etkin organizasyonla sınırlıdır.

## Bakiye ve faturalandırma {#balance-and-billing}

Her organizasyonun kendi bakiyesi vardır. Model çağrıları, API çağrıları, Agent Sessions ve çalışma zamanı işleri bu bakiyeden ücretlendirilir. Ayrıntılar için [Faturalandırma](/admin/billing) sayfasına bakın.
