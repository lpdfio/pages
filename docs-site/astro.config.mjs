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
            // The same Umami tracker the static pages of lpdf.io carry.
            head: [
                {
                    tag: 'script',
                    attrs: {
                        defer: true,
                        src: 'https://cloud.umami.is/script.js',
                        'data-website-id': '59a27b01-7833-45ca-89a0-9c16906e45f1',
                    },
                },
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
                        {
                            label: 'Layout',
                            items: [
                                { slug: 'doc/layout', label: 'Overview' },
                                { slug: 'doc/layout/stack', label: 'Stack' },
                                { slug: 'doc/layout/flank', label: 'Flank' },
                                { slug: 'doc/layout/split', label: 'Split' },
                                { slug: 'doc/layout/cluster', label: 'Cluster' },
                                { slug: 'doc/layout/text', label: 'Text' },
                                { slug: 'doc/layout/divider', label: 'Divider' },
                                { slug: 'doc/layout/frame', label: 'Frame' },
                                { slug: 'doc/layout/img', label: 'Image' },
                                { slug: 'doc/layout/grid', label: 'Grid' },
                                { slug: 'doc/layout/table', label: 'Table' },
                                { slug: 'doc/layout/barcode', label: 'Barcode' },
                                { slug: 'doc/layout/link', label: 'Link' },
                                { slug: 'doc/layout/field', label: 'Field' },
                            ],
                        },
                        {
                            label: 'Canvas',
                            items: [
                                { slug: 'doc/canvas', label: 'Overview' },
                                { slug: 'doc/canvas/rect', label: 'Rect' },
                                { slug: 'doc/canvas/circle', label: 'Circle / Ellipse' },
                                { slug: 'doc/canvas/line', label: 'Line' },
                                { slug: 'doc/canvas/path', label: 'Path' },
                                { slug: 'doc/canvas/text', label: 'Text' },
                                { slug: 'doc/canvas/img', label: 'Image' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Data',
                    items: [{ slug: 'data/binding', label: 'Data Binding' }],
                },
                {
                    label: 'Reference',
                    items: [
                        { slug: 'xml/schema', label: 'XML Schema' },
                        { slug: 'xml/elements', label: 'All Elements' },
                    ],
                },
            ],
        }),
    ],
});
