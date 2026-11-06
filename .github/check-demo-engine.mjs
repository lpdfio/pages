#!/usr/bin/env node
//
// Checks that the demo's engine files come from one engine.
//
// The demo starts the engine from three files beside each other: lpdf_bg.wasm, lpdf-web.js, which the engine refresh
// takes from the core release together with the wasm, and browser.js, lpdf-js's browser bundle. browser.js holds a
// copy of the same wasm glue, built from lpdf-js, and nothing in the refresh builds it. The wasm starts only when
// the glue gives it every import it asks for, and the glue works only when the wasm has every export it calls. A
// glue from another engine fails in the visitor's browser when the demo starts ("function import requires a
// callable"), not in the build, which is how the landing page's demo stopped starting from one refresh to the next.
// So this checks it here, from the wasm's own list of imports and exports: each glue file defines every import the
// wasm asks for and calls only exports it has, and the copies in ui/demo, which `make build-pages` copies into
// www, are the files in www.
//
// Usage: node .github/check-demo-engine.mjs    from the root of this repo; exits 1 on a mismatch.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVED = 'www/assets/js/lpdf-demo';
const MIRROR = 'ui/demo';
const GLUE = ['lpdf-web.js', 'browser.js'];
const ENGINE_FILES = ['lpdf_bg.wasm', ...GLUE];

const REBUILD =
    'Rebuild browser.js from lpdf-js (`npm ci && npm run build`, with the engine\'s lpdf.js, lpdf-web.js and lpdf_bg.wasm in '
    + 'its wasm folder) and copy dist/browser.js to ui/demo and to www/assets/js/lpdf-demo; or take the engine files of one release together.';

/** True when `name` appears in `source` as a whole identifier, not inside a longer one. */
function defines(source, name)
{
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![\\w$])${escaped}(?![\\w$])`).test(source);
}

const problems = [];

const wasm = new WebAssembly.Module(readFileSync(join(SERVED, 'lpdf_bg.wasm')));
const imports = WebAssembly.Module.imports(wasm).map(entry => entry.name);
const exports = new Set(WebAssembly.Module.exports(wasm).map(entry => entry.name));

for (const file of GLUE)
{
    const source = readFileSync(join(SERVED, file), 'utf8');

    for (const name of imports)
    {
        if (!defines(source, name)) problems.push(`${file} does not define the import ${name}, which lpdf_bg.wasm asks for`);
    }

    const called = new Set([...source.matchAll(/(?<![\w$.])wasm\.([A-Za-z_$][\w$]*)/g)].map(match => match[1]));
    for (const name of called)
    {
        if (!exports.has(name)) problems.push(`${file} calls wasm.${name}, which lpdf_bg.wasm does not export`);
    }
}

for (const file of ENGINE_FILES)
{
    if (!readFileSync(join(SERVED, file)).equals(readFileSync(join(MIRROR, file))))
    {
        problems.push(`${MIRROR}/${file} and ${SERVED}/${file} differ`);
    }
}

if (problems.length)
{
    for (const problem of problems) console.error(`::error::${problem}`);
    console.error(`The demo's engine files are not from one engine, so its engine would not start. ${REBUILD}`);
    process.exit(1);
}

console.log(`ok    the demo's wasm (${imports.length} imports, ${exports.size} exports) matches ${GLUE.join(' and ')}, and ${MIRROR} has the same files`);
