// The languages the docs show code in, in picker order, with where each one lives. The labels
// are also the tab labels scripts/sync-content.mjs writes, since Starlight syncs tabs by label,
// and the storage key is the one Starlight's synced tabs use for the "lang" sync key. The id is
// what a link passes as ?sdk= to open the docs in that language, as lpdf.io's footer does; the
// ids are the ones the old docs used.

export interface CodeLanguage
{
    id: string;
    label: string;
    github: string;
    registry?: { name: string; url: string };
}

export const CODE_LANG_STORAGE_KEY = 'starlight-synced-tabs__lang';

/** Fired on document with the label as detail whenever the picked language changes. */
export const CODE_LANG_EVENT = 'lpdf:code-lang';

export const CODE_LANGUAGES: CodeLanguage[] = [
    { id: 'xml', label: 'XML', github: 'https://github.com/lpdfio/lpdf' },
    {
        id: 'js',
        label: 'Node.js',
        github: 'https://github.com/lpdfio/lpdf-js',
        registry: { name: 'npm', url: 'https://www.npmjs.com/package/@lpdfio/lpdf' },
    },
    {
        id: 'php',
        label: 'PHP',
        github: 'https://github.com/lpdfio/lpdf-php',
        registry: { name: 'Packagist', url: 'https://packagist.org/packages/lpdfio/lpdf' },
    },
    {
        id: 'python',
        label: 'Python',
        github: 'https://github.com/lpdfio/lpdf-python',
        registry: { name: 'PyPI', url: 'https://pypi.org/project/lpdfio-lpdf/' },
    },
    {
        id: 'dotnet',
        label: '.NET',
        github: 'https://github.com/lpdfio/lpdf-dotnet',
        registry: { name: 'NuGet', url: 'https://www.nuget.org/packages/Lpdfio.Lpdf' },
    },
];
