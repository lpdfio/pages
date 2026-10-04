// Local development: sync the docs content, keep it synced while files change, and run the
// Astro dev server. Extra arguments are passed to `astro dev` (for example `-- --port 4322`).

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeBuildInfo } from './build-info.mjs';
import { renderExamples } from './render-examples.mjs';
import { syncOnce, watchContent } from './sync-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

await syncOnce();
await renderExamples();
watchContent();
writeBuildInfo();

const astro = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
const child = spawn(process.execPath, [astro, 'dev', ...process.argv.slice(2)], { stdio: 'inherit', cwd: root });
child.on('exit', code => process.exit(code ?? 0));
