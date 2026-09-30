// Writes src/build-info.json, which the header reads: the core the docs describe, and the revision
// of this build.
//
// The core comes from engine.json, which `make build-pages` in the core repo writes when it copies
// the engine into the pages tree. Because it is committed, the docs name the engine they were
// checked against, not whatever the latest release is.
//
// The revision is r<mmdd>.<n>: the date of the HEAD commit, and that commit's place among the
// commits of that day, both in the time zone the commit was made in. Only the commit decides it, so
// the same commit gets the same revision locally and in CI, and re-running a workflow does not
// change it. It needs the whole history: in a shallow checkout the count would be wrong, so there
// is no revision rather than a wrong one. DOCS_REVISION overrides it.
//
// Usage: node scripts/build-info.mjs              write src/build-info.json
//        node scripts/build-info.mjs --revision   print the revision, and exit 1 if there is none

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(root, '..');

const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

export function revision()
{
    if (process.env.DOCS_REVISION) return process.env.DOCS_REVISION;
    try
    {
        // A checkout that is not the pages repo itself (a copy of it, say) has no history of its own.
        if (path.resolve(git('rev-parse', '--show-toplevel')) !== repo) return null;
        if (git('rev-parse', '--is-shallow-repository') === 'true') return null;
        const day = git('log', '-1', '--format=%cd', '--date=format:%Y-%m-%d');
        const sameDay = git('log', '--format=%cd', '--date=format:%Y-%m-%d').split('\n').filter(d => d === day).length;
        return `r${day.slice(5, 7)}${day.slice(8, 10)}.${sameDay}`;
    }
    catch
    {
        return null;
    }
}

function engine()
{
    try { return JSON.parse(readFileSync(path.join(root, 'engine.json'), 'utf8')); }
    catch { return null; }
}

export function writeBuildInfo()
{
    const info = { engine: engine(), revision: revision() };
    writeFileSync(path.join(root, 'src/build-info.json'), `${JSON.stringify(info, null, 4)}\n`);
    return info;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
{
    if (process.argv.includes('--revision'))
    {
        const value = revision();
        if (!value)
        {
            console.error('no revision: this is not a full checkout of the pages repo (CI needs fetch-depth: 0)');
            process.exit(1);
        }
        console.log(value);
    }
    else
    {
        const info = writeBuildInfo();
        const name = info.engine ? `engine ${info.engine.engine}` : 'no engine.json';
        console.log(`[build-info] ${name}, revision ${info.revision ?? 'none'}`);
    }
}
