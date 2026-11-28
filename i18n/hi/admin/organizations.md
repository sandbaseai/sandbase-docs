---
i18nSource: 258f8ff4bb1ed96f
title: संगठन
description: SandBase पर organizations, members और roles मैनेज करें।
---

# संगठन {#organizations}

Organization, SandBase में billing और access control की इकाई है। API keys, balance, usage और members, सभी किसी organization से जुड़े होते हैं।

## Organization के प्रकार {#organization-types}

| प्रकार | विवरण |
|------|-------------|
| **Personal** | पहली बार login करने पर अपने-आप बनता है। हर user का एक। |
| **Team** | मैन्युअल रूप से बनाया जाता है। roles के साथ कई members। |

## सदस्य भूमिकाएँ {#member-roles}

| Role | अनुमतियाँ |
|------|-------------|
| **Owner** | workspace का पूरा access, जिसमें member roles बदलना भी शामिल है। |
| **Admin** | keys और billing मैनेज करना, और non-owner members को जोड़ना या हटाना। |
| **Member** | workspace और उसकी API keys का उपयोग, member-management access के बिना। |

## Team organization बनाएँ {#create-a-team-organization}

1. Console में ऊपर दाईं ओर account menu खोलें।
2. **Create Team** चुनें, या **Developer → Team** खोलकर **Create team** चुनें।
3. **Team name** दर्ज करें, फिर **Create team** चुनें।
4. **Add member** चुनें, किसी मौजूदा SandBase account का **Account email** दर्ज करें, और **Workspace role** चुनें: **Member** या **Admin**।

जोड़े जाने वाले member के पास पहले से SandBase account होना चाहिए। Owners member roles बदल सकते हैं; owners और admins
non-owner members को हटा सकते हैं।

## Organization बदलें {#switch-organizations}

यदि आप कई organizations के सदस्य हैं, तो account menu में उनके बीच स्विच करें, या **Developer → Team** पर **Switch workspace** strip का उपयोग करें। आपकी API keys और billing सक्रिय organization तक सीमित होती हैं।

## Balance और billing {#balance-and-billing}

हर organization का अपना balance होता है। Model calls, API calls, Agent Sessions और runtime work का शुल्क इसी balance से कटता है। विवरण के लिए [Billing](/admin/billing) देखें।

