# Lpdf docs on Starlight

The Lpdf docs, built as a static site with [Starlight](https://starlight.astro.build/) and served at
lpdf.io/docs. It reads the markdown in `../www/docs/content` and never changes it. The pages workflow builds it
and deploys it with the rest of lpdf.io on every push to `main`; see *Deploy*.

## Commands

Run from this folder, in PowerShell or any shell. The first time, install the dependencies:

    npm install

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:4321/docs/. Saving a file in `www/docs/content` updates the page within a second |
| `npm run build` | Builds the static site into `dist/`, with the search index and a sitemap |
| `npm run preview` | Serves `dist/` at http://localhost:4321/docs/, as it would be deployed |
| `npm run sync` | Only converts the content into `src/content/docs/` |
| `npm run check` | Renders every XML example in the docs with the engine and lists the ones it rejects, then checks that the code made for each renders the same PDF, and that every page's title and description fit search results |

**On lpdf.local.** The Caddyfile in `_local` serves `dist/` at http://lpdf.local/docs in place of `www/docs`,
beside the rest of the site. Run `npm run build`, then reload; there is no server to restart.

**Search works only after a build.** The index is built with the site, so use `npm run build` then
`npm run preview`, and press Ctrl+K or click Search. In `npm run dev` the search box says it is unavailable.

## Deploy

`.github/workflows/deploy-pages.yml` builds this site once (`npm ci`, `npm run build`), assembles it with the
static pages (`.github/assemble-site.sh`: `www/` with this build at `/docs` in place of `www/docs`), and ships
the same files to pre (`pre.lpdf.io`) and then to prod (`lpdf.io`). `.github/set-stage.sh` sets each stage's
portal URL and CNAME. Every push to `main` deploys, so a docs-only change ships without a core release.

Each static page loads one script from `www/assets/js`, the one with what the page renders: `lpdf-pages.js` has the
theme, the nav and the footer, which every page needs, and the pages that render more load a bundle that starts
from it, `lpdf-pages-pricing.js`, `lpdf-pages-md.js` or `lpdf-pages-redirect.js`. They are built from
`codesense/portal/ui` (`npm run build:pages`), and `set-stage.sh` and `check-sentinels.sh` go over all of them, so a
new one is named `lpdf-pages-<kind>.js`.

Assembling also gives the static pages the content their script draws, for readers that don't run it
(`scripts/prerender-pages.mjs`). The support and license pages are empty until `<md-html>` fetches and renders their
markdown, the pricing page's tiers are `<tier-card>`s, and the nav and the footer are components too, so without script
a page has no text and no links.
The script loads each assembled page in jsdom with the bundle it names, as a browser would, and writes what
`<site-nav>`, `<lpdf-footer>`, `<tier-card>` and `<md-html>` drew into the page's HTML. Nothing is committed, and the
copy comes from the bundle that draws it, so it cannot drift from it: the tiers say what the bundle's `tiers.ts` says,
and a tier that cannot be bought yet (`earlyAccess`) shows its disabled button, not a link. The nav, the footer and the
tier cards are marked `data-prerendered` and replace the copy with their own, and `<md-html>` loses its `src`, so it
fetches nothing. The markdown renderer and the code
editor it brings are most of the weight of the pages' script, so a page with `<md-html>` names the bundle to load
once its markdown is drawn, in `data-prerendered-src` on its script tag, and the script puts that in the `src`
(support and license then load the 10 KB base bundle, not the 240 KB one). The footer's portal links carry
`__PORTAL_URL__` until `.github/set-stage.sh` sets them, as the bundle's do. `lpdf.local` serves the pages as they are
in git, so it never shows the copy; run `assemble-site.sh` and serve its output to look at it.

## The engine copy

The demo and the docs run on the engine copy committed in this repo: `lpdf-web.js`, `lpdf_bg.wasm` and `browser.js` in
`ui/demo` and `www/assets/js/lpdf-demo`, the schema in `www/schema`, the examples of the demo and the docs (core's
`examples/`), and the stamp `docs-site/engine.json`. `.github/workflows/engine-refresh.yml` takes them from each core
release candidate and release: core's `release.yml` sends `core-rc` and `core-release`, and the workflow runs
`.github/refresh-engine.sh` and opens one PR, from the branch `engine-refresh`, which the releases after it update
instead of opening another. `lpdf-web.js` and `lpdf_bg.wasm` are the release's own assets, checked against its
`SHA256SUMS`. `browser.js` is lpdf-js's browser bundle, which the demo loads (`initLpdf`). It holds a copy of the wasm
glue, so it starts the wasm only when it was built with the `lpdf-web.js` of the same release. The refresh builds it
from lpdf-js `main` with the release's engine files, as the deploy workflow builds the SDK the code tabs run with, and
the PR names the lpdf-js commit it came from. So it follows `main` of the day, and the refresh fails when `main` doesn't
compile against the release's engine.

`.github/check-demo-engine.mjs` checks that `lpdf_bg.wasm`, `lpdf-web.js` and `browser.js` come from one engine, from
the wasm's own list of imports and exports. `lpdf-web.js` and `browser.js` each define every import the wasm asks for
and call only exports it has. `browser.js` passes as many arguments to each `wasm.<name>(…)` call as `lpdf-web.js`
does: the list has no parameters, and an export can keep its name and change them, as `lpdfengine_render_pdf` did from
5 to 12 at v0.31.0-rc.1. And the copies in `ui/demo` are the files in `www`. *Build the site* runs it, and so does the
refresh before it opens or updates the PR. Without it, a mismatch builds and deploys fine, and the demo's engine fails
to start in the visitor's browser. When it fails:

- *In the refresh run*, in the step *Take the engine of the release*, which builds `browser.js`, or in *Check the
  demo's engine files come from one engine*: lpdf-js `main` doesn't match the release's engine. The PR and its branch
  stay as they were. Fix lpdf-js, then run the workflow by hand with the same core tag.
- *In Build the site on another PR*: the demo's files were edited by hand, or only some of them were copied. Run the
  refresh by hand to take the three from one release, or rebuild `browser.js`: in a lpdf-js checkout, put the engine's
  `lpdf.js`, `lpdf-web.js` and `lpdf_bg.wasm` in `wasm/`, run `npm ci && npm run build`, and copy `dist/browser.js` to
  `ui/demo` and to `www/assets/js/lpdf-demo`. A fix pushed to the `engine-refresh` branch itself doesn't last: the next
  release candidate builds the branch again from `main`.

Nothing merges the PR: merge it when the copy should move. A docs PR for a feature the old copy lacks fails
*Check the docs examples render*. Once the refresh PR is merged, close and reopen the docs PR: a re-run reuses the
merge commit of the original run, and a reopened PR gets a new merge with `main`. For a release the dispatch
missed, run the workflow by hand (*Actions → Engine refresh → Run workflow*, from `main`, with a core tag).

The PR is opened with the release App's token, because a PR opened with `GITHUB_TOKEN` starts no checks and `main`
requires *Build the site*. Its key is a secret of the `engine-refresh` environment, which only `main` may use, and
the client id is the repo variable `LPDF_RELEASE_APP_CLIENT_ID`. The workflow mints the token only after it has built
`browser.js`, and gives it to the push and the PR calls alone: lpdf-js's build runs code this repo doesn't own, and it
never runs beside a token with write access. `make build-pages` in a core checkout still copies an engine by hand, one
that no release has yet.

## How the content is converted

`scripts/sync-content.mjs` copies each markdown file into `src/content/docs/`, which is generated and
ignored by git:

- The first `# Heading` becomes the page title, and the first paragraph becomes the meta description.
- `page-meta.json` gives a page what search results and shared links show instead: a `description`, and a `title`
  that becomes the page's `<title>` and `og:title` through `head` frontmatter, so the heading and the sidebar stay
  short. The key is the page's path in the content folder without its extension. A page under `doc/`, `xml/` or
  `data/` is the XML reference, and its title is its heading and "— Lpdf XML reference" unless the entry sets one.
  The example pages and Installation set their own. A new page needs an entry, since a first paragraph is rarely
  120 to 160 characters; `npm run check` says which.
- `?p=doc/layout/row` links become `/docs/doc/layout/row/`.
- `::: sdk js ... :::` sections become Starlight tabs. Those pages become `.mdx`. Headings inside tabs move
  two levels down, so they stay out of "On this page".
- Each XML block becomes tabs: XML, then the same document built in code in Node.js, Python, PHP, .NET and Java
  (`CODE_TABS` in the script). The code is generated at build time by the engine's own generator, the WASM build in
  `../www/assets/js/lpdf-demo` that the demo on the site runs in the browser. Two checks stand behind the code. Each
  SDK's CI has the generator write the code of every fixture of core and of a document for every attribute and every
  value of an enumeration of the schema (one value of the others), builds it with the SDK and fails when it renders
  another PDF than the XML (`scripts/check-codegen-sdk.mjs` in `lpdfio/lpdf`). It leaves out what the generator cannot
  write, which is data binding, and what the engine ignores. So a name an SDK lacks is found for
  nearly every attribute, not only where an example uses it. `npm run check` runs the JavaScript of every example here
  with the JS SDK and fails on the same terms (*Checking the examples*): only JavaScript, but these very examples,
  whose elements combine in ways the corpus, one attribute at a time, does not. A block stays XML only when the generator cannot express it in one of the languages: an
  element it does not know (full documents, assets), data binding (it leaves TODO comments), or several root
  elements. The sync lists these blocks every time it runs.
- Standalone `---` lines are dropped, since the old docs page hid them.

All tabs share one sync key, so the language picked in the header picker, in any code block or on the
install page shows everywhere, and Starlight remembers it across pages. There is no PDF preview.

An old-style link, `/docs/?p=install` or `/docs/?p=doc.layout.row`, goes to the page it names: the landing
page (`extra/index.mdx`) redirects it. The README that npm and PyPI show for each published SDK still carries
those links.

## Checking the examples

`scripts/check-examples.mjs` renders each XML block in `../www/docs/content` with the demo engine (`../www/assets/js/lpdf-demo`) and exits 1 if the engine rejects one. A partial snippet is wrapped in the elements it needs, chosen from its first element, and the images `logo`, `photo`, `avatar` and `watermark` are declared with a one-pixel placeholder. A font a snippet declares with a `src` is loaded with the site's Radley, each file it carries in its `attachments` gets a few placeholder bytes under its `ref` or name, so no `src` is read, or, for `factur-x.xml` and `xrechnung.xml`, the XML of an invoice that names its profile, and every render is dated, as PDF/A needs (`scripts/lib/doc-xml.mjs`). It proves the engine accepts the example and nothing more: an attribute the engine ignores still passes, so it does not replace reading a change against the schema.

`scripts/check-codegen.mjs` takes the same examples and has the engine write their JavaScript, as the code tabs do. It runs that code with the JS SDK (`@lpdfio/lpdf`, a dev dependency, pinned to a release) and exits 1 if it renders another PDF than the XML, which is a tab that teaches the wrong thing. The SDK's own engine renders both, so the code generator is the only difference. An example the generator leaves as XML only is skipped. `LPDF_ENGINE_DIR=<folder with lpdf-web.js and lpdf_bg.wasm>` checks an engine that is not in the tree yet, such as `dist/web` of a core checkout (copy `lpdf.js` as `lpdf-web.js`). The released SDK has no element that came after it, so the docs of one fail this check until the dependency moves to the release that ships it: `LPDF_SDK_DIR=<folder of an SDK build>` checks them against another build, such as `repos/lpdf-js` of a core checkout, which is what `make check-pages-docs` there does. The deploy workflow does the same: it builds lpdf-js `main` against the engine of the newest core release, pre-releases included, so a build is not held until the SDK with a new element is published. The engine copy in the tree is what `check-examples` and the demo run, and the Engine refresh workflow keeps it current (*The engine copy*), so a docs PR for a newer element waits for that PR to merge and is then closed and reopened.

## The example pages

The seven pages under Examples (`../www/docs/content/examples/`, `public/examples/` for the files they link to, and the
sidebar entries, which `astro.config.mjs` reads from `examples/index.json` there) are **generated**: do not edit them here.
The source is `examples/` in the lpdf repository, and `make sync-examples` there writes the pages, the downloads, the
demo's examples and the extension's templates from it. A page shows the document whole when it is short, and links it when
it is not. Its viewer is the one of the demo (`../www/assets/js/lpdf-demo/viewer`), given a PDF that `scripts/render-examples.mjs` renders
from the example with the engine in `../www/assets/js/lpdf-demo`, on every `npm run sync`, `build` and `dev`. That PDF is not in git.

## Other files

- `astro.config.mjs`: the site and the sidebar.
- `scripts/prerender-pages.mjs`: draws what the pages fill in with script into their HTML (see "Deploy").
- `page-meta.json` and `scripts/check-page-meta.mjs`: the titles and descriptions search results show, and the
  check that they are at most 60 characters and 120 to 160 (see "How the content is converted").
- `src/components/page-frame.astro`: with a mouse, the content scrolls in Starlight's own `.main-frame`, below
  the header, not in the window (see "Scrolling" in `src/styles/lpdf.css`), so the header never shifts between
  pages that scroll and pages that don't. This component gives the frame keyboard focus on load and keeps a
  clicked tab in place, both of which assumed a window scroll. A touch screen scrolls the window, because iOS
  Safari clips a fixed element (the mobile "On this page" bar) that is inside a scroller but above it.
- `src/components/header.astro`: Starlight's header with the pre-release notice as a second, full-width row
  under it. The two rows' heights are `--lpdf-header-height` and `--lpdf-notice-height` in `src/styles/lpdf.css`,
  and `--sl-nav-height`, which Starlight derives the page offsets from, is their sum. Remove the component, its
  entry in `astro.config.mjs` and those variables at v1.0.
- `src/components/site-title.astro`: replaces Starlight's site title with the lpdf.io header lockup: the
  mark at 24px, "Lpdf" in Radley (`src/fonts`), a "Docs" label and the code language picker.
- `src/components/code-lang-select.astro`: the picker. It switches Starlight's synced tabs. A link can open
  the docs in a language with `?sdk=js` (or `php`, `python`, `dotnet`, `java`, `xml`), as lpdf.io's footer does.
- `src/components/lang-links.astro`: replaces Starlight's social links with the picked language's registry
  and GitHub repository, or only the core repository for XML. Registry marks in `src/icons` are from Simple
  Icons, unmodified: CC0, except Packagist's (MIT) and Apache Maven's (Apache-2.0), which stands for Maven Central.
- `src/code-languages.ts`: the languages in picker order, with their repository and registry links.
- `engine.json` and `scripts/build-info.mjs`: the stamp in the header, like `v0.22-r0930.3`. The first part is
  the core the docs describe: `engine.json` is written by the Engine refresh workflow, or by `make stamp-pages-docs`
  in the core repo (which `make build-pages` and `make dev-pages` run), and committed with the engine copy it names. Hovering the stamp says
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
- `extra/index.mdx`: the landing page. It is written here, not in `www/docs/content`, and carries the redirect for
  old `?p=` links.
