# Contributing to SandBase Docs

Thanks for helping improve the SandBase developer documentation. Small fixes,
clarifications, examples, and translations are welcome.

## Before you start

1. Search existing issues and pull requests to avoid duplicate work.
2. For a larger change, open an issue describing the reader problem and the
   proposed solution.
3. Never commit API keys, private URLs, customer data, or generated secrets.

## Local workflow

```bash
npm ci
npm run build
```

Run the build before opening a pull request. Keep links relative where the
page is inside this repository, and use the live documentation or API
reference as the source of truth for changing model and endpoint details.

## Translations

English pages are the source. Each page is also published in 16 other
languages at `/docs/<locale>/...` (the list is in `.vitepress/i18n/locales.mjs`).
Translations live in `i18n/<locale>/`, mirroring the English paths, and
interface labels live in `i18n/<locale>/ui.json`. A page without a translation
shows the English text with a notice, and is left out of the sitemap.

After editing English pages, refresh the translations of changed pages:

```bash
I18N_API_KEY=... I18N_MODEL=<model-id> npm run i18n:translate -- --pages guides/streaming.md
```

To translate without an API, export work files, translate
`.i18n-work/source/` into `.i18n-work/<locale>/` by hand (rules in
`scripts/i18n/TRANSLATION-INSTRUCTIONS.md`), then check and import them:

```bash
node scripts/i18n/workfiles.mjs export
node scripts/i18n/workfiles.mjs check --locales ja
node scripts/i18n/workfiles.mjs import --locales ja
```

The script skips pages whose English source is unchanged (`--force`
overrides this), keeps code blocks verbatim, and keeps English heading
anchors. Use `--dry-run` to see what would be translated. To fix a
translation by hand, edit the file in `i18n/<locale>/`; it is kept until the
English page changes again.

## Pull requests

- Explain the reader problem and list the pages changed.
- Include screenshots for meaningful layout changes.
- Keep one focused change per pull request.
- Confirm that checks pass and that examples do not expose credentials.

Maintainers may request edits for accuracy, accessibility, or consistency with
the published site. By contributing, you agree that your work is licensed
under this repository's [Apache-2.0 license](LICENSE).
