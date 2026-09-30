// Renders every XML example in the docs with the engine the docs demo ships, and lists the ones
// the engine rejects. A snippet is wrapped in the elements it needs, chosen from its first element:
//
//   lpdf                                      as it is
//   document                                  in lpdf
//   section                                   in document and lpdf
//   layout, canvas                            in section and the rest
//   layer                                     in canvas and the rest
//   rect circle ellipse line path             in layer and the rest
//   text, img with x, y, w or anchor          in layer and the rest (canvas text and images)
//   anything else, such as stack or region    in layout and the rest
//
// Images named in a snippet are declared with a one-pixel placeholder, so an example that uses
// `logo` renders. A snippet that is not meant to run is skipped: one that starts with assets or
// tokens, one with an ellipsis in it, and one that is not XML for the engine at all.
//
// It proves the engine accepts the example and nothing more: the output is not looked at, and an
// attribute the engine ignores passes.
//
// Usage: node scripts/check-examples.mjs            list the failures, exit 1 if there are any
//        node scripts/check-examples.mjs --verbose  also list every example that passed or was skipped

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const SRC = path.resolve(root, '../www/docs/content');
const ENGINE = path.resolve(root, '../www/assets/js/lpdf-demo');
const verbose = process.argv.includes('--verbose');

const PLACEHOLDER_IMAGES = ['logo', 'photo', 'avatar', 'watermark'];
const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const CANVAS_SHAPES = new Set(['rect', 'circle', 'ellipse', 'line', 'path']);

async function loadEngine()
{
    const web = await import(pathToFileURL(path.join(ENGINE, 'lpdf-web.js')).href);
    await web.default({ module_or_path: await fs.readFile(path.join(ENGINE, 'lpdf_bg.wasm')) });
    return web;
}

async function walk(dir, rel = '')
{
    const out = [];
    for (const e of await fs.readdir(path.join(dir, rel), { withFileTypes: true }))
    {
        const r = rel ? `${rel}/${e.name}` : e.name;
        if (e.isDirectory()) out.push(...await walk(dir, r));
        else if (e.name.endsWith('.md')) out.push(r);
    }
    return out.sort();
}

/** The XML fences of a markdown file, each with the line its first code line is on. */
function xmlFences(text)
{
    const lines = text.split(/\r?\n/);
    const fences = [];
    for (let i = 0; i < lines.length; i++)
    {
        if (!/^```xml\s*$/.test(lines[i])) continue;
        const start = i + 2;
        const body = [];
        for (i++; i < lines.length && !/^```\s*$/.test(lines[i]); i++) body.push(lines[i]);
        fences.push({ line: start, xml: body.join('\n') });
    }
    return fences;
}

/** The tag of the first element, after comments. */
function firstElement(xml)
{
    const stripped = xml.replace(/<!--[\s\S]*?-->/g, '').trim();
    const m = /^<([a-zA-Z][\w-]*)([^>]*)>/.exec(stripped);
    return m ? { tag: m[1], attrs: m[2] } : null;
}

function wrap(xml)
{
    const first = firstElement(xml);
    if (!first) return { skip: 'not XML' };
    if (xml.includes('…')) return { skip: 'has an ellipsis' };
    if (first.tag === 'assets' || first.tag === 'tokens') return { skip: `starts with ${first.tag}` };
    if (first.tag === 'PackageReference') return { skip: 'not lpdf XML' };

    const images = PLACEHOLDER_IMAGES.map(n => `<image name="${n}"/>`).join('');
    const assets = `<assets>${images}</assets>`;
    let body = xml;
    let level = first.tag;

    if (level === 'text' || level === 'img') level = /\s(x|y|w|anchor)=/.test(first.attrs) ? 'shape' : 'content';
    else if (CANVAS_SHAPES.has(level)) level = 'shape';
    else if (!['lpdf', 'document', 'section', 'layout', 'canvas', 'layer'].includes(level)) level = 'content';

    if (level === 'shape') { body = `<layer>${body}</layer>`; level = 'layer'; }
    if (level === 'layer') { body = `<canvas>${body}</canvas>`; level = 'canvas'; }
    if (level === 'content') { body = `<layout>${body}</layout>`; level = 'layout'; }
    if (level === 'layout' || level === 'canvas') { body = `<section>${body}</section>`; level = 'section'; }
    if (level === 'section') { body = `<document size="letter" margin="48pt">${body}</document>`; level = 'document'; }
    if (level === 'document') { body = `<lpdf version="1">${assets}${body}</lpdf>`; level = 'lpdf'; }
    return { xml: body };
}

const web = await loadEngine();
const engine = new web.LpdfEngine('');
for (const name of PLACEHOLDER_IMAGES) engine.load_image(name, PIXEL);

let passed = 0;
const failed = [];
const skipped = [];

for (const file of await walk(SRC))
{
    const text = await fs.readFile(path.join(SRC, file), 'utf8');
    for (const fence of xmlFences(text))
    {
        const where = `${file}:${fence.line}`;
        const wrapped = wrap(fence.xml);
        if (wrapped.skip) { skipped.push(`${where}  (${wrapped.skip})`); continue; }
        try
        {
            engine.render_pdf(wrapped.xml, null);
            passed++;
            if (verbose) console.log(`ok    ${where}`);
        }
        catch (e)
        {
            failed.push(`${where}  ${String(e?.message ?? e).split('\n')[0]}`);
        }
    }
}

if (verbose) for (const s of skipped) console.log(`skip  ${s}`);
console.log(`${passed} examples render, ${failed.length} fail, ${skipped.length} skipped.`);
for (const f of failed) console.log(`  FAIL  ${f}`);
if (!verbose && skipped.length) console.log('  (run with --verbose to list the skipped ones)');
process.exit(failed.length ? 1 : 0);
