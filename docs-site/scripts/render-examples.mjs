// Renders each example of the docs to a PDF with the engine the site ships, so the viewer on its page shows what that
// engine makes, and the PDF never goes stale. An example is a folder public/examples/<id>/ with its document.xml, its
// document.json if it has data, and the fonts and images the XML names; those folders are written by scripts/sync-examples.mjs
// of the lpdf repository (see README.md, "The example pages"). The PDF is written beside them, as document.pdf, and is
// not kept in git.
//
// Usage: node scripts/render-examples.mjs

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const EXAMPLES = path.resolve(root, 'public/examples');
const ENGINE = path.resolve(root, '../www/assets/js/lpdf-demo');

async function loadEngine()
{
    const web = await import(pathToFileURL(path.join(ENGINE, 'lpdf-web.js')).href);
    await web.default({ module_or_path: await fs.readFile(path.join(ENGINE, 'lpdf_bg.wasm')) });
    return web;
}

/** The ids of the examples: the folders of public/examples that have a document. */
async function exampleIds()
{
    const entries = await fs.readdir(EXAMPLES, { withFileTypes: true }).catch(() => []);
    return entries.filter(e => e.isDirectory()).map(e => e.name).sort();
}

/** The XML without its comments, so a font or image named in the text about the format is not taken for one the document uses. */
function withoutComments(xml)
{
    return xml.replace(/<!--[\s\S]*?-->/g, '');
}

async function renderExample(web, id)
{
    const folder = path.join(EXAMPLES, id);
    const xml = await fs.readFile(path.join(folder, 'document.xml'), 'utf8');
    const data = await fs.readFile(path.join(folder, 'document.json'), 'utf8').catch(() => null);
    const body = withoutComments(xml);
    const engine = new web.LpdfEngine('');
    try
    {
        for (const m of body.matchAll(/<font\s+name="([^"]+)"\s+src="([^"]+)"/g)) engine.load_font(m[1], await fs.readFile(path.join(folder, m[2])));
        for (const m of body.matchAll(/<image\s+name="([^"]+)"\s+src="([^"]+)"/g)) engine.load_image(m[1], await fs.readFile(path.join(folder, m[2])));
        const pdf = engine.render_pdf(xml, data);
        await fs.writeFile(path.join(folder, 'document.pdf'), pdf);
        return pdf.length;
    }
    finally
    {
        engine.free();
    }
}

export async function renderExamples()
{
    const ids = await exampleIds();
    if (ids.length === 0) { console.log('[examples] none in public/examples: run make sync-examples in the lpdf repository'); return; }
    const web = await loadEngine();
    for (const id of ids)
    {
        try
        {
            const size = await renderExample(web, id);
            console.log(`[examples] ${id}.pdf ${(size / 1024).toFixed(0)} KB`);
        }
        catch (e)
        {
            console.error(`[examples] ${id}: ${String(e?.message ?? e).split('\n')[0]}`);
            process.exitCode = 1;
        }
    }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) await renderExamples();
