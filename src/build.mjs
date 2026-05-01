// Builds all authored JS source files for the pages site.
//
// Outputs:
//   www/assets/js/codemirror.min.js  — CodeMirror 6 bundle
//   www/assets/js/lpdf-demo.js       — demo component (vendor imports kept external)
//   www/assets/js/theme.js           — theme toggle script
//   www/assets/js/theme-init.js      — inline theme-init script
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const src = dirname(fileURLToPath(import.meta.url));
const out = resolve(src, '../www/assets/js');

// ── 1. CodeMirror bundle ──────────────────────────────────────────────────────
await build({
    entryPoints: [resolve(src, 'codemirror-entry.mjs')],
    bundle:      true,
    format:      'esm',
    platform:    'browser',
    minify:      true,
    outfile:     resolve(out, 'codemirror.min.js'),
});
console.log('codemirror.min.js');

// ── 2. lpdf-demo component ────────────────────────────────────────────────────
// bundle:false preserves all relative vendor imports exactly as written so they
// continue to resolve correctly from www/assets/js/ at runtime.
await build({
    entryPoints: [resolve(src, 'lpdf-demo.js')],
    bundle:      false,
    format:      'esm',
    minify:      true,
    outfile:     resolve(out, 'lpdf-demo.js'),
});
console.log('lpdf-demo.js');

// ── 3. theme.js ───────────────────────────────────────────────────────────────
await build({
    entryPoints: [resolve(src, 'theme.js')],
    bundle:      false,
    minify:      true,
    outfile:     resolve(out, 'theme.js'),
});
console.log('theme.js');

// ── 4. theme-init.js ──────────────────────────────────────────────────────────
await build({
    entryPoints: [resolve(src, 'theme-init.js')],
    bundle:      false,
    minify:      true,
    outfile:     resolve(out, 'theme-init.js'),
});
console.log('theme-init.js');
