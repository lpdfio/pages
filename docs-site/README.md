# Lpdf docs on Starlight (trial)

A trial of the Lpdf docs built as a static site with [Starlight](https://starlight.astro.build/). It reads the
existing markdown in `../www/docs/content` and never changes it. Nothing here is deployed: the pages
workflow publishes `www/` only.

## Commands

Run from this folder, in PowerShell or any shell. The first time, install the dependencies:

    npm install

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:4321/docs/. Saving a file in `www/docs/content` updates the page within a second |
| `npm run build` | Builds the static site into `dist/`, with the search index and a sitemap |
| `npm run preview` | Serves `dist/` at http://localhost:4321/docs/, as it would be deployed |
| `npm run sync` | Only converts the content into `src/content/docs/` |
| `npm run check` | Renders every XML example in the docs with the engine and lists the ones it rejects |

**On lpdf.local.** The Caddyfile in `_local` serves `dist/` at http://lpdf.local/docs in place of `www/docs`,
beside the rest of the site. Run `npm run build`, then reload; there is no server to restart.

**Search works only after a build.** The index is built with the site, so use `npm run build` then
`npm run preview`, and press Ctrl+K or click Search. In `npm run dev` the search box says it is unavailable.

## Deploy

`.github/workflows/deploy-pages.yml` builds this site once (`npm ci`, `npm run build`), assembles it with the
static pages (`.github/assemble-site.sh`: `www/` with this build at `/docs` in place of `www/docs`), and ships
the same files to pre (`pre.lpdf.io`) and then to prod (`lpdf.io`). `.github/set-stage.sh` sets each stage's
portal URL and CNAME. Every push to `main` deploys, so a docs-only change ships without a core release.

## How the content is converted

`scripts/sync-content.mjs` copies each markdown file into `src/content/docs/`, which is generated and
ignored by git:

- The first `# Heading` becomes the page title, and the first paragraph becomes the meta description.
- `?p=doc/layout/flank` links become `/docs/doc/layout/flank/`.
- `::: sdk js ... :::` sections become Starlight tabs. Those pages become `.mdx`. Headings inside tabs move
  two levels down, so they stay out of "On this page".
- Each XML block becomes tabs: XML, Node.js, PHP, Python and .NET. The code is generated at build time by the
  engine's own generator, the WASM build in `../www/assets/js/lpdf-demo` that the current site runs in the
  browser. A block stays XML only when the generator cannot express it: an element it does not know (full
  documents, assets), data binding (it leaves TODO comments), or text over several lines (a broken string).
  The sync lists these blocks every time it runs.
- Standalone `---` lines are dropped, since the current site hides them.

All tabs share one sync key, so the language picked in the header picker, in any code block or on the
install page shows everywhere, and Starlight remembers it across pages. There is no PDF preview in this trial.

## Checking the examples

`scripts/check-examples.mjs` renders each XML block in `../www/docs/content` with the demo engine (`../www/assets/js/lpdf-demo`) and exits 1 if the engine rejects one. A partial snippet is wrapped in the elements it needs, chosen from its first element, and the images `logo`, `photo`, `avatar` and `watermark` are declared with a one-pixel placeholder. It proves the engine accepts the example and nothing more: an attribute the engine ignores still passes, so it does not replace reading a change against the schema.

## Other files

- `astro.config.mjs`: the site and the sidebar (the same order as the current docs).
- `src/components/page-frame.astro`: the content scrolls in Starlight's own `.main-frame`, below the header,
  not in the window (see "Scrolling" in `src/styles/lpdf.css`), so the header never shifts between pages that
  scroll and pages that don't. This component gives the frame keyboard focus on load and keeps a clicked tab
  in place, both of which assumed a window scroll.
- `src/components/site-title.astro`: replaces Starlight's site title with the lpdf.io header lockup: the
  mark at 24px, "Lpdf" in Radley (`src/fonts`), a "Docs" label and the code language picker.
- `src/components/code-lang-select.astro`: the picker. It switches Starlight's synced tabs. A link can open
  the docs in a language with `?sdk=js` (or `php`, `python`, `dotnet`, `xml`), as lpdf.io's footer does.
- `src/components/lang-links.astro`: replaces Starlight's social links with the picked language's registry
  and GitHub repository, or only the core repository for XML. Registry marks in `src/icons` are from Simple
  Icons (CC0).
- `src/code-languages.ts`: the languages in picker order, with their repository and registry links.
- `engine.json` and `scripts/build-info.mjs`: the stamp in the header, like `v0.22-r0930.3`. The first part is
  the core the docs describe: `engine.json` is written by `make stamp-pages-docs` in the core repo (which
  `make build-pages` and `make dev-pages` run) and committed with the engine copy it names. Hovering the stamp says
  how many commits past the v0.22 release that engine is. The second part is the revision of the pages build: the date of the
  commit and its place among that day's commits, so a commit always gets the same one. `build-info.mjs` works it
  out from git at build time into `src/build-info.json`, which is generated and ignored. It needs the full history,
  so CI checks out with `fetch-depth: 0`; without it the revision is left out. The deploy jobs carry the revision in
  their names in the Actions run.
- `src/components/theme-toggle.astro` and `theme-provider.astro`: the lpdf.io half-circle theme toggle in
  place of Starlight's three-way picker. Dark by default, no "follow the system" state, stored the way
  lpdf.io stores it (`src/theme.ts`), so the choice carries between the site and the docs.
- `src/styles/lpdf.css`: the neutral surfaces and greys, the accent tones and the brand orange, with their
  measured contrast.
- `extra/index.mdx`: the landing page, which exists only in this trial.
