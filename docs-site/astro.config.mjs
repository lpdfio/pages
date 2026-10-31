// The Lpdf docs as a Starlight site, served at lpdf.io/docs. Content comes from ../www/docs/content
// through scripts/sync-content.mjs; see README.md.

import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// The examples in the sidebar are the ones scripts/sync-examples.mjs of the lpdf repo wrote, in their order, so adding
// an example needs no change here.
const exampleItems = JSON.parse(readFileSync(new URL('../www/docs/content/examples/index.json', import.meta.url), 'utf8'))
    .examples.map(({ id, label }) => ({ slug: `examples/${id}`, label }));

export default defineConfig({
    site: 'https://lpdf.io',
    base: '/docs',
    integrations: [
        starlight({
            title: 'Lpdf Docs',
            description: 'Reference and guides for Lpdf: PDF as code on every platform.',
            favicon: '/favicon.ico',
            head: [
                // The same Umami tracker the static pages of lpdf.io carry.
                {
                    tag: 'script',
                    attrs: {
                        defer: true,
                        src: 'https://cloud.umami.is/script.js',
                        'data-website-id': '59a27b01-7833-45ca-89a0-9c16906e45f1',
                    },
                },
                // Starlight gives a page no image, though its twitter:card asks for a large one, so a shared
                // link would show none. The pages of lpdf.io share this one (sitemap.yaml's og_image).
                { tag: 'meta', attrs: { property: 'og:image', content: 'https://lpdf.io/assets/images/og-default.png' } },
                { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
                { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
            ],
            components: {
                Header: './src/components/header.astro',
                PageFrame: './src/components/page-frame.astro',
                SiteTitle: './src/components/site-title.astro',
                SocialIcons: './src/components/lang-links.astro',
                ThemeProvider: './src/components/theme-provider.astro',
                ThemeSelect: './src/components/theme-toggle.astro',
            },
            customCss: ['./src/styles/lpdf.css'],
            sidebar: [
                {
                    label: 'Getting Started',
                    items: [
                        { slug: 'install', label: 'Installation' },
                    ],
                },
                {
                    label: 'Examples',
                    items: exampleItems,
                },
                {
                    label: 'Document',
                    items: [
                        { slug: 'doc/section', label: 'Section' },
                        { slug: 'doc/toc', label: 'Table of Contents' },
                        { slug: 'doc/markdown', label: 'Markdown' },
                        {
                            label: 'Layout',
                            items: [
                                { slug: 'doc/layout', label: 'Overview' },
                                { slug: 'doc/layout/column', label: 'Column' },
                                { slug: 'doc/layout/row', label: 'Row' },
                                { slug: 'doc/layout/text', label: 'Text' },
                                { slug: 'doc/layout/list', label: 'List' },
                                { slug: 'doc/layout/footnote', label: 'Footnote' },
                                { slug: 'doc/layout/code', label: 'Code' },
                                { slug: 'doc/layout/divider', label: 'Divider' },
                                { slug: 'doc/layout/frame', label: 'Frame' },
                                { slug: 'doc/layout/img', label: 'Image' },
                                { slug: 'doc/layout/shape', label: 'Shape' },
                                { slug: 'doc/layout/grid', label: 'Grid' },
                                { slug: 'doc/layout/table', label: 'Table' },
                                { slug: 'doc/layout/barcode', label: 'Barcode' },
                                { slug: 'doc/layout/link', label: 'Link' },
                                { slug: 'doc/layout/bookmark', label: 'Bookmark' },
                                { slug: 'doc/layout/field', label: 'Field' },
                            ],
                        },
                        {
                            label: 'Layer',
                            items: [
                                { slug: 'doc/layer', label: 'Overview' },
                                { slug: 'doc/layer/rect', label: 'Rect' },
                                { slug: 'doc/layer/circle', label: 'Circle / Ellipse' },
                                { slug: 'doc/layer/line', label: 'Line' },
                                { slug: 'doc/layer/path', label: 'Path' },
                                { slug: 'doc/layer/text-at', label: 'Text' },
                                { slug: 'doc/layer/img-at', label: 'Image' },
                                { slug: 'doc/layer/barcode-at', label: 'Barcode' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Data',
                    items: [{ slug: 'data/binding', label: 'Data Binding' }],
                },
                {
                    label: 'PDF output',
                    items: [
                        { slug: 'encryption', label: 'Encryption' },
                        { slug: 'pdfa', label: 'PDF/A' },
                    ],
                },
                {
                    label: 'Reference',
                    items: [
                        { slug: 'xml/schema', label: 'XML Schema' },
                        { slug: 'xml/elements', label: 'All Elements' },
                        // What each version changed is in the GitHub release notes, so the docs link there
                        // rather than keep a copy.
                        {
                            label: 'Releases',
                            link: 'https://github.com/lpdfio/lpdf/releases',
                            attrs: { target: '_blank', rel: 'noopener noreferrer' },
                        },
                    ],
                },
            ],
        }),
    ],
});
