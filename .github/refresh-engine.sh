#!/usr/bin/env bash
#
# Takes the engine of a core release into this tree, which is what `make build-pages` does in a core
# checkout, minus the parts that don't come from core:
#
#   ui/demo, www/assets/js/lpdf-demo   lpdf-web.js and lpdf_bg.wasm, browser.js built with them, and the
#                                      demo's examples
#   www/schema, www/schema/1           schema/lpdf.xsd at the tag
#   docs-site/engine.json              the stamp the docs header shows
#   www/docs/content/examples,         the example pages and their downloads
#   docs-site/public/examples
#
# The engine files are the release's own assets, the build the SDKs are tested with, and they are
# checked against the release's SHA256SUMS. A build on a developer's machine differs from them in
# the compiler's patch version, and nothing else.
#
# browser.js is lpdf-js's browser bundle, and holds a copy of the wasm glue, so it starts the wasm only
# when it was built with the lpdf-web.js of the same release. It is built here from lpdf-js `main` with
# the release's engine files, as deploy-pages.yml builds the SDK the code tabs run with. It follows
# `main` of the day, and the build fails when `main` doesn't compile against the release's engine. The
# commit it was built from goes to the workflow's later steps as LPDF_JS_COMMIT, for the PR text.
#
# engine-refresh.yml runs it when core publishes a release candidate or a release. To see what it
# does, run it from the root of this repo with gh signed in:
#
#   .github/refresh-engine.sh v0.33.0-rc.8 <checkout of lpdfio/lpdf at that tag, with its history>
set -euo pipefail

tag=${1:?usage: refresh-engine.sh <core tag> <core checkout>}
core=$(cd "${2:?usage: refresh-engine.sh <core tag> <core checkout>}" && pwd)
root=$PWD

if [ "$(git -C "$core" rev-parse HEAD)" != "$(git -C "$core" rev-parse "refs/tags/$tag^{commit}")" ]; then
    echo "::error::$core is not at $tag, so the schema, the examples and the stamp would not be its."
    exit 1
fi

# Where a core build leaves the web files, and where the stamp looks to see that the engine is newer than the code.
# lpdf.js, the glue of the Node build, waits here for lpdf-js's build.
engine=$core/dist/web
mkdir -p "$engine"

downloaded=
for attempt in 1 2 3; do
    gh release download "$tag" --repo lpdfio/lpdf \
        --pattern lpdf.js --pattern lpdf-web.js --pattern lpdf_bg.wasm --pattern SHA256SUMS \
        --dir "$engine" --clobber && downloaded=1 && break
    echo "Attempt $attempt failed, retrying in 10s..."
    sleep 10
done
if [ -z "$downloaded" ]; then
    echo "::error::Could not download the engine of $tag from its release."
    exit 1
fi

# macOS has shasum and no sha256sum.
sha256() { if command -v sha256sum >/dev/null; then sha256sum "$@"; else shasum -a 256 "$@"; fi; }
grep -E ' (lpdf\.js|lpdf-web\.js|lpdf_bg\.wasm)$' "$engine/SHA256SUMS" > "$engine/engine.sums"
if [ "$(wc -l < "$engine/engine.sums")" -ne 3 ]; then
    echo "::error::SHA256SUMS of $tag does not list lpdf.js, lpdf-web.js and lpdf_bg.wasm."
    exit 1
fi
(cd "$engine" && sha256 -c engine.sums)

for dir in ui/demo www/assets/js/lpdf-demo; do
    cp "$engine/lpdf-web.js" "$engine/lpdf_bg.wasm" "$dir/"
done

# lpdf-js `main`, built with the release's engine files in its wasm folder: tsc checks it against them, and
# esbuild bundles dist/browser.js with their glue.
sdk=$(mktemp -d)
trap 'rm -rf "$sdk"' EXIT
git clone --quiet --depth 1 https://github.com/lpdfio/lpdf-js.git "$sdk"
mkdir -p "$sdk/wasm"
cp "$engine/lpdf.js" "$engine/lpdf-web.js" "$engine/lpdf_bg.wasm" "$sdk/wasm/"
(cd "$sdk" && npm ci && npm run build)
for dir in ui/demo www/assets/js/lpdf-demo; do
    cp "$sdk/dist/browser.js" "$dir/"
done

sdk_commit=$(git -C "$sdk" rev-parse --short HEAD)
echo "browser.js: built from lpdf-js $sdk_commit with the engine of $tag."
if [ -n "${GITHUB_ENV:-}" ]; then
    echo "LPDF_JS_COMMIT=$sdk_commit" >> "$GITHUB_ENV"
fi

mkdir -p www/schema/1
cp "$core/schema/lpdf.xsd" www/schema/lpdf.xsd
cp "$core/schema/lpdf.xsd" www/schema/1/lpdf.xsd

# Writes the demo's examples to ui/demo/examples, which the site serves from www/assets/js/lpdf-demo
# as a copy, and the docs' example pages and downloads.
node "$core/scripts/sync-examples.mjs" --pages "$root"
rm -rf www/assets/js/lpdf-demo/examples
cp -R ui/demo/examples www/assets/js/lpdf-demo/examples

# The stamp reads the checkout's tags and history, so it runs there.
(cd "$core" && node scripts/stamp-docs.mjs "$root/docs-site/engine.json")
