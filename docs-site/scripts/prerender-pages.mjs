// Gives the pages of lpdf.io that a browser fills in with script their content as HTML too: the text of the
// support and license pages, the tiers of the pricing page, and the links of the nav and the footer. A reader that
// doesn't run script (Bing, a link preview, an AI crawler, a browser with script off) then gets the page instead of
// an empty one.
//
// Each page is loaded in jsdom with the bundle it names, as a browser would load it, and what its <site-nav>,
// <lpdf-footer>, <tier-card> and <md-html> drew is written into the page's own HTML. It runs on the assembled site
// (assemble-site.sh) and nothing is committed, so the copy comes from the bundle that draws it and cannot drift
// from it:
//
//   <site-nav>, <lpdf-footer>, <tier-card>
//                              get what they drew and `data-prerendered`, which tells the element to replace it
//                              with its own, in the task that connects it (LightElement, in the portal's ui)
//   <md-html src="...">        gets the rendered markdown and loses its src. The content is there, so it fetches
//                              nothing, and the page does not move when the file would have arrived
//
// A page with <md-html> loads the bundle that renders markdown, which is most of the weight of the pages' script, to
// draw what is now in the HTML. Its script tag names the bundle to load once that is done, in data-prerendered-src
// (<script defer src="lpdf-pages-md.js" data-prerendered-src="lpdf-pages.js">), and this puts it in the src.
//
// The links carry the deploy placeholders the bundle does (__PORTAL_URL__). set-stage.sh replaces them in the
// pages as it does in the bundle.
//
// A page with nothing to draw is left as it is, and so is one that was drawn already: its elements are not empty.
//
// Usage: node scripts/prerender-pages.mjs <site-dir>

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { JSDOM, VirtualConsole, requestInterceptor } from 'jsdom';

const ORIGIN = 'https://lpdf.io';
const TAGS = ['site-nav', 'lpdf-footer', 'tier-card', 'md-html'];
const ELEMENTS = new RegExp(`<(${TAGS.join('|')})\\b([^>]*)>\\s*</\\1>`, 'g');
const DRAWN_SCRIPT = /<script defer src="[^"]*" data-prerendered-src="([^"]*)"><\/script>/;
// Not pages of lpdf.io: the docs are Starlight's own HTML, and the rest are what the pages load.
const SKIP_FOLDERS = new Set(['docs', 'assets', 'content', 'schema']);
const SETTLE_TIMEOUT_MS = 20000;

const [siteArg] = process.argv.slice(2);
if (!siteArg)
{
    console.error('usage: prerender-pages.mjs <site-dir>');
    process.exit(2);
}
const site = path.resolve(siteArg);

const MIME_TYPES = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.html': 'text/html' };

/**
 * Answers every request jsdom makes from the site's own files, and anything from anywhere else with nothing: no
 * analytics, no fonts, no network.
 */
const siteFiles = requestInterceptor(async request =>
{
    const { origin, pathname } = new URL(request.url);
    const type = MIME_TYPES[path.extname(pathname)] ?? 'application/octet-stream';
    let body = '';
    if (origin === ORIGIN)
    {
        try { body = await fs.readFile(path.join(site, decodeURIComponent(pathname))); }
        catch { return new Response('', { status: 404, headers: { 'Content-Type': type } }); }
    }
    return new Response(body, { headers: { 'Content-Type': type } });
});

async function pageFiles(dir, rel = '')
{
    const files = [];
    for (const entry of await fs.readdir(path.join(dir, rel), { withFileTypes: true }))
    {
        const child = rel ? `${rel}/${entry.name}` : entry.name;
        if (entry.isDirectory())
        {
            if (rel || !SKIP_FOLDERS.has(entry.name)) files.push(...await pageFiles(dir, child));
        }
        else if (entry.name.endsWith('.html')) files.push(child);
    }
    return files;
}

/** What jsdom lacks and the bundle asks for: media queries, and `fetch`, which <md-html> loads its markdown with. */
function addBrowserApis(window)
{
    window.matchMedia = media => ({
        matches: false, media, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
    });
    window.fetch = async resource =>
    {
        const { pathname } = new URL(resource, window.location.href);
        try
        {
            const text = await fs.readFile(path.join(site, decodeURIComponent(pathname)), 'utf8');
            return { ok: true, status: 200, statusText: 'OK', text: async () => text };
        }
        catch
        {
            return { ok: false, status: 404, statusText: 'Not Found', text: async () => '' };
        }
    };
}

function waitFor(condition, what)
{
    return new Promise((resolve, reject) =>
    {
        const started = Date.now();
        const poll = () =>
        {
            if (condition()) resolve();
            else if (Date.now() - started > SETTLE_TIMEOUT_MS) reject(new Error(`${what} drew nothing in ${SETTLE_TIMEOUT_MS / 1000}s`));
            else setTimeout(poll, 50);
        };
        poll();
    });
}

/**
 * Loads the page as a browser would and returns what each of its elements drew, in document order.
 *
 * @param rel the page's path in the site, such as `support/index.html`.
 * @param source the page's HTML.
 * @param count how many elements to wait for.
 */
async function drawElements(rel, source, count)
{
    const errors = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', error => errors.push(String(error.message).split('\n')[0]));

    const url = `${ORIGIN}/${rel.replace(/(^|\/)index\.html$/, '$1')}`;
    const dom = new JSDOM(source, {
        url, runScripts: 'dangerously', resources: { interceptors: [siteFiles] }, pretendToBeVisual: true, virtualConsole,
        beforeParse: addBrowserApis,
    });
    try
    {
        await new Promise(resolve => dom.window.addEventListener('load', resolve));
        const elements = [...dom.window.document.querySelectorAll(TAGS.join(', '))];
        if (elements.length !== count) throw new Error(`${rel} has ${elements.length} elements to draw and ${count} the script can place`);
        for (const element of elements) await waitFor(() => element.childElementCount > 0, `<${element.localName}> of ${rel}`);

        return elements.map(element =>
        {
            const html = element.innerHTML.replace(/<!--[\s\S]*?-->/g, '');
            if (/Failed to load/.test(html)) throw new Error(`<${element.localName}> of ${rel} could not load: ${element.textContent.trim()}`);
            if (element.localName === 'md-html' && !element.querySelector('h1')) throw new Error(`<md-html> of ${rel} drew no <h1>`);
            // A tier's button is a link only while the tier can be bought; its name and price are always there.
            if (element.localName === 'tier-card' && !(element.querySelector('.tier-label')?.textContent.trim() && element.querySelector('.tier-price')?.textContent.trim()))
                throw new Error(`<tier-card tier="${element.getAttribute('tier')}"> of ${rel} drew no name or price`);
            if (['site-nav', 'lpdf-footer'].includes(element.localName) && !element.querySelector('a[href]')) throw new Error(`<${element.localName}> of ${rel} drew no links`);
            return { html, links: element.querySelectorAll('a[href]').length };
        });
    }
    catch (error)
    {
        if (errors.length) error.message += `\n  the page's script reported:\n    ${errors.join('\n    ')}`;
        throw error;
    }
    finally
    {
        dom.window.close();
    }
}

function place(tag, attributes, html)
{
    if (tag === 'md-html') return `<md-html${attributes.replace(/\s+src="[^"]*"/, '')}>${html}</md-html>`;
    return `<${tag}${attributes} data-prerendered>${html}</${tag}>`;
}

let drawn = 0;
for (const rel of await pageFiles(site))
{
    const file = path.join(site, rel);
    const source = await fs.readFile(file, 'utf8');
    const matches = [...source.matchAll(ELEMENTS)];
    // A page that redirects has no content to give; its elements are there for the redirect's sake.
    if (!matches.length || source.includes('<legal-redirect')) continue;

    const elements = await drawElements(rel, source, matches.length);
    let index = 0;
    let page = source.replace(ELEMENTS, (_, tag, attributes) => place(tag, attributes, elements[index++].html));
    if (matches.some(([, tag]) => tag === 'md-html')) page = page.replace(DRAWN_SCRIPT, '<script defer src="$1"></script>');
    await fs.writeFile(file, page);

    drawn++;
    console.log(`prerendered ${rel}: ${matches.map(([, tag], i) => `${tag} (${elements[i].links} links)`).join(', ')}`);
}
console.log(`Prerendered ${drawn} pages in ${site}`);
