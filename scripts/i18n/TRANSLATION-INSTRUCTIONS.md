# Translation instructions for SandBase docs work files

You translate English work files into one target language. Root directory:
`/Users/joeliu/Project/sandbase/sandbase-docs/.i18n-work`.

## Inputs and outputs

For each line `<page>.md` in your batch file:

- Read `source/<page>.md` (Markdown body) and `source/<page>.json` (a JSON object of page title, description and API reference strings).
- Write `<LOCALE>/<page>.md` and `<LOCALE>/<page>.json` with the same paths under the locale directory (create directories as needed).

If the batch contains the line `ui.json`: read `source/ui.json`, a JSON object whose keys and values are English interface labels. Write `<LOCALE>/ui.json` with the SAME keys (keep keys in English, exactly as given) and translated values.

Write each output file with the file-writing tool. Do not modify anything outside `<LOCALE>/`. Do not run translation APIs or scripts.

## Rules for Markdown files

1. Translate all prose: paragraphs, headings, list items, table cells, link text, blockquotes, image alt text, and custom container titles (`::: tip Title` → translate only `Title`).
2. **Keep every blank line of the source.** Blank lines separate Markdown blocks; dropping them merges headings, lists and tables into one paragraph and breaks the page. The simplest safe method is to translate line by line, keeping the same line breaks and blank lines as the source.
3. Keep the structure identical: same number and order of headings at the same levels, same lists, tables (same number of columns and rows), blank lines, indentation, and `:::` container lines with their type keyword (`tip`, `info`, `warning`, `danger`, `details`, `code-group`).
4. Lines like `<!--sb-keep-12-->` are placeholders for code. Copy every placeholder exactly once, unchanged, with the same indentation, in the same position. Never add, drop, reorder or edit them.
5. Keep unchanged: inline code in backticks, URLs and link targets `](...)`, file paths, HTTP methods, status codes, header names, JSON keys, API field/parameter names, environment variables, model IDs, CLI commands, `{#anchor}` suffixes on headings, HTML tags and attributes, and `{{ ... }}` expressions.
6. Keep these names in English: SandBase, Agent, Agents, Skill, Skills, MCP, Sandbox, E2B, Lab, Console, Playground, and vendor/model names (OpenAI, Anthropic, Gemini, Claude, GPT, DeepSeek, Qwen, Kling, Seedance, Wan, Veo, Nano Banana, GitHub, Cursor, Codex, Claude Code).
7. Write natural, concise technical prose for developers, the way an experienced local technical writer would. Translate the meaning; do not add or drop information, notes, or commentary.
8. Output only the translated Markdown. No wrapper code fence, no notes.

## Rules for JSON files

- Same keys, translated string values, valid JSON (escape quotes properly).
- Keep `{placeholder}` tokens such as `{id}`, `{error}`, `{language}` unchanged.
- Keep symbols such as →, ↗, ✓, …, · and the rules in items 5 and 6 above.
- Interface labels should be short, like real UI text in that language.

## Finish

After writing all files of your batch, run the checker from `/Users/joeliu/Project/sandbase/sandbase-docs`:

```bash
node scripts/i18n/workfiles.mjs check --locales <LOCALE> --batch <your batch file>
```

It reports missing files, missing JSON strings, lost blank lines, changed placeholders and changed headings. Fix every reported file (rewrite it from the source) and run the checker again until it reports `0` failures (it prints nothing after `Checked N pages`). This command only reads files; do not run any other script. Then reply with one line: `done <count> files` or the files you could not fix.
