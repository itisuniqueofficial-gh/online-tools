# Contributing

Thank you for considering a contribution to Online Tools — Free Web Utilities.

## Scope

This repository focuses on browser-based web utilities, SEO metadata, static-site generation, and Cloudflare Pages deployment support.

Accepted contribution types include:

- Bug fixes for existing tools
- Documentation improvements
- SEO metadata corrections
- Accessibility improvements
- Safe frontend dependency updates
- New utilities that fit the project structure

## Local Setup

```bash
git clone https://github.com/itisuniqueofficial-gh/online-tools.git
cd online-tools
npm install
npm run dev
```

The site will be available at:

```text
http://localhost:8080/
```

## Development Guidelines

- Keep changes small and focused.
- Do not change website design unless the issue specifically requires it.
- Do not change tool algorithms unless the change fixes a documented bug.
- Keep metadata accurate and specific to each tool.
- Prefer updates through `seo-rebrand.mjs` when changing generated SEO output.
- Do not commit secrets, credentials, API keys, private files, or local environment files.

## Validation

Run syntax checks:

```bash
npm run validate
```

Regenerate static SEO output when needed:

```bash
npm run build
```

Use local preview to verify important pages:

```bash
npm run dev
```

## Pull Requests

Before opening a pull request:

- Explain the reason for the change.
- Link related issues when applicable.
- Include testing notes.
- Include screenshots if the UI changes.
- Confirm that generated files are updated when required.

## Reporting Issues

Use the bug report template for defects and include reproduction steps, browser/device details, expected behavior, and actual behavior.
