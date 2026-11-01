// What the checks of the docs share: the engine the docs ship, the markdown they read, and how an XML example becomes
// a document the engine can render.
//
// A snippet is wrapped in the elements it needs, chosen from its first element:
//
//   lpdf                                      as it is
//   document                                  in lpdf
//   section                                   in document and lpdf
//   layout, layer, markdown                   in section and the rest
//   rect circle ellipse line path             in layer and the rest
//   text-at img-at barcode-at                 in layer and the rest
//   anything else, such as column or region   in layout and the rest
//
// Images named in a snippet are declared with a one-pixel placeholder, so an example that uses `logo` renders. A font
// a snippet declares with a src is loaded with the site's Radley (FONT, `declaredFonts`), so a PDF/A example, which
// refuses a font that is not embedded, renders, and the checks give every render a date (CREATED_ON), which PDF/A
// needs. Each file a snippet carries in its attachments is loaded under its ref or name with a few placeholder bytes
// (FILE, `declaredFiles`), so its src is never read, and each color profile it declares with the header of a printer
// profile (PROFILE, `declaredProfiles`), which a PDF/X example names as its press profile. A
// snippet that is not meant to run is skipped: one that starts with assets or tokens, one with an ellipsis in it,
// one that names a file of Markdown rules with a src, and one that is not XML for the engine at all.
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

/** The face loaded for each font a snippet declares with a src: the Radley of the site's header. */
export const FONT = await fs.readFile(path.resolve(root, 'src/fonts/Radley-Regular.ttf'));

/** The date of every render of the checks, which a document that asks for PDF/A needs. */
export const CREATED_ON = '2026-01-01T00:00:00Z';

/** The bytes loaded for each file a snippet carries in its attachments. */
export const FILE = Buffer.from('Placeholder for a file the docs attach to a PDF.\n');

/**
 * The header of an ICC printer profile in CMYK, with a description and nothing else: enough for the engine to take it
 * as the press profile of a PDF/X example.
 */
export const PROFILE = (() =>
{
    const description = 'Placeholder press';
    const desc = Buffer.alloc(12 + description.length + 1 + 12);
    desc.write('desc', 0, 'latin1');
    desc.writeUInt32BE(description.length + 1, 8);
    desc.write(description, 12, 'latin1');
    const header = Buffer.alloc(128);
    header.write('prtrCMYKLab ', 12, 'latin1');
    header.write('acsp', 36, 'latin1');
    const table = Buffer.alloc(16);
    table.writeUInt32BE(1, 0);
    table.write('desc', 4, 'latin1');
    table.writeUInt32BE(144, 8);
    table.writeUInt32BE(desc.length, 12);
    const bytes = Buffer.concat([header, table, desc]);
    bytes.writeUInt32BE(bytes.length, 0);
    return bytes;
})();

/** The key, `ref` or else `name`, of each color profile `xml` declares, which a PDF/X example renders only once it is loaded. */
export function declaredProfiles(xml)
{
    return [...xml.matchAll(/<profile\b[^>]*>/g)]
        .map(([tag]) => tag.match(/\bref="([^"]*)"/)?.[1] ?? tag.match(/\bname="([^"]*)"/)?.[1])
        .filter(Boolean);
}

/** The key, `ref` or else `name`, of each file `xml` carries in its attachments, which renders only once it is loaded. */
export function declaredFiles(xml)
{
    return [...xml.matchAll(/<file\b[^>]*>/g)]
        .map(([tag]) => tag.match(/\bref="([^"]*)"/)?.[1] ?? tag.match(/\bname="([^"]*)"/)?.[1])
        .filter(Boolean);
}

/** The names of the fonts `xml` declares with a src, which the engine draws in only once they are loaded. */
export function declaredFonts(xml)
{
    return [...xml.matchAll(/<font\b[^>]*>/g)]
        .filter(([tag]) => /\bsrc="/.test(tag))
        .map(([tag]) => tag.match(/\bname="([^"]*)"/)?.[1])
        .filter(Boolean);
}

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
    if (/<markdown-styles\b[^>]*\bsrc=/.test(xml)) return { skip: 'names a file of rules, which the check does not load' };

    const images = PLACEHOLDER_IMAGES.map(n => `<image name="${n}"/>`).join('');
    const assets = `<assets>${images}</assets>`;
    let body = xml;
    let level = first.tag;

    if (LAYER_CONTENT.has(level)) { body = `<layer>${body}</layer>`; level = 'layer'; }
    else if (!['lpdf', 'document', 'section', 'layout', 'layer', 'markdown'].includes(level)) level = 'content';

    if (level === 'content') { body = `<layout margin="48pt">${body}</layout>`; level = 'layout'; }
    if (level === 'layout' || level === 'layer' || level === 'markdown') { body = `<section>${body}</section>`; level = 'section'; }
    if (level === 'section') { body = `<document size="letter">${body}</document>`; level = 'document'; }
    if (level === 'document') { body = `<lpdf version="1">${assets}${body}</lpdf>`; level = 'lpdf'; }
    return { xml: body };
}
