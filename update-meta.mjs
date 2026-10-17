#!/usr/bin/env node
// Reads sitemap.yaml, syncs SEO meta tags in each page's HTML file, and writes www/sitemap.xml.
// Run: node update-meta.mjs (or `make meta-pages` from the lpdf repo)
//
// index: true  → injects title, description, canonical, og:*, twitter:card; listed in sitemap.xml
// index: false → injects title, description, robots noindex (no og/twitter); left out of sitemap.xml
//
// Uses <!-- seo:start / seo:end --> sentinels. First run strips existing
// scattered tags and inserts the block; subsequent runs replace between sentinels.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir  = resolve(__dirname, 'www');
const yamlPath  = resolve(__dirname, 'sitemap.yaml');

// ── YAML parser ────────────────────────────────────────────────────────────────

function parseYaml(text) {
    const result = { pages: [] };
    let current = null;

    for (const raw of text.split('\n')) {
        const line = raw.replace(/\r$/, '');
        if (!line.trim() || line.trim().startsWith('#')) continue;

        // top-level scalar (base_url, og_image, …)
        const top = line.match(/^([a-z_]+):\s*(.+)$/);
        if (top) { result[top[1]] = top[2].trim(); continue; }

        // new page entry
        if (/^ {2}-\s+path:/.test(line)) {
            current = { path: line.replace(/^ {2}-\s+path:\s*/, '').trim() };
            result.pages.push(current);
            continue;
        }

        // page property
        if (current) {
            const prop = line.match(/^ {4}([a-z_]+):\s*(.+)$/);
            if (prop) {
                let [, key, val] = prop;
                val = val.trim().replace(/^"(.*)"$/, '$1');
                if (val === 'true')  val = true;
                if (val === 'false') val = false;
                current[key] = val;
            }
        }
    }
    return result;
}

// ── SEO block builder ──────────────────────────────────────────────────────────

function buildSeoBlock(page, defaultImage) {
    const img = page.og_image || defaultImage;
    const ind = '    '; // 4-space indent to match existing HTML style
    const lines = [`${ind}<!-- seo:start -->`];

    lines.push(`${ind}<title>${page.title}</title>`);
    lines.push(`${ind}<meta name="description" content="${page.description}" />`);

    if (page.index === false) {
        lines.push(`${ind}<meta name="robots" content="noindex" />`);
    } else {
        lines.push(`${ind}<link rel="canonical" href="${page.canonical}" />`);
        lines.push(`${ind}<meta property="og:title" content="${page.title}" />`);
        lines.push(`${ind}<meta property="og:description" content="${page.description}" />`);
        lines.push(`${ind}<meta property="og:url" content="${page.canonical}" />`);
        lines.push(`${ind}<meta property="og:type" content="website" />`);
        lines.push(`${ind}<meta property="og:image" content="${img}" />`);
        lines.push(`${ind}<meta name="twitter:card" content="summary_large_image" />`);
    }

    lines.push(`${ind}<!-- seo:end -->`);
    return lines.join('\n');
}

// ── Sitemap builder ────────────────────────────────────────────────────────────

// Lists the canonical URL of each page search engines may index. No <lastmod>: nothing here knows
// when a page last changed, and a wrong date is worse than none.
function buildSitemap(pages) {
    const urls = pages
        .filter(page => page.index !== false)
        .map(page => `    <url><loc>${page.canonical}</loc></url>`);
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
        '',
    ].join('\n');
}

// ── HTML updater ───────────────────────────────────────────────────────────────

function updateHtml(html, seoBlock) {
    // If sentinels already exist, replace between them.
    if (html.includes('<!-- seo:start -->')) {
        return html.replace(
            /[ \t]*<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,
            seoBlock
        );
    }

    // First run: strip existing scattered SEO tags, then insert block.
    html = html.replace(/[ \t]*<title>[\s\S]*?<\/title>\n?/, '');
    html = html.replace(/[ \t]*<meta name="description"[^>]*>\n?/g, '');
    html = html.replace(/[ \t]*<meta name="robots"[^>]*>\n?/g, '');
    html = html.replace(/[ \t]*<link rel="canonical"[^>]*>\n?/g, '');
    html = html.replace(/[ \t]*<meta property="og:[^>]*>\n?/g, '');
    html = html.replace(/[ \t]*<meta name="twitter:[^>]*>\n?/g, '');

    // Insert after the viewport meta line.
    return html.replace(
        /([ \t]*<meta name="viewport"[^>]*>)/,
        `$1\n${seoBlock}`
    );
}

// ── Main ───────────────────────────────────────────────────────────────────────

const sitemap = parseYaml(readFileSync(yamlPath, 'utf8'));

for (const page of sitemap.pages) {
    const segment  = page.path.replace(/^\//, '');
    const htmlPath = resolve(pagesDir, segment || '.', 'index.html');

    if (!existsSync(htmlPath)) {
        console.warn(`  skipped    ${page.path}  (no file at ${htmlPath})`);
        continue;
    }

    const original = readFileSync(htmlPath, 'utf8');
    const seoBlock = buildSeoBlock(page, sitemap.og_image);
    const updated  = updateHtml(original, seoBlock);

    if (updated === original) {
        console.log(`  unchanged  ${page.path}`);
    } else {
        writeFileSync(htmlPath, updated, 'utf8');
        console.log(`  updated    ${page.path}`);
    }
}

// The docs are not in it: Starlight writes their sitemap at /docs/sitemap-index.xml, and robots.txt
// names both (.github/set-stage.sh).
const sitemapPath = resolve(pagesDir, 'sitemap.xml');
const sitemapXml  = buildSitemap(sitemap.pages);

if (existsSync(sitemapPath) && readFileSync(sitemapPath, 'utf8') === sitemapXml) {
    console.log('  unchanged  /sitemap.xml');
} else {
    writeFileSync(sitemapPath, sitemapXml, 'utf8');
    console.log('  updated    /sitemap.xml');
}

console.log('\ndone.');
