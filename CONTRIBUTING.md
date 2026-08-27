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

## Pull requests

- Explain the reader problem and list the pages changed.
- Include screenshots for meaningful layout changes.
- Keep one focused change per pull request.
- Confirm that checks pass and that examples do not expose credentials.

Maintainers may request edits for accuracy, accessibility, or consistency with
the published site. By contributing, you agree that your work is licensed
under this repository's [Apache-2.0 license](LICENSE).
