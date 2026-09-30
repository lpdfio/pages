#!/usr/bin/env bash
#
# Builds the folder that gets deployed: the static site in www/, with the docs site's build
# (docs-site/dist) served at /docs in place of the old docs.
#
# www/docs is left out. It holds the docs markdown, which docs-site reads at build time, and the old
# docs page; neither is served any more. Run it after `npm run build` in docs-site.
#
# Usage: assemble-site.sh <output-dir>
set -euo pipefail

out=${1:?usage: assemble-site.sh <output-dir>}
docs=docs-site/dist

if [ ! -f "$docs/index.html" ]; then
    echo "::error::$docs/index.html is missing — build the docs first ('npm run build' in docs-site)"
    exit 1
fi

rm -rf "$out"
mkdir -p "$out/docs"
cp -a www/. "$out/"
rm -rf "$out/docs"
mkdir -p "$out/docs"
cp -a "$docs/." "$out/docs/"

# The pre stage is served from a branch, and Pages runs Jekyll over a branch: it drops every folder
# whose name starts with an underscore, which is where Starlight puts its CSS and JS (_astro).
touch "$out/.nojekyll"

# Fail here rather than deploy the wrong thing.
if [ -e "$out/docs/content" ] || grep -q 'docs-landing' "$out/docs/index.html"; then
    echo "::error::the old docs are still in $out/docs"
    exit 1
fi
if [ ! -f "$out/docs/pagefind/pagefind.js" ]; then
    echo "::error::the docs search index is missing from $out/docs/pagefind"
    exit 1
fi

echo "Assembled $out: $(find "$out" -type f | wc -l) files, docs at /docs"
