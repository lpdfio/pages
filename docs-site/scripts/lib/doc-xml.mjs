// What the checks of the docs share: the engine the docs ship, the markdown they read, and how an XML example becomes
// a document the engine can render.
//
// A snippet is wrapped in the elements it needs, chosen from its first element:
//
//   lpdf                                      as it is
//   document                                  in lpdf
//   section                                   in document and lpdf
//   layout, layer                             in section and the rest
//   rect circle ellipse line path             in layer and the rest
//   text-at img-at barcode-at                 in layer and the rest
//   anything else, such as column or region   in layout and the rest
//
// Images named in a snippet are declared with a one-pixel placeholder, so an example that uses `logo` renders. A
// snippet that is not meant to run is skipped: one that starts with assets or tokens, one with an ellipsis in it,
// and one that is not XML for the engine at all.
//
// LPDF_ENGINE_DIR names another folder with lpdf-web.js and lpdf_bg.wasm, to check an engine that is not in the tree
// yet, such as the dist/web of a core checkout.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const SRC = path.resolve(root, '../www/docs/content');
const ENGINE = process.env.LPDF_ENGINE_DIR
    ? path.resolve(process.env.LPDF_ENGINE_DIR)
    : path.resolve(root, '../www/assets/js/lpdf-demo');

export const PLACEHOLDER_IMAGES = ['logo', 'photo', 'avatar', 'watermark'];
export const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const LAYER_CONTENT = new Set(['rect', 'circle', 'ellipse', 'line', 'path', 'text-at', 'img-at', 'barcode-at']);

export async function loadEngine()
{
    const web = await import(pathToFileURL(path.join(ENGINE, 'lpdf-web.js')).href);
    await web.default({ module_or_path: await fs.readFile(path.join(ENGINE, 'lpdf_bg.wasm')) });
    return web;
}

/** The markdown files of the docs, relative to SRC. */
export async function walk(dir = SRC, rel = '')
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
export function xmlFences(text)
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

/** The snippet as a whole document, or the reason it is not one to run. */
export function wrap(xml)
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

    if (LAYER_CONTENT.has(level)) { body = `<layer>${body}</layer>`; level = 'layer'; }
    else if (!['lpdf', 'document', 'section', 'layout', 'layer'].includes(level)) level = 'content';

    if (level === 'content') { body = `<layout margin="48pt">${body}</layout>`; level = 'layout'; }
    if (level === 'layout' || level === 'layer') { body = `<section>${body}</section>`; level = 'section'; }
    if (level === 'section') { body = `<document size="letter">${body}</document>`; level = 'document'; }
    if (level === 'document') { body = `<lpdf version="1">${assets}${body}</lpdf>`; level = 'lpdf'; }
    return { xml: body };
}
