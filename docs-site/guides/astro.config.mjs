// The Lpdf guides as a Starlight site, served at lpdf.io/guides. The docs (the folder above) are the reference, laid out
// by feature; a guide is laid out by goal, so it is a site of its own, with the docs' header, theme and styles. It lives
// in the docs site's folder to share its one install of Astro and Starlight: a second install would load Starlight twice
// for the components it takes from the docs. See README.md, *Guides*.

import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'https://lpdf.io',
    base: '/guides',
    integrations: [
        starlight({
            title: 'Lpdf Guides',
            description: 'Step-by-step guides that build one real thing with Lpdf, in the SDK you use.',
            favicon: '/favicon.ico',
            head: [
                // The same visit counter the static pages of lpdf.io carry (www/assets/js/analytics.js).
                {
                    tag: 'script',
                    attrs: {
                        defer: true,
                        src: '/assets/js/analytics.js',
                        'data-client-id': '47c9883c-f384-4593-b013-a1f6bb166797',
                    },
                },
                // Starlight gives a page no image, though its twitter:card asks for a large one, so a shared link would show
                // none. The pages of lpdf.io share this one (sitemap.yaml's og_image).
                { tag: 'meta', attrs: { property: 'og:image', content: 'https://lpdf.io/assets/images/og-default.png' } },
                { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
                { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
            ],
            components: {
                Header: '../src/components/header.astro',
                PageFrame: '../src/components/page-frame.astro',
                SiteTitle: './src/components/site-title.astro',
                ThemeProvider: '../src/components/theme-provider.astro',
                ThemeSelect: '../src/components/theme-toggle.astro',
            },
            customCss: ['../src/styles/lpdf.css', './src/styles/guides.css'],
            // A guide has a page for each SDK and no sidebar: a reader comes by a link, and a switch under the title (written
            // by scripts/build-guides.mjs) goes to the same guide in another SDK. src/route-data.ts hides the sidebar. With no
            // sidebar there is no order of pages, so no previous and next links either.
            routeMiddleware: './src/route-data.ts',
            sidebar: [],
            pagination: false,
        }),
    ],
    // The header, theme and styles are the docs site's, one folder up.
    vite: { server: { fs: { allow: ['..'] } } },
});
