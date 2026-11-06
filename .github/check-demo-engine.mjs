#!/usr/bin/env node
//
// Checks that the demo's engine files come from one engine.
//
// The demo starts the engine from three files beside each other: lpdf_bg.wasm, lpdf-web.js, which the engine refresh
// takes from the core release together with the wasm, and browser.js, lpdf-js's browser bundle. browser.js holds a
// copy of the same wasm glue, which the refresh builds from lpdf-js with the release's engine files. The wasm starts
// only when the glue gives it every import it asks for, and the glue works only when the wasm has every export it
// calls. A glue from another engine fails in the visitor's browser when the demo starts ("function import requires a
// callable"), not in the build, which is how the landing page's demo stopped starting from one refresh to the next.
// So this checks it here, from the wasm's own list of imports and exports: each glue file defines every import the
// wasm asks for and calls only exports it has, and the copies in ui/demo, which `make build-pages` copies into
// www, are the files in www.
//
// That list has names and no parameters, and an export can keep its name and change its parameters: at v0.31.0-rc.1
// lpdfengine_render_pdf went from 5 to 12. So browser.js is also compared with lpdf-web.js, the glue of the same
// release: every wasm.<name>(...) call in browser.js passes as many arguments as the call in lpdf-web.js does.
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
    + 'its wasm folder, as .github/refresh-engine.sh does) and copy dist/browser.js to ui/demo and to www/assets/js/lpdf-demo; '
    + 'or take the engine files of one release together.';

/** True when `name` appears in `source` as a whole identifier, not inside a longer one. */
function defines(source, name)
{
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![\\w$])${escaped}(?![\\w$])`).test(source);
}

/**
 * The number of arguments in the call whose `(` comes just before `start`, up to its matching `)`, or -1 when it is
 * never closed. The glue's calls hold no string or comment, so only the brackets and the commas between them count.
 */
function countArguments(source, start)
{
    let depth = 1;
    let total = 0;
    let hasContent = false;

    for (let at = start; at < source.length; at++)
    {
        const char = source[at];

        if ('([{'.includes(char)) depth++;
        else if (')]}'.includes(char)) depth--;

        if (depth === 0) return total + (hasContent ? 1 : 0);

        if (depth === 1 && char === ',')
        {
            if (hasContent) total++;
            hasContent = false;
        }
        else if (!/\s/.test(char))
        {
            hasContent = true;
        }
    }
    return -1;
}

/** The argument counts of the `wasm.<name>(...)` calls in `source`, as a set for each export `name` it calls. */
function callArguments(source)
{
    const calls = new Map();

    for (const match of source.matchAll(/(?<![\w$.])wasm\.([A-Za-z_$][\w$]*)\(/g))
    {
        const counts = calls.get(match[1]) ?? new Set();
        counts.add(countArguments(source, match.index + match[0].length));
        calls.set(match[1], counts);
    }
    return calls;
}

const problems = [];

const wasm = new WebAssembly.Module(readFileSync(join(SERVED, 'lpdf_bg.wasm')));
const imports = WebAssembly.Module.imports(wasm).map(entry => entry.name);
const exports = new Set(WebAssembly.Module.exports(wasm).map(entry => entry.name));
const argumentCounts = new Map();

for (const file of GLUE)
{
    const source = readFileSync(join(SERVED, file), 'utf8');

    // A bundler that renames the glue's `wasm` variable leaves no call to read, and the checks below would pass on nothing.
    const calls = callArguments(source);
    argumentCounts.set(file, calls);
    if (calls.size === 0) problems.push(`${file} has no wasm.<name>(...) call, so what it calls in the wasm could not be checked`);

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

const reference = argumentCounts.get('lpdf-web.js');
const bundle = argumentCounts.get('browser.js');

for (const [name, counts] of bundle)
{
    const expected = reference.get(name);
    if (!expected)
    {
        problems.push(`browser.js calls wasm.${name}, which lpdf-web.js does not call, so it is not the glue of the same engine`);
        continue;
    }

    for (const count of counts)
    {
        if (count < 0) problems.push(`browser.js has a call of wasm.${name} that is never closed, so the file is cut short`);
        else if (!expected.has(count))
        {
            problems.push(`browser.js calls wasm.${name} with ${count} arguments, and lpdf-web.js with ${[...expected].join(' or ')}`);
        }
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

console.log(
    `ok    the demo's wasm (${imports.length} imports, ${exports.size} exports) matches ${GLUE.join(' and ')}, `
    + `the ${bundle.size} exports browser.js calls get the argument counts lpdf-web.js gives them, and ${MIRROR} has the same files`,
);
