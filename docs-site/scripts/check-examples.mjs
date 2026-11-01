// Renders every XML example in the docs with the engine the docs demo ships, and lists the ones the engine rejects.
// How a snippet becomes a document, and which ones are skipped, is in lib/doc-xml.mjs.
//
// It proves the engine accepts the example and nothing more: the output is not looked at, and an attribute the
// engine ignores passes. check-codegen.mjs checks the code the docs show for the same examples.
//
// Usage: node scripts/check-examples.mjs            list the failures, exit 1 if there are any
//        node scripts/check-examples.mjs --verbose  also list every example that passed or was skipped

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { CREATED_ON, FILE, FONT, PIXEL, PLACEHOLDER_IMAGES, PROFILE, SRC, declaredFiles, declaredFonts, declaredProfiles, loadEngine, walk, wrap, xmlFences } from './lib/doc-xml.mjs';

const verbose = process.argv.includes('--verbose');

const web = await loadEngine();
const engine = new web.LpdfEngine('');
for (const name of PLACEHOLDER_IMAGES) engine.load_image(name, PIXEL);
engine.set_created_on(CREATED_ON);

let passed = 0;
const failed = [];
const skipped = [];

for (const file of await walk())
{
    const text = await fs.readFile(path.join(SRC, file), 'utf8');
    for (const fence of xmlFences(text))
    {
        const where = `${file}:${fence.line}`;
        const wrapped = wrap(fence.xml);
        if (wrapped.skip) { skipped.push(`${where}  (${wrapped.skip})`); continue; }
        for (const name of declaredFonts(wrapped.xml)) engine.load_font(name, FONT);
        for (const key of declaredFiles(wrapped.xml)) engine.load_file(key, FILE);
        for (const key of declaredProfiles(wrapped.xml)) engine.load_profile(key, PROFILE);
        try
        {
            // No passwords: an example that asks for encryption in its <output> renders unencrypted, as a preview does.
            engine.render_pdf(wrapped.xml, null, null, null, true, new Uint8Array(0));
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
