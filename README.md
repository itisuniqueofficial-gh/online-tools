# Online Tools — Free Web Utilities

Online Tools is a static website that provides free browser-based utilities for hashing, encoding, decoding, encryption, conversion, structured data formatting, validation, QR code generation, and developer productivity.

Live website: https://ot.itisuniqueofficial.com/

## Features

- Free web utilities that run in the browser
- Static-site output suitable for Cloudflare Pages
- SEO-optimized tool pages with canonical URLs
- JSON-LD schema for tools, FAQs, and breadcrumbs
- Clean URL copies for production routing
- Local development server with no framework dependency
- Deterministic regeneration through `seo-rebrand.mjs`
- Frontend tool dependencies stored locally under `assets/vendor/` for offline-capable tool pages

## Tool Categories

- Hash generators and file checksum tools
- Encoders and decoders for Base64, Base32, Base58, hex, URL, and HTML
- Encryption and decryption utilities
- Digital signature and key generation tools
- JSON and XML formatting, minification, validation, and viewing
- QR code generation and embedding tools
- Text case conversion tools

## Tech Stack

- HTML, CSS, and JavaScript
- Node.js for local development and static regeneration scripts
- Cloudflare Pages for static hosting
- JSON-LD structured data for SEO metadata
- Local vendored browser libraries for hashing, code editing, QR color picking, syntax highlighting, and JSON viewing

## Installation

Requirements:

- Node.js 18 or newer
- npm 9 or newer

Clone the repository:

```bash
git clone https://github.com/itisuniqueofficial-gh/online-tools.git
cd online-tools
```

Install Node dependencies if the project adds any in the future:

```bash
npm install
```

The current project does not require runtime npm dependencies. Browser libraries used by tools are committed under `assets/vendor/`.

## Local Development

Start the local static server:

```bash
npm run dev
```

Open:

```text
http://localhost:8080/
```

## Build Commands

Regenerate SEO metadata, sitemap, robots file, and clean URL copies:

```bash
npm run build
```

Validate JavaScript syntax for project scripts:

```bash
npm run validate
```

Available npm scripts:

- `npm run dev`: start the local static server on port `8080`
- `npm run start`: same as `npm run dev`
- `npm run build`: regenerate SEO metadata, canonical clean URL copies, `_redirects`, `robots.txt`, `ads.txt`, and `sitemap.xml`
- `npm run rebrand`: same as `npm run build`
- `npm run validate`: run JavaScript syntax checks for project scripts

## Local Dependencies

The site is designed so tool libraries load from local files instead of public CDNs wherever possible.

Vendored libraries:

- `assets/vendor/jquery/3.7.1/jquery.min.js`
- `assets/vendor/grapick/0.1.13/grapick.min.css` and `grapick.min.js`
- `assets/vendor/crypto-js/4.2.0/crypto-js.js`
- `assets/vendor/js-sha1/0.7.0/sha1.min.js`
- `assets/vendor/js-sha256/0.11.0/sha256.min.js`
- `assets/vendor/js-sha512/0.9.0/sha512.min.js`
- `assets/vendor/js-sha3/0.9.3/sha3.min.js`
- `assets/vendor/highlight.js/11.11.1/` for syntax highlighting and styles
- `assets/vendor/tinyColorPicker/1.1.1/` for QR color controls
- `assets/vendor/monaco-editor/0.55.1/` for optional rich code editing
- `assets/vendor/crypto-api/latest/crypto-api.min.js` for MD2 and RIPEMD tools
- `assets/vendor/json-viewer/iife/index.js` for JSON viewer output

Analytics scripts for Google Analytics and Google Tag Manager remain external production services. Tool functionality does not depend on them.

## Cloudflare Pages Deployment

Use these settings in Cloudflare Pages:

- Production branch: `master`
- Build command: `npm run build`
- Build output directory: `/`
- Node.js version: `18` or newer

Deployment steps:

1. Connect the GitHub repository to Cloudflare Pages.
2. Set the build command to `npm run build`.
3. Set the output directory to `/` because this is a static site generated in the repository root.
4. Add the custom domain `ot.itisuniqueofficial.com`.
5. Confirm that `robots.txt`, `sitemap.xml`, `_redirects`, and `404.html` are included in the deployed output.

## SEO Features

The site is generated for `https://ot.itisuniqueofficial.com/`.

Canonical URL format:

```text
https://ot.itisuniqueofficial.com/{tool-name}/
```

SEO generation includes:

- Unique page titles and meta descriptions
- Canonical URLs for each tool page
- Open Graph and Twitter metadata
- `robots.txt` with sitemap reference
- `sitemap.xml` generated from the tool page list
- Clean URL directory copies for production pages

Meta tag update rules:

- Update metadata through `seo-rebrand.mjs` whenever possible.
- Keep canonical URLs on the production domain.
- Keep descriptions accurate to each tool's actual purpose.
- Do not add misleading keywords or unrelated schema.

## JSON-LD Schema Support

Each generated tool page includes structured data where applicable:

- `WebApplication` schema for the tool page
- `FAQPage` schema with purpose-specific questions and answers
- `BreadcrumbList` schema for site navigation context

FAQ schema should stay specific to the tool category and must match visible page functionality.

## Repository Files

- `robots.txt` allows crawling and references the sitemap.
- `sitemap.xml` lists canonical production URLs.
- `ads.txt` is present for advertising platform compatibility.
- `404.html` provides a static not-found page.
- `_redirects` supports Cloudflare Pages redirects.

## Fixes Completed

- Replaced remaining CDN tool libraries with local `assets/vendor/` paths.
- Fixed delayed script loading so failed optional scripts do not leave tools stuck in `loading...`.
- Fixed generated analytics listener cleanup from `event.type` to the actual event object.
- Fixed drag-and-drop upload handling to prevent browser navigation and ignore empty drops safely.
- Fixed repeated URL download requests so same-URL file tools do not hang.
- Removed stale dark-mode hooks after the theme toggle was removed.
- Regenerated canonical clean URL pages, sitemap, redirects, robots file, and cache-busted script references.

## Verification

Before deployment, run:

```bash
npm run build
npm run validate
```

The project was also checked for local HTML asset references so generated pages point to existing files in the repository.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, issue, pull request, and coding guidelines.

Before submitting a pull request:

- Keep tool behavior unchanged unless the change is intentional and documented.
- Do not change website design unless the issue or pull request specifically requires it.
- Run `npm run validate`.
- Run `npm run build` if metadata, routes, SEO, or generated pages are affected.

## Security

For vulnerability reporting, see [SECURITY.md](SECURITY.md).

## License

This repository is released under the MIT License. See [LICENSE](LICENSE) for details.

## Credits

This project is a rebranded and SEO-focused open-source online tools website maintained by It Is Unique Official.

The implementation builds on prior online tools work and includes third-party frontend libraries. Third-party libraries remain subject to their respective licenses.
