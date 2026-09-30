/**
 * Writes `www/pricing-authstack/` and `www/pricing-conseal/` from `www/pricing/index.html`.
 *
 * The point is to see one page wearing a different brand, so the copy has to be the same
 * copy: these are derived from the lpdf page rather than duplicated from it, and editing
 * the pricing page and re-running this is what keeps all three in step. Only four things
 * change — the favicon, the nav lockup, the head metadata, and the brand tokens.
 *
 * The tokens are measured rather than picked. Each product's `--brand` is its colour from
 * `logos/bin/brand.mjs`; `--brand-text` is that hue carried until a pill label clears 4.5:1
 * on the card it sits on, per theme; `--brand-on` is what sits on the brand fill. The dark
 * value matters most for conseal, whose brand is only 3.85:1 on the dark card, so aliasing
 * `--brand-text` to `--brand` the way the lpdf theme does would leave its label under the
 * bar. Re-derive with `logos/bin` if a colour ever moves.
 *
 * These are previews. They carry `noindex`, and they are not real product sites.
 *
 * Usage: node build-pricing-previews.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WWW = fileURLToPath(new URL('./www', import.meta.url));
const SOURCE = path.join(WWW, 'pricing/index.html');

const PRODUCTS = [
    {
        slug: 'authstack',
        name: 'Authstack',
        brand: 'oklch(62.6% 0.132 234.6)',      // #0393cb
        textLight: 'oklch(0.558 0.132 234.6)',  // 4.52 on the light card
        textDark: 'oklch(0.634 0.132 234.6)',   // 4.51 on the dark card
        on: 'oklch(0.254 0.053 234.6)',         // 4.52 on the brand fill
        word: { family: 'Space Grotesk', weight: 600, query: 'Space+Grotesk:wght@600' },
    },
    {
        slug: 'conseal',
        name: 'Conseal',
        brand: 'oklch(61% 0.149 279.7)',        // #7376da
        textLight: 'oklch(0.576 0.149 279.7)',  // 4.53 on the light card
        textDark: 'oklch(0.65 0.149 279.7)',    // 4.53 on the dark card — a 4-point lift
        on: 'oklch(0.212 0.06 279.7)',          // 4.52 on the brand fill
        word: { family: 'Chakra Petch', weight: 600, query: 'Chakra+Petch:wght@600' },
    },
];

const source = fs.readFileSync(SOURCE, 'utf8');

/** Replaces exactly once, and fails loudly rather than writing a page that silently did not change. */
function replaceOnce(html, find, replacement, what) {
    const parts = html.split(find);
    if (parts.length !== 2) throw new Error(`Expected exactly one '${what}' in pricing/index.html, found ${parts.length - 1}`);
    return parts.join(replacement);
}

const written = [];

for (const p of PRODUCTS) {
    let html = source;

    html = replaceOnce(html,
        '<link rel="icon" href="../assets/favicon.ico" />',
        `<link rel="icon" href="../assets/favicon-${p.slug}.ico" />`,
        'favicon link');

    // The page is a preview of someone else's brand on lpdf's copy, so it must not claim
    // lpdf's canonical URL, and it must not be indexed.
    const seo = html.slice(html.indexOf('<!-- seo:start -->'), html.indexOf('<!-- seo:end -->') + '<!-- seo:end -->'.length);
    html = replaceOnce(html, seo,
        [
            '<meta name="robots" content="noindex" />',
            `<title>${p.name} — Pricing (brand preview)</title>`,
        ].join('\n    '),
        'seo block');

    // The mark is artwork and the word is text, so the swap is an image plus a string
    // rather than a picture of both. The word's face is set in the style block below.
    html = replaceOnce(html,
        '<site-nav variant="pricing"></site-nav>',
        `<site-nav variant="pricing"\n              logo-mark="/assets/images/${p.slug}-mark.svg"\n`
        + `              logo-word="${p.name}"></site-nav>`,
        'site-nav');

    html = replaceOnce(html, '</head>',
        [
            // The wordmark faces live in each product's own site, not lpdf's, so these
            // preview pages fetch them rather than copying font files across.
            `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${p.word.query}&display=swap" />`,
            '<style>',
            `    /* ${p.name} brand preview. Everything on this page derives from --brand, so the`,
            '       three tokens below are the whole change. Measured, not picked — see this',
            '       file\'s header for how, and logos/bin/brand.mjs for the colour itself. */',
            '    .nav-logo-word, .footer-logo-word {',
            `        font-family: '${p.word.family}', Georgia, serif;`,
            `        font-weight: ${p.word.weight};`,
            '    }',
            '    :root {',
            `        --brand: ${p.brand};`,
            `        --brand-text: ${p.textLight};`,
            `        --brand-on: ${p.on};`,
            '    }',
            '    /* The lpdf theme aliases --brand-text to --brand here, which this hue cannot',
            '       carry on the dark card. After the linked sheets, so it wins on order. */',
            '    [data-theme="dark"] {',
            `        --brand-text: ${p.textDark};`,
            '    }',
            '</style>',
            '</head>',
        ].join('\n    '),
        'head close');

    const dir = path.join(WWW, `pricing-${p.slug}`);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, html);
    written.push(`${path.relative(process.cwd(), file)} (${html.length} bytes)`);
}

for (const line of written) process.stdout.write(`${line}\n`);
