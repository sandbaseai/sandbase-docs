---
i18nSource: e4dcecbecc736e53
title: GitHub रिपॉज़िटरी वर्कस्पेस
description: किसी GitHub repository को Session के /workspace में clone करें, Session branches पर push करें, और pull requests खोलें।
---

# GitHub रिपॉज़िटरी वर्कस्पेस {#github-repository-workspace}

एक Session ऐसे GitHub repository के साथ शुरू हो सकता है जो पहले से `/workspace` में clone किया गया हो। Agent सामान्य `git` commands से code पर काम करता है, अपने commits को Session के लिए आरक्षित branches पर push करता है, और किसी व्यक्ति की समीक्षा के लिए pull request खोल सकता है।

Repository तक SandBase के git proxy के ज़रिए पहुँचा जाता है। कोई भी GitHub token Session में नहीं जाता।

## शुरू करने से पहले {#before-you-start}

Organization administrator इसे console में एक बार सेट करता है:

1. **Console → Integrations** में GitHub connect करें और वे repositories चुनें जिनका connection इस्तेमाल कर सकता है।
2. Agent के **Integrations** section में connection को Agent को assign करें। Clone करने के लिए इस connection के लिए Agent के tools में **Read code** शामिल होना चाहिए। Push करने के लिए उनमें **Commit to a task branch** भी शामिल होना चाहिए।
3. वैकल्पिक: उस assignment पर एक **Workspace repository** और branch चुनें। तब Sessions default रूप से उसे clone करते हैं।

`repository_id` GitHub का numeric repository ID है। आप इसे `GET https://api.github.com/repos/{owner}/{repo}` (`id` field) से या `github_list_repositories` tool से पढ़ सकते हैं।

## हर Session के लिए repository चुनें {#choose-the-repository-per-session}

Session बनाते समय `github_workspace` भेजें:

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

| Field | ज़रूरी | अर्थ |
|---|---|---|
| `repository_id` | हाँ | Decimal string। Repository उस connection के लिए Agent के repository scope में होनी चाहिए। |
| `ref` | नहीं | checkout करने के लिए branch। Default रूप से repository की default branch। |
| `connection_id` | नहीं | कौन-सा GitHub connection इस्तेमाल करना है। Default रूप से वह assignment जिसमें workspace repository है, या Agent का एकमात्र GitHub connection। |

`github_workspace` वैकल्पिक है:

- न भेजा गया या `null`: Session Agent की workspace repository को clone करता है, अगर वह सेट है। अन्यथा कुछ भी clone नहीं होता और Session सामान्य रूप से शुरू होता है।
- भेजा गया: यह केवल इस Session के लिए Agent के default की जगह लेता है।

हर Session में अधिकतम एक workspace repository होती है। यह चुनाव Session बनाते समय तय हो जाता है।

## Session को क्या मिलता है {#what-the-session-gets}

- `/workspace` में `ref` का checkout, जिसमें `origin` git proxy की ओर इशारा करता है। `git fetch`, `git pull` और `git push` सामान्य रूप से काम करते हैं।
- `sandbase-agents[bot]` के नाम से लिखे गए commits।
- `SANDBASE_GIT_BRANCH_PREFIX`, उदाहरण के लिए `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`।
- `SANDBASE_WORKSPACE_REPOSITORY`, repository का `owner/name`।

## Push के नियम {#push-rules}

Agent केवल अपने prefix के अंतर्गत आने वाली branches पर push कर सकता है:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- यह उसी branch पर दोबारा push कर सकता है, उस branch पर भी जिसका pull request पहले से खुला है।
- default branch, अन्य branches, अन्य Sessions के prefixes और tags पर push GitHub तक पहुँचने से पहले ही अस्वीकार कर दिए जाते हैं। Git `sandbase: only agents/<session>/* branches can be pushed` दिखाता है।
- Proxy GitHub Actions workflow files नहीं बदल सकता।

केवल वही branch Session की branch मानी जाती है जिसे Session ने push किया हो। `github_open_pull_request` tool उसे स्वीकार करता है, और वह connection भी जिसका merge scope managed branches तक सीमित है।

## Permissions connection के अनुसार चलती हैं {#permissions-follow-the-connection}

हर git request को Agent के मौजूदा assignment और connection की मौजूदा policy के आधार पर जाँचा जाता है।

- अगर administrator repository scope को सीमित करता है, तो अगला fetch या push अस्वीकार कर दिया जाता है।
- अगर administrator **Commit to a task branch** हटा देता है, तो अगला push अस्वीकार कर दिया जाता है।
- अगर administrator connection revoke कर देता है, तो अगला fetch या push अस्वीकार कर दिया जाता है।

हर Session प्रति मिनट अधिकतम 120 git requests कर सकता है।

## त्रुटियाँ {#errors}

| Response | कारण |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` decimal string नहीं है, `ref` एक सादा branch name नहीं है, Agent के पास कोई GitHub connection नहीं है, या repository की default branch का नाम समर्थित नहीं है (`ref` स्पष्ट रूप से सेट करें)। |
| `400 invalid_request` | Agent के पास कई GitHub connections हैं और उनमें से किसी में workspace repository नहीं है। `connection_id` भेजें। |
| `403 insufficient_scope` | Repository या connection Agent के scope से बाहर है, या Agent के tools में **Read code** शामिल नहीं है। |

## अगले कदम {#next-steps}

- [Sessions चलाएँ](/agents/sessions)
- [Create Session API reference](/api-reference/sessions/create)
