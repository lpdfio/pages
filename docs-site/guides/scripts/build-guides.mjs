// Writes one page for each SDK from each guide source in ../content, into src/content/docs/<guide>/<sdk>.md.
//
// A guide is one Markdown file. Its words are shared by all five pages. Code, and text that depends on the SDK, such as
// the install step, sit in sections that name their SDK:
//
//     ::: sdk js
//     ...only the JavaScript page has this...
//     :::
//
// The ids are the ones the docs use (docs-site/scripts/sync-content.mjs). `{{language}}` in the text is the SDK's name,
// `{{createdOn}}`, `{{invoiceMap}}` and `{{generatePdf}}` the names the SDK gives them (`created_on` in Python), and
// `{{otherGuides}}` the links to the other SDKs' pages.
//
// An SDK that has no section in the source gets a placeholder page, so writing its sections is what makes its guide
// appear. One that has some must have as many as the most complete one has, so no page is left with a hole.
//
// A code block with `title="name"` is checked against the file of that name that the reader downloads, in
// public/<guide>/files/<sdk>/ or public/<guide>/files/: the code on the page is the code that was run.
//
// The pages are generated and ignored by git; the hand-written ones are .mdx (see .gitignore).

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * The SDKs, in the order the docs list them (docs-site/src/code-languages.ts), which the guides' switch and links follow. `id` is
 * the section id, `slug` the page's folder name, `repo` and `registry` where the code and the package are (the links of lpdf.io's
 * front page).
 */
const SDKS = [
    { id: 'js', slug: 'javascript', language: 'JavaScript', repo: 'https://github.com/lpdfio/lpdf-js', registry: { name: 'npm', url: 'https://www.npmjs.com/package/@lpdfio/lpdf' }, names: { createdOn: 'createdOn', invoiceMap: 'invoiceMap', generatePdf: 'generatePdf' } },
    { id: 'python', slug: 'python', language: 'Python', repo: 'https://github.com/lpdfio/lpdf-python', registry: { name: 'PyPI', url: 'https://pypi.org/project/lpdfio-lpdf/' }, names: { createdOn: 'created_on', invoiceMap: 'invoice_map', generatePdf: 'generate_pdf' } },
    { id: 'java', slug: 'java', language: 'Java', repo: 'https://github.com/lpdfio/lpdf-java', registry: { name: 'Maven Central', url: 'https://central.sonatype.com/artifact/io.lpdf/lpdf' }, names: { createdOn: 'createdOn', invoiceMap: 'invoiceMap', generatePdf: 'generatePdf' } },
    { id: 'dotnet', slug: 'csharp', language: 'C#', repo: 'https://github.com/lpdfio/lpdf-dotnet', registry: { name: 'NuGet', url: 'https://www.nuget.org/packages/Lpdfio.Lpdf' }, names: { createdOn: 'CreatedOn', invoiceMap: 'InvoiceMap', generatePdf: 'GeneratePdf' } },
    { id: 'php', slug: 'php', language: 'PHP', repo: 'https://github.com/lpdfio/lpdf-php', registry: { name: 'Packagist', url: 'https://packagist.org/packages/lpdfio/lpdf' }, names: { createdOn: 'createdOn', invoiceMap: 'invoiceMap', generatePdf: 'generatePdf' } },
];

const SDK_SECTION = /^::: sdk (\w+)\n([\s\S]*?)^:::[ \t]*$\n?/gm;
const CODE_BLOCK = /^```\S*[^\S\n]+title="([^"]+)"\n([\s\S]*?)^```[ \t]*$/gm;

function fail(guide, message)
{
    throw new Error(`content/${guide}.md: ${message}`);
}

/** The source's frontmatter as `key: "value"` lines, and the text after it. */
function readSource(guide)
{
    const text = readFileSync(join(ROOT, 'content', `${guide}.md`), 'utf8');
    const match = text.match(/^---\n([\s\S]*?)\n---\n+([\s\S]*)$/);
    if (!match) fail(guide, 'it must start with a frontmatter block');

    const meta = {};
    for (const line of match[1].split('\n'))
    {
        const pair = line.match(/^(\w+): "(.*)"$/);
        if (!pair) fail(guide, `frontmatter line is not key: "value": ${line}`);
        meta[pair[1]] = pair[2];
    }
    for (const key of ['title', 'description'])
    {
        if (!meta[key]) fail(guide, `frontmatter has no ${key}`);
    }
    return { meta, body: match[2] };
}

/** How many sections each SDK has, which must be known SDKs. */
function countSections(guide, body)
{
    const counts = Object.fromEntries(SDKS.map(({ id }) => [id, 0]));
    for (const [, id] of body.matchAll(SDK_SECTION))
    {
        if (!(id in counts)) fail(guide, `"::: sdk ${id}": not an SDK (${SDKS.map(s => s.id).join(', ')})`);
        counts[id]++;
    }
    return counts;
}

/** The body for one SDK: its sections in place, the others' gone. */
function bodyFor(body, sdk)
{
    const text = body.replace(SDK_SECTION, (_, id, content) => (id === sdk.id ? content.replace(/\n+$/, '\n') + '\n' : ''));

    // Removing a section leaves blank lines to collapse, but not inside a code block, where they are the code's.
    const blocks = [];
    const guarded = text.replace(/^[ \t]*```[\s\S]*?^[ \t]*```[ \t]*$/gm, block => `\u0000${blocks.push(block) - 1}\u0000`);
    return guarded.replace(/\n{3,}/g, '\n\n').replace(/\u0000(\d+)\u0000/g, (_, index) => blocks[index]);
}

/**
 * What search results show: the title, which is also the browser tab's, and a description of 120 to 160. The docs keep a
 * title to 60 characters; a guide's names its SDK too, so it may run a little longer: JavaScript's runs to 66.
 */
const TITLE_MAX = 66;

function checkMeta(guide, values)
{
    if (values.title.length > TITLE_MAX) fail(guide, `title over ${TITLE_MAX} characters (${values.title.length}): ${values.title}`);
    const length = values.description.length;
    if (length < 120 || length > 160) fail(guide, `description is ${length} characters, not 120 to 160: ${values.description}`);
}

/** Every block with a title is the file of that name, as the reader downloads it. */
function checkCode(guide, sdk, body)
{
    for (const [, name, code] of body.matchAll(CODE_BLOCK))
    {
        const candidates = [join(ROOT, 'public', guide, 'files', sdk.slug, name), join(ROOT, 'public', guide, 'files', name)];
        const file = candidates.find(existsSync);
        if (!file) fail(guide, `${sdk.slug}: the code block titled "${name}" has no file (looked in ${candidates.join(', ')})`);
        if (readFileSync(file, 'utf8').trim() !== code.trim()) fail(guide, `${sdk.slug}: the code block titled "${name}" is not the file ${file}`);
    }
}

function frontmatter({ title, description })
{
    return [
        '---',
        `title: "${title}"`,
        `description: "${description}"`,
        'head:',
        '    - tag: title',
        `      content: "${title}"`,
        '---',
        '',
    ].join('\n');
}

/** The links to the same guide in the other SDKs, as the first thing under the title. */
function languageSwitch(current, written)
{
    const items = SDKS.map(sdk =>
    {
        if (sdk === current) return `<span aria-current="page">${sdk.language}</span>`;
        if (written.includes(sdk)) return `<a href="../${sdk.slug}/">${sdk.language}</a>`;
        return `<span aria-disabled="true" title="Not written yet">${sdk.language}</span>`;
    });
    return `<nav class="guide-languages not-content" aria-label="The language of this guide">\n<span>Language</span>\n${items.join('\n')}\n</nav>\n\n`;
}

/** The VS Code extension's two listings: Microsoft's marketplace, and Open VSX, which VS Code's forks (VSCodium, Cursor) read. */
const EXTENSION = {
    marketplace: 'https://marketplace.visualstudio.com/items?itemName=lpdfio.lpdf',
    openVsx: 'https://open-vsx.org/extension/lpdfio/lpdf',
};

/**
 * Two lines under the switch, which depend on the language the reader chose: where this SDK's code and package are, and its
 * documentation (the docs take the language as `?sdk=<id>`) with the extension.
 */
function sourceLinks(sdk)
{
    const link = (url, text) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    const source = `<div class="guide-source not-content">\n<span>Source</span>\n${link(sdk.repo, 'GitHub')}\n${link(sdk.registry.url, sdk.registry.name)}\n</div>\n\n`;
    const more = `<div class="guide-more not-content">\n<span>More</span>\n<a href="/docs/?sdk=${sdk.id}">Documentation</a>\n${link(EXTENSION.marketplace, 'VS Code Marketplace')}\n${link(EXTENSION.openVsx, 'Open VSX')}\n</div>\n\n`;
    return source + more;
}

const NOTE = '<!-- Generated from content/<guide>.md by scripts/build-guides.mjs. Edit the source, not this page. -->\n\n';

function build(guide)
{
    const { meta, body } = readSource(guide);
    const counts = countSections(guide, body);
    const most = Math.max(...Object.values(counts));
    const written = SDKS.filter(({ id }) => counts[id] > 0);
    if (!written.length) fail(guide, 'no SDK has a section');

    for (const { id, language } of written)
    {
        if (counts[id] !== most) fail(guide, `${language} has ${counts[id]} sections and the most complete SDK has ${most}`);
    }

    for (const sdk of SDKS)
    {
        const values = Object.fromEntries(Object.entries(meta).map(([key, value]) => [key, value.replaceAll('{{language}}', sdk.language)]));
        checkMeta(guide, values);

        const isWritten = counts[sdk.id] > 0;
        let page;
        if (isWritten)
        {
            const others = written.filter(other => other !== sdk).map(other => `[${other.language}](../${other.slug}/)`);
            // A page with no other written guide has nothing to link to: its line goes.
            const text = others.length
                ? bodyFor(body, sdk).replace('{{otherGuides}}', others.join(', '))
                : bodyFor(body, sdk).replace(/^.*\{\{otherGuides\}\}.*\n/m, '');
            page = Object.entries({ language: sdk.language, ...sdk.names }).reduce((out, [key, value]) => out.replaceAll(`{{${key}}}`, value), text);
            checkCode(guide, sdk, page);
        }
        else
        {
            const first = written[0];
            page = `This guide is not written yet. The [${first.language} guide](../${first.slug}/) has the same steps: the template is the same, and only the code is in another language.\n`;
        }
        if (/\{\{\w+\}\}/.test(page)) fail(guide, `${sdk.slug}: an unreplaced {{…}} is left`);

        writeFileSync(join(ROOT, 'src/content/docs', guide, `${sdk.slug}.md`), frontmatter(values) + NOTE.replace('<guide>', guide) + languageSwitch(sdk, written) + sourceLinks(sdk) + page);
        console.log(`${guide}/${sdk.slug}: ${isWritten ? `${page.split('\n').length} lines` : 'placeholder'}`);
    }
}

for (const file of readdirSync(join(ROOT, 'content')).filter(name => name.endsWith('.md')))
{
    build(file.replace(/\.md$/, ''));
}
