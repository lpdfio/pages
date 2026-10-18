// Checks what search results show for each docs page, as sync-content.mjs gives it: a title of at most 60
// characters and a description of 120 to 160, the lengths a search result shows in full. It also lists the entries of page-meta.json that name no page, as happens when a page is renamed.
//
// Usage: node scripts/check-page-meta.mjs   list the problems, exit 1 if there are any

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncOnce } from './sync-content.mjs';

const MAX_TITLE = 60;
const MIN_DESCRIPTION = 120;
const MAX_DESCRIPTION = 160;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const meta = JSON.parse(await fs.readFile(path.join(root, 'page-meta.json'), 'utf8'));
const pages = await syncOnce();

const problems = [];
for (const key of Object.keys(meta))
{
    if (!pages.has(key)) problems.push(`page-meta.json: ${key} is not a page`);
}
for (const [key, { title, description }] of pages)
{
    if (title.length > MAX_TITLE) problems.push(`${key}: title is ${title.length} characters, over ${MAX_TITLE}: ${title}`);
    if (!description) problems.push(`${key}: no description`);
    else if (description.length < MIN_DESCRIPTION || description.length > MAX_DESCRIPTION)
    {
        problems.push(`${key}: description is ${description.length} characters, outside ${MIN_DESCRIPTION}-${MAX_DESCRIPTION}; `
            + `set it in page-meta.json`);
    }
}

if (problems.length)
{
    console.error(`${problems.length} problems with page titles and descriptions:\n  ${problems.join('\n  ')}`);
    process.exit(1);
}
console.log(`ok    ${pages.size} pages have a title of at most ${MAX_TITLE} characters and a description of ${MIN_DESCRIPTION}-${MAX_DESCRIPTION}`);
