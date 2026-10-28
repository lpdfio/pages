// Generates the JavaScript code for every XML example in the docs, runs it with the JS SDK, and checks that it renders
// the PDF of the XML. The code tabs of the docs come from the engine's code generator, so an example whose code
// renders another document is a tab that teaches the wrong thing.
//
// Each example is wrapped in a whole document first (lib/doc-xml.mjs), and the code is made by the same function the
// docs call for a snippet, so the SDK gets a document to build. One SDK engine renders both the XML and the code,
// which leaves the generator as the only difference. An example the generator cannot express, because it leaves a
// TODO or falls back to L.element, is skipped, as it is in the docs.
//
// The SDK is the published @lpdfio/lpdf of node_modules. An element newer than that release fails the check, so
// LPDF_SDK_DIR names the folder of another SDK build, such as repos/lpdf-js of a core checkout, to check the docs
// of an element that is not released yet.
//
// Usage: node scripts/check-codegen.mjs            list the examples whose code differs, exit 1 if there are any
//        node scripts/check-codegen.mjs --verbose  also list every example that passed or was skipped

import { promises as fs } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { PIXEL, PLACEHOLDER_IMAGES, SRC, loadEngine, walk, wrap, xmlFences } from './lib/doc-xml.mjs';

const sdkDir = process.env.LPDF_SDK_DIR ? path.resolve(process.env.LPDF_SDK_DIR) : undefined;
const { L, LMarkdown, NoAttr } = createRequire(import.meta.url)(sdkDir ?? '@lpdfio/lpdf');
const verbose = process.argv.includes('--verbose');
console.log(`SDK: ${sdkDir ?? '@lpdfio/lpdf of node_modules'}`);

const web = await loadEngine();
const engine = L.engine();
for (const name of PLACEHOLDER_IMAGES) engine.loadImage(name, PIXEL);

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
        try
        {
            const code = web.codegen_fragment_wasm(wrapped.xml, JSON.stringify({ target: 'js' }));
            if (code.includes('TODO') || code.includes('L.element(')) { skipped.push(`${where}  (the generator cannot express it)`); continue; }

            const fromXml = await engine.render(wrapped.xml);
            const fromCode = await engine.render(new Function('L', 'LMarkdown', 'NoAttr', `return ${code};`)(L, LMarkdown, NoAttr));
            if (Buffer.compare(Buffer.from(fromXml), Buffer.from(fromCode)) !== 0)
            {
                failed.push(`${where}  the code renders another PDF than the XML`);
                continue;
            }
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
console.log(`${passed} examples make code that renders the XML's PDF, ${failed.length} do not, ${skipped.length} skipped.`);
for (const f of failed) console.log(`  FAIL  ${f}`);
if (!verbose && skipped.length) console.log('  (run with --verbose to list the skipped ones)');
process.exit(failed.length ? 1 : 0);
