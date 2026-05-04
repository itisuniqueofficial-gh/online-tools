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

## Installation

Requirements:

- Node.js 18 or newer
- npm 9 or newer

Clone the repository:

```bash
git clone https://github.com/itisuniqueofficial-gh/online-tools.git
cd online-tools
```

Install dependencies if future dependencies are added:

```bash
npm install
```

The current project does not require runtime npm dependencies.

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
