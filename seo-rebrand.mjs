import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const SITE_NAME = 'Online Tools';
const FULL_SITE_NAME = 'Online Tools — Free Web Utilities';
const BASE_URL = 'https://ot.itisuniqueofficial.com';
const CONTACT_URL = 'https://github.com/itisuniqueofficial-gh/online-tools/discussions';
const TODAY = new Date().toISOString().slice(0, 10);

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const slugify = (value) => value
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/\+/g, ' plus ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const toPosix = (file) => path.relative(ROOT, file).replace(/\\/g, '/');

const rawTitle = (html, rel) => {
  if (rel === 'index.html') return FULL_SITE_NAME;
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || rel;
  return title.replace(/\s+-\s+Online Tools$/i, '').trim();
};

const normalizeSeoName = (name) => name
  .replace(/\bFile File Hash Generator Online\b/gi, 'File Hash Generator Online')
  .replace(/\bConverter Converter Online\b/gi, 'Converter Online')
  .replace(/\bSignature Generator Message Online\b/gi, 'Signature Generator Online')
  .replace(/\s+/g, ' ')
  .trim();

const seoName = (raw, rel) => {
  const clean = raw.replace(/\s+/g, ' ').trim();
  if (rel === 'index.html') return FULL_SITE_NAME;
  if (/\bOnline$/i.test(clean)) return normalizeSeoName(clean);
  if (/key generator/i.test(clean)) return normalizeSeoName(clean.replace(/key generator/i, 'Key Generator Online'));
  if (/file|checksum/i.test(clean)) {
    const base = clean.replace(/\s*(File|Checksum)$/i, '').replace(/\s+File\s+Hash$/i, '').trim();
    if (/encode/i.test(clean)) return normalizeSeoName(`${base.replace(/\s*Encode\s*/i, ' ')} File Encoder Online`);
    if (/decode/i.test(clean)) return normalizeSeoName(`${base.replace(/\s*Decode\s*/i, ' ')} File Decoder Online`);
    return normalizeSeoName(`${base} File Hash Generator Online`);
  }
  if (/encode/i.test(clean)) return normalizeSeoName(clean.replace(/\bEncode\b/i, 'Encoder') + ' Online');
  if (/decode/i.test(clean)) return normalizeSeoName(clean.replace(/\bDecode\b/i, 'Decoder') + ' Online');
  if (/encrypt/i.test(clean)) return normalizeSeoName(clean.replace(/\bEncrypt\b/i, 'Encryption Tool') + ' Online');
  if (/decrypt/i.test(clean)) return normalizeSeoName(clean.replace(/\bDecrypt\b/i, 'Decryption Tool') + ' Online');
  if (/sign/i.test(clean)) return normalizeSeoName(clean.replace(/\bSign\b/i, 'Signature Generator') + ' Online');
  if (/verify/i.test(clean)) return normalizeSeoName(clean.replace(/\bVerify\b/i, 'Signature Verification Tool') + ' Online');
  if (/formatter/i.test(clean)) return normalizeSeoName(clean.replace(/\bFormatter\b/i, 'Formatter Online'));
  if (/minifier/i.test(clean)) return normalizeSeoName(clean.replace(/\bMinifier\b/i, 'Minifier Online'));
  if (/viewer/i.test(clean)) return normalizeSeoName(clean.replace(/\bViewer\b/i, 'Viewer Online'));
  if (/validator/i.test(clean)) return normalizeSeoName(clean.replace(/\bValidator\b/i, 'Validator Online'));
  if (/syntax highlight/i.test(clean)) return normalizeSeoName('Syntax Highlighter Online');
  if (/qr code/i.test(clean)) return normalizeSeoName(clean.includes('Embed') ? 'QR Code Embed Tool Online' : 'QR Code Generator Online');
  if (/case/i.test(clean)) return normalizeSeoName(`${clean.replace(/^Convert\s+/i, '')} Converter Online`);
  if (/CRC/i.test(clean)) return normalizeSeoName('CRC Checksum Calculator Online');
  return normalizeSeoName(`${clean} Hash Generator Online`);
};

const actionFor = (name) => {
  if (/File Hash/i.test(name)) return 'calculate a checksum from a local file';
  if (/Hash/i.test(name)) return 'generate a hash from text or encoded input';
  if (/Encoder/i.test(name)) return 'encode text or files into the selected format';
  if (/Decoder/i.test(name)) return 'decode text or files back into readable data';
  if (/Encryption/i.test(name)) return 'encrypt text or files directly in the browser';
  if (/Decryption/i.test(name)) return 'decrypt text or files with matching options';
  if (/Formatter/i.test(name)) return 'format structured data for easier reading';
  if (/Minifier/i.test(name)) return 'compress structured data by removing unnecessary characters';
  if (/Validator/i.test(name)) return 'validate structured data and find syntax issues';
  if (/Viewer/i.test(name)) return 'inspect structured data in a readable view';
  if (/Case Converter/i.test(name) || /Converter Online/i.test(name)) return 'convert text casing for code, URLs, and content';
  if (/QR Code/i.test(name)) return 'create QR codes from text, links, or custom data';
  if (/Signature/i.test(name)) return 'create or verify digital signatures';
  if (/Key Generator/i.test(name)) return 'generate cryptographic key pairs in the browser';
  return 'process data quickly in your browser';
};

const shortDescription = (name) => {
  const text = `${name} helps you ${actionFor(name)}. Free browser-based web utility with clean output and no setup.`;
  return text.length <= 158 ? text : `${name} is a free browser tool to ${actionFor(name)} with clean output and no setup.`.slice(0, 158);
};

const longDescription = (name) => {
  const action = actionFor(name);
  return `${name} helps you ${action} without installing software. Use it for development, data cleanup, SEO tasks, testing, content workflows, and quick checks. The tool keeps input and output simple while supporting practical technical formats used in everyday web work.`;
};

const keywordList = (name, originalKeywords) => {
  const seen = new Set();
  return [name, ...originalKeywords.split(',')]
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .filter((keyword) => {
      const key = keyword.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(', ');
};

const faqEntries = (name) => {
  const lower = name.toLowerCase();
  const item = (question, answer) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer }
  });

  if (lower.includes('file hash')) {
    return [
      item(`What is ${name} used for?`, `${name} calculates a checksum or hash value from a selected local file.`),
      item(`Does ${name} upload my file?`, `No. ${name} processes the file in your browser and shows the resulting hash value.`),
      item(`Can I use ${name} to verify downloads?`, `Yes. Compare the generated hash with a trusted checksum to check whether a file matches.`),
      item(`Which output formats does ${name} support?`, `${name} uses the output options available on the page, such as hexadecimal or Base64 when supported.`)
    ];
  }
  if (lower.includes('hash generator') || lower.includes('checksum calculator')) {
    return [
      item(`What does ${name} do?`, `${name} generates a hash or checksum from text or encoded input directly in the browser.`),
      item(`When should I use ${name}?`, `Use ${name} for development checks, test data, integrity comparisons, and quick hash generation.`),
      item(`Can ${name} hash text in different encodings?`, `Yes. The tool includes input encoding options when the selected algorithm supports them.`),
      item(`Is ${name} free to use?`, `Yes. ${name} is a free online utility and does not require installation.`)
    ];
  }
  if (lower.includes('base64')) {
    return [
      item(`What is ${name}?`, `${name} converts data to or from Base64 format for use in URLs, APIs, emails, and data transfer.`),
      item(`Can ${name} handle text data?`, `Yes. ${name} supports text input and shows the converted result directly on the page.`),
      item(`Is Base64 encryption?`, `No. Base64 is an encoding method, not encryption. Anyone with the encoded text can decode it.`),
      item(`When should I use ${name}?`, `Use ${name} when data needs to be safely represented as Base64 text for technical workflows.`)
    ];
  }
  if (lower.includes('base32')) {
    return [
      item(`What is ${name}?`, `${name} converts data to or from Base32 format, which uses a limited alphabet suitable for technical text workflows.`),
      item(`When is Base32 useful?`, `Base32 is useful when encoded data needs to avoid mixed-case characters or be easier to read aloud.`),
      item(`Is Base32 encryption?`, `No. Base32 is encoding, not encryption, so it should not be used to hide sensitive data.`),
      item(`Can ${name} process files?`, `${name} supports the input types available on the page, including file conversion where provided.`)
    ];
  }
  if (lower.includes('base58')) {
    return [
      item(`What is ${name}?`, `${name} converts data to or from Base58 format, a compact encoding often used where confusing characters should be avoided.`),
      item(`Why use Base58 instead of Base64?`, `Base58 avoids characters that can be hard to distinguish, such as zero, capital O, capital I, and lowercase l.`),
      item(`Is Base58 secure by itself?`, `No. Base58 is an encoding format, not encryption or authentication.`),
      item(`Can ${name} decode Base58 input?`, `Use the matching Base58 decoder page when you need to convert Base58 text back to readable or binary data.`)
    ];
  }
  if (lower.includes('hex') || lower.includes('base16')) {
    return [
      item(`What is ${name}?`, `${name} converts data to or from hexadecimal Base16 representation.`),
      item(`When is hex encoding useful?`, `Hex encoding is useful for binary data, hashes, debugging, byte values, and developer tools.`),
      item(`Is hex encoding encryption?`, `No. Hex is a readable representation of bytes and can be reversed when the input is valid.`),
      item(`Can ${name} work with files?`, `${name} supports file conversion when the file input option is available on the page.`)
    ];
  }
  if (lower.includes('html encoder') || lower.includes('html decoder')) {
    return [
      item(`What is ${name}?`, `${name} converts HTML characters to escaped entities or decodes entities back to readable characters.`),
      item(`Why escape HTML?`, `Escaping HTML helps display reserved characters safely as text instead of letting them be interpreted as markup.`),
      item(`Can ${name} help with web content?`, `Yes. ${name} is useful for snippets, templates, content cleanup, and debugging encoded HTML.`),
      item(`Does ${name} validate HTML structure?`, `No. This tool focuses on encoding and decoding characters, not full HTML validation.`)
    ];
  }
  if (lower.includes('url encoder') || lower.includes('url decoder')) {
    return [
      item(`What is ${name}?`, `${name} converts URL characters to encoded form or decodes URL-encoded text back to readable text.`),
      item(`Why encode URLs?`, `URL encoding helps reserved or unsafe characters work correctly in query strings, paths, and web requests.`),
      item(`Can ${name} decode query parameters?`, `Yes. ${name} can help read encoded URL strings and query parameter values.`),
      item(`Is URL encoding encryption?`, `No. URL encoding is only a formatting method and does not protect private information.`)
    ];
  }
  if (lower.includes('encoder')) {
    return [
      item(`What is ${name} used for?`, `${name} converts readable input or files into the selected encoded format.`),
      item(`Can ${name} encode data in the browser?`, `Yes. ${name} runs in a modern browser and shows the encoded result on the page.`),
      item(`Does ${name} change my original input?`, `No. The original input stays unchanged while the encoded output is displayed separately.`),
      item(`Who can use ${name}?`, `Developers, testers, content editors, and technical users can use ${name} for quick encoding tasks.`)
    ];
  }
  if (lower.includes('decoder')) {
    return [
      item(`What does ${name} decode?`, `${name} converts encoded input back into readable text or downloadable file data when supported.`),
      item(`Can ${name} help debug encoded values?`, `Yes. ${name} is useful for checking encoded strings, payloads, and data conversion results.`),
      item(`Does ${name} require an account?`, `No. ${name} works in the browser without an account or software installation.`),
      item(`What happens if the input is invalid?`, `${name} attempts to decode the input and shows the result or an error depending on the selected format.`)
    ];
  }
  if (lower.includes('encryption')) {
    return [
      item(`What is ${name} used for?`, `${name} encrypts input with the selected cryptographic settings in the browser.`),
      item(`Do I need a key for ${name}?`, `Yes. Encryption tools require the appropriate key or options for the selected algorithm.`),
      item(`Can ${name} encrypt files or text?`, `${name} supports the input types available on its page, such as text or file encryption where provided.`),
      item(`Is ${name} a replacement for secure key management?`, `No. ${name} is a utility for processing data, but you should still store keys securely.`)
    ];
  }
  if (lower.includes('decryption')) {
    return [
      item(`What is ${name} used for?`, `${name} decrypts compatible encrypted input using the matching key and settings.`),
      item(`Why does ${name} need matching options?`, `Decryption requires the same algorithm, key, mode, and related settings used during encryption.`),
      item(`Can ${name} decrypt any encrypted data?`, `No. ${name} can only decrypt data that matches the selected format and valid settings.`),
      item(`Does ${name} run locally?`, `${name} performs its tool processing in the browser page without requiring server-side setup.`)
    ];
  }
  if (lower.includes('key generator')) {
    return [
      item(`What does ${name} create?`, `${name} generates cryptographic key material for the selected algorithm.`),
      item(`When should I use ${name}?`, `Use ${name} when you need test keys, development keys, or browser-generated key pairs.`),
      item(`Should I protect keys from ${name}?`, `Yes. Treat generated private keys as sensitive and store them securely.`),
      item(`Does ${name} require installation?`, `No. ${name} works as a browser-based online utility.`)
    ];
  }
  if (lower.includes('signature generator')) {
    return [
      item(`What is ${name} used for?`, `${name} creates a digital signature for a message using the selected key and algorithm.`),
      item(`Why use ${name}?`, `Use ${name} to sign test messages, verify workflows, or prepare development examples.`),
      item(`Do I need a private key for ${name}?`, `Yes. Creating a digital signature requires the correct private key.`),
      item(`Can ${name} verify a signature?`, `Use the matching signature verification tool when you need to check a signature.`)
    ];
  }
  if (lower.includes('signature verification')) {
    return [
      item(`What does ${name} check?`, `${name} checks whether a digital signature matches the message and public key.`),
      item(`Do I need the original message for ${name}?`, `Yes. Signature verification requires the original message, signature, and matching public key.`),
      item(`What does a valid result mean?`, `A valid result means the signature matches the supplied message and verification key.`),
      item(`Is ${name} useful for testing?`, `Yes. ${name} is useful for testing signing workflows and debugging signature data.`)
    ];
  }
  if (lower.includes('formatter')) {
    return [
      item(`What does ${name} format?`, `${name} reformats structured data so it is easier to read and review.`),
      item(`Does ${name} change the data meaning?`, `No. Formatting changes the layout of valid data without intentionally changing its meaning.`),
      item(`When should I use ${name}?`, `Use ${name} when debugging, reviewing API responses, or cleaning structured content.`),
      item(`Can ${name} help find syntax issues?`, `Formatting can make problems easier to spot, but use a validator when you need explicit validation.`)
    ];
  }
  if (lower.includes('minifier')) {
    return [
      item(`What does ${name} remove?`, `${name} removes unnecessary whitespace and formatting from structured data.`),
      item(`Why use ${name}?`, `Use ${name} to make structured content smaller for transport, testing, or storage.`),
      item(`Does ${name} alter valid values?`, `No. It is intended to preserve data values while reducing formatting characters.`),
      item(`Is ${name} browser-based?`, `Yes. ${name} runs as an online utility in your browser.`)
    ];
  }
  if (lower.includes('validator')) {
    return [
      item(`What does ${name} validate?`, `${name} checks structured input for syntax and format problems.`),
      item(`When should I use ${name}?`, `Use ${name} before publishing, importing, or debugging structured data.`),
      item(`Can ${name} fix invalid data automatically?`, `${name} focuses on validation feedback; formatting and correction depend on the specific input.`),
      item(`Is ${name} useful for developers?`, `Yes. ${name} helps developers and content teams quickly check structured data.`)
    ];
  }
  if (lower.includes('viewer')) {
    return [
      item(`What is ${name} used for?`, `${name} displays structured data in a readable view for easier inspection.`),
      item(`Can ${name} help inspect API output?`, `Yes. ${name} is useful for reviewing API responses and nested structured data.`),
      item(`Does ${name} modify the original data?`, `No. It presents the input in a readable form while keeping the source separate.`),
      item(`Who should use ${name}?`, `Developers, analysts, testers, and content editors can use ${name} for quick data inspection.`)
    ];
  }
  if (lower.includes('case converter')) {
    return [
      item(`What does ${name} convert?`, `${name} converts text into the selected letter case or naming style.`),
      item(`When is ${name} useful?`, `Use ${name} for code names, headings, URLs, labels, and content cleanup.`),
      item(`Does ${name} support developer naming styles?`, `Yes. Case tools are useful for styles such as camel case, snake case, kebab case, and related formats.`),
      item(`Is ${name} free?`, `Yes. ${name} is a free browser-based text conversion utility.`)
    ];
  }
  if (lower.includes('qr code')) {
    return [
      item(`What can I create with ${name}?`, `${name} creates QR codes from text, links, and supported custom input.`),
      item(`Can ${name} customize QR code output?`, `Yes. Use the settings on the page to adjust the available QR code options.`),
      item(`Can I download QR codes from ${name}?`, `${name} provides download options when the generated output supports them.`),
      item(`What is ${name} useful for?`, `Use ${name} for links, campaigns, labels, documents, testing, and quick sharing.`)
    ];
  }
  return [
    item(`What is ${name} used for?`, `${name} helps you ${actionFor(name)} directly in the browser.`),
    item(`Do I need to install software for ${name}?`, `No. ${name} is a browser-based online tool.`),
    item(`Who can use ${name}?`, `Developers, testers, SEO users, and content teams can use ${name} for quick utility tasks.`)
  ];
};

const schemaBlock = (name, url, description) => {
  const app = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    description
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries(name)
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: FULL_SITE_NAME,
        item: `${BASE_URL}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: url
      }
    ]
  };
  return `<script type="application/ld+json">${JSON.stringify(app)}</script><script type="application/ld+json">${JSON.stringify(faq)}</script><script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`;
};

const headMeta = (name, url, description, keywords, isHome = false) => {
  const title = isHome ? FULL_SITE_NAME : `${name} - ${SITE_NAME}`;
  const ogTitle = isHome ? FULL_SITE_NAME : `${name} - ${SITE_NAME}`;
  const image = `${BASE_URL}/images/logo.svg`;
  return `<title>${escapeHtml(title)}</title><base href="/"><meta name="keywords" content="${escapeHtml(keywords)}"><meta name="author" content="${escapeHtml(FULL_SITE_NAME)}"><meta name="copyright" content="${escapeHtml(FULL_SITE_NAME)}"><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${escapeHtml(url)}"><meta name="robots" content="index, follow"><meta property="og:title" content="${escapeHtml(ogTitle)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(url)}"><meta property="og:type" content="website"><meta property="og:site_name" content="${escapeHtml(FULL_SITE_NAME)}"><meta property="og:locale" content="en"><meta property="og:image" content="${escapeHtml(image)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(ogTitle)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(image)}"><meta name="generator" content="Online Tools Rebrand">${schemaBlock(name, url, description)}`;
};

const rewriteHtml = (html, name, url, description, rel, isHome = false) => {
  const originalKeywords = html.match(/<meta name="keywords" content="([^"]*)">/i)?.[1] || `${name}, online tools, web utilities`;
  const keywords = keywordList(name, originalKeywords);
  let next = html.replace(/<title>[\s\S]*?(?=<link rel="icon")/i, headMeta(name, url, description, keywords, isHome));
  next = next.replace(/<base href="\/online-tools\/">/gi, '<base href="/">');
  next = next.replace(/\/online-tools\//g, '/');
  next = next.replace(/https:\/\/github\.com\/itisuniqueofficial-gh\/discussions/g, CONTACT_URL);
  next = next.replace(/<h2>Online Tools<\/h2>/g, '<h2>Online Tools</h2>');
  next = next.replace(/alt="Logo"/g, 'alt="Online Tools logo"');
  next = next.replace(/https:\/\/github\.com\/emn178\/online-tools\/issues/g, CONTACT_URL);
  next = next.replace(/href="https:\/\/ot\.itisuniqueofficial\.com"/g, `href="${CONTACT_URL}"`);

  if (isHome) {
    next = next.replace(/<header><h1>Online Tools<\/h1><p>[\s\S]*?<\/p><\/header>/i, `<header><h1>${escapeHtml(FULL_SITE_NAME)}</h1><p>${escapeHtml(description)}</p></header>`);
  } else {
    next = next.replace(/<header><h1>[\s\S]*?<\/h1><p>[\s\S]*?<\/p><\/header>/i, `<header><h1>${escapeHtml(name)}</h1><p>${escapeHtml(longDescription(name))}</p></header>`);
  }
  return next;
};

const htmlFiles = execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((file) => !/^[^/]+-online\/index\.html$/i.test(file))
  .map((file) => path.join(ROOT, file));

const pages = [];

for (const file of htmlFiles) {
  const rel = toPosix(file);
  const html = fs.readFileSync(file, 'utf8');
  if (rel === '404.html') {
    const description = 'The page was not found. Use Online Tools to access free hashing, encoding, decoding, encryption, JSON, XML, QR code, and developer utilities.';
    fs.writeFileSync(file, rewriteHtml(html, 'Page Not Found', `${BASE_URL}/404.html`, description, rel).replace(/<meta name="robots" content="index, follow">/i, '<meta name="robots" content="noindex, follow">'));
    continue;
  }
  if (!/<header><h1>/i.test(html)) {
    fs.writeFileSync(file, html.replace(/\/online-tools\//g, '/'));
    continue;
  }
  const isHome = rel === 'index.html';
  const raw = rawTitle(html, rel);
  const name = isHome ? FULL_SITE_NAME : seoName(raw, rel);
  const slug = isHome ? '' : slugify(name);
  const url = isHome ? `${BASE_URL}/` : `${BASE_URL}/${slug}/`;
  const description = isHome
    ? 'Free online web utilities for hashing, encoding, decoding, encryption, JSON, XML, QR codes, text tools, and developer workflows.'
    : shortDescription(name);
  const updated = rewriteHtml(html, name, url, description, rel, isHome);
  fs.writeFileSync(file, updated);
  pages.push({ rel, name, slug, url, file });
}

for (const page of pages.filter((page) => page.slug)) {
  const outDir = path.join(ROOT, page.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(page.file, path.join(outDir, 'index.html'));
}

const sitemapUrls = pages.map((page) => `  <url><loc>${page.url}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(ROOT, 'ads.txt'), '# Replace with your Google AdSense publisher record when available.\n');
fs.writeFileSync(path.join(ROOT, '_redirects'), '/tools/:tool /:tool/ 301\n');

const paletteCss = (css) => css
  .replace(/box-shadow:[^;}]+/g, 'box-shadow:none')
  .replace(/(?:linear|radial)-gradient\([^)]*\)/g, '#F7F7F7')
  .replace(/#[0-9a-fA-F]{3,8}\b/g, (color) => {
    const normalized = color.toLowerCase();
    if (['#fff', '#ffffff', '#eeeeee', '#f9fafb', '#f3f4f6'].includes(normalized)) return '#FFFFFF';
    if (['#e5e5e5', '#e5e7eb', '#ddd', '#ccc', '#d1d5db'].includes(normalized)) return '#E5E5E5';
    if (['#f7f7f7'].includes(normalized)) return '#F7F7F7';
    if (['#dc2626', '#b91c1c', '#00adb5', '#2563eb', '#31a7f4', '#3ec972'].includes(normalized)) return '#DC2626';
    if (['#6b7280', '#393e46', '#4b5563', '#6c757d', '#9ca3af'].includes(normalized)) return '#6B7280';
    if (['#000', '#000000', '#0a0a0a', '#111111', '#111827', '#1a1a1a', '#1e1e1e', '#1f2937', '#222831', '#272822', '#090808'].includes(normalized)) return '#111111';
    return '#6B7280';
  })
  .replace(/rgba?\([^)]*\)/g, '#E5E5E5')
  .replace(/#FFFFFF-space/g, 'white-space')
  .replace(/(:|\s)black(?=\s*[;}])/gi, '$1#111111')
  .replace(/(:|\s)white(?=\s*[;}])/gi, '$1#FFFFFF')
  .replace(/--var-primary:\s*#[0-9a-fA-F]{6}/g, '--var-primary: #DC2626')
  .replace(/--var-blue:\s*#[0-9a-fA-F]{6}/g, '--var-blue: #DC2626')
  .replace(/--var-green:\s*#[0-9a-fA-F]{6}/g, '--var-green: #DC2626')
  .replace(/--var-red:\s*#[0-9a-fA-F]{6}/g, '--var-red: #DC2626')
  .replace(/--var-white:\s*#[0-9a-fA-F]{6}/g, '--var-white: #FFFFFF')
  .replace(/--var-gray:\s*#[0-9a-fA-F]{6}/g, '--var-gray: #F7F7F7')
  .replace(/--var-gray-100:\s*#[0-9a-fA-F]{6}/g, '--var-gray-100: #FFFFFF')
  .replace(/--var-gray-200:\s*#[0-9a-fA-F]{6}/g, '--var-gray-200: #F7F7F7')
  .replace(/--var-gray-300:\s*#[0-9a-fA-F]{6}/g, '--var-gray-300: #E5E5E5')
  .replace(/--var-gray-400:\s*#[0-9a-fA-F]{6}/g, '--var-gray-400: #E5E5E5')
  .replace(/--var-gray-500:\s*#[0-9a-fA-F]{6}/g, '--var-gray-500: #6B7280')
  .replace(/--var-gray-600:\s*#[0-9a-fA-F]{6}/g, '--var-gray-600: #6B7280')
  .replace(/--var-gray-700:\s*#[0-9a-fA-F]{6}/g, '--var-gray-700: #111111')
  .replace(/--var-gray-800:\s*#[0-9a-fA-F]{6}/g, '--var-gray-800: #111111')
  .replace(/--var-gray-900:\s*#[0-9a-fA-F]{6}/g, '--var-gray-900: #111111')
  .replace(/--var-bg-color:\s*#[0-9a-fA-F]{6}/g, '--var-bg-color: #FFFFFF')
  .replace(/--var-main-bg-color:\s*#[0-9a-fA-F]{6}/g, '--var-main-bg-color: #F7F7F7')
  .replace(/--var-font-color:\s*#[0-9a-fA-F]{6}/g, '--var-font-color: #111111')
  .replace(/--var-border-color:\s*#[0-9a-fA-F]{6}/g, '--var-border-color: #E5E5E5')
  .replace(/--var-title-bg-color:\s*#[0-9a-fA-F]{6}/g, '--var-title-bg-color: #F7F7F7')
  .replace(/--var-sidebar-link-color:\s*#[0-9a-fA-F]{6}/g, '--var-sidebar-link-color: #6B7280')
  .replace(/--var-sidebar-link-color-hover:\s*#[0-9a-fA-F]{6}/g, '--var-sidebar-link-color-hover: #111111')
  .replace(/--var-sidebar-color:\s*#[0-9a-fA-F]{6}/g, '--var-sidebar-color: #FFFFFF')
  .replace(/--var-button-bg-color:\s*#[0-9a-fA-F]{6}/g, '--var-button-bg-color: #DC2626')
  .replace(/--var-button-hover-bg-color:\s*#[0-9a-fA-F]{6}/g, '--var-button-hover-bg-color: #B91C1C')
  .replace(/--var-icon-hover-bg-color:\s*#[0-9a-fA-F]{6}/g, '--var-icon-hover-bg-color: #FEF2F2')
  .replace(/--var-input-color:\s*#[0-9a-fA-F]{6}/g, '--var-input-color: #111111')
  .replace(/--var-input-bg-color:\s*#[0-9a-fA-F]{6}/g, '--var-input-bg-color: #FFFFFF')
  .replace(/--var-textarea-color:\s*#[0-9a-fA-F]{6}/g, '--var-textarea-color: #111111')
  .replace(/--var-textarea-bg-color:\s*#[0-9a-fA-F]{6}/g, '--var-textarea-bg-color: #FFFFFF');

const sidebarContrastFix = `
:root{--color-dark:#111111;--color-white:#ffffff;--color-soft-bg:#f7f7f7;--color-border:#e5e5e5;--color-red:#dc2626;--color-red-hover:#b91c1c;--color-red-faint:#fef2f2;--color-muted:#6b7280}
.sidebar,.sidebar *,.menu,.menu *,.nav,.nav *,.accordion,.accordion *,.category,.category *,.tool-list,.tool-list *,#sidebar,#sidebar *{color:var(--color-dark) !important}
.sidebar,#sidebar{background:var(--color-soft-bg) !important;border-right:1px solid var(--color-border)}
.sidebar a,.sidebar button,.sidebar .menu-item,.sidebar .category-title,#sidebar a,#sidebar button,#sidebar .menu-item,#sidebar .category-title{color:var(--color-dark) !important}
.sidebar a:hover,.sidebar button:hover,.sidebar .menu-item:hover,#sidebar a:hover,#sidebar button:hover,#sidebar .menu-item:hover{color:var(--color-red) !important;background:var(--color-red-faint) !important}
.sidebar .active,.sidebar .active *,#sidebar .active,#sidebar .active *{color:var(--color-red) !important;font-weight:600}
.sidebar svg,.sidebar i,#sidebar svg,#sidebar i{color:var(--color-muted) !important}
`;

const withSidebarContrastFix = (css) => `${css.replace(/\n?:root\{--color-dark:[\s\S]*?#sidebar svg,#sidebar i\{color:var\(--color-muted\) !important\}\n?/, '')}${sidebarContrastFix}`;

for (const cssFile of [path.join(ROOT, 'css', 'style.css'), path.join(ROOT, 'css', 'qrcode.css')]) {
  if (fs.existsSync(cssFile)) {
    const updatedCss = paletteCss(fs.readFileSync(cssFile, 'utf8'));
    fs.writeFileSync(cssFile, cssFile.endsWith(`${path.sep}style.css`) ? withSidebarContrastFix(updatedCss) : updatedCss);
  }
}

console.log(`Rebranded ${pages.length} pages and generated ${pages.length - 1} clean URL copies.`);
