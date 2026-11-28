---
i18nSource: 28b1ef75a197824a
title: AI tools कनेक्ट करें
description: एक prompt या एक CLI command से Claude Code, Codex, Cursor, Kiro और दूसरे AI tools को Models और APIs का SandBase catalog दें।
---

# AI tools कनेक्ट करें {#connect-ai-tools}

Console का [AI tools](https://www.sandbase.ai/console/setup) पेज (**Build → AI tools**) SandBase को उस agent या AI tool से जोड़ता है जिसे आप पहले से इस्तेमाल करते हैं। कनेक्ट किए गए tools, Models और APIs के SandBase catalog में खोज सकते हैं, हर tool का input schema और कीमत पढ़ सकते हैं, और उसे run कर सकते हैं। हर call का बिल active workspace को जाता है।

सपोर्टेड clients में Claude Code, Codex, Cursor, Kiro IDE और Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop और ChatGPT शामिल हैं। AI tools पेज पर मौजूदा सूची दी गई है।

## Quick start: एक prompt paste करें {#quick-start-paste-one-prompt}

यह पंक्ति अपने agent में paste करें:

```text
set up https://www.sandbase.ai/SKILL.md
```

Agent, SandBase Skill पढ़ता है, CLI install करता है, और आपसे एक browser sign-in को मंज़ूरी देने को कहता है। आपको API key paste नहीं करनी पड़ती। जब agent बताए कि client कॉन्फ़िगर हो गया है, तो नया session शुरू करें या app restart करें ताकि `sandbase_*` tools load हो जाएं।

Skill के लिए agent चलाने वाली मशीन पर Node.js 20 या नया version चाहिए।

## कनेक्ट करने के दूसरे तरीके {#other-ways-to-connect}

### CLI {#cli}

Terminal से कनेक्ट करें। `--client` के बिना CLI उन सभी सपोर्टेड clients को कॉन्फ़िगर करता है जो उसे मिलते हैं:

```sh
npx -y @sandbaseai/cli@latest connect
```

किसी एक client को कॉन्फ़िगर करने के लिए उसका id दें, जैसे `codex`, `claude-code`, `cursor` या `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

Installer script भी यही command चलाती है:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Local configuration बदले बिना installer द्वारा पहचाने जाने वाले clients की सूची देखने के लिए:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` browser authorization खोलता है, आपके मंज़ूर किए गए workspace के लिए एक **CLI Login** key बनाता है, और सिर्फ़ SandBase की client configuration लिखता है। Open-source [SandBase CLI](https://github.com/sandbaseai/cli) हर client को document करता है।

### खुद कॉन्फ़िगर किए जाने वाले MCP clients {#mcp-clients-you-configure-by-hand}

साइन इन किए हुए users को [AI tools](https://www.sandbase.ai/console/setup) पेज पर **Other ways to connect** में MCP server address दिखता है। **Developer → API Keys** से मिली [API key](/getting-started/api-keys) से इसे authenticate करें, और key को client की secret configuration में रखें।

## Connection की पुष्टि करें {#verify-the-connection}

सिर्फ़ installation या authorization से यह साबित नहीं होता कि client कनेक्ट है। पुष्टि करें कि:

- SandBase server या connector client में दिख रहा है
- नए session में `sandbase_*` tools खोजे जा सकते हैं
- एक सुरक्षित natural-language request सफलतापूर्वक पूरा होता है

CLI से मैनेज किए जाने वाले clients के लिए, फिर से कनेक्ट करने या configuration बदलने के बाद diagnostic चलाएं:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` local credential, MCP entry और Skill जांचता है, फिर SandBase तक एक round trip करता है। आख़िरी tool call हमेशा client के अंदर ही करें।

कनेक्ट किए गए tools के runs अपनी लागत के साथ [Activities](https://www.sandbase.ai/console/activities) में दिखते हैं।

## समस्या निवारण {#troubleshooting}

| समस्या | क्या जांचें |
|---|---|
| Tools नहीं दिखते | नया client session शुरू करें या app restart करें, `npx -y @sandbaseai/cli doctor --client <client>` चलाएं, और फिर कोशिश करें। |
| Authorization नहीं है | `connect` फिर से चलाएं और जिस workspace को बिल करना है उसके लिए browser sign-in मंज़ूर करें। |
| Calls HTTP 402 के साथ विफल होती हैं | Active workspace के लिए [Billing](https://www.sandbase.ai/console/billing) में क्रेडिट जोड़ें। |

## मैनेज की गई configuration हटाएं {#remove-the-managed-configuration}

किसी एक client के लिए सिर्फ़ SandBase की entry हटाएं:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

यह command सिर्फ़ वही configuration हटाता है जिसके SandBase के होने की वह पुष्टि कर सके, और असंबंधित या user द्वारा मैनेज की गई entries को नहीं बदलता। इसके बाद, अगर ज़रूरत न हो, तो **Developer → API Keys** में संबंधित **CLI Login** key revoke करें।

## Source और support {#source-and-support}

- [Source code](https://github.com/sandbaseai/cli)
- [npm package](https://www.npmjs.com/package/@sandbaseai/cli)
- [सवाल और उदाहरण](https://github.com/sandbaseai/cli/discussions)
- [Bug reports](https://github.com/sandbaseai/cli/issues/new/choose)

## अगले कदम {#next-steps}

- [Models और APIs catalog](https://www.sandbase.ai/models)
- [Skill tutorials](/guides/skills/)
- [Build Agent](/agents/)
